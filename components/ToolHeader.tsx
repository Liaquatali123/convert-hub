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

export default function ToolHeader({
  id = 'tool-header',
  name,
  description,
  categoryName,
  categoryHref
}: ToolHeaderProps) {
  return (
    <div id={id} className="mb-8 md:mb-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Tools
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href={categoryHref} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          {categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-gray-800 dark:text-gray-200 font-semibold truncate">{name}</span>
      </div>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {name}
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
        
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Tools
        </Link>
      </div>

      <div className="mt-6 border-b border-gray-150 dark:border-gray-900" />
    </div>
  );
}
