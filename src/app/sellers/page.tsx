import React from "react";
import { getSellers } from "@/app/actions/sellers";
import { SellerClientWrapper } from "./SellerClientWrapper";

export default async function SellersPage() {
    const response = await getSellers();
    const sellers = response.success ? response.data : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Penjual (Toko)</h1>
                <p className="text-gray-500 mt-1">Daftar toko/supplier yang terdaftar di platform. Lakukan verifikasi agar mereka dapat mulai berjualan.</p>
            </div>

            <SellerClientWrapper initialSellers={sellers || []} />
        </div>
    );
}
