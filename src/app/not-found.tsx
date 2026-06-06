import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 text-center py-20 relative overflow-hidden">
            {/* Subtle glow background */}
            <div className="bg-[#1A3C6E]/5 blur-3xl rounded-full absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <h1 className="text-9xl font-black text-[#1A3C6E] mb-6 relative z-10 opacity-80">
                404
            </h1>
            
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4 relative z-10">
                Halaman Tidak Ditemukan
            </h2>
            
            <p className="text-[#6B7280] text-lg max-w-md mx-auto mb-10 relative z-10">
                Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            </p>

            <Link 
                href="/" 
                className="bg-[#1A3C6E] text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-[#2A5FA0] transition-colors relative z-10 inline-flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Kembali ke Beranda
            </Link>
        </div>
    );
}
