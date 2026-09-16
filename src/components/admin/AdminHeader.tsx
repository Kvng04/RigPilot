import React from 'react';
import { LogoMark } from '../LogoMark';
import { LogOut } from 'lucide-react';
import { logOutAdmin } from '../../lib/firebase';

interface AdminHeaderProps {
  userEmail: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4] border-b border-[#DCD6CB]">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark size={28} />
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-xl font-bold uppercase tracking-tight text-[#22272B]">
              Rigpilot
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B6167]">
              Launch HQ
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm text-[#5B6167] truncate max-w-[160px] sm:max-w-[240px]">
            {userEmail}
          </span>
          <button
            type="button"
            onClick={() => logOutAdmin()}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#5B6167] hover:text-[#22272B] px-2.5 py-1 rounded-[6px] border border-[#DCD6CB] hover:border-[#22272B] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};
