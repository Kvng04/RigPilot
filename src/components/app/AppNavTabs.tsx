import React from 'react';
import { Activity, Truck, Gauge, History, Presentation } from 'lucide-react';

interface AppNavTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  auditCount?: number;
  machineCount?: number;
}

export const AppNavTabs: React.FC<AppNavTabsProps> = ({
  activeTab,
  onSelectTab,
  auditCount = 0,
  machineCount = 0,
}) => {
  const tabs = [
    {
      id: 'diagnostic',
      label: 'Shift Diagnostic',
      caption: 'Hero Engine',
      icon: Activity,
      badge: null,
    },
    {
      id: 'fleet',
      label: 'Machinery Roster',
      caption: 'Fleet Units',
      icon: Truck,
      badge: machineCount > 0 ? machineCount : null,
    },
    {
      id: 'planner',
      label: 'Remote Planner',
      caption: '3-Seat ROI',
      icon: Gauge,
      badge: null,
    },
    {
      id: 'audits',
      label: 'Shift Archive',
      caption: 'History',
      icon: History,
      badge: auditCount > 0 ? auditCount : null,
    },
    {
      id: 'webinar',
      label: 'Webinar & Pilots',
      caption: 'Value Ladder',
      icon: Presentation,
      badge: null,
    },
  ];

  return (
    <nav className="border-b border-[#DCD6CB] bg-white overflow-x-auto no-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-2 sm:gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'border-[#22272B] text-[#22272B] font-semibold'
                  : 'border-transparent text-[#5B6167] hover:text-[#22272B] hover:border-[#DCD6CB]'
              }`}
            >
              <Icon className={`w-4 h-4 stroke-[1.75] ${isActive ? 'text-[#22272B]' : 'text-[#5B6167]'}`} />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span className="font-mono text-[11px] px-1.5 py-0.2 bg-[#FAF8F4] border border-[#DCD6CB] rounded text-[#5B6167]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
