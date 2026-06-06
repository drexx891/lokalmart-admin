"use client";

import React, { useState } from "react";
import { createFlashSale, deleteFlashSale } from "@/app/actions/flashSales";
import { toast } from "sonner";

export function FlashSaleClientWrapper({ initialFlashSales }: { initialFlashSales: any[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: "",
        startTime: "",
        endTime: ""
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing('create');
        const result = await createFlashSale(form);
        if (result.success) {
            toast.success(result.message);
            setIsCreating(false);
            setForm({ title: "", startTime: "", endTime: "" });
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus sesi Flash Sale ini?")) return;
        setIsProcessing(id);
        const result = await deleteFlashSale(id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    return (
        <div className="space-y-6">
            {!isCreating && (
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Buat Sesi Flash Sale Baru
                </button>
            )}

            {isCreating && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Setup Sesi Flash Sale</h3>
                        <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">✕ Batal</button>
                    </div>
                    
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Program (Misal: 11.11 Big Sale)</label>
                            <input 
                                required
                                type="text" 
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Waktu Mulai</label>
                                <input 
                                    required
                                    type="datetime-local" 
                                    value={form.startTime}
                                    onChange={e => setForm({...form, startTime: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Waktu Selesai</label>
                                <input 
                                    required
                                    type="datetime-local" 
                                    value={form.endTime}
                                    onChange={e => setForm({...form, endTime: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={isProcessing === 'create'}
                                className="bg-yellow-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                            >
                                {isProcessing === 'create' ? "Menyimpan..." : "Simpan Sesi Flash Sale"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-bold">Nama Event</th>
                            <th className="p-4 font-bold">Waktu Mulai</th>
                            <th className="p-4 font-bold">Waktu Selesai</th>
                            <th className="p-4 font-bold text-center">Status</th>
                            <th className="p-4 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {initialFlashSales.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <div className="text-4xl mb-2">⚡</div>
                                    <p>Belum ada program Flash Sale.</p>
                                </td>
                            </tr>
                        ) : initialFlashSales.map((fs) => {
                            const now = new Date();
                            const start = new Date(fs.startTime);
                            const end = new Date(fs.endTime);
                            let status = "Akan Datang";
                            let color = "bg-blue-100 text-blue-700 border-blue-200";
                            
                            if (now > end) {
                                status = "Selesai";
                                color = "bg-gray-100 text-gray-700 border-gray-200";
                            } else if (now >= start && now <= end) {
                                status = "Sedang Berjalan";
                                color = "bg-green-100 text-green-700 border-green-200 animate-pulse";
                            }

                            return (
                                <tr key={fs.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900">{fs.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{fs.items?.length || 0} Produk Terdaftar</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-gray-900">{start.toLocaleString('id-ID')}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-gray-900">{end.toLocaleString('id-ID')}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${color}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex gap-2 justify-end">
                                        <a 
                                            href={`/flash-sales/${fs.id}`}
                                            className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-200 inline-block"
                                        >
                                            Kelola Produk
                                        </a>
                                        <button 
                                            onClick={() => handleDelete(fs.id)}
                                            disabled={isProcessing === fs.id}
                                            className="text-[11px] font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200 disabled:opacity-50"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
