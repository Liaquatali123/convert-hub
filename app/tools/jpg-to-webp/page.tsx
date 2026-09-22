'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { FileImage, Download, RefreshCw, CheckCircle, FileUp, Settings } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function JpgToWebpPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(85);
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

          // Draw Image
          ctx.drawImage(img, 0, 0);

          // Convert to WebP blob
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setConvertedUrl(url);
              setIsConverting(false);
            } else {
              throw new Error('Canvas conversion returned null blob');
            }
          }, 'image/webp', quality / 100);
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
      saveAs(convertedUrl, `${originalName}.webp`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedUrl(null);
    setError(null);
  };

  const toolFAQs = [
    {
      question: 'What are the benefits of WebP over JPG?',
      answer: 'WebP is a modern web image format developed by Google. It provides superior lossless and lossy compression for images, typically yielding files that are 30% smaller than JPEGs while retaining comparable visual quality.'
    },
    {
      question: 'Can I control the compression amount?',
      answer: 'Yes. Our converter includes an interactive slider to select output WebP encoding quality from 10% to 100%. We recommend 80-85% for standard web optimization.'
    },
    {
      question: 'Does this tool upload my images?',
      answer: 'No. The conversion is processed entirely in your web browser using HTML5 Canvas rendering. Your files remain confidential on your machine.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="JPG to WebP Converter"
        description="Convert standard JPG or JPEG images into highly compressed, lightweight WebP files."
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
                descriptionText="Upload a JPG or JPEG image to convert to WebP"
              />
            ) : (
              <div className="space-y-6">
                {/* File Overview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-800">
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

                {/* Configuration Options */}
                {!convertedUrl && (
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-950/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4 text-indigo-500" />
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Conversion Quality</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-gray-500">WebP Quality</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{quality}%</span>
                      </div>
                      <input
                        id="jpg-to-webp-quality-slider"
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        <span>High Compression</span>
                        <span>High Quality (Recommended)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversion Buttons */}
                {!convertedUrl ? (
                  <button
                    id="jpg-to-webp-convert-btn"
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
                        Convert to WebP
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      Image successfully converted to WebP!
                    </div>

                    <div className="flex gap-3">
                      <button
                        id="jpg-to-webp-download-btn"
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm"
                      >
                        <Download className="w-5 h-5" />
                        Download WebP
                      </button>

                      <button
                        id="jpg-to-webp-reset-btn"
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
                      >
                        Convert Another
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p id="jpg-to-webp-error" className="text-sm text-red-600 font-semibold mt-2 text-center">
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
                <span className="font-bold text-gray-950 dark:text-white">.webp</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Compression type</span>
                <span className="font-bold text-gray-950 dark:text-white">Lossy Custom</span>
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
