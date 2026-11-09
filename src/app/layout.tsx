import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { HybridCartDrawer } from "@/components/layout/HybridCartDrawer";
import { ToastViewport } from "@/components/layout/ToastViewport";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GymHub | Hệ Thống Phòng Tập, Khóa Học Online & Thực Phẩm Bổ Sung",
  description:
    "Nền tảng quản lý thẻ tập QR động, đặt lịch huấn luyện viên cá nhân 1-1, khóa học video trực tuyến và cửa hàng thực phẩm bổ sung chính hãng.",
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col mesh-canvas text-slate-900 antialiased selection:bg-emerald-600 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-emerald-600 focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-white focus:shadow-lg"
        >
          Chuyển đến nội dung chính
        </a>
        <Navbar />
        <HybridCartDrawer />
        <ToastViewport />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
