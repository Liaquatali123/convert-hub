'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Link2, Copy, Check, Download, Trash2, Settings } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'component' | 'full'>('component');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = (val: string, currentMode = mode) => {
    setInput(val);
    if (!val) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'component') {
        setOutput(encodeURIComponent(val));
      } else {
        setOutput(encodeURI(val));
      }
    } catch (err) {
      setOutput('Failed to encode the URL string.');
    }
  };

  const handleModeChange = (newMode: 'component' | 'full') => {
    setMode(newMode);
    handleEncode(input, newMode);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'encoded-url.txt');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const loadSample = () => {
    const sample = 'https://convert-hub.com/search?query=images & pdfs&status=active';
    setInput(sample);
    handleEncode(sample, mode);
  };

  const toolFAQs = [
    {
      question: 'What is URL Percent-Encoding?',
      answer: 'URL encoding converts disallowed characters (such as spaces or symbols) into a `%` character followed by two hexadecimal digits. URLs can only contain a limited set of ASCII characters; other characters must be formatted for safe server parsing.'
    },
    {
      question: 'What is the difference between "Encode Component" and "Encode Full URL"?',
      answer: 'Encode Component (encodeURIComponent) encodes all non-standard characters, including structural delimiters like `:`, `/`, `?`, `&`, and `=`. This is essential for query parameters. Encode Full URL (encodeURI) leaves these structural characters intact, encoding only characters like spaces or high-unicode symbols.'
    },
    {
      question: 'Is this conversion processed remotely?',
      answer: 'No. The conversion executes in real-time on your computer using standard, fast JavaScript execution layers. None of your URL query strings are uploaded or saved.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="URL Encoder"
        description="Encode query arguments, path parameters, or entire URL strings safely with standard percent-encoding."
        categoryName="String Utilities"
        categoryHref="/tools?category=developer"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-6">
            
            {/* Input Form */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="url-encoder-input" className="text-xs font-bold text-gray-400 uppercase tracking-wide">URL or Text to Percent-Encode</label>
                <button
                  id="url-encoder-sample-btn"
                  onClick={loadSample}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Load Sample
                </button>
              </div>
              <textarea
                id="url-encoder-input"
                value={input}
                onChange={(e) => handleEncode(e.target.value)}
                placeholder="Paste your link or parameter values here..."
                className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none text-sm resize-none shadow-sm"
              />
            </div>

            {/* Encoding Modes Options */}
            <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/10 space-y-3">
              <div className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-500" />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Encoding Parameters</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 cursor-pointer select-none">
                  <input
                    id="url-encoder-mode-component"
                    type="radio"
                    name="url-mode"
                    checked={mode === 'component'}
                    onChange={() => handleModeChange('component')}
                    className="mt-1 accent-indigo-600"
                  />
                  <div>
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">Encode Component (Recommended)</span>
                    <span className="block text-xs text-gray-400">Encodes all symbols including : / ? = &. Safe for single query parameter values.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 cursor-pointer select-none">
                  <input
                    id="url-encoder-mode-full"
                    type="radio"
                    name="url-mode"
                    checked={mode === 'full'}
                    onChange={() => handleModeChange('full')}
                    className="mt-1 accent-indigo-600"
                  />
                  <div>
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">Encode Full URL</span>
                    <span className="block text-xs text-gray-400">Preserves : / ? = & protocols. Safe for whole URLs containing parameters.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Clear Trigger */}
            {(input || output) && (
              <div className="flex justify-end">
                <button
                  id="url-encoder-clear-btn"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-950 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Fields
                </button>
              </div>
            )}

            {/* Encoded Output Area */}
            {output && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="url-encoder-output" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Percent-Encoded Output</label>
                  <div className="flex items-center gap-2">
                    <button
                      id="url-encoder-copy-btn"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy String'}
                    </button>
                    <button
                      id="url-encoder-download-btn"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .TXT
                    </button>
                  </div>
                </div>
                <textarea
                  id="url-encoder-output"
                  readOnly
                  value={output}
                  className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
                />
              </div>
            )}
          </div>

          <FAQ items={toolFAQs} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-950/20 p-5 rounded-2xl border border-gray-150 dark:border-gray-900 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Tool Specifications
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Standard schema</span>
                <span className="font-bold text-gray-950 dark:text-white">RFC 3986</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Charset</span>
                <span className="font-bold text-gray-950 dark:text-white">UTF-8 / Percent</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Delimiter safety</span>
                <span className="font-bold text-gray-950 dark:text-white">Adjustable Modes</span>
              </li>
              <li className="flex justify-between">
                <span>Execution context</span>
                <span className="font-bold text-gray-950 dark:text-white">100% Secure Client</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
