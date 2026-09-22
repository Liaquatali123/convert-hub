'use client';

import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { FilePlus, Download, RefreshCw, CheckCircle, ArrowUp, ArrowDown, Trash2, ListOrdered, FileText } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up ObjectURLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const handleFilesSelect = (files: File[]) => {
    setError(null);
    setCompiledPdfUrl(null);
    const newItems: ImageItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    setCompiledPdfUrl(null);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setImages(reordered);
  };

  const handleRemove = (id: string) => {
    setCompiledPdfUrl(null);
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  // Convert WebP (or any unsupported buffer) to compatible JPEG buffer
  const convertToJpgBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob.arrayBuffer());
              } else {
                reject('Conversion blob failure');
              }
            }, 'image/jpeg', 0.9);
          } else {
            reject('Context allocation failure');
          }
        };
        img.onerror = () => reject('Image load failure');
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCompile = async () => {
    if (images.length === 0) return;

    setIsCompiling(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const fileExtension = item.file.name.split('.').pop()?.toLowerCase();

        let imageBytes: ArrayBuffer;
        let pdfImage: any;

        if (fileExtension === 'webp') {
          // Canvas transpile step to JPEG since PDF specification doesn't naturally encapsulate WebPs
          imageBytes = await convertToJpgBuffer(item.file);
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (fileExtension === 'png') {
          imageBytes = await item.file.arrayBuffer();
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          imageBytes = await item.file.arrayBuffer();
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        }

        // Add page matching image aspect bounds
        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      setCompiledPdfUrl(url);
      setIsCompiling(false);
    } catch (err: any) {
      setError('An error occurred while compiling your images into a PDF. Please make sure the files are not corrupt.');
      setIsCompiling(false);
    }
  };

  const handleDownload = () => {
    if (compiledPdfUrl) {
      saveAs(compiledPdfUrl, 'compiled-document.pdf');
    }
  };

  const handleClear = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setCompiledPdfUrl(null);
    setError(null);
  };

  const toolFAQs = [
    {
      question: 'How do I rearrange the image order?',
      answer: 'After uploading multiple images, they will appear in a list below. Use the up (▲) and down (▼) arrow buttons on each item to adjust their order. The top item will become Page 1, the second will be Page 2, and so on.'
    },
    {
      question: 'Does it support combining different formats?',
      answer: 'Yes. You can upload a mix of JPG, PNG, and WebP images. Our compiler processes and embeds them into a single PDF document.'
    },
    {
      question: 'Is there a limit on the number of images?',
      answer: 'No practical limit! You can merge dozens of images. Processing is highly optimized using PDF-Lib.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="JPG to PDF Converter"
        description="Merge multiple JPG, PNG, or WebP images into a single beautifully organized PDF document with custom page sorting."
        categoryName="PDF Tools"
        categoryHref="/tools?category=pdf"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm">
            
            {/* Input Dropzone */}
            <FileDropzone
              accept=".jpg,.jpeg,.png,.webp"
              multiple={true}
              onFileSelect={handleFilesSelect}
              descriptionText="Drag and drop images here, or click to browse (Multiple files supported)"
            />

            {/* Selected Images List */}
            {images.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-950 pb-2">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Selected Images ({images.length})
                    </h3>
                  </div>
                  <button
                    id="clear-all-images-btn"
                    onClick={handleClear}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {images.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-gray-150 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/25 transition-all"
                    >
                      {/* Thumbnail Preview */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900 shadow-sm">
                        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {item.file.name}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          Page {index + 1} • {(item.file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          id={`move-up-btn-${index}`}
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="p-1.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
                          title="Move Up (Decrease page number)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`move-down-btn-${index}`}
                          disabled={index === images.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="p-1.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
                          title="Move Down (Increase page number)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`remove-img-btn-${index}`}
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-500 text-gray-400 hover:text-red-500 transition-all ml-1"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compilation Actions */}
                {!compiledPdfUrl ? (
                  <button
                    id="compile-pdf-btn"
                    onClick={handleCompile}
                    disabled={isCompiling}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isCompiling ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Compiling Layer Channels...
                      </>
                    ) : (
                      <>
                        <FilePlus className="w-5 h-5" />
                        Compile {images.length} Image{images.length > 1 ? 's' : ''} into PDF
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      PDF compiled successfully! Ready for download.
                    </div>

                    <div className="flex gap-3">
                      <button
                        id="download-compiled-pdf-btn"
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF Document
                      </button>

                      <button
                        id="compile-reset-btn"
                        onClick={handleClear}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
                      >
                        Create New PDF
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p id="compile-pdf-error" className="text-sm text-red-600 font-semibold mt-2 text-center">
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
                <span>Core Library</span>
                <span className="font-bold text-gray-950 dark:text-white">pdf-lib</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Input formats</span>
                <span className="font-bold text-gray-950 dark:text-white">JPG, PNG, WebP</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Aspect preservation</span>
                <span className="font-bold text-gray-950 dark:text-white">100% (No Stretching)</span>
              </li>
              <li className="flex justify-between">
                <span>Execution context</span>
                <span className="font-bold text-gray-950 dark:text-white">100% Local (Secure)</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
