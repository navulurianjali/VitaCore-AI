"use client";

import React from "react";
import { motion } from "framer-motion";

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
  const glows = {
    none: "",
    violet: "shadow-[0_0_20px_rgba(139,92,246,0.06)] hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:border-violet-500/20",
    emerald: "shadow-[0_0_20px_rgba(16,185,129,0.06)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:border-emerald-500/20",
    rose: "shadow-[0_0_20px_rgba(244,63,94,0.06)] hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] hover:border-rose-500/20",
    amber: "shadow-[0_0_20px_rgba(245,158,11,0.06)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-500/20",
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={animate && hoverEffect ? { y: -4, scale: 1.005 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${glows[glowColor]} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
export default GlassCard;
