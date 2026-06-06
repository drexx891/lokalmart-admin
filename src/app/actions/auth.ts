"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import bcrypt from "bcrypt";
import { logAdminAction } from "@/lib/logger";

export async function loginAdmin(emailRaw: string, passwordRaw: string) {
    try {
        const email = emailRaw?.trim();
        const password = passwordRaw;

        console.log("Login attempt:", { email, passwordLength: password?.length });

        if (!email || !password) {
            return { success: false, message: "Email dan password wajib diisi." };
        }

        const adminUser = await prisma.adminUser.findUnique({
            where: { email }
        });

        if (!adminUser) {
            console.log("Admin not found for email:", email);
            return { success: false, message: "Email atau password salah." };
        }

        if (!adminUser.isActive) {
            return { success: false, message: "Akun ini telah dinonaktifkan." };
        }

        const isValidPassword = await bcrypt.compare(password, adminUser.password);

        if (!isValidPassword) {
            return { success: false, message: "Email atau password salah." };
        }

        // Update last login
        await prisma.adminUser.update({
            where: { id: adminUser.id },
            data: { lastLogin: new Date() }
        });

        const session = await getAdminSession();
        session.adminId = adminUser.id;
        session.role = adminUser.role;
        session.isLoggedIn = true;
        await session.save();

        await logAdminAction({
            adminId: adminUser.id,
            action: "ADMIN_LOGIN",
            ipAddress: "System" // we can't easily get IP in server actions without headers
        });

        return { success: true };
    } catch (error: any) {
        console.error("Login error:", error);
        return { success: false, message: "Terjadi kesalahan sistem." };
    }
}

import { redirect } from "next/navigation";

export async function logoutAdmin() {
    try {
        const session = await getAdminSession();
        
        if (session.adminId) {
            await logAdminAction({
                adminId: session.adminId,
                action: "ADMIN_LOGOUT"
            });
        }
        
        session.destroy();
    } catch (error) {
        // Ignore error
    }
    redirect("/login");
}
