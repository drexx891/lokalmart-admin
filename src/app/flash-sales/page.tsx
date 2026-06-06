import React from "react";
import { getFlashSales } from "@/app/actions/flashSales";
import { FlashSaleClientWrapper } from "./FlashSaleClientWrapper";

export default async function FlashSalesPage() {
    const response = await getFlashSales();
    const flashSales = response.success ? response.data : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Flash Sale ⚡</h1>
                <p className="text-gray-500 mt-1">Buat program diskon gila-gilaan berbatas waktu untuk meningkatkan trafik dan konversi penjualan.</p>
            </div>

            <FlashSaleClientWrapper initialFlashSales={flashSales || []} />
        </div>
    );
}
