import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToolGrid } from "@/components/tools/tool-grid";
import { Shield, Zap, Globe, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-white to-white dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
              Every tool you need to{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient_3s_linear_infinite]">
                  work with PDFs
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 blur-sm" />
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-400">
              Merge, split, compress, convert, and edit PDFs for free. No signup, no watermarks — 100% browser-based.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                100% Private
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                Instant Processing
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                No Upload Needed
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                No Signup
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              All PDF Tools
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Select a tool below to get started
            </p>
          </div>
          <ToolGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
