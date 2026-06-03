import { cn } from "@/app/utils/cn-utils";
import { cva, VariantProps } from "class-variance-authority";
import { HabitTypeIcon } from "@/app/(routes)/(protected)/register-habit/_components/HabitTypeIcons";
import { HABIT_TYPE_LABELS, HabitTypeKey } from "@/app/features/habit/habit.type";

const habitTypeTagVariants = cva("flex items-center gap-1 font-bold", {
  variants: {
    variant: {
      exercises: "text-red-400",
      meal:      "text-green-400",
      study:     "text-blue-400",
      sleeping:  "text-indigo-400",
      others:    "text-purple-400",
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
    case "exercises": return "exercises";
    case "study":     return "study";
    case "meal":      return "meal";
    case "sleeping":  return "sleeping";
    default:          return "others";
  }
};

interface HabitTypeTagProps {
  type: string | undefined;
  className?: string;
  size?: VariantProps<typeof habitTypeTagVariants>["size"];
}

export function HabitTypeTag({ type, size, className }: HabitTypeTagProps) {
  const variant = typeToVariant(type);
  const label = HABIT_TYPE_LABELS[type as HabitTypeKey] ?? "その他";
  return (
    <div className={cn(habitTypeTagVariants({ variant, size }), className)}>
      <HabitTypeIcon type={type ?? "others"} size={16} />
      <span>{label}</span>
    </div>
  );
}
