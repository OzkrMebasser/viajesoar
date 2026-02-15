"use client";

import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonGlowerLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "link";
};

type ButtonGlowerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  onClick?: () => void;
  variant?: "button";
};

type ButtonGlowerProps = ButtonGlowerLinkProps | ButtonGlowerButtonProps;

const ButtonGlower = (props: ButtonGlowerProps) => {
  const baseClasses = `
    group
    w-fit px-6 py-2 sm:px-8 sm:py-3
    rounded-lg text-[17px] font-medium
    select-none cursor-pointer
    flex items-center gap-2
    
    text-[color-mix(in_srgb,var(--text)_50%,transparent)]
    bg-transparent
    border border-[color-mix(in_srgb,var(--text)_50%,transparent)]
    [box-shadow:0px_-1px_12px_8px_rgba(0,0,0,0.4)]
    
    transition-all duration-500 ease-in-out
    
    hover:text-theme-btn
    hover:bg-[var(--accent)]
    hover:border-[var(--accent)]
    hover:[text-shadow:0_0_3px_var(--text-btn),0_0_8px_var(--accent-secondary)]
    hover:[box-shadow:0_0_8px_var(--accent-secondary),0_0_15px_var(--accent),0_0_25px_var(--accent-hover)]
    hover:scale-105
    hover:gap-3
    
    focus:text-theme-btn
    focus:bg-[var(--accent)]
    focus:border-[var(--accent)]
    focus:[text-shadow:0_0_3px_var(--text-btn),0_0_8px_var(--accent-secondary)]
    focus:[box-shadow:0_0_8px_var(--accent-secondary),0_0_15px_var(--accent),0_0_25px_var(--accent-hover)]
    focus:scale-105
    
    active:scale-90
  `;

  if ('href' in props) {
    const { href, children, className, ...rest } = props;
    return (
      <Link href={href} className={`${baseClasses} ${className ?? ""}`} {...rest}>
        {children}
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    );
  }

  const { children, onClick, className, ...rest } = props;
  return (
    <button onClick={onClick} className={`${baseClasses} ${className ?? ""}`} {...rest}>
      {children}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
};

export default ButtonGlower;