'use client';

import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Tool } from '@/lib/tools';

interface ToolCardProps { tool: Tool; }

const categoryLabels = {
  image: 'Image',
  pdf: 'PDF',
  data: 'Data',
  text: 'Text',
  utility: 'Utility',
};

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = (Icons[tool.iconName as keyof typeof Icons] || Icons.WandSparkles) as React.ComponentType<{ className?: string }>;

  return (
    <article
      id={`tool-card-${tool.id}`}
      className="group flex min-h-[228px] flex-col justify-between rounded-[18px] border border-stone-200 bg-white p-5 shadow-[0_2px_8px_rgba(38,37,31,0.025)] transition-all duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_14px_32px_rgba(85,61,32,0.08)] dark:border-stone-700 dark:bg-stone-900"
    >
      <div>
        <div className="mb-5 flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300">
            <IconComponent className="h-5 w-5" />
          </span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
            {categoryLabels[tool.category]}
          </span>
        </div>
        <h3 className="mb-2 text-[16px] font-bold tracking-tight text-stone-900 group-hover:text-orange-700 dark:text-stone-100 dark:group-hover:text-orange-300">
          {tool.name}
        </h3>
        <p className="text-[13px] leading-6 text-stone-500 dark:text-stone-400">
          {tool.description}
        </p>
      </div>
      <Link
        id={`open-tool-btn-${tool.id}`}
        href={tool.route}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg py-1 text-[13px] font-bold text-orange-700 hover:gap-3 dark:text-orange-300"
      >
        Open tool <Icons.ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
