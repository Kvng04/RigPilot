import React from 'react';
import { EmailCaptureForm } from './EmailCaptureForm';

export const FinalCtaSection: React.FC = () => {
  return (
    <section
      id="final-cta-section"
      className="py-20 sm:py-28 bg-[#FAF8F4] text-center"
    >
      <div className="max-w-[760px] mx-auto px-4 sm:px-8 space-y-8">
        <h2
          id="final-cta-headline"
          className="font-heading text-3xl sm:text-[44px] font-bold uppercase tracking-tight text-[#22272B] leading-[1.1] text-balance"
        >
          Every shift your iron sits, the labor bill doesn't.
        </h2>

        <p
          id="final-cta-subtext"
          className="text-[#5B6167] text-lg sm:text-[19px] leading-[1.6] max-w-[58ch] mx-auto"
        >
          Founding fleets get early access and their first Idle Cost Report free — no hardware, no commitment, just the number.
        </p>

        {/* Final CTA Email Capture Form */}
        <div className="pt-2 max-w-[540px] mx-auto">
          <EmailCaptureForm
            id="final-email-capture"
            source="final_cta_section"
            buttonText="Get my free idle report"
          />
        </div>
      </div>
    </section>
  );
};
