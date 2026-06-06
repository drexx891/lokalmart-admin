"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPlatformSetting() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        let setting = await prisma.platformSetting.findUnique({
            where: { id: "global" }
        });

        // Auto-create if not exists
        if (!setting) {
            setting = await prisma.platformSetting.create({
                data: {
                    id: "global",
                    commissionPercent: 5.0
                }
            });
        }

        return { success: true, data: setting };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updatePlatformSetting(commissionPercent: number) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    if (commissionPercent < 0 || commissionPercent > 100) {
        return { success: false, message: "Persentase komisi harus antara 0 dan 100" };
    }

    try {
        await prisma.platformSetting.upsert({
            where: { id: "global" },
            update: { commissionPercent },
            create: {
                id: "global",
                commissionPercent
            }
        });

        revalidatePath("/settings");
        return { success: true, message: "Pengaturan platform berhasil diperbarui." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
