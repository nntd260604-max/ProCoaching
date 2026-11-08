"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HybridCartItem {
  id: string; // variantId or courseId
  itemType: "SUPPLEMENT_VARIANT" | "COURSE_MEMBERSHIP";
  supplementVariantId?: string;
  courseId?: string;
  name: string;
  subtitle: string; // Hương vị + Trọng lượng hoặc Thời hạn gói + Số buổi PT
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  skuOrBadge: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "warning" | "error" | "info";
}

interface HybridPlatformState {
  // Giỏ hàng hỗn hợp (Hybrid Cart)
  items: HybridCartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: Omit<HybridCartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Chuyển đổi nhanh vai trò Demo (Phục vụ thuyết trình bảo vệ đồ án)
  activeRole: "MEMBER" | "TRAINER" | "ADMIN";
  activeUserId: string;
  activeUserName: string;
  switchDemoRole: (role: "MEMBER" | "TRAINER" | "ADMIN") => void;

  // Lưu mã QR 60s vừa copy từ màn hình Hội viên để dán nhanh bên màn hình PT/Admin
  clipboardQrToken: string;
  setClipboardQrToken: (token: string) => void;

  // Hệ thống thông báo Toast tiếng Việt
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useHybridCartStore = create<HybridPlatformState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "var-iso100-5lb-choco",
          itemType: "SUPPLEMENT_VARIANT",
          supplementVariantId: "var-iso100-5lb-choco",
          name: "Dymatize ISO100 Hydrolyzed 100% Whey Isolate",
          subtitle: "Gourmet Chocolate • 5 Lbs (2.27 kg) • 0g Lactose",
          unitPrice: 2090000,
          quantity: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
          skuOrBadge: "ISO100-5LB-GOURMET-CHOCO",
        },
        {
          id: "course-video-compound",
          itemType: "COURSE_MEMBERSHIP",
          courseId: "course-video-compound",
          name: "Khóa Học Video Online: Làm Chủ Kỹ Thuật Compound & Tăng Cơ 8 Tuần",
          subtitle: "Kích hoạt ngay • Thời hạn 365 ngày • Video chống tua 80%",
          unitPrice: 890000,
          quantity: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80",
          skuOrBadge: "ONLINE_VIDEO",
        },
      ],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),

      addItem: (incoming) => {
        const current = get().items;
        const addQty = incoming.quantity ?? 1;
        const existingIndex = current.findIndex((i) => i.id === incoming.id);
        let updated: HybridCartItem[];

        if (existingIndex > -1) {
          updated = current.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + addQty } : item
          );
        } else {
          updated = [...current, { ...incoming, quantity: addQty }];
        }

        set({ items: updated });
        get().pushToast({
          title: "Đã thêm vào Giỏ hàng Hỗn hợp!",
          description: `${incoming.name} (${incoming.subtitle})`,
          type: "success",
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      activeRole: "MEMBER",
      activeUserId: "user-member-01",
      activeUserName: "Nguyễn Minh Quân (Hội viên)",
      switchDemoRole: (role) => {
        const roleMap = {
          MEMBER: { id: "user-member-01", name: "Nguyễn Minh Quân (Hội viên)" },
          TRAINER: { id: "user-trainer-01", name: "HLV Lê Hoàng Nam (PT)" },
          ADMIN: { id: "user-admin-01", name: "Phạm Quốc Trưởng (Admin)" },
        };
        set({
          activeRole: role,
          activeUserId: roleMap[role].id,
          activeUserName: roleMap[role].name,
        });
        get().pushToast({
          title: `Đã chuyển vai trò Demo: ${roleMap[role].name}`,
          description: "Giao diện và phân quyền đã được đồng bộ tức thì.",
          type: "info",
        });
      },

      clipboardQrToken: "",
      setClipboardQrToken: (token) => set({ clipboardQrToken: token }),

      toasts: [],
      pushToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set({ toasts: [...get().toasts, { ...toast, id }] });
        setTimeout(() => {
          set({ toasts: get().toasts.filter((t) => t.id !== id) });
        }, 4200);
      },
      dismissToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    }),
    {
      name: "gymhub-hybrid-cart-v1",
      partialize: (state) => ({
        items: state.items,
        activeRole: state.activeRole,
        activeUserId: state.activeUserId,
        activeUserName: state.activeUserName,
        clipboardQrToken: state.clipboardQrToken,
      }),
    }
  )
);

