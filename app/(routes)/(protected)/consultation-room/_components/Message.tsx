import { Message } from "@/app/features/consultation/consultation.type";
import { Label } from "@/components/ui/label";

// interface MessageCardProps {
//   message: Message;
// }

export function MessageCard({ message }: { message : Message}) {
  const isAI = message.role === "lumi";

  return (
    <div className={`flex items-center gap-2 ${ isAI ? "" : "flex-row-reverse"}`}>
      <div className={`max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
        isAI 
          ? "bg-[#2d2f4a] text-[#c0caf5] rounded-2xl rounded-bl-sm"
          :   "bg-[#3d59a1] text-[#c0caf5] rounded-2xl rounded-br-sm" 
      }`}>
        <Label>{ message.content }</Label>
      </div>
    </div>
  )
}