import React from "react";
import { getCategories } from "@/app/actions/categories";
import { CategoryClientWrapper } from "./CategoryClientWrapper";

export default async function CategoriesPage() {
    const response = await getCategories();
    const categories = response.success ? response.data : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Kategori Global</h1>
                <p className="text-gray-500 mt-1">Buat struktur kategori yang baku untuk platform. Toko hanya dapat memilih dari daftar ini.</p>
            </div>

            <CategoryClientWrapper initialCategories={categories || []} />
        </div>
    );
}
