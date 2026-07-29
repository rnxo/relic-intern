'use client';

import { useState, useId } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import FocusInput from './FocusInput';

type ResetErrors = { email?: string };

const EMAIL_RE = /\S+@\S+\.\S+/;

function validateResetEmail(email: string): ResetErrors {
  const errors: ResetErrors = {};
  if (!email.trim()) {
    errors.email = 'メールアドレスを入力してください';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }
  return errors;
}

export default function ResetPasswordForm({
  reduced,
  onSuccess,
}: {
  reduced: boolean;
  onSuccess: (email: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ResetErrors>({});
  const [loading, setLoading] = useState(false);
  const emailId = useId();

  const handleChange = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validateResetEmail(email);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    // NOTE: パスワードリセットメール送信の実処理（Supabase連携）は後日別タスクで実装予定。
    // 現時点ではUI状態（loading → success）確認のためのダミー処理。
    window.setTimeout(() => {
      setLoading(false);
      onSuccess(email.trim());
    }, 900);
  };

  const labelClass =
    'text-[0.7rem] font-semibold text-lumi-muted/50 uppercase tracking-[0.1em] mb-1.5 block';
  const errorClass = 'mt-1.5 text-[0.72rem] text-red-400/90 flex items-center gap-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor={emailId} className={labelClass}>
          登録済みメールアドレス
        </Label>
        <FocusInput
          id={emailId}
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={handleChange}
          reduced={reduced}
          variant={errors.email ? 'error' : 'default'}
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              role="alert"
              className={errorClass}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <span aria-hidden="true">✕</span>
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-xl">
        <Button
          type="submit"
          disabled={loading}
          className="relative z-10 h-auto w-full rounded-xl border-0 py-3 text-sm font-semibold text-lumi-base transition-all duration-200 active:scale-[0.98]"
          style={{
            background:
              'linear-gradient(135deg, var(--lumi-primary) 0%, var(--lumi-secondary) 55%, var(--lumi-primary-hover) 100%)',
            boxShadow:
              '0 4px 20px color-mix(in srgb, var(--lumi-primary) 35%, transparent), 0 1px 0 rgba(255,255,255,0.15) inset',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                initial={reduced ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? {} : { opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-lumi-base/60 border-t-lumi-base" />
                送信中...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={reduced ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? {} : { opacity: 0 }}
              >
                リセットリンクを送信
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut',
            }}
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
              skewX: -15,
            }}
          />
        )}
      </div>
    </form>
  );
}
