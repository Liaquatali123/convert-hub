'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, Search, FileText, Sparkles, Database, Image, Binary, ChevronRight, ArrowUpRight } from 'lucide-react';
import { TOOLS, Tool } from '@/lib/tools';
import ThemeToggle from './ThemeToggle';

const categoryIconMap: Record<string, React.ReactNode> = {
  image: <Image className="h-4 w-4 text-orange-600" />,
  pdf: <FileText className="h-4 w-4 text-rose-600" />,
  data: <Database className="h-4 w-4 text-blue-600" />,
  text: <Binary className="h-4 w-4 text-violet-600" />,
  utility: <Sparkles className="h-4 w-4 text-amber-600" />,
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowSearchDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchQuery('');
    setShowSearchDropdown(false);
  }, [pathname, searchParams]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(q)) ||
      tool.category.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
    setShowSearchDropdown(true);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All tools', href: '/tools' },
    { name: 'Images', href: '/tools?category=image' },
    { name: 'PDF', href: '/tools?category=pdf' },
    { name: 'Data', href: '/tools?category=data' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/tools') return pathname === '/tools' && !searchParams.get('category');
    if (href.includes('?')) return pathname === '/tools' && searchParams.get('category') === href.split('=')[1];
    return pathname === href;
  };

  const searchBox = (mobile = false) => (
    <div className={`relative ${mobile ? 'w-full' : 'w-[220px] xl:w-[250px]'}`} ref={mobile ? undefined : dropdownRef}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          id={mobile ? 'mobile-search-input' : 'nav-search-input'}
          type="search"
          placeholder="Find a tool..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
          className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 text-sm text-stone-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:ring-orange-950"
        />
      </div>
      {showSearchDropdown && searchQuery.trim() && !mobile && (
        <div id="search-dropdown-overlay" className="absolute right-0 top-12 z-50 max-h-96 w-[340px] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-2 shadow-[0_20px_60px_rgba(38,37,31,.14)] dark:border-stone-700 dark:bg-stone-900">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.12em] text-stone-400">{searchResults.length} matching tools</div>
          {searchResults.length ? searchResults.map((tool) => (
            <button key={tool.id} onClick={() => { router.push(tool.route); setShowSearchDropdown(false); setSearchQuery(''); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-orange-50 dark:hover:bg-stone-800">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/40">{categoryIconMap[tool.category]}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-stone-800 dark:text-white">{tool.name}</span><span className="block truncate text-xs text-stone-400">{tool.description}</span></span>
              <ChevronRight className="h-4 w-4 text-stone-400" />
            </button>
          )) : <p className="px-3 py-5 text-center text-sm text-stone-500">No matching tools. Try another keyword.</p>}
        </div>
      )}
    </div>
  );

  return (
    <nav id="main-navigation" className="sticky top-0 z-50 w-full border-b border-stone-200/90 bg-[#fbfaf7]/95 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/95">
      <div className="ch-shell">
        <div className="flex h-[70px] items-center justify-between gap-4">
          <Link id="logo-link" href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-orange-500 text-lg font-black text-white shadow-sm shadow-orange-200">C</span>
            <span className="text-[19px] font-extrabold tracking-[-.05em] text-stone-900 dark:text-white">ConvertHub<span className="text-orange-600">.</span></span>
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.name} id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`} href={link.href} className={`rounded-xl px-3.5 py-2 text-[13px] font-semibold ${isActive(link.href) ? 'bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300' : 'text-stone-500 hover:bg-white hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white'}`}>
                {link.name}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <div className="hidden xl:block">{searchBox()}</div>
            <ThemeToggle />
            <Link href="/tools" className="hidden items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600 sm:inline-flex dark:bg-orange-500 dark:hover:bg-orange-400">Explore tools <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button id="mobile-menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="border-t border-stone-200 bg-[#fbfaf7] px-4 pb-5 pt-4 md:hidden dark:border-stone-800 dark:bg-stone-950">
          <div className="mb-4">{searchBox(true)}</div>
          {searchQuery.trim() && (
            <div className="mb-3 max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1 dark:border-stone-700 dark:bg-stone-900">
              {searchResults.map((tool) => <button key={tool.id} onClick={() => { router.push(tool.route); setMobileMenuOpen(false); setSearchQuery(''); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-stone-700 hover:bg-orange-50 dark:text-stone-200 dark:hover:bg-stone-800">{categoryIconMap[tool.category]}{tool.name}</button>)}
              {!searchResults.length && <p className="p-3 text-center text-xs text-stone-500">No matching tools.</p>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => <Link key={link.name} href={link.href} className={`rounded-xl px-3 py-3 text-sm font-semibold ${isActive(link.href) ? 'bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300' : 'bg-white text-stone-600 dark:bg-stone-900 dark:text-stone-300'}`}>{link.name}</Link>)}
            <Link href="/about" className="rounded-xl bg-white px-3 py-3 text-sm font-semibold text-stone-600 dark:bg-stone-900 dark:text-stone-300">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
