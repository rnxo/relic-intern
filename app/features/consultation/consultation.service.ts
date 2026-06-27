import { consultationRepository } from "./consultation.repository";
import { ChatRoom, Message } from "./consultation.type";
import { genAI } from "@/app/lib/gemini";
import { LUMI_SYSTEM_PROMPT, buildPrompt } from "./consultation.prompt";

async function sendMessageToLumi(sessionId: string, userContent: string): Promise<Message> {
  const prevMessages = await consultationRepository.getMessageBySession(sessionId);
  const prompt = buildPrompt(prevMessages, userContent);

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { systemInstruction: LUMI_SYSTEM_PROMPT },
  });

  const lumiContent = result.text ?? "申し訳ありません、応答を生成できませんでした。";

  await consultationRepository.createMessage(sessionId, "user", userContent);
  const lumiMessage = await consultationRepository.createMessage(sessionId, "lumi", lumiContent);

  return lumiMessage;
}

// C-05: ユーザーの最初のメッセージからセッションタイトルを自動生成
async function generateSessionTitle(userContent: string): Promise<string> {
  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `次のメッセージを元に、相談セッションのタイトルを10文字以内の日本語で生成してください。タイトルのみを返してください。\n\n「${userContent}」`,
  });
  return (result.text ?? "相談セッション").trim().slice(0, 10);
}

export const consultationService = {
  getChatRoom: async (sessionTitle: string): Promise<ChatRoom> => {
    const sessionId = await consultationRepository.getSessionIdByTitle(sessionTitle);
    const [messages, session] = await Promise.all([
      consultationRepository.getMessageBySession(sessionId),
      consultationRepository.getSessionById(sessionId),
    ]);
    return { ...session, messages };
  },

  getChatRoomById: async (sessionId: string): Promise<ChatRoom> => {
    const [messages, session] = await Promise.all([
      consultationRepository.getMessageBySession(sessionId),
      consultationRepository.getSessionById(sessionId),
    ]);
    return { ...session, messages };
  },

  createChatRoom: async (inputTitle: string, inputContent: string, inputRole: string) => {
    const session = await consultationRepository.createSession(inputTitle);
    const message = await consultationRepository.createMessage(session.id, inputRole, inputContent);
    return message;
  },

  sendMessage: sendMessageToLumi,

  // C-05: セッション作成 + 初回メッセージ送信 + タイトル自動生成
  initiateSession: async (title: string, userContent: string): Promise<string> => {
    const session = await consultationRepository.createSession(title);
    await sendMessageToLumi(session.id, userContent);
    const aiTitle = await generateSessionTitle(userContent);
    await consultationRepository.updateSessionTitle(session.id, aiTitle);
    return session.id;
  },

  getAllSessions: async () => {
    return consultationRepository.getAllSessions();
  },

  // C-06: セッション削除（関連メッセージも含む）
  deleteSession: async (sessionId: string): Promise<void> => {
    return consultationRepository.deleteSession(sessionId);
  },
};
