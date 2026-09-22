'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Binary, Copy, Check, Download, Trash2, FileUp, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function Base64DecoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Smart file decoding state
  const [detectedMime, setDetectedMime] = useState<string | null>(null);
  const [isDataUrl, setIsDataUrl] = useState(false);

  const handleDecode = (val: string) => {
    setInput(val);
    setError(null);
    setOutput('');
    setDetectedMime(null);
    setIsDataUrl(false);

    const trimmed = val.trim();
    if (!trimmed) return;

    try {
      // 1. Check if it's a Data URL
      if (trimmed.startsWith('data:')) {
        setIsDataUrl(true);
        const match = trimmed.match(/^data:([^;]+);base64,/);
        if (match) {
          setDetectedMime(match[1]);
        }
        
        // Extract raw base64 part and try standard text decode
        const base64Part = trimmed.split(',')[1] || '';
        const decodedBytes = atob(base64Part);
        // Try UTF8 safe string conversion
        const utf8String = decodeURIComponent(
          escape(decodedBytes)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        setOutput(utf8String);
        return;
      }

      // 2. Otherwise process as direct Base64 string
      // Clean possible spacing noise from base64 string
      const sanitizedBase64 = trimmed.replace(/\s/g, '');
      const decodedBytes = atob(sanitizedBase64);
      
      // Unicode-safe binary-to-string decoding
      const utf8String = decodeURIComponent(
        escape(decodedBytes)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      setOutput(utf8String);
    } catch (err: any) {
      // If Unicode conversion fails, fall back to simple binary string
      try {
        const sanitizedBase64 = trimmed.replace(/\s/g, '');
        setOutput(atob(sanitizedBase64));
      } catch (innerErr) {
        setError('Invalid Base64 string format. Please ensure the character sequence and padding are valid.');
        setOutput('');
      }
    }
  };

  const handleDownloadFile = () => {
    if (!input.trim()) return;
    try {
      let base64Data = input.trim();
      let mimeType = detectedMime || 'application/octet-stream';

      if (isDataUrl) {
        base64Data = base64Data.split(',')[1] || '';
      }

      // Decode Base64 string to bytes
      const sliceSize = 512;
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType });
      
      // Map common mime types to friendly extensions
      const extMap: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'text/html': 'html',
        'application/json': 'json',
        'application/zip': 'zip'
      };
      
      const ext = extMap[mimeType] || 'bin';
      saveAs(blob, `decoded-file.${ext}`);
    } catch (err) {
      setError('Failed to extract file contents from Base64 stream.');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setDetectedMime(null);
    setIsDataUrl(false);
    setError(null);
  };

  const loadSample = () => {
    // Unicode safe Base64 string representing "ConvertHub is 100% private! 🚀"
    const sample = "Q29udmVydEh1YiBpcyAxMDAlIHByaXZhdGUhIPCfmY8=";
    handleDecode(sample);
  };

  const toolFAQs = [
    {
      question: 'Why does my Base64 string fail to decode?',
      answer: 'Base64 strings must adhere to specific formatting rules: characters must only belong to the A-Z, a-z, 0-9, +, /, and = padding sets. Whitespaces, linebreaks, or non-compliant characters will trigger parsing alerts.'
    },
    {
      question: 'How are binary files downloaded?',
      answer: 'If the input represents a complete base64 file data-stream, our tool slices the base64 characters back into raw integer arrays (Uint8Arrays) and saves them as native files matching the detected MIME headers.'
    },
    {
      question: 'Is there a limit on input string sizes?',
      answer: 'Our decoder handles very large strings (up to several megabytes) efficiently in-memory, but extremely large data URLs can consume browser resources during full byte conversions.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="Base64 Decoder"
        description="Decode Base64 ASCII sequences back into readable UTF-8 text strings or binary files."
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
                <label htmlFor="base64-decoder-input" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Base64 String to Decode</label>
                <button
                  id="base64-decoder-sample-btn"
                  onClick={loadSample}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Load Sample
                </button>
              </div>
              <textarea
                id="base64-decoder-input"
                value={input}
                onChange={(e) => handleDecode(e.target.value)}
                placeholder="Paste your Base64 encoded character stream here..."
                className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
              />
            </div>

            {/* Smart MIME Type Detection Alert */}
            {(isDataUrl || detectedMime) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800 dark:text-indigo-400">
                  <Binary className="w-5 h-5 text-indigo-500" />
                  <span>
                    Detected File Payload: <strong className="font-bold text-indigo-950 dark:text-white font-mono">{detectedMime || 'Binary Type'}</strong>
                  </span>
                </div>
                <button
                  id="base64-download-binary-btn"
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Decoded File
                </button>
              </div>
            )}

            {/* Clear Trigger */}
            {(input || output) && (
              <div className="flex justify-end pt-2">
                <button
                  id="base64-decoder-clear-btn"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-950 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Fields
                </button>
              </div>
            )}

            {/* Decoded UTF-8 Text Output */}
            {!error && output && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="base64-decoder-output" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Decoded Text Output</label>
                  <button
                    id="base64-decoder-copy-btn"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                </div>
                <textarea
                  id="base64-decoder-output"
                  readOnly
                  value={output}
                  className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
                />
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <div id="base64-decoder-error-alert" className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold">
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
                <span className="font-bold text-gray-950 dark:text-white">Base64 (RFC 4648)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Unicode decoding</span>
                <span className="font-bold text-gray-950 dark:text-white">Supported (UTF-8)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Binary decoding</span>
                <span className="font-bold text-gray-950 dark:text-white">Supported (Via Blob)</span>
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
