import React from "react";
import { getProducts } from "@/app/actions/products";
import { ProductClientWrapper } from "./ProductClientWrapper";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
    const response = await getProducts();
    const products = response.success ? response.data : [];

    const categories = await prisma.category.findMany({ select: { id: true, name: true } });
    const suppliers = await prisma.supplier.findMany({ select: { id: true, companyName: true } });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Moderasi Katalog Produk</h1>
                <p className="text-gray-500 mt-1">Pantau seluruh barang dagangan penjual. Bredel produk melanggar atau bantu perbarui stok mereka secara langsung.</p>
            </div>

            <ProductClientWrapper 
                initialProducts={products || []} 
                categories={categories}
                suppliers={suppliers}
            />
        </div>
    );
}
