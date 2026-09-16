import React from 'react';

interface VerdictSectionProps {
  totalSignups: number;
  visitorCount: number;
  onVisitorCountChange: (count: number) => void;
}

export const VerdictSection: React.FC<VerdictSectionProps> = ({
  totalSignups,
  visitorCount,
  onVisitorCountChange,
}) => {
  const visitors = Math.max(0, visitorCount || 0);
  const conversionRate = visitors > 0 ? (totalSignups / visitors) * 100 : 0;
  const formattedRate = conversionRate.toFixed(1);

  const getVerdict = () => {
    if (visitors === 0) {
      return {
        tier: 'pending',
        title: 'Enter visitor count above',
        text: 'Input the approximate number of visitors from your traffic sources to calculate your conversion rate and reveal your launch verdict.',
      };
    }
    if (conversionRate >= 10) {
      return {
        tier: 'strong',
        title: 'Real interest. Build the full product.',
        text: 'Your conversion rate exceeds 10%. Fleet operators and owners are feeling this exact labor-burn pain point and are ready for the remote command station. Begin onboarding your founding cohort.',
      };
    }
    if (conversionRate >= 3) {
      return {
        tier: 'moderate',
        title: 'There\'s a pulse, but the pitch is off. Change the headline or the offer and share again.',
        text: 'You have initial engagement (3–9%), but the value proposition or copy angle is not sharp enough yet. Test positioning angles like direct operator wage comparisons vs pure uptime.',
      };
    }
    return {
      tier: 'weak',
      title: 'Let this one go and grab the next idea. That\'s the system working.',
      text: 'Under 3% conversion indicates low resonance with small fleet managers under current positioning. Do not invest months building iron telematics integrations without proven demand.',
    };
  };

  const verdict = getVerdict();

  return (
    <section className="space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
          Decision Engine
        </div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
          Validation Verdict
        </h2>
      </div>

      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-6">
        {/* Visitor Input & Stat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-[#DCD6CB]">
          <div className="space-y-1 sm:col-span-1">
            <label
              htmlFor="visitors-input"
              className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]"
            >
              Approximate Visitors
            </label>
            <input
              id="visitors-input"
              type="number"
              min="0"
              value={visitorCount || ''}
              onChange={(e) => onVisitorCountChange(parseInt(e.target.value, 10) || 0)}
              placeholder="e.g. 100"
              className="w-full px-3.5 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-base text-[#22272B] font-mono focus:outline-none focus:border-[#22272B]"
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Total Signups
            </div>
            <div className="text-2xl font-bold text-[#22272B] font-mono py-1">
              {totalSignups}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
              Conversion Rate
            </div>
            <div className="text-2xl font-bold text-[#22272B] font-mono py-1">
              {formattedRate}%
            </div>
          </div>
        </div>

        {/* Verdict Result */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
            Outcome
          </div>
          <div
            className={`p-4 rounded-[6px] border ${
              verdict.tier === 'strong'
                ? 'bg-[#FAF8F4] border-[#F2A900]'
                : verdict.tier === 'moderate'
                ? 'bg-[#FAF8F4] border-[#22272B]'
                : verdict.tier === 'weak'
                ? 'bg-[#FAF8F4] border-[#DCD6CB]'
                : 'bg-[#FAF8F4] border-[#DCD6CB]'
            }`}
          >
            <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#22272B]">
              {verdict.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-[#5B6167] mt-1.5 max-w-[75ch]">
              {verdict.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
