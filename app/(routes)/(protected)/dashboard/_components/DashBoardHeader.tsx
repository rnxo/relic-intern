import { Sparkle } from "lucide-react";
import { LumiConsultation } from "./LumiConsultation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/auth/actions";

export function DashBoardHeader() {  
  return (
    <header className="flex justify-end items-center w-full h-16 bg-lumi-base/90 backdrop-blur-xl border-b border-lumi-border/30 px-4 py-3 sm:px-6 sm:py-4 sticky top-0 z-30">
        <div className="flex gap-2 mx-2">
          <Button size="xs" onClick={() => signout()}>サインアウト</Button>
          <Label className="font-bold text-lumi-primary">Lumi分析相談室</Label>
          <LumiConsultation />
        </div>
    </header>
  );
}
