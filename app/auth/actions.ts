"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  userName: string,
  email: string,
  password: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { user_name: userName } },
  });

  if (error) {
    redirect("/register?error=" + encodeURIComponent(error.message));
  }

  if (data.user) {
    const { error: petError } =  await supabase.from("pet").insert({
      user_id: data.user.id,
      level: 1,
      emotion: 0,
      trust: 0,
      exhaustion: 0,
      expression: "neutral",
    });
    if(petError) {
        console.log("[signup] pet insert failed: ", petError);
        redirect("/register?error=" + encodeURIComponent(petError.message))
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
