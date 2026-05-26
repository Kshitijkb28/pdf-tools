"use client";

import { motion } from "framer-motion";
import { TOOLS } from "@/lib/constants";
import { ToolCard } from "./tool-card";

export function ToolGrid() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {TOOLS.map((tool) => (
        <motion.div
          key={tool.slug}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <ToolCard tool={tool} />
        </motion.div>
      ))}
    </motion.div>
  );
}
