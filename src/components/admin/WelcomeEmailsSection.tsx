import React from 'react';
import { CopyButton } from './CopyButton';

export const WelcomeEmailsSection: React.FC = () => {
  const email1Subject1 = 'Your Rigpilot founding fleet access is confirmed';
  const email1Subject2 = 'Next steps for your machine idle report';
  const email1Body = `Thanks for requesting founding fleet early access to Rigpilot.

Here is exactly what happens next: over the next 48 hours, we are onboarding our initial cohort of small fleet owners (2-20 machines) across asphalt, excavation, and aggregate work.

If you signed up to review an idle report, you can simply reply to this email with a screenshot or exported CSV of last week's machine hours from any Cat, Deere, Komatsu, or manual log. We'll run it through our calculation model and send back a full dollar breakdown of your unworked labor hours at no charge.

I'll check in personally in two days with a quick note on how other contractors are bench-marking idle time.

Best regards,
Rigpilot Founder Team`;

  const email1Full = `Subject Option 1: ${email1Subject1}
Subject Option 2: ${email1Subject2}

${email1Body}`;

  const email2Subject1 = 'The 3-hour cut time payroll problem';
  const email2Subject2 = 'Quick question about your fleet idle hours';
  const email2Body = `Most owner-operators we speak with know their operators work hard, but multi-site logistics cause machines to sit idle between haul trucks, grade checks, and material drops.

On average, a 10-machine excavation or paving fleet loses 2.8 hours per machine per shift to non-productive engine idle. At standard regional operator wages plus fringe, that's roughly $1,400 to $2,200 per week in labor paid for zero yardage moved.

When you look at your jobs last week, which machine category (excavator, dozer, loader, or grader) felt like it sat the most waiting on trucks or site clearance?

Hit reply and let me know your fleet setup—I read and answer every reply directly.

Best regards,
Rigpilot Founder Team`;

  const email2Full = `Subject Option 1: ${email2Subject1}
Subject Option 2: ${email2Subject2}

${email2Body}`;

  const email3Subject1 = 'Can plain hour meters give accurate dollar numbers?';
  const email3Subject2 = 'The math behind your idle dollar calculation';
  const email3Body = `The most common question contractors ask us before trying Rigpilot is: "Are plain hour-meter readings really enough data to produce a dollar number I can trust?"

The answer is yes, because you don't need complex sub-second sensor feeds to catch structural labor leakage. By comparing engine run hours against operator timesheet hours and standard idle baseline curves for your equipment class, we isolate the gap where wages were paid while machines were in standby.

We are finishing the private command dashboard build for our founding fleet members this month.

If you'd like us to set up your machines and run your first 30 days of shifts free, reply 'YES' to this email and let me know how many machines you currently run.

Best regards,
Rigpilot Founder Team`;

  const email3Full = `Subject Option 1: ${email3Subject1}
Subject Option 2: ${email3Subject2}

${email3Body}`;

  return (
    <section className="space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#5B6167]">
          Nurture Sequence
        </div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#22272B]">
          Welcome Emails
        </h2>
      </div>

      {/* Email 1: Instant */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
          Email 1 · Send instantly upon lead signup
        </div>
        <div className="space-y-1 text-sm text-[#5B6167]">
          <div>
            <strong className="text-[#22272B]">Subject A:</strong> {email1Subject1}
          </div>
          <div>
            <strong className="text-[#22272B]">Subject B:</strong> {email1Subject2}
          </div>
        </div>
        <div className="text-[15px] sm:text-base leading-[1.6] text-[#22272B] whitespace-pre-line max-w-[75ch]">
          {email1Body}
        </div>
        <div className="pt-2 flex justify-start">
          <CopyButton textToCopy={email1Full} label="Copy Email 1" />
        </div>
      </div>

      {/* Email 2: Day 2 */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
          Email 2 · Send on Day 2
        </div>
        <div className="space-y-1 text-sm text-[#5B6167]">
          <div>
            <strong className="text-[#22272B]">Subject A:</strong> {email2Subject1}
          </div>
          <div>
            <strong className="text-[#22272B]">Subject B:</strong> {email2Subject2}
          </div>
        </div>
        <div className="text-[15px] sm:text-base leading-[1.6] text-[#22272B] whitespace-pre-line max-w-[75ch]">
          {email2Body}
        </div>
        <div className="pt-2 flex justify-start">
          <CopyButton textToCopy={email2Full} label="Copy Email 2" />
        </div>
      </div>

      {/* Email 3: Day 5 */}
      <div className="bg-white border border-[#DCD6CB] rounded-[6px] p-5 sm:p-6 text-left space-y-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#5B6167]">
          Email 3 · Send on Day 5
        </div>
        <div className="space-y-1 text-sm text-[#5B6167]">
          <div>
            <strong className="text-[#22272B]">Subject A:</strong> {email3Subject1}
          </div>
          <div>
            <strong className="text-[#22272B]">Subject B:</strong> {email3Subject2}
          </div>
        </div>
        <div className="text-[15px] sm:text-base leading-[1.6] text-[#22272B] whitespace-pre-line max-w-[75ch]">
          {email3Body}
        </div>
        <div className="pt-2 flex justify-start">
          <CopyButton textToCopy={email3Full} label="Copy Email 3" />
        </div>
      </div>
    </section>
  );
};
