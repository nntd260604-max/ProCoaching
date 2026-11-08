import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { HybridCartDrawer } from "@/components/layout/HybridCartDrawer";
import { ToastViewport } from "@/components/layout/ToastViewport";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GymHub | Hệ Thống Phòng Tập, Khóa Học Online & Thực Phẩm Bổ Sung",
  description:
    "Nền tảng quản lý thẻ tập QR động, đặt lịch huấn luyện viên cá nhân 1-1, khóa học video trực tuyến và cửa hàng thực phẩm bổ sung chuẩn FEFO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col mesh-canvas text-slate-900 antialiased selection:bg-emerald-600 selection:text-white">
        <Navbar />
        <HybridCartDrawer />
        <ToastViewport />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
