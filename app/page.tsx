import { createClient } from "@/app/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/register");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lumi-base">
      <h1 className="text-2xl font-bold text-lumi-primary">
        ようこそ、{user.user_metadata.user_name}さん
      </h1>
      <Link className="text-lumi-primary hover:underline" href={"/dashboard"}>
        メールの承認をしてLumiを始めよう!!
      </Link>
    </div>
  );
}
