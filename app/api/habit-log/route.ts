import { NextRequest, NextResponse } from "next/server";
import { habitLogRepository } from "@/app/features/habitLog/habitLog.repository";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from/to is required" }, { status: 400 });
  }

  const data = await habitLogRepository.getByRange({ from, to });
  return NextResponse.json(data);
}
