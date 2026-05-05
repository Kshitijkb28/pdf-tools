import { resume } from '../data/resume';

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-6 md:px-12 py-10 md:py-14">
      <div className="mx-auto max-w-container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-bg font-display text-sm font-semibold">
            K
          </span>
          <div>
            <div className="font-medium text-sm">{resume.name}</div>
            <div className="text-xs text-muted">{resume.role}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-muted">
          <a
            href={resume.links.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="hover:text-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href={resume.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="hover:text-ink transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${resume.email}`}
            data-cursor="hover"
            className="hover:text-ink transition-colors"
          >
            Email
          </a>
          <span>© {new Date().getFullYear()} — Crafted with care.</span>
        </div>
      </div>
    </footer>
  );
}
