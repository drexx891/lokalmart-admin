"use client";

import React, { useState } from "react";
import { updateProductStatus, quickEditProduct, createProduct, toggleSponsored } from "@/app/actions/products";
import { toast } from "sonner";

export function ProductClientWrapper({ initialProducts, categories, suppliers }: { initialProducts: any[], categories: any[], suppliers: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    // Create State
    const [isCreating, setIsCreating] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: "", description: "", price: 0, stock: 0, categoryId: "", supplierId: "", imageUrl: "",
        variants: [] as { size: string, color: string, stock: number, price: number }[]
    });

    // Quick Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ stock: 0, price: 0 });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing("create");
        const result = await createProduct(createForm);
        if (result.success) {
            toast.success(result.message);
            setIsCreating(false);
            setCreateForm({ name: "", description: "", price: 0, stock: 0, categoryId: "", supplierId: "", imageUrl: "", variants: [] });
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const handleSponsor = async (id: string, isSponsored: boolean) => {
        setIsProcessing(id);
        const result = await toggleSponsored(id, isSponsored);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        const actionName = newStatus === 'rejected' ? 'Bredel (Takedown)' : newStatus === 'active' ? 'Aktifkan' : 'Sembunyikan';
        if (!confirm(`Yakin ingin melakukan ${actionName} pada produk ini?`)) return;
        
        setIsProcessing(id);
        const result = await updateProductStatus(id, newStatus);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const startEditing = (product: any) => {
        setEditingId(product.id);
        setEditForm({ stock: product.stock, price: product.price });
    };

    const saveEdit = async (id: string) => {
        setIsProcessing(id);
        const result = await quickEditProduct(id, editForm);
        if (result.success) {
            toast.success(result.message);
            setEditingId(null);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(null);
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    };

    const filteredProducts = initialProducts.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.supplier?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === "all" || p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'active': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold border border-green-200">Aktif</span>;
            case 'inactive': return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold border border-gray-200">Sembunyi</span>;
            case 'pending_review': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold border border-yellow-200">Review</span>;
            case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">Dibredel</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            {!isCreating && (
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Tambah Produk Manual
                </button>
            )}

            {isCreating && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Tambah Produk Manual</h3>
                        <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">✕ Batal</button>
                    </div>
                    
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
                                <input required type="text" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">URL Gambar (Opsional)</label>
                                <input type="text" value={createForm.imageUrl} onChange={e => setCreateForm({...createForm, imageUrl: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                                <select required value={createForm.categoryId} onChange={e => setCreateForm({...createForm, categoryId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Toko (Pemilik)</label>
                                <select required value={createForm.supplierId} onChange={e => setCreateForm({...createForm, supplierId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="" disabled>Pilih Toko</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.companyName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rp)</label>
                                <input required type="number" min="0" value={createForm.price} onChange={e => setCreateForm({...createForm, price: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Stok (Pieces)</label>
                                <input required type="number" min="0" value={createForm.stock} onChange={e => setCreateForm({...createForm, stock: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900">Varian Produk (Opsional)</h4>
                                    <p className="text-xs text-gray-500">Tambahkan ukuran atau warna khusus beserta stoknya masing-masing.</p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setCreateForm({...createForm, variants: [...createForm.variants, { size: '', color: '', stock: 0, price: 0 }]})}
                                    className="bg-white border border-gray-300 text-gray-700 font-bold py-1.5 px-3 rounded text-xs hover:bg-gray-50"
                                >
                                    + Tambah Varian
                                </button>
                            </div>
                            
                            {createForm.variants.length > 0 && (
                                <div className="space-y-3">
                                    {createForm.variants.map((v, i) => (
                                        <div key={i} className="flex gap-2 items-start bg-white p-3 border border-gray-200 rounded">
                                            <div className="flex-1">
                                                <input placeholder="Ukuran (S/M/L)" value={v.size} onChange={e => { const newV = [...createForm.variants]; newV[i].size = e.target.value; setCreateForm({...createForm, variants: newV}) }} className="w-full bg-gray-50 border border-gray-200 text-sm rounded px-3 py-1.5 outline-none mb-2" />
                                                <input placeholder="Warna (Merah/Biru)" value={v.color} onChange={e => { const newV = [...createForm.variants]; newV[i].color = e.target.value; setCreateForm({...createForm, variants: newV}) }} className="w-full bg-gray-50 border border-gray-200 text-sm rounded px-3 py-1.5 outline-none" />
                                            </div>
                                            <div className="flex-1">
                                                <input type="number" placeholder="Stok Varian" value={v.stock} onChange={e => { const newV = [...createForm.variants]; newV[i].stock = Number(e.target.value); setCreateForm({...createForm, variants: newV}) }} className="w-full bg-gray-50 border border-gray-200 text-sm rounded px-3 py-1.5 outline-none mb-2" />
                                                <input type="number" placeholder="Harga Khusus (Kosongkan jika sama)" value={v.price || ''} onChange={e => { const newV = [...createForm.variants]; newV[i].price = Number(e.target.value); setCreateForm({...createForm, variants: newV}) }} className="w-full bg-gray-50 border border-gray-200 text-sm rounded px-3 py-1.5 outline-none" />
                                            </div>
                                            <button type="button" onClick={() => { const newV = [...createForm.variants]; newV.splice(i, 1); setCreateForm({...createForm, variants: newV}) }} className="text-red-500 hover:text-red-700 font-bold px-2 py-1">X</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Produk</label>
                            <textarea required rows={3} value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="pt-2">
                            <button disabled={isProcessing === 'create'} type="submit" className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {isProcessing === 'create' ? "Menyimpan..." : "Simpan Produk"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <input 
                        type="text" 
                        placeholder="Cari nama produk atau nama toko..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all min-w-[200px]"
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif Tayang</option>
                        <option value="inactive">Sembunyi (Draft)</option>
                        <option value="pending_review">Menunggu Review</option>
                        <option value="rejected">Dibredel (Takedown)</option>
                    </select>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-bold">Informasi Produk</th>
                                <th className="p-4 font-bold">Harga & Stok</th>
                                <th className="p-4 font-bold">Sponsor Ads</th>
                                <th className="p-4 font-bold text-center">Status</th>
                                <th className="p-4 font-bold text-right">Moderasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-500">
                                        <div className="text-4xl mb-2">🛍️</div>
                                        <p>Tidak ada produk ditemukan.</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative">
                                                {p.isSponsored && (
                                                    <div className="absolute top-0 right-0 bg-yellow-400 text-[8px] font-bold px-1 rounded-bl shadow">AD</div>
                                                )}
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 line-clamp-1 flex items-center gap-1" title={p.name}>
                                                    {p.name}
                                                    {p.isSponsored && <span className="text-yellow-500 text-sm" title="Sponsored">🌟</span>}
                                                </p>
                                                <p className="text-xs text-blue-600 font-medium mt-0.5 flex gap-1">
                                                    <span className="text-gray-500">Toko:</span> {p.supplier?.companyName}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{p.category?.name || "Tanpa Kategori"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="p-4">
                                        {editingId === p.id ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 w-12">Rp</span>
                                                    <input 
                                                        type="number" 
                                                        value={editForm.price} 
                                                        onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                                                        className="w-24 text-sm border p-1 rounded"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 w-12">Stok</span>
                                                    <input 
                                                        type="number" 
                                                        value={editForm.stock} 
                                                        onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})}
                                                        className="w-24 text-sm border p-1 rounded"
                                                    />
                                                </div>
                                                <div className="flex gap-1 mt-1">
                                                    <button onClick={() => saveEdit(p.id)} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded">Simpan</button>
                                                    <button onClick={() => setEditingId(null)} className="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded">Batal</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{formatRupiah(p.price)}</p>
                                                <p className="text-xs text-gray-600 mt-1">Stok Utama: <span className="font-bold">{p.stock}</span> {p.unit}</p>
                                                {p.variants?.length > 0 && (
                                                    <p className="text-[10px] text-blue-600 font-bold bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">
                                                        +{p.variants.length} Varian
                                                    </p>
                                                )}
                                                <br/>
                                                <button 
                                                    onClick={() => startEditing(p)}
                                                    className="text-[10px] text-blue-600 hover:underline mt-1"
                                                >
                                                    ✏️ Quick Edit
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        {p.isSponsored ? (
                                            <button 
                                                onClick={() => handleSponsor(p.id, false)}
                                                disabled={isProcessing === p.id}
                                                className="text-xs font-bold px-3 py-1.5 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-colors w-full"
                                            >
                                                🌟 Bersponsor
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleSponsor(p.id, true)}
                                                disabled={isProcessing === p.id}
                                                className="text-xs font-bold px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors w-full"
                                            >
                                                Tawarkan Sponsor
                                            </button>
                                        )}
                                    </td>
                                    
                                    <td className="p-4 text-center">
                                        {getStatusBadge(p.status)}
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="flex flex-col gap-1.5 items-end">
                                            {p.status === 'rejected' ? (
                                                <button 
                                                    onClick={() => handleStatusChange(p.id, 'active')}
                                                    disabled={isProcessing === p.id}
                                                    className="text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors w-28 text-center disabled:opacity-50"
                                                >
                                                    Pulihkan (Aktif)
                                                </button>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => handleStatusChange(p.id, 'inactive')}
                                                        disabled={isProcessing === p.id}
                                                        className="text-[11px] font-bold bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors w-28 text-center disabled:opacity-50"
                                                    >
                                                        Sembunyikan
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusChange(p.id, 'rejected')}
                                                        disabled={isProcessing === p.id}
                                                        className="text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors w-28 text-center disabled:opacity-50"
                                                    >
                                                        Bredel (Hapus)
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
