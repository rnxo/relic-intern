import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";

export default function LumiConsultation() {
    return (
        <Card className="w-full bg-lumi-surface/50 backdrop-blur-md border-lumi-border text-lumi-fg overflow-hidden rounded-3xl">
            <CardHeader className="border-b border-lumi-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="text-lumi-secondary shrink-0" size={18} aria-hidden="true" />
                    <span className="text-lumi-fg">Lumi の分析相談室</span>
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lumi-secondary/20 text-lumi-secondary border border-lumi-secondary/30 whitespace-nowrap">
                        近日公開
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
                <div className="text-center space-y-4 py-2">
                    <p className="text-sm text-lumi-muted leading-relaxed">
                        きみの行動ログをスキャンして、<br />
                        最適な習慣を導き出すよ。
                    </p>
                    <Button
                        disabled
                        className="bg-linear-to-r from-lumi-secondary to-lumi-primary text-white rounded-full px-8 py-5 h-auto font-bold shadow-lg opacity-40 cursor-not-allowed"
                        aria-label="ライフパターンを分析する（近日公開）"
                    >
                        <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                        ライフパターンを分析
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
