'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Last Updated: September 21, 2026
        </p>
      </div>

      <div className="prose prose-indigo dark:prose-invert max-w-none text-sm md:text-base text-gray-600 dark:text-gray-400 space-y-6">
        <p>
          Welcome to <strong>ConvertHub</strong> ("we", "our", "us"). By accessing or utilizing our website, tools, services, and local scripts (collectively referred to as "ConvertHub Services"), you agree to compile with and be bound by the following Terms of Service.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          1. Acceptance of Terms
        </h2>
        <p>
          By visiting, accessing, or converting files using any tool on ConvertHub, you express full agreement to these Terms of Service. If you do not agree to any portion of these terms, you are forbidden from utilizing our website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          2. Permitted Use & Fair Conduct
        </h2>
        <p>
          ConvertHub is designed strictly for personal, educational, and commercial file/data conversion purposes.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Fair access:</strong> You must not attempt to scrape our site, launch DDoS attacks, spam or abuse our layout, or distribute harmful scripts through our code.
          </li>
          <li>
            <strong>Client-Side Execution:</strong> Since all utility scripts and image rendering modules execute locally in your browser, you agree not to distribute modified versions of our compiled static assets or claim ownership of our core codebase.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          3. Disclaimer of Warranties
        </h2>
        <p>
          ConvertHub Services are provided strictly on an <strong>"as-is" and "as-available" basis</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            We make no representations or warranties of any kind (express or implied) that the tools will be 100% error-free, uninterrupted, or perfectly compatible with corrupted or experimental files.
          </li>
          <li>
            While we use robust, widely-respected industry-standard libraries (including pdf-lib, jszip, Papa Parse, and browser-image-compression) to ensure conversion accuracy, the user is solely responsible for double-checking and validating crucial outputs.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          4. Limitation of Liability
        </h2>
        <p>
          In no event shall ConvertHub, its authors, developers, or operators be liable for any direct, indirect, incidental, consequential, special, or exemplary damages (including but not limited to lost data, lost profits, computer errors, or operational downtime) arising from the use of or inability to use our services.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          5. Modifications to Service
        </h2>
        <p>
          We reserve the right to add, modify, pause, or retire any tool, category, or functionality from the registry at any time without prior notice.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          6. Contact
        </h2>
        <p>
          For questions, support requests, or bug reports, please write to us via our designated Contact page.
        </p>
      </div>
    </div>
  );
}
