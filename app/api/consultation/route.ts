import { consultationService } from "@/app/features/consultation/consultation.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sessions = await consultationService.getAllSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 空の相談を作成してIDを返す
export async function POST() {
  try {
    const sessionId = await consultationService.createEmptySession();
    return NextResponse.json({ message: "success", sessionId }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
