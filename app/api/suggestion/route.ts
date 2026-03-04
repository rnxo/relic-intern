import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export async function POST(req: NextRequest) {
    try {
        const { habitHistory, activityLogs, currentLevel } = await req.json();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: `
あなたは「習慣分析官 Lumi」です。
ユーザーの「タスク完了時間」と「アプリ起動時間」のデータを分析し、論理的かつ親しみやすいアドバイスを行います。

【分析の視点】
1. ユーザーは「朝型」か「夜型」か？
2. タスクが集中している時間帯はどこか？
3. 逆に「ログインしているのにタスクが進んでいない魔の時間帯」はないか？
4. INTP気質のユーザー（論理的だが、ワクワクがないと動けない）に対し、知的好奇心を刺激する提案をする。

【回答のルール】
- 決めつけず「〜という傾向が見えるよ」と分析を示す。
- 現実的な「新しい習慣（例：深夜1時に終わるなら、25分に一度立ち上がるなど）」を2〜3提案する。
- 15レベル以上（フクロウ）なら、よりデータに基づいた知的な口調にする。
`.trim(),
        });

        const prompt = `
以下のデータを分析して、改善案を教えて。

■ タスク完了履歴（時間と内容）:
${JSON.stringify(habitHistory, null, 2)}

■ アプリ活動ログ:
${JSON.stringify(activityLogs, null, 2)}

■ Lumiのレベル: ${currentLevel}

回答は以下のJSON形式で返してください。
{
    "analysis": "分析結果のテキスト",
    "suggestions": ["提案1", "提案2"],
    "patternType": "night_owl" | "early_bird" | "irregular"
}
`.trim();

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 堅牢なJSON抽出: 最初の { から 最後の } までを探す
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }

        const insight = JSON.parse(jsonMatch[0]);

        return NextResponse.json(insight);

    } catch (error) {
        console.error("Suggestion error:", error);
        // エラー時のフォールバックデータ
        return NextResponse.json({
            analysis: "データの解析中に迷子になっちゃった。もう一度挑戦してみて！",
            suggestions: ["少し時間を置いてからやり直す"],
            patternType: "irregular"
        });
    }
}
