'use client';

import { motion } from 'motion/react';

export default function SuccessIcon({ reduced }: { reduced: boolean }) {
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
