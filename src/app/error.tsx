"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 text-center py-20 relative overflow-hidden bg-[#F7F8FA]">
      {/* Subtle glow background */}
      <div className="bg-[#1A3C6E]/5 blur-3xl rounded-full absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-20 h-20 bg-[#EBF2FA] text-[#1A3C6E] rounded-full flex items-center justify-center mb-6 relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>

      <h2 className="text-3xl font-bold text-[#1F2937] mb-4 relative z-10">
        Terjadi Kesalahan Sistem
      </h2>

      <p className="text-[#6B7280] text-lg max-w-md mx-auto mb-10 relative z-10">
        Maaf, kami mengalami kendala teknis saat memproses permintaan Anda. Tim kami akan segera mengabarkan.
      </p>

      <div className="flex gap-4 relative z-10">
        <button
          onClick={() => reset()}
          className="bg-white border-2 border-[#1A3C6E] text-[#1A3C6E] px-8 py-3 rounded-sm font-bold hover:bg-[#EBF2FA] transition-colors"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="bg-[#1A3C6E] text-white px-8 py-3 rounded-sm font-bold hover:bg-[#2A5FA0] transition-colors"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
