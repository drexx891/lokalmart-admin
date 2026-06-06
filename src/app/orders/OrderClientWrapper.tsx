"use client";

import React, { useState } from "react";
import { forceCancelOrder, forceCompleteOrder } from "@/app/actions/orders";
import { toast } from "sonner";

export function OrderClientWrapper({ initialOrders }: { initialOrders: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleCancel = async (id: string) => {
        const reason = prompt("Masukkan alasan pembatalan paksa (akan dicatat di histori pesanan):");
        if (!reason) return;
        
        setIsProcessing(id);
        const result = await forceCancelOrder(id, reason);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const handleComplete = async (id: string) => {
        if (!confirm("Yakin ingin menyelesaikan pesanan secara paksa? (Uang akan diteruskan ke penjual)")) return;
        
        setIsProcessing(id);
        const result = await forceCompleteOrder(id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    };

    const filteredOrders = initialOrders.filter(o => {
        const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.supplier?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === "all" || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'packed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'pending': return 'Menunggu Konfirmasi';
            case 'packed': return 'Dikemas';
            case 'shipped': return 'Dikirim';
            case 'delivered': return 'Telah Sampai';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                <input 
                    type="text" 
                    placeholder="Cari ID Pesanan, Pembeli, atau Toko..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all min-w-[200px]"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu Konfirmasi</option>
                    <option value="packed">Sedang Dikemas</option>
                    <option value="shipped">Sedang Dikirim</option>
                    <option value="delivered">Telah Sampai (Delivered)</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                </select>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-bold">Detail Pesanan</th>
                            <th className="p-4 font-bold">Pembeli & Pengiriman</th>
                            <th className="p-4 font-bold">Kurir & Resi</th>
                            <th className="p-4 font-bold text-center">Status</th>
                            <th className="p-4 font-bold text-right">Aksi Intervensi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <div className="text-4xl mb-2">📦</div>
                                    <p>Tidak ada data pesanan.</p>
                                </td>
                            </tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <p className="text-xs text-blue-600 font-mono mb-1 uppercase">#{order.id.substring(order.id.length - 8)}</p>
                                    <p className="font-bold text-gray-900">{order.supplier?.companyName || "Unknown Shop"}</p>
                                    <p className="text-sm font-black text-gray-900 mt-1">{formatRupiah(order.totalAmount)}</p>
                                    <p className="text-xs text-gray-500">{order.items?.length || 0} barang</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-bold text-gray-900">{order.user?.name || "Tanpa Nama"}</p>
                                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(order.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </td>
                                <td className="p-4">
                                    {order.shippingMethod ? (
                                        <div className="bg-white p-2 rounded border border-gray-200 shadow-sm inline-block">
                                            <p className="text-xs font-bold text-gray-700 uppercase">{order.courier} - {order.shippingMethod}</p>
                                            <p className="text-sm font-mono text-gray-900 mt-0.5">{order.resiNumber || "Resi belum diinput"}</p>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Belum ada info logistik</span>
                                    )}
                                    {order.trackingHistory && order.trackingHistory.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-2 truncate max-w-[200px]" title={order.trackingHistory[0].description}>
                                            📍 {order.trackingHistory[0].description}
                                        </p>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {order.status === "cancelled" || order.status === "completed" ? (
                                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">Pesanan Ditutup</span>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-end">
                                            {(order.status === "shipped" || order.status === "delivered") && (
                                                <button 
                                                    onClick={() => handleComplete(order.id)}
                                                    disabled={isProcessing === order.id}
                                                    className="text-xs font-bold bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-lg transition-colors w-32 disabled:opacity-50 shadow-sm"
                                                >
                                                    {isProcessing === order.id ? "..." : "✓ Selesaikan Paksa"}
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleCancel(order.id)}
                                                disabled={isProcessing === order.id}
                                                className="text-xs font-bold bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 px-3 py-2 rounded-lg transition-colors w-32 disabled:opacity-50"
                                            >
                                                {isProcessing === order.id ? "..." : "✗ Batalkan Paksa"}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
