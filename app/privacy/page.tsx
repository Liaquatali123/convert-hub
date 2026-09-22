'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Last Updated: September 21, 2026
        </p>
      </div>

      <div className="prose prose-indigo dark:prose-invert max-w-none text-sm md:text-base text-gray-600 dark:text-gray-400 space-y-6">
        <p>
          At <strong>ConvertHub</strong>, we take your privacy extremely seriously. This Privacy Policy describes how we handle file data, personal information, and related configurations when you interact with our website and free online tools.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          1. Local In-Browser Processing (No File Uploads)
        </h2>
        <p>
          Unlike traditional online converters, ConvertHub runs with a <strong>privacy-by-design, offline-first client-side architecture</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Files never leave your computer:</strong> All file conversions (including JPG to PNG, PDF compilation, image compression, resizing, JSON formatting, CSV conversions, Base64 encodings, and Unit calculations) are executed on your local processor using client-side JavaScript APIs.
          </li>
          <li>
            <strong>No storage logs:</strong> Since your files are processed in your local memory (browser cache and heap) and downloaded instantly, we never upload, store, parse, scan, or copy your files on our servers.
          </li>
          <li>
            <strong>Works offline:</strong> Because there is no server-side dependency for these tools, they can run successfully even if you disconnect from the internet after loading the page.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          2. No Personal Data Collection
        </h2>
        <p>
          We do not require you to register, create an account, or provide personal details (such as names, phone numbers, or email addresses) to use any of our converters.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          3. Analytics & Cookies
        </h2>
        <p>
          To improve usability and analyze traffic patterns, we may prepare integration hooks for basic analytics services (such as Google Analytics) using environment parameters.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            If configured via the <code>NEXT_PUBLIC_GA_ID</code> variable, basic diagnostic events (such as page views and tool types loaded) may be tracked anonymously.
          </li>
          <li>
            This tracking does not capture any of your uploaded files, inputs, outputs, or private information.
          </li>
          <li>
            You can block analytical cookies using browser configurations or privacy extensions (like uBlock Origin) without breaking tool functionality.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          4. Advertising Disclosures
        </h2>
        <p>
          ConvertHub integrates cleanly marked third-party advertising slots (e.g., Google AdSense) to support site hosting and continuous updates.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            These ad slots are positioned strictly below or away from actual file selector controls to prevent accidental clicks or user disruption.
          </li>
          <li>
            Third-party vendors (including Google) may use cookies to serve ads based on prior website visits.
          </li>
          <li>
            You may opt-out of personalized advertising by visiting your Google Ads Settings or opting out of third-party cookie usage in your browser.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          5. Contacting Us
        </h2>
        <p>
          If you have any questions or concerns regarding our privacy practices, please contact us through our labeled Support page.
        </p>
      </div>
    </div>
  );
}
