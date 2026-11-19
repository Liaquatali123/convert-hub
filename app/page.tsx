'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight, ShieldCheck, Zap, LockKeyhole, Image, FileText, Database, Binary, Sparkles, ArrowRight, CheckCircle2, Globe2, WandSparkles } from 'lucide-react';
import { TOOLS, CATEGORIES } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import FAQ from '@/components/FAQ';

const categoryIconMap: Record<string, React.ReactNode> = {
  image: <Image className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  data: <Database className="h-5 w-5" />,
  text: <Binary className="h-5 w-5" />,
  utility: <Sparkles className="h-5 w-5" />,
};

const categoryAccents: Record<string, string> = {
  image: 'bg-orange-50 text-orange-700 border-orange-100',
  pdf: 'bg-rose-50 text-rose-700 border-rose-100',
  data: 'bg-blue-50 text-blue-700 border-blue-100',
  text: 'bg-violet-50 text-violet-700 border-violet-100',
  utility: 'bg-amber-50 text-amber-700 border-amber-100',
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(q)) ||
      tool.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const popularTools = TOOLS.filter((tool) => ['image-compressor', 'jpg-to-pdf', 'json-formatter', 'jpg-to-png', 'unit-converter'].includes(tool.id));
  const homeFAQs = [
    { question: 'Are my files uploaded to ConvertHub servers?', answer: 'No. Supported conversions and processing happen locally in your browser. Your files are not uploaded to our servers.' },
    { question: 'Is ConvertHub free to use?', answer: 'Yes. You can use the available tools without creating an account or paying a subscription.' },
    { question: 'Can I use ConvertHub on my phone?', answer: 'Yes. ConvertHub is designed to work on modern mobile browsers, tablets, and desktop computers.' },
    { question: 'What formats are supported?', answer: 'Available tools support common formats including JPG, PNG, WebP, PDF, JSON, CSV, and text, along with everyday unit conversions.' },
  ];

  return (
    <div className="w-full">
      <section id="hero-section" className="relative overflow-hidden border-b border-stone-200 bg-[#fbfaf7] dark:border-stone-800 dark:bg-stone-950">
        <div className="ch-shell grid items-center gap-12 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
          <div className="relative z-10">
            <div className="ch-eyebrow mb-6"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Free tools · Private by design</div>
            <h1 className="max-w-[650px] text-[42px] font-extrabold leading-[1.07] tracking-[-.065em] text-stone-900 sm:text-5xl md:text-[64px] dark:text-white">
              Your files.<br /><span className="text-orange-600">Made simpler.</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-base leading-7 text-stone-500 md:text-lg md:leading-8 dark:text-stone-400">
              Convert, compress, and organize everyday files with tools that just work. No account, no complicated setup, and your files stay on your device.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(232,138,53,.2)] hover:-translate-y-0.5 hover:bg-orange-600">
                Explore all tools <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-6 text-sm font-bold text-stone-700 hover:border-orange-200 hover:text-orange-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
                How it works <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-stone-500 dark:text-stone-400">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Browser-based processing</span>
              <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-emerald-600" /> No sign-up required</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[510px]">
            <div className="absolute -right-5 -top-7 h-36 w-36 rounded-full bg-orange-100/80 blur-3xl dark:bg-orange-900/20" />
            <div className="absolute -bottom-8 -left-5 h-40 w-40 rounded-full bg-amber-100/80 blur-3xl dark:bg-amber-900/10" />
            <div className="relative overflow-hidden rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_28px_80px_rgba(67,53,33,.11)] sm:p-5 dark:border-stone-700 dark:bg-stone-900">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
                <div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-700"><WandSparkles className="h-4 w-4" /></span><div><p className="text-sm font-extrabold text-stone-800 dark:text-white">Quick workspace</p><p className="text-[10px] text-stone-400">A simpler way to get things done</p></div></div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Ready</span>
              </div>
              <div className="py-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[.1em] text-stone-400">Choose what you need</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Image tools', detail: 'Convert & compress', icon: <Image className="h-5 w-5" />, style: 'bg-orange-50 text-orange-700' },
                    { label: 'PDF tools', detail: 'Images & documents', icon: <FileText className="h-5 w-5" />, style: 'bg-rose-50 text-rose-700' },
                    { label: 'Data tools', detail: 'JSON & CSV', icon: <Database className="h-5 w-5" />, style: 'bg-blue-50 text-blue-700' },
                    { label: 'Text tools', detail: 'Encode & decode', icon: <Binary className="h-5 w-5" />, style: 'bg-violet-50 text-violet-700' },
                  ].map((item) => <div key={item.label} className="rounded-2xl border border-stone-100 bg-[#fdfcf9] p-4 dark:border-stone-800 dark:bg-stone-950"><span className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.style}`}>{item.icon}</span><p className="text-sm font-extrabold text-stone-800 dark:text-stone-100">{item.label}</p><p className="mt-1 text-[11px] text-stone-400">{item.detail}</p></div>)}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f7f5ef] px-4 py-3 dark:bg-stone-800"><span className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300"><LockKeyhole className="h-3.5 w-3.5 text-emerald-600" /> Your files stay on your device</span><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
            </div>
            <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-lg sm:block dark:border-stone-700 dark:bg-stone-900"><p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Simple by design</p><p className="mt-1 text-sm font-extrabold text-stone-800 dark:text-white">Fast. Free. Private.</p></div>
          </div>
        </div>
      </section>

      <section className="ch-shell py-12 md:py-16">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-orange-700">Get started</p><h2 className="ch-section-title text-2xl md:text-3xl">Popular tools</h2><p className="mt-2 text-sm text-stone-500 dark:text-stone-400">The tools people reach for most.</p></div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 hover:gap-3 dark:text-orange-300">Browse every tool <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{popularTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div>
      </section>

      <section className="border-y border-stone-200 bg-[#f5f3ed] py-14 dark:border-stone-800 dark:bg-stone-900/50">
        <div className="ch-shell">
          <div className="mb-8 max-w-xl"><p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-orange-700">Find your tool</p><h2 className="ch-section-title text-2xl md:text-3xl">Everything in its place.</h2><p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">A clear set of tools for common file tasks, grouped so you can get to the right one quickly.</p></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((key) => <Link key={key} href={`/tools?category=${key}`} className="group rounded-2xl border border-stone-200 bg-white p-5 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg dark:border-stone-700 dark:bg-stone-900"><span className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${categoryAccents[key]}`}>{categoryIconMap[key]}</span><h3 className="text-sm font-extrabold text-stone-800 group-hover:text-orange-700 dark:text-stone-100 dark:group-hover:text-orange-300">{CATEGORIES[key].name}</h3><p className="mt-2 min-h-[48px] text-xs leading-5 text-stone-500 dark:text-stone-400">{CATEGORIES[key].description}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-orange-700 dark:text-orange-300">Explore category <ArrowUpRight className="h-3.5 w-3.5" /></span></Link>)}
          </div>
        </div>
      </section>

      <section id="all-tools-search" className="ch-shell py-14 md:py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center"><p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-orange-700">Tool finder</p><h2 className="ch-section-title text-2xl md:text-3xl">What do you want to do?</h2><p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Search by file type, format, or task.</p></div>
        <div className="relative mx-auto mb-8 max-w-xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" /><input id="hero-search-input" type="search" placeholder="Try “compress image” or “JSON”..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-14 w-full rounded-2xl border border-stone-200 bg-white pl-12 pr-4 text-sm text-stone-800 shadow-[0_8px_30px_rgba(38,37,31,.04)] outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:ring-orange-950" /></div>
        {searchQuery.trim() ? <div id="search-results-section"><p className="mb-4 text-center text-xs font-semibold text-stone-500">Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}</p>{filteredTools.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div> : <p className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900">No tools found. Try a different search.</p>}</div> : <div className="flex flex-wrap justify-center gap-2">{['Image compressor', 'JPG to PDF', 'JSON formatter', 'Base64', 'Unit converter'].map((label) => <button key={label} onClick={() => setSearchQuery(label)} className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-600 hover:border-orange-200 hover:text-orange-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">{label}</button>)}</div>}
      </section>

      <section id="how-it-works" className="ch-shell pb-14 md:pb-20">
        <div className="rounded-[24px] border border-stone-200 bg-white p-6 sm:p-9 dark:border-stone-700 dark:bg-stone-900">
          <div className="mb-8 max-w-xl"><p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-orange-700">How it works</p><h2 className="ch-section-title text-2xl md:text-3xl">Three steps. That’s it.</h2><p className="mt-2 text-sm text-stone-500 dark:text-stone-400">No complicated workflow. Pick a tool, add your file, and save the result.</p></div>
          <div className="grid gap-7 md:grid-cols-3">
            {[{n:'01',title:'Choose a tool',desc:'Find the converter or utility that matches what you need.'},{n:'02',title:'Add your file or input',desc:'Select a file or enter text directly in the tool.'},{n:'03',title:'Get your result',desc:'Process it in your browser and download or copy the output.'}].map((step) => <div key={step.n} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xs font-extrabold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{step.n}</span><div><h3 className="text-sm font-extrabold text-stone-800 dark:text-white">{step.title}</h3><p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">{step.desc}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="ch-shell pb-14 md:pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {[{icon:<ShieldCheck className="h-5 w-5" />,title:'Private by design',desc:'Supported processing runs locally in your browser.'},{icon:<Zap className="h-5 w-5" />,title:'Quick and simple',desc:'Straightforward tools without unnecessary steps.'},{icon:<Globe2 className="h-5 w-5" />,title:'Works in your browser',desc:'Use it on mobile, tablet, or desktop.'}].map((item) => <div key={item.title} className="rounded-2xl border border-stone-200 bg-[#f5f3ed] p-5 dark:border-stone-800 dark:bg-stone-900/60"><span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-700 dark:bg-stone-800 dark:text-orange-300">{item.icon}</span><h3 className="text-sm font-extrabold text-stone-800 dark:text-white">{item.title}</h3><p className="mt-2 text-xs leading-5 text-stone-500 dark:text-stone-400">{item.desc}</p></div>)}
        </div>
      </section>

      <section className="ch-shell pb-16"><FAQ items={homeFAQs} /></section>
    </div>
  );
}
