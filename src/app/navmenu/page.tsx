"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type NavMenu = {
    id: string;
    title: string;
    iconUrl: string;
    href: string;
    position: number;
    isActive: boolean;
};

export default function NavMenuPage() {
    const [menus, setMenus] = useState<NavMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [href, setHref] = useState("");
    const [position, setPosition] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [presetType, setPresetType] = useState("custom");

    const PRESETS = [
        { id: "custom", label: "-- Kustom (Manual) --", title: "", href: "", iconUrl: "" },
        { id: "b2b", label: "Pusat B2B", title: "Pusat B2B", href: "/unggulan", iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png" },
        { id: "mall", label: "LokalMart Mall", title: "LokalMart Mall", href: "/premium", iconUrl: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png" },
        { id: "ppob", label: "PPOB & Pulsa", title: "PPOB & Pulsa", href: "/ppob", iconUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png" },
        { id: "promo", label: "Flash Sale", title: "Flash Sale", href: "/promo", iconUrl: "https://cdn-icons-png.flaticon.com/512/763/763331.png" },
        { id: "grosir", label: "Grosir Murah", title: "Grosir Murah", href: "/grosir", iconUrl: "https://cdn-icons-png.flaticon.com/512/2760/2760136.png" },
        { id: "daerah", label: "Mitra Daerah", title: "Mitra Daerah", href: "/daerah", iconUrl: "https://cdn-icons-png.flaticon.com/512/2771/2771401.png" },
        { id: "semua-promo", label: "Diskon 50%", title: "Diskon 50%", href: "/semua-promo", iconUrl: "https://cdn-icons-png.flaticon.com/512/2950/2950664.png" },
        { id: "gratis-ongkir", label: "Gratis Ongkir", title: "Gratis Ongkir", href: "/gratis-ongkir", iconUrl: "https://cdn-icons-png.flaticon.com/512/2766/2766141.png" },
        { id: "islami", label: "Lokal Barokah", title: "Lokal Barokah", href: "/islami", iconUrl: "https://cdn-icons-png.flaticon.com/512/3004/3004454.png" },
        { id: "kategori", label: "Semua Kategori", title: "Semua Kategori", href: "/kategori", iconUrl: "https://cdn-icons-png.flaticon.com/512/2311/2311531.png" },
    ];

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setPresetType(val);
        const preset = PRESETS.find(p => p.id === val);
        if (preset && val !== "custom") {
            setTitle(preset.title);
            setHref(preset.href);
            setIconUrl(preset.iconUrl);
        } else if (val === "custom") {
            setTitle("");
            setHref("");
            setIconUrl("");
        }
    };

    const fetchMenus = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/navmenu");
            const data = await res.json();
            if (Array.isArray(data)) {
                setMenus(data);
            }
        } catch (error) {
            console.error("Failed to fetch menus", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const resetForm = () => {
        setId("");
        setTitle("");
        setIconUrl("");
        setHref("");
        setPosition(0);
        setIsActive(true);
        setIsEditing(false);
        setPresetType("custom");
    };

    const handleEdit = (menu: NavMenu) => {
        setId(menu.id);
        setTitle(menu.title);
        setIconUrl(menu.iconUrl);
        setHref(menu.href);
        setPosition(menu.position);
        setIsActive(menu.isActive);
        setIsEditing(true);
        setPresetType("custom");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (deleteId: string) => {
        if (!confirm("Hapus menu ini?")) return;
        try {
            await fetch(`/api/admin/navmenu?id=${deleteId}`, { method: "DELETE" });
            fetchMenus();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { title, iconUrl, href, position: Number(position), isActive };
        
        try {
            if (isEditing) {
                await fetch("/api/admin/navmenu", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, ...payload }),
                });
            } else {
                await fetch("/api/admin/navmenu", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
            resetForm();
            fetchMenus();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan data");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Manajemen Menu Navigasi (Beranda)</h1>

            {/* FORM */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold mb-4">{isEditing ? "Edit Menu" : "Tambah Menu Baru"}</h2>
                
                <div className="mb-6 pb-6 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Templat Cepat (Opsional)</label>
                    <select 
                        value={presetType} 
                        onChange={handlePresetChange}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white"
                        disabled={isEditing}
                    >
                        {PRESETS.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Pilih templat untuk mengisi kolom di bawah secara otomatis.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Teks</label>
                        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Promo Spesial" className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Ikon (Flaticon dll)</label>
                        <input type="url" required value={iconUrl} onChange={e => setIconUrl(e.target.value)} placeholder="https://..." className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Tujuan (Href)</label>
                        <input type="text" required value={href} onChange={e => setHref(e.target.value)} placeholder="Contoh: /promo" className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Urutan (Angka)</label>
                        <input type="number" required value={position} onChange={e => setPosition(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:col-span-2">
                        <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 text-blue-600" />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktif (Tampilkan di Beranda)</label>
                    </div>
                    
                    <div className="md:col-span-2 flex gap-2 mt-2">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                            {isEditing ? "Simpan Perubahan" : "Tambahkan Menu"}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* TABLE LIST */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ikon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul & Href</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Memuat data...</td></tr>
                        ) : menus.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Belum ada menu navigasi</td></tr>
                        ) : menus.map((menu) => (
                            <tr key={menu.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{menu.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-12 h-12 relative bg-gray-100 rounded-lg p-2">
                                        <Image src={menu.iconUrl} alt={menu.title} fill className="object-contain p-1" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">{menu.title}</div>
                                    <div className="text-sm text-gray-500">{menu.href}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${menu.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {menu.isActive ? 'Aktif' : 'Non-aktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(menu)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(menu.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
