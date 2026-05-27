import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import QuestionContent from "./_components/QuestionContent";

export default async function QuestionPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.user_metadata?.onboarding_completed) {
        redirect("/dashboard");
    }

    return (
        <Suspense>
            <QuestionContent />
        </Suspense>
    );
}
