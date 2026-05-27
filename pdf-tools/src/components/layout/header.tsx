import Link from "next/link";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <FileText className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              MR Consultancy PDF
            </span>
            <span className="hidden text-[10px] text-gray-500 dark:text-gray-400 sm:block">
              Free Online Tools
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            All Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
