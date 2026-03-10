"use client";

import React, { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "outline";
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;  
};

const BadgeGlower = ({ children, className = "", variant = "default" ,onClick}: BadgeProps) => {

  const variants = {
    default: `
      text-white
      border border-white/40
      bg-white/5
    `,
    accent: `
      text-[var(--text-btn)]
      border border-[var(--accent)]
      bg-[var(--accent)]/15
      shadow-[0_0_10px_var(--accent)]
    `,
    outline: `
      text-white
      border border-white
      bg-transparent
    `
  };

  const baseClasses = `
    relative
    inline-flex
    items-center
    justify-center
    px-3 py-1 sm:px-4 sm:py-1.5

    text-sm
    font-medium
    rounded-md

    backdrop-blur-sm
    overflow-hidden
    select-none

    transition-all
    duration-300

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
    before:duration-700

    hover:before:left-[100%]
  `;

  return (
    <span onClick={onClick}  className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default BadgeGlower;