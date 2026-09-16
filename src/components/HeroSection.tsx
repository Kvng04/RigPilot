import React from 'react';
import { EmailCaptureForm } from './EmailCaptureForm';
import heroImg from '../assets/images/rigpilot_hero_1787578780281.jpg';

interface HeroSectionProps {
  onOpenCapture?: (source: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section
      id="hero-section"
      className="pt-12 sm:pt-16 pb-16 sm:pb-24 bg-[#FAF8F4] overflow-hidden"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Copy & Email Capture */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1
              id="hero-headline"
              className="text-4xl sm:text-[48px] font-extrabold uppercase tracking-tight text-[#22272B] leading-[1.05] text-balance font-heading"
            >
              Stop Paying Eight-Hour Wages <br className="hidden sm:inline" />for Three-Hour Machines
            </h1>

            <p
              id="hero-subheadline"
              className="text-[#5B6167] text-lg sm:text-[20px] leading-relaxed max-w-[540px]"
            >
              Rigpilot shows small fleet owners exactly what idle machines cost in labor — and how one operator could cover three seats.
            </p>

            {/* Email capture in hero */}
            <div className="pt-2 max-w-[540px]">
              <EmailCaptureForm
                id="hero-email-capture"
                source="hero_section"
                buttonText="Get my free idle report"
              />
            </div>

            {/* Credibility line with technical aesthetic */}
            <div
              id="hero-credibility-line"
              className="pt-4 border-t border-[#DCD6CB] text-[14px] text-[#5B6167] italic leading-relaxed max-w-[540px]"
            >
              On small fleets, a machine typically works about 3 hours of an 8-hour shift. The other 5 bill full labor while the iron sits.
            </div>
          </div>

          {/* Right Column: Clean Minimalist Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div
              id="hero-visual-frame"
              className="relative rounded-[6px] border border-[#DCD6CB] bg-[#22272B] overflow-hidden shadow-none aspect-video lg:aspect-[4/3] flex flex-col justify-between"
            >
              {/* Actual Image with Technical Command Center Overlay */}
              <div className="relative w-full h-full">
                <img
                  src={heroImg}
                  alt="One operator at a three-monitor command desk watching feeds from three machines on different sites"
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22272B]/90 via-[#22272B]/20 to-transparent"></div>

                {/* Floating telemetry HUD badges */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#22272B]/85 border border-[#5B6167] text-[10px] font-mono text-[#F2A900]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2A900] animate-pulse"></span>
                  <span>FEED_SYNC 100%</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#FAF8F4] font-mono border-t border-[#5B6167]/50 pt-2 bg-[#22272B]/80 px-2.5 py-1.5 rounded">
                  <span>COMMAND STATION 01 // REMOTE_LINK_STABLE</span>
                  <span className="text-[#F2A900] font-bold">3 FEEDS ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
