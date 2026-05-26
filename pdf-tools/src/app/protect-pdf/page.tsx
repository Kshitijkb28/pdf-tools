"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { protectPdf } from "@/lib/pdf/protect";
import { pdfBlob } from "@/lib/utils";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: "", color: "bg-slate-200", width: "w-0" };
  if (password.length < 4) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (password.length < 8) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score >= 2 && password.length >= 8) return { label: "Strong", color: "bg-green-500", width: "w-full" };
  return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
}

export default function ProtectPdfPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  const handleProcess = useCallback(async () => {
    if (files.length === 0 || !userPassword) return;
    startProcessing();
    try {
      updateProgress(40, "Encrypting PDF...");
      const encrypted = await protectPdf(files[0].file, {
        userPassword,
        ownerPassword: ownerPassword || undefined,
      });
      const blob = pdfBlob(encrypted);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to protect PDF");
    }
  }, [files, userPassword, ownerPassword, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setUserPassword("");
    setOwnerPassword("");
  }, [reset, clearFiles]);

  const strength = getPasswordStrength(userPassword);

  return (
    <ToolLayout
      title="Protect PDF"
      description="Encrypt your PDF with a password"
      gradient="bg-gradient-to-br from-violet-500 to-purple-500"
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
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Password (required)
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showUserPassword ? "text" : "password"}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm dark:border-slate-600 dark:bg-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showUserPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {userPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <p className="text-xs text-slate-500">{strength.label}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Owner Password (optional)
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showOwnerPassword ? "text" : "password"}
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Enter owner password"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm dark:border-slate-600 dark:bg-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showOwnerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              {userPassword && strength.label === "Strong" && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-2 dark:bg-green-950/30">
                  <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">Strong password — good protection</span>
                </div>
              )}
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess} disabled={!userPassword}>
                  Protect PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="protected.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
