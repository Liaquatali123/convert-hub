'use client';

import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Maximize2, Download, RefreshCw, CheckCircle, Sliders, Scaling } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<string>('image/png');
  const [quality, setQuality] = useState<number>(90);
  const [isResizing, setIsResizing] = useState(false);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setResizedUrl(null);
      setError(null);

      // Load image to read its original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setWidth(img.naturalWidth.toString());
        setHeight(img.naturalHeight.toString());
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (!val || !originalWidth || !originalHeight || !lockRatio) return;

    const parsedW = parseInt(val);
    if (isNaN(parsedW)) return;

    const computedH = Math.round((parsedW / originalWidth) * originalHeight);
    setHeight(computedH.toString());
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (!val || !originalWidth || !originalHeight || !lockRatio) return;

    const parsedH = parseInt(val);
    if (isNaN(parsedH)) return;

    const computedW = Math.round((parsedH / originalHeight) * originalWidth);
    setWidth(computedW.toString());
  };

  const handleResize = () => {
    if (!file || !width || !height) return;

    setIsResizing(true);
    setError(null);

    const targetWidth = parseInt(width);
    const targetHeight = parseInt(height);

    if (isNaN(targetWidth) || targetWidth <= 0 || isNaN(targetHeight) || targetHeight <= 0) {
      setError('Please provide valid dimensions.');
      setIsResizing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D context unavailable.');

          // Fill with solid white for JPEGs
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          }

          // Draw and scale image
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Convert
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setResizedUrl(url);
              setIsResizing(false);
            } else {
              throw new Error('Resizing failed.');
            }
          }, format, format === 'image/png' ? undefined : quality / 100);
        } catch (err: any) {
          setError(err?.message || 'Failed during resizing.');
          setIsResizing(false);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (resizedUrl && file) {
      const extMap: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/webp': 'webp'
      };
      const extension = extMap[format] || 'png';
      const originalName = file.name.split('.').slice(0, -1).join('.');
      saveAs(resizedUrl, `${originalName}-${width}x${height}.${extension}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResizedUrl(null);
    setOriginalWidth(null);
    setOriginalHeight(null);
    setWidth('');
    setHeight('');
    setError(null);
  };

  const toolFAQs = [
    {
      question: 'What is "Lock Aspect Ratio"?',
      answer: 'Locking aspect ratio keeps the width and height proportional to the original image dimensions. This prevents your images from stretching or becoming distorted when resized.'
    },
    {
      question: 'Can I change formats while resizing?',
      answer: 'Yes! You can upload a JPG and resize it directly into PNG or WebP output, or vice versa, saving multiple editing steps.'
    },
    {
      question: 'Will resizing larger make my images higher quality?',
      answer: 'Scaling an image larger than its original size will not add real details and can result in pixelation. It is usually best to scale downwards to reduce visual size and save byte sizes.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="Image Resizer"
        description="Scale your images to custom dimensions, lock aspect ratios, and export to PNG, JPEG, or WebP formats completely client-side."
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
                descriptionText="Upload an image to resize"
              />
            ) : (
              <div className="space-y-6">
                {/* File Overview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-800">
                  <Scaling className="w-8 h-8 text-indigo-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Original: <span className="font-semibold text-gray-600 dark:text-gray-350">{originalWidth} x {originalHeight}</span> px
                    </p>
                  </div>
                </div>

                {/* Configuration Options */}
                {!resizedUrl && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-950/20">
                    {/* Size selectors */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Sliders className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Dimensions</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="resizer-width" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Width (px)</label>
                          <input
                            id="resizer-width"
                            type="number"
                            value={width}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label htmlFor="resizer-height" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Height (px)</label>
                          <input
                            id="resizer-height"
                            type="number"
                            value={height}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                          id="resizer-lock-aspect-ratio"
                          type="checkbox"
                          checked={lockRatio}
                          onChange={(e) => {
                            setLockRatio(e.target.checked);
                            if (e.target.checked && originalWidth && originalHeight) {
                              const parsedW = parseInt(width);
                              if (!isNaN(parsedW)) {
                                const computedH = Math.round((parsedW / originalWidth) * originalHeight);
                                setHeight(computedH.toString());
                              }
                            }
                          }}
                          className="rounded border-gray-300 accent-indigo-600"
                        />
                        Lock Aspect Ratio
                      </label>
                    </div>

                    {/* Output options */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Scaling className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Output Settings</h4>
                      </div>

                      <div>
                        <label htmlFor="resizer-format" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Format</label>
                        <select
                          id="resizer-format"
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none font-semibold"
                        >
                          <option value="image/png">PNG (Lossless)</option>
                          <option value="image/jpeg">JPEG (Lossy)</option>
                          <option value="image/webp">WebP (Compressed)</option>
                        </select>
                      </div>

                      {format !== 'image/png' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-500">Quality</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{quality}%</span>
                          </div>
                          <input
                            id="resizer-quality-slider"
                            type="range"
                            min="20"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                {!resizedUrl ? (
                  <button
                    id="resizer-submit-btn"
                    onClick={handleResize}
                    disabled={isResizing || !width || !height}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isResizing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Re-rendering Pixels...
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-5 h-5" />
                        Resize Image
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      Image successfully resized to {width} x {height} px!
                    </div>

                    <div className="flex gap-3">
                      <button
                        id="resizer-download-btn"
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm"
                      >
                        <Download className="w-5 h-5" />
                        Download Resized Image
                      </button>

                      <button
                        id="resizer-reset-btn"
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
                      >
                        Resize Another
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p id="resizer-error" className="text-sm text-red-600 font-semibold mt-2 text-center">
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
                <span>Supported Formats</span>
                <span className="font-bold text-gray-950 dark:text-white">JPG, PNG, WebP</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Aspect Locking</span>
                <span className="font-bold text-gray-950 dark:text-white">Yes (Proportional)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Execution context</span>
                <span className="font-bold text-gray-950 dark:text-white">100% Browser Local</span>
              </li>
              <li className="flex justify-between">
                <span>Max size limit</span>
                <span className="font-bold text-gray-950 dark:text-white">35 MB</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
