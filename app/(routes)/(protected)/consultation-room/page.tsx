import { Label } from "@/components/ui/label";
import { consultationService } from "@/app/features/consultation/consultation.service";
import { Main } from "./_components/main";
import { Footer } from "./_components/Footer";
import { Sidebar } from "./_components/Sidebar";

interface Props {
  searchParams: Promise<{ sessionId: string }>;
}

export default async function ConsultationRoomPage({ searchParams }: Props) {
  const { sessionId } = await searchParams;
  const [initialData, sessions] = await Promise.all([
    consultationService.getChatRoomById(sessionId),
    consultationService.getAllSessions(),
  ]);

  return (
    <div className="bg-lumi-base min-h-dvh">
      <div className="flex flex-col h-dvh bg-lumi-base max-w-md mx-auto">
        <header className="w-full h-16 flex items-center px-4 border-b-2 border-lumi-primary top-0 sticky z-20 bg-lumi-base">
          <Sidebar currentSessionId={sessionId} initialSessions={sessions} />
          <Label className="flex-1 text-center text-xl text-lumi-primary">
            Lumi分析相談室
          </Label>
          {/* ヘッダーの左右バランスを揃えるスペーサー */}
          <div className="w-8" />
        </header>
        <Main sessionId={sessionId} initialData={initialData} />
        <Footer sessionId={sessionId} />
      </div>
    </div>
  );
}
