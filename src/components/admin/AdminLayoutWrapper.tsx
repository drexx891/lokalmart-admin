"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { logoutAdmin } from "@/app/actions/auth";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <span className="font-bold text-gray-700 text-lg">
                            {pathname === '/' ? 'Dashboard' : pathname.split('/').pop()?.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">Super Admin</p>
                            <p className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded uppercase mt-1">SUPERADMIN</p>
                        </div>
                        
                        <form action={logoutAdmin}>
                            <button type="submit" className="text-sm bg-gray-50 border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-4 py-2 rounded-xl font-bold transition-all">
                                Keluar
                            </button>
                        </form>
                    </div>
                </header>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
