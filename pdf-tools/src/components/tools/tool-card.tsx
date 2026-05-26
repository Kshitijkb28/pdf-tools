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
    <Link href={`/${tool.slug}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-2xl dark:border-slate-700/80 dark:bg-slate-800/80 dark:hover:border-transparent"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            tool.gradient
          )}
        />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-all duration-300 group-hover:bg-white/20 group-hover:shadow-lg group-hover:shadow-white/10",
              tool.gradient
            )}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>

          <div className="text-center">
            <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white dark:text-white">
              {tool.name}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 transition-colors duration-300 group-hover:text-white/80 dark:text-slate-400 dark:group-hover:text-white/80">
              {tool.description}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-0",
            tool.gradient
          )}
        />
      </motion.div>
    </Link>
  );
}
