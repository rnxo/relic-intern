// import { GoogleGenAI } from "@google/genai";
// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/app/lib/supabase/server";

// // --- GET: 最新の相談履歴/提案を取得 ---
// export async function GET(req: NextRequest) {
//     const supabase = await createClient();
//     try {
//         const { searchParams } = new URL(req.url);
//         const petId = searchParams.get("petId");
//         if (!petId) return NextResponse.json({ error: "petId required" }, { status: 400 });

//         // 最新の解析結果（system_analysis）を1件取得
//         const { data, error } = await supabase
//             .from("lumi_consultation_history")
//             .select("*")
//             .eq("pet_id", petId)
//             .eq("role", "lumi_analysis")
//             .order("created_at", { ascending: false })
//             .limit(1)
//             .single();

//         if (error || !data) return NextResponse.json({ insight: null });

//         return NextResponse.json({
//             insight: {
//                 analysis: data.content,
//                 suggestions: data.suggestions,
//                 created_at: data.created_at
//             }
//         });
//     } catch {
//         return NextResponse.json({ insight: null });
//     }
// }

// // --- POST: 新しい解析またはチャットの生成 ---
// export async function POST(req: NextRequest) {
//     const supabase = createClient();
//     try {
//         const body = await req.json();
//         const { petId, mode, habitHistory, message, context } = body;

//         const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//         if (mode === "analyze") {
//             // タイムブロックごとの完了密度（回数）を集計
//             const blocks = { morning: 0, daytime: 0, night: 0, midnight: 0 };
//             habitHistory.forEach((h: any) => {
//                 if (h.timeBlock && blocks[h.timeBlock as keyof typeof blocks] !== undefined) {
//                     blocks[h.timeBlock as keyof typeof blocks]++;
//                 }
//             });

//             // --- ライフパターン分析モード ---
//             const prompt = `
// あなたは習慣分析AIコーチのLumiです。ユーザーは「夜型」の特性を持つ人物です。
// 全習慣データの完了履歴を分析し、以下の時間帯別の完了密度（回数）を元に分析と提案を行ってください。

// 【時間帯別タスク完了数】
// - 朝 (morning): ${blocks.morning}回
// - 日中 (daytime): ${blocks.daytime}回
// - 夜 (night): ${blocks.night}回
// - 深夜 (midnight): ${blocks.midnight}回

// 【詳細な直近データ(参考)】
// ${JSON.stringify(habitHistory.slice(-10))}

// 【指示】
// 1. 各タイムブロックの密度を見て、もし深夜 (midnight) にタスクを詰め込みすぎている場合は、
// 「詰め込みすぎちゃう？朝もやろうよ」「夜型なのはわかるけど、こんな習慣はどう？」といった、フランクで心配するような口調を交えて分析結果 (analysis) を書いてください。
// 2. 夜型の集中力など良い部分は肯定しつつ、適度なバランスを保つための具体的な「おすすめの習慣」を提案してください。
// 3. 回答は必ず以下のJSON形式のみで返してください。

// {
//     "analysis": "分析テキスト(Lumiとしてのメッセージ)",
//     "suggestions": ["提案1", "提案2", "提案3"]
// }
// `.trim();

//             const response = await ai.models.generateContent({
//                 model: "gemini-3-flash-preview",
//                 contents: prompt,
//             });
//             const responseText = response.text || "";
//             // Markdownの ```json コードブロックなども考慮した正規表現
//             const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//             const insight = JSON.parse(jsonMatch![0]);

//             // DBに保存
//             await supabase.from("lumi_consultation_history").insert({
//                 pet_id: petId,
//                 role: "lumi_analysis",
//                 content: insight.analysis,
//                 suggestions: insight.suggestions
//             });

//             return NextResponse.json(insight);

//         } else if (mode === "chat") {
//             // --- チャットモード ---
//             const prompt = `
// あなたはコーチLumiです。以前の分析結果に基づいたユーザーとの議論です。
// コンテキスト: ${context}
// ユーザーの問いかけ: ${message}
// 短く、論理的で温かい言葉で答えて。
// `.trim();

//             const response = await ai.models.generateContent({
//                 model: "gemini-3-flash-preview",
//                 contents: prompt,
//             });
//             const reply = response.text?.trim() || "うまく答えが見つからなかったよ。";

//             // チャット履歴も保存（任意）
//             await supabase.from("lumi_consultation_history").insert({
//                 pet_id: petId,
//                 role: "lumi_chat",
//                 content: reply
//             });

//             return NextResponse.json({ message: reply });
//         }

//     } catch (error) {
//         console.error("AI Chat Error:", error);
//         return NextResponse.json({ error: "Failed" }, { status: 500 });
//     }
// }
