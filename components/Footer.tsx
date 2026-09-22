'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Image Tools',
      links: [
        { name: 'JPG to PNG', href: '/tools/jpg-to-png' },
        { name: 'PNG to JPG', href: '/tools/png-to-jpg' },
        { name: 'WebP to JPG', href: '/tools/webp-to-jpg' },
        { name: 'JPG to WebP', href: '/tools/jpg-to-webp' },
        { name: 'Image Compressor', href: '/tools/image-compressor' },
        { name: 'Image Resizer', href: '/tools/image-resizer' },
      ],
    },
    {
      title: 'PDF & Data',
      links: [
        { name: 'PDF to JPG', href: '/tools/pdf-to-jpg' },
        { name: 'JPG to PDF', href: '/tools/jpg-to-pdf' },
        { name: 'JSON Formatter', href: '/tools/json-formatter' },
        { name: 'JSON to CSV', href: '/tools/json-to-csv' },
        { name: 'CSV to JSON', href: '/tools/csv-to-json' },
      ],
    },
    {
      title: 'Text & Utility',
      links: [
        { name: 'Base64 Encoder', href: '/tools/base64-encoder' },
        { name: 'Base64 Decoder', href: '/tools/base64-decoder' },
        { name: 'URL Encoder', href: '/tools/url-encoder' },
        { name: 'URL Decoder', href: '/tools/url-decoder' },
        { name: 'Unit Converter', href: '/tools/unit-converter' },
      ],
    },
    {
      title: 'ConvertHub',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Use', href: '/terms' },
        { name: 'Contact Support', href: '/contact' },
      ],
    },
  ];

  return (
    <footer id="footer" className="bg-gray-50 dark:bg-gray-950 border-t border-gray-150 dark:border-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      id={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              C
            </span>
            <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
              Convert<span className="text-indigo-600">Hub</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            &copy; {currentYear} ConvertHub. All tools process your files directly in your browser. Your files never touch our servers.
          </p>
        </div>
      </div>
    </footer>
  );
}
