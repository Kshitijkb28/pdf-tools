"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { unlockPdf } from "@/lib/pdf/unlock";
import { pdfBlob } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export default function UnlockPdfPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleProcess = useCallback(async () => {
    if (files.length === 0 || !password) return;
    startProcessing();
    try {
      updateProgress(40, "Decrypting PDF...");
      const decrypted = await unlockPdf(files[0].file, password);
      const blob = pdfBlob(decrypted);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to unlock PDF — wrong password?");
    }
  }, [files, password, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setPassword("");
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection from PDF"
      gradient="bg-gradient-to-br from-purple-500 to-fuchsia-500"
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
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Password</label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter PDF password"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm dark:border-slate-600 dark:bg-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess} disabled={!password}>
                  Unlock PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="unlocked.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
