"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_FILE_SIZE } from "@/lib/constants";

interface DropzoneProps {
  accept: string[];
  multiple?: boolean;
  onFiles: (files: FileList) => void;
  maxSize?: number;
  className?: string;
}

function getFileTypeLabel(accept: string[]): string {
  const types = accept.map((t) => t.toLowerCase());
  if (types.includes("application/pdf")) return "PDF files only";
  if (types.some((t) => t.startsWith("image/"))) return "JPG, PNG, WebP files";
  return "Supported files only";
}

export function Dropzone({ accept, multiple = true, onFiles, maxSize = MAX_FILE_SIZE, className }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files);
      }
    },
    [onFiles]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFiles(e.target.files);
        e.target.value = "";
      }
    },
    [onFiles]
  );

  return (
    <motion.div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      className={cn(
        "relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors",
        isDragging
          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
          : "border-slate-300 bg-slate-50 hover:border-purple-400 hover:bg-purple-50/50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-purple-500",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <motion.div
        animate={isDragging ? { y: -4 } : { y: 0 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/50">
          {isDragging ? (
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          ) : (
            <Upload className="h-8 w-8 animate-pulse-subtle text-purple-600 dark:text-purple-400" />
          )}
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-slate-700 dark:text-slate-200">
            {isDragging ? "Drop files here" : "Drag files here or click to browse"}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {getFileTypeLabel(accept)} · Max {Math.round(maxSize / 1024 / 1024)}MB per file
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
