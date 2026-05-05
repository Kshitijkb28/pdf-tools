import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, Suspense, lazy } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { resume } from '../data/resume';

const Scene3D = lazy(() => import('./Scene3D'));

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden pt-24 md:pt-28"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ opacity: sceneOpacity, y: sceneY }}
      >
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto flex max-w-container flex-col justify-center px-6 md:px-12 min-h-[calc(100svh-7rem)]"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.2em] text-muted mb-6"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Available for work · {resume.location}
        </motion.div>

        <h1 className="font-display text-[clamp(2.75rem,10vw,9rem)] font-medium text-ink">
          <motion.span
            className="block overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              className="inline-block"
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              Full Stack
            </motion.span>
          </motion.span>
          <motion.span
            className="block overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.span
              className="inline-flex items-baseline gap-4"
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            >
              <span className="italic font-normal text-accent">Engineer.</span>
              <motion.span
                aria-hidden
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="hidden md:inline-block text-[0.35em] text-muted -translate-y-3"
              >
                ✺
              </motion.span>
            </motion.span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted leading-relaxed"
        >
          {resume.tagline} <span className="text-ink">2+ years shipping production</span>, from
          LLM pipelines to cloud deployments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            as="a"
            href="#work"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-7 py-4 text-sm font-medium text-bg hover:bg-accent transition-colors"
          >
            View Projects
            <ArrowUpRight size={18} />
          </MagneticButton>
          <MagneticButton
            as="a"
            href="/resume.tex"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-ink/20 bg-transparent px-7 py-4 text-sm font-medium text-ink hover:border-ink transition-colors"
          >
            Download CV
            <ArrowDown size={16} />
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted"
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
