'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { Home, ChartColumn } from 'lucide-react';
import { NavigationIcon } from './NavigationIcon';
import { AddNewHabitButton } from './AddNewHabitButton';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: Home, href: '/dashboard' },
  { id: 'stats', label: 'Stats', icon: ChartColumn, href: '/stats' },
];

export default function Navigationbar() {
  const segment = useSelectedLayoutSegment();
  const activeTab = segment ?? 'dashboard';

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-lumi-border/40 bg-lumi-base/90 shadow-[0_-4px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl"
      aria-label="メインナビゲーション"
    >
      <div className="safe-area-bottom relative flex items-center justify-around px-2 py-1">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <AddNewHabitButton />
        </div>
      </div>
    </nav>
  );
}
