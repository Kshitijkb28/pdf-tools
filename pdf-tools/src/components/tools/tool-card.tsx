"use client";

import Link from "next/link";
import { ToolDefinition, CATEGORY_COLORS } from "@/lib/constants";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  const categoryColor = CATEGORY_COLORS[tool.category];

  return (
    <Link href={`/${tool.slug}`} className="block">
      <div
        className="group relative flex h-full flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
        style={{ "--cat-color": categoryColor } as React.CSSProperties}
      >
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110"
          style={{
            backgroundColor: `${categoryColor}30`,
            color: categoryColor,
          }}
        >
          <Icon className="h-[22px] w-[22px]" />
        </div>
        <span className="text-center text-[13px] font-semibold text-gray-800 dark:text-gray-100">
          {tool.name}
        </span>
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ backgroundColor: categoryColor }}
        />
      </div>
    </Link>
  );
}
