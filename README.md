# ConvertHub — Privacy-First Online File Converters

**ConvertHub** is a privacy-first, zero-server-upload file conversion and editing platform. It executes 100% client-side in the browser, ensuring your business documents, financial spreadsheets, images, and keys remain entirely confidential on your local filesystem.

---

## 🎨 Design Philosophy & Visual Craft

ConvertHub features a sophisticated, light-first creative dashboard centered on readability, visual rhythm, and generous spacing:
- **Mathematical Hierarchy**: Uses low-contrast typographic scales (Major Second 1.125) paired with crisp typography.
- **Warm Contrast Balance**: Framed on light warm-neutral canvases with sharp, subtle borders. 
- **Animation Motion**: Interactive, lightweight micro-transitions utilizing `motion` (Framer Motion).
- **Aesthetic Pairings**: Elegant, descriptive layouts completely avoiding nested card fatigue.

---

## ⚙️ Fully Implemented Client-Side Tools (16/16)

Every single tool listed below is fully functional, complete with precise error-catch boundaries and interactive control panels.

### 🖼️ Image Converters & Editors
1. **JPG to PNG**: Convert with direct browser canvas drawing.
2. **PNG to JPG**: Convert with solid white background fill, transparency guards, and adjustable quality.
3. **WebP to JPG**: Convert WebP image payloads to widely compatible JPG formats.
4. **JPG to WebP**: Encode images to highly optimized WebP streams to save page weight.
5. **Image Compressor**: Adjust target quality with live byte calculations and percentage reduction views.
6. **Image Resizer**: Adjust pixel dimensions with lock-aspect-ratio toggles and multi-format exports.

### 📄 Document & PDF Utilities
7. **PDF to JPG**: Uses `pdf.js` to render vector document pages onto separate canvases for zipped downloading.
8. **JPG to PDF**: Sort, reorder, and compile multiple images into a single clean PDF document via `pdf-lib`.

### 🗄️ Structured Data Converters
9. **JSON Formatter & Validator**: Formats, validates, and minifies raw JSON arrays.
10. **JSON to CSV**: Flatten and unparse JSON array lists into table rows using `papaparse`.
11. **CSV to JSON**: Parses CSV sheets with dynamic type-casting for numbers and booleans using `papaparse`.

### 💻 Developer String Utilities
12. **Base64 Encoder**: Encodes Unicode text strings or entire files into Base64 Data URL schemes.
13. **Base64 Decoder**: Decodes Base64 ASCII sequences back into text or downloadable binary files.
14. **URL Encoder**: Encodes query values or paths preserving or escaping protocol delimiters.
15. **URL Decoder**: Decodes percent-encoded character strings with validation safeguards.

### 📐 Universal Utilities
16. **Universal Unit Converter**: Real-time conversions for Length, Weight, Temperature, Area, and Volume.

---

## 🛠️ Technology Stack & Libraries

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (with strict implicit-any checks)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: `motion/react`
- **Helper Engines**:
  - `jszip` & `file-saver` (Page-to-ZIP exports and downloads)
  - `browser-image-compression` (In-browser compression Web Worker)
  - `pdf-lib` (Document generation)
  - `papaparse` (Spreadsheet row mapping)

---

## 🚀 Running Locally

To build and run the development or production server:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build & Start Production Server**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔒 Security & Offline Sandbox

Because all conversions happen in-memory inside the browser tab, **no file telemetry is gathered, stored, or sent**. You can turn off your internet connection entirely, and the platform will continue converting files perfectly.
