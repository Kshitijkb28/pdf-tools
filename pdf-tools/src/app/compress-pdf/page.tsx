"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { compressPdf } from "@/lib/pdf/compress";
import { pdfBlob, formatFileSize } from "@/lib/utils";
import { CompressOptions } from "@/types";

const compressionEstimates: Record<string, string> = {
  maximum: "~70% smaller",
  high: "~50% smaller",
  medium: "~30% smaller",
  low: "~15% smaller",
};

export default function CompressPdfPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [quality, setQuality] = useState<CompressOptions["quality"]>("high");
  const [originalSize, setOriginalSize] = useState<number | null>(null);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      addFiles(fileList);
      if (fileList[0]) {
        setOriginalSize(fileList[0].size);
      }
    },
    [addFiles]
  );

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(30, "Compressing PDF...");
      const compressed = await compressPdf(files[0].file, { quality });
      const blob = pdfBlob(compressed);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to compress PDF");
    }
  }, [files, quality, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setOriginalSize(null);
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
      gradient="bg-gradient-to-br from-teal-500 to-cyan-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={handleFiles} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name}
                {originalSize && (
                  <span className="ml-2 text-slate-500">({formatFileSize(originalSize)})</span>
                )}
              </p>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Compression level:</span>
                {(["maximum", "high", "medium", "low"] as const).map((q) => (
                  <label key={q} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="quality"
                        checked={quality === q}
                        onChange={() => setQuality(q)}
                        className="accent-purple-600"
                      />
                      <span className="text-sm capitalize text-slate-700 dark:text-slate-300">{q}</span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {compressionEstimates[q]}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Compress PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {state.status !== "idle" && (
        <div className="space-y-4">
          <ProcessingView state={state} result={result} filename="compressed.pdf" onReset={handleReset} />
          {state.status === "complete" && result && originalSize && (
            <div className="flex items-center justify-center gap-4 rounded-lg bg-cyan-50 px-4 py-3 dark:bg-cyan-950/30">
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Before</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatFileSize(originalSize)}</p>
              </div>
              <span className="text-lg text-slate-400">→</span>
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">After</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">{formatFileSize(result.size)}</p>
              </div>
              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {Math.round((1 - result.size / originalSize) * 100)}% smaller
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
