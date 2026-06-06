"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function getDashboardStats() {
    const admin = await getCurrentAdmin();
    if (!admin) {
        throw new Error("Unauthorized");
    }

    try {
        // 1. Total GMV (Gross Merchandise Value) dari transaksi berstatus "paid"
        const paidInvoices = await prisma.orderInvoice.aggregate({
            where: { status: "paid" },
            _sum: { totalAmount: true },
            _count: { id: true }
        });

        const totalGMV = paidInvoices._sum.totalAmount || 0;
        const totalTransactions = paidInvoices._count.id;

        // 2. Total Pengguna & Penjual
        const totalUsers = await prisma.user.count({
            where: { role: "user" }
        });

        const totalSellers = await prisma.supplier.count();

        // 3. Data Grafik Penjualan Bulanan (6 bulan terakhir)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const recentInvoices = await prisma.orderInvoice.findMany({
            where: {
                status: "paid",
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                totalAmount: true,
                createdAt: true,
            }
        });

        const monthlyData = Array(6).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return {
                name: d.toLocaleString('id-ID', { month: 'short' }),
                total: 0,
                monthIndex: d.getMonth(),
                year: d.getFullYear()
            };
        });

        for (const invoice of recentInvoices) {
            const date = new Date(invoice.createdAt);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();

            const dataPoint = monthlyData.find(d => d.monthIndex === monthIdx && d.year === year);
            if (dataPoint) {
                dataPoint.total += invoice.totalAmount;
            }
        }

        return {
            success: true,
            data: {
                totalGMV,
                totalTransactions,
                totalUsers,
                totalSellers,
                monthlyData
            }
        };

    } catch (error: any) {
        console.error("Dashboard Stats Error:", error);
        return { success: false, message: error.message };
    }
}

export async function getRecentTransactions() {
    const admin = await getCurrentAdmin();
    if (!admin) {
        throw new Error("Unauthorized");
    }

    try {
        const invoices = await prisma.orderInvoice.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } }
            }
        });

        return { success: true, data: invoices };
    } catch (error: any) {
        console.error("Recent Transactions Error:", error);
        return { success: false, message: error.message };
    }
}
