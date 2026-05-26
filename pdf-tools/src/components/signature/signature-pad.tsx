"use client";

import { useRef, useCallback } from "react";
import SignaturePadLib from "signature_pad";

interface SignaturePadProps {
  onSignature: (dataUrl: string) => void;
  width?: number;
  height?: number;
}

export function SignaturePad({ onSignature, width = 500, height = 200 }: SignaturePadProps) {
  const padRef = useRef<SignaturePadLib | null>(null);

  const initCanvas = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const pad = new SignaturePadLib(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });
      pad.addEventListener("endStroke", () => {
        if (!pad.isEmpty()) {
          onSignature(pad.toDataURL("image/png"));
        }
      });
      padRef.current = pad;
    },
    [onSignature]
  );

  const clear = useCallback(() => {
    padRef.current?.clear();
  }, []);

  return (
    <div className="space-y-2">
      <canvas
        ref={initCanvas}
        width={width}
        height={height}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600"
      />
      <button
        onClick={clear}
        className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        Clear signature
      </button>
    </div>
  );
}
