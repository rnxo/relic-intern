"use client";

import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateSessionMutation } from "@/app/features/consultation/consultation.state";

// 押した時点で空の相談を作成し、相談室へ移動する
export function LumiConsultation() {
  const router = useRouter();
  const createSession = useCreateSessionMutation();

  const handleClick = async () => {
    if (createSession.isPending) return;
    try {
      const sessionId = await createSession.mutateAsync();
      router.push(`/consultation-room/${sessionId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      variant="outline"
      aria-label="Lumi分析相談室"
      onClick={handleClick}
      disabled={createSession.isPending}
    >
      <Sparkle size={24} className="text-center text-lumi-secondary" />
    </Button>
  );
}
