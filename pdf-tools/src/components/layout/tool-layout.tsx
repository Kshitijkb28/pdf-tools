import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  title: string;
  description: string;
  gradient?: string;
  children: ReactNode;
}

export function ToolLayout({ title, description, gradient, children }: ToolLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <div
        className={cn(
          "relative overflow-hidden px-4 py-14 sm:py-20",
          gradient || "bg-gradient-to-br from-purple-600 to-blue-600"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-3 text-lg text-white/80">{description}</p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80 sm:p-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
