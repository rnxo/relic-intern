import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log("API HIT");
    console.log("params:", id);

    return NextResponse.json({
        message: "Dynamic route working",
        id: id,
    });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // 1. URLからIDを取り出す
    const { id } = await params;

    try {
        // 2. データベースから削除する (例: Prismaの場合)
        await supabase.from("habits").delete().eq("id", id);

        // 3. 成功レスポンスを返す
        return NextResponse.json({ message: "削除に成功しました", id });
    } catch (error) {
        // 失敗した場合はエラーを返す
        return NextResponse.json({ message: "削除に失敗しました" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();

    try {
        const { data, error } = await supabase
            .from("habits")
            .update(body)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ message: "更新成功", data });
    } catch (error) {
        return NextResponse.json({ message: "更新失敗" }, { status: 500 });
    }
}
