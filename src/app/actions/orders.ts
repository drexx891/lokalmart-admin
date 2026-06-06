"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOrders() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                },
                supplier: {
                    select: { companyName: true }
                },
                items: true,
                trackingHistory: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: orders };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function forceCancelOrder(id: string, reason: string) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({ where: { id } });
            if (!order) throw new Error("Order tidak ditemukan");
            if (order.status === "completed" || order.status === "cancelled") {
                throw new Error(`Tidak bisa membatalkan order dengan status ${order.status}`);
            }

            // Update order status
            await tx.order.update({
                where: { id },
                data: { status: "cancelled" }
            });

            // Add tracking history for transparency
            await tx.orderTracking.create({
                data: {
                    orderId: id,
                    status: "cancelled",
                    description: `Dibatalkan paksa oleh Admin. Alasan: ${reason}`
                }
            });

            // Note: If payment has been made, refund logic should ideally be here.
            // For now, we assume the system flags it for manual refund or it handles it elsewhere.
        });

        revalidatePath("/orders");
        return { success: true, message: "Pesanan berhasil dibatalkan." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function forceCompleteOrder(id: string) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({ where: { id } });
            if (!order) throw new Error("Order tidak ditemukan");
            if (order.status === "completed" || order.status === "cancelled") {
                throw new Error(`Tidak bisa menyelesaikan order dengan status ${order.status}`);
            }

            // Update order status
            await tx.order.update({
                where: { id },
                data: { status: "completed" }
            });

            // Add tracking history
            await tx.orderTracking.create({
                data: {
                    orderId: id,
                    status: "completed",
                    description: `Diselesaikan paksa oleh Admin (Resolusi).`
                }
            });

            // Pencairan dana (transfer dari sistem ke Wallet penjual) dengan pemotongan komisi
            if (order.supplierId) {
                // Ambil persentase komisi
                let setting = await tx.platformSetting.findUnique({ where: { id: "global" } });
                const commissionPercent = setting ? setting.commissionPercent : 5.0; // Default 5%

                const grossAmount = order.totalAmount;
                const platformFee = Math.round(grossAmount * (commissionPercent / 100));
                const netAmount = grossAmount - platformFee;

                // Find or create wallet for supplier
                const wallet = await tx.wallet.upsert({
                    where: { supplierId: order.supplierId },
                    update: { balance: { increment: netAmount } },
                    create: { supplierId: order.supplierId, balance: netAmount }
                });

                // Mutasi pendapatan kotor
                await tx.walletTransaction.create({
                    data: {
                        walletId: wallet.id,
                        amount: grossAmount,
                        type: "order_revenue",
                        description: `Pendapatan kotor dari pesanan ${id}`,
                        referenceId: id
                    }
                });

                // Mutasi potongan komisi
                if (platformFee > 0) {
                    await tx.walletTransaction.create({
                        data: {
                            walletId: wallet.id,
                            amount: -platformFee,
                            type: "platform_fee",
                            description: `Potongan layanan platform (${commissionPercent}%) untuk pesanan ${id}`,
                            referenceId: id
                        }
                    });
                }
            }
        });

        revalidatePath("/orders");
        return { success: true, message: "Pesanan ditandai selesai dan dana diteruskan ke penjual." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
