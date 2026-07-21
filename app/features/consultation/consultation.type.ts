type role = "user" | "lumi" | "unknown";

//ドメイン基本単位
// export type Message = {
//   id: string;
//   petId: string;
//   role: role;
//   content: string;
//   createdAt: string;
// }

export type Message = {
  id: string;
  sessionId: string;
  role: role;
  content: string;
  created_at: string;
}

export type Session = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export type ChatRoom = Session & {
  messages: Message[];
}

export type InputChatRoom = Partial<ChatRoom>

// export type ConsultationHistory = {
//   id: string;
//   petId: string;
//   chatRoom: Session[];
//   createdAt: string;
//   updatedAt: string;
// }
