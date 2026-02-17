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
    group relative
    w-fit px-[calc(1.5rem-1px)] py-[calc(0.5rem-1px)] sm:px-[calc(2rem-1px)] sm:py-[calc(0.75rem-1px)]
    rounded-lg text-[17px] font-medium
    select-none cursor-pointer overflow-hidden
    flex items-center gap-2 isolation-auto
    
    text-white bg-transparent border border-white
    transition-all duration-300
    
    hover:text-[var(--text-btn)]
    hover:bg-[var(--accent)]
    hover:border-transparent
    hover:gap-3
    hover:[box-shadow:0_0_20px_var(--accent),inset_0_0_20px_rgba(255,255,255,0.1)]
    hover:scale-105
    
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
    
    active:scale-95
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