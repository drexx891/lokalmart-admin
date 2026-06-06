"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getFlashSales() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const flashSales = await prisma.flashSale.findMany({
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { startTime: 'desc' }
        });
        return { success: true, data: flashSales };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createFlashSale(data: { title: string, startTime: string, endTime: string }) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.flashSale.create({
            data: {
                title: data.title,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                isActive: true
            }
        });
        revalidatePath("/flash-sales");
        return { success: true, message: "Sesi Flash Sale berhasil dibuat!" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteFlashSale(id: string) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.flashSale.delete({ where: { id } });
        revalidatePath("/flash-sales");
        return { success: true, message: "Sesi Flash Sale dihapus" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function addFlashSaleItem(flashSaleId: string, productId: string, discountPrice: number, stock: number) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        // Check if already exists
        const exists = await prisma.flashSaleItem.findUnique({
            where: { flashSaleId_productId: { flashSaleId, productId } }
        });

        if (exists) {
            await prisma.flashSaleItem.update({
                where: { flashSaleId_productId: { flashSaleId, productId } },
                data: { discountPrice: Number(discountPrice), stock: Number(stock) }
            });
        } else {
            await prisma.flashSaleItem.create({
                data: {
                    flashSaleId,
                    productId,
                    discountPrice: Number(discountPrice),
                    stock: Number(stock)
                }
            });
        }
        revalidatePath(`/flash-sales/${flashSaleId}`);
        revalidatePath("/flash-sales");
        return { success: true, message: "Produk berhasil ditambahkan ke Flash Sale!" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function removeFlashSaleItem(itemId: string, flashSaleId: string) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.flashSaleItem.delete({ where: { id: itemId } });
        revalidatePath(`/flash-sales/${flashSaleId}`);
        revalidatePath("/flash-sales");
        return { success: true, message: "Produk dicabut dari Flash Sale" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
