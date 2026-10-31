"use client";

import Link from "next/link";
import { House } from "lucide-react";
import { ChatRoom, Session } from "@/app/features/consultation/consultation.type";
import { useConsulQuery } from "@/app/features/consultation/consultation.state";
import { Sidebar } from "./Sidebar";

interface Props {
  sessionId: string;
  initialData: ChatRoom;
  initialSessions: Session[];
}

// 相談室ヘッダー: 左=履歴 / 中央=相談タイトル / 右=ホームへ戻る
export function ConsultationHeader({ sessionId, initialData, initialSessions }: Props) {
  // タイトル編集をすぐ反映するため、サーバーの値ではなく Query のデータを表示する
  const { data: chatRoom } = useConsulQuery(sessionId, { initialData });

  return (
    <header className="w-full h-16 flex items-center gap-2 px-4 border-b-2 border-lumi-primary top-0 sticky z-20 bg-lumi-base">
      <Sidebar currentSessionId={sessionId} initialSessions={initialSessions} />
      <h1 className="flex-1 min-w-0 truncate text-center text-lg font-bold text-lumi-primary">
        {chatRoom?.title}
      </h1>
      <Link
        href="/dashboard"
        className="p-1.5 rounded-md text-lumi-muted hover:text-lumi-primary hover:bg-lumi-surface transition-colors"
        aria-label="ホームに戻る"
      >
        <House size={20} />
      </Link>
    </header>
  );
}
