"use client";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type ButtonArrowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

const ButtonArrow = ({ title, ...rest }: ButtonArrowProps) => {
  return (
    <button
      className="w-fit px-6 py-2 sm:px-8 sm:py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-theme-btn font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 hover:gap-3"
      {...rest}
    >
      {title}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

export default ButtonArrow;
