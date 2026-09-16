import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy text',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.97] ${
        copied
          ? 'bg-[#22272B] text-white'
          : 'bg-[#F2A900] text-[#1B1F22] hover:bg-[#D89700]'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-[2.2]" />
          Copied to clipboard
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 stroke-[2.2]" />
          {label}
        </>
      )}
    </button>
  );
};
