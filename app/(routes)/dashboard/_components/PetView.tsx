import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { useHabits } from "@/app/hooks/habitHooks";
import { Habit } from "@/app/types/habit";
import { useState, useEffect, useRef } from "react";
import { PetSvg } from "./PetSvg";
import { OwlSvg } from "./OwlSvg";
import { Pet, getPetForm } from "@/app/types/pet";
import { usePet } from "@/app/hooks/petHooks";
import { Battery, Heart, Star, TrendingUp, Award, MessageCircle, RefreshCw } from "lucide-react";
import { useDailyStats } from "@/app/hooks/useDailyStats";

export default function PetView() {
    const { habits } = useHabits();
    const { pet } = usePet();
    console.log("PetView component log: ", pet);

    const todayTotalCompletedHabits: Habit[] = habits?.filter(h => h.isCompleted) || [];
    const todayTotalHabitsCount: number = todayTotalCompletedHabits?.length || 0;

    // アニメーション用の状態管理
    const [isJoy, setIsJoy] = useState(false);
    const [showEvolution, setShowEvolution] = useState(false);
    const prevCountRef = useRef(todayTotalHabitsCount);
    const prevLevelRef = useRef(pet?.level ?? 0);

    // ペットの形態を判定 (level 15以上でフクロウ)
    const petForm = getPetForm(pet?.level ?? 0);

    // マウント状態を管理 (Hydrationエラー防止)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const isOwl = mounted && petForm === 'owl';

    // セリフ関連のstate
    const [lumiComment, setLumiComment] = useState<string | null>(null);
    const [isLoadingComment, setIsLoadingComment] = useState(false);
    const prevCompletedCountRef = useRef(todayTotalHabitsCount);
    const prevUpdatedAtRef = useRef<string | null>(pet?.updatedAt || null);

    // セリフを取得する関数
    const fetchComment = async (currentPet: Pet, trigger: 'initial_load' | 'task_completed' | 'manual_refresh' | 'status_updated' = 'manual_refresh') => {
        // [DEBUG] コメント機能を一時的に無効化（いつでも元のコードに戻せるように残しています）
        return;

        if (!currentPet) return;
        setIsLoadingComment(true);
        try {
            // 初期ロード時は GET で最新の1件を取得
            if (trigger === 'initial_load') {
                const res = await fetch(`/api/comment?petId=${currentPet.id}`);
                const data = await res.json();
                if (data.message) {
                    setLumiComment(data.message);
                    setIsLoadingComment(false);
                    return;
                }
                // データがない場合はそのまま新規生成（POST）へ流す
            }

            // それ以外（タスク完了など）は POST で新規生成
            const res = await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pet: currentPet,
                    completedCount: todayTotalHabitsCount,
                    trigger: trigger,
                }),
            });
            const data = await res.json();
            setLumiComment(data.message);
        } catch {
            setLumiComment("今日もお疲れさま！");
        } finally {
            setIsLoadingComment(false);
        }
    };

    // セリフを更新するトリガーを統合
    useEffect(() => {
        if (!pet) return;

        const isInitial = !lumiComment;
        const isCountIncreased = todayTotalHabitsCount > prevCompletedCountRef.current;
        const isPetUpdated = pet.updatedAt !== prevUpdatedAtRef.current;

        // シチュエーションを判定
        if (isInitial) {
            fetchComment(pet, 'initial_load');
        } else if (isCountIncreased) {
            fetchComment(pet, 'task_completed');
        } else if (isPetUpdated) {
            fetchComment(pet, 'status_updated');
        }

        // refを更新
        prevCompletedCountRef.current = todayTotalHabitsCount;
        prevUpdatedAtRef.current = pet.updatedAt;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pet, todayTotalHabitsCount]);

    // タスク完了（カウントアップ）を検知して喜ぶ
    useEffect(() => {
        if (todayTotalHabitsCount > prevCountRef.current) {
            setIsJoy(true);
            const timer = setTimeout(() => setIsJoy(false), 3000); // 3秒間喜ぶ
            return () => clearTimeout(timer);
        }
        prevCountRef.current = todayTotalHabitsCount;
    }, [todayTotalHabitsCount]);

    // レベル15到達で進化エフェクトを表示
    useEffect(() => {
        const currentLevel = pet?.level ?? 0;
        if (prevLevelRef.current < 15 && currentLevel >= 15) {
            setShowEvolution(true);
            const timer = setTimeout(() => setShowEvolution(false), 5000);
            return () => clearTimeout(timer);
        }
        prevLevelRef.current = currentLevel;
    }, [pet?.level]);

    return (
        <div className="flex flex-col items-center py-12 px-4 space-y-8 min-h-screen bg-[#1a1b26]">

            {/* ===== 進化エフェクトバナー ===== */}
            <AnimatePresence>
                {showEvolution && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
                    >
                        {/* 背景フラッシュ */}
                        <motion.div
                            className="absolute inset-0 bg-purple-500/10"
                            animate={{ opacity: [0, 0.4, 0, 0.2, 0] }}
                            transition={{ duration: 1.5 }}
                        />
                        {/* キラキラパーティクル */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: ["#f9d423", "#bb9af7", "#7aa2f7", "#7dcfff"][i % 4],
                                    top: `${20 + Math.sin(i * 30 * Math.PI / 180) * 30}%`,
                                    left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 30}%`,
                                }}
                                animate={{
                                    y: [0, -80, 0],
                                    x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 120],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0],
                                }}
                                transition={{ duration: 2, delay: i * 0.1 }}
                            />
                        ))}
                        {/* メッセージカード */}
                        <motion.div
                            className="relative bg-linear-to-br from-[#2a1f4a] to-[#1a2040] border border-[#bb9af7]/40 rounded-3xl px-10 py-8 text-center shadow-2xl shadow-purple-500/20"
                            animate={{ boxShadow: ["0 0 20px rgba(187,154,247,0.2)", "0 0 60px rgba(187,154,247,0.5)", "0 0 20px rgba(187,154,247,0.2)"] }}
                            transition={{ duration: 2, repeat: 2 }}
                        >
                            <div className="text-4xl mb-2">🦉</div>
                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#bb9af7] to-[#7aa2f7]">
                                進化！
                            </h3>
                            <p className="text-white font-bold mt-1">Lumi が フクロウ になった！</p>
                            <p className="text-[#a9b1d6] text-sm mt-2">夜型の生活に適した姿に変化しました ✨</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pet Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        {isOwl ? "🦉 Lumi" : "Lumi"}
                    </h2>
                    {isOwl && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-linear-to-r from-[#bb9af7]/20 to-[#7aa2f7]/20 text-[#bb9af7] border border-[#bb9af7]/30"
                        >
                            フクロウ形態 · 夜型覚醒
                        </motion.span>
                    )}
                    <AnimatePresence>
                        {isJoy && (
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-[#a9b1d6] text-xs font-bold bg-[#7aa2f7]/20 px-2 py-0.5 rounded-full"
                            >
                                やったね！
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                <p className="text-gray-400 text-sm">{isOwl ? "深夜も一緒に成長しよう" : "一緒に成長しよう"}</p>
            </motion.div>

            <motion.div
                className="relative group cursor-pointer"
                animate={isJoy ? {
                    y: [0, -40, 0, -20, 0],
                    scale: [1, 1.1, 1, 1.05, 1],
                } : {}}
                transition={{
                    duration: 0.8,
                    ease: "easeOut"
                }}
            >
                {/* フクロウは紫のグロー、通常は青のグロー */}
                <div className={`absolute -inset-4 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isOwl
                    ? "bg-linear-to-r from-[#bb9af7] to-[#7aa2f7]"
                    : "bg-linear-to-r from-[#7aa2f7] to-[#7dcfff]"
                    }`} />
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {isOwl ? (
                            <motion.div
                                key="owl"
                                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <OwlSvg expression={pet?.expression || 'neutral'} isJumping={isJoy} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="lumi"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                            >
                                <PetSvg expression={pet?.expression || 'neutral'} isJumping={isJoy} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* ===== Lumi セリフ 吹き出し ===== */}
            {/* [DEBUG] コメント機能を一時的に非表示（元のコードは残しています） */}
            {false && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-[320px]"
                >
                    <div className={`relative rounded-2xl px-5 py-4 border ${isOwl
                        ? "bg-[#2a1f4a]/60 border-[#bb9af7]/30"
                        : "bg-[#1e2a40]/60 border-[#7aa2f7]/30"
                        } backdrop-blur-sm`}>
                        {/* 吹き出しの三角（上向き：ペット側） */}
                        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 ${isOwl ? "text-[#bb9af7]/30" : "text-[#7aa2f7]/30"
                            }`}>
                            <svg viewBox="0 0 16 8" fill="currentColor">
                                <path d="M8 0 L16 8 L0 8 Z" />
                            </svg>
                        </div>

                        {/* ヘッダー */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                <MessageCircle size={12} className={isOwl ? "text-[#bb9af7]" : "text-[#7aa2f7]"} />
                                <span className={`text-[10px] font-bold ${isOwl ? "text-[#bb9af7]" : "text-[#7aa2f7]"
                                    }`}>
                                    {isOwl ? "🦉 Lumi" : "Lumi"}
                                </span>
                            </div>
                            {/* 手動リフレッシュボタン */}
                            <button
                                onClick={() => pet && fetchComment(pet, 'manual_refresh')}
                                disabled={isLoadingComment}
                                className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-40"
                                aria-label="セリフを更新"
                            >
                                <motion.div
                                    animate={isLoadingComment ? { rotate: 360 } : { rotate: 0 }}
                                    transition={isLoadingComment
                                        ? { duration: 1, repeat: Infinity, ease: "linear" }
                                        : { duration: 0 }
                                    }
                                >
                                    <RefreshCw size={11} className="text-gray-500" />
                                </motion.div>
                            </button>
                        </div>

                        {/* セリフ本文 */}
                        <AnimatePresence mode="wait">
                            {isLoadingComment ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-1 h-5"
                                >
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full ${isOwl ? "bg-[#bb9af7]" : "bg-[#7aa2f7]"
                                                }`}
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.p
                                    key={lumiComment}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-sm text-white/90 leading-relaxed font-medium"
                                >
                                    {lumiComment ?? "..."}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}

            {/* Level Badge */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center gap-2 bg-[#7aa2f7] text-white px-6 py-2 rounded-full shadow-lg"
            >
                <Award size={18} />
                <span className="font-bold text-sm">Level {pet?.level || 1}</span>
            </motion.div>

            {/* Completion Count Card */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-[320px]"
            >
                <Card className="w-full text-white bg-[#24283b]/50 backdrop-blur-md border border-[#414868] rounded-3xl p-8 hover:border-[#7aa2f7]/30 transition-all">
                    <CardContent className="flex flex-col items-center justify-center p-0 space-y-2">
                        <motion.span
                            key={todayTotalHabitsCount}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-extrabold text-[#7aa2f7]"
                        >
                            {todayTotalHabitsCount}
                        </motion.span>
                        <span className="text-sm font-medium text-gray-400">今日のタスク達成数</span>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-[320px]"
            >
                <PetEmotionStatus />
            </motion.div>
        </div>
    );
}




function PetEmotionStatus() {
    const { pet } = usePet();
    const { stats } = useDailyStats();

    if (!pet || !stats) return null;

    const {
        dailyTrust,
        dailyExhaustion,
        dailyEmotion,
        currentTotalTrust,
        currentTotalExhaustion,
        currentTotalEmotion
    } = stats;

    return (
        <Card className="w-full text-white bg-[#24283b]/50 backdrop-blur-md border border-[#414868] rounded-3xl p-6">
            <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-white">ルミの状態</CardTitle>
                <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7aa2f7]/10 text-[#7aa2f7]">累計統計</span>
                </div>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
                {/* 信頼度 (Trust) */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#7aa2f7]">
                            <Heart size={16} fill="currentColor" />
                            <span className="text-sm font-bold">信頼度 (Trust)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {dailyTrust !== 0 && (
                                <span className={`text-[10px] font-bold ${dailyTrust > 0 ? "text-green-400" : "text-red-400"}`}>
                                    {dailyTrust > 0 ? `+${dailyTrust}` : dailyTrust}
                                </span>
                            )}
                            <span className="text-xs font-semibold text-gray-400">{currentTotalTrust}/100</span>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-[#1c2238] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${currentTotalTrust}%` }}
                            className="h-full bg-linear-to-r from-[#7aa2f7] to-[#7dcfff] rounded-full"
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* 疲労度 (Exhaustion) */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#f7768e]">
                            <Battery size={16} fill="currentColor" />
                            <span className="text-sm font-bold">疲労度 (Exhaustion)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {dailyExhaustion !== 0 && (
                                <span className="text-[10px] font-bold text-orange-400">+{dailyExhaustion}</span>
                            )}
                            <span className="text-xs font-semibold text-gray-400">{currentTotalExhaustion}/100</span>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-[#1c2238] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${currentTotalExhaustion}%` }}
                            className="h-full bg-linear-to-r from-[#f7768e] to-[#ff9e64] rounded-full"
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* 感情/経験値 (Emotion/EXP) */}
                <div className="space-y-3 pt-2 border-t border-[#414868]/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#bb9af7]">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm font-bold">感情 (EXP)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {dailyEmotion !== 0 && (
                                <span className={`text-[10px] font-bold ${dailyEmotion > 0 ? "text-[#bb9af7]" : "text-red-400"}`}>
                                    {dailyEmotion > 0 ? `+${dailyEmotion}` : dailyEmotion}
                                </span>
                            )}
                            <span className="text-xs font-semibold text-gray-400">{currentTotalEmotion}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                            <TrendingUp size={10} /> 今日: {dailyTrust} - {dailyExhaustion} = {dailyEmotion}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}




