"use client";

import { useCallback, useRef, useState } from "react";
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
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
        isDragging
          ? "border-brand bg-red-50 shadow-inner dark:border-brand dark:bg-red-950/30"
          : "border-gray-300 bg-white hover:border-brand/50 hover:bg-red-50/30 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-brand/50 dark:hover:bg-red-950/10",
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
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-200",
            isDragging
              ? "bg-brand/10 text-brand"
              : "bg-brand/5 text-brand/70 group-hover:bg-brand/10 group-hover:text-brand"
          )}
        >
          {isDragging ? (
            <FileText className="h-7 w-7" />
          ) : (
            <Upload className="h-7 w-7" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {isDragging ? "Drop files here" : "Drop files here or click to browse"}
          </p>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {acceptLabel} · Max {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>
    </div>
  );
}
