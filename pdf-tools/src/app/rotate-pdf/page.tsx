"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { rotateAllPages } from "@/lib/pdf/rotate";
import { pdfBlob } from "@/lib/utils";
import { motion } from "framer-motion";
import { RotateCw, RotateCcw } from "lucide-react";

export default function RotatePdfPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Rotating pages...");
      const rotated = await rotateAllPages(files[0].file, degrees);
      const blob = pdfBlob(rotated);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to rotate PDF");
    }
  }, [files, degrees, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
  }, [reset, clearFiles]);

  const rotationLabels: Record<number, string> = {
    90: "Rotate Right (CW)",
    180: "Rotate 180°",
    270: "Rotate Left (CCW)",
  };

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate PDF pages to the correct orientation"
      gradient="bg-gradient-to-br from-amber-500 to-yellow-500"
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
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Rotation:</span>
                  <div className="flex items-center gap-2">
                    {([90, 180, 270] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDegrees(d)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          degrees === d
                            ? "bg-purple-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {d}°
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <motion.div
                    key={degrees}
                    animate={{ rotate: degrees }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex h-20 w-16 items-center justify-center rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-950/30"
                  >
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">PDF</span>
                  </motion.div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    {degrees === 270 ? (
                      <RotateCcw className="h-4 w-4" />
                    ) : (
                      <RotateCw className="h-4 w-4" />
                    )}
                    <span>{rotationLabels[degrees]}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Rotate PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="rotated.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
