import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8 dark:border-slate-700">
      <div className="mx-auto max-w-7xl px-4 space-y-2">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          MR Consultancy PDF — Free Online PDF Tools · {new Date().getFullYear()}
        </p>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 dark:text-slate-500">
          <Shield className="h-3.5 w-3.5" />
          Privacy: Your files never leave your device
        </p>
      </div>
    </footer>
  );
}
