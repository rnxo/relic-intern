import type { Habit } from '@/app/features/habit/habit.type';
import { useHabits } from '@/app/features/habit/habit.state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Circle, CheckCircle2, Pencil, Trash2, Flame } from 'lucide-react';
import { HabitTypeTag } from './HabitTypeTag';
import { useRouter } from 'next/navigation';

export function HabitItem({ habit }: { habit: Habit }) {
  const { deleteHabit, checkHabit } = useHabits();
  const router = useRouter();

  return (
    <Card
      className={`group relative w-full transition-all duration-300 ${
        habit.is_checked ? 'bg-lumi-surface/20 opacity-70' : 'bg-lumi-surface/40'
      } overflow-hidden rounded-2xl border border-lumi-border backdrop-blur-sm hover:border-lumi-primary/50`}
    >
      <CardContent className="p-3 sm:p-5">
        {/* ── 上段: チェック + タイトル(1行固定) + アクションボタン ── */}
        <div className="flex items-center gap-3">
          {/* チェックボタン */}
          <button
            onClick={() => checkHabit(habit.id)}
            className="relative flex min-h-[44px] min-w-[44px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary"
            aria-label={habit.is_checked ? '完了を取り消す' : '完了にする'}
            aria-pressed={habit.is_checked}
          >
            {habit.is_checked ? (
              <CheckCircle2 size={28} className="text-lumi-primary" aria-hidden="true" />
            ) : (
              <Circle size={28} className="text-lumi-border" aria-hidden="true" />
            )}
          </button>

          {/* タイトル: min-w-0 + truncate で1行に固定し、カード高さを一定に保つ */}
          <p
            title={habit.title}
            className={`min-w-0 flex-1 truncate text-sm leading-tight font-bold transition-colors sm:text-base ${
              habit.is_checked
                ? 'text-lumi-muted line-through'
                : 'text-lumi-fg group-hover:text-lumi-primary-hover'
            }`}
          >
            {habit.title}
          </p>

          {/* アクションボタン群 */}
          <div className="flex flex-shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[44px] min-w-[44px] cursor-pointer rounded-xl text-lumi-primary hover:bg-lumi-primary/10 hover:text-lumi-primary-hover"
              onClick={() => router.push(`/register-habit?habitId=${habit.id}`)}
              aria-label={`${habit.title}を編集`}
            >
              <Pencil size={15} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[44px] min-w-[44px] cursor-pointer rounded-xl hover:bg-red-400/10"
              onClick={() => deleteHabit(habit.id)}
              aria-label={`${habit.title}を削除`}
            >
              <Trash2 size={15} className="text-red-400" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* ── 下段: 進捗バッジ + タイプタグ + ストリーク ──
            タイトルと同じ行に置かないため、タイトルの長さの影響を受けない。
            pl-14 = チェックボタン(44px) + gap-3(12px) でタイトル先頭に揃える。 */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 pl-14">
          <span
            className="flex-shrink-0 rounded-full bg-lumi-primary px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white tabular-nums"
            aria-label={`経過 ${habit.elasped_days} 日 / 目標 ${habit.target_days} 日`}
          >
            {habit.elasped_days}/{habit.target_days}日
          </span>
          <HabitTypeTag type={habit.type} />
          {Number(habit.streak_days) > 0 && (
            <span className="flex flex-shrink-0 items-center gap-0.5 text-xs font-bold whitespace-nowrap text-orange-400">
              <Flame size={12} aria-hidden="true" />
              {habit.streak_days}日継続
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}