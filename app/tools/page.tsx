'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Image, FileText, Database, Binary, Sparkles, SlidersHorizontal, HelpCircle } from 'lucide-react';
import { TOOLS, CATEGORIES, Tool } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import AdPlaceholder from '@/components/AdPlaceholder';

const categoryIconMap: Record<string, React.ReactNode> = {
  image: <Image className="w-4 h-4" />,
  pdf: <FileText className="w-4 h-4" />,
  data: <Database className="w-4 h-4" />,
  text: <Binary className="w-4 h-4" />,
  utility: <Sparkles className="w-4 h-4" />
};

function ToolsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep state in sync with URL search params
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      router.push('/tools');
    } else {
      router.push(`/tools?category=${category}`);
    }
  };

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const categoriesList = [
    { id: 'all', name: 'All Tools', icon: <SlidersHorizontal className="w-4 h-4" /> },
    ...Object.entries(CATEGORIES).map(([key, value]) => ({
      id: key,
      name: value.name,
      icon: categoryIconMap[key],
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          All Online Converters
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
          Access our complete collection of fast, 100% private in-browser converters and file editors. No files are uploaded to any server.
        </p>
      </div>

      {/* Filters Bar: Category Tabs + Search Input */}
      <div className="flex flex-col gap-6 mb-10 pb-6 border-b border-gray-150 dark:border-gray-900">
        {/* Search */}
        <div className="relative w-full max-w-md mx-auto">
          <input
            id="all-tools-search-input"
            type="text"
            placeholder="Search tools by name, utility, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-all text-sm"
          />
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
        </div>

        {/* Category Buttons Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 overflow-x-auto py-1">
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                id={`category-tab-btn-${cat.id}`}
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all border ${
                  isActive
                    ? 'bg-indigo-600 dark:bg-indigo-600 border-indigo-600 text-white shadow-sm font-bold'
                    : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl border border-gray-150 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20 max-w-xl mx-auto">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No matching tools found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We couldn't find any tools matching your search criteria. Try using other keywords or clear filters to see all available tools.
          </p>
        </div>
      )}

      {/* Ad slot */}
      <AdPlaceholder id="all-tools-ad-slot" />
    </div>
  );
}

export default function AllToolsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="animate-pulse text-indigo-600 font-semibold text-sm">Loading converters...</div>
      </div>
    }>
      <ToolsPageContent />
    </Suspense>
  );
}
