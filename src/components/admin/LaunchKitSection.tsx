import React from 'react';
import { CopyButton } from './CopyButton';

interface LaunchKitSectionProps {
  liveUrl: string;
  onLiveUrlChange: (url: string) => void;
}

export const LaunchKitSection: React.FC<LaunchKitSectionProps> = ({
  liveUrl,
  onLiveUrlChange,
}) => {
  const urlToUse = liveUrl.trim() || window.location.origin;

  const post1Text = `We kept seeing machines sitting on site for 4-5 hours of an 8-hour shift while the labor meter ran the entire time. When operators are tough to hire and fuel and wages keep climbing, machine idle eats into job margins before anyone catches it on a spreadsheet.

I put together a page for this to see if owner-led fleets (2-20 machines) would want an automated idle-hour monitor that flags machine burn versus active cut time without needing expensive telematics boxes.

Would love honest feedback from guys running iron in excavation, quarry, or paving: ${urlToUse}`;

  const post2Text = `Question for fleet owners and site supers running 2 to 20 machines across multiple jobs:

How do you track actual machine work hours vs idle standby during the day? Most supervisors we talked to only find out a 30-ton excavator sat for 3.5 hours when the payroll invoice comes in on Friday.

I put together a page for a lightweight remote command tool that takes your hour readings or telematics and calculates exact unworked payroll costs every shift: ${urlToUse}

Looking for honest feedback on whether this solves a real headache on your sites or if you already have a better way.`;

  const post3Text = `Hi [Name], saw your recent civil and excavation work in the region.

Reaching out because several independent contractors running 2-20 machines mentioned that labor shortages make machine idle time far more expensive this year—paying 8-hour operator rates for 3 hours of actual machine cycling.

I put together a page for an automated idle-cost command station built specifically for small fleet owners: ${urlToUse}

Would appreciate 2 minutes of your candid thoughts on whether this would save your supervisors time on site.`;

  return (
    <section className="space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
          Distribution
        </div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
          Launch Kit
        </h2>
      </div>

      {/* Live URL Input */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-2">
        <label
          htmlFor="live-url-input"
          className="block text-xs uppercase tracking-wider font-semibold text-[#5B6167]"
        >
          Your Live Landing Page URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="live-url-input"
            type="url"
            value={liveUrl}
            onChange={(e) => onLiveUrlChange(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3.5 py-2.5 bg-[#FAF8F4] border border-[#DCD6CB] rounded-[6px] text-sm text-[#22272B] font-mono focus:outline-none focus:border-[#22272B]"
          />
        </div>
        <p className="text-xs text-[#5B6167]">
          Editing this field automatically updates all share links and email templates below.
        </p>
      </div>

      {/* Post 1: Reddit */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
          Post 1 · Reddit (r/heavyequipment · 42K+ operators & fleet owners)
        </div>
        <div className="text-[15px] sm:text-base leading-[1.6] text-[#22272B] whitespace-pre-line max-w-[75ch]">
          {post1Text}
        </div>
        <div className="pt-2 flex justify-start">
          <CopyButton textToCopy={post1Text} label="Copy Reddit Post" />
        </div>
      </div>

      {/* Post 2: Facebook Groups */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
          Post 2 · Facebook Groups (Grader & Excavation Operators · 295K+)
        </div>
        <div className="text-[15px] sm:text-base leading-[1.6] text-[#22272B] whitespace-pre-line max-w-[75ch]">
          {post2Text}
        </div>
        <div className="pt-2 flex justify-start">
          <CopyButton textToCopy={post2Text} label="Copy Facebook Post" />
        </div>
      </div>

      {/* Post 3: LinkedIn / Direct Message */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
          Post 3 · LinkedIn / Direct Message (Regional Contractors)
        </div>
        <div className="text-[15px] sm:text-base leading-[1.6] text-[#22272B] whitespace-pre-line max-w-[75ch]">
          {post3Text}
        </div>
        <div className="pt-2 flex justify-start">
          <CopyButton textToCopy={post3Text} label="Copy Direct Message" />
        </div>
      </div>
    </section>
  );
};
