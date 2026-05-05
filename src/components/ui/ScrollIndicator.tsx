"use client";

interface ScrollIndicatorProps {
  targetId: string;
  label?: string;
}

 {/* Scroll indicator */}

const ScrollIndicator = ({ targetId, label = "scroll" }: ScrollIndicatorProps) => {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
      onClick={handleClick}
    >
      <style>{`
        @keyframes chevBounce {
          0%   { translate: 0 0px;  opacity: 0.3; }
          50%  { translate: 0 5px;  opacity: 1; }
          100% { translate: 0 0px;  opacity: 0.3; }
        }
      `}</style>

      <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">
        {label}
      </span>

      {[0, 0.2].map((delay, i) => (
        <div
          key={i}
          className="w-3 h-3 border-r border-b border-white/60"
          style={{
            transform: "rotate(45deg)",
            animation: "chevBounce 1.4s ease-in-out infinite",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ScrollIndicator;