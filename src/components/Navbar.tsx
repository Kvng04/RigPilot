import React from 'react';
import { LogoMark } from './LogoMark';
import { Gauge } from 'lucide-react';

interface NavbarProps {
  onOpenCapture: (source: string) => void;
  onNavigateToApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCapture, onNavigateToApp }) => {
  const handleGoToApp = () => {
    if (onNavigateToApp) {
      onNavigateToApp();
    } else {
      window.history.pushState({}, '', '/app');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-white border-b border-[#DCD6CB]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand: Flat Vector Emblem + Wordmark */}
        <a
          href="#"
          id="navbar-brand"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <LogoMark size={32} className="transition-transform duration-200 group-hover:scale-105" />
          <span className="font-heading text-2xl sm:text-[26px] font-bold uppercase tracking-tight text-[#22272B]">
            Rigpilot
          </span>
        </a>

        {/* Anchor Links + CTA Buttons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#5B6167]">
            <a
              href="#how-it-works"
              id="nav-link-how-it-works"
              className="hover:text-[#22272B] transition-colors duration-150"
            >
              How it works
            </a>
            <a
              href="#pricing"
              id="nav-link-pricing"
              className="hover:text-[#22272B] transition-colors duration-150"
            >
              Pricing
            </a>
            <a
              href="#faq"
              id="nav-link-faq"
              className="hover:text-[#22272B] transition-colors duration-150"
            >
              FAQ
            </a>
          </nav>

          <button
            type="button"
            onClick={handleGoToApp}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-[#22272B] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#22272B] rounded-[6px] hover:bg-[#22272B] hover:text-[#FAF8F4] transition-all duration-150 active:scale-[0.97]"
          >
            <Gauge className="w-4 h-4" />
            <span>Command App</span>
          </button>

          <button
            type="button"
            id="nav-cta-btn"
            onClick={() => onOpenCapture('navbar')}
            className="btn-primary hidden sm:inline-flex"
          >
            Get free idle report
          </button>
        </div>
      </div>
    </header>
  );
};
