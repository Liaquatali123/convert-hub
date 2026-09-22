'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Binary, Copy, Check, Download, Trash2, FileUp, ShieldCheck } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function Base64EncoderPage() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEncodeText = (inputVal: string) => {
    setText(inputVal);
    setFileName(null);
    setFileSize(null);
    setError(null);

    if (!inputVal) {
      setOutput('');
      return;
    }

    try {
      // Standard Unicode-safe Base64 encoding in-browser
      const utf8Bytes = encodeURIComponent(inputVal).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      });
      setOutput(btoa(utf8Bytes));
    } catch (err) {
      setError('Failed to encode the provided text stream.');
      setOutput('');
    }
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setText('');
    setFileName(file.name);
    setFileSize(file.size);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOutput(dataUrl);
    };
    reader.onerror = () => {
      setError('Failed to read binary stream from file.');
      setOutput('');
    };
    reader.readAsDataURL(file);
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
    const name = fileName ? `${fileName.split('.').slice(0, -1).join('.')}-base64.txt` : 'encoded-base64.txt';
    saveAs(blob, name);
  };

  const handleClear = () => {
    setText('');
    setFileName(null);
    setFileSize(null);
    setOutput('');
    setError(null);
  };

  const toolFAQs = [
    {
      question: 'What is Base64 Encoding?',
      answer: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is widely used to embed images, credentials, or files directly into HTML, CSS, or JSON documents without corruption.'
    },
    {
      question: 'How is Unicode/UTF-8 handled?',
      answer: 'Standard browser-native functions (like btoa) crash or corrupt non-ASCII characters. Our encoder handles Unicode-safe escape sequences before encoding, guaranteeing text containing emojis or special alphabets is preserved perfectly.'
    },
    {
      question: 'What is a Base64 Data URL?',
      answer: 'When you upload a file, the output starts with a header prefix like `data:image/png;base64,...`. This format is a "Data URL" and can be pasted directly into an browser address bar or image `src` tag to render the file instantly.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="Base64 Encoder"
        description="Encode raw text or binary files into standard and Unicode-safe Base64 strings. 100% private."
        categoryName="String Utilities"
        categoryHref="/tools?category=developer"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-6">
            
            {/* Binary / File Upload Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Text Input Block */}
              <div className="space-y-2">
                <label htmlFor="base64-text-input" className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Option A: Paste Text to Encode
                </label>
                <textarea
                  id="base64-text-input"
                  value={text}
                  onChange={(e) => handleEncodeText(e.target.value)}
                  placeholder="Type or paste text strings here to encode..."
                  className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none text-sm resize-none shadow-sm"
                />
              </div>

              {/* File Upload Block */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Option B: Encode File to Data URL
                </span>
                <div className="h-48 flex flex-col justify-between">
                  <FileDropzone
                    accept="*/*"
                    onFileSelect={handleFileSelect}
                    descriptionText="Drop any file to encode into Base64 payload"
                  />
                </div>
              </div>
            </div>

            {/* File Info Alert */}
            {fileName && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Selected file: <strong>{fileName}</strong> ({(fileSize! / 1024).toFixed(1)} KB) • Encoded to Base64 Data URL</span>
              </div>
            )}

            {/* Clear Trigger */}
            {(text || output) && (
              <div className="flex justify-end pt-2">
                <button
                  id="base64-encoder-clear-btn"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-950 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Fields
                </button>
              </div>
            )}

            {/* Encoded Output Area */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="base64-output" className="text-xs font-bold text-gray-400 uppercase tracking-wide">Base64 Encoded Output</label>
                {output && (
                  <div className="flex items-center gap-2">
                    <button
                      id="base64-encoder-copy-btn"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      id="base64-encoder-download-btn"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .TXT
                    </button>
                  </div>
                )}
              </div>
              <textarea
                id="base64-output"
                readOnly
                value={output}
                placeholder="Base64 results will render here..."
                className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
              />
            </div>

            {error && (
              <p id="base64-encoder-error" className="text-sm text-red-600 font-semibold text-center">
                {error}
              </p>
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
                <span>Encoding format</span>
                <span className="font-bold text-gray-950 dark:text-white">Base64 (RFC 4648)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Unicode-safe</span>
                <span className="font-bold text-gray-950 dark:text-white">Yes (UTF-8 preservation)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Binary input</span>
                <span className="font-bold text-gray-950 dark:text-white">Supported (Data URL)</span>
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
