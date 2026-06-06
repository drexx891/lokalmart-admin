import React from "react";
import { getOrders } from "@/app/actions/orders";
import { OrderClientWrapper } from "./OrderClientWrapper";

export default async function OrdersPage() {
    const response = await getOrders();
    const orders = response.success ? response.data : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pesanan & Pusat Resolusi</h1>
                <p className="text-gray-500 mt-1">Pantau pergerakan pengiriman barang seluruh toko dan lakukan intervensi jika diperlukan.</p>
            </div>

            <OrderClientWrapper initialOrders={orders || []} />
        </div>
    );
}
