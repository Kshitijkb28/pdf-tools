import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToolGrid } from "@/components/tools/tool-grid";
import { Shield, Wrench } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-300">
              <Wrench className="h-3 w-3" />
              12 Free Tools
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Every tool you need to work with{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient_3s_linear_infinite]">
                PDFs
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Free, fast, and secure. All processing happens in your browser — your files never leave your device.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-300">
              <Shield className="h-4 w-4" />
              All processing happens locally — 100% private
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <ToolGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
