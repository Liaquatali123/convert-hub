'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQProps {
  id?: string;
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ id = 'faq-container', items, title = 'Frequently Asked Questions' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id={id} className="w-full mt-12 md:mt-16">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
        {title}
      </h2>
      <div className="space-y-3.5">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-900 rounded-xl bg-white dark:bg-gray-950 overflow-hidden transition-all duration-200"
            >
              <button
                id={`faq-btn-${index}`}
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left text-sm md:text-base font-bold text-gray-900 dark:text-white hover:bg-gray-50/50 dark:hover:bg-gray-950/50 focus:outline-none transition-colors"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-4" />
                )}
              </button>
              
              {isOpen && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-5 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-900"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
