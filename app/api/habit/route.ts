import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    const supabase = await createClient();

    //ログイン中のユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if(authError || !user) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401});
    }

    //すべてのhabitデータからuser_idと一致したものを取得
    const { data, error } = await supabase.from("habits").select("*").eq("user_id", user.id);

    if(error) return NextResponse.json({ error: error.message}, { status: 500});

    return NextResponse.json({ habits: data});
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if(authError || !user) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401});
    } 

    try {
        const body = await req.json();
        const { data, error } = await supabase.from("habits").insert([
            {
                id: body.id,
                user_id: user.id,
                title: body.title,
                timeBlock: body.timeBlock,
                targetDays: body.targetDays,
                isCompleted: body.isCompleted,
                createdAt: body.createdAt,
            }
        ]).eq("user_id", user.id).select();

        if(error) return NextResponse.json({ error: error.message}, { status: 500});

        return NextResponse.json({ message: "NEW HABIT POST SUCCESS", data});
    } catch { 
        return NextResponse.json({ error: "Invalid request body"}, { status: 400});
    }
}