"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { addHeaderFooter, HeaderFooterOptions } from "@/lib/pdf/header-footer";
import { pdfBlob } from "@/lib/utils";

export default function HeaderFooterPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [options, setOptions] = useState<HeaderFooterOptions>({
    headerLeft: "",
    headerCenter: "",
    headerRight: "",
    footerLeft: "",
    footerCenter: "Page {page} of {total}",
    footerRight: "",
    fontSize: 10,
    marginX: 40,
    marginY: 30,
  });

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Adding header & footer...");
      const buffer = await files[0].file.arrayBuffer();
      const resultBytes = await addHeaderFooter(new Uint8Array(buffer), options);
      const blob = pdfBlob(resultBytes);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to add header/footer");
    }
  }, [files, options, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
  }, [reset, clearFiles]);

  const updateOption = (key: keyof HeaderFooterOptions, value: string | number) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ToolLayout
      title="Header & Footer"
      description="Add headers and footers to every page of your PDF"
      gradient="bg-gradient-to-br from-violet-500 to-indigo-500"
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
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use {"{page}"} for current page number and {"{total}"} for total pages.
                </p>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Header</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Left"
                      value={options.headerLeft}
                      onChange={(e) => updateOption("headerLeft", e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Center"
                      value={options.headerCenter}
                      onChange={(e) => updateOption("headerCenter", e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Right"
                      value={options.headerRight}
                      onChange={(e) => updateOption("headerRight", e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Footer</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Left"
                      value={options.footerLeft}
                      onChange={(e) => updateOption("footerLeft", e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Center"
                      value={options.footerCenter}
                      onChange={(e) => updateOption("footerCenter", e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Right"
                      value={options.footerRight}
                      onChange={(e) => updateOption("footerRight", e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Size</label>
                    <input
                      type="number"
                      value={options.fontSize}
                      onChange={(e) => updateOption("fontSize", parseInt(e.target.value) || 10)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Margin X</label>
                    <input
                      type="number"
                      value={options.marginX}
                      onChange={(e) => updateOption("marginX", parseInt(e.target.value) || 40)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Margin Y</label>
                    <input
                      type="number"
                      value={options.marginY}
                      onChange={(e) => updateOption("marginY", parseInt(e.target.value) || 30)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Add Header & Footer
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="header-footer.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
