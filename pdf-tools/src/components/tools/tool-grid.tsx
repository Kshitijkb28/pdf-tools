"use client";

import { TOOLS, CATEGORY_LABELS, CATEGORY_COLORS, ToolCategory } from "@/lib/constants";
import { ToolCard } from "./tool-card";

export function ToolGrid() {
  const categories: ToolCategory[] = ["organize", "convert", "optimize", "edit", "security"];

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const tools = TOOLS.filter((t) => t.category === category);
        if (tools.length === 0) return null;
        return (
          <div key={category}>
            <div className="mb-2 flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: CATEGORY_COLORS[category] }}
              />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {CATEGORY_LABELS[category]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
