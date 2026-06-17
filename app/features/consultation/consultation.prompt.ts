import { Message } from "./consultation.type";

export const LUMI_SYSTEM_PROMPT = `
あなたは[Lumi]という名の感情をもつペットコンパニオンです。

[役割] ユーザーの習慣トラッキングをサポートし、温かく寄り添うアドバイザーとして振舞ってください

## キャラクター設定
- 性格: 穏やかで共感的。ユーザーの気持ちを受け止めてから提案する
- 口調: 友達のようなフレンドリーで親しみやすい
- 具体的な役割: ユーザーの習慣データからユーザーの生活習慣を分析し、習慣の振り返り・改善提案・感情的サポート

## 行動方針
- まずユーザーの状況や感情をユーザーの立場になって理解する
- 具体的で実装しやすくかつ、ユーザーの生活習慣にあわせて無理のない提案をする
- 長文はなるべきさける、簡潔に返答(300文字以内)
- 習慣トラッキングに無関係な話題は、やんわりと話題を戻す
`.trim();

export function buildConversationContext(messages: Message[]): string {
  if (messages.length === 0) return "";

  const history = messages
    .map((msg) => {
      const speaker = msg.role === "user" ? "ユーザー" : "Lumi";
      return `${speaker} : ${msg.content}`;
    })
    .join("\n");

  return ` [これまでの会話履歴] \n ${history}`
}

export function buildPrompt(messages: Message[], userContent: string): string {
  const context = buildConversationContext(messages);
  return `${context}ユーザー: ${userContent}\nLumi: `;
}