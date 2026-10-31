import { createClient } from "@/app/lib/supabase/server";
import type { Message, Session } from "./consultation.type";
import { getAuthUser } from "@/app/lib/auth";

interface IConsultationRepository {
  getMessageBySession: (sessionId: string) => Promise<Message[]>;
  getAllSessions: () => Promise<Session[]>;
  getSessionById: (id: string) => Promise<Session>;
  getSessionIdByTitle: (title: string) => Promise<Session["id"]>;
  createSession: (title: string) => Promise<Session>;
  createMessage: (sessionId: string, role: string, content: string) => Promise<Message>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  deleteSessionIfEmpty: (sessionId: string) => Promise<void>;
  deleteStaleEmptySessions: (olderThanMinutes: number) => Promise<void>;
}

export const consultationRepository: IConsultationRepository = {
  getMessageBySession: async (sessionId: string) => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if(!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("message")
      .select("*")
      .eq("user_id", user.id)
      .eq("session_id", sessionId)
    
    if(error) throw new Error(error.message);

    return data as Message[];
  },
  getAllSessions: async (): Promise<Session[]> => {
    const supabase = await createClient();
    const user = await getAuthUser();
    
    if(!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("session")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if(error) throw new Error(error.message);

    return data as Session[];
  },
  createSession: async (title: string): Promise<Session> => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if(!user) throw new Error("Unauthorized");
    
    const { data, error } = await supabase
      .from("session")
      .insert({
        user_id: user.id,
        title: title,
      })
      .select()
      .single();

      if( error ) throw new Error(error.message);
      
      return data as Session;
  },
  getSessionById: async (id: string) => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if(!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("session")
      .select("*")
      .eq("user_id", user.id)
      .eq("id", id)
      .single();

      if(error) throw new Error(error.message);

      return data as Session;
  },
  getSessionIdByTitle: async (title: string) => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if(!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("session")
      .select("*")
      .eq("user_id", user.id)
      .eq("title", title)
      .single();

      if(error) throw new Error(error.message);

      return data.id as Session["id"];
  },

  createMessage: async (sessionId: string, role: string, content: string) => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if(!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("message")
      .insert({
        user_id: user.id,
        session_id: sessionId,
        role: role,
        content: content,
      })
      .select()
      .single();

      if(error) throw new Error(error.message);

      return data as Message;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) throw new Error("Unauthorized");

    await supabase
      .from("message")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", user.id);

    const { error } = await supabase
      .from("session")
      .delete()
      .eq("user_id", user.id)
      .eq("id", sessionId);

    if (error) throw new Error(error.message);
  },

  updateSessionTitle: async (sessionId: string, title: string): Promise<void> => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("session")
      .update({ title })
      .eq("user_id", user.id)
      .eq("id", sessionId);

    if (error) throw new Error(error.message);
  },

  // メッセージが0件のときだけ相談を削除する（相談室を離れたときに使用）
  deleteSessionIfEmpty: async (sessionId: string): Promise<void> => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) throw new Error("Unauthorized");

    const { count, error: countError } = await supabase
      .from("message")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("session_id", sessionId);

    if (countError) throw new Error(countError.message);
    if (count !== 0) return;

    const { error } = await supabase
      .from("session")
      .delete()
      .eq("user_id", user.id)
      .eq("id", sessionId);

    if (error) throw new Error(error.message);
  },

  // 作成から一定時間が経った空の相談をまとめて削除する（履歴一覧の取得時に使用）
  deleteStaleEmptySessions: async (olderThanMinutes: number): Promise<void> => {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) throw new Error("Unauthorized");

    const threshold = new Date(Date.now() - olderThanMinutes * 60 * 1000).toISOString();

    const { data: staleSessions, error: sessionError } = await supabase
      .from("session")
      .select("id")
      .eq("user_id", user.id)
      .lt("created_at", threshold);

    if (sessionError) throw new Error(sessionError.message);
    if (!staleSessions || staleSessions.length === 0) return;

    const staleIds = staleSessions.map((s) => s.id as string);

    const { data: messages, error: messageError } = await supabase
      .from("message")
      .select("session_id")
      .eq("user_id", user.id)
      .in("session_id", staleIds);

    if (messageError) throw new Error(messageError.message);

    const usedIds = new Set((messages ?? []).map((m) => m.session_id as string));
    const emptyIds = staleIds.filter((id) => !usedIds.has(id));
    if (emptyIds.length === 0) return;

    const { error } = await supabase
      .from("session")
      .delete()
      .eq("user_id", user.id)
      .in("id", emptyIds);

    if (error) throw new Error(error.message);
  },
}
