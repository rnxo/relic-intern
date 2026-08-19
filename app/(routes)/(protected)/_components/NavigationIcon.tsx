"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

type NavigationIconProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
};

export function NavigationIcon({ href, label, icon: Icon, isActive }: NavigationIconProps) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center justify-center gap-1
                 min-h-14 flex-1 cursor-pointer
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary rounded-xl"
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="activeBottomTab"
          className="absolute inset-1 bg-lumi-primary/12 rounded-xl"
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        />
      )}

      <div
        className={`relative z-10 p-2 rounded-xl transition-all duration-200 ${
          isActive ? "text-lumi-primary" : "text-lumi-muted"
        }`}
      >
        <Icon
          className={`w-6 h-6 transition-all duration-200 ${isActive ? "scale-110" : ""}`}
          aria-hidden="true"
        />
      </div>

      <span
        className={`relative z-10 text-[10px] leading-none font-medium transition-colors duration-200 ${
          isActive ? "text-lumi-primary font-semibold" : "text-lumi-muted"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
