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

  const acceptLabel = accept.includes("application/pdf")
    ? "PDF files"
    : accept.includes("image/jpeg")
    ? "JPG, PNG, WebP images"
    : "Supported files";

  return (
    <motion.div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
      className={cn(
        "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
        isDragging
          ? "border-purple-500 bg-purple-50/80 shadow-lg shadow-purple-500/10 dark:bg-purple-950/30"
          : "border-slate-300 bg-slate-50/50 hover:border-purple-400 hover:bg-purple-50/30 dark:border-slate-600 dark:bg-slate-800/30 dark:hover:border-purple-500",
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
        className="flex flex-col items-center gap-4"
      >
        <div className={cn(
          "rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-4 shadow-lg shadow-purple-500/20",
          !isDragging && "animate-pulse-subtle"
        )}>
          {isDragging ? (
            <FileText className="h-8 w-8 text-white" />
          ) : (
            <Upload className="h-8 w-8 text-white" />
          )}
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            {isDragging ? "Drop files here" : "Drop files here or click to browse"}
          </p>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {acceptLabel} · Max {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
