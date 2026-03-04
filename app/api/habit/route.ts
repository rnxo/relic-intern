import { supabase } from "../../lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

// habitテーブルからデータを取得
export async function GET() {
    const { data, error } = await supabase.from("habits").select("*");
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ habits: data });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // フロントの型を DBのカラム名に合わせたオブジェクトに変換
        const { data, error } = await supabase.from("habits").insert([
            {
                id: body.id,
                title: body.title,
                timeBlock: body.timeBlock,
                targetDays: body.targetDays,
                isCompleted: body.isCompleted,
                createdAt: body.createdAt,
            }
        ]).select();

        if (error) {
            console.error("Supabase Error:", error); // サーバーログで詳細を確認
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Success", data });
    } catch (err) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}