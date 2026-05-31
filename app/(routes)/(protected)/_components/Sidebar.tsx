"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Home, Leaf, Calendar } from "lucide-react";
import { motion } from "motion/react";

const tabs = [
  { id: "dashboard",      label: "ホーム",     icon: Home,     href: "/dashboard" },
  { id: "register-habit", label: "習慣",       icon: Leaf,     href: "/register-habit" },
  { id: "calendar",       label: "カレンダー", icon: Calendar, href: "/calendar" },
];

export default function Sidebar() {
  const segment = useSelectedLayoutSegment();
  const activeTab = segment ?? "dashboard";

  return (
    <>
      {/* ── デスクトップ: 縦サイドバー (lg以上で表示) ── */}
      <div
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center
                   bg-lumi-base/50 border-r border-lumi-primary/15 shadow-lg z-40"
        role="navigation"
        aria-label="メインナビゲーション"
      >
        <div className="flex flex-col items-center h-full py-8">
          {/* ロゴ */}
          <div className="mb-12 text-center" aria-hidden="true">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lumi-primary to-lumi-primary-hover flex items-center justify-center mb-2 shadow-lg">
              <span className="text-white text-xl font-bold select-none">L</span>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="relative flex flex-col items-center justify-center gap-2 group min-h-[44px] min-w-[44px] cursor-pointer"
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarTab"
                      className="absolute inset-0 -inset-x-4 bg-lumi-primary/10 rounded-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <div
                    className={`relative z-10 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-lumi-primary text-white shadow-md"
                        : "text-lumi-muted hover:bg-lumi-surface hover:text-lumi-fg"
                    }`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>

                  <span
                    className={`text-xs relative z-10 transition-colors duration-200 ${
                      isActive
                        ? "text-lumi-primary font-semibold"
                        : "text-lumi-muted"
                    }`}
                  >
                    {tab.label.slice(0, 4)}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── モバイル: ボトムナビゲーション (lg未満で表示) ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                   bg-lumi-base/90 backdrop-blur-xl
                   border-t border-lumi-border/40
                   shadow-[0_-4px_24px_rgba(0,0,0,0.25)]"
        aria-label="メインナビゲーション"
      >
        <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-col items-center justify-center gap-1
                           min-h-[56px] flex-1 cursor-pointer
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary rounded-xl"
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* アクティブインジケーター */}
                {isActive && (
                  <motion.div
                    layoutId="activeBottomTab"
                    className="absolute inset-1 bg-lumi-primary/12 rounded-xl"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}

                <div
                  className={`relative z-10 p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-lumi-primary"
                      : "text-lumi-muted"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-all duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <span
                  className={`relative z-10 text-[10px] leading-none font-medium transition-colors duration-200 ${
                    isActive ? "text-lumi-primary font-semibold" : "text-lumi-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
