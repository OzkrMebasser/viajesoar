"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Direction = "prev" | "next";

interface Props {
  title: string;
  href?: string;
  direction?: Direction;
}

const PaginatorButtonArrow = ({ title, href, direction = "next" }: Props) => {
  const baseClasses = `
    group relative
    w-fit px-4 py-1.5
    bg-[var(--accent)]
    text-theme-btn
    text-xs uppercase tracking-widest
    rounded-sm
    transition-all duration-300
    flex items-center gap-2
    overflow-hidden
    isolation-auto
    shadow-[2px_-1px_4px_2px_rgba(0,_0,_0,_0.08)]
    hover:bg-[var(--accent-hover)]
    hover:scale-105
    hover:gap-3
    hover:[box-shadow:0_0_15px_var(--accent),inset_0_0_15px_rgba(255,255,255,0.1)]
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

  const disabledClasses = `
    w-fit px-4 py-1.5
    text-xs uppercase tracking-widest
    rounded-sm
    flex items-center gap-2
    opacity-25 cursor-not-allowed
    border border-white/10
    text-white/40
    bg-white/5
  `;

  const icon = direction === "prev"
    ? <ArrowLeft className="relative z-10 w-3 h-3 group-hover:-translate-x-1 transition-transform" />
    : <ArrowRight className="relative z-10 w-3 h-3 group-hover:translate-x-1 transition-transform" />;

  if (!href) {
    return (
      <span className={disabledClasses}>
        {direction === "prev" && icon}
        <span>{title}</span>
        {direction === "next" && icon}
      </span>
    );
  }

  return (
    <Link href={href} className={baseClasses}>
      {direction === "prev" && icon}
      <span className="relative z-10">{title}</span>
      {direction === "next" && icon}
    </Link>
  );
};

export default PaginatorButtonArrow;