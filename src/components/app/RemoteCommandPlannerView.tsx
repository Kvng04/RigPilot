import React, { useState } from 'react';
import { Gauge, ArrowRight, CheckCircle2, TrendingUp, DollarSign, Clock, ShieldCheck } from 'lucide-react';

interface RemoteCommandPlannerViewProps {
  onNavigateToWebinar: () => void;
}

export const RemoteCommandPlannerView: React.FC<RemoteCommandPlannerViewProps> = ({
  onNavigateToWebinar,
}) => {
  const [fleetSize, setFleetSize] = useState<number>(6);
  const [operatorWage, setOperatorWage] = useState<number>(68);
  const [idleHoursPerDay, setIdleHoursPerDay] = useState<number>(3.8);
  const [numberOfSites, setNumberOfSites] = useState<number>(3);

  // Calculations
  const workingDaysPerMonth = 22;
  const workingDaysPerYear = 22 * 12;

  // Traditional cost: full dedicated operator per machine
  const annualOnSiteLaborCost = fleetSize * operatorWage * 8 * workingDaysPerYear;

  // Idle wage waste per year
  const annualIdlePayrollWaste = fleetSize * operatorWage * idleHoursPerDay * workingDaysPerYear;

  // With Rigpilot 3-Seat Command: 1 remote operator handles 3 standby units across sites
  // Operator headcount reduces by ~50% for standby/intermittent tasks
  const consolidatedPilotsNeeded = Math.ceil(fleetSize / 2.5);
  const annualRemoteLaborCost = consolidatedPilotsNeeded * (operatorWage * 1.15) * 8 * workingDaysPerYear;

  // Rigpilot Pilot/Platform cost (~$2,000/mo for 2 machines or $1,200/mo platform)
  const annualPlatformCost = fleetSize * 650 * 12;

  const netAnnualSavings = Math.max(0, annualOnSiteLaborCost - (annualRemoteLaborCost + annualPlatformCost));
  const monthlyNetSavings = Math.round(netAnnualSavings / 12);
  const pilotCost = 4000; // 2 machines @ $2,000/mo
  const paybackWeeks = monthlyNetSavings > 0 ? ((pilotCost / monthlyNetSavings) * 4.33).toFixed(1) : '3.5';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
          Consolidation Economics
        </div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#22272B]">
          3-Seat Remote Command Pilot Planner
        </h1>
        <p className="text-sm text-[#5B6167] mt-1 max-w-[65ch]">
          Model how transitioning intermittent excavator, dozer, and loader standby time to a centralized remote pilot desk eliminates unworked payroll across multiple job sites.
        </p>
      </div>

      {/* Main Grid: Controls on Left, ROI on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls */}
        <div className="lg:col-span-6 bg-white border border-[#DCD6CB] rounded-[6px] p-6 space-y-6">
          <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-[#22272B] pb-3 border-b border-[#DCD6CB]">
            Fleet Operations Parameters
          </h2>

          <div className="space-y-5">
            {/* Fleet Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#22272B] uppercase tracking-wider">
                  Total Active Fleet Machines
                </span>
                <span className="font-mono font-bold text-[#22272B] text-sm">
                  {fleetSize} Machines
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
                className="w-full accent-[#22272B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#5B6167]">
                <span>2 machines</span>
                <span>10 machines</span>
                <span>20 machines</span>
              </div>
            </div>

            {/* Operator Wage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#22272B] uppercase tracking-wider">
                  Operator Loaded Hourly Wage ($/hr)
                </span>
                <span className="font-mono font-bold text-[#22272B] text-sm">
                  ${operatorWage}/hr
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="120"
                step="1"
                value={operatorWage}
                onChange={(e) => setOperatorWage(Number(e.target.value))}
                className="w-full accent-[#22272B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#5B6167]">
                <span>$45/hr (Base)</span>
                <span>$75/hr (Union/Regional)</span>
                <span>$120/hr (Full Burden)</span>
              </div>
            </div>

            {/* Idle Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#22272B] uppercase tracking-wider">
                  Average Idle Standby Time per Machine
                </span>
                <span className="font-mono font-bold text-[#22272B] text-sm">
                  {idleHoursPerDay} hrs/day
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.2"
                value={idleHoursPerDay}
                onChange={(e) => setIdleHoursPerDay(Number(e.target.value))}
                className="w-full accent-[#22272B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#5B6167]">
                <span>1.0 hr (High efficiency)</span>
                <span>3.5 hrs (Industry avg)</span>
                <span>6.0 hrs (Severe wait)</span>
              </div>
            </div>

            {/* Sites */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#22272B] uppercase tracking-wider">
                  Job Sites Spread
                </span>
                <span className="font-mono font-bold text-[#22272B] text-sm">
                  {numberOfSites} Active Sites
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={numberOfSites}
                onChange={(e) => setNumberOfSites(Number(e.target.value))}
                className="w-full accent-[#22272B] cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-xs text-[#5B6167] space-y-1">
            <span className="font-bold text-[#22272B]">Engineering Model Note:</span>
            <p>
              Remote command enables 1 certified operator to hot-swap control between 3 intermittent machines across sites in under 5 seconds, cutting redundant on-site standby payroll.
            </p>
          </div>
        </div>

        {/* Right: ROI Output Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#22272B] text-white rounded-[6px] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#A0A6AD]">
                Projected Net Annual Return
              </span>
              <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded text-[#F2A900]">
                {paybackWeeks}-week payback
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-4xl sm:text-5xl font-bold text-white tracking-tight">
                ${netAnnualSavings.toLocaleString()}
                <span className="text-sm font-sans font-normal text-[#A0A6AD]"> / year</span>
              </div>
              <div className="text-xs text-[#A0A6AD]">
                Net savings after remote hardware retrofit and platform costs (${monthlyNetSavings.toLocaleString()}/month).
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[#A0A6AD]">Current Annual Payroll Waste:</span>
                <div className="font-mono text-lg font-bold text-[#F2A900] mt-0.5">
                  ${Math.round(annualIdlePayrollWaste).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[#A0A6AD]">Operator Consolidation:</span>
                <div className="font-mono text-lg font-bold text-white mt-0.5">
                  {fleetSize} → {consolidatedPilotsNeeded} Pilots
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateToWebinar}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                Schedule 2-Machine Remote Pilot ($2,000/mo)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 space-y-3 text-xs">
            <div className="font-heading text-sm font-bold uppercase tracking-wider text-[#22272B]">
              Rigpilot Operational Deployment Milestones
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22272B] shrink-0 mt-0.5" />
                <span className="text-[#5B6167]">
                  <strong className="text-[#22272B]">No Machinery Modifications:</strong> Plugs into existing OEM CAN-bus diagnostic ports with ruggedized 4G/Starlink gateways.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22272B] shrink-0 mt-0.5" />
                <span className="text-[#5B6167]">
                  <strong className="text-[#22272B]">Instant Seat Switching:</strong> 1 remote operator at HQ commands 3 machines on demand when haul trucks arrive.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22272B] shrink-0 mt-0.5" />
                <span className="text-[#5B6167]">
                  <strong className="text-[#22272B]">Operator Shortage Defense:</strong> Protects job schedules when qualified operators call out or regional rates surge.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
