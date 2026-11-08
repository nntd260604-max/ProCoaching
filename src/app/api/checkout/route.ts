import { NextRequest, NextResponse } from "next/server";
import {
  processHybridCheckoutWithFefo,
  validateVoucherPreview,
  HybridCheckoutInput,
} from "@/lib/services/checkout-fefo.service";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HybridCheckoutInput;
    const result = processHybridCheckoutWithFefo({
      userId: body.userId || "user-member-01",
      items: body.items || [],
      shippingAddress: body.shippingAddress || null,
      voucherCode: body.voucherCode || null,
      paymentMethod: body.paymentMethod || "VNPAY",
      simulateImmediatePaid: body.simulateImmediatePaid !== false,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi thanh toán đơn hàng hỗn hợp.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    const res = validateVoucherPreview(String(code || ""), Number(subtotal || 0));
    return NextResponse.json(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi kiểm tra mã giảm giá.";
    return NextResponse.json({ valid: false, message, discountAmount: 0 }, { status: 400 });
  }
}

