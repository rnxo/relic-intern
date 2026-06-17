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

  initiateSession: async (title: string, userContent: string): Promise<string> => {
    const session = await consultationRepository.createSession(title);
    await sendMessageToLumi(session.id, userContent);
    return session.id;
  },

  getAllSessions: async () => {
    return consultationRepository.getAllSessions();
  },
};
