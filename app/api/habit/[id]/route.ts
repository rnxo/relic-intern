import { NextRequest, NextResponse } from "next/server";
import { habitService } from "@/app/features/habit/habit.service";


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await habitService.delete(id);
        return NextResponse.json({message: "success to delete habit data"}, {status: 200});
    } catch {
        return NextResponse.json({message: "failed to delete habit data"}, {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    { params } : { params: Promise<{ id: string }>}
) {
    const { id } = await params;
    const body = await req.json();
    try {
        const data = await habitService.update(id, body);
        return NextResponse.json({message: "success to update habit data", data}, { status: 200});
    } catch (error){
        return NextResponse.json(error, { status: 500});
    }

}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await habitService.complete(id);
    return NextResponse.json({ message: "success to patch habit data", data });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


// export async function PUT(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {
//     const { id } = await params;
//     const body = await req.json();
//     const supabase = await createClient();

//     const { data: { user }, error: authError } = await supabase.auth.getUser();
//     if (authError || !user) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const { data, error } = await supabase
//             .from("habits")
//             .update(body)
//             .eq("id", id)
//             .eq("user_id", user.id)
//             .select()
//             .single();
        
//         if(error) throw new Error(error.message);
//         return NextResponse.json({ message: "update success", data});
//     } catch {
//         return NextResponse.json({ message: "update failed"}, { status: 500});
//     }
// }
