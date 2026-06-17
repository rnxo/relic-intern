import { Label } from "@/components/ui/label";
import { consultationService } from "@/app/features/consultation/consultation.service";
import { Main } from "../_components/main";
import { Footer } from "../_components/Footer";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function ConsultationRoomPage({ params }: Props) {
  const { sessionId } = await params;
  const initialData = await consultationService.getChatRoomById(sessionId);

  return (
    <div className="bg-lumi-base min-h-dvh">
      <div className="flex flex-col h-dvh bg-lumi-base max-w-md mx-auto">
        <header className="w-full h-16 flex justify-center items-center border-b-2 border-lumi-primary top-0 sticky z-20 bg-lumi-base">
          <Label className="text-center text-xl text-lumi-primary">
            Lumi分析相談室
          </Label>
        </header>
        <Main sessionId={sessionId} initialData={initialData} />
        <Footer sessionId={sessionId} />
      </div>
    </div>
  );
}
