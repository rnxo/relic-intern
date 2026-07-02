import { AlertSignoutDialog } from "./AlertSignoutDialog";
import { AddNewHabitButton } from "./AddNewHabitButton";
import { LumiBrandLogo } from "./LumiBrandLogo";

export function Header() {
  return (
    <header className="sticky top-0 h-16 z-50 bg-lumi-surface border-b border-lumi-border/30 backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
        <LumiBrandLogo />

        <div className="flex items-center gap-2 shrink-0">
          <AddNewHabitButton />
          <AlertSignoutDialog />
        </div>
      </div>
    </header>
  );
}

