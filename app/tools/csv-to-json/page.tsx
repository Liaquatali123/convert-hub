'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { FileSpreadsheet, Database, Download, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvInput(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleConvert = () => {
    if (!csvInput.trim()) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    Papa.parse(csvInput.trim(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Converts numbers and booleans automatically!
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          setError(`Parsing warnings: ${results.errors.map(e => e.message).join(', ')}`);
        }

        const formattedJson = JSON.stringify(results.data, null, 2);
        setJsonOutput(formattedJson);
        setSuccess(true);
        setIsProcessing(false);
      },
      error: (err: any) => {
        setError(err.message || 'Failed to parse CSV string.');
        setJsonOutput('');
        setIsProcessing(false);
      }
    });
  };

  const handleDownload = () => {
    if (jsonOutput) {
      const blob = new Blob([jsonOutput], { type: 'application/json;charset=utf-8' });
      saveAs(blob, 'converted.json');
    }
  };

  const handleClear = () => {
    setCsvInput('');
    setJsonOutput('');
    setError(null);
    setSuccess(false);
  };

  const loadSample = () => {
    const sample = `id,name,email,role,salary,active
1,Alice Johnson,alice@example.com,Software Architect,120000,true
2,Bob Smith,bob@example.com,Lead Designer,95000,true
3,Charlie Davis,charlie@example.com,Specialist,80000,false`;
    setCsvInput(sample);
    setJsonOutput('');
    setError(null);
    setSuccess(false);
  };

  const toolFAQs = [
    {
      question: 'What is dynamic type casting?',
      answer: 'Our converter leverages the dynamic typing capability of Papa Parse. It detects whether a column value is a number (e.g., 120000) or a boolean (e.g., true/false) and automatically casts them to numeric or boolean JSON values instead of storing them as raw strings. This creates high-quality API-ready data.'
    },
    {
      question: 'Does the CSV need to have a header row?',
      answer: 'Yes. Our parser uses the very first row of the CSV file to automatically identify the keys/fields for the resulting JSON objects.'
    },
    {
      question: 'What happens to empty cells?',
      answer: 'Empty cells in columns are automatically skipped or mapped as null/undefined values in the parsed JSON block, ensuring a lightweight and compact structure.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="CSV to JSON Converter"
        description="Convert spreadsheet files and raw CSV rows into beautiful, structured JSON arrays. Supports auto-typing."
        categoryName="Data Tools"
        categoryHref="/tools?category=data"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="lg:col-span-9 space-y-6">
          
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-6">
            <FileDropzone
              accept=".csv,.txt"
              onFileSelect={handleFileSelect}
              descriptionText="Upload a .csv file, or paste your spreadsheet rows below"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Input CSV Strings</span>
              <button
                id="csv-to-json-sample-btn"
                onClick={loadSample}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Load Sample Data
              </button>
            </div>

            <textarea
              id="csv-to-json-input"
              value={csvInput}
              onChange={(e) => {
                setCsvInput(e.target.value);
                setError(null);
                setSuccess(false);
              }}
              placeholder="id,name,role&#10;1,Alice,Architect&#10;2,Bob,Designer"
              className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
            />

            <div className="flex gap-3">
              <button
                id="csv-to-json-convert-btn"
                onClick={handleConvert}
                disabled={isProcessing || !csvInput.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Transcribing to JSON Array...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    Convert CSV to JSON
                  </>
                )}
              </button>

              <button
                id="csv-to-json-clear-btn"
                onClick={handleClear}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
              >
                Clear
              </button>
            </div>

            {error && (
              <div id="csv-to-json-error-alert" className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Conversion Alert:</span> {error}
                </div>
              </div>
            )}

            {success && jsonOutput && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  Successfully converted CSV rows to JSON array!
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">JSON Output Preview</span>
                    <button
                      id="csv-to-json-download-btn"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download JSON File
                    </button>
                  </div>
                  <textarea
                    id="csv-to-json-output-preview"
                    readOnly
                    value={jsonOutput}
                    className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
                  />
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
                <span>CSV Library</span>
                <span className="font-bold text-gray-950 dark:text-white">Papa Parse</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Dynamic Typing</span>
                <span className="font-bold text-gray-950 dark:text-white">Enabled (Numbers/Booleans)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Output Schema</span>
                <span className="font-bold text-gray-950 dark:text-white">Array of Objects</span>
              </li>
              <li className="flex justify-between">
                <span>Security Sandbox</span>
                <span className="font-bold text-gray-950 dark:text-white">100% Local</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
