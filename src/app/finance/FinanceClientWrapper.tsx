"use client";

import React, { useState } from "react";
import { updateWithdrawalStatus } from "@/app/actions/finance";
import { toast } from "sonner";

export function FinanceClientWrapper({ initialWithdrawals }: { initialWithdrawals: any[] }) {
    const [filterStatus, setFilterStatus] = useState("all");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        let adminNotes = "";
        
        if (newStatus === "rejected") {
            const reason = prompt("Masukkan alasan penolakan (saldo akan dikembalikan ke penjual):");
            if (reason === null) return; // User cancelled
            if (reason.trim() === "") {
                toast.error("Alasan penolakan wajib diisi!");
                return;
            }
            adminNotes = reason;
        } else {
            if (!confirm("Apakah Anda sudah melakukan transfer manual ke rekening penjual dan ingin menandai ini selesai?")) return;
        }

        setIsProcessing(id);
        const result = await updateWithdrawalStatus(id, newStatus, adminNotes);
        
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const filtered = filterStatus === "all" 
        ? initialWithdrawals 
        : initialWithdrawals.filter(w => w.status === filterStatus);

    const totalPendingAmount = initialWithdrawals
        .filter(w => w.status === "pending")
        .reduce((sum, w) => sum + w.amount, 0);

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Menunggu Diproses (Pending)</p>
                    <h3 className="text-2xl font-black text-amber-600">
                        {initialWithdrawals.filter(w => w.status === "pending").length} <span className="text-sm font-normal text-gray-500">Permintaan</span>
                    </h3>
                    <p className="text-sm text-gray-900 mt-2 font-bold">{formatRupiah(totalPendingAmount)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Berhasil Ditransfer (Completed)</p>
                    <h3 className="text-2xl font-black text-green-600">
                        {initialWithdrawals.filter(w => w.status === "completed").length} <span className="text-sm font-normal text-gray-500">Permintaan</span>
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Ditolak / Dikembalikan (Rejected)</p>
                    <h3 className="text-2xl font-black text-red-600">
                        {initialWithdrawals.filter(w => w.status === "rejected").length} <span className="text-sm font-normal text-gray-500">Permintaan</span>
                    </h3>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Daftar Pengajuan Withdrawal</h3>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 outline-none"
                    >
                        <option value="all">Semua Status</option>
                        <option value="pending">Menunggu (Pending)</option>
                        <option value="completed">Selesai (Completed)</option>
                        <option value="rejected">Ditolak (Rejected)</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-bold">Waktu & ID</th>
                                <th className="p-4 font-bold">Informasi Toko</th>
                                <th className="p-4 font-bold">Rekening Tujuan</th>
                                <th className="p-4 font-bold text-right">Nominal</th>
                                <th className="p-4 font-bold text-center">Status</th>
                                <th className="p-4 font-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Tidak ada data penarikan dana.
                                    </td>
                                </tr>
                            ) : filtered.map((w) => (
                                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <p className="text-sm text-gray-900 font-medium">
                                            {new Date(w.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 uppercase">ID: {w.id.substring(w.id.length - 8)}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-gray-900">{w.wallet?.supplier?.companyName || "Unknown Store"}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                            <p className="text-sm font-bold text-blue-800 uppercase">{w.bankName}</p>
                                            <p className="text-sm text-gray-900 font-mono mt-0.5">{w.bankAccount}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">a.n. {w.bankHolder}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <p className="text-sm font-black text-gray-900">{formatRupiah(w.amount)}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        {w.status === "pending" && <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">PENDING</span>}
                                        {w.status === "completed" && <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800">SELESAI</span>}
                                        {w.status === "rejected" && <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800">DITOLAK</span>}
                                        
                                        {w.adminNotes && (
                                            <p className="text-[10px] text-gray-500 mt-1 max-w-[120px] mx-auto truncate" title={w.adminNotes}>
                                                Note: {w.adminNotes}
                                            </p>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {w.status === "pending" ? (
                                            <div className="flex flex-col gap-2 items-end">
                                                <button 
                                                    onClick={() => handleUpdateStatus(w.id, "completed")}
                                                    disabled={isProcessing === w.id}
                                                    className="text-xs font-bold bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors w-28 disabled:opacity-50 shadow-sm"
                                                >
                                                    {isProcessing === w.id ? "Memproses..." : "✓ Selesai"}
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(w.id, "rejected")}
                                                    disabled={isProcessing === w.id}
                                                    className="text-xs font-bold bg-white border border-gray-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors w-28 disabled:opacity-50"
                                                >
                                                    ✗ Tolak
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Sudah Diproses</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
