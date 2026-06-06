import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export const dynamic = "force-dynamic";


const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#1A3C6E", // Belio Navy
};

export const metadata: Metadata = {
    title: "Belio | Admin Panel",
    description: "Belio B2B Trading Platform - Super Admin Panel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" data-scroll-behavior="smooth">
            <body className={`${inter.className} min-h-screen antialiased bg-[#F7F8FA] text-[#1F2937] flex flex-col`}>
                <AdminLayoutWrapper>
                    {children}
                </AdminLayoutWrapper>
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </body>
        </html>
    );
}
