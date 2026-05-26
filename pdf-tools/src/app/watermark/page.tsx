"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { addWatermark } from "@/lib/pdf/watermark";
import { pdfBlob } from "@/lib/utils";
import { WatermarkOptions } from "@/types";

export default function WatermarkPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [options, setOptions] = useState<WatermarkOptions>({
    text: "CONFIDENTIAL",
    fontSize: 48,
    opacity: 0.3,
    rotation: -45,
    color: "#6b21a8",
    position: "center",
  });

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Adding watermark...");
      const result = await addWatermark(files[0].file, options);
      const blob = pdfBlob(result);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to add watermark");
    }
  }, [files, options, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="Watermark"
      description="Add text or image watermarks to your PDF"
      gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
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
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Text</label>
                  <input
                    type="text"
                    value={options.text}
                    onChange={(e) => setOptions((o) => ({ ...o, text: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Size</label>
                    <input
                      type="number"
                      value={options.fontSize}
                      onChange={(e) => setOptions((o) => ({ ...o, fontSize: parseInt(e.target.value) || 48 }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Opacity: {Math.round(options.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min={0.05}
                      max={1}
                      step={0.05}
                      value={options.opacity}
                      onChange={(e) => setOptions((o) => ({ ...o, opacity: parseFloat(e.target.value) }))}
                      className="mt-2 w-full accent-purple-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Rotation</label>
                    <input
                      type="number"
                      value={options.rotation}
                      onChange={(e) => setOptions((o) => ({ ...o, rotation: parseInt(e.target.value) || 0 }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Color</label>
                    <input
                      type="color"
                      value={options.color}
                      onChange={(e) => setOptions((o) => ({ ...o, color: e.target.value }))}
                      className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Position</label>
                  <select
                    value={options.position}
                    onChange={(e) => setOptions((o) => ({ ...o, position: e.target.value as WatermarkOptions["position"] }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                  >
                    <option value="center">Center</option>
                    <option value="tiled">Tiled</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Preview</label>
                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="select-none whitespace-nowrap font-bold"
                      style={{
                        fontSize: `${Math.min(options.fontSize * 0.5, 40)}px`,
                        color: options.color,
                        opacity: options.opacity,
                        transform: `rotate(${options.rotation}deg)`,
                      }}
                    >
                      {options.text || "WATERMARK"}
                    </span>
                  </div>
                  <div className="relative z-10 flex h-32 w-24 items-center justify-center rounded border border-slate-300 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400">PDF Page</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Add Watermark
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="watermarked.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
