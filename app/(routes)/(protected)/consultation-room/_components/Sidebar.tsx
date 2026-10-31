"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare, X, PlusCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Session } from "@/app/features/consultation/consultation.type";
import {
  useSessionsQuery,
  useDeleteSessionMutation,
  useCreateSessionMutation,
} from "@/app/features/consultation/consultation.state";
import { SessionItemMenu } from "./SessionItemMenu";

interface Props {
  currentSessionId: string;
  initialSessions?: Session[];
}

export function Sidebar({ currentSessionId, initialSessions }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: sessions } = useSessionsQuery({ initialData: initialSessions });
  const deleteSession = useDeleteSessionMutation();
  const createSession = useCreateSessionMutation();

  const handleDelete = async (sessionId: string) => {
    await deleteSession.mutateAsync(sessionId);
    if (sessionId === currentSessionId) {
      router.push("/dashboard");
    }
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/consultation-room/${sessionId}`);
    setOpen(false);
  };

  // 空の相談を作成して移動する（ダッシュボードの✦ボタンと同じ動き）
  const handleNewChat = async () => {
    if (createSession.isPending) return;
    try {
      const sessionId = await createSession.mutateAsync();
      router.push(`/consultation-room/${sessionId}`);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-md text-lumi-muted hover:text-lumi-primary hover:bg-lumi-surface transition-colors"
        aria-label="相談履歴を開く"
      >
        <History size={20} />
      </button>

      {/* オーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* スライドインパネル */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-lumi-base z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-lumi-border/30">
          <span className="text-lumi-primary font-semibold text-sm">相談履歴</span>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-lumi-muted hover:text-lumi-fg rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 新しい相談ボタン（C-03） */}
        <div className="p-3 border-b border-lumi-border/30">
          <Button
            variant="outline"
            className="w-full border-lumi-border/50 text-lumi-fg hover:bg-lumi-surface text-sm h-9"
            onClick={handleNewChat}
            disabled={createSession.isPending}
          >
            <PlusCircle size={15} className="mr-2" />
            新しい相談
          </Button>
        </div>

        {/* セッション一覧（C-02・C-04） */}
        <div className="flex-1 overflow-y-auto py-2">
          {!sessions || sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
              <MessageSquare size={24} className="text-lumi-muted" />
              <p className="text-lumi-muted text-xs">相談履歴がありません</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  className={`flex items-center gap-2 px-3 py-2 mx-2 my-0.5 rounded-md cursor-pointer transition-colors ${
                    isActive
                      ? "bg-lumi-primary/20 text-lumi-primary"
                      : "text-lumi-fg hover:bg-lumi-surface"
                  }`}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <MessageSquare size={13} className="shrink-0 text-lumi-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{session.title}</p>
                    <p className="text-xs text-lumi-muted truncate">
                      {new Date(session.created_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  {/* 「…」メニュー: タイトル編集・削除（タッチ操作でも押せるよう常に表示） */}
                  <SessionItemMenu session={session} onDelete={handleDelete} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
