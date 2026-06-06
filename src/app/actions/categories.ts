"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const LOKALMART_UPLOAD_DIR = path.join(process.cwd(), "..", "lokalmart", "public", "uploads");

// Helper function to create slug
function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export async function getCategories() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: categories };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createCategory(formData: FormData) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const icon = formData.get("icon") as string;
        const file = formData.get("file") as File | null;

        if (!name) {
            return { success: false, message: "Nama kategori wajib diisi." };
        }

        const slug = slugify(name);

        // Check if slug already exists
        const existing = await prisma.category.findUnique({
            where: { name }
        });

        if (existing) {
            return { success: false, message: "Kategori dengan nama tersebut sudah ada." };
        }

        let fileUrl = null;

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            
            try {
                await fs.access(LOKALMART_UPLOAD_DIR);
            } catch {
                await fs.mkdir(LOKALMART_UPLOAD_DIR, { recursive: true });
            }

            const ext = file.name.split('.').pop();
            const fileName = `cat-${Date.now()}.${ext}`;
            const filePath = path.join(LOKALMART_UPLOAD_DIR, fileName);

            await fs.writeFile(filePath, buffer);
            fileUrl = `/uploads/${fileName}`;
        }

        await prisma.category.create({
            data: {
                name,
                slug,
                description: description || null,
                icon: icon || null,
                imageUrl: fileUrl
            }
        });

        revalidatePath("/categories");
        return { success: true, message: "Kategori berhasil dibuat." };
    } catch (error: any) {
        console.error("Create Category Error:", error);
        return { success: false, message: error.message || "Gagal membuat kategori." };
    }
}

export async function deleteCategory(id: string, imageUrl: string | null) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.category.delete({
            where: { id }
        });

        if (imageUrl && imageUrl.startsWith("/uploads/")) {
            const fileName = imageUrl.replace("/uploads/", "");
            const filePath = path.join(LOKALMART_UPLOAD_DIR, fileName);
            try {
                await fs.unlink(filePath);
            } catch (e) {
                console.warn("File gambar tidak ditemukan secara lokal, mungkin sudah terhapus.");
            }
        }

        revalidatePath("/categories");
        return { success: true, message: "Kategori berhasil dihapus." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
