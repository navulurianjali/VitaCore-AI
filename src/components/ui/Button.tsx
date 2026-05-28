"use client";

import React from "react";

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
  const base =
    "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer select-none";

  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-sm border border-primary/20",
    secondary:
      "bg-secondary hover:bg-secondary-hover text-white shadow-sm border border-secondary/20",
    glass:
      "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-[var(--border)] border border-[var(--border)]",
    accent:
      "bg-accent hover:bg-accent/90 text-white shadow-sm border border-accent/20",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-sm border border-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-9",
    lg: "px-5 py-2.5 text-sm h-10",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className} ${
        isLoading ? "opacity-60 cursor-not-allowed" : ""
      }`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
};
export default Button;
