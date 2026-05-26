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
        className="group flex h-full flex-col items-center gap-2.5 rounded-md border border-gray-200 bg-white p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150"
          style={{
            backgroundColor: `${categoryColor}14`,
            color: categoryColor,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-center text-[13px] font-medium text-gray-700 dark:text-gray-200">
          {tool.name}
        </span>
      </div>
    </Link>
  );
}
