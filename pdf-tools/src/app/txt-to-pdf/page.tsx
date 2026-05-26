"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { usePdfProcessing } from "@/hooks/use-file-upload";
import { txtToPdf, TxtToPdfOptions } from "@/lib/pdf/txt-to-pdf";
import { pdfBlob } from "@/lib/utils";

export default function TxtToPdfPage() {
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [text, setText] = useState("");
  const [options, setOptions] = useState<TxtToPdfOptions>({
    fontSize: 12,
    marginX: 50,
    marginY: 50,
    pageSize: "A4",
  });

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setText(reader.result as string);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleProcess = useCallback(async () => {
    if (!text.trim()) return;
    startProcessing();
    try {
      updateProgress(40, "Converting text to PDF...");
      const resultBytes = await txtToPdf(text, options);
      const blob = pdfBlob(resultBytes);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to convert text to PDF");
    }
  }, [text, options, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    setText("");
  }, [reset]);

  return (
    <ToolLayout
      title="TXT to PDF"
      description="Convert plain text into a PDF document"
      gradient="bg-gradient-to-br from-lime-500 to-green-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Paste text or upload a .txt file
              </label>
              <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Upload .txt
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="h-64 w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            />
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Page Size</label>
                <select
                  value={options.pageSize}
                  onChange={(e) => setOptions((o) => ({ ...o, pageSize: e.target.value as TxtToPdfOptions["pageSize"] }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Size</label>
                <input
                  type="number"
                  value={options.fontSize}
                  onChange={(e) => setOptions((o) => ({ ...o, fontSize: parseInt(e.target.value) || 12 }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Margin X</label>
                <input
                  type="number"
                  value={options.marginX}
                  onChange={(e) => setOptions((o) => ({ ...o, marginX: parseInt(e.target.value) || 50 }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Margin Y</label>
                <input
                  type="number"
                  value={options.marginY}
                  onChange={(e) => setOptions((o) => ({ ...o, marginY: parseInt(e.target.value) || 50 }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
          {text.trim() && (
            <div className="flex justify-center">
              <Button size="lg" onClick={handleProcess}>
                Convert to PDF
              </Button>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="converted.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
