"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { Home, Calendar } from "lucide-react";
import { NavigationIcon } from "./NavigationIcon";
import { AddNewHabitButton } from "./AddNewHabitButton";

const tabs = [
  { id: "dashboard", label: "ホーム", icon: Home, href: "/dashboard" },
  { id: "calendar", label: "カレンダー", icon: Calendar, href: "/calendar" },
];

export default function Navigationbar() {
  const segment = useSelectedLayoutSegment();
  const activeTab = segment ?? "dashboard";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40
                 bg-lumi-base/90 backdrop-blur-xl
                 border-t border-lumi-border/40
                 shadow-[0_-4px_24px_rgba(0,0,0,0.25)]"
      aria-label="メインナビゲーション"
    >
      <div className="relative flex items-center justify-around px-2 py-1 safe-area-bottom">
        {tabs.map((tab) => (
          <NavigationIcon
            key={tab.id}
            href={tab.href}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
          />
        ))}

        {/* 中央FAB: 2タブの間に絶対配置しナビバー上端からせり出させる */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <AddNewHabitButton />
        </div>
      </div>
    </nav>
  );
}
