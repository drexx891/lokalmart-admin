import React from "react";
import { getPlatformSetting } from "@/app/actions/settings";
import { SettingsClientWrapper } from "./SettingsClientWrapper";

export default async function SettingsPage() {
    const response = await getPlatformSetting();
    const setting = response.success ? response.data : { commissionPercent: 5.0 };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pengaturan Sistem (Monetisasi)</h1>
                <p className="text-gray-500 mt-1">Konfigurasikan potongan komisi platform, pajak, dan aturan bisnis global lainnya.</p>
            </div>

            <SettingsClientWrapper initialSetting={setting} />
        </div>
    );
}
