'use client';

import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Tool } from '@/lib/tools';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  // Dynmically select the icon based on tool.iconName
  const IconComponent = (Icons[tool.iconName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;

  const categoryColorMap = {
    image: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40',
    pdf: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40',
    data: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/40',
    text: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/40',
    utility: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
  };

  const categoryLabels = {
    image: 'Image Tool',
    pdf: 'PDF Tool',
    data: 'Data Tool',
    text: 'Text & Encoding',
    utility: 'Utility Tool',
  };

  return (
    <div
      id={`tool-card-${tool.id}`}
      className="group flex flex-col justify-between p-6 bg-white dark:bg-gray-950 border border-gray-200/90 dark:border-gray-900 rounded-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-indigo-950/20 transition-all duration-300"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800/80 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50 transition-colors">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className={`text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${categoryColorMap[tool.category]}`}>
            {categoryLabels[tool.category]}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
          {tool.name}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
          {tool.description}
        </p>
      </div>

      <Link
        id={`open-tool-btn-${tool.id}`}
        href={tool.route}
        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 dark:border-gray-800 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:hover:border-indigo-500 dark:hover:bg-indigo-500 text-gray-700 dark:text-gray-300 transition-all group-hover:shadow-sm"
      >
        Open Tool
        <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
