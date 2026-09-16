import React, { useState } from 'react';
import { submitLead } from '../lib/firebase';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface EmailCaptureFormProps {
  id?: string;
  source: string;
  pricingTier?: string;
  buttonText?: string;
  onSuccess?: () => void;
  className?: string;
  compact?: boolean;
}

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
  id = 'email-capture',
  source,
  pricingTier,
  buttonText = 'Get my free idle report',
  onSuccess,
  className = '',
  compact = false,
}) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check - bot detection
    if (honeypot.trim().length > 0) {
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({
        email: trimmedEmail,
        source,
        pricingTier,
      });
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Submission error:', err);
      // Even if offline/error occurs, provide graceful feedback
      setErrorMessage('Unable to submit right now. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        id={`${id}-success`}
        className="bg-white border border-[#DCD6CB] rounded-[6px] p-6 text-left"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#22272B] shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-bold text-[#22272B] text-[17px] leading-snug">
              You're on the founding-fleet list.
            </p>
            <p className="text-[#5B6167] text-[15px] leading-relaxed">
              When early access opens, you'll get a link to paste your machine hours and run your first Idle Cost Report free. Within two weeks we'll also send one short question about your fleet so your report fits how you actually run.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={`${id}-wrapper`} className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="w-full space-y-3" id={`${id}-form`}>
        {/* Hidden Honeypot Field for Spam Protection */}
        <div aria-hidden="true" className="opacity-0 absolute -left-[9999px] w-0 h-0 pointer-events-none">
          <label htmlFor={`${id}-hp`}>Company Tax ID</label>
          <input
            type="text"
            id={`${id}-hp`}
            name="company_tax_id"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={`flex ${compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'} gap-3 items-stretch`}>
          <div className="relative flex-1">
            <input
              type="email"
              id={`${id}-email-input`}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourcompany.com"
              className="w-full h-[52px] px-4 rounded-[6px] border border-[#DCD6CB] bg-white text-[#22272B] placeholder:text-[#5B6167] outline-none focus:border-[#F2A900] text-[16px] transition-colors"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            id={`${id}-submit-btn`}
            disabled={isSubmitting}
            className="btn-primary h-[52px] px-6 sm:px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-700 text-sm">{errorMessage}</p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[13px] sm:text-[14px] text-[#5B6167]">
          <p>No spam. One email when your report is ready to run. Unsubscribe anytime.</p>
        </div>
      </form>
    </div>
  );
};
