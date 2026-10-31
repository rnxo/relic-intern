import { consultationService } from "@/app/features/consultation/consultation.service";
import { NextRequest, NextResponse } from "next/server";

// 相談室を離れたときに呼ばれる。メッセージが0件の場合だけ削除する
// （navigator.sendBeacon は POST しか送れないため DELETE ではなく POST にしている）
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  try {
    const { session: sessionId } = await params;
    await consultationService.deleteSessionIfEmpty(sessionId);
    return NextResponse.json({ message: "success" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
