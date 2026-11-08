import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { HybridCartDrawer } from "@/components/layout/HybridCartDrawer";
import { ToastViewport } from "@/components/layout/ToastViewport";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GymHub Hybrid Platform | Hệ Thống Quản Lý Phòng Tập, Khóa Học Video & Thực Phẩm Bổ Sung FEFO",
  description:
    "Đồ án tốt nghiệp Kỹ thuật phần mềm: Quản lý hội viên bằng mã QR động 60s, Đặt lịch PT 1-1 chống trùng ca, Khóa học Video chống tua 80%, Tư vấn TDEE AI lọc dị ứng và Xuất kho Thực phẩm bổ sung theo chuẩn FEFO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <HybridCartDrawer />
        <ToastViewport />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

