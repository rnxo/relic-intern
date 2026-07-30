import { AlertSignoutDialog } from "./AlertSignoutDialog";
import { LumiBrandLogo } from "./LumiBrandLogo";
import { LumiConsultation } from "./LumiConsultation";

export function Header() {
  return (
    <header className="sticky top-0 h-16 z-50 bg-lumi-surface border-b border-lumi-border/30 backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
        <LumiBrandLogo />

        <div className="flex items-center gap-2 shrink-0">
          <LumiConsultation />
          <AlertSignoutDialog />
        </div>
      </div>
    </header>
  );
}

