import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FlashSaleItemManager } from "./FlashSaleItemManager";

export default async function FlashSaleDetailPage({ params }: { params: { id: string } }) {
    const flashSale = await prisma.flashSale.findUnique({
        where: { id: params.id },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    if (!flashSale) return notFound();

    const products = await prisma.product.findMany({
        where: { status: 'active' },
        select: { id: true, name: true, price: true }
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-6">
                <Link href="/flash-sales" className="text-sm text-blue-600 hover:underline flex items-center gap-1 w-fit mb-4">
                    <span>←</span> Kembali ke Daftar Flash Sale
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{flashSale.title}</h1>
                    {flashSale.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Aktif</span>
                    ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">Non-aktif</span>
                    )}
                </div>
                <p className="text-gray-500 mt-2 text-sm">
                    Periode: {flashSale.startTime.toLocaleString("id-ID")} - {flashSale.endTime.toLocaleString("id-ID")}
                </p>
            </div>

            <FlashSaleItemManager flashSale={flashSale} allProducts={products} />
        </div>
    );
}
