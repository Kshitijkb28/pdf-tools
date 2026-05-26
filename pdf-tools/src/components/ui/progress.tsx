"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function Progress({ value, label, showPercentage = true, className }: ProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="text-slate-600 dark:text-slate-400">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-purple-600 dark:text-purple-400">
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
