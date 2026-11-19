'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface ToolHeaderProps {
  id?: string;
  name: string;
  description: string;
  categoryName: string;
  categoryHref: string;
}

export default function ToolHeader({ id = 'tool-header', name, description, categoryName, categoryHref }: ToolHeaderProps) {
  return (
    <header id={id} className="mb-8 md:mb-10">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-medium text-stone-400">
        <Link href="/" className="hover:text-orange-700 dark:hover:text-orange-300">Home</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href="/tools" className="hover:text-orange-700 dark:hover:text-orange-300">Tools</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href={categoryHref} className="hover:text-orange-700 dark:hover:text-orange-300">{categoryName}</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="truncate text-stone-700 dark:text-stone-200">{name}</span>
      </nav>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-3xl">
          <span className="mb-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{categoryName}</span>
          <h1 className="text-3xl font-extrabold tracking-[-.045em] text-stone-900 md:text-4xl dark:text-white">{name}</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500 md:text-base dark:text-stone-400">{description}</p>
        </div>
        <Link href="/tools" className="inline-flex items-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-600 hover:border-orange-200 hover:text-orange-700 sm:self-auto dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
          <ArrowLeft className="h-4 w-4" /> All tools
        </Link>
      </div>
      <div className="mt-7 h-px bg-stone-200 dark:bg-stone-800" />
    </header>
  );
}
