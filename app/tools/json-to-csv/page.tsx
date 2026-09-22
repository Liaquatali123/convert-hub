'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Database, FileSpreadsheet, Download, RefreshCw, CheckCircle, FileUp, AlertTriangle } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function JsonToCsvPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
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
      setJsonInput(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleConvert = () => {
    if (!jsonInput.trim()) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      let parsed = JSON.parse(jsonInput.trim());
      
      // If parsed is not an array, wrap it in an array to handle object structures
      if (!Array.isArray(parsed)) {
        if (typeof parsed === 'object' && parsed !== null) {
          parsed = [parsed];
        } else {
          throw new Error('JSON data must represent an array of objects or a single flat object.');
        }
      }

      // Ensure elements inside array are objects
      const isValid = parsed.every((item: any) => typeof item === 'object' && item !== null && !Array.isArray(item));
      if (!isValid) {
        throw new Error('All elements in the JSON array must be flat structures (objects). Nested lists are not directly supported by CSV headers.');
      }

      // Convert using Papa Parse
      const csv = Papa.unparse(parsed, {
        header: true,
        quotes: true // automatically encapsulate fields in quotes where needed
      });

      setCsvOutput(csv);
      setSuccess(true);
      setIsProcessing(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse JSON string. Ensure syntax is correct.');
      setCsvOutput('');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (csvOutput) {
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'converted.csv');
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setCsvOutput('');
    setError(null);
    setSuccess(false);
  };

  const loadSample = () => {
    const sample = [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Software Architect", city: "Seattle" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Lead Designer", city: "Austin" },
      { id: 3, name: "Charlie Davis", email: "charlie@example.com", role: "Product Specialist", city: "Boston" }
    ];
    setJsonInput(JSON.stringify(sample, null, 2));
    setCsvOutput('');
    setError(null);
    setSuccess(false);
  };

  const toolFAQs = [
    {
      question: 'What types of JSON structures are supported?',
      answer: 'This converter supports JSON Arrays of Objects (e.g. `[{"key": "val"}, {"key": "val"}]`) or a single flat Object (which becomes a single row in the spreadsheet). It works best with flat, relational objects.'
    },
    {
      question: 'How are nested objects handled?',
      answer: 'Papa Parse automatically serializes nested structures as string-escaped data in row cells. To ensure a clean spreadsheet output, we highly recommend flattening your JSON objects beforehand.'
    },
    {
      question: 'Are my data structures uploaded?',
      answer: 'No. The data mapping and string transformations are fully client-side. Your corporate data and datasets remain 100% private.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="JSON to CSV Converter"
        description="Convert structured JSON arrays or databases into clean, spreadsheet-compatible CSV sheets. 100% private."
        categoryName="Data Tools"
        categoryHref="/tools?category=data"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="lg:col-span-9 space-y-6">
          
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-6">
            <FileDropzone
              accept=".json,.txt"
              onFileSelect={handleFileSelect}
              descriptionText="Upload a .json file, or paste your structured array below"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Input JSON Array</span>
              <button
                id="json-to-csv-sample-btn"
                onClick={loadSample}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Load Sample Data
              </button>
            </div>

            <textarea
              id="json-to-csv-input"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError(null);
                setSuccess(false);
              }}
              placeholder='[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]'
              className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none text-sm font-mono resize-none shadow-sm"
            />

            <div className="flex gap-3">
              <button
                id="json-to-csv-convert-btn"
                onClick={handleConvert}
                disabled={isProcessing || !jsonInput.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Transcribing to CSV Rows...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-5 h-5" />
                    Convert JSON to CSV
                  </>
                )}
              </button>

              <button
                id="json-to-csv-clear-btn"
                onClick={handleClear}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
              >
                Clear
              </button>
            </div>

            {error && (
              <div id="json-to-csv-error-alert" className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Conversion Error:</span> {error}
                </div>
              </div>
            )}

            {success && csvOutput && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  Successfully converted JSON elements to CSV structure!
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">CSV Preview</span>
                    <button
                      id="json-to-csv-download-btn"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download .CSV File
                    </button>
                  </div>
                  <textarea
                    id="json-to-csv-output-preview"
                    readOnly
                    value={csvOutput}
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
                <span>CSV Engine</span>
                <span className="font-bold text-gray-950 dark:text-white">Papa Parse</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Cell Delimiter</span>
                <span className="font-bold text-gray-950 dark:text-white">Comma ( , )</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Header detection</span>
                <span className="font-bold text-gray-950 dark:text-white">Automatic</span>
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
