import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/app/utils/cn-utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

const SelectCardVariants = cva(
  "rounded-xl font-medium bg-lumi-base/30 text-lumi-primary shadow hover:border-2 hover:border-lumi-primary transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary",
  {
    variants: {
      variant: {
        primary: "",
      },
      size: {
        sm: "text-sm px-3 py-2 min-h-[44px]",
        md: "text-base px-4 py-3 min-h-[60px]",
        lg: "text-xl px-6 py-4",
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
        isSelected && "bg-lumi-primary/50 border-2 border-lumi-primary",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
