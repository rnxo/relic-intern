'use client';

import { Button } from '@/components/ui/button';
import SuccessIcon from './SuccessIcon';

export default function ResetPasswordSuccess({
  reduced,
  onReset,
}: {
  reduced: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <SuccessIcon reduced={reduced} />
      <p className="max-w-[280px] text-[0.8rem] leading-relaxed text-lumi-muted/60">
        メールが届かない場合は、迷惑メールフォルダをご確認いただくか、下のボタンから再送信してください。
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="mt-6 h-auto w-full rounded-xl py-2.5 text-sm text-lumi-fg/75 hover:text-lumi-fg"
        style={{
          background: 'color-mix(in srgb, var(--lumi-surface) 25%, transparent)',
          border: '1px solid color-mix(in srgb, var(--lumi-primary) 18%, transparent)',
        }}
      >
        別のメールアドレスで再送信
      </Button>
    </div>
  );
}
