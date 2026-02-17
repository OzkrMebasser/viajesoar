"use client";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type ButtonArrowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

const ButtonArrow = ({ title, ...rest }: ButtonArrowProps) => {
  return (
    <button
      className="
        group relative
        w-fit px-6 py-2 sm:px-8 sm:py-3
        bg-[var(--accent)]
        text-theme-btn
        rounded-lg
        transition-all duration-300
        flex items-center gap-2
        overflow-hidden
        isolation-auto
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
      "
      {...rest}
    >
      <span className="relative z-10">{title}</span>
      <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

export default ButtonArrow;