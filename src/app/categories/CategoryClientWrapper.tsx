"use client";

import React, { useState } from "react";
import { createCategory, deleteCategory } from "@/app/actions/categories";
import { toast } from "sonner";

export function CategoryClientWrapper({ initialCategories }: { initialCategories: any[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await createCategory(formData);

        if (result.success) {
            toast.success(result.message);
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error(result.message);
        }

        setIsSubmitting(false);
    };

    const handleDelete = async (id: string, imageUrl: string | null) => {
        if (!confirm("Yakin ingin menghapus kategori ini? (Produk yang terhubung akan kehilangan label kategorinya)")) return;
        
        const result = await deleteCategory(id, imageUrl);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                    <h3 className="font-bold text-gray-900 mb-6">Buat Kategori Baru</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="name" 
                                required
                                placeholder="Mis: Pakaian Pria"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                            <p className="text-xs text-gray-400 mt-1">Slug otomatis dibuat: <i>pakaian-pria</i></p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ikon Emoji (Opsional)</label>
                            <input 
                                type="text" 
                                name="icon" 
                                placeholder="👕"
                                maxLength={5}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Cover (Opsional)</label>
                            <input 
                                type="file" 
                                name="file" 
                                accept="image/*"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <textarea 
                                name="description" 
                                rows={3}
                                placeholder="Koleksi pakaian pria terbaik..."
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-[#1A3C6E] text-white rounded-xl py-3 font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 mt-4"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Daftar Kategori Global ({initialCategories.length})</h3>
                    
                    {initialCategories.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            Belum ada kategori yang dibuat.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {initialCategories.map((category) => (
                                <div key={category.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                                    {category.imageUrl && (
                                        <div className="h-24 w-full bg-gray-100 relative">
                                            <img 
                                                src={`http://localhost:3000${category.imageUrl}`} 
                                                alt={category.name} 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        </div>
                                    )}
                                    <div className={`p-4 ${category.imageUrl ? 'relative -mt-8' : ''}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl shadow-sm border border-blue-100 bg-white">
                                                    {category.icon || "📁"}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${category.imageUrl ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>
                                                        {category.name}
                                                    </h4>
                                                    <p className={`text-xs ${category.imageUrl ? 'text-gray-200' : 'text-gray-500'}`}>
                                                        Slug: /{category.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                            <div className="text-sm font-medium text-gray-600">
                                                <span className="text-blue-600 font-bold">{category._count?.products || 0}</span> Produk
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(category.id, category.imageUrl)}
                                                className="text-xs font-bold text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 px-2.5 py-1.5 rounded-lg"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
