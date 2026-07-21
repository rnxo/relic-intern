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
