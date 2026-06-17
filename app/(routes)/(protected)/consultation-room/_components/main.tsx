import { ChatRoom } from "@/app/features/consultation/consultation.type";
import { Label } from "@/components/ui/label";
import { MessageContainer } from "./MessagesContainer";

interface Props {
  sessionId: string;
  initialData: ChatRoom;
}

export function Main({ sessionId, initialData }: Props) {
  return (
    <main className="flex flex-col items-center flex-1 overflow-y-auto w-full">
      <Label className="text-center font-bold text-xl py-2">{initialData.title}</Label>
      <MessageContainer sessionId={sessionId} initialData={initialData} />
    </main>
  );
}
