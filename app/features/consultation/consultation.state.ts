import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatRoom, Session } from "./consultation.type";

export const consultationQueryKey = ["consultation"] as const;
export const sessionsQueryKey = ["sessions"] as const;

const fetchSessions = async (): Promise<Session[]> => {
  const res = await fetch("/api/consultation");
  if (!res.ok) throw new Error("failed to fetch sessions");
  return res.json();
};

export const useSessionsQuery = (options?: { initialData?: Session[] }) => {
  return useQuery({
    queryKey: sessionsQueryKey,
    queryFn: fetchSessions,
    initialData: options?.initialData,
    staleTime: 1000 * 30,
  });
};

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`/api/consultation/${sessionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed to delete session");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
};

// 空の相談を作成して sessionId を返す（画面遷移は呼び出し側で行う）
export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<string> => {
      const res = await fetch("/api/consultation", { method: "POST" });
      if (!res.ok) throw new Error("failed to create session");
      const { sessionId } = await res.json();
      return sessionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
};

export const useUpdateSessionTitleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId, title }: { sessionId: string; title: string }) => {
      const res = await fetch(`/api/consultation/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("failed to update session title");
    },
    onSuccess: (_data, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
      queryClient.invalidateQueries({ queryKey: [...consultationQueryKey, sessionId] });
    },
  });
};

const fetchChatRoom = async (sessionId: string): Promise<ChatRoom> => {
  const res = await fetch(`/api/consultation/${sessionId}`);
  if (!res.ok) throw new Error("failed to fetch chat room");
  return res.json();
};

export const useConsulQuery = (
  sessionId: string,
  options?: { initialData?: ChatRoom }
) => {
  return useQuery({
    queryKey: [...consultationQueryKey, sessionId],
    queryFn: () => fetchChatRoom(sessionId),
    initialData: options?.initialData,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};

export const useConsultation = (sessionId: string) => {
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/consultation/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("failed to send message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...consultationQueryKey, sessionId] });
    },
  });

  return { sendMessageMutation };
};
