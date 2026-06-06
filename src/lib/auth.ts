import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { AdminRole } from "@prisma/client";

export interface AdminSessionData {
  adminId?: string;
  role?: AdminRole;
  isLoggedIn: boolean;
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error("SECRET_COOKIE_PASSWORD environment variable is required");
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "belio_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  },
};

export async function getAdminSession() {
    const cookieStore = await cookies();
    return getIronSession<AdminSessionData>(cookieStore, sessionOptions);
}

export async function getCurrentAdmin() {
    try {
        const session = await getAdminSession();
        
        if (!session.adminId) {
            return null;
        }

        const adminUser = await prisma.adminUser.findUnique({
            where: { id: session.adminId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true
            }
        });

        if (!adminUser || !adminUser.isActive) {
            return null;
        }

        return adminUser;
    } catch (error) {
        console.error("Gagal membaca admin session", error);
        return null;
    }
}
