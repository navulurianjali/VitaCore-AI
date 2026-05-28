"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "violet" | "emerald" | "rose" | "amber" | "none";
  hoverEffect?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glowColor = "none",
  hoverEffect = true,
  animate = true,
  onClick,
}) => {
  // Subtle, professional accent borders — no neon glows
  const accents = {
    none: "",
    violet: "hover:border-violet-500/20",
    emerald: "hover:border-emerald-500/20",
    rose: "hover:border-rose-500/20",
    amber: "hover:border-amber-500/20",
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel transition-all duration-200 ${accents[glowColor]} ${
        onClick ? "cursor-pointer" : ""
      } ${hoverEffect ? "hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
export default GlassCard;
