import { profileRepository } from "@/app/features/profile/profile.repository";
import { profileService } from "@/app/features/profile/profile.service";
import { Profile } from "@/app/features/profile/profile.type";
import { NextRequest, NextResponse } from "next/server";

// const fakeData: Profile = {
//   id: "001",
//   userName: "skyremt",
//   maxFocusTime: "90",
//   maxFocusTimeScore: 3,
//   peakTimeBlock: "night",
//   peakTimeBlockScore: 3,
//   createdAt: "today",
//   updatedAt: "today"
//}

export async function GET() {
  try {
    const data = await profileService.get();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  try {
    const data = await profileService.update(body);
    return NextResponse.json({
      message: "success to update user profile data",
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
