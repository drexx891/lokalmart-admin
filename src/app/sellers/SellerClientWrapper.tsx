"use client";

import React, { useState } from "react";
import { toggleSellerVerification } from "@/app/actions/sellers";
import { toast } from "sonner";

export function SellerClientWrapper({ initialSellers }: { initialSellers: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleToggleVerification = async (id: string, currentStatus: boolean) => {
        const actionText = currentStatus ? "Mencabut Verifikasi" : "Memverifikasi";
        if (!confirm(`Yakin ingin ${actionText} toko ini?`)) return;
        
        const result = await toggleSellerVerification(id, currentStatus);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const filteredSellers = initialSellers.filter(s => 
        (s.companyName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (s.user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (s.city?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <input 
                    type="text" 
                    placeholder="Cari nama toko, kota, atau email pemilik..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Total: {filteredSellers.length} Toko
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-bold">Informasi Toko</th>
                            <th className="p-4 font-bold">Lokasi</th>
                            <th className="p-4 font-bold">Pemilik / Kontak</th>
                            <th className="p-4 font-bold">Status KYC</th>
                            <th className="p-4 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredSellers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Tidak ada data toko yang ditemukan.
                                </td>
                            </tr>
                        ) : filteredSellers.map((seller) => (
                            <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                            {seller.companyName ? seller.companyName.charAt(0).toUpperCase() : 'T'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{seller.companyName}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{seller.description || "Belum ada deskripsi"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm text-gray-900">{seller.city || "-"}</p>
                                    <p className="text-sm text-gray-500">{seller.province || "-"}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm text-gray-900 font-medium">{seller.user?.name || "Tanpa Nama"}</p>
                                    <p className="text-sm text-gray-500">{seller.user?.email}</p>
                                    <p className="text-sm text-gray-500">{seller.user?.phone}</p>
                                </td>
                                <td className="p-4">
                                    {seller.verified ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                            ✓ Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                            ⌛ Pending KYC
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleToggleVerification(seller.id, seller.verified)}
                                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors border ${
                                            seller.verified 
                                            ? "bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200" 
                                            : "bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 shadow-sm"
                                        }`}
                                    >
                                        {seller.verified ? "Cabut Verifikasi" : "Verifikasi Toko"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
