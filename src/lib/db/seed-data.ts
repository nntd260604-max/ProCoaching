export interface SeedDatabase {
  users: {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    phone: string;
    avatarUrl: string;
    role: "MEMBER" | "TRAINER" | "ADMIN";
    status: "ACTIVE" | "LOCKED";
    createdAt: string;
  }[];
  trainerProfiles: {
    id: string;
    userId: string;
    bio: string;
    specialties: string;
    certifications: string[];
    yearsExperience: number;
    ratingAvg: number;
  }[];
  categories: {
    id: string;
    name: string;
    slug: string;
    categoryType: "SUPPLEMENT" | "COURSE";
    parentId: string | null;
  }[];
  supplementProducts: {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    brand: string;
    originCountry: string;
    description: string;
    nutritionFacts: {
      servingSize: string;
      calories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
      bcaaGrams?: number;
      caffeineMg?: number;
      creatineGrams?: number;
      sugarGrams?: number;
    };
    allergenTags: string[];
    targetGoal: "MUSCLE_GAIN" | "FAT_LOSS" | "ENDURANCE" | "RECOVERY";
    isActive: boolean;
  }[];
  supplementVariants: {
    id: string;
    productId: string;
    sku: string;
    flavor: string;
    weightLabel: string;
    servingsCount: number;
    weightGrams: number;
    price: number;
    salePrice: number | null;
    stockQuantity: number;
    imageUrl: string;
  }[];
  inventoryBatches: {
    id: string;
    variantId: string;
    batchCode: string;
    supplierName: string;
    importPrice: number;
    initialQuantity: number;
    remainingQuantity: number;
    manufacturedDate: string;
    expiryDate: string;
    batchStatus: "AVAILABLE" | "NEAR_EXPIRY" | "EXPIRED" | "DEPLETED";
    importedAt: string;
  }[];
  coursesMemberships: {
    id: string;
    categoryId: string;
    trainerId: string;
    title: string;
    slug: string;
    courseType: "ONLINE_VIDEO" | "GYM_MEMBERSHIP" | "PT_PACKAGE" | "HYBRID_COMBO";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    targetGoal: "MUSCLE_GAIN" | "FAT_LOSS" | "ENDURANCE" | "RECOVERY";
    price: number;
    durationDays: number;
    ptSessionsIncluded: number;
    thumbnailUrl: string;
    previewVideoUrl: string;
    description: string;
  }[];
  courseModules: {
    id: string;
    courseId: string;
    title: string;
    sortOrder: number;
  }[];
  courseLessons: {
    id: string;
    moduleId: string;
    title: string;
    videoUrl: string;
    durationSeconds: number;
    workoutGuideMd: string;
    isFreePreview: boolean;
    sortOrder: boolean | number;
  }[];
  userEnrollments: {
    id: string;
    userId: string;
    courseId: string;
    orderId: string;
    assignedTrainerId: string | null;
    qrSecretKey: string;
    activatedAt: string;
    expiresAt: string;
    totalPtSessions: number;
    remainingPtSessions: number;
    progressPct: number;
    status: "ACTIVE" | "EXPIRED" | "FROZEN";
  }[];
  userLessonProgress: {
    id: string;
    enrollmentId: string;
    userId: string;
    lessonId: string;
    watchedSeconds: number;
    lastPositionSec: number;
    isCompleted: boolean;
    completedAt: string | null;
    updatedAt: string;
  }[];
  trainerAvailabilities: {
    id: string;
    trainerId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
  ptBookings: {
    id: string;
    enrollmentId: string;
    memberId: string;
    trainerId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    focusArea: string;
    trainerNotes: string | null;
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  }[];
  gymCheckins: {
    id: string;
    enrollmentId: string;
    memberId: string;
    ptBookingId: string | null;
    verifiedById: string | null;
    checkinType: "GYM_ENTRY" | "PT_SESSION";
    qrTokenHash: string;
    checkinTime: string;
    checkoutTime: string | null;
  }[];
  bodyMetricsLogs: {
    id: string;
    userId: string;
    heightCm: number;
    weightKg: number;
    bodyFatPct: number | null;
    activityLevel: number;
    bmi: number;
    tdeeCalories: number;
    fitnessGoal: "MUSCLE_GAIN" | "FAT_LOSS" | "ENDURANCE" | "RECOVERY";
    allergies: string[];
    recordedAt: string;
  }[];
  aiConsultationLogs: {
    id: string;
    userId: string;
    metricsLogId: string;
    targetMacros: {
      calories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
      bmr: number;
      tdee: number;
    };
    excludedAllergens: string[];
    mealPlanMarkdown: string;
    recommendedItems: {
      supplementVariantIds: string[];
      courseIds: string[];
      reasoning: string;
    };
    createdAt: string;
  }[];
  vouchers: {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
    minOrderValue: number;
    usageLimit: number;
    usedCount: number;
    validUntil: string;
  }[];
  orders: {
    id: string;
    orderCode: string;
    userId: string;
    voucherId: string | null;
    hasPhysicalItems: boolean;
    shippingAddress: {
      recipientName: string;
      phone: string;
      addressLine: string;
      district: string;
      city: string;
      note?: string;
    } | null;
    subtotalAmount: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: "VNPAY" | "MOMO" | "PAYOS" | "COD";
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    fulfillmentStatus: "DIGITAL_ONLY" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
    createdAt: string;
  }[];
  orderItems: {
    id: string;
    orderId: string;
    itemType: "SUPPLEMENT_VARIANT" | "COURSE_MEMBERSHIP";
    supplementVariantId: string | null;
    allocatedBatchId: string | null;
    courseId: string | null;
    itemNameSnapshot: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}

// Helper to create relative dates from today so NEAR_EXPIRY (<60 days) and AVAILABLE (>60 days) are always accurate
function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function addDaysDateOnly(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function createInitialSeedData(): SeedDatabase {
  const todayStr = addDaysDateOnly(0);
  const tomorrowStr = addDaysDateOnly(1);
  const yesterdayStr = addDaysDateOnly(-1);

  return {
    users: [
      {
        id: "user-member-01",
        email: "minhquan.member@gymhub.vn",
        passwordHash: "$2b$10$demoHashMemberGymHub2026",
        fullName: "Nguyễn Minh Quân",
        phone: "0908123456",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "MEMBER",
        status: "ACTIVE",
        createdAt: addDaysISO(-45),
      },
      {
        id: "user-trainer-01",
        email: "hoangnam.pt@gymhub.vn",
        passwordHash: "$2b$10$demoHashTrainerGymHub2026",
        fullName: "HLV Lê Hoàng Nam",
        phone: "0912345678",
        avatarUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&auto=format&fit=crop&q=80",
        role: "TRAINER",
        status: "ACTIVE",
        createdAt: addDaysISO(-180),
      },
      {
        id: "user-trainer-02",
        email: "baongoc.pt@gymhub.vn",
        passwordHash: "$2b$10$demoHashTrainer2GymHub2026",
        fullName: "HLV Trần Bảo Ngọc",
        phone: "0934567890",
        avatarUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&auto=format&fit=crop&q=80",
        role: "TRAINER",
        status: "ACTIVE",
        createdAt: addDaysISO(-150),
      },
      {
        id: "user-admin-01",
        email: "admin@gymhub.vn",
        passwordHash: "$2b$10$demoHashAdminGymHub2026",
        fullName: "Phạm Quốc Trưởng (Admin)",
        phone: "0988999888",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: addDaysISO(-365),
      },
    ],
    trainerProfiles: [
      {
        id: "tp-01",
        userId: "user-trainer-01",
        bio: "Kiện tướng Thể hình Quốc gia 2023, 8 năm kinh nghiệm huấn luyện Hypertrophy (Tăng cơ chuyên sâu), Powerlifting và hiệu chỉnh tư thế cột sống.",
        specialties: "Hypertrophy, Powerlifting, Phục hồi chấn thương vai & lưng dưới",
        certifications: ["NASM-CPT Hoa Kỳ", "ISSA Sports Nutritionist", "Chứng chỉ Sơ cấp cứu CPR"],
        yearsExperience: 8,
        ratingAvg: 4.95,
      },
      {
        id: "tp-02",
        userId: "user-trainer-02",
        bio: "Chuyên gia chuyển hóa hình thể nữ & giảm mỡ nội tạng. Đã đồng hành cùng hơn 300 học viên lấy lại vóc dáng săn chắc chuẩn Fitness.",
        specialties: "Giảm mỡ siết cơ (Body Recomposition), Glute & Core Sculpting, HIIT Conditioning",
        certifications: ["ACE-CPT Quốc tế", "Precision Nutrition Level 1"],
        yearsExperience: 5,
        ratingAvg: 4.92,
      },
    ],
    categories: [
      {
        id: "cat-whey",
        name: "Whey Protein Tăng Cơ",
        slug: "whey-protein",
        categoryType: "SUPPLEMENT",
        parentId: null,
      },
      {
        id: "cat-pre",
        name: "Pre-Workout & Tăng Sức Bền",
        slug: "pre-workout",
        categoryType: "SUPPLEMENT",
        parentId: null,
      },
      {
        id: "cat-creatine",
        name: "Creatine & Phục Hồi Cơ",
        slug: "creatine-recovery",
        categoryType: "SUPPLEMENT",
        parentId: null,
      },
      {
        id: "cat-plant",
        name: "Đạm Thực Vật & Giảm Mỡ",
        slug: "plant-protein-fat-loss",
        categoryType: "SUPPLEMENT",
        parentId: null,
      },
      {
        id: "cat-course-online",
        name: "Khóa Học Video Online",
        slug: "khoa-hoc-video",
        categoryType: "COURSE",
        parentId: null,
      },
      {
        id: "cat-gym-pt",
        name: "Thẻ Phòng Tập & PT 1-1",
        slug: "the-phong-tap-pt",
        categoryType: "COURSE",
        parentId: null,
      },
    ],
    supplementProducts: [
      {
        id: "prod-iso100",
        categoryId: "cat-whey",
        name: "Dymatize ISO100 Hydrolyzed 100% Whey Protein Isolate",
        slug: "dymatize-iso100-hydrolyzed-whey-isolate",
        brand: "Dymatize",
        originCountry: "USA",
        description:
          "Đỉnh cao Whey Protein thủy phân (Hydrolyzed) kết hợp Whey Isolate siêu tinh khiết. Đã loại bỏ hoàn toàn Lactose, chất béo và đường — hấp thụ cực nhanh chỉ sau 15 phút tập luyện, an toàn tuyệt đối cho người bất dung nạp Lactose.",
        nutritionFacts: {
          servingSize: "1 muỗng (32g)",
          calories: 120,
          proteinGrams: 25,
          carbsGrams: 2,
          fatGrams: 0.5,
          bcaaGrams: 5.5,
          sugarGrams: 0,
        },
        allergenTags: [], // Không Lactose, Không Gluten, Không Caffeine
        targetGoal: "MUSCLE_GAIN",
        isActive: true,
      },
      {
        id: "prod-rule1-blend",
        categoryId: "cat-whey",
        name: "Rule 1 R1 Whey Blend 100% Whey Protein",
        slug: "rule1-r1-whey-blend-protein",
        brand: "Rule 1 Proteins",
        originCountry: "USA",
        description:
          "Sự kết hợp kinh tế giữa 3 nguồn Whey (Concentrate, Isolate, Hydrolyzed) cung cấp 24g Protein mỗi muỗng giúp phục hồi và phát triển cơ bắp tối ưu với mức giá tiết kiệm cho sinh viên và người tập lâu dài.",
        nutritionFacts: {
          servingSize: "1 muỗng (33g)",
          calories: 130,
          proteinGrams: 24,
          carbsGrams: 4,
          fatGrams: 2,
          bcaaGrams: 5.0,
          sugarGrams: 2,
        },
        allergenTags: ["LACTOSE", "SOY"],
        targetGoal: "MUSCLE_GAIN",
        isActive: true,
      },
      {
        id: "prod-orgain-plant",
        categoryId: "cat-plant",
        name: "Orgain Organic Plant-Based Protein Powder (Đạm Thực Vật Hữu Cơ)",
        slug: "orgain-organic-plant-based-protein",
        brand: "Orgain",
        originCountry: "USA",
        description:
          "Đạm thực vật hữu cơ chuẩn USDA Organic từ hạt đậu Hà Lan, gạo lứt và hạt Chia. Hoàn toàn không chứa Lactose, không Đậu nành, không Gluten — giải pháp số 1 cho người dị ứng sữa bò hoặc đang trong chế độ cắt nét giảm mỡ.",
        nutritionFacts: {
          servingSize: "2 muỗng (46g)",
          calories: 150,
          proteinGrams: 21,
          carbsGrams: 15,
          fatGrams: 4,
          sugarGrams: 0,
        },
        allergenTags: [],
        targetGoal: "FAT_LOSS",
        isActive: true,
      },
      {
        id: "prod-c4-pre",
        categoryId: "cat-pre",
        name: "Cellucor C4 Original Pre-Workout Bùng Nổ Sức Mạnh",
        slug: "cellucor-c4-original-pre-workout",
        brand: "Cellucor",
        originCountry: "USA",
        description:
          "Công thức Pre-Workout bán chạy toàn cầu chứa 1.6g CarnoSyn Beta-Alanine, 1g Creatine Nitrate và 150mg Caffeine giúp tỉnh táo tức thì, bứt phá mức tạ nặng và duy trì sức bền suốt buổi tập cường độ cao.",
        nutritionFacts: {
          servingSize: "1 muỗng (6.5g)",
          calories: 5,
          proteinGrams: 0,
          carbsGrams: 1,
          fatGrams: 0,
          caffeineMg: 150,
        },
        allergenTags: ["HIGH_CAFFEINE"],
        targetGoal: "ENDURANCE",
        isActive: true,
      },
      {
        id: "prod-abe-pump",
        categoryId: "cat-pre",
        name: "Applied Nutrition ABE Pump Stim-Free (Pre-Workout Không Caffeine)",
        slug: "applied-nutrition-abe-pump-stim-free",
        brand: "Applied Nutrition",
        originCountry: "UK",
        description:
          "Dòng Pre-Workout không chứa chất kích thích (0mg Caffeine), bổ sung Citrulline Malate 10g, Beta-Alanine 3g và Taurine giúp bơm máu cơ căng phồng, tăng sức bền và đốt mỡ mà không gây mất ngủ khi tập ca tối.",
        nutritionFacts: {
          servingSize: "2 muỗng (25g)",
          calories: 10,
          proteinGrams: 0,
          carbsGrams: 2,
          fatGrams: 0,
          caffeineMg: 0,
          creatineGrams: 3,
        },
        allergenTags: [],
        targetGoal: "ENDURANCE",
        isActive: true,
      },
      {
        id: "prod-on-creatine",
        categoryId: "cat-creatine",
        name: "Optimum Nutrition Micronized Creatine Monohydrate 100%",
        slug: "optimum-nutrition-micronized-creatine",
        brand: "Optimum Nutrition",
        originCountry: "USA",
        description:
          "100% Creatine Monohydrate dạng hạt siêu mịn (Micronized) giúp tái tạo ATP nhanh chóng, tăng sức mạnh cơ bắp trong các bài Compound nặng (Squat, Bench Press, Deadlift) và làm đầy tế bào cơ.",
        nutritionFacts: {
          servingSize: "1 muỗng (5g)",
          calories: 0,
          proteinGrams: 0,
          carbsGrams: 0,
          fatGrams: 0,
          creatineGrams: 5,
        },
        allergenTags: [],
        targetGoal: "RECOVERY",
        isActive: true,
      },
    ],
    supplementVariants: [
      {
        id: "var-iso100-5lb-choco",
        productId: "prod-iso100",
        sku: "ISO100-5LB-GOURMET-CHOCO",
        flavor: "Gourmet Chocolate",
        weightLabel: "5 Lbs (2.27 kg)",
        servingsCount: 71,
        weightGrams: 2270,
        price: 2250000,
        salePrice: 2090000,
        stockQuantity: 25,
        imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "var-iso100-3lb-straw",
        productId: "prod-iso100",
        sku: "ISO100-3LB-STRAWBERRY",
        flavor: "Strawberry Cream",
        weightLabel: "3 Lbs (1.36 kg)",
        servingsCount: 43,
        weightGrams: 1360,
        price: 1550000,
        salePrice: 1420000,
        stockQuantity: 15,
        imageUrl: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "var-r1-5lb-choco",
        productId: "prod-rule1-blend",
        sku: "R1-BLEND-5LB-CHOCO",
        flavor: "Double Rich Chocolate",
        weightLabel: "5 Lbs (2.27 kg)",
        servingsCount: 68,
        weightGrams: 2270,
        price: 1550000,
        salePrice: 1390000,
        stockQuantity: 33,
        imageUrl: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "var-r1-5lb-vanilla",
        productId: "prod-rule1-blend",
        sku: "R1-BLEND-5LB-VANILLA",
        flavor: "Vanilla Ice Cream",
        weightLabel: "5 Lbs (2.27 kg)",
        servingsCount: 68,
        weightGrams: 2270,
        price: 1550000,
        salePrice: 1450000,
        stockQuantity: 18,
        imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "var-orgain-2lb-choco",
        productId: "prod-orgain-plant",
        sku: "ORGAIN-2LB-CHOCO-FUDGE",
        flavor: "Creamy Chocolate Fudge",
        weightLabel: "2.03 Lbs (920g)",
        servingsCount: 20,
        weightGrams: 920,
        price: 1050000,
        salePrice: 950000,
        stockQuantity: 22,
        imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "var-c4-60s-blue",
        productId: "prod-c4-pre",
        sku: "C4-ORIG-60S-ICY-BLUE",
        flavor: "Icy Blue Razz",
        weightLabel: "60 Servings (390g)",
        servingsCount: 60,
        weightGrams: 390,
        price: 890000,
        salePrice: 760000,
        stockQuantity: 25,
        imageUrl: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "var-abe-pump-tigers",
        productId: "prod-abe-pump",
        sku: "ABE-PUMP-40S-TIGERS-BLOOD",
        flavor: "Tiger's Blood",
        weightLabel: "40 Servings (500g)",
        servingsCount: 40,
        weightGrams: 500,
        price: 950000,
        salePrice: 890000,
        stockQuantity: 20,
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "var-on-creatine-600g",
        productId: "prod-on-creatine",
        sku: "ON-CREATINE-600G-UNFLAVORED",
        flavor: "Không vị (Unflavored)",
        weightLabel: "120 Servings (600g)",
        servingsCount: 120,
        weightGrams: 600,
        price: 850000,
        salePrice: 780000,
        stockQuantity: 30,
        imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&auto=format&fit=crop&q=80",
      },
    ],
    inventoryBatches: [
      // ISO100 Chocolate: 1 lô cận date (38 ngày) + 1 lô hạn dài (360 ngày)
      {
        id: "batch-iso-01-near",
        variantId: "var-iso100-5lb-choco",
        batchCode: "LOT-2026-ISO-01A",
        supplierName: "Công ty TNHH Dinh Dưỡng Thể Thao Việt Mỹ",
        importPrice: 1620000,
        initialQuantity: 20,
        remainingQuantity: 5,
        manufacturedDate: addDaysDateOnly(-680),
        expiryDate: addDaysDateOnly(38), // Cận date < 60 ngày -> Ưu tiên xuất kho FEFO số 1
        batchStatus: "NEAR_EXPIRY",
        importedAt: addDaysISO(-300),
      },
      {
        id: "batch-iso-02-avail",
        variantId: "var-iso100-5lb-choco",
        batchCode: "LOT-2027-ISO-02B",
        supplierName: "Công ty TNHH Dinh Dưỡng Thể Thao Việt Mỹ",
        importPrice: 1690000,
        initialQuantity: 20,
        remainingQuantity: 20,
        manufacturedDate: addDaysDateOnly(-90),
        expiryDate: addDaysDateOnly(360),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-30),
      },
      // ISO100 Strawberry
      {
        id: "batch-iso-03-straw",
        variantId: "var-iso100-3lb-straw",
        batchCode: "LOT-2027-ISO-03S",
        supplierName: "Công ty TNHH Dinh Dưỡng Thể Thao Việt Mỹ",
        importPrice: 1080000,
        initialQuantity: 15,
        remainingQuantity: 15,
        manufacturedDate: addDaysDateOnly(-100),
        expiryDate: addDaysDateOnly(320),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-40),
      },
      // Rule1 Chocolate: 1 lô cận date (25 ngày) + 1 lô hạn dài (300 ngày)
      {
        id: "batch-r1-01-near",
        variantId: "var-r1-5lb-choco",
        batchCode: "LOT-2026-R1-08A",
        supplierName: "Nhà Phân Phối MuscleUp Distribution",
        importPrice: 1020000,
        initialQuantity: 30,
        remainingQuantity: 8,
        manufacturedDate: addDaysDateOnly(-700),
        expiryDate: addDaysDateOnly(25), // Cận date 25 ngày
        batchStatus: "NEAR_EXPIRY",
        importedAt: addDaysISO(-320),
      },
      {
        id: "batch-r1-02-avail",
        variantId: "var-r1-5lb-choco",
        batchCode: "LOT-2027-R1-12B",
        supplierName: "Nhà Phân Phối MuscleUp Distribution",
        importPrice: 1080000,
        initialQuantity: 25,
        remainingQuantity: 25,
        manufacturedDate: addDaysDateOnly(-60),
        expiryDate: addDaysDateOnly(300),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-20),
      },
      // Rule1 Vanilla
      {
        id: "batch-r1-03-vanilla",
        variantId: "var-r1-5lb-vanilla",
        batchCode: "LOT-2027-R1-VAN",
        supplierName: "Nhà Phân Phối MuscleUp Distribution",
        importPrice: 1080000,
        initialQuantity: 20,
        remainingQuantity: 18,
        manufacturedDate: addDaysDateOnly(-80),
        expiryDate: addDaysDateOnly(280),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-35),
      },
      // Orgain Plant Protein
      {
        id: "batch-orgain-01",
        variantId: "var-orgain-2lb-choco",
        batchCode: "LOT-2027-ORG-05",
        supplierName: "Organic Wellness Import JSC",
        importPrice: 680000,
        initialQuantity: 25,
        remainingQuantity: 22,
        manufacturedDate: addDaysDateOnly(-75),
        expiryDate: addDaysDateOnly(260),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-25),
      },
      // C4 Pre-Workout: 1 lô cận date (45 ngày) + 1 lô hạn dài (290 ngày)
      {
        id: "batch-c4-01-near",
        variantId: "var-c4-60s-blue",
        batchCode: "LOT-2026-C4-BLUE1",
        supplierName: "Nutrabolt Vietnam Official",
        importPrice: 510000,
        initialQuantity: 15,
        remainingQuantity: 6,
        manufacturedDate: addDaysDateOnly(-650),
        expiryDate: addDaysDateOnly(45),
        batchStatus: "NEAR_EXPIRY",
        importedAt: addDaysISO(-260),
      },
      {
        id: "batch-c4-02-avail",
        variantId: "var-c4-60s-blue",
        batchCode: "LOT-2027-C4-BLUE2",
        supplierName: "Nutrabolt Vietnam Official",
        importPrice: 540000,
        initialQuantity: 19,
        remainingQuantity: 19,
        manufacturedDate: addDaysDateOnly(-50),
        expiryDate: addDaysDateOnly(290),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-15),
      },
      // ABE Pump Stim-Free
      {
        id: "batch-abe-01",
        variantId: "var-abe-pump-tigers",
        batchCode: "LOT-2027-ABE-UK1",
        supplierName: "Applied Nutrition VN",
        importPrice: 620000,
        initialQuantity: 20,
        remainingQuantity: 20,
        manufacturedDate: addDaysDateOnly(-60),
        expiryDate: addDaysDateOnly(310),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-18),
      },
      // ON Creatine: 1 lô đã hết hạn (EXPIRED - bị khóa tự động bởi thuật toán FEFO) + 1 lô hạn dài
      {
        id: "batch-cre-00-expired",
        variantId: "var-on-creatine-600g",
        batchCode: "LOT-2024-CRE-OLD",
        supplierName: "Glanbia Performance Nutrition VN",
        importPrice: 500000,
        initialQuantity: 15,
        remainingQuantity: 3,
        manufacturedDate: addDaysDateOnly(-750),
        expiryDate: addDaysDateOnly(-12), // Đã quá hạn 12 ngày -> Hệ thống FEFO tự động bỏ qua!
        batchStatus: "EXPIRED",
        importedAt: addDaysISO(-400),
      },
      {
        id: "batch-cre-01-avail",
        variantId: "var-on-creatine-600g",
        batchCode: "LOT-2027-CRE-NEW",
        supplierName: "Glanbia Performance Nutrition VN",
        importPrice: 540000,
        initialQuantity: 30,
        remainingQuantity: 30,
        manufacturedDate: addDaysDateOnly(-40),
        expiryDate: addDaysDateOnly(390),
        batchStatus: "AVAILABLE",
        importedAt: addDaysISO(-10),
      },
    ],
    coursesMemberships: [
      {
        id: "course-hybrid-vip-90",
        categoryId: "cat-gym-pt",
        trainerId: "user-trainer-01",
        title: "Gói Hybrid Toàn Diện: Thẻ Tập VIP 90 Ngày + 12 Buổi PT 1-1 & Giáo Án Video Hypertrophy",
        slug: "goi-hybrid-vip-90-ngay-12-buoi-pt-hypertrophy",
        courseType: "HYBRID_COMBO",
        level: "INTERMEDIATE",
        targetGoal: "MUSCLE_GAIN",
        price: 4500000,
        durationDays: 90,
        ptSessionsIncluded: 12,
        thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
        previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        description:
          "Giải pháp toàn diện kết hợp Thẻ ra vào phòng tập GymHub không giới hạn trong 90 ngày (mã QR động 60s), 12 buổi huấn luyện 1-1 trực tiếp cùng HLV Kiện tướng Lê Hoàng Nam và trọn bộ video kỹ thuật Compound chuẩn cơ sinh học.",
      },
      {
        id: "course-video-compound",
        categoryId: "cat-course-online",
        trainerId: "user-trainer-01",
        title: "Khóa Học Video Online: Làm Chủ Kỹ Thuật Compound & Tăng Cơ Khoa Học 8 Tuần",
        slug: "khoa-hoc-video-ky-thuat-compound-tang-co-8-tuan",
        courseType: "ONLINE_VIDEO",
        level: "BEGINNER",
        targetGoal: "MUSCLE_GAIN",
        price: 890000,
        durationDays: 365,
        ptSessionsIncluded: 0,
        thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80",
        previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        description:
          "Khóa học trực tuyến gồm các bài giảng video phân tích góc khớp, đường đi của tạ (Bar Path) cho Squat, Bench Press, Deadlift, Overhead Press. Tích hợp hệ thống lưu vết tiến độ chống tua bài 80% và lịch tập Sets x Reps chi tiết.",
      },
      {
        id: "course-pt-fatloss-60",
        categoryId: "cat-gym-pt",
        trainerId: "user-trainer-02",
        title: "Gói Huấn Luyện PT 1-1: Độ Body Giảm Mỡ Siết Cơ & Định Hình Vòng 3 (60 Ngày)",
        slug: "goi-pt-1-1-do-body-giam-mo-siet-co-60-ngay",
        courseType: "PT_PACKAGE",
        level: "BEGINNER",
        targetGoal: "FAT_LOSS",
        price: 5200000,
        durationDays: 60,
        ptSessionsIncluded: 16,
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80",
        previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        description:
          "Chương trình kèm cặp sát sao 1-1 gồm 16 buổi tập riêng cùng HLV Trần Bảo Ngọc kết hợp thẻ tập 60 ngày và video bài tập bổ trợ đốt mỡ HIIT tại nhà.",
      },
      {
        id: "course-gym-pass-30",
        categoryId: "cat-gym-pt",
        trainerId: "user-trainer-02",
        title: "Thẻ Hội Viên Phòng Tập GymHub All-Access 30 Ngày + 2 Buổi PT Định Hướng InBody",
        slug: "the-hoi-vien-gymhub-all-access-30-ngay",
        courseType: "GYM_MEMBERSHIP",
        level: "BEGINNER",
        targetGoal: "ENDURANCE",
        price: 750000,
        durationDays: 30,
        ptSessionsIncluded: 2,
        thumbnailUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80",
        previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
        description:
          "Thẻ tập tự do tất cả khung giờ tại hệ thống phòng tập GymHub trong 30 ngày, sử dụng khu vực Free Weight, Máy khối, Phòng Xông hơi Sauna và tặng kèm 2 buổi đo InBody + hướng dẫn máy tập cùng PT.",
      },
    ],
    courseModules: [
      {
        id: "mod-01",
        courseId: "course-hybrid-vip-90",
        title: "Chương 1: Nền Tảng Cơ Sinh Học & Kỹ Thuật Gồng Core Bracing",
        sortOrder: 1,
      },
      {
        id: "mod-02",
        courseId: "course-hybrid-vip-90",
        title: "Chương 2: Chuỗi Bài Tập Thân Trên (Ngực - Vai - Tay Sau - Lưng Xô)",
        sortOrder: 2,
      },
      {
        id: "mod-03",
        courseId: "course-hybrid-vip-90",
        title: "Chương 3: Chuỗi Bài Tập Thân Dưới (Squat, Romanian Deadlift & Leg Press)",
        sortOrder: 3,
      },
      {
        id: "mod-04",
        courseId: "course-video-compound",
        title: "Chương 1: Giải Phẫu Cơ Bắp & Thiết Lập Mức Tạ Khởi Điểm (RPE)",
        sortOrder: 1,
      },
      {
        id: "mod-05",
        courseId: "course-video-compound",
        title: "Chương 2: Kỹ Thuật Big 3 Compound (Squat - Bench - Deadlift)",
        sortOrder: 2,
      },
      {
        id: "mod-06",
        courseId: "course-pt-fatloss-60",
        title: "Chương 1: Chuỗi Bài Tập HIIT Đốt Mỡ & Kích Hoạt Cơ Mông (Glute Activation)",
        sortOrder: 1,
      },
    ],
    courseLessons: [
      {
        id: "les-01",
        moduleId: "mod-01",
        title: "Bài 1: Kỹ thuật Hít thở Valsalva & Gồng Core 360 độ bảo vệ cột sống thắt lưng",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        durationSeconds: 60,
        workoutGuideMd:
          "### Hướng dẫn thực hành tại phòng tập\n- **Khởi động khớp hông & vai:** 2 hiệp x 15 lần với dây kháng lực Band\n- **Dead Bug kích hoạt Core:** 3 hiệp x 12 lần mỗi bên (Nghỉ 45s)\n- **Plank gồng bụng RKC:** 3 hiệp x 40 giây siết chặt cơ bụng và cơ mông",
        isFreePreview: true,
        sortOrder: 1,
      },
      {
        id: "les-02",
        moduleId: "mod-01",
        title: "Bài 2: Cách khóa xương bả vai (Scapular Retraction) khi đẩy ngực & kéo xô",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        durationSeconds: 60,
        workoutGuideMd:
          "### Lịch tập thực hành Scapular Control\n- **Scapular Pull-up:** 3 hiệp x 10 lần (Giữ đỉnh 2 giây)\n- **Face Pull với dây thừng:** 4 hiệp x 15 lần (Nghỉ 60s)\n- **Lưu ý kỹ thuật:** Hạ thấp đầu vai xa tai, ép hai xương bả vai vào giữa cột sống trước khi phát lực.",
        isFreePreview: false,
        sortOrder: 2,
      },
      {
        id: "les-03",
        moduleId: "mod-02",
        title: "Bài 3: Kỹ thuật Barbell & Dumbbell Bench Press tối ưu độ dày cơ ngực mà không đau khớp vai",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        durationSeconds: 75,
        workoutGuideMd:
          "### Giáo án Ngày Tập Đẩy (Push Day)\n- **Flat Barbell Bench Press:** 4 hiệp x 8-10 reps (Tempo 3-1-1, nghỉ 90s)\n- **Incline Dumbbell Press (Ghế dốc 30 độ):** 4 hiệp x 10-12 reps (Nghỉ 75s)\n- **Cable Tricep Pushdown:** 3 hiệp x 12-15 reps (Siết đỉnh 1s)",
        isFreePreview: false,
        sortOrder: 1,
      },
      {
        id: "les-04",
        moduleId: "mod-03",
        title: "Bài 4: Kỹ thuật High-Bar Barbell Squat & Romanian Deadlift phát triển toàn diện Đùi - Mông",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
        durationSeconds: 80,
        workoutGuideMd:
          "### Giáo án Ngày Tập Chân (Leg Day)\n- **Barbell Back Squat:** 4 hiệp x 6-8 reps (RPE 8, nghỉ 120s)\n- **Romanian Deadlift (RDL):** 4 hiệp x 10 reps (Cảm nhận độ căng đùi sau Hamstrings)\n- **Walking Lunges:** 3 hiệp x 12 bước mỗi chân",
        isFreePreview: false,
        sortOrder: 1,
      },
      {
        id: "les-05",
        moduleId: "mod-04",
        title: "Bài 1: Nguyên lý Quá tải lũy tiến (Progressive Overload) & Cách ghi sổ tay mức tạ",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        durationSeconds: 60,
        workoutGuideMd:
          "### Quy tắc tăng tạ chuẩn khoa học\n- Khi hoàn thành đủ **4 hiệp x 10 reps** với kỹ thuật chuẩn (RPE <= 8), buổi sau tăng thêm **2.5kg** tổng tạ.\n- Đảm bảo nạp đủ **1.8g - 2.2g Protein / kg cân nặng** mỗi ngày.",
        isFreePreview: true,
        sortOrder: 1,
      },
      {
        id: "les-06",
        moduleId: "mod-05",
        title: "Bài 2: Phân tích đường đi thanh đòn (Bar Path) trong Conventional Deadlift",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        durationSeconds: 70,
        workoutGuideMd:
          "### Checklist 5 bước Deadlift an toàn\n1. Đứng sát ống quyển cách thanh đòn 2.5cm\n2. Gập hông nắm thanh đòn, không hạ hông quá thấp\n3. Kéo sát ống quyển, khóa hông (Lockout) bằng cơ mông, không ưỡn lưng quá mức",
        isFreePreview: false,
        sortOrder: 1,
      },
      {
        id: "les-07",
        moduleId: "mod-06",
        title: "Bài 1: Hip Thrust & Bulgarian Split Squat kiến tạo cơ mông tròn đầy",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        durationSeconds: 60,
        workoutGuideMd:
          "### Giáo án Glute Focus\n- **Barbell Hip Thrust:** 4 hiệp x 10-12 reps (Giữ 2s ở điểm cao nhất)\n- **Bulgarian Split Squat (Đổ người 15 độ về trước):** 3 hiệp x 10 reps/chân",
        isFreePreview: true,
        sortOrder: 1,
      },
    ],
    userEnrollments: [
      {
        id: "enroll-member-01",
        userId: "user-member-01",
        courseId: "course-hybrid-vip-90",
        orderId: "ord-demo-01",
        assignedTrainerId: "user-trainer-01",
        qrSecretKey: "GYMHUB-TOTP-SECRET-MINHQUAN-2026-VIP90",
        activatedAt: addDaysISO(-15),
        expiresAt: addDaysISO(75),
        totalPtSessions: 12,
        remainingPtSessions: 9,
        progressPct: 50,
        status: "ACTIVE",
      },
    ],
    userLessonProgress: [
      {
        id: "prog-01",
        enrollmentId: "enroll-member-01",
        userId: "user-member-01",
        lessonId: "les-01",
        watchedSeconds: 60,
        lastPositionSec: 60,
        isCompleted: true,
        completedAt: addDaysISO(-10),
        updatedAt: addDaysISO(-10),
      },
      {
        id: "prog-02",
        enrollmentId: "enroll-member-01",
        userId: "user-member-01",
        lessonId: "les-02",
        watchedSeconds: 52,
        lastPositionSec: 52,
        isCompleted: true,
        completedAt: addDaysISO(-5),
        updatedAt: addDaysISO(-5),
      },
      {
        id: "prog-03",
        enrollmentId: "enroll-member-01",
        userId: "user-member-01",
        lessonId: "les-03",
        watchedSeconds: 28,
        lastPositionSec: 28,
        isCompleted: false, // Đang xem dở ở giây thứ 28/75 (chưa đạt 80% = 60s)
        completedAt: null,
        updatedAt: addDaysISO(-1),
      },
    ],
    trainerAvailabilities: [
      // HLV Lê Hoàng Nam (user-trainer-01): làm việc tất cả các ngày trong tuần (0..6) với 4 ca mẫu
      ...[0, 1, 2, 3, 4, 5, 6].flatMap((day) => [
        {
          id: `avail-t1-d${day}-s1`,
          trainerId: "user-trainer-01",
          dayOfWeek: day,
          startTime: "08:00",
          endTime: "09:00",
          isActive: true,
        },
        {
          id: `avail-t1-d${day}-s2`,
          trainerId: "user-trainer-01",
          dayOfWeek: day,
          startTime: "10:00",
          endTime: "11:00",
          isActive: true,
        },
        {
          id: `avail-t1-d${day}-s3`,
          trainerId: "user-trainer-01",
          dayOfWeek: day,
          startTime: "16:00",
          endTime: "17:00",
          isActive: true,
        },
        {
          id: `avail-t1-d${day}-s4`,
          trainerId: "user-trainer-01",
          dayOfWeek: day,
          startTime: "18:00",
          endTime: "19:00",
          isActive: true,
        },
        {
          id: `avail-t1-d${day}-s5`,
          trainerId: "user-trainer-01",
          dayOfWeek: day,
          startTime: "19:30",
          endTime: "20:30",
          isActive: true,
        },
      ]),
      // HLV Trần Bảo Ngọc (user-trainer-02)
      ...[0, 1, 2, 3, 4, 5, 6].flatMap((day) => [
        {
          id: `avail-t2-d${day}-s1`,
          trainerId: "user-trainer-02",
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "10:00",
          isActive: true,
        },
        {
          id: `avail-t2-d${day}-s2`,
          trainerId: "user-trainer-02",
          dayOfWeek: day,
          startTime: "15:00",
          endTime: "16:00",
          isActive: true,
        },
        {
          id: `avail-t2-d${day}-s3`,
          trainerId: "user-trainer-02",
          dayOfWeek: day,
          startTime: "17:30",
          endTime: "18:30",
          isActive: true,
        },
        {
          id: `avail-t2-d${day}-s4`,
          trainerId: "user-trainer-02",
          dayOfWeek: day,
          startTime: "19:00",
          endTime: "20:00",
          isActive: true,
        },
      ]),
    ],
    ptBookings: [
      {
        id: "booking-01-completed",
        enrollmentId: "enroll-member-01",
        memberId: "user-member-01",
        trainerId: "user-trainer-01",
        bookingDate: yesterdayStr,
        startTime: "18:00",
        endTime: "19:00",
        focusArea: "Ngực - Vai - Tay sau (Push Hypertrophy)",
        trainerNotes: "Học viên hoàn thành tốt 4 hiệp Bench Press 65kg x 8 reps, khóa bả vai rất chắc chắn.",
        status: "COMPLETED",
      },
      {
        id: "booking-02-today-confirmed",
        enrollmentId: "enroll-member-01",
        memberId: "user-member-01",
        trainerId: "user-trainer-01",
        bookingDate: todayStr,
        startTime: "18:00",
        endTime: "19:00",
        focusArea: "Thân dưới: Barbell Squat & Romanian Deadlift (Chân - Mông)",
        trainerNotes: null,
        status: "CONFIRMED",
      },
      {
        id: "booking-03-tomorrow-confirmed",
        enrollmentId: "enroll-member-01",
        memberId: "user-member-01",
        trainerId: "user-trainer-01",
        bookingDate: tomorrowStr,
        startTime: "16:00",
        endTime: "17:00",
        focusArea: "Lưng - Xô & Tay trước (Pull Day + Core)",
        trainerNotes: null,
        status: "CONFIRMED",
      },
    ],
    gymCheckins: [
      {
        id: "chk-01",
        enrollmentId: "enroll-member-01",
        memberId: "user-member-01",
        ptBookingId: "booking-01-completed",
        verifiedById: "user-trainer-01",
        checkinType: "PT_SESSION",
        qrTokenHash: "sha256-9f8e7d6c5b4a3210-pt-session",
        checkinTime: addDaysISO(-1),
        checkoutTime: addDaysISO(-1),
      },
      {
        id: "chk-02",
        enrollmentId: "enroll-member-01",
        memberId: "user-member-01",
        ptBookingId: null,
        verifiedById: "user-admin-01",
        checkinType: "GYM_ENTRY",
        qrTokenHash: "sha256-1a2b3c4d5e6f7890-gym-entry",
        checkinTime: addDaysISO(-3),
        checkoutTime: addDaysISO(-3),
      },
    ],
    bodyMetricsLogs: [
      {
        id: "metrics-log-01",
        userId: "user-member-01",
        heightCm: 174,
        weightKg: 66.5,
        bodyFatPct: 18.5,
        activityLevel: 1.55,
        bmi: 21.96,
        tdeeCalories: 2510,
        fitnessGoal: "MUSCLE_GAIN",
        allergies: ["LACTOSE"],
        recordedAt: addDaysISO(-30),
      },
      {
        id: "metrics-log-02",
        userId: "user-member-01",
        heightCm: 174,
        weightKg: 68.0,
        bodyFatPct: 17.2,
        activityLevel: 1.55,
        bmi: 22.46,
        tdeeCalories: 2545,
        fitnessGoal: "MUSCLE_GAIN",
        allergies: ["LACTOSE"],
        recordedAt: addDaysISO(-14),
      },
      {
        id: "metrics-log-03",
        userId: "user-member-01",
        heightCm: 174,
        weightKg: 69.4,
        bodyFatPct: 16.4,
        activityLevel: 1.55,
        bmi: 22.92,
        tdeeCalories: 2580,
        fitnessGoal: "MUSCLE_GAIN",
        allergies: ["LACTOSE"],
        recordedAt: addDaysISO(-2),
      },
    ],
    aiConsultationLogs: [
      {
        id: "ai-log-01",
        userId: "user-member-01",
        metricsLogId: "metrics-log-03",
        targetMacros: {
          bmr: 1665,
          tdee: 2580,
          calories: 2880,
          proteinGrams: 175,
          carbsGrams: 365,
          fatGrams: 80,
        },
        excludedAllergens: ["LACTOSE"],
        mealPlanMarkdown: `### Thực Đơn Tăng Cơ Sạch (Lean Bulk 2,880 Kcal) — Đã Lọc Bỏ Lactose
- **Bữa sáng (07:00 - 720 Kcal):** 100g Yến mạch nấu sữa hạnh nhân không đường + 4 quả trứng gà (2 nguyên quả, 2 lòng trắng) + 1 quả chuối tiêu.
- **Bữa phụ sáng (10:00 - 320 Kcal):** 1 khoai lang mật nướng (150g) + 30g hạt hạnh nhân rang mộc.
- **Bữa trưa (12:30 - 820 Kcal):** 200g ức gà áp chảo sốt tiêu đen + 250g cơm gạo lứt trắng trộn + bông cải xanh luộc & 1 muỗng dầu ô liu.
- **Trước tập 30 phút (17:00 - 250 Kcal):** 2 lát bánh mì nguyên cám + 1 muỗng **ABE Pump Stim-Free** hoặc **Creatine Monohydrate 5g**.
- **Ngay sau tập (19:00 - 120 Kcal):** 1 muỗng **Dymatize ISO100 Hydrolyzed Whey Isolate** (Đã tách 100% đường sữa Lactose, êm bụng tuyệt đối).
- **Bữa tối (20:00 - 650 Kcal):** 180g cá hồi hoặc thăn bò nạc áp chảo + 200g cơm trắng + salad rau xanh.`,
        recommendedItems: {
          supplementVariantIds: ["var-iso100-5lb-choco", "var-on-creatine-600g"],
          courseIds: ["course-hybrid-vip-90"],
          reasoning:
            "Do bạn có cơ địa Bất dung nạp Lactose, hệ thống AI đã tự động loại bỏ Rule 1 Whey Blend (chứa Whey Concentrate có đường Lactose) và chỉ đề xuất Dymatize ISO100 Hydrolyzed Isolate 0g Lactose kết hợp Creatine Monohydrate.",
        },
        createdAt: addDaysISO(-2),
      },
    ],
    vouchers: [
      {
        id: "vouch-01",
        code: "GYMHUB50",
        discountType: "FIXED_AMOUNT",
        discountValue: 150000,
        minOrderValue: 1000000,
        usageLimit: 100,
        usedCount: 14,
        validUntil: addDaysISO(90),
      },
      {
        id: "vouch-02",
        code: "WHEYCOMBO",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 2000000,
        usageLimit: 50,
        usedCount: 8,
        validUntil: addDaysISO(60),
      },
      {
        id: "vouch-03",
        code: "CLEARANCE20",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderValue: 500000,
        usageLimit: 30,
        usedCount: 3,
        validUntil: addDaysISO(30),
      },
    ],
    orders: [
      {
        id: "ord-demo-01",
        orderCode: "GH-20261025-8801",
        userId: "user-member-01",
        voucherId: "vouch-02",
        hasPhysicalItems: true,
        shippingAddress: {
          recipientName: "Nguyễn Minh Quân",
          phone: "0908123456",
          addressLine: "268 Lý Thường Kiệt, Phường 14",
          district: "Quận 10",
          city: "TP. Hồ Chí Minh",
          note: "Giao giờ hành chính, gọi trước 15 phút",
        },
        subtotalAmount: 6590000,
        shippingFee: 30000,
        discountAmount: 659000,
        totalAmount: 5961000,
        paymentMethod: "VNPAY",
        paymentStatus: "PAID",
        fulfillmentStatus: "DELIVERED",
        createdAt: addDaysISO(-15),
      },
      {
        id: "ord-demo-02",
        orderCode: "GH-20261105-9104",
        userId: "user-member-01",
        voucherId: null,
        hasPhysicalItems: true,
        shippingAddress: {
          recipientName: "Nguyễn Minh Quân",
          phone: "0908123456",
          addressLine: "268 Lý Thường Kiệt, Phường 14",
          district: "Quận 10",
          city: "TP. Hồ Chí Minh",
        },
        subtotalAmount: 2170000,
        shippingFee: 30000,
        discountAmount: 0,
        totalAmount: 2200000,
        paymentMethod: "MOMO",
        paymentStatus: "PAID",
        fulfillmentStatus: "SHIPPING",
        createdAt: addDaysISO(-3),
      },
    ],
    orderItems: [
      {
        id: "oi-01",
        orderId: "ord-demo-01",
        itemType: "COURSE_MEMBERSHIP",
        supplementVariantId: null,
        allocatedBatchId: null,
        courseId: "course-hybrid-vip-90",
        itemNameSnapshot: "Gói Hybrid Toàn Diện: Thẻ Tập VIP 90 Ngày + 12 Buổi PT 1-1 & Giáo Án Video Hypertrophy",
        quantity: 1,
        unitPrice: 4500000,
        lineTotal: 4500000,
      },
      {
        id: "oi-02",
        orderId: "ord-demo-01",
        itemType: "SUPPLEMENT_VARIANT",
        supplementVariantId: "var-iso100-5lb-choco",
        allocatedBatchId: "batch-iso-01-near", // Đã tự động lấy từ lô hết hạn sớm nhất LOT-2026-ISO-01A theo chuẩn FEFO
        courseId: null,
        itemNameSnapshot: "Dymatize ISO100 Hydrolyzed 100% Whey Protein Isolate - Gourmet Chocolate (5 Lbs)",
        quantity: 1,
        unitPrice: 2090000,
        lineTotal: 2090000,
      },
      {
        id: "oi-03",
        orderId: "ord-demo-02",
        itemType: "SUPPLEMENT_VARIANT",
        supplementVariantId: "var-r1-5lb-choco",
        allocatedBatchId: "batch-r1-01-near", // Xuất kho FEFO từ lô LOT-2026-R1-08A
        courseId: null,
        itemNameSnapshot: "Rule 1 R1 Whey Blend 100% Whey Protein - Double Rich Chocolate (5 Lbs)",
        quantity: 1,
        unitPrice: 1390000,
        lineTotal: 1390000,
      },
      {
        id: "oi-04",
        orderId: "ord-demo-02",
        itemType: "SUPPLEMENT_VARIANT",
        supplementVariantId: "var-on-creatine-600g",
        allocatedBatchId: "batch-cre-01-avail", // Tự động bỏ qua lô LOT-2024-CRE-OLD đã EXPIRED và lấy lô LOT-2027-CRE-NEW!
        courseId: null,
        itemNameSnapshot: "Optimum Nutrition Micronized Creatine Monohydrate 100% - Không vị (600g)",
        quantity: 1,
        unitPrice: 780000,
        lineTotal: 780000,
      },
    ],
  };
}

