"use client";

import { Textarea } from "@/components/ui/textarea";
import { useConsultation } from "@/app/features/consultation/consultation.state";
import { useState } from "react";

interface FooterProps {
  sessionId: string;
}

export function Footer({ sessionId }: FooterProps) {
  const [input, setInput] = useState<string>("");
  const { sendMessageMutation } = useConsultation(sessionId);

  const handleSubmit = async () => {
    if (!input.trim() || sendMessageMutation.isPending) return;
    await sendMessageMutation.mutateAsync(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer className="bottom-0 sticky z-30 bg-lumi-base pb-4">
      <div className="p-2 mx-4 border-2 border-lumi-primary rounded-lg">
        <Textarea
          placeholder={sendMessageMutation.isPending ? "Lumiが考え中..." : "Lumiに話しかけてみましょう..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sendMessageMutation.isPending}
          className="resize-none border-none focus-visible:ring-0 bg-transparent"
        />
      </div>
    </footer>
  );
}
