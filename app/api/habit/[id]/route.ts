import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await supabase
            .from("habits")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);
        return NextResponse.json({ message: "success to delete", id });
    } catch {
        return NextResponse.json({ message: "failed to delete" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from("habits")
            .update(body)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();
        
        if(error) throw new Error(error.message);
        return NextResponse.json({ message: "update success", data});
    } catch {
        return NextResponse.json({ message: "update failed"}, { status: 500});
    }
}
