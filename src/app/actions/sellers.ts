"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSellers() {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error("Unauthorized");

    try {
        const sellers = await prisma.supplier.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            // Order by unverified first, then by newest
            orderBy: [
                { verified: 'asc' },
                { id: 'desc' } // Assuming id has some temporal ordering like cuid, but let's just sort by id
            ]
        });
        return { success: true, data: sellers };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function toggleSellerVerification(id: string, currentStatus: boolean) {
    const admin = await getCurrentAdmin();
    if (!admin) return { success: false, message: "Unauthorized" };

    try {
        await prisma.supplier.update({
            where: { id },
            data: { verified: !currentStatus }
        });

        revalidatePath("/sellers");
        return { 
            success: true, 
            message: `Toko berhasil ${!currentStatus ? 'diverifikasi' : 'dicabut verifikasinya'}.` 
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
