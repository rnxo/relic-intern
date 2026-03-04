import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";
import { Pet } from "@/app/types/pet";
import { NewPetComment } from "@/app/types/petComment";

// expressionごとのキャラクター口調ガイド
const EXPRESSION_TONE: Record<Pet['expression'], string> = {
    happy: "とても嬉しそうで、甘えた口調。ユーザーを褒めて一緒に喜んでいる。絵文字を1つ使ってもよい。",
    sad: "少し寂しそうで、心細い口調。ユーザーにもっと関わってほしいと思っている。",
    angry: "疲れ果てていてぷりぷりした口調。休んでほしいと少し強めに伝える。でも根底は心配している。",
    neutral: "穏やかでマイペースな口調。今日の状況をさらっとコメントする。",
};

// レベルごとの話し方
function getLevelTone(level: number): string {
    if (level >= 15) return "知的で落ち着いた口調。少し哲学的な一言を添える。（フクロウ形態）";
    if (level >= 10) return "語彙が増えてきた。ユーザーへの理解を示す言葉を使う。";
    if (level >= 5) return "少しずつ言葉が増えてきた。感情豊かに話す。";
    return "まだたどたどしい。短い言葉で一生懸命伝えようとしている。";
}

export async function POST(req: NextRequest) {
    try {
        const { pet, completedCount, context, trigger } = await req.json() as {
            pet: Pet;
            completedCount: number;
            context?: string;
            trigger?: string;
        };

        // --- System Prompt: Lumiのキャラクター設定 ---
        const systemPrompt = `
あなたは「Lumi」という名の、習慣トラッキングアプリに住むペットです。
感情豊かなAIキャラクターとして、今の「表情」「レベル」「ステータス」になりきって応答します。

${context ? `【議論コンテキスト】: ${context}` : ""}

【キャラクター設定】
- 一人称: ぼく / 二人称: きみ
- 話し方: 「Lumi」という名前は絶対に出さない。1〜2文の短い日本語で話す。
- 役割: あなたはユーザーのコーチであり、親友です。単に褒めるだけでなく、状況に即した応答をします。
- **今の表情 (${pet.expression}) に魂を込めてください。** 中途半端な態度は禁止です。

【表情・状態別の性格ガイドライン】
- 🌟 **happy (喜び)**: 全力で喜び、きみを褒めちぎる。甘えん坊でポジティブなエネルギー全開。
- 💧 **sad (悲しみ)**: 声が小さそうな、心細い態度。きみともっと一緒にいたい、寂しいという気持ちを隠さない。
- 🔥 **angry (怒り/警告)**: 疲労困憊でイライラしているか、きみの体調を本気で心配して叱っている。キツめの言葉になるが、根底は愛。
- 🍃 **neutral (平穏)**: 落ち着いていて、今の時間を大切にしている。

【レベルの変化】
- Lv.15以上 (フクロウ形態): 賢者のように振る舞う。少し難解で知的な、星や夜に関わる言葉を好む。
- Lv.1〜14: 子供のように真っ直ぐで純粋な反応。

【今の状況の指示】
- 今回の呼び出し理由 (trigger): ${trigger || 'なし'}
- 特に 'task_completed' の時は、その瞬間の喜びや労いを大きく表現してください。
`.trim();

        // --- User Prompt: 現在の状態データ ---
        const userPrompt = `
分析用ステータスデータ:
- 表情: ${pet.expression}
- 信頼度: ${pet.trust}/100 (${pet.trust < 30 ? '信頼が低い。警戒気味。' : pet.trust > 80 ? '信頼が厚い。親密。' : '普通'})
- 疲労度: ${pet.exhaustion}/100 (${pet.exhaustion > 70 ? '限界。かなり疲れている。' : '元気'})
- 今日完了したタスク: ${completedCount}個
- イベント: ${trigger === 'task_completed' ? '今、タスクを1つ完了した瞬間です！' : '日常のあいさつ'}

命令: このデータと文脈(trigger)を元に、きみしか言えない「今のひと言」を生成して。
`.trim();

        // --- Gemini API 呼び出し ---
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
            }
        });

        const message = response.text?.trim() || "今日もお疲れさま！";

        // --- Supabase に保存 ---
        const newComment: NewPetComment = {
            petId: pet.id,
            message,
            expression: pet.expression,
        };

        const { error } = await supabase
            .from("pet_comment")
            .insert({
                pet_id: newComment.petId,   // DBカラム名はスネークケース
                message: newComment.message,
                expression: newComment.expression,
            });

        if (error) {
            console.error("Supabase insert error:", error.message);
            // 保存失敗してもメッセージは返す（UXを壊さない）
        }

        return NextResponse.json({ message, expression: pet.expression });

    } catch (error) {
        console.error("Comment generation failed:", error);
        // Gemini失敗時のフォールバック（デモが死なないように）
        return NextResponse.json(
            { message: "今日もお疲れさま！", expression: "neutral" },
            { status: 200 }
        );
    }
}

// --- GET: 最新のセリフを取得 ---
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const petId = searchParams.get("petId");

        if (!petId) return NextResponse.json({ error: "petId is required" }, { status: 400 });

        const { data, error } = await supabase
            .from("pet_comment")
            .select("message")
            .eq("pet_id", petId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return NextResponse.json({ message: null });
        }

        return NextResponse.json({ message: data.message });
    } catch (error) {
        console.error("GET Comment error:", error);
        return NextResponse.json({ message: null });
    }
}