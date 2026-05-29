import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";

export default function LumiConsultation() {
    return (
        <Card className="w-full max-w-100 bg-[#24283b]/50 backdrop-blur-md border-[#414868] text-white overflow-hidden rounded-3xl">
            <CardHeader className="border-b border-[#414868]/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="text-[#bb9af7]" size={20} />
                    Lumi の分析相談室
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#bb9af7]/20 text-[#bb9af7] border border-[#bb9af7]/30">
                        近日公開
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-4 py-4">
                    <p className="text-sm text-gray-400">
                        きみの行動ログをスキャンして、<br />
                        最適な習慣を導き出すよ。
                    </p>
                    <Button
                        disabled
                        className="bg-linear-to-r from-[#bb9af7] to-[#7aa2f7] text-white rounded-full px-8 py-6 h-auto font-bold shadow-lg shadow-purple-500/20 opacity-40 cursor-not-allowed"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        ライフパターンを分析
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
