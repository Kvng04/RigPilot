import React from 'react';
import { Calculator, Wrench, ClipboardList, MapPin, BarChart2, FileText } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      id: 'benefit-1',
      title: 'A dollar number, not a hunch',
      desc: 'Know exactly what idle iron costs you every week, in your own labor rates.',
      icon: Calculator,
    },
    {
      id: 'benefit-2',
      title: 'Works on a mixed-brand fleet',
      desc: 'Cat, Deere, Komatsu, crushers — if it has an hour meter, it counts.',
      icon: Wrench,
    },
    {
      id: 'benefit-3',
      title: 'Nothing to install',
      desc: 'No hardware, no wiring, no downtime. Paste data, get a report.',
      icon: ClipboardList,
    },
    {
      id: 'benefit-4',
      title: 'Plan operator coverage across sites',
      desc: 'See which seats one operator could cover before you change a single schedule.',
      icon: MapPin,
    },
    {
      id: 'benefit-5',
      title: 'Know where you stand',
      desc: 'Compare your idle percentage against fleets your size, not 500-machine outfits.',
      icon: BarChart2,
    },
    {
      id: 'benefit-6',
      title: 'Ready for the Monday meeting',
      desc: 'Export a clean PDF your foreman and your accountant both understand.',
      icon: FileText,
    },
  ];

  return (
    <section
      id="benefits-section"
      className="py-16 sm:py-24 bg-white border-y border-[#DCD6CB]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 space-y-12">
        <div className="max-w-[700px] text-left">
          <h2
            id="benefits-headline"
            className="font-heading text-3xl sm:text-[36px] font-bold uppercase tracking-tight text-[#22272B] leading-[1.15]"
          >
            Built for how small fleets actually run
          </h2>
        </div>

        {/* 6 Bordered Cards on Surface (3 cols desktop, 1 col mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                id={b.id}
                className="bg-white border border-[#DCD6CB] rounded-[6px] p-6 space-y-4 text-left flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-[6px] border border-[#DCD6CB] bg-[#FAF8F4] flex items-center justify-center text-[#22272B] shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-[20px] font-bold text-[#22272B] leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-[16px] text-[#5B6167] leading-[1.6] text-pretty">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
