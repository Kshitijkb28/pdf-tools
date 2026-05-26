import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToolGrid } from "@/components/tools/tool-grid";
import { TOOLS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free online PDF tools · {TOOLS.length} tools available
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              All PDF Tools
            </h1>
          </div>
          <ToolGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
