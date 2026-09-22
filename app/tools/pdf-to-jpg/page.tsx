'use client';

import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { FileText, Download, RefreshCw, CheckCircle, FileImage, Layers, Loader2, Info } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import ToolHeader from '@/components/ToolHeader';
import AdPlaceholder from '@/components/AdPlaceholder';
import FAQ from '@/components/FAQ';

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLibLoading, setIsLibLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pagesThumbnails, setPagesThumbnails] = useState<string[]>([]);
  const [renderingProgress, setRenderingProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const pdfJsLoaded = useRef<boolean>(false);

  // Load PDF.js script dynamically
  const loadPdfLibrary = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject('Window undefined');
      if ((window as any).pdfjsLib) {
        return resolve((window as any).pdfjsLib);
      }

      setIsLibLoading(true);
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        pdfJsLoaded.current = true;
        setIsLibLoading(false);
        resolve(pdfjsLib);
      };
      script.onerror = () => {
        setIsLibLoading(false);
        reject('Failed to load PDF engine from CDN.');
      };
      document.head.appendChild(script);
    });
  };

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);
    setPagesThumbnails([]);
    setTotalPages(0);
    setPdfDoc(null);
    setIsProcessing(true);

    try {
      const pdfjsLib = await loadPdfLibrary();
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          
          const pdf = await loadingTask.promise;
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
          
          // Generate quick preview thumbnails of the first few pages
          const thumbs: string[] = [];
          const previewCount = Math.min(pdf.numPages, 3); // preview up to first 3 pages
          
          for (let i = 1; i <= previewCount; i++) {
            setRenderingProgress(`Generating page ${i} preview...`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.4 }); // smaller scale for thumbnail
            
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              await page.render({ canvasContext: ctx, viewport }).promise;
              thumbs.push(canvas.toDataURL('image/jpeg', 0.8));
            }
          }
          
          setPagesThumbnails(thumbs);
          setIsProcessing(false);
          setRenderingProgress('');
        } catch (err: any) {
          setError('Failed to parse PDF document structure. The file might be corrupted.');
          setIsProcessing(false);
          setFile(null);
        }
      };

      fileReader.readAsArrayBuffer(selectedFile);
    } catch (err: any) {
      setError(err?.toString() || 'Failed to load library dependencies.');
      setIsProcessing(false);
      setFile(null);
    }
  };

  // Convert a single page to JPEG and trigger download
  const handleDownloadSinglePage = async (pageNumber: number) => {
    if (!pdfDoc) return;
    setIsProcessing(true);
    setRenderingProgress(`Rendering Page ${pageNumber}...`);

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for high resolution
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('2D Context failed.');
      
      // Fill solid white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      
      canvas.toBlob((blob) => {
        if (blob) {
          const originalName = file?.name.split('.').slice(0, -1).join('.') || 'pdf-page';
          saveAs(blob, `${originalName}-page-${pageNumber}.jpg`);
          setIsProcessing(false);
          setRenderingProgress('');
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      setError('Failed to convert specific page.');
      setIsProcessing(false);
    }
  };

  // Convert all pages and package into a single ZIP file
  const handleDownloadAllPagesAsZip = async () => {
    if (!pdfDoc || !file) return;
    setIsProcessing(true);
    
    const zip = new JSZip();
    const originalName = file.name.split('.').slice(0, -1).join('.');

    try {
      for (let i = 1; i <= totalPages; i++) {
        setRenderingProgress(`Processing Page ${i} of ${totalPages}...`);
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High resolution 2x
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9);
          });
          
          if (blob) {
            zip.file(`${originalName}-page-${i}.jpg`, blob);
          }
        }
      }

      setRenderingProgress('Creating ZIP bundle...');
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `${originalName}-pages-images.zip`);
      
      setIsProcessing(false);
      setRenderingProgress('');
    } catch (err) {
      setError('Failed to bundle ZIP of images.');
      setIsProcessing(false);
      setRenderingProgress('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfDoc(null);
    setTotalPages(0);
    setPagesThumbnails([]);
    setError(null);
    setRenderingProgress('');
  };

  const toolFAQs = [
    {
      question: 'How does PDF to JPG extraction work?',
      answer: 'Our converter initializes an in-browser PDF rendering context (pdf.js). It loops through each sheet of the PDF, draws the content vector paths on an HTML5 canvas object at 2.0x zoom scale, and outputs crisp high-res JPG files instantly.'
    },
    {
      question: 'Is there a limit to how many pages I can convert?',
      answer: 'No! There is no page limit. However, converting PDFs with hundreds of pages may temporarily consume browser memory. We recommend using the "Download All as ZIP" button for files with multiple pages.'
    },
    {
      question: 'Are my document contents uploaded?',
      answer: 'No. The extraction processes entirely inside your browser client sandbox. Your business docs, financial records, and PDFs never leave your machine.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToolHeader
        name="PDF to JPG Converter"
        description="Convert pages of PDF documents into separate, high-quality JPG image files locally in your browser."
        categoryName="PDF Tools"
        categoryHref="/tools?category=pdf"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Workspace Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-2xl shadow-sm">
            {!file ? (
              <FileDropzone
                accept=".pdf"
                onFileSelect={handleFileSelect}
                descriptionText="Upload a PDF file to extract pages to JPG"
              />
            ) : (
              <div className="space-y-6">
                {/* File Overview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-800">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-lg shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {totalPages} pages detected
                    </p>
                  </div>
                </div>

                {/* Progress Indicators */}
                {isProcessing && (
                  <div className="flex items-center gap-2.5 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>{renderingProgress || 'Parsing document layers...'}</span>
                  </div>
                )}

                {/* Thumbnail Previews Section */}
                {pagesThumbnails.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Page Previews</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {pagesThumbnails.map((src, index) => (
                        <div key={index} className="relative aspect-[3/4] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-sm flex flex-col justify-between">
                          <img src={src} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-gray-900/80 text-white text-[9px] px-1 rounded font-bold">
                            Page {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extraction Commands */}
                {pdfDoc && !isProcessing && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 space-y-4">
                      <div className="flex items-start gap-2 text-xs text-gray-500">
                        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <p>You can download all pages consolidated into a single .ZIP folder, or download specific individual pages below.</p>
                      </div>

                      <button
                        id="pdf-to-jpg-zip-btn"
                        onClick={handleDownloadAllPagesAsZip}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Layers className="w-5 h-5" />
                        Download All {totalPages} Pages as ZIP
                      </button>
                    </div>

                    {/* Individual Page Downloader List */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Individual Page Extractor</h4>
                      <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-150 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <div key={pageNum} className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-950 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Page {pageNum}</span>
                            <button
                              id={`pdf-page-download-btn-${pageNum}`}
                              onClick={() => handleDownloadSinglePage(pageNum)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold text-gray-600 dark:text-gray-400 transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              JPG
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      id="pdf-to-jpg-reset-btn"
                      onClick={handleReset}
                      className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-semibold transition-all"
                    >
                      Process Another PDF
                    </button>
                  </div>
                )}

                {error && (
                  <p id="pdf-to-jpg-error" className="text-sm text-red-600 font-semibold mt-2 text-center">
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
                <span className="font-bold text-gray-950 dark:text-white">.pdf</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Output formats</span>
                <span className="font-bold text-gray-950 dark:text-white">.jpg (zipped or single)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
                <span>Rendering DPI</span>
                <span className="font-bold text-gray-950 dark:text-white">150 DPI (2x zoom)</span>
              </li>
              <li className="flex justify-between">
                <span>Max size limit</span>
                <span className="font-bold text-gray-950 dark:text-white">80 MB</span>
              </li>
            </ul>
          </div>

          <AdPlaceholder format="vertical" />
        </div>
      </div>
    </div>
  );
}
