import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase/client";

//pet関連のデータを取得
export async function GET() {
    const { data, error } = await supabase.from("pet").select("*").single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ pet: data });
}

//pet関連のデータを更新
export async function PUT(req: NextRequest) {
    const updates = await req.json();

    // 現在のペットを取得（本当は認証からuserIdを取得すべきですが、今は簡易的に最初の1件を更新）
    const { data: pet, error: fetchError } = await supabase.from("pet").select("id").single();

    if (fetchError || !pet) {
        return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    const { data, error } = await supabase
        .from("pet")
        .update(updates)
        .eq("id", pet.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ pet: data });
}
