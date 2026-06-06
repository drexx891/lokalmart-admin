"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await loginAdmin(email, password);

    if (result.success) {
      toast.success("Login berhasil!");
      router.push("/");
    } else {
      toast.error(result.message || "Gagal login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#1A3C6E] p-8 text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">BELIO</h1>
          <p className="text-[#93C5FD] mt-2 font-medium">Super Admin Portal</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full px-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] transition-all text-[#0F172A]"
                placeholder="admin@belio.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Password
              </label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full px-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] transition-all text-[#0F172A]"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1A3C6E] text-white py-3 rounded-xl font-bold hover:bg-[#15305A] transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
