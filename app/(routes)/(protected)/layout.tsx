'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, CheckSquare, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'habit', label: 'Habit', icon: Leaf, href: '/register-habit' },
];

export default function PagesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Sidebar/>
            { children }
        </div>
    )
}

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = pathname.startsWith('/register-habit')
        ? 'habit'
        : pathname.startsWith('/dashboard')
            ? 'dashboard'
            : 'dashboard';

    const handleTabClick = (href: string) => {
        router.push(href);
    };

    return (
        <div className="fixed left-0 top-0 bottom-0 w-20 bg-lumi-base/50 border-r border-[#7aa2f7]/15 shadow-lg z-40">
            <div className="flex flex-col items-center h-full py-8">
                {/* Logo */}
                <div className="mb-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#7aa2f7] to-[#7dcfff] flex items-center justify-center mb-2 shadow-lg">
                        <span className="text-white text-xl font-bold">L</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 flex flex-col gap-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.href)}
                                className="relative flex flex-col items-center justify-center gap-2 group"
                                title={tab.label}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSidebarTab"
                                        className="absolute inset-0 -inset-x-4 bg-[#7aa2f7]/10 rounded-2xl"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <div
                                    className={`relative z-10 p-3 rounded-xl transition-all ${isActive
                                        ? 'bg-[#7aa2f7] text-white shadow-md'
                                        : 'text-[#9aa5ce] hover:bg-[#24283b] hover:text-[#c0caf5]'
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>

                                <span
                                    className={`text-xs relative z-10 transition-colors ${isActive
                                        ? 'text-[#7aa2f7] font-semibold'
                                        : 'text-[#9aa5ce]'
                                        }`}
                                >
                                    {tab.label.slice(0, 4)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
