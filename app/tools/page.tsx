'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Image, FileText, Database, Binary, Sparkles, SlidersHorizontal, HelpCircle } from 'lucide-react';
import { TOOLS, CATEGORIES } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';

const categoryIconMap: Record<string, React.ReactNode> = {
  image: <Image className="h-4 w-4" />,
  pdf: <FileText className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  text: <Binary className="h-4 w-4" />,
  utility: <Sparkles className="h-4 w-4" />,
};

function ToolsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    router.push(category === 'all' ? '/tools' : `/tools?category=${category}`);
  };

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q) || tool.keywords.some((keyword) => keyword.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const categoriesList = [
    { id: 'all', name: 'All tools', icon: <SlidersHorizontal className="h-4 w-4" /> },
    ...Object.entries(CATEGORIES).map(([key, value]) => ({ id: key, name: value.name, icon: categoryIconMap[key] })),
  ];

  return (
    <div className="ch-shell w-full py-10 md:py-14">
      <header className="mb-9 border-b border-stone-200 pb-8 dark:border-stone-800">
        <span className="ch-eyebrow mb-4">The ConvertHub toolkit</span>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><h1 className="text-3xl font-extrabold tracking-[-.05em] text-stone-900 md:text-5xl dark:text-white">All the tools you need.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 md:text-base dark:text-stone-400">A practical collection of file converters and everyday utilities. Choose a category or search for exactly what you need.</p></div>
          <span className="inline-flex w-fit rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">{TOOLS.length} tools available</span>
        </div>
      </header>

      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 dark:border-stone-700 dark:bg-stone-900">
        <label htmlFor="all-tools-search-input" className="mb-2 block text-xs font-bold text-stone-700 dark:text-stone-200">Find a tool</label>
        <div className="relative mb-4 max-w-xl"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><input id="all-tools-search-input" type="search" placeholder="Search by name, format, or keyword..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:focus:ring-orange-950" /></div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categoriesList.map((category) => {
            const active = activeCategory === category.id;
            return <button key={category.id} id={`category-tab-btn-${category.id}`} onClick={() => handleCategoryChange(category.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${active ? 'border-orange-500 bg-orange-500 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-orange-200 hover:text-orange-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300'}`}>{category.icon}{category.name}</button>;
          })}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-extrabold text-stone-800 dark:text-stone-100">{activeCategory === 'all' ? 'All available tools' : CATEGORIES[activeCategory as keyof typeof CATEGORIES]?.name}</h2><span className="text-xs font-medium text-stone-400">{filteredTools.length} results</span></div>
      {filteredTools.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div> : <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center dark:border-stone-700 dark:bg-stone-900"><HelpCircle className="mx-auto mb-3 h-10 w-10 text-stone-300" /><h3 className="text-lg font-extrabold text-stone-800 dark:text-white">No tools found</h3><p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Try another search or choose a different category.</p><button onClick={() => { setSearchQuery(''); handleCategoryChange('all'); }} className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600">Clear filters</button></div>}
    </div>
  );
}

export default function ToolsPage() {
  return <Suspense fallback={<div className="ch-shell py-20 text-center text-sm text-stone-500">Loading tools…</div>}><ToolsPageContent /></Suspense>;
}
