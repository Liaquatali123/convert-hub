'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, Copy, Check } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactEmail = 'support@converthub.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Standard client feedback explaining that since there is no server database,
    // this demonstrates the UI flow. We can also provide a mailto shortcut!
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          Contact ConvertHub
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Have a question, feature request, or found a bug? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Contact info card */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-150 dark:border-gray-900 bg-gray-50/40 dark:bg-gray-950/20">
            <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">Direct Communication</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              ConvertHub operates as an offline client-side portal. You can email us directly for rapid support.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Support Email</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{contactEmail}</div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Copy email address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Response Time</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Within 24 Hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <div className="p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Demo Logged</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-900 dark:text-white">{name}</span>! Since ConvertHub compiles to static serverless files, we don't save personal messages on servers.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  To get an actual reply, please copy and send your draft to <a href={`mailto:${contactEmail}`} className="text-indigo-600 underline font-semibold">{contactEmail}</a>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-150 text-xs font-bold hover:bg-indigo-100 transition-colors"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Send a Message</h2>
                
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-indigo-500 bg-gray-50/50 dark:bg-gray-900 focus:bg-white text-gray-900 dark:text-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-indigo-500 bg-gray-50/50 dark:bg-gray-900 focus:bg-white text-gray-900 dark:text-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Subject (Optional)
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-indigo-500 bg-gray-50/50 dark:bg-gray-900 focus:bg-white text-gray-900 dark:text-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your request, problem, or idea in detail..."
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-indigo-500 bg-gray-50/50 dark:bg-gray-900 focus:bg-white text-gray-900 dark:text-white focus:outline-none transition-all resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
