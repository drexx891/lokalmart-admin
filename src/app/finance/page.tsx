import React from "react";
import { getWithdrawalRequests } from "@/app/actions/finance";
import { FinanceClientWrapper } from "./FinanceClientWrapper";

export default async function FinancePage() {
    const response = await getWithdrawalRequests();
    const withdrawals = response.success ? response.data : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Keuangan & Pencairan Dana</h1>
                <p className="text-gray-500 mt-1">Kelola permohonan penarikan dana (Withdrawal) dari dompet para penjual ke rekening bank mereka.</p>
            </div>

            <FinanceClientWrapper initialWithdrawals={withdrawals || []} />
        </div>
    );
}
