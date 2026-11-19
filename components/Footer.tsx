'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const sections = [
    { title: 'Image tools', links: [{ name: 'JPG to PNG', href: '/tools/jpg-to-png' }, { name: 'PNG to JPG', href: '/tools/png-to-jpg' }, { name: 'WebP to JPG', href: '/tools/webp-to-jpg' }, { name: 'JPG to WebP', href: '/tools/jpg-to-webp' }, { name: 'Image Compressor', href: '/tools/image-compressor' }, { name: 'Image Resizer', href: '/tools/image-resizer' }] },
    { title: 'PDF & data', links: [{ name: 'PDF to JPG', href: '/tools/pdf-to-jpg' }, { name: 'JPG to PDF', href: '/tools/jpg-to-pdf' }, { name: 'JSON Formatter', href: '/tools/json-formatter' }, { name: 'JSON to CSV', href: '/tools/json-to-csv' }, { name: 'CSV to JSON', href: '/tools/csv-to-json' }] },
    { title: 'Text & utility', links: [{ name: 'Base64 Encoder', href: '/tools/base64-encoder' }, { name: 'Base64 Decoder', href: '/tools/base64-decoder' }, { name: 'URL Encoder', href: '/tools/url-encoder' }, { name: 'URL Decoder', href: '/tools/url-decoder' }, { name: 'Unit Converter', href: '/tools/unit-converter' }] },
    { title: 'ConvertHub', links: [{ name: 'All tools', href: '/tools' }, { name: 'About us', href: '/about' }, { name: 'Privacy policy', href: '/privacy' }, { name: 'Terms of use', href: '/terms' }, { name: 'Contact support', href: '/contact' }] },
  ];

  return (
    <footer id="footer" className="mt-20 border-t border-stone-200 bg-[#f5f3ed] dark:border-stone-800 dark:bg-stone-950">
      <div className="ch-shell py-12 md:py-14">
        <div className="mb-10 flex flex-col gap-5 border-b border-stone-200 pb-9 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-orange-500 text-lg font-black text-white">C</span>
            <span className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">ConvertHub</span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">Simple tools for everyday files. Private by design, with processing that stays in your browser.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[.1em] text-stone-800 dark:text-stone-200">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link id={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`} href={link.href} className="text-[13px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-300">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-stone-200 pt-6 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
          <span>© {currentYear} ConvertHub. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">Made for simple, private file workflows <ArrowUpRight className="h-3 w-3" /></span>
        </div>
      </div>
    </footer>
  );
}
