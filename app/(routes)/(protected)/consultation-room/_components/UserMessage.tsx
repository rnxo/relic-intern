import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function UserMessage() {
  return (
    <div className="flex justify-end">
      <UserMessageCard />
    </div>
  );
}

function UserMessageCard() {
  return (
    <div className="flex items-end gap-2 flex-row-reverse">
      <div className="max-w-[70%] px-4 py-2.5 text-sm leading-relaxed bg-[#3d59a1] text-[#c0caf5] rounded-2xl rounded-br-sm">
        User Message
      </div>
    </div>
  );
}
