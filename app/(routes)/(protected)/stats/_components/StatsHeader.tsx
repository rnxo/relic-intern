import { ArrowLeft, MoonStar } from "lucide-react";
import { useRouter } from "next/navigation";

export function StatsHeader() {
  const router = useRouter();
  
  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-lumi-fg transition-colors hover:bg-lumi-surface"
        aria-label="前のページに戻る"
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <h1 className="text-base font-medium text-lumi-fg">統計</h1>
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-lumi-surface"
        aria-hidden="true"
      >
        <MoonStar size={16} className="text-lumi-secondary" />
      </div>
    </div>
  );
}
