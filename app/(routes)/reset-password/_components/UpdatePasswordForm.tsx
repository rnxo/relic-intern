'use client';

import { useState, useId } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import FocusInput from './FocusInput';
import { updatePassword } from '@/app/auth/actions';
import {
  validateUpdatePassword,
  hasErrors,
  translateAuthError,
  type UpdatePasswordErrors,
} from '@/app/lib/authValidation';

type InputData = { password: string; confirmPassword: string };

export default function UpdatePasswordForm({ reduced }: { reduced: boolean }) {
  const [input, setInput] = useState<InputData>({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<UpdatePasswordErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordId = useId();
  const confirmPasswordId = useId();

  const handleChange = (key: keyof InputData, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validateUpdatePassword(input);
    setErrors(next);
    if (hasErrors(next)) return;

    setLoading(true);
    setServerError(null);
    const result = await updatePassword(input.password);
    setLoading(false);
    if (result?.error) {
      setServerError(result.error);
    }
  };

  const labelClass =
    'text-[0.7rem] font-semibold text-lumi-muted/50 uppercase tracking-[0.1em] mb-1.5 block';
  const errorClass = 'mt-1.5 text-[0.72rem] text-red-400/90 flex items-center gap-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor={passwordId} className={labelClass}>
          新しいパスワード
        </Label>
        <FocusInput
          id={passwordId}
          type="password"
          value={input.password}
          placeholder="8文字以上で入力"
          onChange={(v) => handleChange('password', v)}
          reduced={reduced}
          variant={errors.password ? 'error' : 'default'}
        />
        <AnimatePresence>
          {errors.password && (
            <motion.p
              role="alert"
              className={errorClass}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <span aria-hidden="true">✕</span>
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <Label htmlFor={confirmPasswordId} className={labelClass}>
          新しいパスワード(確認)
        </Label>
        <FocusInput
          id={confirmPasswordId}
          type="password"
          value={input.confirmPassword}
          placeholder="もう一度入力"
          onChange={(v) => handleChange('confirmPassword', v)}
          reduced={reduced}
          variant={errors.confirmPassword ? 'error' : 'default'}
        />
        <AnimatePresence>
          {errors.confirmPassword && (
            <motion.p
              role="alert"
              className={errorClass}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <span aria-hidden="true">✕</span>
              {errors.confirmPassword}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {serverError && (
          <motion.div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-[0.8rem]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'color-mix(in srgb, #ef4444 10%, transparent)',
              border: '1px solid color-mix(in srgb, #ef4444 28%, transparent)',
              color: 'color-mix(in srgb, #ef4444 88%, white)',
            }}
          >
            <span className="mt-px select-none" aria-hidden="true">
              ⚠
            </span>
            <span>{translateAuthError(serverError)}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                更新中...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={reduced ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? {} : { opacity: 0 }}
              >
                パスワードを更新
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
