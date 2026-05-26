import Link from "next/link";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            MR PDF
          </span>
        </Link>
        <nav>
          <Link
            href="/"
            className="rounded px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            All Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
