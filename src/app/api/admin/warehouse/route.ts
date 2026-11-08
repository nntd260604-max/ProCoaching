import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAnalyticsAndWarehouse,
  importNewInventoryBatch,
  applyFlashSaleForNearExpiryVariant,
  simulateWebhookPaymentIpn,
} from "@/lib/services/admin-warehouse.service";
import { getDb, resetDemoDatabase } from "@/lib/db/runtime-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getAdminAnalyticsAndWarehouse();
  const db = getDb();
  const variants = db.supplementVariants.map((v) => {
    const prod = db.supplementProducts.find((p) => p.id === v.productId);
    return {
      ...v,
      productName: prod?.name || "Thực phẩm bổ sung",
    };
  });
  return NextResponse.json({ ...data, variants });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "IMPORT_BATCH") {
      const res = importNewInventoryBatch({
        variantId: body.variantId,
        batchCode: body.batchCode,
        supplierName: body.supplierName,
        importPrice: Number(body.importPrice),
        initialQuantity: Number(body.initialQuantity),
        manufacturedDate: body.manufacturedDate,
        expiryDate: body.expiryDate,
      });
      return NextResponse.json(res);
    }

    if (action === "FLASH_SALE") {
      const res = applyFlashSaleForNearExpiryVariant(
        body.variantId,
        Number(body.discountPct || 20)
      );
      return NextResponse.json(res);
    }

    if (action === "WEBHOOK_IPN") {
      const res = simulateWebhookPaymentIpn(body.orderId);
      return NextResponse.json({ order: res });
    }

    if (action === "RESET_DEMO") {
      resetDemoDatabase();
      return NextResponse.json({ message: "Đã khôi phục dữ liệu mẫu ban đầu thành công!" });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ." }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi xử lý tác vụ Quản trị viên.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

