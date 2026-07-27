'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'motion/react';

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

const STARS = [
  { id: 0, x: 12, y: 8, size: 1.5, delay: 0, dur: 4.2 },
  { id: 1, x: 78, y: 15, size: 1, delay: 0.8, dur: 5.1 },
  { id: 2, x: 35, y: 72, size: 2, delay: 1.5, dur: 3.8 },
  { id: 3, x: 88, y: 55, size: 1, delay: 0.3, dur: 6.0 },
  { id: 4, x: 22, y: 40, size: 1.5, delay: 2.1, dur: 4.5 },
  { id: 5, x: 60, y: 88, size: 1, delay: 0.6, dur: 5.3 },
  { id: 6, x: 48, y: 25, size: 2.5, delay: 1.2, dur: 3.6 },
  { id: 7, x: 92, y: 30, size: 1, delay: 1.9, dur: 7.0 },
  { id: 8, x: 5, y: 62, size: 1.5, delay: 0.4, dur: 4.8 },
  { id: 9, x: 70, y: 45, size: 1, delay: 2.5, dur: 5.5 },
  { id: 10, x: 55, y: 5, size: 2, delay: 1.0, dur: 4.0 },
  { id: 11, x: 30, y: 90, size: 1, delay: 1.7, dur: 6.2 },
];

type FocusInputProps = {
  id: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  reduced: boolean;
  hasError?: boolean;
};

function FocusInput({
  id,
  type,
  value,
  placeholder,
  onChange,
  reduced,
  hasError,
}: FocusInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-xl"
        animate={reduced ? {} : focused ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          boxShadow: hasError
            ? '0 0 0 2px color-mix(in srgb, #ef4444 45%, transparent)'
            : '0 0 0 2px color-mix(in srgb, var(--lumi-primary) 45%, transparent), 0 0 20px color-mix(in srgb, var(--lumi-primary) 18%, transparent)',
          borderRadius: 12,
        }}
      />
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={hasError}
        className={[
          'relative z-10 h-auto rounded-xl bg-lumi-surface/50 px-4 py-2.5 text-lumi-fg transition-colors duration-200 placeholder:text-lumi-muted/25 focus-visible:ring-0',
          hasError
            ? 'border-red-500/50 focus-visible:border-red-500/70'
            : 'border-lumi-border/35 focus-visible:border-lumi-primary/55',
        ].join(' ')}
      />
    </div>
  );
}

function SuccessIcon({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 64,
          height: 64,
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 22%, transparent) 0%, transparent 72%)',
          filter: 'blur(10px)',
        }}
      />
      <motion.div
        className="relative flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background:
            'linear-gradient(135deg, var(--lumi-primary) 0%, var(--lumi-secondary) 55%, var(--lumi-primary-hover) 100%)',
          boxShadow:
            '0 4px 20px color-mix(in srgb, var(--lumi-primary) 40%, transparent), 0 1px 0 rgba(255,255,255,0.15) inset',
        }}
        initial={reduced ? {} : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="var(--lumi-base)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? {} : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

function ResetPasswordForm({
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
          hasError={!!errors.email}
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

function ResetPasswordSuccess({ reduced, onReset }: { reduced: boolean; onReset: () => void }) {
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

export default function ResetPasswordContent() {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<'idle' | 'success'>('idle');
  const [sentEmail, setSentEmail] = useState('');

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };
  const leftContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: 0.25 },
    },
  };
  const leftItem: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };
  const rightContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: 0.4 },
    },
  };
  const rightItem: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  return (
    <>
      <style>{`
                @keyframes lumi-drift-a {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(50px,70px) scale(1.10); }
                }
                @keyframes lumi-drift-b {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(-60px,-45px) scale(1.12); }
                }
                @keyframes lumi-drift-c {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(35px,-55px) scale(1.08); }
                }
                @keyframes lumi-pet-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-8px); }
                }
                @keyframes lumi-ring-pulse {
                    0%, 100% { opacity: 0.55; transform: scale(1);    }
                    50%      { opacity: 0.22; transform: scale(1.08); }
                }
                @keyframes lumi-ring-pulse-slow {
                    0%, 100% { opacity: 0.28; transform: scale(1);    }
                    50%      { opacity: 0.08; transform: scale(1.14); }
                }
            `}</style>

      <div className="flex min-h-screen items-center justify-center overflow-y-auto p-4 sm:p-8">
        {/* Dark base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 160% 110% at 60% 115%, #07080f 0%, color-mix(in srgb, var(--lumi-base) 80%, #000) 50%, color-mix(in srgb, var(--lumi-base) 90%, #000) 100%)',
          }}
        />

        {/* Blue nebula — top-left */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: -250,
            left: -190,
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 60%, transparent) 0%, color-mix(in srgb, var(--lumi-primary) 20%, transparent) 42%, transparent 70%)',
            filter: 'blur(72px)',
            opacity: 0.55,
            animation: reduced ? 'none' : 'lumi-drift-a 22s ease-in-out infinite alternate',
          }}
        />

        {/* Purple nebula — bottom-right */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 580,
            height: 580,
            bottom: -190,
            right: -150,
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--lumi-secondary) 55%, transparent) 0%, color-mix(in srgb, var(--lumi-secondary) 15%, transparent) 44%, transparent 70%)',
            filter: 'blur(82px)',
            opacity: 0.52,
            animation: reduced ? 'none' : 'lumi-drift-b 26s ease-in-out infinite alternate',
          }}
        />

        {/* Cyan accent — center-right */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 400,
            height: 290,
            top: '38%',
            right: '12%',
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--lumi-primary-hover) 32%, transparent) 0%, transparent 70%)',
            filter: 'blur(90px)',
            opacity: 0.28,
            animation: reduced ? 'none' : 'lumi-drift-c 32s ease-in-out infinite alternate',
          }}
        />

        {/* Grain noise */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/></filter><rect width='256' height='256' filter='url(%23n)' opacity='0.07'/></svg>\")",
            backgroundSize: '256px 256px',
            opacity: 0.45,
          }}
        />

        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, color-mix(in srgb, var(--lumi-base) 85%, #000) 100%)',
          }}
        />

        {/* ── Main card ── */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex w-full max-w-[860px] flex-col overflow-hidden rounded-2xl md:flex-row"
          style={{
            border: '1px solid color-mix(in srgb, var(--lumi-primary) 18%, transparent)',
            boxShadow: [
              '0 0 0 1px color-mix(in srgb, var(--lumi-primary) 5%, transparent)',
              '0 48px 96px rgba(0,0,0,0.65)',
              '0 0 120px color-mix(in srgb, var(--lumi-primary) 8%, transparent)',
              '0 0 60px color-mix(in srgb, var(--lumi-secondary) 5%, transparent)',
            ].join(', '),
          }}
        >
          {/* ═══ Left column: brand ═══ */}
          <motion.div
            variants={leftContainer}
            initial="hidden"
            animate="visible"
            className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-8 py-12 backdrop-blur-2xl md:py-10"
            style={{
              background:
                'linear-gradient(170deg, color-mix(in srgb, var(--lumi-base) 78%, transparent) 0%, color-mix(in srgb, var(--lumi-base) 72%, transparent) 100%)',
              borderBottom: '1px solid color-mix(in srgb, var(--lumi-primary) 10%, transparent)',
            }}
          >
            {/* Inner glows */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 220px 180px at 50% 34%, color-mix(in srgb, var(--lumi-primary) 8%, transparent) 0%, transparent 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-[90px] -left-[80px] h-[220px] w-[220px] rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--lumi-primary) 14%, transparent)',
                filter: 'blur(56px)',
              }}
            />
            <div
              className="pointer-events-none absolute top-[24px] -right-[44px] h-[150px] w-[150px] rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--lumi-secondary) 14%, transparent)',
                filter: 'blur(48px)',
              }}
            />

            {/* Star particles */}
            {!reduced &&
              STARS.map((star) => (
                <motion.div
                  key={star.id}
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                    background: 'var(--lumi-fg)',
                    boxShadow: `0 0 ${star.size * 2}px var(--lumi-primary)`,
                  }}
                  animate={{
                    opacity: [0.15, 0.85, 0.15],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: star.dur,
                    delay: star.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}

            {/* Pet with aura rings */}
            <motion.div
              variants={leftItem}
              className="relative mb-5 flex items-center justify-center"
            >
              <div
                className="pointer-events-none absolute rounded-full"
                style={{
                  width: 160,
                  height: 160,
                  background:
                    'radial-gradient(circle, transparent 38%, color-mix(in srgb, var(--lumi-primary) 8%, transparent) 60%, transparent 80%)',
                  border: '1px solid color-mix(in srgb, var(--lumi-primary) 12%, transparent)',
                  animation: reduced ? 'none' : 'lumi-ring-pulse-slow 4.5s ease-in-out infinite',
                }}
              />
              <div
                className="pointer-events-none absolute rounded-full"
                style={{
                  width: 132,
                  height: 132,
                  background:
                    'radial-gradient(circle, transparent 30%, color-mix(in srgb, var(--lumi-primary) 14%, transparent) 55%, transparent 75%)',
                  border: '1px solid color-mix(in srgb, var(--lumi-primary) 22%, transparent)',
                  animation: reduced ? 'none' : 'lumi-ring-pulse 3.5s ease-in-out infinite',
                }}
              />
              <div
                className="pointer-events-none absolute rounded-full"
                style={{
                  width: 108,
                  height: 108,
                  background:
                    'radial-gradient(circle, color-mix(in srgb, var(--lumi-primary) 18%, transparent) 0%, color-mix(in srgb, var(--lumi-secondary) 10%, transparent) 50%, transparent 75%)',
                  filter: 'blur(8px)',
                  animation: reduced ? 'none' : 'lumi-ring-pulse 2.8s ease-in-out infinite 0.6s',
                }}
              />
              <div
                style={{
                  animation: reduced ? 'none' : 'lumi-pet-float 5s ease-in-out infinite',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Image
                  alt="Lumi ペット"
                  src="/lumi-lv1.svg"
                  width={90}
                  height={90}
                  priority
                  style={{
                    filter:
                      'drop-shadow(0 0 12px color-mix(in srgb, var(--lumi-primary) 55%, transparent)) drop-shadow(0 0 28px color-mix(in srgb, var(--lumi-secondary) 25%, transparent))',
                  }}
                />
              </div>
            </motion.div>

            {/* Brand title */}
            <motion.p
              variants={leftItem}
              className="relative z-10 bg-gradient-to-br from-lumi-fg via-lumi-primary to-lumi-secondary bg-clip-text text-[2.8rem] leading-none font-bold tracking-tight text-transparent select-none"
            >
              Lumi
            </motion.p>

            <motion.p
              variants={leftItem}
              className="relative z-10 mt-2 text-[0.8rem] tracking-[0.12em] text-lumi-muted/55 uppercase"
            >
              パスワードの再設定
            </motion.p>

            {/* Feature badge */}
            <motion.span
              variants={leftItem}
              className="relative z-10 mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.68rem]"
              style={{
                border: '1px solid color-mix(in srgb, var(--lumi-secondary) 30%, transparent)',
                color: 'color-mix(in srgb, var(--lumi-secondary) 85%, white)',
                background: 'color-mix(in srgb, var(--lumi-secondary) 9%, transparent)',
              }}
            >
              ✦ 大切な習慣の記録を安全に守ります
            </motion.span>
          </motion.div>

          {/* ═══ Right column: form ═══ */}
          <motion.div
            variants={rightContainer}
            initial="hidden"
            animate="visible"
            className="relative flex flex-[1.2] flex-col justify-center px-8 py-10 backdrop-blur-2xl"
            style={{
              background:
                'linear-gradient(160deg, color-mix(in srgb, var(--lumi-base) 92%, transparent) 0%, color-mix(in srgb, var(--lumi-base) 88%, transparent) 100%)',
            }}
          >
            {/* Corner glow */}
            <div
              className="pointer-events-none absolute top-0 right-0 h-[180px] w-[180px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in srgb, var(--lumi-secondary) 6%, transparent) 0%, transparent 70%)',
                filter: 'blur(40px)',
                transform: 'translate(40%, -40%)',
              }}
            />

            {/* Heading */}
            <motion.div variants={rightItem} className="mb-7 min-h-[64px]">
              <AnimatePresence mode="wait" initial={false}>
                {phase === 'idle' ? (
                  <motion.div
                    key="idle-heading"
                    initial={reduced ? {} : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? {} : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <h1 className="text-[1.5rem] leading-tight font-bold tracking-tight text-lumi-fg">
                      パスワードをお忘れですか？
                    </h1>
                    <p className="mt-1.5 text-[0.8rem] text-lumi-muted/50">
                      登録済みのメールアドレス宛にリセットリンクをお送りします
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-heading"
                    initial={reduced ? {} : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? {} : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <h1 className="text-[1.5rem] leading-tight font-bold tracking-tight text-lumi-fg">
                      メールを送信しました
                    </h1>
                    <p className="mt-1.5 text-[0.8rem] break-all text-lumi-muted/50">
                      {sentEmail} 宛にリセットリンクをお送りしました
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Form / Success */}
            <motion.div variants={rightItem}>
              <AnimatePresence mode="wait" initial={false}>
                {phase === 'idle' ? (
                  <motion.div
                    key="form"
                    initial={reduced ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? {} : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ResetPasswordForm
                      reduced={reduced}
                      onSuccess={(sentTo) => {
                        setSentEmail(sentTo);
                        setPhase('success');
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={reduced ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? {} : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ResetPasswordSuccess reduced={reduced} onReset={() => setPhase('idle')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Bottom link */}
            <motion.p
              variants={rightItem}
              className="mt-6 text-center text-[0.73rem] leading-relaxed text-lumi-muted/35"
            >
              <Link
                href="/login"
                className="text-lumi-primary/60 underline-offset-2 transition-all duration-200 hover:text-lumi-primary/90 hover:underline"
              >
                ログインページに戻る
              </Link>
            </motion.p>

            {/* Bottom line */}
            <div
              className="pointer-events-none absolute right-8 bottom-0 left-8 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, color-mix(in srgb, var(--lumi-primary) 10%, transparent) 50%, transparent)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
