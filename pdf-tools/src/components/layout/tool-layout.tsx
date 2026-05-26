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
    <div className="flex min-h-screen flex-col">
      <Header />
      <div
        className={cn(
          "relative overflow-hidden px-4 py-12 sm:py-16",
          gradient || "bg-gradient-to-br from-purple-600 to-blue-600"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 text-lg text-white/80">{description}</p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <Footer />
    </div>
  );
}
