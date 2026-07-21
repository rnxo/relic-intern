import { consultationService } from "@/app/features/consultation/consultation.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  try {
    const { session: sessionId } = await params;
    const data = await consultationService.getChatRoomById(sessionId);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  try {
    const { session: sessionId } = await params;
    const body = await req.json();
    const lumiMessage = await consultationService.sendMessage(sessionId, body.content);
    return NextResponse.json({ message: "success", data: lumiMessage }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  try {
    const { session: sessionId } = await params;
    await consultationService.deleteSession(sessionId);
    return NextResponse.json({ message: "success" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
