import React from 'react';
import { LeadSubmission } from '../../lib/firebase';

interface SignupsSectionProps {
  leads: LeadSubmission[];
  loading: boolean;
  error: Error | null;
}

export const SignupsSection: React.FC<SignupsSectionProps> = ({ leads, loading, error }) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = todayStart - 6 * 24 * 60 * 60 * 1000;

  const countToday = leads.filter((l) => new Date(l.timestamp).getTime() >= todayStart).length;
  const countYesterday = leads.filter((l) => {
    const t = new Date(l.timestamp).getTime();
    return t >= yesterdayStart && t < todayStart;
  }).length;
  const count7Days = leads.filter((l) => new Date(l.timestamp).getTime() >= sevenDaysAgo).length;

  const formatSource = (source: string) => {
    switch (source) {
      case 'hero':
        return 'Hero CTA';
      case 'demo':
        return 'Demo Box';
      case 'pricing_snapshot':
        return 'Snapshot ($79)';
      case 'pricing_fleet':
        return 'Fleet ($199)';
      case 'pricing_multi_site':
        return 'Multi-Site ($499)';
      case 'final_cta':
        return 'Final CTA';
      default:
        return source || 'Direct';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
          Live Scoreboard
        </div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
          Signups Feed
        </h2>
      </div>

      {/* Count per day stats row (short numbers in columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-4 text-left">
          <div className="text-xs uppercase tracking-wider text-[#5B6167] font-semibold">
            Total Signups
          </div>
          <div className="text-3xl font-bold text-[#22272B] font-mono mt-1">
            {leads.length}
          </div>
        </div>
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-4 text-left">
          <div className="text-xs uppercase tracking-wider text-[#5B6167] font-semibold">
            Today
          </div>
          <div className="text-3xl font-bold text-[#22272B] font-mono mt-1">
            {countToday}
          </div>
        </div>
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-4 text-left">
          <div className="text-xs uppercase tracking-wider text-[#5B6167] font-semibold">
            Yesterday
          </div>
          <div className="text-3xl font-bold text-[#22272B] font-mono mt-1">
            {countYesterday}
          </div>
        </div>
        <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-4 text-left">
          <div className="text-xs uppercase tracking-wider text-[#5B6167] font-semibold">
            Last 7 Days
          </div>
          <div className="text-3xl font-bold text-[#22272B] font-mono mt-1">
            {count7Days}
          </div>
        </div>
      </div>

      {/* Feed Card */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left">
        {loading ? (
          <div className="py-8 text-center text-[#5B6167] text-sm">
            Syncing live leads from database...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-[#991B1B] text-sm">
            Failed to sync leads: {error.message}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-base font-semibold text-[#22272B]">No signups logged yet</p>
            <p className="text-sm text-[#5B6167] max-w-[45ch] mx-auto">
              Share the page with fleet owners using the Launch Kit below to begin collecting early access requests.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#DCD6CB]">
            {leads.map((lead) => (
              <div
                key={lead.id || lead.email + lead.timestamp}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="font-mono text-sm font-semibold text-[#22272B]">
                    {lead.email}
                  </div>
                  <div className="text-xs text-[#5B6167] flex items-center gap-2">
                    <span>{formatDate(lead.timestamp)}</span>
                    <span>·</span>
                    <span>{formatSource(lead.source)}</span>
                    {lead.pricingTier && (
                      <>
                        <span>·</span>
                        <span className="font-semibold text-[#22272B]">
                          Plan: {lead.pricingTier}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
