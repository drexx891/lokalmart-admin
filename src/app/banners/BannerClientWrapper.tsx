"use client";

import React, { useState } from "react";
import { uploadBanner, deleteBanner } from "@/app/actions/banners";
import { toast } from "sonner";

export function BannerClientWrapper({ initialBanners }: { initialBanners: any[] }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);

        const formData = new FormData(e.currentTarget);
        const result = await uploadBanner(formData);

        if (result.success) {
            toast.success(result.message);
            // Optionally, reset form
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error(result.message);
        }

        setIsUploading(false);
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm("Yakin ingin menghapus banner ini?")) return;
        const result = await deleteBanner(id, imageUrl);
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
                    <h3 className="font-bold text-gray-900 mb-6">Tambah Banner Baru</h3>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Banner / Campaign</label>
                            <input 
                                type="text" 
                                name="title" 
                                required
                                placeholder="Mis: Promo Kemerdekaan"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target URL (Opsional)</label>
                            <input 
                                type="text" 
                                name="targetUrl" 
                                placeholder="/kategori/elektronik"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Banner</label>
                            <input 
                                type="file" 
                                name="file" 
                                required
                                accept="image/*"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-400 mt-2">Rekomendasi ukuran: 1200x400px (Max 2MB)</p>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isUploading}
                            className="w-full bg-[#1A3C6E] text-white rounded-xl py-3 font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 mt-4"
                        >
                            {isUploading ? "Mengunggah..." : "Unggah Banner"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Daftar Banner Aktif</h3>
                    
                    {initialBanners.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                            Belum ada banner yang ditambahkan.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {initialBanners.map((banner) => (
                                <div key={banner.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-48 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        <img 
                                            src={`http://localhost:3000${banner.imageUrl}`} 
                                            alt={banner.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{banner.title}</h4>
                                            {banner.targetUrl ? (
                                                <p className="text-sm text-blue-600 mt-1">Link: {banner.targetUrl}</p>
                                            ) : (
                                                <p className="text-sm text-gray-400 mt-1">Tidak ada tautan</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleDelete(banner.id, banner.imageUrl)}
                                                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
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
