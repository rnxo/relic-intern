// import { profileRepository } from "@/app/features/profile/profile.repository";
// import { profileService } from "@/app/features/profile/profile.service";
// import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   req: NextRequest,
//   params: Promise<{ parmas: string}>,
// ) {
//   const { id } = await params;
//   const body = await req.json();

//   try {
//     const data = await profileService.update(body);
//     return NextResponse.json({ message: "success to update user profile data", data});
//   } catch (error) {
//     return NextResponse.json(error, { status: 500});
//   }

// }
