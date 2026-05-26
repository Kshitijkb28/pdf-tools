"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ToolDefinition } from "@/lib/constants";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link href={`/${tool.slug}`}>
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br",
            tool.gradient
          )}
        />
        <div className="relative">
          <div className={cn("rounded-xl p-3", tool.color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="relative text-center">
          <h3 className="font-semibold text-slate-900 group-hover:text-white dark:text-white">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 group-hover:text-white/80 dark:text-slate-400">
            {tool.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
