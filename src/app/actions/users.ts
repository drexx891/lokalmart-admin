"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const users = await prisma.user.findMany({
            where: { role: "user" },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: users };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function toggleUserSuspend(id: string, currentStatus: boolean) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id },
            data: { isSuspended: !currentStatus }
        });

        revalidatePath("/users");
        return { 
            success: true, 
            message: `Akun berhasil ${!currentStatus ? 'dibekukan' : 'diaktifkan kembali'}.` 
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
