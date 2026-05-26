export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 dark:border-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} MR Consultancy PDF · All processing happens in your browser
        </p>
      </div>
    </footer>
  );
}
