import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

//pet関連のデータを取得
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if(!user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401});
    }
    const { data: { pet } , error } = await supabase
        .from("pet")
        .select("*")
        .eq("user_id", user.id)
        .single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(pet);
}

//pet関連のデータを更新
export async function PUT(req: NextRequest) {
    const supabase = await createClient();
    const updates = await req.json();

    const { data: { user } } = await supabase.auth.getUser();

    //認証チェック
    if(!user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401});
    }

    const { data, error } = await supabase
        .from("pet")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ pet: data });
}
