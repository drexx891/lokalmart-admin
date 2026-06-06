import React from "react";
import { getBanners } from "@/app/actions/banners";
import { BannerClientWrapper } from "./BannerClientWrapper";

export default async function BannersPage() {
    const response = await getBanners();
    const banners = response.success ? response.data : [];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tampilan Web Utama</h1>
                    <p className="text-gray-500 mt-1">Kelola Banner (Slider Promo) yang akan tampil di halaman depan platform.</p>
                </div>
            </div>

            <BannerClientWrapper initialBanners={banners || []} />
        </div>
    );
}
