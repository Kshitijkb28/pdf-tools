"use client";

import { useState, useCallback } from "react";
import { FileWithPreview, ProcessingState } from "@/types";
import { generateId } from "@/lib/utils";
import { MAX_FILE_SIZE } from "@/lib/constants";

export function useFileUpload(acceptedTypes: string[]) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const valid = fileArray.filter(
      (f) => f.size <= MAX_FILE_SIZE && acceptedTypes.includes(f.type)
    );

    const mapped: FileWithPreview[] = valid.map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...mapped]);
  }, [acceptedTypes]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return { files, addFiles, removeFile, reorderFiles, clearFiles, setFiles };
}

export function usePdfProcessing() {
  const [state, setState] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [result, setResult] = useState<Blob | null>(null);

  const startProcessing = useCallback(() => {
    setState({ status: "processing", progress: 0 });
    setResult(null);
  }, []);

  const updateProgress = useCallback((progress: number, message?: string) => {
    setState({ status: "processing", progress, message });
  }, []);

  const completeProcessing = useCallback((blob: Blob) => {
    setState({ status: "complete", progress: 100 });
    setResult(blob);
  }, []);

  const failProcessing = useCallback((error: string) => {
    setState({ status: "error", progress: 0, error });
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", progress: 0 });
    setResult(null);
  }, []);

  return {
    state,
    result,
    startProcessing,
    updateProgress,
    completeProcessing,
    failProcessing,
    reset,
  };
}
