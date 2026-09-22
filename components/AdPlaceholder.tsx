'use client';

import React from 'react';

interface AdPlaceholderProps {
  id?: string;
  className?: string;
  format?: 'horizontal' | 'vertical' | 'square';
}

export default function AdPlaceholder({ id = 'ad-slot', className = '', format = 'horizontal' }: AdPlaceholderProps) {
  // Only render if we want to show where ads can be integrated later.
  // It matches a standard Google AdSense block but marked clearly and elegantly.
  const dimensions = {
    horizontal: 'w-full h-24 max-h-24 md:h-28',
    vertical: 'w-64 h-80 max-w-full',
    square: 'w-full max-w-xs h-64'
  }[format];

  return (
    <div
      id={id}
      className={`mx-auto my-6 flex flex-col items-center justify-center rounded-xl bg-gray-50/50 dark:bg-gray-950/20 border border-dashed border-gray-200 dark:border-gray-800 text-center ${dimensions} ${className}`}
    >
      <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-400 dark:text-gray-600 mb-1">
        Advertisement Slot
      </span>
      <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[200px] leading-snug">
        This space is reserved for privacy-compliant ads to keep our services free.
      </p>
    </div>
  );
}
