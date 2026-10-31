import { consultationRepository } from "./consultation.repository";
import { ChatRoom, Message, SESSION_TITLE_MAX_LENGTH } from "./consultation.type";
import { getGenAI } from "@/app/lib/gemini";
import { LUMI_SYSTEM_PROMPT, buildPrompt } from "./consultation.prompt";

async function sendMessageToLumi(sessionId: string, userContent: string): Promise<Message> {
  const prevMessages = await consultationRepository.getMessageBySession(sessionId);
  const prompt = buildPrompt(prevMessages, userContent);

  const result = await getGenAI().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { systemInstruction: LUMI_SYSTEM_PROMPT },
  });

  const lumiContent = result.text ?? "申し訳ありません、応答を生成できませんでした。";

  await consultationRepository.createMessage(sessionId, "user", userContent);
  const lumiMessage = await consultationRepository.createMessage(sessionId, "lumi", lumiContent);

  return lumiMessage;
}

// 空の相談が残っていてよい時間（これを過ぎた空の相談は履歴一覧の取得時に削除する）
const STALE_EMPTY_SESSION_MINUTES = 10;

// 初期タイトル「相談_YYYY/MM/DD」（サーバーがUTCで動いても日本時間の日付にする）
function buildDefaultTitle(date: Date = new Date()): string {
  const dateStr = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return `相談_${dateStr}`;
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

  // 空の相談を作成してIDを返す（最初のメッセージは相談室で送る）
  createEmptySession: async (): Promise<string> => {
    const session = await consultationRepository.createSession(buildDefaultTitle());
    return session.id;
  },

  // 一覧を返す前に、作成から一定時間が経った空の相談を片付ける
  getAllSessions: async () => {
    await consultationRepository.deleteStaleEmptySessions(STALE_EMPTY_SESSION_MINUTES);
    return consultationRepository.getAllSessions();
  },

  deleteSessionIfEmpty: async (sessionId: string): Promise<void> => {
    return consultationRepository.deleteSessionIfEmpty(sessionId);
  },

  updateSessionTitle: async (sessionId: string, title: string): Promise<void> => {
    const trimmed = title.trim();
    if (!trimmed) throw new Error("タイトルを入力してください");
    if (trimmed.length > SESSION_TITLE_MAX_LENGTH) {
      throw new Error(`タイトルは${SESSION_TITLE_MAX_LENGTH}文字以内で入力してください`);
    }
    return consultationRepository.updateSessionTitle(sessionId, trimmed);
  },

  // C-06: セッション削除（関連メッセージも含む）
  deleteSession: async (sessionId: string): Promise<void> => {
    return consultationRepository.deleteSession(sessionId);
  },
};
