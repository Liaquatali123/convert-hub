'use client';

import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { saveAs } from 'file-saver';
import { Minimize2, Download, RefreshCw, CheckCircle, Percent, HardDrive, ArrowRight } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(75); // represents 0.75
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setCompressedFile(null);
      setCompressedSize(null);
      setError(null);
      setProgress(0);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setProgress(0);
    setError(null);

    try {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
        // Calculate initial quality based on user preference
        initialQuality: quality / 100,
        onProgress: (p: number) => {
          setProgress(p);
        }
      };

      const result = await imageCompression(file, options);
      setCompressedFile(result);
      setCompressedSize(result.size);
      setIsCompressing(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to compress image.');
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (compressedFile && file) {
      saveAs(compressedFile, `compressed-${file.name}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedFile(null);
    setCompressedSize(null);
    setError(null);
    setProgress(0);
  };

  const reductionPercentage = file && compressedSize
    ? (((file.size - compressedSize) / file.size) * 100).toFixed(0)
    : '0';

  const toolFAQs = [
    {
      question: 'How does local image compression work?',
      answer: 'Our compressor runs the image-compression library in your browser using Web Workers. It resizes large source coordinates and reapplies JPEG/WebP quantization arrays locally to reduce file storage footprints by up to 80% without noticeable quality loss.'
    },
    {
      question: 'Will my PNG transparent background be saved?',
      answer: 'Yes! The compressor maintains PNG transparency formats perfectly, compressing alpha channels as well as standard color layers.'
    },
    {
      question: 'Why compress images?',
      answer: 'Compromised images load up to 5x faster on slow networks, drastically lowering website hosting bandwidth bills and improving Google Lighthouse SEO speed metrics.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="Image Compressor"
        description="Compress JPG, PNG, and WebP images directly in your browser without sacrificing quality. 100% secure offline optimizer."
        categoryName="Image Tools"
        categoryHref="/tools?category=image"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm">
            {!file ? (
              <FileDropzone
                accept=".jpg,.jpeg,.png,.webp"
                onFileSelect={handleFileSelect}
                descriptionText="Upload an image (JPG, PNG, WebP) to compress"
              />
            ) : (
              <div className="space-y-6">
                {/* File Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Original Size</span>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-gray-400" />
                      <span className="font-bold text-gray-900 dark:text-white">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>

                  {compressedSize ? (
                    <div className="p-4 rounded-xl border border-emerald-150 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">Compressed Size</span>
                      <div className="flex items-center gap-2">
                        <Minimize2 className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {(compressedSize / 1024).toFixed(1)} KB
                        </span>
                        <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          -{reductionPercentage}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-xs text-gray-400 font-medium">
                      Awaiting compression
                    </div>
                  )}
                </div>

                {/* Configuration Options */}
                {!compressedFile && (
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-950/20">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-gray-500">Compression Quality</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{quality}%</span>
                      </div>
                      <input
                        id="compressor-quality-slider"
                        type="range"
                        min="20"
                        max="95"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                        disabled={isCompressing}
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        <span>Max Compress (Low Quality)</span>
                        <span>Standard (Balanced)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {isCompressing && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
                      <span>Analyzing File Channels</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Compression Action Buttons */}
                {!compressedFile ? (
                  <button
                    id="compressor-submit-btn"
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50"
                  >
                    {isCompressing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Optimizing Layers...
                      </>
                    ) : (
                      <>
                        <Minimize2 className="w-5 h-5" />
                        Compress Image
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      Compressed successfully! Saved {((file.size - compressedSize!) / 1024).toFixed(1)} KB.
                    </div>

                    <div className="flex gap-3">
                      <button
                        id="compressor-download-btn"
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm"
                      >
                        <Download className="w-5 h-5" />
                        Download Optimized Image
                      </button>

                      <button
                        id="compressor-reset-btn"
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
                      >
                        Compress Another
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p id="compressor-error" className="text-sm text-red-600 font-semibold mt-2 text-center">
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
                <span className="font-bold text-gray-950 dark:text-white">JPG, PNG, WebP</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Core Library</span>
                <span className="font-bold text-gray-950 dark:text-white">browser-image-compression</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Web Workers</span>
                <span className="font-bold text-gray-950 dark:text-white">Supported (Offline)</span>
              </li>
              <li className="flex justify-between">
                <span>Max size limit</span>
                <span className="font-bold text-gray-950 dark:text-white">50 MB</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
