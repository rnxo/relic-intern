"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { consultationQueryKey, sessionsQueryKey } from "@/app/features/consultation/consultation.state";
import { ChatRoom } from "@/app/features/consultation/consultation.type";

// 削除予約中のタイマー（StrictMode の「アンマウント→即再マウント」で予約を取り消すため）
const pendingDiscards = new Map<string, ReturnType<typeof setTimeout>>();

const discardUrl = (sessionId: string) => `/api/consultation/${sessionId}/discard`;

// 相談室を離れたとき、メッセージが0件なら相談を削除するよう依頼する（最終判定はサーバー側）
export function DiscardEmptySessionOnLeave({ sessionId }: { sessionId: string }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 直前のアンマウントで予約された削除があれば取り消す
    const pending = pendingDiscards.get(sessionId);
    if (pending) {
      clearTimeout(pending);
      pendingDiscards.delete(sessionId);
    }

    const hasMessages = () => {
      const chatRoom = queryClient.getQueryData<ChatRoom>([...consultationQueryKey, sessionId]);
      return (chatRoom?.messages.length ?? 0) > 0;
    };

    // タブを閉じる・再読み込み・別サイトへの移動
    const handlePageHide = () => {
      if (hasMessages()) return;
      navigator.sendBeacon(discardUrl(sessionId));
    };
    window.addEventListener("pagehide", handlePageHide);

    // アプリ内の画面移動（アンマウント）
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      if (hasMessages()) return;

      const timer = setTimeout(() => {
        pendingDiscards.delete(sessionId);
        fetch(discardUrl(sessionId), { method: "POST", keepalive: true })
          .then(() => queryClient.invalidateQueries({ queryKey: sessionsQueryKey }))
          .catch(console.error);
      }, 0);
      pendingDiscards.set(sessionId, timer);
    };
  }, [sessionId, queryClient]);

  return null;
}
