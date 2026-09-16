import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface ChecklistSectionProps {
  checklist: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
}

const CHECKLIST_ITEMS = [
  { id: 'page_live', label: 'Landing page live and verified at public URL' },
  { id: 'channel_1', label: 'Shared to Channel 1 (Reddit r/heavyequipment)' },
  { id: 'channel_2', label: 'Shared to Channel 2 (Facebook Groups · Grader & Dirt Operators)' },
  { id: 'channel_3', label: 'Shared to Channel 3 (LinkedIn / Regional Contractor Network)' },
  { id: 'dms_sent', label: 'Direct messages sent to 10 fleet owners' },
  { id: 'visitors_100', label: '100 visitors reached on landing page' },
  { id: 'verdict_read', label: 'Read conversion rate and evaluate validation verdict' },
];

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  checklist,
  onToggle,
}) => {
  const completedCount = CHECKLIST_ITEMS.filter((item) => checklist[item.id]).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
            Launch Protocol
          </div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
            Launch Checklist
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono text-sm font-bold text-[#22272B]">
            {completedCount}/{CHECKLIST_ITEMS.length} ({progressPercent}%)
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-3">
        <div className="divide-y divide-[#DCD6CB]">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checklist[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id, !isChecked)}
                className="w-full py-3 first:pt-0 last:pb-0 flex items-start gap-3 text-left group hover:bg-[#FAF8F4] -mx-2 px-2 rounded transition-colors"
              >
                <div className="mt-0.5 shrink-0 text-[#22272B]">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#22272B] fill-[#FAF8F4]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#5B6167] group-hover:text-[#22272B]" />
                  )}
                </div>
                <span
                  className={`text-[15px] sm:text-base leading-relaxed ${
                    isChecked
                      ? 'line-through text-[#5B6167]'
                      : 'text-[#22272B] font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
