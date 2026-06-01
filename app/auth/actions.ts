"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export async function login(email: string, password: string): Promise<{ error: string } | never> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  userName: string,
  email: string,
  password: string,
): Promise<{ error: string } | never> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { user_name: userName } },
  });

  if (error) {
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  redirect("/question");
}

export async function completeOnboarding() {
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { onboarding_completed: true } });
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
