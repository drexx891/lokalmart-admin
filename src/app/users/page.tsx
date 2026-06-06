import React from "react";
import { getUsers } from "@/app/actions/users";
import { UserClientWrapper } from "./UserClientWrapper";

export default async function UsersPage() {
    const response = await getUsers();
    const users = response.success ? response.data : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Pembeli</h1>
                <p className="text-gray-500 mt-1">Daftar pengguna terdaftar sebagai pembeli (Buyer). Anda dapat membekukan akun yang bermasalah.</p>
            </div>

            <UserClientWrapper initialUsers={users || []} />
        </div>
    );
}
