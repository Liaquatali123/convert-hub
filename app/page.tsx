'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ShieldCheck, Zap, Laptop, Ban, Sparkles, Image, FileText, Database, Binary, HelpCircle } from 'lucide-react';
import { TOOLS, CATEGORIES, Tool } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

const categoryIconMap: Record<string, React.ReactNode> = {
  image: <Image className="w-5 h-5 text-emerald-500" />,
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  data: <Database className="w-5 h-5 text-blue-500" />,
  text: <Binary className="w-5 h-5 text-purple-500" />,
  utility: <Sparkles className="w-5 h-5 text-amber-500" />
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle live search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTools = searchQuery.trim() === '' 
    ? [] 
    : TOOLS.filter(tool => {
        const q = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.keywords.some(k => k.toLowerCase().includes(q)) ||
          tool.category.toLowerCase().includes(q)
        );
      });

  // Popular tools selected for quick links
  const popularTools = TOOLS.filter(tool => 
    ['image-compressor', 'jpg-to-png', 'jpg-to-pdf', 'json-formatter', 'unit-converter'].includes(tool.id)
  );

  const homeFAQs = [
    {
      question: 'Are my files uploaded to ConvertHub servers?',
      answer: 'No! ConvertHub is designed with a strict privacy-first architecture. All image compression, resizing, conversions, text encodings, and data formatting happen locally in your web browser using client-side JavaScript APIs. Your files are never uploaded, stored, or sent to any server.'
    },
    {
      question: 'Is ConvertHub completely free to use?',
      answer: 'Yes! All tools on ConvertHub are 100% free with no registration, no watermarks, and no usage limits. We support our server costs and ongoing development through small, unobtrusive advertising placeholders.'
    },
    {
      question: 'Why is client-side conversion better?',
      answer: 'Client-side conversion is significantly faster because it eliminates the time required to upload large files and download the results. It is also completely secure and private, working fully offline.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support widely used formats including JPG, PNG, WebP, PDF, JSON, CSV, and TXT, as well as digital storage units, lengths, weights, and temperature conversions.'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/10 dark:via-gray-950 dark:to-gray-950 pt-16 pb-20 border-b border-gray-100 dark:border-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/55 text-xs font-bold tracking-wide uppercase mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            100% Client-Side Processing
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight mb-4">
            Free Online Converters
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Convert, compress, and transform your files directly in your browser. Fast, simple, and 100% private.
          </p>

          {/* Search Box */}
          <div className="max-w-lg mx-auto relative mb-8">
            <div className="relative shadow-md rounded-xl">
              <input
                id="hero-search-input"
                type="text"
                placeholder="Search a tool... (e.g. PNG to JPG, compressor, JSON)"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-800 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 text-base md:text-lg transition-all"
              />
              <Search className="w-5 h-5 absolute left-4 top-4.5 text-gray-400 pointer-events-none" />
            </div>

            {searchQuery && (
              <p className="text-xs text-left text-gray-500 dark:text-gray-400 mt-2 px-1">
                Showing search results for "<span className="font-semibold text-gray-900 dark:text-white">{searchQuery}</span>"
              </p>
            )}
          </div>

          {/* Quick Popular Tools */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto text-sm">
            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-[11px]">Popular:</span>
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.route}
                className="px-3 py-1.5 rounded-lg border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-white transition-all shadow-sm"
              >
                {tool.name.replace(' Converter', '')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Dynamic Search Results Grid */}
        {searchQuery.trim() !== '' && (
          <div id="search-results-section" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-indigo-600" />
              Search Results
            </h2>
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-gray-150 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No matching tools found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any tools matching "{searchQuery}". Try searching for categories like "PDF", "Image", "JSON", or "Base64".
                </p>
              </div>
            )}
            <div className="mt-12 border-b border-gray-150 dark:border-gray-900" />
          </div>
        )}

        {/* Categories Section */}
        <div id="categories-section" className="space-y-16">
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const catTools = TOOLS.filter(t => t.category === catKey);

            return (
              <div key={catKey} id={`category-block-${catKey}`} className="scroll-mt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight flex items-center gap-2.5">
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        {categoryIconMap[catKey]}
                      </div>
                      {cat.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                  <Link
                    href={`/tools?category=${catKey}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    View All {cat.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTools.slice(0, 6).map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ad Placeholder integrated beautifully */}
        <AdPlaceholder id="home-ad-placeholder" />

        {/* Why ConvertHub Section */}
        <div id="why-converthub" className="my-20 p-8 md:p-12 rounded-2xl border border-gray-150 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              Why Choose ConvertHub?
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              We offer powerful utility converters styled with elegance and engineered for premium performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0 h-12 w-12 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/40 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">100% Private</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Your files never touch any external server. All processing runs entirely on your local machine.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 h-12 w-12 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/40 shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">Insanely Fast</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Skip the long upload and download times. Get high-quality conversion results instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 h-12 w-12 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/40 shadow-sm">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">No Installation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Fully operational online. Works flawlessly on any mobile device, tablet, laptop, or desktop.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shrink-0 h-12 w-12 flex items-center justify-center border border-rose-100/50 dark:border-rose-900/40 shadow-sm">
                <Ban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">No Watermarks</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Download clean files without added watermarks, forced headers, or metadata adjustments.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0 h-12 w-12 flex items-center justify-center border border-amber-100/50 dark:border-amber-900/40 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">Completely Free</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Enjoy unrestricted access to 16+ pro tools. No subscriptions or hidden fees.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 shrink-0 h-12 w-12 flex items-center justify-center border border-purple-100/50 dark:border-purple-900/40 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">Secure Encoders</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Your text encoders, decoders, formatted JSON, and spreadsheets are processed on your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FAQ items={homeFAQs} />

      </section>
    </div>
  );
}
