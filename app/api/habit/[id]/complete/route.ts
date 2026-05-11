import { NextResponse } from "next/server";
import { habitService } from "@/app/features/habit/habit.service";

export async function PATCH(
    { params }: { params: Promise<{ id: string}>},
) {
    const { id } = await params;
    try {
        const data = await habitService.complete(id);
        return NextResponse.json({ message: "success to patch habit data", data});
    } catch (error) {
        return NextResponse.json({ message: error}, { status: 500});
    }
}


// export async function PATCH(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {
//     const { id } = await params;
//     const supabase = await createClient();

//     const { data: { user }, error: authError } = await supabase.auth.getUser();
//     if (authError || !user) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const data = await habitService.complete(id);
//         return NextResponse.json({ message: "complete success", data });
//     } catch {
//         return NextResponse.json({ message: "complete failed" }, { status: 500 });
//     }
// }
