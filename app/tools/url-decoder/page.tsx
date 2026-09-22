'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Link2, Copy, Check, Download, Trash2, AlertTriangle, Settings } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function UrlDecoderPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'component' | 'full'>('component');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = (val: string, currentMode = mode) => {
    setInput(val);
    setError(null);
    setOutput('');

    if (!val) return;

    try {
      if (currentMode === 'component') {
        setOutput(decodeURIComponent(val));
      } else {
        setOutput(decodeURI(val));
      }
    } catch (err) {
      setError('Malformed URI sequence. Please make sure percent (%) encodes are followed by 2 hexadecimal digits.');
    }
  };

  const handleModeChange = (newMode: 'component' | 'full') => {
    setMode(newMode);
    handleDecode(input, newMode);
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
    saveAs(blob, 'decoded-url.txt');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const loadSample = () => {
    const sample = 'https%3A%2F%2Fconvert-hub.com%2Fsearch%3Fquery%3Dimages%20%26%20pdfs%26status%3Dactive';
    setInput(sample);
    handleDecode(sample, mode);
  };

  const toolFAQs = [
    {
      question: 'What is URL Decoding?',
      answer: 'URL decoding replaces hexadecimal percent sequences (e.g. `%20`) in a URL query string with their corresponding standard ASCII characters (e.g. a literal space).'
    },
    {
      question: 'Why does my decoding query throw an error?',
      answer: 'URL percent-encodings require exactly two hexadecimal characters after every `%` symbol. If the string terminates early or contains invalid non-hex characters like `%G1`, the V8 engine fails parsing and triggers a warning.'
    },
    {
      question: 'Which decode mode should I use?',
      answer: 'Use Decode Component (decodeURIComponent) to decode fully escaped URL parts including nested protocols. Use Decode Full URL (decodeURI) if you only want to turn spaces or special foreign scripts back to readable strings without impacting protocol links.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="URL Decoder"
        description="Decode percent-encoded paths or parameters back into readable, plain URL strings."
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
                <label htmlFor="url-decoder-input" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Percent-Encoded URL String</label>
                <button
                  id="url-decoder-sample-btn"
                  onClick={loadSample}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Load Sample
                </button>
              </div>
              <textarea
                id="url-decoder-input"
                value={input}
                onChange={(e) => handleDecode(e.target.value)}
                placeholder="Paste percent-encoded URL values here..."
                className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none text-sm resize-none shadow-sm"
              />
            </div>

            {/* Parameter Settings */}
            <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/10 space-y-3">
              <div className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-500" />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Decoding Parameters</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 cursor-pointer select-none">
                  <input
                    id="url-decoder-mode-component"
                    type="radio"
                    name="url-mode"
                    checked={mode === 'component'}
                    onChange={() => handleModeChange('component')}
                    className="mt-1 accent-indigo-600"
                  />
                  <div>
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">Decode Component (Recommended)</span>
                    <span className="block text-xs text-gray-400">Decodes all codes including : / ? = &. Essential for nested path strings.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 cursor-pointer select-none">
                  <input
                    id="url-decoder-mode-full"
                    type="radio"
                    name="url-mode"
                    checked={mode === 'full'}
                    onChange={() => handleModeChange('full')}
                    className="mt-1 accent-indigo-600"
                  />
                  <div>
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">Decode Full URL</span>
                    <span className="block text-xs text-gray-400">Maintains structural character delimiters. Decodes spaces or special glyphs.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Clear Trigger */}
            {(input || output || error) && (
              <div className="flex justify-end">
                <button
                  id="url-decoder-clear-btn"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-950 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Fields
                </button>
              </div>
            )}

            {/* Decoded Output */}
            {!error && output && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="url-decoder-output" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Decoded URL / Text Output</label>
                  <div className="flex items-center gap-2">
                    <button
                      id="url-decoder-copy-btn"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy String'}
                    </button>
                    <button
                      id="url-decoder-download-btn"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .TXT
                    </button>
                  </div>
                </div>
                <textarea
                  id="url-decoder-output"
                  readOnly
                  value={output}
                  className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
                />
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <div id="url-decoder-error-alert" className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Decoding Error:</span> {error}
                </div>
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
                <span>Safe Decodes</span>
                <span className="font-bold text-gray-950 dark:text-white">Yes (With validation)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Input standard</span>
                <span className="font-bold text-gray-950 dark:text-white">Percent Escaped</span>
              </li>
              <li className="flex justify-between">
                <span>Execution context</span>
                <span className="font-bold text-gray-950 dark:text-white">100% Client-Side</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
