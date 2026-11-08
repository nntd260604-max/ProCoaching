# 🏋️‍♂️ GymHub Hybrid Platform — Đồ Án Tốt Nghiệp Kỹ Thuật Phần Mềm

**Hệ thống Quản lý Phòng tập, Đào tạo Trực tuyến (Online Video Courses), Đặt lịch Huấn luyện viên cá nhân (PT 1-1) và Thương mại Điện tử Thực phẩm Bổ sung (Supplement E-Commerce theo chuẩn FEFO).**

---

## 1. Công Nghệ & Kiến Trúc Hệ Thống (Tech Stack)

- **Frontend & Full-Stack Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **State Management:** Zustand (`useHybridCartStore` lưu trữ Giỏ hàng Hỗn hợp + Bộ chuyển đổi nhanh vai trò Demo).
- **Database & ORM:** PostgreSQL (Chuẩn hóa 3NF gồm **19 bảng dữ liệu**) kết hợp **Prisma ORM** (`prisma/schema.prisma`) + Cơ chế Persistent Local Store (`data/gymhub-store.json`) giúp chạy demo ngay lập tức không cần cài đặt thêm dịch vụ ngoài.
- **AI & Bảo mật:** Google Gemini API + Rule Engine Chuyên gia Dinh dưỡng lọc dị ứng (`allergen_tags`), Mã QR Động TOTP 60 giây (`HMAC-SHA256`).

---

## 2. 6 Nghiệp Vụ Cốt Lõi & Thuật Toán Đắt Giá Đã Hiện Thực Hóa

1. **Giỏ hàng Hỗn hợp (Hybrid Cart & ACID Checkout):**
   - Cho phép mua chung biến thể Thực phẩm bổ sung (`SUPPLEMENT_VARIANT` - cần địa chỉ giao hàng vật lý) và Khóa học/Gói tập (`COURSE_MEMBERSHIP` - kích hoạt thẻ QR ngay lập tức) trong cùng 1 đơn hàng.
   - Tự động ẩn/hiện form địa chỉ giao hàng dựa trên cờ `hasPhysicalItems`.
2. **Thuật toán Xuất Kho Lô Hàng Thực phẩm bổ sung theo chuẩn FEFO (`inventory_batches`):**
   - Truy vấn các lô hàng có `remaining_quantity > 0` và `expiry_date > NOW()`, sắp xếp theo `expiry_date ASC` (**First Expired, First Out** — Lô nào hết hạn trước được xuất kho trước).
   - Tự động bỏ qua các lô đã hết hạn (`EXPIRED`), ghi nhận `allocated_batch_id` vào bảng `order_items` và tính chính xác **Lợi nhuận gộp thực tế** (`unit_price - batch.import_price`).
3. **Công cụ Đo BMI/TDEE (Mifflin-St Jeor) & Trợ lý AI Tư vấn Thực đơn Lọc Dị ứng (`ai_consultation_logs`):**
   - Tính chính xác BMI, BMR, TDEE và phân bổ Macro (Protein - Carb - Fat) theo mục tiêu.
   - Sàng lọc tự động các sản phẩm chứa thành phần gây dị ứng trong `allergen_tags` (`LACTOSE`, `HIGH_CAFFEINE`, `SOY`, `GLUTEN`) trước khi gợi ý Combo.
4. **Khóa học Video Trực tuyến & Lưu tiến độ Chống Tua Bài (`user_lesson_progress`):**
   - Tự động khôi phục vị trí giây đang xem dở (`last_position_sec` - Resume Playback).
   - Đồng bộ thời gian thực xem qua Heartbeat và chỉ đánh dấu hoàn thành bài học (`is_completed = true`) khi `watched_seconds >= 80% duration_seconds`.
5. **Đặt lịch tập 1-1 với PT Chống Trùng Ca (`pt_bookings`):**
   - Đối chiếu lịch làm việc của PT (`trainer_availabilities`) và khóa các ca đã có người đặt bằng ràng buộc Unique Index `@@unique([trainerId, bookingDate, startTime])`.
6. **Điểm danh Phòng tập & Buổi tập PT bằng Mã QR Động 60 Giây (`gym_checkins`):**
   - Sinh mã QR TOTP đổi mới mỗi 60 giây từ `qr_secret_key` của thẻ tập.
   - Khi PT quét mã QR ca tập (`PT_SESSION`), hệ thống xác thực chữ ký HMAC-SHA256, chuyển lịch hẹn sang `COMPLETED` và tự động trừ 1 buổi trong `remaining_pt_sessions`.

---

## 3. Hướng Dẫn Cài Đặt & Chạy Dự Án

```bash
# 1. Cài đặt dependencies & khởi tạo Prisma Client
npm install

# 2. Chạy môi trường Development (Mặc định tại http://localhost:3000)
npm run dev

# (Tùy chọn) Nếu kết nối PostgreSQL thực tế qua DATABASE_URL trong .env:
npm run db:push
npm run db:seed
```

---

## 4. Kịch Bản Demo Bảo Vệ Đồ Án (Sử Dụng Thanh Chuyển Vai Trò Trên Header)

- **Trang chủ (`/`) & Công cụ TDEE AI (`/tdee-calculator`):** Nhập chiều cao, cân nặng, tích chọn *"Bất dung nạp Lactose"*, xem AI tự động loại trừ Whey Blend chứa Lactose và gợi ý Whey Hydrolyzed Isolate 0g Lactose.
- **Cửa hàng Thực phẩm bổ sung (`/supplements`) & Khóa học (`/courses`):** Thêm 1 hộp Whey + 1 Khóa học vào **Giỏ hàng Hỗn hợp**, áp mã `WHEYCOMBO` và bấm Thanh toán để xem biên lai truy vết mã lô `LOT-...` xuất theo FEFO.
- **Phân hệ Hội viên (`/dashboard/member`):** Xem mã QR động đếm ngược 60s, bấm **"Sao chép mã QR Token"**, học thử Video chống tua bài 80% và đặt lịch tập 1-1 với PT.
- **Phân hệ Huấn luyện viên (`/dashboard/trainer`):** Dán mã QR 60s của học viên (hoặc bấm nút *"Mô phỏng quét QR nhanh"*), nhập nhận xét buổi tập và xác thực hoàn thành ca PT.
- **Phân hệ Quản trị viên (`/dashboard/admin`):** Xem cảnh báo các lô hàng cận date dưới 60 ngày (`NEAR_EXPIRY`), bấm tạo nhanh chương trình Flash Sale xả kho và nhập lô hàng mới.

