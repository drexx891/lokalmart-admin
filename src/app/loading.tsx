export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-20 px-6">
            <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                {/* Outer rotating ring */}
                <div className="absolute w-full h-full border-4 border-[#1A3C6E]/20 rounded-full"></div>
                <div className="absolute w-full h-full border-4 border-[#1A3C6E] rounded-full border-t-transparent animate-spin"></div>
                {/* Inner pulsing star */}
                <div className="text-3xl animate-pulse text-[#1A3C6E]">📦</div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2 animate-pulse">Menyiapkan Pengalaman</h2>
            <p className="text-[#6B7280] text-sm">Harap tunggu sebentar, kami sedang memuat data...</p>
        </div>
    );
}
