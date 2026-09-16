import React from 'react';
import { LogoMark } from './LogoMark';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="bg-white border-t border-[#DCD6CB] py-10 text-sm text-[#5B6167]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <LogoMark size={24} />
          <span className="font-heading text-xl font-bold uppercase tracking-tight text-[#22272B]">
            Rigpilot
          </span>
          <span className="text-[#DCD6CB]">|</span>
          <span className="text-[13px] text-[#5B6167]">Idle Cost Intelligence for Small Fleets</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[14px]">
          <a href="#how-it-works" className="hover:text-[#22272B] transition-colors">
            How it works
          </a>
          <a href="#pricing" className="hover:text-[#22272B] transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[#22272B] transition-colors">
            FAQ
          </a>
          <span className="text-[#DCD6CB]">·</span>
          <span className="flex items-center gap-1.5 font-medium text-[13px] text-[#22272B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Operational
          </span>
          <span className="text-[#DCD6CB]">·</span>
          <span className="text-[13px]">© {new Date().getFullYear()} Rigpilot. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
