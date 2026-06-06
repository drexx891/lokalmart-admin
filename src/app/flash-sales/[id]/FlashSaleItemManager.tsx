"use client";

import React, { useState } from "react";
import { addFlashSaleItem, removeFlashSaleItem } from "@/app/actions/flashSales";
import { toast } from "sonner";

export function FlashSaleItemManager({ flashSale, allProducts }: { flashSale: any, allProducts: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [stock, setStock] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId || !discountPrice || !stock) {
            toast.error("Pilih produk dan isi harga diskon serta stok.");
            return;
        }

        setIsProcessing(true);
        const result = await addFlashSaleItem(flashSale.id, selectedProductId, Number(discountPrice), Number(stock));
        if (result.success) {
            toast.success(result.message);
            setSelectedProductId("");
            setDiscountPrice("");
            setStock("");
            setSearchTerm("");
        } else {
            toast.error(result.message);
        }
        setIsProcessing(false);
    };

    const handleRemove = async (itemId: string) => {
        if (!confirm("Yakin ingin mencabut produk ini dari Flash Sale?")) return;
        
        setIsProcessing(true);
        const result = await removeFlashSaleItem(itemId, flashSale.id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsProcessing(false);
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    };

    const selectedProduct = allProducts.find(p => p.id === selectedProductId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-lg mb-4">Tambah Produk ke Flash Sale</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Cari Produk</label>
                            <input 
                                type="text" 
                                placeholder="Ketik nama produk..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            />
                            
                            {searchTerm && (
                                <div className="max-h-48 overflow-y-auto border rounded-lg bg-white shadow-sm divide-y">
                                    {allProducts
                                        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !flashSale.items.find((i:any) => i.productId === p.id))
                                        .slice(0, 10)
                                        .map(p => (
                                        <div 
                                            key={p.id} 
                                            onClick={() => { setSelectedProductId(p.id); setSearchTerm(p.name); }}
                                            className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${selectedProductId === p.id ? 'bg-blue-100 font-bold' : ''}`}
                                        >
                                            <p className="text-sm line-clamp-1">{p.name}</p>
                                            <p className="text-xs text-gray-500">Normal: {formatRupiah(p.price)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedProduct && (
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <p className="text-xs text-blue-800 font-bold mb-1">Produk Terpilih:</p>
                                <p className="text-sm font-medium text-gray-900">{selectedProduct.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Harga Normal: <span className="line-through">{formatRupiah(selectedProduct.price)}</span></p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Harga Diskon Flash Sale (Rp)</label>
                            <input 
                                required 
                                type="number" 
                                min="0" 
                                value={discountPrice} 
                                onChange={e => setDiscountPrice(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Batas Stok Promosi (Pieces)</label>
                            <input 
                                required 
                                type="number" 
                                min="1" 
                                value={stock} 
                                onChange={e => setStock(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button disabled={isProcessing || !selectedProductId} type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {isProcessing ? "Menyimpan..." : "Tambahkan ke Flash Sale"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-lg">Daftar Produk di Flash Sale Ini</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{flashSale.items.length} Produk</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                    <th className="p-4 font-bold">Produk</th>
                                    <th className="p-4 font-bold">Harga & Diskon</th>
                                    <th className="p-4 font-bold">Stok Promosi</th>
                                    <th className="p-4 font-bold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {flashSale.items.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-500">
                                            <div className="text-4xl mb-2">👻</div>
                                            <p>Belum ada produk di Flash Sale ini.</p>
                                        </td>
                                    </tr>
                                ) : flashSale.items.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 border">
                                                    {item.product.imageUrl && <img src={item.product.imageUrl} className="w-full h-full object-cover" />}
                                                </div>
                                                <p className="font-bold text-gray-900 text-sm line-clamp-2">{item.product.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-gray-400 line-through">{formatRupiah(item.product.price)}</p>
                                            <p className="text-sm font-black text-red-600">{formatRupiah(item.discountPrice)}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-bold">{item.stock} <span className="text-xs font-normal text-gray-500">pcs</span></p>
                                            <p className="text-xs text-gray-500">Terjual: {item.sold}</p>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleRemove(item.id)}
                                                disabled={isProcessing}
                                                className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                Cabut
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
