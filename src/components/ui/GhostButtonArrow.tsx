"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnchorHTMLAttributes, ReactNode } from "react";

type GhostButtonArrowProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

const GhostButtonArrow = ({
  href,
  children,
  className,
  ...rest
}: GhostButtonArrowProps) => {
  return (
    <Link
      href={href}
      className={`
        group
        w-fit px-6 py-2 sm:px-8 sm:py-3
        bg-[var(--accent)]
       
       text-theme-btn
        rounded-lg
        transition-all duration-300
        flex items-center gap-2
        hover:border-[var(--accent)]
        hover:bg-[var(--accent)]
       shadow-[0px_-1px_12px_8px_rgba(0,_0,_0,_0.4)]
        hover:gap-3
        ${className ?? ""}
      `}
      {...rest}
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
};

export default GhostButtonArrow;
