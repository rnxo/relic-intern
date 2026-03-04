"use client";

import { useAtom } from "jotai";
import { testTimeAtom } from "@/app/store/testTimeAtom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function TestTimeForm() {
    const [testHour, setTestHour] = useAtom(testTimeAtom);

    // 現在時刻（表示用）
    const actualHour = new Date().getHours();
    const currentHour = testHour !== null ? testHour : actualHour;

    const getTimeBlockName = (h: number) => {
        if (h >= 5 && h < 11) return '朝方 (5:00-11:00)';
        if (h >= 11 && h < 18) return '日中 (11:00-18:00)';
        if (h >= 18 && h < 24) return '夜型 (18:00-0:00)';
        return '深夜 (0:00-5:00)';
    };

    return (
        <Card className="w-full max-w-[320px] text-white bg-[#24283b]/80 backdrop-blur-md border border-[#414868] rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-[#7aa2f7]/10 p-4 border-b border-[#414868]/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#7aa2f7]">
                    <Clock size={16} />
                    デバッグ用時間操作
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 block">現在の設定時刻</span>
                            <span className="text-2xl font-black text-white">{currentHour}:00</span>
                        </div>
                        <span className="text-[10px] bg-[#bb9af7]/20 text-[#bb9af7] px-2 py-1 rounded-sm font-bold">
                            {getTimeBlockName(currentHour)}
                        </span>
                    </div>

                    <div className="py-2">
                        <Slider
                            defaultValue={[currentHour]}
                            max={23}
                            step={1}
                            value={[currentHour]}
                            onValueChange={(vals: number[]) => setTestHour(vals[0])}
                            className="py-4"
                        />
                        <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                            <span>0h</span>
                            <span>6h</span>
                            <span>12h</span>
                            <span>18h</span>
                            <span>23h</span>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed italic">
                        ※スライダーを動かすと、その時間を「過ぎた」タイムブロックのポイントが計算に反映されます。
                    </p>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTestHour(null)}
                        className="w-full text-[10px] text-gray-400 hover:text-white hover:bg-white/5 gap-2"
                    >
                        <RotateCcw size={12} />
                        実際の時刻に戻す ({actualHour}:00)
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
