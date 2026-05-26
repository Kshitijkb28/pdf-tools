"use client";

import { FileWithPreview } from "@/types";
import { formatFileSize } from "@/lib/utils";
import { X, ChevronUp, ChevronDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileListProps {
  files: FileWithPreview[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  showNumbers?: boolean;
}

export function FileList({ files, onRemove, onReorder, showNumbers = false }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            {showNumbers && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                {index + 1}
              </span>
            )}
            <FileText className="h-5 w-5 shrink-0 text-purple-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            </div>
            <div className="flex items-center gap-1">
              {files.length > 1 && (
                <>
                  <button
                    onClick={() => index > 0 && onReorder(index, index - 1)}
                    disabled={index === 0}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => index < files.length - 1 && onReorder(index, index + 1)}
                    disabled={index === files.length - 1}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => onRemove(file.id)}
                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
