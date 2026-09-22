export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'image' | 'pdf' | 'data' | 'text' | 'utility';
  iconName: string;
  route: string;
  supportedFormats: string[];
  keywords: string[];
}

export const CATEGORIES = {
  image: {
    name: 'Image Tools',
    description: 'Convert, compress, and resize images locally in your browser.',
    iconName: 'Image'
  },
  pdf: {
    name: 'PDF Tools',
    description: 'Convert images to PDF and extract images from PDF pages.',
    iconName: 'FileText'
  },
  data: {
    name: 'Data Tools',
    description: 'Format, parse, and convert JSON and CSV data.',
    iconName: 'Database'
  },
  text: {
    name: 'Text & Encoding',
    description: 'Encode and decode Base64, URLs, and text strings safely.',
    iconName: 'Binary'
  },
  utility: {
    name: 'Utility Tools',
    description: 'Quick client-side converters for everyday calculations.',
    iconName: 'Sparkles'
  }
} as const;

export const TOOLS: Tool[] = [
  // Image
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    description: 'Convert JPG/JPEG images to PNG format offline in your browser.',
    category: 'image',
    iconName: 'Image',
    route: '/tools/jpg-to-png',
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    keywords: ['jpg', 'jpeg', 'png', 'convert image', 'offline']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    description: 'Convert PNG images to high-quality JPG format with custom quality options.',
    category: 'image',
    iconName: 'Image',
    route: '/tools/png-to-jpg',
    supportedFormats: ['.png', '.jpg', '.jpeg'],
    keywords: ['png', 'jpg', 'jpeg', 'convert image', 'offline']
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG Converter',
    description: 'Convert WebP images to JPG format for maximum compatibility.',
    category: 'image',
    iconName: 'ImageDown',
    route: '/tools/webp-to-jpg',
    supportedFormats: ['.webp', '.jpg', '.jpeg'],
    keywords: ['webp', 'jpg', 'jpeg', 'convert webp', 'offline']
  },
  {
    id: 'jpg-to-webp',
    name: 'JPG to WebP Converter',
    description: 'Convert JPG/JPEG images to WebP format to save space and speed up your website.',
    category: 'image',
    iconName: 'ImageUp',
    route: '/tools/jpg-to-webp',
    supportedFormats: ['.jpg', '.jpeg', '.webp'],
    keywords: ['jpg', 'jpeg', 'webp', 'compress webp', 'offline']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress PNG, JPG, and WebP images directly in your browser with real-time file size comparison.',
    category: 'image',
    iconName: 'Minimize2',
    route: '/tools/image-compressor',
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    keywords: ['compress', 'optimize', 'shrink image', 'reduce size', 'offline']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to custom width and height with locked aspect ratios and quality sliders.',
    category: 'image',
    iconName: 'Maximize2',
    route: '/tools/image-resizer',
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    keywords: ['resize', 'dimension', 'width', 'height', 'scale image', 'offline']
  },

  // PDF
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    description: 'Convert pages of your PDF document into separate high-quality JPG images offline.',
    category: 'pdf',
    iconName: 'FileImage',
    route: '/tools/pdf-to-jpg',
    supportedFormats: ['.pdf'],
    keywords: ['pdf to jpg', 'pdf to image', 'extract pdf', 'pdf', 'offline']
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    description: 'Combine multiple JPG, PNG, or WebP images into a single beautifully organized PDF file.',
    category: 'pdf',
    iconName: 'FilePlus',
    route: '/tools/jpg-to-pdf',
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    keywords: ['jpg to pdf', 'images to pdf', 'compile pdf', 'pdf converter', 'offline']
  },

  // Data
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, beautify, and minify your JSON data in real-time with descriptive errors.',
    category: 'data',
    iconName: 'FileCode',
    route: '/tools/json-formatter',
    supportedFormats: ['.json', '.txt'],
    keywords: ['json formatter', 'beautify json', 'minify json', 'validate json', 'json format', 'offline']
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert JSON arrays or nested data into clean CSV files for Excel or spreadsheets.',
    category: 'data',
    iconName: 'TableProperties',
    route: '/tools/json-to-csv',
    supportedFormats: ['.json', '.txt'],
    keywords: ['json to csv', 'export csv', 'json array to csv', 'offline']
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Convert raw CSV spreadsheets or CSV files into highly formatted JSON databases.',
    category: 'data',
    iconName: 'FileSpreadsheet',
    route: '/tools/csv-to-json',
    supportedFormats: ['.csv', '.txt'],
    keywords: ['csv to json', 'import csv', 'excel to json', 'offline']
  },

  // Text & Encoding
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    description: 'Encode plain text strings safely into Base64 format.',
    category: 'text',
    iconName: 'Hash',
    route: '/tools/base64-encoder',
    supportedFormats: ['.txt'],
    keywords: ['base64 encode', 'binary to text', 'encoder', 'offline']
  },
  {
    id: 'base64-decoder',
    name: 'Base64 Decoder',
    description: 'Decode Base64 encoded strings back to human-readable plain text.',
    category: 'text',
    iconName: 'ShieldAlert',
    route: '/tools/base64-decoder',
    supportedFormats: ['.txt'],
    keywords: ['base64 decode', 'text decoder', 'base64 to text', 'offline']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder',
    description: 'Percent-encode plain text query parameters or URLs safely.',
    category: 'text',
    iconName: 'Link',
    route: '/tools/url-encoder',
    supportedFormats: [],
    keywords: ['url encode', 'percent encoding', 'uri encoder', 'offline']
  },
  {
    id: 'url-decoder',
    name: 'URL Decoder',
    description: 'Decode percent-encoded URL parameters back into human-readable plain text.',
    category: 'text',
    iconName: 'Link2',
    route: '/tools/url-decoder',
    supportedFormats: [],
    keywords: ['url decode', 'uri decoder', 'url parameters', 'offline']
  },

  // Utility
  {
    id: 'unit-converter',
    name: 'Smart Unit Converter',
    description: 'Instantly convert between Length, Weight, Temperature, and Digital Storage (decimal and binary bytes).',
    category: 'utility',
    iconName: 'Scale',
    route: '/tools/unit-converter',
    supportedFormats: [],
    keywords: ['unit converter', 'metric', 'digital storage', 'kb mb gb', 'celsius to fahrenheit', 'offline']
  }
];
