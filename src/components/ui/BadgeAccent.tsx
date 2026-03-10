"use client";

import { ReactNode } from "react";

type BadgeAccentProps = {
  children: ReactNode;
  className?: string;
};

const BadgeAccent = ({ children, className = "" }: BadgeAccentProps) => {
  const baseClasses = `
    group relative
    inline-flex items-center
    w-fit px-3 py-1 sm:px-4 sm:py-1.5

    text-sm font-medium
    rounded-md

    bg-[var(--accent)]
    text-theme-btn

    transition-all duration-300
    overflow-hidden
    isolation-auto

    shadow-[2px_-1px_4px_2px_rgba(0,_0,_0,_0.08)]

     shadow-[2px_-1px_4px_2px_rgba(0,_0,_0,_0.08)]
    
    hover:bg-[var(--accent-hover)]
    hover:scale-105
    hover:gap-4
    hover:[box-shadow:0_0_20px_var(--accent),inset_0_0_20px_rgba(255,255,255,0.1)]
    
    before:content-['']
    before:absolute
    before:top-0
    before:left-[-100%]
    before:w-full
    before:h-full
    before:bg-gradient-to-r
    before:from-transparent
    before:via-white/30
    before:to-transparent
    before:transition-all
    before:duration-500
    hover:before:left-[100%]
  `;

  return (
    <span className={`${baseClasses} ${className}`}>
      <span className="relative z-10">
        {children}
      </span>
    </span>
  );
};

export default BadgeAccent;