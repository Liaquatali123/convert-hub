'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, AlertCircle, X } from 'lucide-react';

interface FileDropzoneProps {
  id?: string;
  accept?: string; // e.g. "image/*", ".pdf", ".csv", ".json"
  multiple?: boolean;
  maxSizeMB?: number; // default to 20MB
  onFileSelect: (files: File[]) => void;
  descriptionText?: string;
}

export default function FileDropzone({
  id = 'file-dropzone',
  accept,
  multiple = false,
  maxSizeMB = 20,
  onFileSelect,
  descriptionText = 'Drag and drop your files here, or click to browse'
}: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    setError(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate size
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds the ${maxSizeMB}MB size limit.`);
        continue;
      }

      // Simple validation for file extension or MIME
      if (accept) {
        const acceptList = accept.split(',').map((t) => t.trim().toLowerCase());
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        const fileType = file.type.toLowerCase();

        const isAccepted = acceptList.some((accepted) => {
          if (accepted.startsWith('.')) {
            return fileExtension === accepted;
          }
          if (accepted.endsWith('/*')) {
            const baseType = accepted.replace('/*', '');
            return fileType.startsWith(baseType);
          }
          return fileType === accepted;
        });

        if (!isAccepted) {
          setError(`File format of "${file.name}" is not supported.`);
          continue;
        }
      }

      validFiles.push(file);
      if (!multiple) break; // if multiple is false, we only take the first valid file
    }

    return validFiles;
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = validateFiles(e.target.files);
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        id={id}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative w-full flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-inner'
            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/30 dark:bg-gray-950/10'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          id={`${id}-input`}
        />

        <div className="p-4 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 mb-4 shadow-sm">
          <Upload className="w-6 h-6 animate-pulse" />
        </div>

        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center mb-1">
          {descriptionText}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Maximum file size is {maxSizeMB}MB
        </p>

        {accept && (
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {accept.split(',').map((ext) => (
              <span
                key={ext}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
              >
                {ext.trim().replace(/^\./, '')}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div id="dropzone-error-alert" className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-semibold">Error:</span> {error}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
            }}
            className="p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-950"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
