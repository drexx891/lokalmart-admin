"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

// Path absolut ke direktori public/uploads milik proyek lokalmart
// Asumsi: admin-panel dan lokalmart berada dalam satu parent directory "New folder"
const LOKALMART_UPLOAD_DIR = path.join(process.cwd(), "..", "lokalmart", "public", "uploads");

export async function getBanners() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const banners = await prisma.banner.findMany({
            orderBy: { position: 'asc' }
        });
        return { success: true, data: banners };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function uploadBanner(formData: FormData) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const targetUrl = formData.get("targetUrl") as string;

        if (!file || !title) {
            return { success: false, message: "File gambar dan judul wajib diisi." };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        try {
            await fs.access(LOKALMART_UPLOAD_DIR);
        } catch {
            await fs.mkdir(LOKALMART_UPLOAD_DIR, { recursive: true });
        }

        const ext = file.name.split('.').pop();
        const fileName = `banner-${Date.now()}.${ext}`;
        const filePath = path.join(LOKALMART_UPLOAD_DIR, fileName);

        await fs.writeFile(filePath, buffer);
        const fileUrl = `/uploads/${fileName}`; // Ini bisa diakses oleh lokalmart dari domainnya sendiri (localhost:3000)

        // Cari urutan posisi tertinggi saat ini
        const lastBanner = await prisma.banner.findFirst({
            orderBy: { position: 'desc' }
        });
        const nextPosition = lastBanner ? lastBanner.position + 1 : 0;

        await prisma.banner.create({
            data: {
                title,
                imageUrl: fileUrl,
                targetUrl: targetUrl || null,
                position: nextPosition
            }
        });

        revalidatePath("/banners");
        return { success: true, message: "Banner berhasil diunggah." };
    } catch (error: any) {
        console.error("Upload Banner Error:", error);
        return { success: false, message: error.message || "Gagal mengunggah banner." };
    }
}

export async function deleteBanner(id: string, imageUrl: string) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.banner.delete({
            where: { id }
        });

        if (imageUrl.startsWith("/uploads/")) {
            const fileName = imageUrl.replace("/uploads/", "");
            const filePath = path.join(LOKALMART_UPLOAD_DIR, fileName);
            try {
                await fs.unlink(filePath);
            } catch (e) {
                console.warn("File gambar tidak ditemukan secara lokal, mungkin sudah terhapus.");
            }
        }

        revalidatePath("/banners");
        return { success: true, message: "Banner berhasil dihapus." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
