'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';

type FocusInputProps = {
  id: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  reduced: boolean;
  hasError?: boolean;
};

export default function FocusInput({
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
