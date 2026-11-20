// components/icon.tsx

import { Workflow } from "lucide-react";

type IconProps = {
  className?: string;
  size?: number;
  showDot?: boolean;
};

const Icon = ({ className, size = 44, showDot = true }: IconProps) => {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#111111]/20 bg-[#111111] shadow-md ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,84,30,0.25),transparent_60%)]" />

      {/* icon */}
      <Workflow
        className="relative z-10 text-[#F3EEE3]"
        size={size * 0.45}
        strokeWidth={2.2}
      />

      {/* status dot */}
      {showDot && (
        <div
          className="absolute rounded-full bg-[#D9541E] shadow-[0_0_8px_rgba(217,84,30,0.8)]"
          style={{
            width: size * 0.18,
            height: size * 0.18,
            bottom: size * 0.1,
            right: size * 0.1,
          }}
        />
      )}
    </div>
  );
};

export default Icon;
