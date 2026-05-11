import { habitService } from "@/app/features/habit/habit.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const data = await habitService.getAll();
    
    if(!data) return NextResponse.json({ error: "there is no habit data found"}, { status: 500});
    return NextResponse.json(data); //デプロイ時には成功メッセージオンリーにする
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = await habitService.create(body);
    
    return NextResponse.json({message: "successed to create a new habit data", data}, { status: 200});
}




//旧仕様でのHTTPメソッド
// export async function GET() {
//     const supabase = await createClient();

//     //ログイン中のユーザー情報を取得
//     const { data: { user }, error: authError } = await supabase.auth.getUser();

//     if(authError || !user) {
//         return NextResponse.json({error: "Unauthorized"}, { status: 401});
//     }

//     //すべてのhabitデータからuser_idと一致したものを取得
//     const { data, error } = await supabase.from("habits").select("*").eq("user_id", user.id);

//     if(error) return NextResponse.json({ error: error.message}, { status: 500});

//     return NextResponse.json({ habits: data});
// }



// export async function POST(req: NextRequest) {
//     const supabase = await createClient();

//     const { data: { user }, error: authError } = await supabase.auth.getUser();
//     if(authError || !user) {
//         return NextResponse.json({error: "Unauthorized"}, { status: 401});
//     } 

//     try {
//         const body = await req.json();
//         const { data, error } = await supabase
//         .from("habits")
//         .insert(
//             {
//                 user_id: user.id,
//                 title: body.title,
//                 time_block: body.time_block,
//                 target_days: body.target_days,
//             }
//         )
//         .eq("user_id", user.id)
//         .select()
//         .single();

//         if(error) return NextResponse.json({ error: error.message}, { status: 500});

//         return NextResponse.json({ message: "NEW HABIT POST SUCCESS", data});
//     } catch { 
//         return NextResponse.json({ error: "Invalid request body"}, { status: 400});
//     }
// }