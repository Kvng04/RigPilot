import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../types';

export const FaqSection: React.FC = () => {
  // Allow multiple items to be toggled, with the first 2 open by default for readability
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true,
  });

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'Is this available yet?',
      answer: "Not yet — we're opening early access to founding fleets first. Sign up and you'll get first access when it launches, and your first Idle Cost Report is free. Early feedback from real fleets shapes what we build next.",
    },
    {
      id: 'faq-2',
      question: "I don't run telematics. Can I still use it?",
      answer: 'Yes. Hour-meter readings and a rough shift log are enough. If you do run Trackunit, Cat VisionLink, or JDLink, just paste the export — Rigpilot reads it either way.',
    },
    {
      id: 'faq-3',
      question: 'Is this remote control of my machines?',
      answer: 'Not today. Rigpilot starts with the math: what idle costs you and whether one operator could cover several seats. The remote command station — retrofit cameras and controls on your existing iron — is where this is headed, and the report tells you whether that math closes for your fleet first.',
    },
    {
      id: 'faq-4',
      question: 'Does this put my operators out of work?',
      answer: "Most fleets we've researched can't hire enough operators in the first place. The point is covering more iron with the crew you've got — and putting your best seat time where the work actually is.",
    },
    {
      id: 'faq-5',
      question: 'Who sees my fleet data?',
      answer: 'You do. Your numbers are never sold or shown to anyone else. Benchmarks use anonymized averages across many fleets — no machine, site, or company names, ever.',
    },
    {
      id: 'faq-6',
      question: 'Is it worth it for a fleet my size?',
      answer: "The report exists to answer exactly that. If your machines idle anywhere near the industry pattern — about five hours of an eight-hour shift — one week of one machine's idle labor costs more than a month of any plan here. If your fleet runs tight, the report tells you that too, and you've lost nothing.",
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-white border-y border-[#DCD6CB]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 space-y-12">
        <div className="max-w-[700px] text-left">
          <h2
            id="faq-headline"
            className="font-heading text-3xl sm:text-[36px] font-bold uppercase tracking-tight text-[#22272B] leading-[1.15]"
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* Single-column Accordion with 1px dividers */}
        <div className="max-w-[860px] divide-y divide-[#DCD6CB] border-y border-[#DCD6CB]">
          {faqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div key={faq.id} id={faq.id} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-[20px] sm:text-[22px] font-bold text-[#22272B] leading-snug group-hover:text-[#5B6167] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-[4px] border border-[#DCD6CB] bg-[#FAF8F4] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#22272B] text-[#FAF8F4] border-[#22272B]' : 'text-[#22272B]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 pb-1 pr-12 text-left">
                    <p className="text-[17px] text-[#5B6167] leading-[1.6] text-pretty">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
