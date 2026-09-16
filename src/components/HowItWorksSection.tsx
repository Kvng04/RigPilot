import React from 'react';
import { EmailCaptureForm } from './EmailCaptureForm';
import { FileSpreadsheet, BarChart3, Radio } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenCapture?: (source: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
  const steps = [
    {
      num: '1',
      title: 'Paste your machine hours.',
      desc: 'Pull them from your telematics export or straight off the hour meters — Rigpilot splits working hours from idle for every machine.',
      icon: FileSpreadsheet,
    },
    {
      num: '2',
      title: 'Get your Idle Cost Report.',
      desc: 'See the labor dollars paid against parked machines, per machine, per day, per week — at your own loaded labor rate.',
      icon: BarChart3,
    },
    {
      num: '3',
      title: 'See your coverage plan.',
      desc: "Rigpilot flags which machines' work cycles don't overlap, so you know how many seats one operator could actually cover.",
      icon: Radio,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 bg-[#FAF8F4]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header & Steps */}
        <div className="space-y-12">
          <div className="max-w-[700px] text-left">
            <h2
              id="how-it-works-headline"
              className="font-heading text-3xl sm:text-[36px] font-bold uppercase tracking-tight text-[#22272B] leading-[1.15]"
            >
              From hour meters to a dollar number
            </h2>
          </div>

          {/* 3 Numbered Open Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {steps.map((step) => (
              <div key={step.num} id={`step-${step.num}`} className="space-y-3.5 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-[6px] border border-[#22272B] bg-[#22272B] text-[#FAF8F4] font-heading font-bold text-lg flex items-center justify-center">
                    {step.num}
                  </span>
                  <h3 className="font-heading text-[22px] font-bold text-[#22272B] leading-snug">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[17px] text-[#5B6167] leading-[1.6] text-pretty">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Panels Header Introduction */}
        <div className="pt-8 border-t border-[#DCD6CB] space-y-6">
          <div className="text-left">
            <h3
              id="demo-intro"
              className="text-[14px] font-bold uppercase tracking-widest text-[#5B6167]"
            >
              Here's a real report, built from four machines' hour data
            </h3>
          </div>

          {/* Side-by-side Demo Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Panel: Input ("What you paste") */}
            <div
              id="demo-panel-input"
              className="lg:col-span-6 bg-white border border-[#DCD6CB] rounded-[6px] p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCD6CB] pb-2.5">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-[#5B6167]">
                    What you paste
                  </span>
                  <span className="text-[11px] font-mono text-[#5B6167] bg-[#FAF8F4] px-2 py-0.5 rounded border border-[#DCD6CB]">
                    JSON / CSV / RAW
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <pre className="font-mono text-[13px] sm:text-[14px] leading-relaxed text-[#22272B] whitespace-pre">
{`Machine              Site          Engine hrs   Working hrs
CAT 320 excavator    Route 9 pit      8.2           3.1
Komatsu PC210        Miller site      7.9           3.6
Deere 310SL          Miller site      8.0           2.4
Metso LT106 crusher  Route 9 pit      8.4           4.2`}
                  </pre>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#DCD6CB] text-xs font-mono text-[#5B6167]">
                * Accepts CSV, Excel, Cat VisionLink, Trackunit, JDLink, or plain manual shift notes.
              </div>
            </div>

            {/* Right Panel: Output ("What you get back") */}
            <div
              id="demo-panel-output"
              className="lg:col-span-6 bg-white border-t-[2px] border-t-[#F2A900] border-x border-b border-[#DCD6CB] rounded-[6px] p-6 flex flex-col justify-between space-y-4"
            >
              {/* Header Row */}
              <div className="space-y-1.5 border-b border-[#DCD6CB] pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-[#22272B]">
                    Rigpilot Idle Cost Report — Week of Mar 3
                  </span>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#FAF8F4] border border-[#DCD6CB] text-[#5B6167]">
                    Loaded Rate: $42/hr
                  </span>
                </div>
                <p className="text-xs font-mono text-[#5B6167]">
                  Fleet: 4 machines · 2 sites · 8-hour shift base
                </p>
              </div>

              {/* Four Machine Line Items */}
              <div className="space-y-2 text-[14px] text-[#22272B] font-mono">
                <div className="flex justify-between items-center border-b border-[#FAF8F4] pb-1.5">
                  <span>CAT 320 — Route 9 pit: idle 5.1 hrs (62%)</span>
                  <span className="font-bold text-[#F2A900] text-[15px] sm:text-[16px]">$214/day</span>
                </div>

                <div className="flex justify-between items-center border-b border-[#FAF8F4] pb-1.5">
                  <span>Komatsu PC210 — Miller site: idle 4.3 hrs (54%)</span>
                  <span className="font-bold text-[#F2A900] text-[15px] sm:text-[16px]">$181/day</span>
                </div>

                <div className="flex justify-between items-center border-b border-[#FAF8F4] pb-1.5">
                  <span>Deere 310SL — Miller site: idle 5.6 hrs (70%)</span>
                  <span className="font-bold text-[#F2A900] text-[15px] sm:text-[16px]">$235/day</span>
                </div>

                <div className="flex justify-between items-center border-b border-[#FAF8F4] pb-1.5">
                  <span>Metso LT106 — Route 9 pit: idle 4.2 hrs (50%)</span>
                  <span className="font-bold text-[#F2A900] text-[15px] sm:text-[16px]">$176/day</span>
                </div>
              </div>

              {/* Fleet Total Row */}
              <div className="pt-2 border-t border-[#DCD6CB] flex justify-between items-center">
                <span className="font-bold text-[15px] uppercase tracking-tight text-[#22272B]">
                  Fleet Total
                </span>
                <span className="text-[#F2A900] font-bold text-[18px] sm:text-[20px] font-mono">
                  $806/day ($4,030/wk)
                </span>
              </div>

              {/* Coverage Plan Callout Box */}
              <div className="p-3.5 bg-[#FAF8F4] rounded-[6px] border border-[#DCD6CB] text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-[#22272B]">
                  Coverage Plan
                </span>
                <p className="text-[13px] leading-relaxed text-[#5B6167]">
                  Working cycles on CAT 320, Deere 310SL, and PC210 overlap less than 45 min/day. One command-station operator could cover all three seats. <strong className="text-[#22272B]">Estimated seats freed: 2.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Email Capture immediately after demo panels */}
          <div
            id="demo-capture-container"
            className="pt-6 max-w-[600px] mx-auto text-center space-y-4"
          >
            <h3 className="font-heading text-2xl font-bold text-[#22272B]">
              Run the numbers on your own iron
            </h3>
            <EmailCaptureForm
              id="demo-email-capture"
              source="demo_panels_followup"
              buttonText="Get my free idle report"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
