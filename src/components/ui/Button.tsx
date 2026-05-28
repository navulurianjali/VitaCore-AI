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
    "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer select-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/10 border border-primary/10",
    secondary:
      "bg-secondary hover:bg-secondary-hover text-white shadow-md shadow-secondary/10 border border-secondary/10",
    glass:
      "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-[var(--border)] border border-[var(--border)] hover:shadow-sm",
    accent:
      "bg-accent hover:bg-accent/95 text-white shadow-md shadow-accent/10 border border-accent/10",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/10 border border-red-500/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs h-8 rounded-lg",
    md: "px-4 py-2 text-sm h-9.5",
    lg: "px-5 py-2.5 text-sm h-11",
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
