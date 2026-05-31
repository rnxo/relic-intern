import { Pet } from "@/app/features/pet/pet.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Battery, Heart } from "lucide-react";

export function PetEmotionStatusCard({ pet }: { pet: Pet }) {
  const prefersReducedMotion = useReducedMotion();

  const expressionConfig = {
    joy: {
      label: "Joy",
      labelJa: "喜び",
      color: "text-[#e0af68]",
      bg: "bg-[#e0af68]/15",
      border: "border-[#e0af68]/40",
      dot: "bg-[#e0af68]",
    },
    neutral: {
      label: "Neutral",
      labelJa: "普通",
      color: "text-[#9ece6a]",
      bg: "bg-[#9ece6a]/15",
      border: "border-[#9ece6a]/40",
      dot: "bg-[#9ece6a]",
    },
  } as const;

  const currentExpression = expressionConfig["neutral"] ?? expressionConfig.neutral;

  const barAnimation = (value: number) =>
    prefersReducedMotion
      ? { width: `${value}%` }
      : { width: [`0%`, `${value}%`] };

  const barTransition = prefersReducedMotion
    ? {}
    : { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.2 };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="w-full max-w-[280px]"
    >
      <Card className="w-full bg-lumi-surface/50 backdrop-blur-md border border-lumi-border rounded-3xl overflow-hidden hover:border-lumi-secondary/30 transition-colors duration-300">
        <CardHeader className="pb-3 pt-6 px-6">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-bold text-lumi-fg tracking-wide">
              感情ステータス
            </CardTitle>
            {/* expression バッジ */}
            <AnimatePresence mode="wait">
              <motion.span
                key={pet.expression}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={[
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                  currentExpression.bg,
                  currentExpression.border,
                  currentExpression.color,
                ].join(" ")}
                aria-label={`現在の感情: ${currentExpression.labelJa}`}
              >
                <span
                  className={["w-1.5 h-1.5 rounded-full", currentExpression.dot].join(" ")}
                  aria-hidden="true"
                />
                {currentExpression.labelJa}
              </motion.span>
            </AnimatePresence>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-5">
          {/* 信頼値 */}
          <div className="space-y-2" role="group" aria-label="信頼値ステータス">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-xs font-semibold text-lumi-primary cursor-default">
                <Heart
                  size={14}
                  className="fill-lumi-primary text-lumi-primary"
                  aria-hidden="true"
                />
                信頼値
              </Label>
              <span
                className="text-sm font-bold tabular-nums text-lumi-primary"
                aria-label={`信頼値 ${pet.trust} / 100`}
              >
                {pet.trust}
                <span className="text-xs font-normal text-lumi-muted/50">/100</span>
              </span>
            </div>
            <div
              className="h-2.5 w-full bg-lumi-track rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={pet.trust}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="信頼値"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, color-mix(in srgb, var(--lumi-primary) 50%, transparent) 0%, var(--lumi-primary) 60%, var(--lumi-primary-hover) 100%)",
                  boxShadow: "0 0 8px 0 color-mix(in srgb, var(--lumi-primary) 50%, transparent)",
                }}
                animate={barAnimation(pet.trust)}
                transition={barTransition}
              />
            </div>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-lumi-border/50" aria-hidden="true" />

          {/* 疲労度 */}
          <div className="space-y-2" role="group" aria-label="疲労度ステータス">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-xs font-semibold text-[#f7768e] cursor-default">
                <Battery
                  size={14}
                  className="text-[#f7768e]"
                  aria-hidden="true"
                />
                疲労度
              </Label>
              <span
                className="text-sm font-bold tabular-nums text-[#f7768e]"
                aria-label={`疲労度 ${pet.exhaustion} / 100`}
              >
                {pet.exhaustion}
                <span className="text-xs font-normal text-lumi-muted/50">/100</span>
              </span>
            </div>
            <div
              className="h-2.5 w-full bg-lumi-track rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={pet.exhaustion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="疲労度"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #8c3130 0%, #f7768e 60%, #ff9e64 100%)",
                  boxShadow: "0 0 8px 0 rgba(247,118,142,0.45)",
                }}
                animate={barAnimation(pet.exhaustion)}
                transition={barTransition}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
