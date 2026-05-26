"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { splitPdf } from "@/lib/pdf/split";
import { SplitOptions } from "@/types";
import { Scissors } from "lucide-react";
import JSZip from "jszip";

export default function SplitPdfPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [mode, setMode] = useState<SplitOptions["mode"]>("individual");
  const [ranges, setRanges] = useState("");
  const [fixedSize, setFixedSize] = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      addFiles(fileList);
      try {
        const file = fileList[0];
        if (file) {
          const { PDFDocument } = await import("pdf-lib");
          const bytes = await file.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          setPageCount(doc.getPageCount());
        }
      } catch {
        setPageCount(null);
      }
    },
    [addFiles]
  );

  const getEstimatedOutput = (): string | null => {
    if (!pageCount) return null;
    if (mode === "individual") return `Will produce ${pageCount} files`;
    if (mode === "fixed" && fixedSize > 0) return `Will produce ${Math.ceil(pageCount / fixedSize)} files`;
    if (mode === "ranges" && ranges.trim()) {
      const parts = ranges.split(",").filter((r) => r.trim());
      return `Will produce ${parts.length} files`;
    }
    return null;
  };

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(20, "Splitting PDF...");
      const options: SplitOptions = { mode };
      if (mode === "ranges") options.ranges = ranges;
      if (mode === "fixed") options.fixedSize = fixedSize;

      const parts = await splitPdf(files[0].file, options);
      updateProgress(70, "Creating zip...");

      const zip = new JSZip();
      parts.forEach((part, i) => {
        zip.file(`part-${i + 1}.pdf`, part);
      });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      completeProcessing(zipBlob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to split PDF");
    }
  }, [files, mode, ranges, fixedSize, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setPageCount(null);
  }, [reset, clearFiles]);

  const estimatedOutput = getEstimatedOutput();

  return (
    <ToolLayout
      title="Split PDF"
      description="Separate one PDF into multiple documents"
      gradient="bg-gradient-to-br from-orange-500 to-amber-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={handleFiles} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name}
                {pageCount && (
                  <span className="ml-2 text-slate-500">({pageCount} pages)</span>
                )}
              </p>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "individual"}
                    onChange={() => setMode("individual")}
                    className="accent-purple-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Split into individual pages</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "ranges"}
                    onChange={() => setMode("ranges")}
                    className="accent-purple-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Split by page ranges</span>
                </label>
                {mode === "ranges" && (
                  <input
                    type="text"
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    placeholder="e.g. 1-3, 4-6, 7-10"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                  />
                )}
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "fixed"}
                    onChange={() => setMode("fixed")}
                    className="accent-purple-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Split every N pages</span>
                </label>
                {mode === "fixed" && (
                  <input
                    type="number"
                    value={fixedSize}
                    onChange={(e) => setFixedSize(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                  />
                )}
              </div>
              {estimatedOutput && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-orange-50 px-4 py-2.5 dark:bg-orange-950/30">
                  <Scissors className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    {estimatedOutput}
                  </span>
                </div>
              )}
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Split PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="split-pages.zip" onReset={handleReset} />
    </ToolLayout>
  );
}
