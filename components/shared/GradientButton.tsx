"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function GradientButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}: GradientButtonProps) {
  
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg h-8",
    md: "px-4.5 py-2.5 text-xs md:text-sm rounded-xl h-11",
    lg: "px-6 py-3.5 text-sm md:text-base rounded-xl h-14",
  };

  const variantClasses = {
    primary: "relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold border-0 shadow-lg shadow-purple-950/20 hover:shadow-purple-500/20 transition-all duration-300 before:absolute before:inset-0 before:bg-white/5 before:opacity-0 hover:before:opacity-100",
    secondary: "bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/80 text-neutral-300 hover:text-white font-medium shadow-md transition-all duration-300",
    danger: "bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 font-semibold shadow-md transition-all duration-300",
  };

  return (
    <Button
      disabled={disabled}
      className={`flex items-center justify-center gap-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </Button>
  );
}
