'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { FileImage, Download, RefreshCw, CheckCircle, FileUp } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function JpgToPngPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setConvertedUrl(null);
      setError(null);
    }
  };

  const handleConvert = () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
          }

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Convert to PNG blob
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setConvertedUrl(url);
              setIsConverting(false);
            } else {
              throw new Error('Canvas conversion returned null blob');
            }
          }, 'image/png');
        } catch (err: any) {
          setError(err?.message || 'Failed to parse image data.');
          setIsConverting(false);
        }
      };
      img.onerror = () => {
        setError('Failed to load image. The file might be corrupted.');
        setIsConverting(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsConverting(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (convertedUrl && file) {
      const originalName = file.name.split('.').slice(0, -1).join('.');
      saveAs(convertedUrl, `${originalName}.png`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedUrl(null);
    setError(null);
  };

  const toolFAQs = [
    {
      question: 'How does the JPG to PNG converter work?',
      answer: 'It uses your web browser’s built-in canvas drawing tools. It reads your JPG file, draws it on an offline canvas, and outputs the result in PNG format directly in memory.'
    },
    {
      question: 'Will I lose image quality during conversion?',
      answer: 'No. PNG is a lossless format, so converting from JPG to PNG will preserve 100% of the original JPG quality.'
    },
    {
      question: 'Is it safe to convert private photos here?',
      answer: 'Absolutely. All processing occurs locally on your computer. Your photo is never sent to any server.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="JPG to PNG Converter"
        description="Convert JPG and JPEG images into high-quality PNG format. 100% private, browser-based, instant downloads."
        categoryName="Image Tools"
        categoryHref="/tools?category=image"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm">
            {!file ? (
              <FileDropzone
                accept=".jpg,.jpeg"
                onFileSelect={handleFileSelect}
                descriptionText="Upload a JPG or JPEG image to convert"
              />
            ) : (
              <div className="space-y-6">
                {/* File Overview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-lg shrink-0">
                    <FileImage className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                {/* Conversion Buttons */}
                {!convertedUrl ? (
                  <button
                    id="jpg-to-png-convert-btn"
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50"
                  >
                    {isConverting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-5 h-5" />
                        Convert to PNG
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      Image successfully converted to PNG!
                    </div>

                    <div className="flex gap-3">
                      <button
                        id="jpg-to-png-download-btn"
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm"
                      >
                        <Download className="w-5 h-5" />
                        Download PNG
                      </button>

                      <button
                        id="jpg-to-png-reset-btn"
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
                      >
                        Convert Another
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p id="jpg-to-png-error" className="text-sm text-red-600 font-semibold mt-2 text-center">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>

          <FAQ items={toolFAQs} />
        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-950/20 p-5 rounded-2xl border border-gray-150 dark:border-gray-900 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Tool Specifications
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Input formats</span>
                <span className="font-bold text-gray-950 dark:text-white">.jpg, .jpeg</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Output formats</span>
                <span className="font-bold text-gray-950 dark:text-white">.png</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Execution context</span>
                <span className="font-bold text-gray-950 dark:text-white">100% Browser Local</span>
              </li>
              <li className="flex justify-between">
                <span>Max size limit</span>
                <span className="font-bold text-gray-950 dark:text-white">20 MB</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
