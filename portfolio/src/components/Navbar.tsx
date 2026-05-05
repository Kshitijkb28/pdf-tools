import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
      >
        <nav
          className={`pointer-events-auto flex items-center gap-2 md:gap-4 rounded-full px-3 py-2 md:px-4 md:py-2.5 transition-all duration-300 ${
            scrolled
              ? 'bg-white/70 backdrop-blur-xl border border-line shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]'
              : 'bg-white/30 backdrop-blur-md border border-transparent'
          }`}
        >
          <a
            href="#home"
            data-cursor="hover"
            className="flex items-center gap-2 pr-2 pl-3 group"
            aria-label="Home"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-bg font-display text-sm font-semibold transition-transform group-hover:rotate-12">
              K
            </span>
            <span className="hidden md:inline text-sm font-medium">Kshitij</span>
          </a>

          <div className="hidden md:flex items-center">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-cursor="hover"
                className="relative px-4 py-2 text-sm text-ink/80 hover:text-ink transition-colors"
              >
                {s.label}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <a
            href="/resume.tex"
            download
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs md:text-sm font-medium text-bg hover:bg-accent transition-colors"
          >
            Resume
            <Download size={14} />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            data-cursor="hover"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-bg/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col items-center justify-center gap-6">
              {sections.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="font-display text-5xl font-medium text-ink"
                >
                  {s.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
