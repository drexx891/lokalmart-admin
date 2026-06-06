"use client";

import React, { useState } from "react";
import { toggleUserSuspend } from "@/app/actions/users";
import { toast } from "sonner";

export function UserClientWrapper({ initialUsers }: { initialUsers: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleToggleSuspend = async (id: string, currentStatus: boolean) => {
        const actionText = currentStatus ? "mengaktifkan kembali" : "membekukan";
        if (!confirm(`Yakin ingin ${actionText} akun ini?`)) return;
        
        const result = await toggleUserSuspend(id, currentStatus);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const filteredUsers = initialUsers.filter(u => 
        (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <input 
                    type="text" 
                    placeholder="Cari nama atau email pembeli..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Total: {filteredUsers.length}
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-bold">Info Pengguna</th>
                            <th className="p-4 font-bold">Gender & Telp</th>
                            <th className="p-4 font-bold">Tanggal Daftar</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Tidak ada pengguna yang ditemukan.
                                </td>
                            </tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name || "Tanpa Nama"}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm text-gray-900 capitalize">{user.gender || "-"}</p>
                                    <p className="text-sm text-gray-500">{user.phone || "-"}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </td>
                                <td className="p-4">
                                    {user.isSuspended ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Dibekukan
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Aktif
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleToggleSuspend(user.id, user.isSuspended)}
                                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                                            user.isSuspended 
                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                                            : "bg-red-50 text-red-600 hover:bg-red-100"
                                        }`}
                                    >
                                        {user.isSuspended ? "Aktifkan Akun" : "Suspend Akun"}
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
