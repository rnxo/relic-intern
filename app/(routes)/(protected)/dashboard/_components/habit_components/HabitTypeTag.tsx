import { cn } from "@/app/utils/cn-utils";
import { cva, VariantProps } from "class-variance-authority";
import { HabitTypeIcon } from "@/app/(routes)/(protected)/register-habit/_components/HabitTypeIcons";
import { Tag } from "lucide-react";
import { Label } from "@/components/ui/label";

const habitTypeTagVariants = cva("flex items-center gap-1 font-bold", {
  variants: {
    variant: {
      exercise: "text-red-400",
      meal: "text-green-400",
      study: "text-blue-400",
      sleep: "text-indigo-400",
      others: "text-purple-400",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
    },
  },
  defaultVariants: {
    variant: "others",
    size: "sm",
  },
});

const typeToVariant = (type: string | undefined): VariantProps<typeof habitTypeTagVariants>["variant"] => {
  switch (type) {
    case "運動": return "exercise";
    case "学習": return "study";
    case "食事": return "meal";
    case "睡眠": return "sleep";
    default: return "others";
  }
};

interface HabitTypeTagProps {
  type: string | undefined;
  className?: string;
  size?: VariantProps<typeof habitTypeTagVariants>["size"];
}

export function HabitTypeTag({ type, size, className }: HabitTypeTagProps) {
  const variant = typeToVariant(type);
  return (
    <div className={cn(habitTypeTagVariants({ variant, size }), className)}>
      <Tag />
      <Label>{type ?? "その他"}</Label>
    </div>
  );
}
