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
      .eq("user_id", user.id);
    
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
  } 
}