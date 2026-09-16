import React, { useState } from 'react';
import { trackAnalyticsEvent, submitLead } from '../../lib/firebase';
import {
  Presentation,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Truck,
  Layers,
  Award,
  Sparkles,
} from 'lucide-react';

interface WebinarPilotViewProps {
  userId: string;
  userEmail: string;
}

export const WebinarPilotView: React.FC<WebinarPilotViewProps> = ({
  userId,
  userEmail,
}) => {
  // Form states
  const [webinarEmail, setWebinarEmail] = useState(userEmail || '');
  const [webinarSlot, setWebinarSlot] = useState('Thursday, 2:00 PM EST');
  const [webinarRegistered, setWebinarRegistered] = useState(false);

  const [pilotCompany, setPilotCompany] = useState('');
  const [pilotMachines, setPilotMachines] = useState('2 Machines ($4,000/mo)');
  const [pilotSiteLocation, setPilotSiteLocation] = useState('');
  const [pilotSubmitted, setPilotSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegisterWebinar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webinarEmail) return;
    setLoading(true);
    try {
      await submitLead({
        email: webinarEmail,
        source: `webinar_registration_${webinarSlot.replace(/\s+/g, '_')}`,
        pricingTier: 'webinar_free',
      });
      await trackAnalyticsEvent(userId, 'webinar_registered', { slot: webinarSlot });
      setWebinarRegistered(true);
    } catch (err) {
      console.error('Webinar registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPilot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({
        email: userEmail || webinarEmail,
        source: `pilot_request_${pilotCompany}`,
        pricingTier: 'pilot_program_$2000_mo',
      });
      await trackAnalyticsEvent(userId, 'pilot_requested', {
        company: pilotCompany,
        machines: pilotMachines,
        location: pilotSiteLocation,
      });
      setPilotSubmitted(true);
    } catch (err) {
      console.error('Pilot request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
          Value Ladder & Deployments
        </div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#22272B]">
          Webinar Briefings & Pilot Program Onboarding
        </h1>
        <p className="text-sm text-[#5B6167] mt-1 max-w-[65ch]">
          Join our live executive technical session on small fleet remote supervision or reserve a 2-machine hardware pilot for your active job sites.
        </p>
      </div>

      {/* Two Main Cards: Webinar + Pilot Program */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Free Remote Supervision Webinar (Bait) */}
        <div className="lg:col-span-6 bg-white border border-[#DCD6CB] rounded-[6px] p-6 sm:p-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6167] bg-[#FAF8F4] px-2.5 py-1 border border-[#DCD6CB] rounded">
                Tier 1 · Free Briefing
              </span>
              <span className="font-mono text-xs font-bold text-[#22272B]">45 Mins · Live Q&A</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
                Remote Supervision Live Webinar
              </h3>
              <p className="text-xs text-[#5B6167] leading-relaxed">
                A live online session demonstrating real telematics workflows, CAN-bus retrofit gateways, and cost-saving operator consolidation models for owner-led construction firms.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DCD6CB] text-xs">
              <div className="flex items-start gap-2 text-[#5B6167]">
                <CheckCircle2 className="w-4 h-4 text-[#22272B] shrink-0 mt-0.5" />
                <span>How to diagnose invisible idle payroll burn across multi-site jobs.</span>
              </div>
              <div className="flex items-start gap-2 text-[#5B6167]">
                <CheckCircle2 className="w-4 h-4 text-[#22272B] shrink-0 mt-0.5" />
                <span>Live demo: 1 operator hot-swapping between excavator and dozer seats.</span>
              </div>
              <div className="flex items-start gap-2 text-[#5B6167]">
                <CheckCircle2 className="w-4 h-4 text-[#22272B] shrink-0 mt-0.5" />
                <span>Zero machinery warranty voiding: OEM plug-and-play standards.</span>
              </div>
            </div>
          </div>

          {webinarRegistered ? (
            <div className="p-4 bg-[#FAF8F4] border border-[#22272B] rounded-[6px] space-y-2 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#22272B] mx-auto" />
              <div className="font-heading text-base font-bold uppercase text-[#22272B]">
                Seat Confirmed for {webinarSlot}
              </div>
              <p className="text-xs text-[#5B6167]">
                Calendar invitation sent to <strong className="text-[#22272B]">{webinarEmail}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegisterWebinar} className="space-y-3 pt-4 border-t border-[#DCD6CB]">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
                  Select Live Session
                </label>
                <select
                  value={webinarSlot}
                  onChange={(e) => setWebinarSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs"
                >
                  <option value="Thursday, 2:00 PM EST">Thursday, 2:00 PM EST (Live Walkthrough)</option>
                  <option value="Next Tuesday, 10:00 AM EST">Next Tuesday, 10:00 AM EST (Morning Briefing)</option>
                  <option value="On-Demand Recording">Instant On-Demand Recording Link</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                <Calendar className="w-4 h-4" />
                Reserve Free Webinar Seat
              </button>
            </form>
          )}
        </div>

        {/* Right: Pilot Program Setup ($2,000/mo/machine) (Frontend) */}
        <div className="lg:col-span-6 bg-[#22272B] text-white rounded-[6px] p-6 sm:p-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F2A900] bg-white/10 px-2.5 py-1 rounded">
                Tier 2 · Pilot Deployment
              </span>
              <span className="font-mono text-xs font-bold text-white">$2,000 / mo / machine</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-white">
                2-Machine Remote Supervision Pilot
              </h3>
              <p className="text-xs text-[#A0A6AD] leading-relaxed">
                Turnkey on-site deployment: we ship pre-configured plug-and-play telematics gateways, install the command station, and conduct 30-day guided pilot operations on your active job site.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-start gap-2 text-[#A0A6AD]">
                <CheckCircle2 className="w-4 h-4 text-[#F2A900] shrink-0 mt-0.5" />
                <span>2x Ruggedized 4G/Starlink CAN-bus telemetry gateways included.</span>
              </div>
              <div className="flex items-start gap-2 text-[#A0A6AD]">
                <CheckCircle2 className="w-4 h-4 text-[#F2A900] shrink-0 mt-0.5" />
                <span>Complete remote pilot desk setup + dual-joystick USB station.</span>
              </div>
              <div className="flex items-start gap-2 text-[#A0A6AD]">
                <CheckCircle2 className="w-4 h-4 text-[#F2A900] shrink-0 mt-0.5" />
                <span>Dedicated fleet engineer for weekly idle optimization reviews.</span>
              </div>
            </div>
          </div>

          {pilotSubmitted ? (
            <div className="p-4 bg-white/10 border border-[#F2A900] rounded-[6px] space-y-2 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#F2A900] mx-auto" />
              <div className="font-heading text-base font-bold uppercase text-white">
                Pilot Reservation Received
              </div>
              <p className="text-xs text-[#A0A6AD]">
                Our field engineering team will contact <strong className="text-white">{userEmail}</strong> within 1 business day for equipment VIN checks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestPilot} className="space-y-3 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#A0A6AD]">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={pilotCompany}
                    onChange={(e) => setPilotCompany(e.target.value)}
                    placeholder="e.g. Apex Excavating LLC"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-xs text-white placeholder-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#A0A6AD]">
                    Pilot Scope
                  </label>
                  <select
                    value={pilotMachines}
                    onChange={(e) => setPilotMachines(e.target.value)}
                    className="w-full px-3 py-2 bg-[#22272B] border border-white/20 rounded text-xs text-white"
                  >
                    <option value="2 Machines ($4,000/mo)">2 Machines ($4,000/mo)</option>
                    <option value="3 Machines ($6,000/mo)">3 Machines ($6,000/mo)</option>
                    <option value="4 Machines ($8,000/mo)">4 Machines ($8,000/mo)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22272B]"
              >
                Request 2-Machine Pilot Setup
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Full Value Ladder Overview */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCD6CB]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5B6167]">
            Full Rigpilot Service Portfolio
          </span>
          <span className="text-xs font-mono text-[#5B6167]">Asphalt · Quarry · Aggregate · Excavation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF8F4] border border-[#DCD6CB] rounded space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#22272B]" />
              <strong className="font-heading text-sm uppercase text-[#22272B]">SaaS Command Platform</strong>
            </div>
            <div className="font-mono font-bold text-[#22272B] text-base">$500 – $3,000 / mo</div>
            <p className="text-[#5B6167] leading-relaxed">
              Tiered by active connected machines. Includes multi-feed video routing, CAN-bus telematics, and audit export engine.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F4] border border-[#DCD6CB] rounded space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#22272B]" />
              <strong className="font-heading text-sm uppercase text-[#22272B]">Pilot Certification</strong>
            </div>
            <div className="font-mono font-bold text-[#22272B] text-base">$1,000 – $3,000 / op</div>
            <p className="text-[#5B6167] leading-relaxed">
              Trains your current heavy equipment operators to achieve multi-seat certification on the remote desk safely.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F4] border border-[#DCD6CB] rounded space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#22272B]" />
              <strong className="font-heading text-sm uppercase text-[#22272B]">Enterprise Custom</strong>
            </div>
            <div className="font-mono font-bold text-[#22272B] text-base">$25k – $50k Setup</div>
            <p className="text-[#5B6167] leading-relaxed">
              Full custom dispatch integrations, ERP timesheet syncing, and private quarry mesh network deployments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
