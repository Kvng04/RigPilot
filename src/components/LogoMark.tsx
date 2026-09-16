import React from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Rigpilot Emblem"
    >
      {/* Heavy Excavator Bucket Profile */}
      <path
        d="M6 26L10 14H24L26 22L20 28H10L6 26Z"
        stroke="#22272B"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FAF8F4"
      />
      {/* Bucket Teeth details */}
      <path
        d="M6 26L4 28M10 28L9 30M15 28L15 30.5M20 28L21 30"
        stroke="#22272B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hydraulic / Arm Joint Mount */}
      <circle cx="20" cy="16" r="2" fill="#22272B" />
      <path
        d="M20 16L27 12"
        stroke="#22272B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Signal Arc 1 (Inner, Linework) */}
      <path
        d="M24 8C26.5 8 28.5 10 29.5 12"
        stroke="#22272B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Signal Arc 2 (Middle, Filled Accent #F2A900) */}
      <path
        d="M26 4C30 4 33.5 7.5 35 11"
        stroke="#F2A900"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Signal Arc 3 (Outer, Linework) */}
      <path
        d="M28 1C33.5 1 37.5 5 39 9"
        stroke="#22272B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
