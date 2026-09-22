'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, FileText, Sparkles, Database, Image, Binary, ChevronRight } from 'lucide-react';
import { TOOLS, Tool } from '@/lib/tools';
import ThemeToggle from './ThemeToggle';

const categoryIconMap: Record<string, React.ReactNode> = {
  image: <Image className="w-4 h-4 text-emerald-500" />,
  pdf: <FileText className="w-4 h-4 text-red-500" />,
  data: <Database className="w-4 h-4 text-blue-500" />,
  text: <Binary className="w-4 h-4 text-purple-500" />,
  utility: <Sparkles className="w-4 h-4 text-amber-500" />
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setSearchQuery('');
      setShowSearchDropdown(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle Search Input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const filtered = TOOLS.filter(tool => {
      const q = query.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q)) ||
        tool.category.toLowerCase().includes(q)
      );
    });

    setSearchResults(filtered);
    setShowSearchDropdown(true);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Tools', href: '/tools' },
    { name: 'Image', href: '/tools?category=image' },
    { name: 'PDF', href: '/tools?category=pdf' },
    { name: 'Data', href: '/tools?category=data' },
    { name: 'Text', href: '/tools?category=text' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav id="main-navigation" className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-950/95 border-b border-gray-150 dark:border-gray-900 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link id="logo-link" href="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
                C
              </span>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                Convert<span className="text-indigo-600">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.includes('?') && pathname === '/tools' && typeof window !== 'undefined' && window.location.search === link.href.split('?')[1]);
              return (
                <Link
                  id={`nav-link-${link.name.toLowerCase()}`}
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-950 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Controls: Live Search + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-sm justify-end">
            <div className="relative w-full max-w-[240px] xl:max-w-[280px]" ref={dropdownRef}>
              <div className="relative">
                <input
                  id="nav-search-input"
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() !== '' && setShowSearchDropdown(true)}
                  className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-gray-50 hover:bg-gray-100/70 focus:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/70 dark:focus:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 dark:text-white"
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Dropdown Results Overlay */}
              {showSearchDropdown && (
                <div id="search-dropdown-overlay" className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50">
                  <div className="p-2 border-b border-gray-100 dark:border-gray-900 text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                    Found {searchResults.length} Tools
                  </div>
                  <div className="p-1 divide-y divide-gray-50 dark:divide-gray-900">
                    {searchResults.length > 0 ? (
                      searchResults.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            router.push(tool.route);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-3 transition-colors group"
                        >
                          <div className="p-1.5 bg-gray-50 dark:bg-gray-900 group-hover:bg-white dark:group-hover:bg-gray-950 rounded-md border border-gray-100 dark:border-gray-800 transition-colors">
                            {categoryIconMap[tool.category]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {tool.description}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No tools found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
          </div>

          {/* Mobile hamburger menu button and Theme Toggle for smaller screens */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none"
              aria-label="Open primary navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 px-4 pt-2 pb-6 space-y-3">
          {/* Search bar inside mobile drawer */}
          <div className="relative my-2">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-gray-50 focus:bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-indigo-500 focus:outline-none text-gray-900 dark:text-white"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />

            {/* Mobile Search Results list */}
            {searchQuery.trim() !== '' && (
              <div className="mt-2 max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
                {searchResults.length > 0 ? (
                  searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        router.push(tool.route);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-950 dark:text-white truncate">
                          {tool.name}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                id={`mobile-nav-link-${link.name.toLowerCase()}`}
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-950 dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
