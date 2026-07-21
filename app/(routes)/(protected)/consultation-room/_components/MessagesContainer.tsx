"use client";

import { useConsulQuery } from "@/app/features/consultation/consultation.state";
import { ChatRoom } from "@/app/features/consultation/consultation.type";
import { MessageCard } from "./Message";

interface Props {
  sessionId: string;
  initialData?: ChatRoom;
}

export function MessageContainer({ sessionId, initialData }: Props) {
  const { data: chatRoom, isLoading, isError, refetch } = useConsulQuery(sessionId, { initialData });
  const messages = chatRoom?.messages;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-1 w-full">
        <p className="text-lumi-muted text-sm">読み込み中...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center gap-2 flex-1 w-full">
        <p className="text-lumi-muted text-sm">エラーが発生しました</p>
        <button
          onClick={() => refetch()}
          className="text-lumi-primary text-sm underline"
        >
          再試行
        </button>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex justify-center items-center flex-1 w-full">
        <p className="text-lumi-muted text-sm">Lumiに話しかけてみましょう</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      {messages.map((msg) => (
        <MessageCard key={msg.id} message={msg} />
      ))}
    </div>
  );
}
