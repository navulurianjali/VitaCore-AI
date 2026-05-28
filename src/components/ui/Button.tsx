"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  ...props
}) => {
  const baseStyle =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer overflow-hidden";
  
  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 border border-primary/20",
    secondary:
      "bg-secondary hover:bg-secondary-hover text-white shadow-lg shadow-secondary/20 border border-secondary/10",
    glass:
      "glass-panel text-foreground hover:bg-white/10 dark:hover:bg-white/5 border border-foreground/10 hover:border-foreground/20",
    accent:
      "bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 border border-accent/15",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 border border-red-500/20",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className} ${
        isLoading ? "opacity-75 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : null}
      {children}
    </motion.button>
  );
};
export default Button;
