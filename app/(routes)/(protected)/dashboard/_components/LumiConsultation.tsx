"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LumiConsultation() {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    setIsPending(true);
    try {
      const title = `相談_${new Date().toLocaleDateString("ja-JP")}`;
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: input.trim() }),
      });
      console.log(res.json());
      if (!res.ok) throw new Error("failed to initiate consultation");

      const { sessionId } = await res.json();
      router.push(`/consultation-room?sessionId=${sessionId}`);
    } catch (err) {
      console.error(err);
      setIsPending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkle size={24} className="text-center text-lumi-secondary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm bg-lumi-base/90 backdrop-blur-xl border border-lumi-border/30 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Lumi分析相談室へようこそ</DialogTitle>
            <DialogDescription>
              Lumi分析相談室は、Lumiに関する質問や相談を行うためのスペースです。お気軽にご利用ください。
            </DialogDescription>
          </DialogHeader>
          <Field>
            <Textarea
              placeholder="今日仕事でへとへと"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
            />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>戻る</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-lumi-primary"
              disabled={isPending || !input.trim()}
            >
              {isPending ? "相談中..." : "相談"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
