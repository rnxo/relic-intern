import { consultationService } from "@/app/features/consultation/consultation.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const sessions = await consultationService.getAllSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = await consultationService.initiateSession(body.title, body.content);
    return NextResponse.json({ message: "success", sessionId }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
