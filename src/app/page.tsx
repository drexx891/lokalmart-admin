import { getCurrentAdmin } from "@/lib/auth";
import { logoutAdmin } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { getDashboardStats, getRecentTransactions } from "@/app/actions/dashboard";
import StatCard from "@/components/admin/StatCard";
import SalesChart from "@/components/admin/SalesChart";
import RecentTransactions from "@/components/admin/RecentTransactions";

export default async function AdminDashboard() {
    const admin = await getCurrentAdmin();

    if (!admin) {
        redirect("/login");
    }

    const [statsResponse, recentResponse] = await Promise.all([
        getDashboardStats(),
        getRecentTransactions()
    ]);

    const stats = statsResponse.success ? statsResponse.data : null;
    const recentTx = recentResponse.success ? recentResponse.data : [];

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="flex flex-col font-sans text-gray-900 w-full">
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                            <p className="text-gray-500 mt-1">Pantau seluruh aktivitas platform Belio secara real-time.</p>
                        </div>
                        <div className="text-sm text-gray-400 font-medium bg-white px-4 py-2 rounded-lg border">
                            Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                        </div>
                    </div>

                    {!stats ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium">
                            Gagal memuat data statistik.
                        </div>
                    ) : (
                        <>
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard 
                                    title="Total GMV" 
                                    value={formatRupiah(stats.totalGMV)} 
                                    description="Nilai kotor transaksi berhasil"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />
                                <StatCard 
                                    title="Total Transaksi" 
                                    value={stats.totalTransactions.toLocaleString('id-ID')} 
                                    description="Pesanan yang berhasil dibayar"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    }
                                />
                                <StatCard 
                                    title="Total Pengguna" 
                                    value={stats.totalUsers.toLocaleString('id-ID')} 
                                    description="Pembeli terdaftar"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    }
                                />
                                <StatCard 
                                    title="Total Penjual" 
                                    value={stats.totalSellers.toLocaleString('id-ID')} 
                                    description="Toko (Supplier) terdaftar"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    }
                                />
                            </div>

                            {/* Charts & Tables */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-900">Grafik GMV (6 Bulan Terakhir)</h3>
                                        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Tahun Ini</option>
                                        </select>
                                    </div>
                                    <SalesChart data={stats.monthlyData} />
                                </div>
                                
                                <div className="lg:col-span-1">
                                    <RecentTransactions transactions={recentTx || []} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}