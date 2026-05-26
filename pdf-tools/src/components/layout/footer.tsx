import { Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              MR Consultancy PDF
            </span>
          </div>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Free online PDF tools — no signup required · {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-300">
            <Shield className="h-3.5 w-3.5" />
            Your files never leave your device
          </div>
        </div>
      </div>
    </footer>
  );
}
