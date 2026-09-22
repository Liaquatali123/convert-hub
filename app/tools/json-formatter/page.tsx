'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { FileCode, Play, Trash2, Copy, Check, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setError(null);
    setSuccess(null);

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setSuccess('JSON formatted and validated successfully!');
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax detected.');
      setOutput('');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setError(null);
    setSuccess(null);

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setSuccess('JSON minified successfully!');
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax detected.');
      setOutput('');
    }
  };

  const handleValidate = () => {
    if (!input.trim()) return;
    setError(null);
    setSuccess(null);

    try {
      JSON.parse(input);
      setSuccess('Valid JSON structure! No syntax errors detected.');
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax detected.');
    }
  };

  const handleCopy = () => {
    const textToCopy = output || input;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToSave = output || input;
    if (!textToSave) return;

    const blob = new Blob([textToSave], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'formatted.json');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setSuccess(null);
  };

  const handleSample = () => {
    const sample = {
      name: "ConvertHub",
      type: "Online Toolset",
      private: true,
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      tools_available: 16,
      meta: {
        serverless: true,
        license: "MIT"
      }
    };
    setInput(JSON.stringify(sample, null, 2));
    setOutput('');
    setError(null);
    setSuccess(null);
  };

  const toolFAQs = [
    {
      question: 'How are syntax errors identified?',
      answer: 'Our tool parses the text utilizing the modern in-browser standard JSON engine. If there is a missing comma, unclosed bracket, or invalid double quotes, the engine catches the position and renders a highly detailed description of where and why the parsing failed.'
    },
    {
      question: 'What is the difference between formatting and minifying?',
      answer: 'Formatting adds double-spaces, indentations, and line breaks to make highly complex JSON files human-readable. Minification strips out all spaces, tabs, and line breaks, compressing the string into a single line to minimize file size.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. The JSON validation and formatting execute entirely locally in your browser memory. None of your data, keys, or logs are uploaded.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="JSON Formatter & Validator"
        description="Validate, format, beautify, and minify raw JSON string structures offline instantly."
        categoryName="Data Tools"
        categoryHref="/tools?category=data"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-gray-150 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="json-format-btn"
                onClick={handleFormat}
                disabled={!input.trim()}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                Beautify / Format
              </button>

              <button
                id="json-minify-btn"
                onClick={handleMinify}
                disabled={!input.trim()}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-600 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all disabled:opacity-40"
              >
                Minify JSON
              </button>

              <button
                id="json-validate-btn"
                onClick={handleValidate}
                disabled={!input.trim()}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-emerald-600 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all disabled:opacity-40"
              >
                Validate Syntax
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="json-sample-btn"
                onClick={handleSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
              >
                Load Sample
              </button>
              
              <button
                id="json-clear-btn"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-gray-400 hover:text-red-500 text-xs font-semibold transition-colors"
                title="Clear Editors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Editor Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Editor */}
            <div className="flex flex-col">
              <label htmlFor="json-raw-input" className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Raw JSON Input</label>
              <textarea
                id="json-raw-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                  setSuccess(null);
                }}
                placeholder="Paste your raw JSON string here..."
                className="w-full h-96 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none text-sm font-mono leading-relaxed resize-none shadow-sm"
              />
            </div>

            {/* Output Panel */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Formatted Output</span>
                {output && (
                  <div className="flex items-center gap-1.5">
                    <button
                      id="json-copy-btn"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      id="json-download-btn"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              <textarea
                id="json-formatted-output"
                readOnly
                value={output}
                placeholder="Formatted JSON will render here..."
                className="w-full h-96 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white focus:outline-none text-sm font-mono leading-relaxed resize-none shadow-sm"
              />
            </div>
          </div>

          {/* Syntax alerts */}
          {error && (
            <div id="json-alert-error" className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs md:text-sm font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block mb-1">JSON Syntax Error</span>
                <span className="font-mono">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div id="json-alert-success" className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs md:text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block mb-1">Validation Success</span>
                {success}
              </div>
            </div>
          )}

          <FAQ items={toolFAQs} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-950/20 p-5 rounded-2xl border border-gray-150 dark:border-gray-900 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Format Specifications
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Standard schema</span>
                <span className="font-bold text-gray-950 dark:text-white">ECMA-404</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Indentation depth</span>
                <span className="font-bold text-gray-950 dark:text-white">2 Spaces</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Validation engine</span>
                <span className="font-bold text-gray-950 dark:text-white">Native Browser V8</span>
              </li>
              <li className="flex justify-between">
                <span>Privacy execution</span>
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
