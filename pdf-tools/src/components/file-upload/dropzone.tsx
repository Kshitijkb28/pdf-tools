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
        "flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors duration-150",
        isDragging
          ? "border-brand bg-red-50/50 dark:border-brand dark:bg-red-950/20"
          : "border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-gray-500",
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
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
          {isDragging ? (
            <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Upload className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {isDragging ? "Drop files here" : "Drop files here or click to browse"}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {acceptLabel} · Max {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>
    </div>
  );
}
