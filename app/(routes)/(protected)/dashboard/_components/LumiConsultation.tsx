"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Sparkles, MessageSquare, ChevronRight, Loader2 } from "lucide-react";
import { usePet } from "@/app/hooks/petHooks";
import { useHabits } from "@/app/features/habit/habit.state";

type Insight = {
    analysis: string;
    suggestions: string[];
    patternType: string;
};

export default function LumiConsultation() {
    const { pet } = usePet();
    const { habits } = useHabits();
    const [insight, setInsight] = useState<Insight | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);

    // 初回ロード時に最新の分析結果を取得 (GET)
    useEffect(() => {
        const fetchLatestInsight = async () => {
            if (!pet?.id) return;
            try {
                const res = await fetch(`/api/ai_chat?petId=${pet.id}`);
                const data = await res.json();
                if (data.insight) {
                    setInsight(data.insight);
                }
            } catch (error) {
                console.error("Failed to fetch latest insight", error);
            }
        };
        fetchLatestInsight();
    }, [pet?.id]);

    const analyzeLifePattern = async () => {
        if (!pet?.id) return;
        setIsLoading(true);
        try {
            const habitHistory = habits
                .filter(h => h.is_completed && h.completed_at)
                .map(h => ({
                    time: h.completed_at,
                    timeBlock: h.time_block,
                    title: h.title
                }));

            const res = await fetch("/api/ai_chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "analyze",
                    petId: pet.id,
                    habitHistory,
                    currentLevel: pet?.intimate_level || 1
                }),
            });
            const data = await res.json();
            setInsight(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'lumi', content: string }[]>([]);
    const [userMessage, setUserMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!userMessage.trim() || !insight || !pet?.id) return;

        const newMessage = { role: 'user' as const, content: userMessage };
        setChatMessages(prev => [...prev, newMessage]);
        setUserMessage("");
        setIsSending(true);

        try {
            const res = await fetch("/api/ai_chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "chat",
                    petId: pet.id,
                    message: userMessage,
                    context: insight.analysis
                }),
            });
            const data = await res.json();
            setChatMessages(prev => [...prev, { role: 'lumi', content: data.message }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'lumi', content: "ごめん、ちょっと考えがまとまらなかったよ。" }]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="w-full max-w-100 bg-[#24283b]/50 backdrop-blur-md border-[#414868] text-white overflow-hidden rounded-3xl">
            <CardHeader className="border-b border-[#414868]/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="text-[#bb9af7]" size={20} />
                    Lumi の分析相談室
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                {!insight ? (
                    <div className="text-center space-y-4 py-4">
                        <p className="text-sm text-gray-400">
                            きみの行動ログをスキャンして、<br />
                            最適な習慣を導き出すよ。
                        </p>
                        <Button
                            onClick={analyzeLifePattern}
                            disabled={isLoading}
                            className="bg-linear-to-r from-[#bb9af7] to-[#7aa2f7] hover:from-[#bb9af7]/90 hover:to-[#7aa2f7]/90 text-white rounded-full px-8 py-6 h-auto font-bold shadow-lg shadow-purple-500/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    解析中...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    ライフパターンを分析
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#1a1b26]/80 rounded-2xl p-4 border border-[#bb9af7]/30"
                        >
                            <h4 className="text-[#bb9af7] font-bold text-xs mb-2 flex items-center gap-1">
                                <Sparkles size={12} /> 分析レポート
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-200">
                                {insight.analysis}
                            </p>
                        </motion.div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 px-1">おすすめの新習慣</h4>
                            {(insight.suggestions || []).map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-2 bg-[#7aa2f7]/10 border border-[#7aa2f7]/20 p-3 rounded-xl text-sm"
                                >
                                    <ChevronRight size={14} className="text-[#7aa2f7]" />
                                    {s}
                                </motion.div>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-[#414868] text-gray-400 hover:text-white hover:bg-[#414868]/50 mt-2"
                            onClick={() => setShowChat(true)}
                        >
                            <MessageSquare size={14} className="mr-2" />
                            この内容について議論する
                        </Button>
                    </div>
                )}
            </CardContent>

            {/* チャットモーダル（簡易版） */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 bg-[#1a1b26] z-10 p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <MessageSquare size={18} className="text-[#bb9af7]" />
                                Lumi との議論
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>閉じる</Button>
                        </div>
                        <div className="flex-1 bg-[#24283b]/50 rounded-2xl p-4 text-sm text-gray-300 overflow-y-auto mb-4 border border-[#414868] space-y-4">
                            <div className="flex gap-3 mb-2">
                                <div className="w-8 h-8 shrink-0 rounded-full bg-[#bb9af7]/20 flex items-center justify-center text-lg">🦉</div>
                                <div className="bg-[#414868]/30 rounded-2xl p-3 rounded-tl-none">
                                    提示した習慣についてどう思う？きみの考えを教えて。
                                </div>
                            </div>

                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-lg ${msg.role === 'user' ? 'bg-[#7aa2f7]/20' : 'bg-[#bb9af7]/20'
                                        }`}>
                                        {msg.role === 'user' ? '👤' : '🦉'}
                                    </div>
                                    <div className={`rounded-2xl p-3 max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-[#7aa2f7]/20 rounded-tr-none text-right'
                                        : 'bg-[#414868]/30 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isSending && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#bb9af7]/20 flex items-center justify-center text-lg">🦉</div>
                                    <div className="bg-[#414868]/30 rounded-2xl p-3 rounded-tl-none italic text-gray-500">
                                        思考中...
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="議論を開始..."
                                className="flex-1 bg-[#1a1b26] border border-[#414868] rounded-xl px-4 py-2 text-sm text-white focus:outline-hidden focus:border-[#bb9af7]"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isSending || !userMessage.trim()}
                                className="bg-[#bb9af7] hover:bg-[#bb9af7]/90 text-white rounded-xl"
                            >
                                送信
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
