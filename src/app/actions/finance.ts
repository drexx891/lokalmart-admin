"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getWithdrawalRequests() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const withdrawals = await prisma.withdrawalRequest.findMany({
            include: {
                wallet: {
                    include: {
                        supplier: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: withdrawals };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateWithdrawalStatus(id: string, newStatus: string, adminNotes?: string) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        // Use a transaction to ensure data integrity
        await prisma.$transaction(async (tx) => {
            const request = await tx.withdrawalRequest.findUnique({
                where: { id },
                include: { wallet: true }
            });

            if (!request) throw new Error("Pengajuan tidak ditemukan");
            if (request.status !== "pending") throw new Error("Pengajuan ini sudah diproses sebelumnya");

            // Update status pengajuan
            await tx.withdrawalRequest.update({
                where: { id },
                data: { 
                    status: newStatus,
                    adminNotes: adminNotes || null
                }
            });

            if (newStatus === "rejected") {
                // Jika ditolak, kembalikan saldo ke dompet penjual
                await tx.wallet.update({
                    where: { id: request.walletId },
                    data: {
                        balance: { increment: request.amount }
                    }
                });

                // Catat mutasi pengembalian
                await tx.walletTransaction.create({
                    data: {
                        walletId: request.walletId,
                        amount: request.amount, // Positif karena masuk kembali
                        type: "refund",
                        description: `Pengembalian dana karena penarikan ditolak. Catatan: ${adminNotes || '-'}`,
                        referenceId: request.id
                    }
                });
            } else if (newStatus === "completed") {
                // Jika selesai, kita hanya perlu mencatat mutasinya (saldo sudah dipotong saat status pending)
                // Mutasi keluar sudah harusnya tercatat saat request dibuat di lokalmart, tapi jika belum, kita catat di sini.
                // Asumsi: Saat status pending, lokalmart sudah mencatat WalletTransaction bertipe "withdrawal" (negatif). 
                // Jadi jika completed, kita biarkan saja.
            }
        });

        revalidatePath("/finance");
        return { success: true, message: `Status penarikan berhasil diubah menjadi ${newStatus}.` };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
