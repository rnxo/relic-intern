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

export async function sendResetPasswordEmail(email: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: error.message };
  }
  return {};
}

export async function updatePassword(newPassword: string): Promise<{ error: string } | never> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "セッションの有効期限が切れています。もう一度パスワードリセットをリクエストしてください" };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}