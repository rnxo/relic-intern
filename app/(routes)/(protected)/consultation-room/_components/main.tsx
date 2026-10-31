import { ChatRoom } from "@/app/features/consultation/consultation.type";
import { MessageContainer } from "./MessagesContainer";

interface Props {
  sessionId: string;
  initialData: ChatRoom;
}

export function Main({ sessionId, initialData }: Props) {
  return (
    <main className="flex flex-col items-center flex-1 overflow-y-auto w-full">
      <MessageContainer sessionId={sessionId} initialData={initialData} />
    </main>
  );
}
