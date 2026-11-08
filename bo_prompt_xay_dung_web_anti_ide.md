# Bộ Prompt Xây Dựng Hệ Thống GymHub Cho AI IDE (Antigravity / Cursor / Windsurf) — Chuẩn Thiết Kế Selective Glassmorphism

Bộ tài liệu này được đồng bộ 100% với **Hồ sơ đặc tả hệ thống GymHub (19 bảng CSDL)** và tuân thủ nghiêm ngặt ngôn ngữ thiết kế **Selective Glassmorphism (Kính mờ chọn lọc & Phân cấp thị giác thông minh)** — giúp giao diện tinh tế, thoáng đãng, không bị rối mắt hay lạm dụng hiệu ứng blur.

* **Nếu dự án của bạn ĐANG CHẠY (`localhost:3000`) và bạn muốn lột xác toàn bộ giao diện hiện tại:** Hãy copy ngay **Prompt Nâng Cấp Giao Diện (Mục 0)** bên dưới dán vào AI IDE.
* **Nếu bạn muốn chạy mới hoặc chạy theo từng phân hệ:** Sử dụng **Master Prompt (Phần 1)**, **Các Prompt Giai Đoạn (Phần 2)** và file **`.cursorrules` (Phần 3)**.

## Mục 0: Prompt Tái Thiết Kế Toàn Bộ Giao Diện Hiện Tại Sang Selective Glassmorphism (Dùng ngay cho project đang chạy)

Nếu project của bạn đã có sẵn code và đang chạy trên `localhost:3000` nhưng giao diện đang bị tối, rối rắm hoặc phức tạp, hãy copy khung dưới đây gửi cho AI IDE:

```text
Hiện tại giao diện (UI/UX) của dự án đang quá phức tạp, rối mắt và chưa đạt thẩm mỹ. Hãy Refactor (tái thiết kế) toàn bộ hệ thống UI/UX của dự án sang ngôn ngữ thiết kế "Selective Glassmorphism" (Kính mờ có chọn lọc & Tối giản hóa) theo đúng quy chuẩn hệ thống thiết kế dưới đây, giữ nguyên toàn bộ logic nghiệp vụ:

### 1. TRIẾT LÝ "SELECTIVE GLASSMORPHISM" (CHỐNG LẠM DỤNG KÍNH MỜ)
Không dùng hiệu ứng kính mờ (`backdrop-blur`) tràn lan gây nhiễu thị giác. Hãy chia giao diện thành 3 tầng chiều sâu rõ rệt:
- **Tầng 0 - Nền móng (Base Canvas):** Dùng nền sáng thanh lịch `bg-slate-50` kết hợp một dải Mesh Gradient cực nhẹ ở khu vực đầu trang (`bg-gradient-to-br from-slate-50 via-emerald-50/40 to-indigo-50/40`). Tuyệt đối bỏ nền đen nặng nề hoặc ảnh nền rối mắt.
- **Tầng 1 - Bề mặt Nội dung Đọc (Solid Content Surfaces - chiếm 75% diện tích):** Toàn bộ thẻ sản phẩm Thực phẩm bổ sung, bảng dữ liệu lô hàng FEFO, danh sách bài học, bảng thông số dinh dưỡng và các ô nhập liệu (`input`, `select`) BẮT BUỘC dùng nền đặc `bg-white`, viền mảnh `border border-slate-200/80`, bo góc `rounded-2xl` và đổ bóng mềm `shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all`.
- **Tầng 2 - Lớp Kính Mờ Chọn Lọc (Selective Glass Layer - chiếm 25% điểm nhấn):** Chỉ áp dụng hiệu ứng kính trong suốt (`bg-white/75 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(15,23,42,0.06)] rounded-3xl`) cho đúng 5 thành phần dẫn dắt sự tập trung:
  1. Thanh điều hướng nổi phía trên (`Sticky Floating Navbar`).
  2. Khối tiêu điểm Hero / Thẻ tổng hợp kết quả TDEE & Macro.
  3. Ngăn kéo Giỏ hàng hỗn hợp (`Slide-over Hybrid Cart Drawer`).
  4. Thẻ Hội viên & Mã QR Động 60s (`Member QR Pass` - riêng thẻ này có thể dùng kính tối sang trọng `bg-slate-900/85 backdrop-blur-xl border border-white/15 text-white`).
  5. Các hộp thoại nổi (`Modal / Dialog`).

### 2. QUY TẮC TYPOGRAPHY, ĐỘ TƯƠNG PHẢN & CHỐNG RỐI MẮT (ANTI-CLUTTER)
- **Không lồng kính trong kính (No Nested Blur):** Tuyệt đối không đặt một thẻ `backdrop-blur` bên trong một thẻ `backdrop-blur` khác.
- **Font chữ đủ đậm, tương phản cao:** Tiêu đề dùng `font-bold` hoặc `font-extrabold tracking-tight text-slate-900`. Văn bản nội dung dùng `font-medium text-slate-700`. Không dùng chữ xám nhạt khó đọc trên nền kính.
- **Bố cục tối giản, nhiều khoảng thở:**
  + Mỗi hàng chỉ hiển thị tối đa 3 hoặc 4 thẻ (`gap-6`, padding trong thẻ `p-6`).
  + Trên mỗi Card sản phẩm/khóa học ở trang danh sách chỉ hiển thị gọn 4 thông tin: Hình ảnh, Tên + Thương hiệu, tối đa 2 Badge nhỏ (Mục tiêu & Không chứa Lactose/Caffeine), Giá tiền + Nút thêm vào giỏ.
- **Thanh điều hướng gọn trên 1 hàng:** Đặt nút chuyển đổi vai trò Demo (`Hội viên` / `PT` / `Admin`) dưới dạng một Segmented Control nhỏ gọn, tinh tế nằm trên thanh Navbar kính mờ.
```

## Phần 1: Master Prompt (Dùng khi khởi tạo dự án từ đầu)

Sao chép toàn bộ nội dung trong khung dưới đây và dán vào khung Chat Agent của AI IDE ở lượt đầu tiên:

```text
Bạn là một Senior Full-Stack Architect kiêm Principal UI/UX Designer. Hãy giúp tôi xây dựng trọn vẹn đồ án tốt nghiệp ngành Kỹ thuật phần mềm mang tên "GymHub Hybrid Platform" — Hệ thống quản lý phòng tập, đào tạo trực tuyến (Online Video Courses), đặt lịch Huấn luyện viên cá nhân (PT 1-1) và Thương mại điện tử Thực phẩm bổ sung (Supplement E-Commerce).

### 1. TECH STACK & HỆ THỐNG THIẾT KẾ "SELECTIVE GLASSMORPHISM"
- **Framework:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI.
- **Backend & ORM:** Next.js Route Handlers (`app/api/...`) hoặc Node.js tách lớp Services rõ ràng, sử dụng Prisma ORM kết nối PostgreSQL.
- **State Management:** Zustand (quản lý Giỏ hàng hỗn hợp `useHybridCartStore` lưu cả Thực phẩm bổ sung lẫn Gói tập/Khóa học).
- **Ngôn ngữ Thiết kế UI/UX (Selective Glassmorphism - Kính mờ có chọn lọc & Tối giản):**
  + **Không lạm dụng kính mờ tràn lan:** Phân cấp rõ 3 tầng thị giác để chống nhiễu và tối ưu khả năng đọc.
  + **Tầng Nền (Base Canvas):** Nền sáng sạch sẽ `bg-slate-50` kết hợp Mesh Gradient dịu nhẹ (`from-slate-50 via-emerald-50/40 to-indigo-50/40`).
  + **Tầng Nội dung Đọc (Solid Surfaces - 75% diện tích):** Các thẻ sản phẩm Whey, bảng dữ liệu lô hàng FEFO, danh sách bài giảng, ô nhập liệu Form sử dụng nền đặc `bg-white border border-slate-200/80 rounded-2xl shadow-sm` để chữ viết và số liệu sắc nét tuyệt đối.
  + **Tầng Kính Mờ Chọn Lọc (Focal Glass - 25% điểm nhấn):** Chỉ áp dụng class kính mờ (`bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.06)] rounded-3xl`) cho 5 khu vực dẫn dắt sự tập trung: Thanh Sticky Navbar, Khối tiêu điểm TDEE & AI Summary, Ngăn kéo Giỏ hàng hỗn hợp (Cart Drawer), Thẻ tập QR Động 60s, và Modal.
  + **Typography & Màu sắc:** Font chữ đậm nét (`font-bold text-slate-900` cho tiêu đề, `font-medium text-slate-700` cho nội dung), điểm nhấn màu Xanh Ngọc (`emerald-600`) và Xanh Chàm (`indigo-600`). Ngôn ngữ hiển thị: Tiếng Việt 100%.

### 2. 6 NGHIỆP VỤ CỐT LÕI & THUẬT TOÁN ĐẮT GIÁ CẦN HIỆN THỰC HÓA ĐẦY ĐỦ LOGIC (KHÔNG DÙNG PLACEHOLDER)
1. **Giỏ hàng Hỗn hợp (Hybrid Cart & Checkout):**
   - Cho phép khách hàng thêm cả biến thể Thực phẩm bổ sung (`SUPPLEMENT_VARIANT` - có hương vị, trọng lượng, cần địa chỉ giao hàng vật lý) VÀ Khóa học/Gói tập (`COURSE_MEMBERSHIP` - kích hoạt kỹ thuật số ngay lập tức) vào chung 1 giỏ hàng.
   - Nếu giỏ hàng có `hasPhysicalItems = true` thì hiển thị form nhập địa chỉ giao hàng và tính phí vận chuyển; nếu chỉ mua khóa học/gói tập thì ẩn bước giao hàng.

2. **Quản lý Lô hàng Thực phẩm bổ sung theo chuẩn FEFO (`inventory_batches`):**
   - Mỗi biến thể thực phẩm bổ sung (VD: Whey Rule1 5Lbs vị Chocolate) có nhiều lô nhập kho (`batch_code`, `import_price`, `remaining_quantity`, `expiry_date`).
   - Khi khách hàng thanh toán thành công (Database Transaction): Hệ thống tự động truy vấn các lô của biến thể đó có `remaining_quantity > 0` và `expiry_date > NOW()`, sắp xếp theo `expiry_date ASC` (First Expired, First Out - Lô nào hết hạn trước thì trừ tồn kho trước) và lưu `allocated_batch_id` vào bảng `order_items` để tính lợi nhuận gộp (`unit_price - import_price`).
   - Trên trang Admin: Cảnh báo nổi bật các lô hàng cận date (hạn sử dụng còn dưới 60 ngày).

3. **Công cụ đo BMI/TDEE & Trợ lý AI Tư vấn Thực đơn lọc Dị ứng (`ai_consultation_logs`):**
   - Tính chính xác BMI, BMR (công thức Mifflin-St Jeor) và TDEE (Kcal/ngày) kèm tỷ lệ Macro (Protein - Carb - Fat) theo mục tiêu (`MUSCLE_GAIN`, `FAT_LOSS`, `ENDURANCE`).
   - Cho phép người dùng tích chọn Dị ứng/Cơ địa (`LACTOSE`, `HIGH_CAFFEINE`, `GLUTEN`, `SOY`).
   - Tự động lọc bỏ các sản phẩm có chứa nhãn dị ứng trong `allergen_tags` (ví dụ: nếu chọn dị ứng `LACTOSE` thì loại bỏ Whey Concentrate, chỉ gợi ý Whey Isolate/Hydrolyzed hoặc Plant Protein) và kết hợp Google Gemini API (hoặc bộ rule thông minh khi chưa cấu hình API key) để sinh thực đơn mẫu 1 ngày + gợi ý Combo Khóa học & Thực phẩm bổ sung.

4. **Khóa học Video Online & Lưu tiến độ chống tua bài (`user_lesson_progress`):**
   - Trình phát video bài giảng tự động khôi phục vị trí giây đang xem dở (`last_position_sec`).
   - Gửi tiến độ mỗi 10 giây; chỉ tự động đánh dấu hoàn thành bài học (`is_completed = true`) và cập nhật `% hoàn thành khóa học` khi tổng thời gian thực xem (`watched_seconds`) đạt tối thiểu 80% thời lượng bài giảng (`duration_seconds`).

5. **Đặt lịch tập 1-1 với PT chống trùng ca (`pt_bookings`):**
   - Hội viên sở hữu gói tập có `remaining_pt_sessions > 0` được chọn PT, ngày tập và ca rảnh.
   - Đảm bảo ràng buộc chống trùng lịch `@@unique([trainerId, bookingDate, startTime])`.

6. **Điểm danh Phòng tập & Buổi tập PT bằng Mã QR Động 60 giây (`gym_checkins`):**
   - Trong trang Hội viên, hiển thị thẻ tập kèm mã QR động tự làm mới sau mỗi 60 giây (sinh từ `qr_secret_key` + timestamp window 60s) kèm thanh đếm ngược.
   - Trong trang PT / Admin có màn hình "Quét / Xác thực mã QR Check-in": Khi nhập hoặc quét mã QR của học viên, hệ thống kiểm tra tính hợp lệ, ghi log vào `gym_checkins` và nếu là buổi tập PT (`PT_SESSION`) thì tự động chuyển lịch hẹn sang `COMPLETED` đồng thời trừ 1 buổi trong `remaining_pt_sessions`.

### 3. PRISMA SCHEMA CHUẨN (19 BẢNG)
Hãy tạo file `prisma/schema.prisma` với đầy đủ các model:
`User`, `TrainerProfile`, `BodyMetricsLog`, `AiConsultationLog`, `Category`, `SupplementProduct`, `SupplementVariant`, `InventoryBatch`, `CourseMembership`, `CourseModule`, `CourseLesson`, `UserEnrollment`, `UserLessonProgress`, `TrainerAvailability`, `PtBooking`, `GymCheckin`, `Voucher`, `Order`, `OrderItem`.

### 4. YÊU CẦU THỰC THI BƯỚC 1
1. Khởi tạo cấu trúc thư mục dự án rõ ràng, cấu hình sẵn các utility class cho Selective Glassmorphism trong `globals.css` (`.glass-panel`, `.solid-card`), tạo file `prisma/schema.prisma` đầy đủ và file `prisma/seed.ts` chứa dữ liệu mẫu phong phú bằng tiếng Việt.
2. Xây dựng các Service xử lý thuật toán ở Backend (`src/lib/services/`):
   - `tdee-ai.service.ts`: Tính BMI/BMR/TDEE, lọc dị ứng `allergen_tags` và gợi ý Combo.
   - `checkout-fefo.service.ts`: Xử lý Prisma `$transaction` thanh toán giỏ hàng hỗn hợp, trừ lô hàng theo chuẩn FEFO và cấp quyền `UserEnrollment`.
   - `qr-checkin.service.ts`: Sinh mã TOTP QR 60 giây và xác thực Check-in.
```

## Phần 2: Các Prompt Chạy Tiếp Theo Từng Giai Đoạn (Step-by-Step Prompts)

Sau khi AI IDE hoàn thành Bước 1 (CSDL, Seed Data và Backend Services), bạn hãy gửi lần lượt các prompt dưới đây để AI hoàn thiện từng phân hệ giao diện chuẩn **Selective Glassmorphism**:

### Prompt Giai đoạn 2: Xây dựng Giao diện Khách hàng, Công cụ TDEE AI & Cửa hàng Thực phẩm bổ sung
```text
Tiếp tục dự án GymHub: Hãy xây dựng hoàn chỉnh phân hệ Giao diện Khách hàng (Public & Storefront) tuân thủ nghiêm ngặt phong cách Selective Glassmorphism (Nền sáng `bg-slate-50` + Mesh Gradient nhẹ, Card sản phẩm nền đặc `bg-white` dễ đọc, và Lớp kính mờ `backdrop-blur-xl` chỉ dùng cho thành phần tiêu điểm):

1. **Thanh điều hướng Kính mờ nổi (Floating Glass Navbar) & Giỏ hàng Hỗn hợp (Glass Cart Drawer):**
   - Thanh Navbar cố định phía trên dùng hiệu ứng kính mờ (`bg-white/75 backdrop-blur-xl border-b border-white/60`), bố cục tối giản trên 1 hàng.
   - Tích hợp nút chuyển đổi nhanh vai trò Demo (`Hội viên` / `Huấn luyện viên PT` / `Quản trị viên`) dạng Segmented Pill nhỏ gọn ngay trên Header.
   - Slide-over Cart Drawer dùng hiệu ứng kính mờ ở khung ngoài, nhưng bên trong chứa các thẻ sản phẩm nền `bg-white` sắc nét, tách rõ 2 nhóm: "Sản phẩm vật lý (Giao tận nơi - Xuất lô FEFO)" và "Khóa học & Thẻ tập (Kích hoạt ngay)".

2. **Trang chủ (`/`) & Khu vực Đo BMI/TDEE tích hợp AI Tư vấn (`/tdee-calculator`):**
   - Khối nhập liệu Form sử dụng nền đặc `bg-white` sạch sẽ (Chiều cao, Cân nặng, Tuổi, Giới tính, Mức độ vận động, Mục tiêu và Checkbox Dị ứng: `Bất dung nạp Lactose`, `Nhạy cảm Caffeine`, `Dị ứng Đậu nành`).
   - **Khối Kết quả Tiêu điểm (Focal Glass Card):** Hiển thị kết quả BMI, BMR, TDEE và 3 thanh Macro (Protein/Carb/Fat) bên trong một tấm kính mờ nổi bật trên nền gradient nhẹ, chữ đậm tương phản cao (`font-extrabold text-slate-900`).
   - Hiển thị Thực đơn gợi ý 1 ngày và "Combo Khóa học + Thực phẩm bổ sung" đã tự động lọc bỏ các chất gây dị ứng, có nút "Thêm trọn bộ Combo vào giỏ hàng".

3. **Trang Cửa hàng Thực phẩm bổ sung (`/supplements` & `/supplements/[slug]`):**
   - Thanh bộ lọc (Filter Bar) phía trên dùng hiệu ứng kính mờ nhẹ; lưới danh sách sản phẩm bên dưới hiển thị tối đa 3-4 sản phẩm/hàng trên nền Card đặc `bg-white` thoáng đãng, chỉ hiển thị gọn 4 thông tin chính (Ảnh, Tên + Hãng, 2 Badge Không Lactose/Mục tiêu, Giá + Nút mua).
   - Trang chi tiết sản phẩm cho phép chọn Hương vị (Chocolate, Vanilla...) và Trọng lượng (2 Lbs, 5 Lbs), hiển thị bảng Nutrition Facts rõ nét, hạn sử dụng lô FEFO gần nhất và nút thêm vào giỏ.

4. **Trang Khóa học Online & Gói tập PT (`/courses` & `/courses/[slug]`):**
   - Thiết kế tối giản, sang trọng, hiển thị rõ loại gói (`ONLINE_VIDEO`, `GYM_MEMBERSHIP`, `PT_PACKAGE`, `HYBRID_COMBO`), thời hạn thẻ và số buổi tập 1-1 với PT đi kèm.
```

### Prompt Giai đoạn 3: Xây dựng Phân hệ Học viên (Học Video chống tua, Đặt lịch PT & Thẻ QR 60s)
```text
Tiếp tục dự án GymHub: Hãy xây dựng hoàn chỉnh Dashboard dành cho Hội viên (`/dashboard/member`) theo phong cách Selective Glassmorphism (gọn gàng, nhiều khoảng trắng, phân cấp thông tin rõ ràng) gồm 4 khu vực:

1. **Thẻ Tập Kính Mờ & Mã QR Check-in Động 60s (Focal Glass Pass):**
   - Thiết kế chiếc Thẻ Hội Viên như một tấm thẻ kính cao cấp (`bg-slate-900/85 backdrop-blur-xl border border-white/15 text-white rounded-3xl shadow-xl`), hiển thị gói tập đang kích hoạt, ngày hết hạn và số buổi PT còn lại (`remaining_pt_sessions`).
   - Đặt khung Mã QR trên nền trắng tinh (`bg-white p-4 rounded-2xl`) bên trong thẻ kính để máy quét đọc dễ dàng, tự động đổi mã mới sau mỗi 60 giây kèm thanh đếm ngược và nút "Sao chép mã QR Token" để phục vụ demo.

2. **Khu vực "Khóa Học Video Của Tôi" (`/dashboard/member/courses/[enrollmentId]`):**
   - Bố cục 2 cột thoáng đãng trên nền `bg-white`: Cột trái là Trình phát video kèm thanh tiến độ thực xem (`watched_seconds / duration_seconds`); Cột phải là danh sách Chương (`CourseModule`) và Bài tập (`CourseLesson`).
   - Tự động lưu vị trí đang xem (`last_position_sec`) và chỉ tự động tích xanh "Hoàn thành bài học" (`emerald-600`) khi đạt >= 80% thời lượng bài tập.

3. **Khu vực "Đặt Lịch Tập 1-1 Với PT":**
   - Giao diện chọn Huấn luyện viên và chọn khung giờ dạng lưới Pill gọn gàng trên nền `bg-white`, làm mờ (disabled) các ca đã có người đặt, chọn nhóm cơ tập trung và xác nhận đặt lịch.

4. **Khu vực "Lịch Sử Chỉ Số Cơ Thể & Đơn Hàng":**
   - Bảng đơn hàng sạch sẽ trên nền `bg-white`, hiển thị rõ mã lô hàng FEFO (`batch_code` và `expiry_date`) đã xuất cho từng hộp Whey đã mua.
```

### Prompt Giai đoạn 4: Xây dựng Phân hệ Huấn luyện viên (PT) & Quản trị viên (Admin FEFO Warehouse)
```text
Tiếp tục dự án GymHub: Hãy xây dựng hoàn chỉnh 2 phân hệ dành cho Huấn luyện viên (`/dashboard/trainer`) và Quản trị viên (`/dashboard/admin`) theo chuẩn Selective Glassmorphism (ưu tiên tính dễ đọc cho bảng dữ liệu lớn):

1. **Phân hệ Huấn luyện viên - PT (`/dashboard/trainer`):**
   - **Khối Quét / Xác thực Mã QR Check-in (Focal Glass Panel):** Một khung kính mờ nổi bật ở đầu trang cho phép PT dán mã QR Token 60s của học viên (hoặc bấm nút "Mô phỏng quét QR nhanh") để điểm danh hoàn thành buổi tập PT 1-1 (`COMPLETED`), tự động trừ 1 buổi trong gói của học viên và lưu nhận xét (`trainer_notes`).
   - Danh sách lịch dạy trong tuần trình bày trên nền thẻ đặc `bg-white` sắc nét, độ tương phản chữ cao.

2. **Phân hệ Quản trị viên - Admin (`/dashboard/admin`):**
   - **Hàng Thẻ KPI Tiêu Điểm (Top Glass KPI Strip):** 4 thẻ kính mờ hiển thị Tổng doanh thu Dịch vụ (Khóa học/PT), Doanh thu Sản phẩm vật lý (TPBS), Lợi nhuận gộp thực tế (Giá bán trừ Giá vốn lô FEFO) và Số lô hàng sắp hết hạn.
   - **Bảng Quản lý Lô hàng Thực phẩm bổ sung theo chuẩn FEFO (`Inventory Batches` - Nền đặc `bg-white`):**
     + Tuyệt đối dùng nền `bg-white` đặc cho bảng dữ liệu để Admin đọc số liệu rõ ràng.
     + Hiển thị danh sách lô hàng sắp xếp theo hạn sử dụng gần nhất (`expiry_date ASC`) kèm Badge trạng thái có độ tương phản cao: Xanh Ngọc (`AVAILABLE`), Cam Hổ Phách (`NEAR_EXPIRY` - Cận date dưới 60 ngày), Đỏ (`EXPIRED`).
     + Modal "Nhập lô hàng mới" dùng hiệu ứng kính mờ cho lớp phủ ngoài và nền trắng đặc cho các ô input.
```

## Phần 3: File Quy Tắc `.cursorrules` (Hoặc `.windsurfrules` / `AGENT.md`)

Hãy cập nhật file `.cursorrules` ở thư mục gốc của project bằng nội dung dưới đây để AI IDE tuân thủ tuyệt đối cả nghiệp vụ lẫn thẩm mỹ **Selective Glassmorphism**:

```markdown
# GYMHUB HYBRID PLATFORM - ARCHITECTURE & DESIGN SYSTEM RULES

## 1. UI/UX Design System: Selective Glassmorphism (MANDATORY)
- **Visual Philosophy**: Glassmorphism is used selectively to guide user focus and create depth, NEVER overused across every element. Prioritize clear visual hierarchy, high text contrast, and uncluttered layouts.
- **3-Tier Surface Hierarchy**:
  1. **Base Canvas**: Clean light background (`bg-slate-50`) paired with a subtle top mesh gradient (`bg-gradient-to-br from-slate-50 via-emerald-50/40 to-indigo-50/40`). Never use noisy background photos or heavy all-black screens.
  2. **Solid Content Surfaces (75% of UI)**: Product cards, data tables (FEFO batches, orders), forms, inputs, and lesson lists MUST use crisp solid backgrounds (`bg-white border border-slate-200/80 rounded-2xl shadow-sm`) to guarantee effortless readability.
  3. **Selective Glass Surfaces (25% Focal Elements)**: Apply `bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.06)] rounded-3xl` ONLY to focal components: Sticky Navbar, Hero TDEE/Macro Summary Card, Slide-over Hybrid Cart Drawer, Member 60s QR Pass, and Modals.
- **Anti-Clutter & Typography**:
  - Never nest a `backdrop-blur` element inside another `backdrop-blur` element.
  - Use bold, high-contrast typography (`font-bold text-slate-900` for headings/metrics, `font-medium text-slate-700` for body copy).
  - Keep cards minimal (max 3-4 data points per grid card; generous `p-6` padding and `gap-6` grid spacing).

## 2. Core Business Logic Rules
- **Hybrid Cart**: An `Order` can contain both `SUPPLEMENT_VARIANT` (physical goods requiring shipping & FEFO batch allocation) and `COURSE_MEMBERSHIP` (digital courses/gym passes activated immediately upon payment).
- **FEFO Inventory Allocation**: Always query `InventoryBatch` where `remainingQuantity > 0` and `expiryDate > now()`, ordered by `expiryDate ASC` (First Expired, First Out), deduct from the earliest expiring batch, and record `allocatedBatchId` in `OrderItem`.
- **Dynamic QR Check-in**: Member gym passes generate a time-based 60-second token using `qrSecretKey`. Scanning a `PT_SESSION` QR marks the `PtBooking` as `COMPLETED`, decrements `remainingPtSessions` on `UserEnrollment`, and inserts a `GymCheckin` record.
- **Anti-Skip Video Progress**: A `CourseLesson` is only marked `isCompleted = true` in `UserLessonProgress` when `watchedSeconds >= durationSeconds * 0.8`.
- **Allergen-Safe AI Recommendation**: Always filter out `SupplementProduct` items whose `allergenTags` overlap with the user's selected `allergies` (`LACTOSE`, `HIGH_CAFFEINE`) before recommending combos.
- **Language & Demo Switcher**: All UI text must be in natural Vietnamese. Include a compact Role Switcher (`Hội viên` / `PT` / `Admin`) in the sticky glass navbar for defense demonstration.
```