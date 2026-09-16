import React from 'react';
import { LogoMark } from '../LogoMark';
import { LogOut, ArrowLeft } from 'lucide-react';
import { logOut } from '../../lib/firebase';
import type { User } from 'firebase/auth';

interface AppHeaderProps {
  user: User | null;
  activeTab: string;
  onNavigateHome: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  activeTab,
  onNavigateHome,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'diagnostic':
        return 'Shift Telematics Diagnostic';
      case 'fleet':
        return 'Fleet Machinery Roster';
      case 'planner':
        return '3-Seat Remote Command Planner';
      case 'audits':
        return 'Shift Audit Archive';
      case 'webinar':
        return 'Webinar & Pilot Onboarding';
      default:
        return 'Command Station';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4] border-b border-[#DCD6CB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Branding + Section Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            title="Return to Public Site"
            className="flex items-center gap-2 text-[#5B6167] hover:text-[#22272B] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <LogoMark size={28} />
          </button>
          <div className="h-5 w-[1px] bg-[#DCD6CB] hidden sm:block" />
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold uppercase tracking-tight text-[#22272B] leading-none">
              Rigpilot Command
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5B6167] mt-0.5">
              {getTabTitle(activeTab)}
            </span>
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-semibold text-[#22272B]">
              {user?.displayName || 'Fleet Superintendent'}
            </span>
            <span className="text-[11px] font-mono text-[#5B6167] truncate max-w-[180px]">
              {user?.email}
            </span>
          </div>

          <button
            type="button"
            onClick={() => logOut()}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5B6167] hover:text-[#22272B] px-3 py-1.5 rounded-[6px] border border-[#DCD6CB] hover:border-[#22272B] transition-all duration-150 active:scale-[0.97]"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
