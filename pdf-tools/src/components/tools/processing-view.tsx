"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Download, RotateCcw } from "lucide-react";
import { ProcessingState } from "@/types";
import { formatFileSize, downloadBlob } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProcessingViewProps {
  state: ProcessingState;
  result: Blob | null;
  filename: string;
  onReset: () => void;
  originalSize?: number;
}

export function ProcessingView({ state, result, filename, onReset, originalSize }: ProcessingViewProps) {
  if (state.status === "idle") return null;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
      {state.status === "processing" && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600"
          />
          <Progress value={state.progress} label={state.message || "Processing..."} />
        </>
      )}

      {state.status === "complete" && result && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500" />
          </motion.div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Done!</p>
            <p className="text-sm text-slate-500">{formatFileSize(result.size)}</p>
            {originalSize && result.size < originalSize && (
              <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                {Math.round((1 - result.size / originalSize) * 100)}% smaller than original
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => downloadBlob(result, filename)}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Download className="mr-2 h-5 w-5" />
              Download
            </button>
            <Button variant="secondary" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Process Another
            </Button>
          </div>
        </>
      )}

      {state.status === "error" && (
        <>
          <AlertCircle className="h-16 w-16 text-red-500" />
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">Error</p>
            <p className="text-sm text-slate-500">{state.error}</p>
          </div>
          <Button variant="secondary" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </>
      )}
    </div>
  );
}
