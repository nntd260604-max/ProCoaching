# Hồ Sơ Đặc Tả Đồ Án Tốt Nghiệp: Hệ Thống Quản Lý Phòng Tập, Đào Tạo Trực Tuyến và Thương Mại Điện Tử Thực Phẩm Bổ Sung (GymHub Hybrid Platform - Bản Đầy Đủ 19 Bảng)

**Chuyên ngành:** Công nghệ thông tin / Kỹ thuật phần mềm  
**Kiến trúc công nghệ:** Next.js (App Router, TypeScript, Tailwind CSS) + Node.js (Express/NestJS) + PostgreSQL (Prisma ORM) + Redis + Google Gemini API  
**Mô hình kinh doanh:** Kết hợp dịch vụ phòng tập/PT trực tiếp (Offline Membership & 1-1 Coaching), Khóa học video tập luyện trực tuyến (Online Fitness Courses) và Cửa hàng thực phẩm bổ sung (Supplement E-Commerce).  
**Ngôn ngữ Thiết kế Giao diện (Design System):** **Selective Glassmorphism (Kính mờ chọn lọc & Phân cấp thị giác thông minh)** — Tối giản, tinh tế, sử dụng chất liệu kính trong suốt có chọn lọc để dẫn dắt sự tập trung trên nền Solid/Gradient dịu mắt, đảm bảo độ tương phản cao và khả năng đọc tối ưu.

## 1. Đề Cương Chi Tiết Cuốn Báo Cáo Tốt Nghiệp (Chuẩn Học Thuật CNTT)

Đề cương dưới đây đã được tích hợp đầy đủ **4 tính năng nâng cao đắt giá** (Điểm danh QR động, Lưu tiến độ xem video chống tua bài, Quản lý lô hàng cận date theo chuẩn FEFO, và Trợ lý AI tư vấn dinh dưỡng tránh dị ứng) cùng **Hệ thống thiết kế UI/UX Selective Glassmorphism**, giúp đồ án đạt độ sâu kỹ thuật và thẩm mỹ thuyết phục trước hội đồng bảo vệ.

### Chương 1: Tổng quan về đề tài và Bài toán nghiệp vụ
* **1.1. Lý do chọn đề tài:** Sự bùng nổ của xu hướng chăm sóc sức khỏe cá nhân (Fitness & Wellness) và bài toán phân mảnh khi người tập phải dùng nhiều nền tảng rời rạc (một nơi mua thẻ tập, một nơi mua Whey/Creatine, một nơi xem video hướng dẫn và theo dõi lịch tập).
* **1.2. Mục tiêu và phạm vi của đề tài:**
  * **Mục tiêu nghiệp vụ:** Xây dựng nền tảng All-in-One kết hợp quản lý hội viên (Check-in bằng mã QR động chống mượn thẻ), đặt lịch PT chống trùng giờ, học trực tuyến qua video (lưu vết tiến độ từng bài), mua sắm thực phẩm bổ sung (quản lý lô hạn sử dụng FEFO) và tư vấn lộ trình thông minh bằng AI theo chỉ số cơ thể (BMI/TDEE) kèm sàng lọc dị ứng (Lactose, Caffeine).
  * **Mục tiêu kỹ thuật & Trải nghiệm người dùng (UI/UX):** Thiết kế kiến trúc tách biệt Frontend/Backend (RESTful API), xử lý giao dịch giỏ hàng hỗn hợp (Hybrid Cart), thuật toán xuất kho FEFO, bảo mật mã QR theo thời gian thực (TOTP 60s), và xây dựng hệ thống giao diện theo chuẩn **Selective Glassmorphism** giúp tối giản hóa thao tác, chống nhiễu thị giác và dẫn dắt sự tập trung của người dùng.
* **1.3. Đối tượng sử dụng hệ thống (Actors):** Khách vãng lai (Guest), Hội viên/Khách hàng (Member), Huấn luyện viên cá nhân (Personal Trainer - PT), Quản trị viên (Administrator).
* **1.4. Phương pháp nghiên cứu và quy trình phát triển phần mềm:** Áp dụng mô hình Agile/Scrum cho quá trình phát triển và UML 2.0 cho phân tích thiết kế.

### Chương 2: Cơ sở lý thuyết và Công nghệ sử dụng
* **2.1. Kiến trúc ứng dụng Web hiện đại:** So sánh Server-Side Rendering (SSR) và Client-Side Rendering (CSR) trên **Next.js** để tối ưu SEO cho trang bán thực phẩm bổ sung và khóa học.
* **2.2. Nền tảng Backend và Cơ sở dữ liệu:**
  * Kiến trúc **Node.js (Express/NestJS)** xử lý bất đồng bộ và phân tầng Controller - Service - Repository.
  * Hệ quản trị CSDL quan hệ **PostgreSQL** kết hợp **Prisma ORM** đảm bảo tính toàn vẹn giao dịch (ACID) khi trừ tồn kho theo lô (Batch FEFO) và kích hoạt gói tập.
* **2.3. Bảo mật, Xác thực và Mã QR Động:**
  * Cơ chế xác thực **JWT (Access Token & Refresh Token)** kết hợp phân quyền dựa trên vai trò (**RBAC - Role-Based Access Control**).
  * Thuật toán sinh **Dynamic QR Token (TOTP / HMAC-SHA256)** tự động đổi mới mỗi 60 giây phục vụ điểm danh tại phòng tập.
* **2.4. Các dịch vụ tích hợp bên thứ ba:**
  * Cổng thanh toán điện tử (**VNPay / MoMo / PayOS Sandbox**) xử lý Webhook xác nhận đơn hàng tự động.
  * Lưu trữ đám mây (**Cloudinary / AWS S3 / Mux**) phục vụ tải ảnh sản phẩm và phát video khóa học trực tuyến (HLS Streaming).
  * Tích hợp mô hình ngôn ngữ lớn (**Google Gemini API**) kết hợp dữ liệu sản phẩm nội bộ để cá nhân hóa thực đơn và gợi ý thực phẩm bổ sung an toàn với cơ địa học viên.
* **2.5. Công thức khoa học thể hình và Quản trị kho hàng:**
  * Công thức **Mifflin-St Jeor** tính BMR (Basal Metabolic Rate), TDEE (Total Daily Energy Expenditure) và phân bổ Macro (Protein - Carb - Fat).
  * Nguyên tắc quản trị tồn kho **FEFO (First Expired, First Out - Hết hạn trước xuất trước)** ứng dụng trong kinh doanh thực phẩm bổ sung.

### Chương 3: Phân tích và Thiết kế hệ thống (Trọng tâm chấm điểm của Hội đồng)
* **3.1. Phân tích yêu cầu chức năng (Functional Requirements):**
  * Phân hệ Khách hàng & Hội viên (Tính TDEE, AI Tư vấn dinh dưỡng & lọc dị ứng, Mua sắm giỏ hàng hỗn hợp, Học video lưu tiến độ `user_lesson_progress`, Đặt lịch PT, Hiển thị QR Check-in phòng tập).
  * Phân hệ Huấn luyện viên - PT (Quản lý lịch rảnh, Quét QR Check-in buổi tập cho học viên, Lên giáo án & nhận xét sau buổi tập).
  * Phân hệ Quản trị viên - Admin (Quản lý biến thể thực phẩm bổ sung, Nhập kho theo lô & Cảnh báo hàng cận date `inventory_batches`, Quản lý gói tập/khóa học, Duyệt đơn hàng, Thống kê doanh thu & lợi nhuận gộp).
* **3.2. Phân tích yêu cầu phi chức năng (Non-Functional Requirements):** Hiệu năng phản hồi API dưới 300ms, chống Race Condition khi hai học viên đặt cùng một ca PT hoặc mua sản phẩm cuối cùng trong lô hàng; giao diện đạt chuẩn độ tương phản dễ đọc WCAG AA.
* **3.3. Thiết kế Sơ đồ Use Case (Use Case Diagrams):**
  * Sơ đồ Use Case tổng quát toàn hệ thống.
  * Các sơ đồ Use Case phân rã và bảng đặc tả chi tiết (Use Case Specification) cho 6 luồng cốt lõi.
* **3.4. Thiết kế Luồng nghiệp vụ (Activity & Sequence Diagrams):**
  * Sơ đồ hoạt động và Sơ đồ tuần tự cho luồng Thanh toán giỏ hàng hỗn hợp kết hợp trừ lô FEFO, Đặt lịch & Quét QR Check-in PT, Lưu tiến độ xem video và Tư vấn AI theo TDEE.
* **3.5. Thiết kế Cơ sở dữ liệu (Database Design & ERD):**
  * Sơ đồ Thực thể - Liên kết (ERD) mức quan niệm và mức vật lý.
  * Đặc tả chi tiết **19 bảng dữ liệu chuẩn hóa 3NF**.
* **3.6. Thiết kế Hệ thống Giao diện Người dùng (UI/UX Design System) theo phong cách Selective Glassmorphism:** Quy chuẩn phân cấp lớp nền Solid/Gradient nhẹ, lớp kính mờ chọn lọc (Focal Glass Layer), hệ thống Typography đậm nét tương phản cao và bố cục tối giản (Xem chi tiết tại Mục 4).

### Chương 4: Hiện thực hóa hệ thống và Kiểm thử
* **4.1. Cấu trúc thư mục dự án (Monorepo hoặc tách Frontend/Backend):** Tổ chức mã nguồn sạch (Clean Architecture).
* **4.2. Cài đặt các chức năng tiêu biểu (Kèm đoạn code minh họa và ảnh chụp màn hình):**
  * Thuật toán tính BMI/TDEE kết hợp gọi Gemini API gợi ý Combo Khóa học + Thực phẩm bổ sung (tự động loại trừ sản phẩm chứa chất gây dị ứng như Lactose hoặc Caffeine liều cao).
  * Xử lý Database Transaction khi thanh toán giỏ hàng hỗn hợp: tự động tìm lô hàng `inventory_batches` có ngày hết hạn gần nhất còn tồn kho để trừ trước (FEFO), đồng thời kích hoạt quyền xem khóa học video và cộng số buổi PT.
  * Cơ chế sinh và xác thực mã QR động 60 giây khi học viên Check-in tại phòng tập.
  * Đồng bộ tiến độ xem video (`watched_seconds`) và điều kiện mở khóa hoàn thành bài học (xem tối thiểu 80% thời lượng).
* **4.3. Kiểm thử phần mềm (Software Testing):** Thiết kế kịch bản kiểm thử (Test Cases) cho API và giao diện theo phương pháp Black-box Testing.

### Chương 5: Kết luận và Hướng phát triển
* **5.1. Kết quả đạt được:** Đánh giá mức độ hoàn thành so với mục tiêu ban đầu.
* **5.2. Hạn chế của đề tài:** Những điểm cần tối ưu thêm về mặt vận hành thực tế.
* **5.3. Hướng phát triển tương lai:** Tích hợp AI Computer Vision (MediaPipe) chấm điểm tư thế tập qua camera điện thoại, phát triển ứng dụng di động React Native.

## 2. Phân Tích Sơ Đồ Use Case & Đặc Tả 6 Luồng Nghiệp Vụ Trọng Tâm

### 2.1. Danh sách Tác nhân (Actors) và Quyền hạn
| Tác nhân | Vai trò trong hệ thống | Các chức năng chính (Use Cases) |
| :--- | :--- | :--- |
| **Guest (Khách vãng lai)** | Người dùng chưa đăng nhập | Xem danh sách thực phẩm bổ sung (lọc theo danh mục, mùi vị, giá, không chứa Lactose/Caffeine), xem gói tập/khóa học, đo BMI/TDEE miễn phí, đăng ký tài khoản. |
| **Member (Hội viên / Khách hàng)** | Người dùng đã đăng nhập | Kế thừa quyền của Guest; nhận tư vấn thực đơn & Combo từ Trợ lý AI; mua sắm giỏ hàng hỗn hợp; học video trực tuyến (tự động lưu giây đang xem dở); đặt lịch tập 1-1 với PT; mở mã QR động trên điện thoại để Check-in vào phòng tập. |
| **Trainer (Huấn luyện viên - PT)** | Nhân sự chuyên môn phụ trách đào tạo | Đăng ký khung giờ làm việc; xem danh sách học viên phụ trách; quét mã QR của học viên để Check-in hoàn thành buổi tập PT 1-1; ghi chú mức tạ và nhận xét sau buổi tập. |
| **Admin (Quản trị viên)** | Người vận hành toàn bộ hệ thống | Quản lý người dùng & phân quyền; quản lý sản phẩm & biến thể; **nhập kho theo lô (Batch) và theo dõi cảnh báo hàng cận date**; quản lý gói tập & bài giảng video; duyệt đơn hàng; xem báo cáo doanh thu và **lợi nhuận gộp thực tế** (Giá bán trừ Giá nhập theo lô). |

### 2.2. Đặc tả chi tiết 6 Use Case cốt lõi (Dùng trực tiếp cho Chương 3 Báo cáo)

#### Use Case 01: Thanh toán Giỏ hàng Hỗn hợp & Xuất kho tự động theo Lô FEFO
* **Tác nhân chính:** Member (Hội viên), Cổng thanh toán (VNPay/MoMo).
* **Tiền điều kiện:** Người dùng đã đăng nhập; giỏ hàng có sản phẩm vật lý (Thực phẩm bổ sung) và/hoặc dịch vụ (Khóa học Video, Gói tập PT).
* **Luồng sự kiện chính:**
  1. Hội viên kiểm tra giỏ hàng, nhập địa chỉ giao hàng (nếu có sản phẩm vật lý) và chọn thanh toán qua VNPay/MoMo.
  2. Hệ thống tạo đơn hàng `Order` ở trạng thái `PENDING`.
  3. Sau khi khách quét mã thanh toán thành công, VNPay/MoMo gọi **Webhook (IPN)** về Backend Node.js.
  4. Backend khởi tạo một **Database Transaction** thực hiện tuần tự:
     * **Bước 4a (Thuật toán xuất kho FEFO cho Thực phẩm bổ sung):** Với mỗi biến thể thực phẩm bổ sung trong đơn, hệ thống truy vấn bảng `inventory_batches` theo điều kiện `remaining_quantity > 0` và `expiry_date > CURRENT_DATE`, sắp xếp theo `expiry_date ASC` (lô nào hết hạn trước được lấy ra trừ số lượng trước), đồng thời ghi nhận `batch_id` vào dòng `order_items` để tính giá vốn hàng bán (COGS) và truy xuất nguồn gốc lô hàng.
     * **Bước 4b (Kích hoạt Gói tập & Khóa học):** Tự động tạo bản ghi trong bảng `user_enrollments` với thời hạn `expires_at` tương ứng và cấp số buổi `remaining_pt_sessions`.
     * **Bước 4c:** Cập nhật trạng thái đơn hàng thành `PAID` và gửi thông báo xác nhận.

#### Use Case 02: Điểm danh Phòng tập & Buổi tập PT bằng Mã QR Động (Dynamic QR Check-in)
* **Tác nhân chính:** Member (Hội viên), Trainer (PT) hoặc Quầy lễ tân (Admin).
* **Tiền điều kiện:** Hội viên có thẻ tập `user_enrollments` đang ở trạng thái `ACTIVE` và còn hạn sử dụng.
* **Luồng sự kiện chính:**
  1. Khi đến phòng tập, Hội viên mở mục "Thẻ Tập QR" trên giao diện Web/Mobile.
  2. Hệ thống lấy `qr_secret_key` của thẻ tập kết hợp với mốc thời gian hiện tại (chia theo cửa sổ 60 giây) để sinh mã `qr_token` ngắn hạn và hiển thị dưới dạng mã QR kèm đồng hồ đếm ngược 60s.
  3. Lễ tân hoặc PT dùng thiết bị tại phòng tập quét mã QR của học viên.
  4. Hệ thống kiểm tra chữ ký số của `qr_token`, kiểm tra hạn thẻ `expires_at`:
     * Nếu là **Check-in tự tập (Gym Entry)**: Lưu bản ghi vào bảng `gym_checkins` với `checkin_type = 'GYM_ENTRY'`.
     * Nếu là **Check-in ca tập PT 1-1 (`PT_SESSION`)**: Đối chiếu với lịch hẹn `pt_bookings` trong ngày, chuyển trạng thái lịch hẹn sang `COMPLETED`, trừ 1 buổi trong `remaining_pt_sessions` và lưu log vào `gym_checkins`.

#### Use Case 03: Học Video Trực tuyến & Lưu vết Tiến độ chống tua bài (`user_lesson_progress`)
* **Tác nhân chính:** Member (Hội viên).
* **Luồng sự kiện chính:**
  1. Hội viên mở một bài giảng trong khóa học đã mua. Hệ thống truy vấn bảng `user_lesson_progress` để lấy vị trí giây đã xem lần trước (`last_position_sec`) và tự động tua trình phát video đến đúng vị trí đó (Resume Playback).
  2. Trong quá trình video phát, cứ mỗi 10 giây, trình phát gửi Heartbeat API cập nhật `watched_seconds` và `last_position_sec`.
  3. Khi tổng thời gian thực xem (`watched_seconds`) đạt từ **80% thời lượng bài giảng (`duration_seconds`)** trở lên, hệ thống tự động đánh dấu `is_completed = TRUE` cho bài học đó và tính lại phần trăm hoàn thành tổng khóa học (`progress_pct`) trong bảng `user_enrollments`.

#### Use Case 04: Tư vấn Thực đơn & Thực phẩm bổ sung bằng AI (Sàng lọc Dị ứng)
* **Tác nhân chính:** Member (Hội viên), Google Gemini API.
* **Luồng sự kiện chính:**
  1. Hội viên nhập thông số cơ thể (Chiều cao, Cân nặng, Tuổi, Mức độ vận động), chọn Mục tiêu (`MUSCLE_GAIN` / `FAT_LOSS`) và tích chọn các **Cơ địa nhạy cảm / Dị ứng** (ví dụ: `Bất dung nạp Lactose`, `Nhạy cảm với Caffeine`, `Ăn chay`).
  2. Hệ thống tính toán chính xác chỉ số BMI, BMR, TDEE và lượng chất đạm (Protein), tinh bột (Carb), chất béo (Fat) cần nạp mỗi ngày.
  3. Backend truy vấn CSDL để lọc ra danh sách các sản phẩm Thực phẩm bổ sung và Khóa học khớp với `target_goal` **và không chứa thành phần gây dị ứng** (dựa trên cột `allergen_tags` của sản phẩm — ví dụ loại bỏ Whey Concentrate nếu khách dị ứng Lactose, chỉ giữ lại Whey Hydrolyzed/Isolate hoặc Plant Protein).
  4. Hệ thống gửi thông số TDEE + danh sách sản phẩm đã lọc sang Gemini API để sinh lịch ăn uống mẫu 1 ngày kèm lời khuyên sử dụng thực phẩm bổ sung đúng thời điểm (Pre-workout trước tập 30 phút, Whey ngay sau tập), sau đó lưu kết quả vào bảng `ai_consultation_logs`.

#### Use Case 05: Đặt lịch tập 1-1 với Huấn luyện viên (Chống trùng ca)
* **Tác nhân chính:** Member (Hội viên), Trainer (PT).
* **Luồng sự kiện chính:** Hội viên chọn PT và ngày tập -> Hệ thống đối chiếu `trainer_availabilities` và `pt_bookings` để hiển thị ca trống -> Hội viên đặt lịch -> Ràng buộc Unique Index `(trainer_id, booking_date, start_time)` trên PostgreSQL chặn tuyệt đối trường hợp 2 học viên bấm đặt cùng lúc vào 1 ca.

#### Use Case 06: Quản lý Nhập kho theo Lô & Cảnh báo Hàng cận Date (Admin Batch Management)
* **Tác nhân chính:** Admin (Quản trị viên).
* **Luồng sự kiện chính:**
  1. Khi nhập một đợt hàng mới từ nhà phân phối (ví dụ: 50 hũ Whey Rule1 vị Chocolate lô `LOT-2026-A`), Admin tạo bản ghi trong bảng `inventory_batches` gồm: Số lượng nhập, Giá nhập (`import_price`), Ngày sản xuất và Ngày hết hạn (`expiry_date`).
  2. Hệ thống tự động cộng dồn tồn kho khả dụng (`stock_quantity`) lên bảng `supplement_variants`.
  3. Trên Dashboard Admin, hệ thống tự động lọc và hiển thị bảng cảnh báo màu đỏ/vàng cho các lô hàng có `expiry_date` còn dưới **60 ngày** để Admin kịp thời tạo chương trình Flash Sale xả kho.

## 3. Thiết Kế Cơ Sở Dữ Liệu Quan Hệ Chi Tiết (ERD - Bản Đầy Đủ 19 Bảng Chuẩn 3NF)

Hệ thống gồm **19 bảng dữ liệu chuẩn hóa 3NF** trên PostgreSQL, chia làm 5 phân vùng nghiệp vụ rõ rệt.

### 3.1. Phân vùng 1: Người dùng, Hồ sơ PT, Chỉ số Cơ thể & Tư vấn AI (4 Bảng)

#### 1. Bảng `users` (Tài khoản người dùng)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK, DEFAULT uuid_generate_v4()` | Khóa chính định danh người dùng |
| `email` | `VARCHAR(150)` | `UNIQUE, NOT NULL` | Email đăng nhập |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Mật khẩu mã hóa Bcrypt |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Họ và tên đầy đủ |
| `phone` | `VARCHAR(20)` | `UNIQUE` | Số điện thoại liên hệ & nhận hàng |
| `avatar_url` | `TEXT` | `NULL` | Ảnh đại diện |
| `role` | `ENUM` | `NOT NULL DEFAULT 'MEMBER'` | Vai trò: `MEMBER`, `TRAINER`, `ADMIN` |
| `status` | `ENUM` | `NOT NULL DEFAULT 'ACTIVE'` | Trạng thái: `ACTIVE`, `LOCKED` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Thời điểm tạo tài khoản |

#### 2. Bảng `trainer_profiles` (Hồ sơ chuyên môn Huấn luyện viên)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính hồ sơ PT |
| `user_id` | `UUID` | `FK -> users(id), UNIQUE` | Liên kết 1-1 với tài khoản `users` có role `TRAINER` |
| `bio` | `TEXT` | `NOT NULL` | Giới thiệu kinh nghiệm, thành tích thi đấu |
| `specialties` | `VARCHAR(255)` | `NOT NULL` | Chuyên môn (VD: Hypertrophy, Powerlifting, Rehab) |
| `certifications` | `JSONB` | `NULL` | Danh sách chứng chỉ (NASM, ACE, ISSA...) |
| `years_experience` | `INT` | `DEFAULT 1` | Số năm kinh nghiệm huấn luyện |
| `rating_avg` | `DECIMAL(3,2)` | `DEFAULT 5.00` | Điểm đánh giá trung bình từ học viên |

#### 3. Bảng `body_metrics_logs` (Lịch sử đo chỉ số cơ thể & TDEE)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính bản ghi đo |
| `user_id` | `UUID` | `FK -> users(id)` | Học viên thực hiện đo |
| `height_cm` | `DECIMAL(5,2)` | `NOT NULL` | Chiều cao (cm) |
| `weight_kg` | `DECIMAL(5,2)` | `NOT NULL` | Cân nặng (kg) |
| `body_fat_pct` | `DECIMAL(4,2)` | `NULL` | Tỷ lệ mỡ cơ thể (%) nếu đo InBody |
| `activity_level` | `DECIMAL(3,2)` | `NOT NULL` | Hệ số vận động (1.2 đến 1.9) |
| `bmi` | `DECIMAL(4,2)` | `NOT NULL` | Chỉ số BMI tính tự động |
| `tdee_calories` | `INT` | `NOT NULL` | Năng lượng tiêu hao mỗi ngày (Kcal) |
| `fitness_goal` | `ENUM` | `NOT NULL` | Mục tiêu: `MUSCLE_GAIN`, `FAT_LOSS`, `ENDURANCE` |
| `allergies` | `TEXT[]` | `DEFAULT '{}'` | Mảng dị ứng của học viên (VD: `['LACTOSE', 'CAFFEINE']`) |
| `recorded_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Ngày ghi nhận chỉ số |

#### 4. Bảng `ai_consultation_logs` (Lưu lịch sử Trợ lý AI tư vấn Thực đơn & Combo)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính phiên tư vấn AI |
| `user_id` | `UUID` | `FK -> users(id)` | Học viên nhận tư vấn |
| `metrics_log_id` | `UUID` | `FK -> body_metrics_logs(id)` | Dựa trên lần đo TDEE nào |
| `target_macros` | `JSONB` | `NOT NULL` | Macro mục tiêu (`{calories: 2400, protein_g: 180, carbs_g: 250, fat_g: 70}`) |
| `excluded_allergens`| `TEXT[]` | `DEFAULT '{}'` | Các chất gây dị ứng đã được AI lọc bỏ (Lactose, Gluten, Caffeine...) |
| `meal_plan_markdown`| `TEXT` | `NOT NULL` | Thực đơn dinh dưỡng trong ngày do AI sinh ra |
| `recommended_items` | `JSONB` | `NOT NULL` | Danh sách ID Thực phẩm bổ sung & Khóa học được AI ghép thành Combo |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Thời gian tạo bản tư vấn |

### 3.2. Phân vùng 2: Thực phẩm bổ sung, Biến thể & Quản lý Lô Hạn sử dụng FEFO (4 Bảng)

#### 5. Bảng `categories` (Danh mục sản phẩm & khóa học)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính danh mục |
| `name` | `VARCHAR(100)` | `NOT NULL` | Tên danh mục (Whey Protein, Creatine, Khóa giảm mỡ...) |
| `slug` | `VARCHAR(120)` | `UNIQUE, NOT NULL` | Đường dẫn tĩnh chuẩn SEO |
| `category_type` | `ENUM` | `NOT NULL` | Phân loại: `SUPPLEMENT` hoặc `COURSE` |
| `parent_id` | `UUID` | `FK -> categories(id), NULL` | Hỗ trợ danh mục đa cấp |

#### 6. Bảng `supplement_products` (Thông tin chung Thực phẩm bổ sung)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính sản phẩm |
| `category_id` | `UUID` | `FK -> categories(id)` | Thuộc danh mục thực phẩm bổ sung |
| `name` | `VARCHAR(200)` | `NOT NULL` | Tên sản phẩm (VD: Optimum Nutrition Gold Standard 100% Whey) |
| `slug` | `VARCHAR(220)` | `UNIQUE, NOT NULL` | URL thân thiện SEO |
| `brand` | `VARCHAR(100)` | `NOT NULL` | Thương hiệu (ON, Rule1, Dymatize, MyProtein...) |
| `origin_country` | `VARCHAR(80)` | `NULL` | Xuất xứ (USA, UK, Canada...) |
| `description` | `TEXT` | `NOT NULL` | Bài viết mô tả chi tiết công dụng và cách dùng |
| `nutrition_facts` | `JSONB` | `NOT NULL` | Bảng thành phần dinh dưỡng mỗi muỗng (Serving size, Calories, Protein, BCAAs) |
| `allergen_tags` | `TEXT[]` | `DEFAULT '{}'` | Nhãn cảnh báo dị ứng (VD: `['LACTOSE', 'SOY']`, `['HIGH_CAFFEINE']`) phục vụ bộ lọc AI |
| `target_goal` | `ENUM` | `NOT NULL` | Phục vụ gợi ý TDEE: `MUSCLE_GAIN`, `FAT_LOSS`, `ENDURANCE`, `RECOVERY` |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Trạng thái hiển thị trên cửa hàng |

#### 7. Bảng `supplement_variants` (Biến thể Mùi vị - Trọng lượng - Tổng tồn kho)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính biến thể (SKU) |
| `product_id` | `UUID` | `FK -> supplement_products(id)` | Liên kết tới sản phẩm gốc |
| `sku` | `VARCHAR(80)` | `UNIQUE, NOT NULL` | Mã quản lý kho (VD: `ON-WHEY-5LB-CHOCO`) |
| `flavor` | `VARCHAR(80)` | `NOT NULL` | Hương vị (Double Rich Chocolate, Vanilla Ice Cream...) |
| `weight_label` | `VARCHAR(50)` | `NOT NULL` | Quy cách đóng gói (5 Lbs / 2.27kg, 30 Servings...) |
| `servings_count` | `INT` | `NOT NULL DEFAULT 30` | Tổng số lần dùng (muỗng) trong 1 hộp |
| `weight_grams` | `INT` | `NOT NULL` | Trọng lượng quy đổi ra gram (dùng để tính phí ship) |
| `price` | `DECIMAL(12,2)` | `NOT NULL` | Giá bán niêm yết (VNĐ) |
| `sale_price` | `DECIMAL(12,2)` | `NULL` | Giá khuyến mãi (VNĐ) |
| `stock_quantity` | `INT` | `NOT NULL DEFAULT 0` | Tổng tồn kho khả dụng (Cộng dồn từ các lô còn hạn trong `inventory_batches`) |
| `image_url` | `TEXT` | `NULL` | Ảnh bao bì riêng của biến thể hương vị đó |

#### 8. Bảng `inventory_batches` (Quản lý Lô nhập kho & Hạn sử dụng theo chuẩn FEFO)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính lô hàng |
| `variant_id` | `UUID` | `FK -> supplement_variants(id)` | Thuộc biến thể sản phẩm nào |
| `batch_code` | `VARCHAR(60)` | `NOT NULL` | Mã số lô in trên vỏ hộp (VD: `LOT-2026-08A`) |
| `supplier_name` | `VARCHAR(150)` | `NULL` | Nhà phân phối cung cấp lô hàng |
| `import_price` | `DECIMAL(12,2)` | `NOT NULL` | Giá vốn nhập vào trên mỗi sản phẩm (Dùng để tính lợi nhuận ròng) |
| `initial_quantity` | `INT` | `NOT NULL` | Số lượng nhập ban đầu của lô |
| `remaining_quantity`| `INT` | `NOT NULL` | Số lượng còn lại hiện tại trong lô |
| `manufactured_date` | `DATE` | `NULL` | Ngày sản xuất (MFG) |
| `expiry_date` | `DATE` | `NOT NULL` | Hạn sử dụng (EXP) - Đánh Index để xuất kho theo thứ tự `expiry_date ASC` (FEFO) |
| `batch_status` | `ENUM` | `DEFAULT 'AVAILABLE'` | Trạng thái: `AVAILABLE`, `NEAR_EXPIRY` (Cận date dưới 60 ngày), `EXPIRED`, `DEPLETED` |
| `imported_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Ngày nhập kho |

### 3.3. Phân vùng 3: Gói tập Phòng Gym, Khóa học Video & Lưu tiến độ bài học (4 Bảng)

#### 9. Bảng `courses_memberships` (Gói tập Offline, PT 1-1 và Khóa học Video Online)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính khóa học / gói tập |
| `category_id` | `UUID` | `FK -> categories(id)` | Danh mục khóa học |
| `trainer_id` | `UUID` | `FK -> users(id), NULL` | Giảng viên phụ trách |
| `title` | `VARCHAR(200)` | `NOT NULL` | Tên khóa học / gói tập (VD: Gói PT 1-1 Độ Body 12 Tuần) |
| `slug` | `VARCHAR(220)` | `UNIQUE, NOT NULL` | Đường dẫn tĩnh |
| `course_type` | `ENUM` | `NOT NULL` | Loại hình: `ONLINE_VIDEO`, `GYM_MEMBERSHIP`, `PT_PACKAGE`, `HYBRID_COMBO` |
| `level` | `ENUM` | `NOT NULL` | Trình độ: `BEGINNER`, `INTERMEDIATE`, `ADVANCED` |
| `target_goal` | `ENUM` | `NOT NULL` | Mục tiêu: `MUSCLE_GAIN`, `FAT_LOSS`, `ENDURANCE` |
| `price` | `DECIMAL(12,2)` | `NOT NULL` | Học phí / Giá gói tập (VNĐ) |
| `duration_days` | `INT` | `NOT NULL` | Thời hạn hiệu lực của gói (30, 90, 365 ngày) |
| `pt_sessions_included`| `INT` | `NOT NULL DEFAULT 0` | Số buổi tập 1-1 với PT đi kèm |
| `thumbnail_url` | `TEXT` | `NOT NULL` | Ảnh bìa khóa học |
| `preview_video_url` | `TEXT` | `NULL` | Video giới thiệu khóa học (Xem miễn phí) |

#### 10. Bảng `course_modules` (Chương học / Giai đoạn huấn luyện)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính chương học |
| `course_id` | `UUID` | `FK -> courses_memberships(id)` | Thuộc khóa học nào |
| `title` | `VARCHAR(150)` | `NOT NULL` | Tên chương (VD: Tuần 1-2: Kỹ thuật Compound nền tảng) |
| `sort_order` | `INT` | `NOT NULL` | Thứ tự hiển thị chương |

#### 11. Bảng `course_lessons` (Bài giảng Video chi tiết & Hướng dẫn kỹ thuật)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính bài học |
| `module_id` | `UUID` | `FK -> course_modules(id)` | Thuộc chương học nào |
| `title` | `VARCHAR(200)` | `NOT NULL` | Tên bài tập (VD: Kỹ thuật Barbell Squat chuẩn tránh đau lưng dưới) |
| `video_url` | `TEXT` | `NOT NULL` | Đường dẫn luồng phát video (HLS / Mux / Cloudinary) |
| `duration_seconds` | `INT` | `NOT NULL` | Tổng thời lượng video (giây) |
| `workout_guide_md` | `TEXT` | `NULL` | Hướng dẫn số Hiệp (Sets), số Lần lặp (Reps), thời gian nghỉ (Rest) |
| `is_free_preview` | `BOOLEAN` | `DEFAULT FALSE` | Cho phép học thử miễn phí hay không |
| `sort_order` | `INT` | `NOT NULL` | Thứ tự bài học trong chương |

#### 12. Bảng `user_lesson_progress` (Lưu vị trí xem Video & Chống tua bài)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính tiến độ bài học |
| `enrollment_id` | `UUID` | `FK -> user_enrollments(id)` | Thuộc thẻ ghi danh nào của học viên |
| `user_id` | `UUID` | `FK -> users(id)` | Học viên đang xem |
| `lesson_id` | `UUID` | `FK -> course_lessons(id)` | Bài giảng video đang xem |
| `watched_seconds` | `INT` | `NOT NULL DEFAULT 0` | Tổng số giây thực tế học viên đã xem (cập nhật qua Heartbeat mỗi 10s) |
| `last_position_sec` | `INT` | `NOT NULL DEFAULT 0` | Vị trí giây dừng lại gần nhất (phục vụ tính năng Resume Playback) |
| `is_completed` | `BOOLEAN` | `DEFAULT FALSE` | Tự động chuyển thành `TRUE` khi `watched_seconds >= 0.8 * duration_seconds` |
| `completed_at` | `TIMESTAMPTZ` | `NULL` | Thời điểm hoàn thành bài học |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Lần xem gần nhất (Ràng buộc Unique trên `user_id, lesson_id`) |

### 3.4. Phân vùng 4: Thẻ Hội viên, Đặt lịch PT 1-1 & Điểm danh QR Động (4 Bảng)

#### 13. Bảng `user_enrollments` (Thẻ tập & Khóa học học viên đã mua)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính thẻ ghi danh |
| `user_id` | `UUID` | `FK -> users(id)` | Học viên sở hữu |
| `course_id` | `UUID` | `FK -> courses_memberships(id)` | Gói tập / khóa học đã mua |
| `order_id` | `UUID` | `FK -> orders(id)` | Được kích hoạt từ đơn hàng nào |
| `assigned_trainer_id`| `UUID` | `FK -> users(id), NULL` | PT phụ trách chính |
| `qr_secret_key` | `VARCHAR(128)` | `UNIQUE, NOT NULL` | Khóa bí mật riêng của thẻ để sinh mã QR động TOTP 60 giây |
| `activated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Ngày bắt đầu kích hoạt gói |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | Ngày hết hạn gói tập |
| `total_pt_sessions` | `INT` | `NOT NULL DEFAULT 0` | Tổng số buổi PT được cấp ban đầu |
| `remaining_pt_sessions`| `INT` | `NOT NULL DEFAULT 0` | Số buổi PT còn lại có thể đặt lịch |
| `progress_pct` | `DECIMAL(5,2)` | `DEFAULT 0.00` | Tiến độ hoàn thành video bài giảng (%) |
| `status` | `ENUM` | `DEFAULT 'ACTIVE'` | Trạng thái: `ACTIVE`, `EXPIRED`, `FROZEN` |

#### 14. Bảng `trainer_availabilities` (Khung giờ làm việc của PT)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính ca làm việc |
| `trainer_id` | `UUID` | `FK -> users(id)` | Huấn luyện viên |
| `day_of_week` | `INT` | `CHECK (day_of_week BETWEEN 0 AND 6)` | Thứ trong tuần (0: Chủ nhật -> 6: Thứ Bảy) |
| `start_time` | `TIME` | `NOT NULL` | Giờ bắt đầu ca (VD: `08:00:00`) |
| `end_time` | `TIME` | `NOT NULL` | Giờ kết thúc ca (VD: `09:00:00`) |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Trạng thái mở nhận học viên |

#### 15. Bảng `pt_bookings` (Lịch hẹn tập 1-1 giữa Học viên và PT)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính lịch hẹn |
| `enrollment_id` | `UUID` | `FK -> user_enrollments(id)` | Trích xuất buổi tập từ thẻ tập nào |
| `member_id` | `UUID` | `FK -> users(id)` | Học viên đặt lịch |
| `trainer_id` | `UUID` | `FK -> users(id)` | PT hướng dẫn |
| `booking_date` | `DATE` | `NOT NULL` | Ngày tập cụ thể (VD: `2026-11-15`) |
| `start_time` | `TIME` | `NOT NULL` | Giờ bắt đầu (VD: `18:00:00`) |
| `end_time` | `TIME` | `NOT NULL` | Giờ kết thúc (VD: `19:00:00`) |
| `focus_area` | `VARCHAR(150)` | `NULL` | Nhóm cơ tập trung (VD: Ngực - Tay sau, Chân - Mông) |
| `trainer_notes` | `TEXT` | `NULL` | Nhận xét của PT sau buổi tập |
| `status` | `ENUM` | `DEFAULT 'CONFIRMED'` | Trạng thái: `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` |

#### 16. Bảng `gym_checkins` (Nhật ký Quét mã QR Động ra vào phòng tập & Điểm danh PT)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính lượt Check-in |
| `enrollment_id` | `UUID` | `FK -> user_enrollments(id)` | Thẻ tập được quét |
| `member_id` | `UUID` | `FK -> users(id)` | Hội viên vào tập |
| `pt_booking_id` | `UUID` | `FK -> pt_bookings(id), NULL` | Liên kết tới lịch hẹn PT (nếu quét QR để điểm danh buổi tập PT 1-1) |
| `verified_by_id` | `UUID` | `FK -> users(id), NULL` | Lễ tân hoặc PT thực hiện quét mã xác nhận |
| `checkin_type` | `ENUM` | `NOT NULL` | Loại hình: `GYM_ENTRY` (Tự tập) hoặc `PT_SESSION` (Tập cùng PT) |
| `qr_token_hash` | `VARCHAR(128)` | `NOT NULL` | Lưu vết mã băm QR TOTP tại thời điểm quét (chống Replay Attack) |
| `checkin_time` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Thời gian quét QR vào cửa |
| `checkout_time` | `TIMESTAMPTZ` | `NULL` | Thời gian rời phòng tập |

### 3.5. Phân vùng 5: Giỏ hàng Hỗn hợp, Đơn hàng & Thanh toán (3 Bảng)

#### 17. Bảng `vouchers` (Mã giảm giá khuyến mãi)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính mã giảm giá |
| `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Mã nhập (VD: `GYMHUB50`, `WHEYCOMBO`) |
| `discount_type` | `ENUM` | `NOT NULL` | Loại giảm: `PERCENTAGE` hoặc `FIXED_AMOUNT` |
| `discount_value` | `DECIMAL(12,2)` | `NOT NULL` | Giá trị giảm (% hoặc số tiền VNĐ) |
| `min_order_value` | `DECIMAL(12,2)` | `DEFAULT 0` | Giá trị đơn hàng tối thiểu được áp dụng |
| `usage_limit` | `INT` | `NOT NULL` | Tổng số lượt sử dụng tối đa |
| `used_count` | `INT` | `DEFAULT 0` | Số lượt đã sử dụng |
| `valid_until` | `TIMESTAMPTZ` | `NOT NULL` | Thời hạn hiệu lực |

#### 18. Bảng `orders` (Đơn hàng tổng hợp)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính đơn hàng |
| `order_code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Mã đơn hàng hiển thị (VD: `GH-20261108-8921`) |
| `user_id` | `UUID` | `FK -> users(id)` | Khách hàng đặt mua |
| `voucher_id` | `UUID` | `FK -> vouchers(id), NULL` | Mã giảm giá đã áp dụng |
| `has_physical_items` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Đánh dấu đơn có chứa Thực phẩm bổ sung cần giao hàng vật lý |
| `shipping_address` | `JSONB` | `NULL` | Địa chỉ nhận hàng |
| `subtotal_amount` | `DECIMAL(12,2)` | `NOT NULL` | Tổng tiền hàng tạm tính |
| `shipping_fee` | `DECIMAL(12,2)` | `DEFAULT 0` | Phí vận chuyển |
| `discount_amount` | `DECIMAL(12,2)` | `DEFAULT 0` | Số tiền được giảm |
| `total_amount` | `DECIMAL(12,2)` | `NOT NULL` | Tổng tiền thanh toán cuối cùng |
| `payment_method` | `ENUM` | `NOT NULL` | Phương thức: `VNPAY`, `MOMO`, `PAYOS`, `COD` |
| `payment_status` | `ENUM` | `DEFAULT 'PENDING'` | Trạng thái thanh toán: `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| `fulfillment_status`| `ENUM` | `DEFAULT 'PROCESSING'` | Trạng thái giao vận: `DIGITAL_ONLY`, `PROCESSING`, `SHIPPING`, `DELIVERED`, `CANCELLED` |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Thời gian tạo đơn |

#### 19. Bảng `order_items` (Chi tiết từng dòng sản phẩm/khóa học kèm Truy vết Lô FEFO)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PK` | Khóa chính dòng chi tiết đơn hàng |
| `order_id` | `UUID` | `FK -> orders(id)` | Thuộc đơn hàng nào |
| `item_type` | `ENUM` | `NOT NULL` | Phân loại: `SUPPLEMENT_VARIANT` hoặc `COURSE_MEMBERSHIP` |
| `supplement_variant_id`| `UUID` | `FK -> supplement_variants(id), NULL` | Điền giá trị nếu `item_type = 'SUPPLEMENT_VARIANT'` |
| `allocated_batch_id` | `UUID` | `FK -> inventory_batches(id), NULL` | **Liên kết tới Lô hàng FEFO đã xuất** (giúp biết chính xác hộp Whey giao cho khách thuộc lô nào, hạn dùng ngày nào và giá vốn bao nhiêu) |
| `course_id` | `UUID` | `FK -> courses_memberships(id), NULL` | Điền giá trị nếu `item_type = 'COURSE_MEMBERSHIP'` |
| `item_name_snapshot` | `VARCHAR(255)` | `NOT NULL` | Lưu cứng tên sản phẩm/khóa học tại thời điểm mua |
| `quantity` | `INT` | `NOT NULL DEFAULT 1` | Số lượng mua |
| `unit_price` | `DECIMAL(12,2)` | `NOT NULL` | Đơn giá bán tại thời điểm mua (VNĐ) |
| `line_total` | `DECIMAL(12,2)` | `NOT NULL` | Thành tiền (`quantity * unit_price`) |

## 4. Đặc Tả Hệ Thống Thiết Kế UI/UX: Selective Glassmorphism (Kính Mờ Chọn Lọc & Tối Giản)

Để khắc phục hoàn toàn tình trạng giao diện rối rắm, nặng nề thường thấy ở các website thương mại điện tử đa năng, hệ thống **GymHub** áp dụng ngôn ngữ thiết kế **Selective Glassmorphism (Kính mờ có chọn lọc)** kết hợp **Clean Solid Surfaces (Bề mặt đặc tinh gọn)**.

### 4.1. Triết lý cốt lõi: "Kính mờ dẫn dắt điểm nhìn, nền Solid bảo vệ khả năng đọc"
Thay vì lạm dụng hiệu ứng kính trong suốt (`backdrop-blur`) cho mọi phần tử gây nhiễu thị giác và mỏi mắt, hệ thống phân chia chặt chẽ **3 tầng chiều sâu thị giác (3-Tier Visual Depth Hierarchy)**:

| Tầng thị giác (Visual Layer) | Thành phần áp dụng | Quy chuẩn CSS / Tailwind CSS | Mục đích UX & Khả năng tiếp cận |
| :--- | :--- | :--- | :--- |
| **Tầng 0: Nền móng (Base Canvas)** | Toàn bộ nền trang web (`body`, `main`) | Nền sáng thanh lịch (`bg-slate-50`) kết hợp dải **Mesh Gradient cực nhẹ** ở phần đầu trang (`bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-50/40`). Tuyệt đối không dùng ảnh nền rối mắt xuyên suốt trang. | Tạo không gian thoáng đãng, sạch sẽ và làm chất xúc tác để các lớp kính mờ phía trên nổi bật tự nhiên. |
| **Tầng 1: Bề mặt Nội dung Đọc (Solid Content Surfaces - 75% diện tích)** | Danh sách thẻ sản phẩm Whey, Bảng thông số dinh dưỡng, Bảng dữ liệu lô hàng FEFO, Lịch sử đơn hàng, Ô nhập liệu Form (`input`, `select`). | **Nền đặc hoàn toàn (`bg-white`)**, viền mảnh sắc nét (`border border-slate-200/80`), bo góc mềm (`rounded-2xl`), đổ bóng mịn (`shadow-sm hover:shadow-md transition-all`). | Đảm bảo **độ tương phản tối đa** cho chữ viết, giá tiền, hạn sử dụng và bảng biểu. Người dùng đọc thông tin lâu không bị hoa mắt. |
| **Tầng 2: Lớp Kính Mờ Chọn Lọc (Selective Glass Layer - 25% điểm nhấn)** | Chỉ áp dụng cho **5 thành phần dẫn dắt sự tập trung**:<br>1. Thanh điều hướng nổi (`Sticky Navbar`)<br>2. Khối tiêu điểm Hero / Tóm tắt chỉ số TDEE & Macro<br>3. Ngăn kéo Giỏ hàng hỗn hợp (`Slide-over Cart Drawer`)<br>4. Thẻ Hội viên & Mã QR Động 60s (`Member QR Pass`)<br>5. Hộp thoại xác nhận / Thông báo nổi (`Modal / Toast`) | `bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.06)] rounded-3xl` (Hoặc kính tối điểm nhấn cho Thẻ VIP QR: `bg-slate-900/80 backdrop-blur-xl border border-white/15 text-white`). | Tách biệt rõ lớp điều hướng và các thẻ tương tác quan trọng nổi hẳn lên trên bề mặt nội dung, tạo chiều sâu tinh tế như hệ điều hành macOS / iOS. |

### 4.2. Quy chuẩn Typography & Độ tương phản (High-Contrast Typography)
* **Font chữ chủ đạo:** `Plus Jakarta Sans` hoặc `Inter` cho văn bản giao diện; `JetBrains Mono` cho Mã lô hàng (`LOT-2026`), Mã QR Token và Giá tiền.
* **Độ đậm và Tương phản chữ trên nền kính:**
  * Tiêu đề chính (Headings): Bắt buộc dùng font đậm (`font-bold` hoặc `font-extrabold`, `tracking-tight`, màu `text-slate-900`) để nét chữ sắc sảo, không bị nhòe vào hiệu ứng blur phía sau.
  * Văn bản thông tin (Body text): Màu `text-slate-700` (`font-medium`), tuyệt đối không dùng chữ xám nhạt (`text-slate-400`) trên nền kính mờ.
* **Bảng màu tinh gọn (3-Color Rule):**
  * **Màu chủ đạo (Primary Focus):** Xanh Ngọc Lục Bảo Đậm (`emerald-600` / `#059669`) — đại diện cho Sức khỏe, Dinh dưỡng sạch và trạng thái Hoàn thành/An toàn.
  * **Màu hành động (Secondary Accent):** Xanh Chàm Hiện Đại (`indigo-600` / `#4F46E5`) — dùng cho Khóa học Online, Trợ lý AI và Đặt lịch PT.
  * **Màu cảnh báo nghiệp vụ (Semantic Status):** Cam Hổ Phách (`amber-600` cho Lô hàng cận date dưới 60 ngày) và Đỏ San Hô (`rose-600` cho Lô hết hạn hoặc Cảnh báo dị ứng Lactose/Caffeine).

### 4.3. Quy tắc Bố cục Tinh Gọn (Anti-Clutter Layout Rules)
1. **Không lồng kính trong kính (No Nested Glass):** Một thẻ kính mờ (`backdrop-blur`) không bao giờ chứa một thẻ `backdrop-blur` khác bên trong. Các phần tử con nằm trong панель kính mờ phải dùng nền đặc (`bg-white` hoặc `bg-slate-900/5`).
2. **Khoảng thở rộng rãi (Generous Whitespace):** Mỗi hàng chỉ hiển thị tối đa **3 đến 4 thẻ sản phẩm/khóa học** (`gap-6`), padding bên trong thẻ tối thiểu `p-6` để giao diện thoáng và sang trọng.
3. **Tối giản thông tin trên Card:** Mỗi thẻ sản phẩm ở trang danh sách chỉ hiển thị đúng 4 thông tin: Ảnh sản phẩm, Tên + Thương hiệu, Nhãn mục tiêu/Không dị ứng (1-2 badge nhỏ gọn), và Giá bán + Nút thêm vào giỏ. Mọi thông số chi tiết (Nutrition Facts, danh sách Lô hàng FEFO) chỉ hiển thị khi mở Modal hoặc trang chi tiết.

## 5. Mã Khởi Tạo Schema Prisma (`schema.prisma`) Đầy Đủ Cho Next.js + Node.js

Đoạn mã `schema.prisma` dưới đây giữ nguyên toàn bộ 19 bảng chuẩn 3NF của hệ thống:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  MEMBER
  TRAINER
  ADMIN
}

enum FitnessGoal {
  MUSCLE_GAIN
  FAT_LOSS
  ENDURANCE
  RECOVERY
}

enum CourseType {
  ONLINE_VIDEO
  GYM_MEMBERSHIP
  PT_PACKAGE
  HYBRID_COMBO
}

enum BatchStatus {
  AVAILABLE
  NEAR_EXPIRY
  EXPIRED
  DEPLETED
}

enum CheckinType {
  GYM_ENTRY
  PT_SESSION
}

enum OrderItemType {
  SUPPLEMENT_VARIANT
  COURSE_MEMBERSHIP
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum BookingStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}

model User {
  id              String               @id @default(uuid())
  email           String               @unique
  passwordHash    String               @map("password_hash")
  fullName        String               @map("full_name")
  phone           String?              @unique
  avatarUrl       String?              @map("avatar_url")
  role            UserRole             @default(MEMBER)
  createdAt       DateTime             @default(now()) @map("created_at")

  trainerProfile  TrainerProfile?
  bodyMetrics     BodyMetricsLog[]
  aiConsultations AiConsultationLog[]
  enrollments     UserEnrollment[]     @relation("MemberEnrollments")
  ptAssigned      UserEnrollment[]     @relation("TrainerEnrollments")
  lessonProgress  UserLessonProgress[]
  memberBookings  PtBooking[]          @relation("MemberBookings")
  trainerBookings PtBooking[]          @relation("TrainerBookings")
  memberCheckins  GymCheckin[]         @relation("MemberCheckins")
  staffVerified   GymCheckin[]         @relation("StaffVerifiedCheckins")
  orders          Order[]

  @@map("users")
}

model TrainerProfile {
  id              String   @id @default(uuid())
  userId          String   @unique @map("user_id")
  bio             String
  specialties     String
  certifications  Json?
  yearsExperience Int      @default(1) @map("years_experience")
  ratingAvg       Decimal  @default(5.00) @map("rating_avg") @db.Decimal(3, 2)

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("trainer_profiles")
}

model BodyMetricsLog {
  id              String              @id @default(uuid())
  userId          String              @map("user_id")
  heightCm        Decimal             @map("height_cm") @db.Decimal(5, 2)
  weightKg        Decimal             @map("weight_kg") @db.Decimal(5, 2)
  bodyFatPct      Decimal?            @map("body_fat_pct") @db.Decimal(4, 2)
  activityLevel   Decimal             @map("activity_level") @db.Decimal(3, 2)
  bmi             Decimal             @db.Decimal(4, 2)
  tdeeCalories    Int                 @map("tdee_calories")
  fitnessGoal     FitnessGoal         @map("fitness_goal")
  allergies       String[]            @default([])
  recordedAt      DateTime            @default(now()) @map("recorded_at")

  user            User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  aiConsultations AiConsultationLog[]

  @@map("body_metrics_logs")
}

model AiConsultationLog {
  id                String         @id @default(uuid())
  userId            String         @map("user_id")
  metricsLogId      String         @map("metrics_log_id")
  targetMacros      Json           @map("target_macros")
  excludedAllergens String[]       @default([]) @map("excluded_allergens")
  mealPlanMarkdown  String         @map("meal_plan_markdown")
  recommendedItems  Json           @map("recommended_items")
  createdAt         DateTime       @default(now()) @map("created_at")

  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  metricsLog        BodyMetricsLog @relation(fields: [metricsLogId], references: [id], onDelete: Cascade)

  @@map("ai_consultation_logs")
}

model SupplementProduct {
  id             String              @id @default(uuid())
  name           String
  slug           String              @unique
  brand          String
  originCountry  String?             @map("origin_country")
  description    String
  nutritionFacts Json                @map("nutrition_facts")
  allergenTags   String[]            @default([]) @map("allergen_tags")
  targetGoal     FitnessGoal         @map("target_goal")
  isActive       Boolean             @default(true) @map("is_active")

  variants       SupplementVariant[]

  @@map("supplement_products")
}

model SupplementVariant {
  id            String            @id @default(uuid())
  productId     String            @map("product_id")
  sku           String            @unique
  flavor        String
  weightLabel   String            @map("weight_label")
  servingsCount Int               @default(30) @map("servings_count")
  weightGrams   Int               @map("weight_grams")
  price         Decimal           @db.Decimal(12, 2)
  salePrice     Decimal?          @map("sale_price") @db.Decimal(12, 2)
  stockQuantity Int               @default(0) @map("stock_quantity")
  imageUrl      String?           @map("image_url")

  product       SupplementProduct @relation(fields: [productId], references: [id], onDelete: Cascade)
  batches       InventoryBatch[]
  orderItems    OrderItem[]

  @@map("supplement_variants")
}

model InventoryBatch {
  id                String            @id @default(uuid())
  variantId         String            @map("variant_id")
  batchCode         String            @map("batch_code")
  supplierName      String?           @map("supplier_name")
  importPrice       Decimal           @map("import_price") @db.Decimal(12, 2)
  initialQuantity   Int               @map("initial_quantity")
  remainingQuantity Int               @map("remaining_quantity")
  manufacturedDate  DateTime?         @map("manufactured_date") @db.Date
  expiryDate        DateTime          @map("expiry_date") @db.Date
  batchStatus       BatchStatus       @default(AVAILABLE) @map("batch_status")
  importedAt        DateTime          @default(now()) @map("imported_at")

  variant           SupplementVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  allocatedItems    OrderItem[]

  @@index([variantId, expiryDate])
  @@map("inventory_batches")
}

model CourseMembership {
  id                 String           @id @default(uuid())
  title              String
  slug               String           @unique
  courseType         CourseType       @map("course_type")
  targetGoal         FitnessGoal      @map("target_goal")
  price              Decimal          @db.Decimal(12, 2)
  durationDays       Int              @map("duration_days")
  ptSessionsIncluded Int              @default(0) @map("pt_sessions_included")
  thumbnailUrl       String           @map("thumbnail_url")

  modules            CourseModule[]
  enrollments        UserEnrollment[]
  orderItems         OrderItem[]

  @@map("courses_memberships")
}

model CourseModule {
  id        String           @id @default(uuid())
  courseId  String           @map("course_id")
  title     String
  sortOrder Int              @map("sort_order")

  course    CourseMembership @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons   CourseLesson[]

  @@map("course_modules")
}

model CourseLesson {
  id              String               @id @default(uuid())
  moduleId        String               @map("module_id")
  title           String
  videoUrl        String               @map("video_url")
  durationSeconds Int                  @map("duration_seconds")
  workoutGuideMd  String?              @map("workout_guide_md")
  isFreePreview   Boolean              @default(false) @map("is_free_preview")
  sortOrder       Int                  @map("sort_order")

  module          CourseModule         @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  progressRecords UserLessonProgress[]

  @@map("course_lessons")
}

model UserEnrollment {
  id                  String               @id @default(uuid())
  userId              String               @map("user_id")
  courseId            String               @map("course_id")
  orderId             String               @map("order_id")
  assignedTrainerId   String?              @map("assigned_trainer_id")
  qrSecretKey         String               @unique @map("qr_secret_key")
  activatedAt         DateTime             @default(now()) @map("activated_at")
  expiresAt           DateTime             @map("expires_at")
  totalPtSessions     Int                  @default(0) @map("total_pt_sessions")
  remainingPtSessions Int                  @default(0) @map("remaining_pt_sessions")
  progressPct         Decimal              @default(0.00) @map("progress_pct") @db.Decimal(5, 2)

  member              User                 @relation("MemberEnrollments", fields: [userId], references: [id])
  trainer             User?                @relation("TrainerEnrollments", fields: [assignedTrainerId], references: [id])
  course              CourseMembership     @relation(fields: [courseId], references: [id])
  bookings            PtBooking[]
  lessonProgress      UserLessonProgress[]
  checkins            GymCheckin[]

  @@map("user_enrollments")
}

model UserLessonProgress {
  id              String         @id @default(uuid())
  enrollmentId    String         @map("enrollment_id")
  userId          String         @map("user_id")
  lessonId        String         @map("lesson_id")
  watchedSeconds  Int            @default(0) @map("watched_seconds")
  lastPositionSec Int            @default(0) @map("last_position_sec")
  isCompleted     Boolean        @default(false) @map("is_completed")
  completedAt     DateTime?      @map("completed_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  enrollment      UserEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson          CourseLesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("user_lesson_progress")
}

model PtBooking {
  id           String         @id @default(uuid())
  enrollmentId String         @map("enrollment_id")
  memberId     String         @map("member_id")
  trainerId    String         @map("trainer_id")
  bookingDate  DateTime       @map("booking_date") @db.Date
  startTime    String         @map("start_time")
  endTime      String         @map("end_time")
  focusArea    String?        @map("focus_area")
  trainerNotes String?        @map("trainer_notes")
  status       BookingStatus  @default(CONFIRMED)

  enrollment   UserEnrollment @relation(fields: [enrollmentId], references: [id])
  member       User           @relation("MemberBookings", fields: [memberId], references: [id])
  trainer      User           @relation("TrainerBookings", fields: [trainerId], references: [id])
  checkins     GymCheckin[]

  @@unique([trainerId, bookingDate, startTime])
  @@map("pt_bookings")
}

model GymCheckin {
  id            String         @id @default(uuid())
  enrollmentId  String         @map("enrollment_id")
  memberId      String         @map("member_id")
  ptBookingId   String?        @map("pt_booking_id")
  verifiedById  String?        @map("verified_by_id")
  checkinType   CheckinType    @map("checkin_type")
  qrTokenHash   String         @map("qr_token_hash")
  checkinTime   DateTime       @default(now()) @map("checkin_time")
  checkoutTime  DateTime?      @map("checkout_time")

  enrollment    UserEnrollment @relation(fields: [enrollmentId], references: [id])
  member        User           @relation("MemberCheckins", fields: [memberId], references: [id])
  ptBooking     PtBooking?     @relation(fields: [ptBookingId], references: [id])
  verifiedBy    User?          @relation("StaffVerifiedCheckins", fields: [verifiedById], references: [id])

  @@map("gym_checkins")
}

model Order {
  id               String        @id @default(uuid())
  orderCode        String        @unique @map("order_code")
  userId           String        @map("user_id")
  hasPhysicalItems Boolean       @default(false) @map("has_physical_items")
  shippingAddress  Json?         @map("shipping_address")
  totalAmount      Decimal       @map("total_amount") @db.Decimal(12, 2)
  paymentStatus    PaymentStatus @default(PENDING) @map("payment_status")
  createdAt        DateTime      @default(now()) @map("created_at")

  user             User          @relation(fields: [userId], references: [id])
  items            OrderItem[]

  @@map("orders")
}

model OrderItem {
  id                  String             @id @default(uuid())
  orderId             String             @map("order_id")
  itemType            OrderItemType      @map("item_type")
  supplementVariantId String?            @map("supplement_variant_id")
  allocatedBatchId    String?            @map("allocated_batch_id")
  courseId            String?            @map("course_id")
  itemNameSnapshot    String             @map("item_name_snapshot")
  quantity            Int                @default(1)
  unitPrice           Decimal            @map("unit_price") @db.Decimal(12, 2)
  lineTotal           Decimal            @map("line_total") @db.Decimal(12, 2)

  order               Order              @relation(fields: [orderId], references: [id], onDelete: Cascade)
  supplementVariant   SupplementVariant? @relation(fields: [supplementVariantId], references: [id])
  allocatedBatch      InventoryBatch?    @relation(fields: [allocatedBatchId], references: [id])
  course              CourseMembership?  @relation(fields: [courseId], references: [id])

  @@map("order_items")
}
```