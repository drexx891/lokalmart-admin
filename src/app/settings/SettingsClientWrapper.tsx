"use client";

import React, { useState } from "react";
import { updatePlatformSetting } from "@/app/actions/settings";
import { toast } from "sonner";

export function SettingsClientWrapper({ initialSetting }: { initialSetting: any }) {
    const [commissionPercent, setCommissionPercent] = useState<number>(initialSetting?.commissionPercent || 5.0);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (commissionPercent < 0 || commissionPercent > 100) {
            toast.error("Persentase harus berada di antara 0 dan 100");
            return;
        }

        setIsSaving(true);
        const result = await updatePlatformSetting(commissionPercent);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsSaving(false);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-8 max-w-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Model Bisnis: Potongan Komisi</h3>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                <p className="text-sm text-blue-800">
                    <strong>Informasi:</strong> Ini adalah persentase potongan otomatis yang akan ditarik oleh platform dari setiap transaksi pesanan yang diselesaikan (Selesai). Uang sisa akan masuk ke Saldo Dompet penjual.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Persentase Komisi Platform (%)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            step="0.1"
                            min="0"
                            max="100"
                            value={commissionPercent}
                            onChange={(e) => setCommissionPercent(parseFloat(e.target.value))}
                            className="w-48 bg-gray-50 border border-gray-200 text-gray-900 font-black text-2xl rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <span className="text-gray-500 font-medium">Persen (%) dari total pesanan.</span>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3">Simulasi Pendapatan</h4>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600">Nilai Pesanan Pembeli:</span>
                        <span className="font-bold text-gray-900">Rp 100.000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2 border-b border-gray-200 pb-2">
                        <span className="text-red-600">Potongan Aplikasi ({commissionPercent}%):</span>
                        <span className="font-bold text-red-600">- Rp {new Intl.NumberFormat('id-ID').format(100000 * (commissionPercent / 100))}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2">
                        <span className="text-green-600 font-bold">Diterima Penjual:</span>
                        <span className="font-bold text-green-600">Rp {new Intl.NumberFormat('id-ID').format(100000 - (100000 * (commissionPercent / 100)))}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#1A3C6E] text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
