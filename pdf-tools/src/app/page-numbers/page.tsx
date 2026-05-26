"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { addPageNumbers } from "@/lib/pdf/page-numbers";
import { pdfBlob } from "@/lib/utils";
import { PageNumberOptions } from "@/types";

export default function PageNumbersPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [options, setOptions] = useState<PageNumberOptions>({
    position: "bottom-center",
    format: "numeric",
    startFrom: 1,
    fontSize: 12,
    margin: 30,
  });

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Adding page numbers...");
      const numbered = await addPageNumbers(files[0].file, options);
      const blob = pdfBlob(numbered);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to add page numbers");
    }
  }, [files, options, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="Page Numbers"
      description="Add page numbers to your PDF document"
      gradient="bg-gradient-to-br from-blue-500 to-indigo-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={addFiles} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name}
              </p>
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Position</label>
                    <select
                      value={options.position}
                      onChange={(e) => setOptions((o) => ({ ...o, position: e.target.value as PageNumberOptions["position"] }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="top-center">Top Center</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Format</label>
                    <select
                      value={options.format}
                      onChange={(e) => setOptions((o) => ({ ...o, format: e.target.value as PageNumberOptions["format"] }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                    >
                      <option value="numeric">1, 2, 3...</option>
                      <option value="roman">i, ii, iii...</option>
                      <option value="alphabetic">a, b, c...</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Start from</label>
                    <input
                      type="number"
                      value={options.startFrom}
                      onChange={(e) => setOptions((o) => ({ ...o, startFrom: parseInt(e.target.value) || 1 }))}
                      min={1}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font size</label>
                    <input
                      type="number"
                      value={options.fontSize}
                      onChange={(e) => setOptions((o) => ({ ...o, fontSize: parseInt(e.target.value) || 12 }))}
                      min={8}
                      max={72}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Add Page Numbers
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="numbered.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
