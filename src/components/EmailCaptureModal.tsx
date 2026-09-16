import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { EmailCaptureForm } from './EmailCaptureForm';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  pricingTier?: string;
  title?: string;
}

export const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({
  isOpen,
  onClose,
  source,
  pricingTier,
  title = 'Get My Free Idle Report',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="email-capture-modal-overlay"
      className="fixed inset-0 z-50 bg-[#22272B]/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="email-capture-modal"
        className="bg-white border border-[#DCD6CB] rounded-[6px] w-full max-w-lg p-6 sm:p-8 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          id="modal-close-button"
          aria-label="Close modal"
          className="absolute top-4 right-4 text-[#5B6167] hover:text-[#22272B] p-1.5 rounded-[6px] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FAF8F4] border border-[#DCD6CB] text-xs font-bold text-[#22272B] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22272B]" />
              {pricingTier ? `Founding Fleet Access · ${pricingTier} Plan` : 'Founding Fleet Early Access'}
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#22272B]">
              {title}
            </h3>
            <p className="text-[#5B6167] text-[15px] mt-1.5 leading-relaxed">
              Founding fleets get early access and their first Idle Cost Report free on their own machine data — no hardware, no commitment, just the number.
            </p>
          </div>

          <div className="pt-2">
            <EmailCaptureForm
              id="modal-capture"
              source={source}
              pricingTier={pricingTier}
              buttonText="Get my free idle report"
              compact={false}
            />
          </div>

          <div className="pt-3 border-t border-[#DCD6CB] text-[14px] text-[#5B6167] space-y-1">
            <p className="font-semibold text-[#22272B]">
              Are plain hour-meter readings really enough data to produce a dollar number I can trust?
            </p>
            <p className="text-[13px] leading-relaxed">
              Yes. Hour-meter readings plus shift logs let Rigpilot calculate exact idle delta against your loaded labor rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
