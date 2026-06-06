import React from "react";

export default function RecentTransactions({ transactions }: { transactions: any[] }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Transaksi Terbaru</h3>
                <div className="text-center py-8 text-gray-500">Belum ada transaksi.</div>
            </div>
        );
    }

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <h3 className="font-bold text-gray-900 mb-6">Transaksi Terbaru</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y">
                        <tr>
                            <th className="px-4 py-3">ID Pesanan</th>
                            <th className="px-4 py-3">Pelanggan</th>
                            <th className="px-4 py-3">Tanggal</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((trx) => (
                            <tr key={trx.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-blue-600">
                                    #{trx.id.substring(trx.id.length - 8).toUpperCase()}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900">{trx.user?.name || "User"}</p>
                                    <p className="text-xs text-gray-500">{trx.user?.email}</p>
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {new Date(trx.createdAt).toLocaleDateString("id-ID", { 
                                        day: "numeric", month: "short", year: "numeric",
                                        hour: "2-digit", minute: "2-digit"
                                    })}
                                </td>
                                <td className="px-4 py-3 font-bold text-gray-900">
                                    {formatRupiah(trx.totalAmount)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                                        trx.status === "paid" ? "bg-green-100 text-green-700" :
                                        trx.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        trx.status === "cancelled" ? "bg-red-100 text-red-700" :
                                        "bg-gray-100 text-gray-700"
                                    }`}>
                                        {trx.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
