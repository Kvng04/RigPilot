import React from 'react';
import { Clock, Truck, UserX, FileText } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      id: 'problem-1',
      icon: Clock,
      text: "The excavator finishes the dig by lunch. The operator's on the clock until five.",
    },
    {
      id: 'problem-2',
      icon: Truck,
      text: 'The crusher sits waiting between truck loads — with a man in the seat the whole time.',
    },
    {
      id: 'problem-3',
      icon: UserX,
      text: "You can't find operators to hire, yet the ones you have spend half the shift watching parked iron.",
    },
    {
      id: 'problem-4',
      icon: FileText,
      text: "You know the idle time is there. You've just never seen the dollar number on paper.",
    },
  ];

  return (
    <section
      id="problem-section"
      className="py-16 sm:py-24 bg-white border-y border-[#DCD6CB]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        <div className="space-y-12">
          {/* Section Heading */}
          <div className="max-w-[700px] text-left">
            <h2
              id="problem-headline"
              className="font-heading text-3xl sm:text-[36px] font-bold uppercase tracking-tight text-[#22272B] leading-[1.15]"
            >
              The labor bill lands full. The fleet doesn't.
            </h2>
          </div>

          {/* 4 Open Columns with outline icons, no cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 pt-2">
            {problems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className="space-y-4 text-left border-l md:border-l-0 lg:border-l border-[#DCD6CB] pl-4 lg:pl-5 first:pl-0 first:border-l-0"
                >
                  <div className="w-10 h-10 rounded-[6px] border border-[#DCD6CB] bg-[#FAF8F4] flex items-center justify-center text-[#22272B]">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <p className="text-[17px] text-[#22272B] leading-[1.6] text-pretty">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
