import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToolGrid } from "@/components/tools/tool-grid";
import { TOOLS } from "@/lib/constants";
import { Shield, Zap, HardDrive, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1">
        <section className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              All PDF Tools You Need
            </h1>
            <p className="mt-2 max-w-xl text-base text-gray-600 dark:text-gray-400">
              Free, private, browser-based. No uploads to any server.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Badge icon={Shield} text="100% Private" />
              <Badge icon={Zap} text="Instant Processing" />
              <Badge icon={HardDrive} text="No Server Upload" />
              <Badge icon={Globe} text={`${TOOLS.length} Free Tools`} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <ToolGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Badge({ icon: Icon, text }: { icon: typeof Shield; text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
      <Icon className="h-3.5 w-3.5 text-brand" />
      {text}
    </div>
  );
}
