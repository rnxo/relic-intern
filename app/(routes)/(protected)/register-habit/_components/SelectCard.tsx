import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/app/utils/cn-utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

const SelectCardVariants = cva(
  "rounded-xl font-medium bg-lumi-base/30 text-lumi-primary shadow hover:border-2 hover:border-lumi-primary",
  {
    variants: {
      variant: {
        primary: "",
      },
      size: {
        sm: "text-sm px-4 py-2",
        md: "text-base px-6 py-4 w-32 h-24",
        lg: "text-xl px-8 py-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface SelectCardProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof SelectCardVariants> {
  children?: ReactNode;
  isSelected?: boolean;
}

export function SelectCard({
  children,
  className,
  variant,
  size,
  isSelected,
  ...props
}: SelectCardProps) {
  return (
    <button
      className={cn(
        SelectCardVariants({ variant, size }),
        className,
        isSelected && "bg-lumi-primary/50",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
