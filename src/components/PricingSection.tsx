import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectTier: (tierName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const tiers = [
    {
      id: 'tier-snapshot',
      name: 'Snapshot',
      price: '$79',
      period: '/mo',
      isRecommended: false,
      features: [
        'Up to 5 machines',
        'Monthly Idle Cost Report',
        'Coverage planner',
        'Email support',
      ],
      bestFor: 'single-site outfits putting a toe in the water.',
      buttonText: 'Get early access — Snapshot',
    },
    {
      id: 'tier-fleet',
      name: 'Fleet',
      price: '$199',
      period: '/mo',
      isRecommended: true,
      badge: 'Recommended',
      features: [
        'Up to 12 machines',
        'Weekly Idle Cost Reports',
        'Benchmark against fleets your size',
        'Priority support',
      ],
      bestFor: 'owner-led fleets running two to four sites.',
      buttonText: 'Get early access — Fleet',
    },
    {
      id: 'tier-multisite',
      name: 'Multi-Site',
      price: '$499',
      period: '/mo',
      isRecommended: false,
      features: [
        'Up to 25 machines',
        'Unlimited sites and users',
        'Quarterly savings review call',
        'Hands-on onboarding',
      ],
      bestFor: 'regional operations with a dedicated fleet manager.',
      buttonText: 'Get early access — Multi-Site',
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 sm:py-24 bg-[#FAF8F4]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 space-y-12">
        <div className="max-w-[700px] text-left">
          <h2
            id="pricing-headline"
            className="font-heading text-3xl sm:text-[36px] font-bold uppercase tracking-tight text-[#22272B] leading-[1.15]"
          >
            Priced under one idle hour a week
          </h2>
          <p className="text-[#5B6167] text-[17px] mt-2">
            Founding fleets receive early access and run their first Idle Cost Report free when it launches.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              id={tier.id}
              className={`relative bg-white rounded-[6px] p-6 sm:p-8 flex flex-col justify-between text-left transition-all ${
                tier.isRecommended
                  ? 'border-2 border-[#F2A900] lg:scale-[1.04] z-10'
                  : 'border border-[#DCD6CB]'
              }`}
            >
              {tier.isRecommended && (
                <div
                  id="pricing-recommended-badge"
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F2A900] text-[#22272B] font-bold text-[12px] uppercase px-3 py-1 rounded-[4px] tracking-wider"
                >
                  Recommended
                </div>
              )}

              <div className="space-y-6">
                <div className="border-b border-[#DCD6CB] pb-5 space-y-2">
                  <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-4xl sm:text-5xl font-bold text-[#22272B]">
                      {tier.price}
                    </span>
                    <span className="text-[#5B6167] text-base font-medium">
                      {tier.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#5B6167]">
                    Includes
                  </p>
                  <ul className="space-y-2.5 text-[15px] sm:text-[16px] text-[#22272B]">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#22272B] shrink-0 mt-1 stroke-[2.5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#DCD6CB] text-[14px] text-[#5B6167] leading-snug">
                  <strong className="text-[#22272B] font-semibold">Best for: </strong>
                  {tier.bestFor}
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  id={`btn-pricing-${tier.name.toLowerCase()}`}
                  onClick={() => onSelectTier(tier.name)}
                  className={`w-full ${
                    tier.isRecommended ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <span>{tier.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
