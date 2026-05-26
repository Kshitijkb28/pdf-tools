import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-700/80 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-2xl font-extrabold">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MR Consultancy PDF
          </span>
        </Link>
        <nav>
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            All Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
