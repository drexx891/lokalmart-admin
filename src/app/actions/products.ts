"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const products = await prisma.product.findMany({
            include: {
                supplier: {
                    select: { companyName: true }
                },
                category: {
                    select: { name: true }
                },
                variants: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: products };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateProductStatus(id: string, status: string) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.product.update({
            where: { id },
            data: { status }
        });

        revalidatePath("/products");
        return { success: true, message: `Status produk berhasil diubah menjadi ${status}` };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function quickEditProduct(id: string, data: { stock: number, price: number }) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.product.update({
            where: { id },
            data: { 
                stock: data.stock,
                price: data.price
            }
        });

        revalidatePath("/products");
        return { success: true, message: "Data produk (Harga/Stok) berhasil diperbarui" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createProduct(data: any) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                stock: Number(data.stock),
                categoryId: data.categoryId || null,
                supplierId: data.supplierId || null,
                imageUrl: data.imageUrl || null,
                status: "active",
                variants: data.variants && data.variants.length > 0 ? {
                    create: data.variants.map((v: any) => ({
                        name: v.name || `${v.color || ''} ${v.size || ''}`.trim(),
                        sku: v.sku || null,
                        price: v.price ? Number(v.price) : null,
                        stock: Number(v.stock),
                        size: v.size || null,
                        color: v.color || null
                    }))
                } : undefined
            }
        });

        revalidatePath("/products");
        return { success: true, message: "Produk baru berhasil ditambahkan!" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function toggleSponsored(id: string, isSponsored: boolean) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.product.update({
            where: { id },
            data: { isSponsored }
        });

        revalidatePath("/products");
        return { success: true, message: isSponsored ? "Produk berhasil dijadikan Iklan Sponsor 🌟" : "Status Iklan Sponsor dicabut" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
