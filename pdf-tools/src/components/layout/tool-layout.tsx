import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface ToolLayoutProps {
  title: string;
  description: string;
  gradient?: string;
  children: ReactNode;
}

export function ToolLayout({ title, description, gradient, children }: ToolLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="border-b border-gray-100 bg-white px-4 py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
