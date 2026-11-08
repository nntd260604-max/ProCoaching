# Bộ Prompt Xây Dựng Hệ Thống GymHub Cho AI IDE (Antigravity / Cursor / Windsurf)

Để AI IDE không bị "ngợp" hoặc sinh code thiếu file khi xây dựng một dự án lớn gồm 19 bảng CSDL, cách hiệu quả nhất là bạn tạo một file `.cursorrules` (hoặc `AGENT.md` / System Instructions) ở thư mục gốc, sau đó chạy lần lượt **5 Prompt theo từng giai đoạn (Phases)** dưới đây.

## Phần 1: Master Prompt (Dùng để khởi tạo toàn bộ dự án ngay từ đầu)

Sao chép toàn bộ nội dung trong khung dưới đây và dán vào khung Chat Agent của AI IDE ở lượt đầu tiên:

```text
Bạn là một Senior Full-Stack Architect. Hãy giúp tôi xây dựng trọn vẹn đồ án tốt nghiệp ngành Kỹ thuật phần mềm mang tên "GymHub Hybrid Platform" — Hệ thống quản lý phòng tập, đào tạo trực tuyến (Online Video Courses), đặt lịch Huấn luyện viên cá nhân (PT 1-1) và Thương mại điện tử Thực phẩm bổ sung (Supplement E-Commerce).

### 1. TECH STACK & KIẾN TRÚC BẮT BUỘC
- Framework: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI.
- Backend: Next.js Route Handlers (`app/api/...`) hoặc Node.js Express tách lớp rõ ràng (Services / Repositories), sử dụng Prisma ORM kết nối PostgreSQL.
- State Management: Zustand (quản lý Giỏ hàng hỗn hợp `useHybridCartStore` lưu cả Thực phẩm bổ sung lẫn Gói tập/Khóa học).
- Giao diện (UI/UX): Phong cách thể thao mạnh mẽ, hiện đại (Dark/High-contrast theme với tông màu Slate-950, Emerald-500 và Orange-500). Ngôn ngữ hiển thị trên toàn bộ giao diện: Tiếng Việt 100%.

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
1. Khởi tạo cấu trúc thư mục dự án rõ ràng, tạo file `prisma/schema.prisma` đầy đủ và file `prisma/seed.ts` chứa dữ liệu mẫu phong phú bằng tiếng Việt (gồm 3 tài khoản mẫu: Admin, PT, Hội viên; 6 sản phẩm Thực phẩm bổ sung với nhiều hương vị và lô hàng cận date/dài hạn; 4 gói tập/khóa học video kèm bài giảng; lịch rảnh của PT).
2. Xây dựng các Service xử lý thuật toán ở Backend (`src/lib/services/`):
   - `tdee-ai.service.ts`: Tính BMI/BMR/TDEE, lọc dị ứng `allergen_tags` và gợi ý Combo.
   - `checkout-fefo.service.ts`: Xử lý Prisma `$transaction` thanh toán giỏ hàng hỗn hợp, trừ lô hàng theo chuẩn FEFO và cấp quyền `UserEnrollment`.
   - `qr-checkin.service.ts`: Sinh mã TOTP QR 60 giây và xác thực Check-in.
```

## Phần 2: Các Prompt Chạy Tiếp Theo Từng Giai Đoạn (Step-by-Step Prompts)

Sau khi AI IDE hoàn thành Bước 1 (CSDL, Seed Data và Backend Services), bạn hãy gửi lần lượt các prompt dưới đây để AI hoàn thiện từng phân hệ giao diện mà không bị cắt bớt code:

### Prompt Giai đoạn 2: Xây dựng Giao diện Khách hàng, Công cụ TDEE AI & Cửa hàng Thực phẩm bổ sung
```text
Tiếp tục dự án GymHub: Hãy xây dựng hoàn chỉnh phân hệ Giao diện Khách hàng (Public & Storefront) kết nối trực tiếp với Database/Services đã tạo:

1. **Thanh điều hướng (Navbar) & Giỏ hàng Hỗn hợp (Slide-over Cart Drawer):**
   - Hiển thị số lượng sản phẩm trong giỏ, tách rõ 2 nhóm trong giỏ hàng: "Sản phẩm vật lý (Giao tận nơi)" và "Khóa học & Thẻ tập (Kích hoạt ngay)".
   - Bộ chuyển đổi nhanh tài khoản Demo (Switch Role: Hội viên / Huấn luyện viên PT / Admin) ngay trên thanh Header để phục vụ thuyết trình bảo vệ đồ án mượt mà.

2. **Trang chủ (`/`) & Công cụ Đo BMI/TDEE tích hợp AI Tư vấn (`/tdee-calculator`):**
   - Form nhập Chiều cao, Cân nặng, Tuổi, Giới tính, Mức độ vận động, Mục tiêu (Tăng cơ / Giảm mỡ / Tăng sức bền) và Checkbox Dị ứng (`Bất dung nạp Lactose`, `Nhạy cảm Caffeine`, `Dị ứng Đậu nành`).
   - Hiển thị trực quan kết quả BMI, BMR, TDEE, biểu đồ phân bổ Macro (Protein/Carb/Fat) mỗi ngày.
   - Hiển thị Thực đơn gợi ý trong ngày và "Combo Khóa học + Thực phẩm bổ sung" đã tự động lọc bỏ các chất gây dị ứng, có nút "Thêm trọn bộ Combo vào giỏ hàng".

3. **Trang Cửa hàng Thực phẩm bổ sung (`/supplements` & `/supplements/[slug]`):**
   - Bộ lọc theo Danh mục (Whey Protein, Pre-Workout, Creatine, Vitamin), Mục tiêu tập luyện, và Bộ lọc "Không chứa Lactose / Không Caffeine".
   - Trang chi tiết sản phẩm cho phép chọn Hương vị (Chocolate, Vanilla, Strawberry...) và Trọng lượng (2 Lbs, 5 Lbs), hiển thị bảng Nutrition Facts, cảnh báo dị ứng, số lượng tồn kho và nút thêm vào giỏ.

4. **Trang Khóa học Online & Gói tập PT (`/courses` & `/courses/[slug]`):**
   - Hiển thị rõ loại gói (`ONLINE_VIDEO`, `GYM_MEMBERSHIP`, `PT_PACKAGE`, `HYBRID_COMBO`), thời hạn thẻ và số buổi tập 1-1 với PT đi kèm.
```

### Prompt Giai đoạn 3: Xây dựng Phân hệ Học viên (Học Video chống tua, Đặt lịch PT & Thẻ QR 60s)
```text
Tiếp tục dự án GymHub: Hãy xây dựng hoàn chỉnh Dashboard dành cho Hội viên (`/dashboard/member`) gồm 4 tab chức năng thực tế:

1. **Tab "Thẻ Tập & Mã QR Check-in Động":**
   - Hiển thị thông tin thẻ tập đang kích hoạt, ngày hết hạn và số buổi PT còn lại (`remaining_pt_sessions`).
   - Hiển thị mã QR động tự động đổi mã mới sau mỗi 60 giây kèm thanh tiến trình đếm ngược (Countdown 60s) và mã Token hiển thị trực tiếp để dễ copy sang màn hình Quét QR của PT/Admin khi demo bảo vệ đồ án.

2. **Tab "Khóa Học Video Của Tôi" (`/dashboard/member/courses/[enrollmentId]`):**
   - Giao diện học trực tuyến gồm danh sách Chương (`CourseModule`) và Bài tập (`CourseLesson`).
   - Trình phát video mô phỏng hoặc HTML5 Video có thanh theo dõi: tự động lưu vị trí đang xem (`last_position_sec`), hiển thị bộ đếm thời gian thực xem (`watched_seconds`) và chỉ tự động tích xanh "Hoàn thành bài học" khi đạt >= 80% thời lượng bài tập. Kèm hướng dẫn số Sets x Reps bên dưới video.

3. **Tab "Đặt Lịch Tập 1-1 Với PT":**
   - Chọn Huấn luyện viên, chọn ngày trên lịch, hệ thống hiển thị các ca làm việc của PT và khóa mờ (disabled) các ca đã có người đặt.
   - Cho phép chọn nhóm cơ muốn tập (VD: Ngực - Tay sau, Chân - Mông) và xác nhận đặt lịch.

4. **Tab "Lịch Sử Chỉ Số Cơ Thể & Đơn Hàng":**
   - Biểu đồ theo dõi sự thay đổi Cân nặng & TDEE qua các lần đo và danh sách đơn hàng đã mua (hiển thị rõ mã lô hàng FEFO đã xuất cho từng hộp Whey).
```

### Prompt Giai đoạn 4: Xây dựng Phân hệ Huấn luyện viên (PT) & Quản trị viên (Admin FEFO Warehouse)
```text
Tiếp tục dự án GymHub: Hãy xây dựng hoàn chỉnh 2 phân hệ dành cho Huấn luyện viên (`/dashboard/trainer`) và Quản trị viên (`/dashboard/admin`):

1. **Phân hệ Huấn luyện viên - PT (`/dashboard/trainer`):**
   - Quản lý lịch dạy trong tuần, danh sách lịch hẹn của học viên.
   - **Công cụ Quét / Nhập mã QR Check-in của học viên:** Cho phép PT dán mã QR Token 60s từ màn hình của học viên (hoặc bấm nút "Mô phỏng quét QR nhanh" khi demo) để điểm danh hoàn thành buổi tập PT 1-1 (`COMPLETED`), tự động trừ 1 buổi trong gói của học viên và nhập ghi chú đánh giá buổi tập (`trainer_notes`).

2. **Phân hệ Quản trị viên - Admin (`/dashboard/admin`):**
   - **Dashboard Thống kê Đa luồng:** Tách bạch biểu đồ Doanh thu từ Dịch vụ (Gói tập/Khóa học) và Doanh thu + Lợi nhuận gộp từ Sản phẩm vật lý (Giá bán trừ Giá vốn `import_price` của lô FEFO).
   - **Quản lý Kho Lô hàng Thực phẩm bổ sung theo chuẩn FEFO (`Inventory Batches`):**
     + Hiển thị danh sách tất cả các lô hàng kèm trạng thái màu sắc: Xanh (`AVAILABLE` - Hạn dùng xa), Vàng cam (`NEAR_EXPIRY` - Cận date dưới 60 ngày), Đỏ (`EXPIRED` - Đã hết hạn).
     + Form "Nhập lô hàng mới" (chọn biến thể Whey, nhập Mã lô `batch_code`, Giá nhập, Số lượng, Ngày hết hạn).
     + Tính năng tạo nhanh chương trình giảm giá xả kho cho các lô hàng cận date.
   - **Quản lý Đơn hàng & Xác nhận Thanh toán Webhook (Mô phỏng VNPay/MoMo IPN):** Cho phép Admin xem chi tiết đơn hàng hỗn hợp và thấy rõ hệ thống đã tự động lấy hộp Whey từ lô `batch_code` nào (theo thứ tự hết hạn sớm nhất FEFO).
```

## Phần 3: File Quy Tắc `.cursorrules` (Hoặc `.windsurfrules` / `AGENT.md`)

Bạn nên lưu nội dung dưới đây vào file `.cursorrules` ở thư mục gốc của project. File này giúp AI IDE luôn nhớ cấu trúc CSDL và quy tắc nghiệp vụ trong suốt quá trình bạn chat sửa code:

```markdown
# GYMHUB HYBRID PLATFORM - PROJECT RULES

## 1. Domain Rules (Mandatory)
- **Hybrid Cart**: An `Order` can contain both `SUPPLEMENT_VARIANT` (physical goods requiring shipping & FEFO batch allocation) and `COURSE_MEMBERSHIP` (digital courses/gym passes activated immediately upon payment).
- **FEFO Inventory Allocation**: Never deduct stock blindly from `SupplementVariant`. Always query `InventoryBatch` where `remainingQuantity > 0` and `expiryDate > now()`, ordered by `expiryDate ASC` (First Expired, First Out), deduct from the earliest expiring batch, and record `allocatedBatchId` in `OrderItem`.
- **Dynamic QR Check-in**: Member gym passes generate a time-based 60-second token using `qrSecretKey`. Scanning a `PT_SESSION` QR marks the `PtBooking` as `COMPLETED`, decrements `remainingPtSessions` on `UserEnrollment`, and inserts a `GymCheckin` record inside a single database transaction.
- **Anti-Skip Video Progress**: A `CourseLesson` is only marked `isCompleted = true` in `UserLessonProgress` when `watchedSeconds >= durationSeconds * 0.8`.
- **Allergen-Safe AI Recommendation**: Always filter out `SupplementProduct` items whose `allergenTags` overlap with the user's selected `allergies` (e.g., `LACTOSE`, `HIGH_CAFFEINE`) before recommending combos.

## 2. UI & Coding Standards
- All user-facing text, labels, mock data, and error messages MUST be in natural Vietnamese.
- Provide a quick "Chuyển vai trò Demo (Hội viên / PT / Admin)" switcher in the top navigation bar so the graduation defense committee can test all 3 portals without logging out and typing passwords repeatedly.
- Never leave `// TODO` or empty mock buttons; every button must trigger real state updates or API calls with toast notifications.
```
