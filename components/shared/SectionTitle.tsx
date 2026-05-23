"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, icon, badge, className = "" }: SectionTitleProps) {
  return (
    <div className={`space-y-1.5 animate-reveal ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <div className="text-purple-400 shrink-0">{icon}</div>}
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">{title}</h2>
        {badge && (
          <span className="inline-flex items-center rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs md:text-sm text-neutral-400 font-light max-w-2xl">{subtitle}</p>}
    </div>
  );
}
