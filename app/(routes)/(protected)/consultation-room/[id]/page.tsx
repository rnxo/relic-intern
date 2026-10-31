import { consultationService } from "@/app/features/consultation/consultation.service";
import { Main } from "../_components/main";
import { Footer } from "../_components/Footer";
import { ConsultationHeader } from "../_components/ConsultationHeader";
import { DiscardEmptySessionOnLeave } from "../_components/DiscardEmptySessionOnLeave";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConsultationRoomPage({ params }: Props) {
  const { id: sessionId } = await params;
  const [initialData, sessions] = await Promise.all([
    consultationService.getChatRoomById(sessionId),
    consultationService.getAllSessions(),
  ]);

  return (
    <div className="bg-lumi-base min-h-dvh">
      <div className="flex flex-col h-dvh bg-lumi-base max-w-md mx-auto">
        <ConsultationHeader
          sessionId={sessionId}
          initialData={initialData}
          initialSessions={sessions}
        />
        <Main sessionId={sessionId} initialData={initialData} />
        <Footer sessionId={sessionId} />
        <DiscardEmptySessionOnLeave sessionId={sessionId} />
      </div>
    </div>
  );
}
