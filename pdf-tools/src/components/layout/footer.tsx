import { Shield, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} MR Consultancy PDF
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3 w-3" />
              Files never leave your browser
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Lock className="h-3 w-3" />
              No server uploads
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
