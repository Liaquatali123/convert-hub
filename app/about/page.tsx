'use client';

import React from 'react';
import { Shield, Zap, RefreshCw, Cpu } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          About ConvertHub
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          We build lightweight, secure, and lightning-fast client-side file and data conversion tools.
        </p>
      </div>

      <div className="prose prose-indigo dark:prose-invert max-w-none text-sm md:text-base text-gray-600 dark:text-gray-400 space-y-6">
        <p>
          At <strong>ConvertHub</strong>, we believe file conversion shouldn't require compromising your personal privacy or waiting on slow upload speeds. Traditional online file converters force you to upload your sensitive spreadsheets, confidential PDFs, and private photos to their cloud servers, exposing you to potential security breaches.
        </p>

        <p>
          ConvertHub is designed from the ground up to solve this problem by executing all file parsing, compression, resizing, and data rendering <strong>locally in your web browser</strong>. By leveraging modern client-side APIs (such as HTML5 Canvas, WebAssembly, FileReader, and browser libraries like pdf-lib, browser-image-compression, and Papa Parse), we process your files entirely on your local CPU.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          Core Tenets of Our Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white">Absolute Privacy</h3>
            </div>
            <p className="text-sm">
              Your files never touch our servers. No database logs, no accidental cloud storage backups, and no leakage of personal files.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white">Zero Wait Time</h3>
            </div>
            <p className="text-sm">
              Conversions are near-instant because you don't spend time uploading files to the cloud or waiting in lines for server execution.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white">100% Free</h3>
            </div>
            <p className="text-sm">
              No subscription popups, no capped file lists, no watermarks, and no sign-up gates. Everything is fully featured and unrestricted.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white">Robust Technologies</h3>
            </div>
            <p className="text-sm">
              Powered by high-performance client libraries including jszip, Papa Parse, browser-image-compression, and pdf-lib for flawless quality.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
          Open Source and Independent
        </h2>
        <p>
          ConvertHub is designed to remain simple and accessible. We support our ongoing design and developmental costs via unobtrusive Google AdSense ad placeholders that are explicitly marked and never overlap with your conversion buttons. Thank you for choosing ConvertHub!
        </p>
      </div>
    </div>
  );
}
