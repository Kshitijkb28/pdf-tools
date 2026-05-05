import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import RevealText from './RevealText';
import { resume } from '../data/resume';

type ProjectT = (typeof resume.projects)[number];

function ProjectCard({ project, index }: { project: ProjectT; index: number }) {
  const flipped = index % 2 === 1;
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      whileHover={{ y: -6 }}
      className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center p-4 md:p-6 rounded-md hover:bg-white/50 transition-colors"
    >
      <span className="absolute left-0 top-6 bottom-6 w-[2px] bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />

      <div
        className={`relative lg:col-span-6 aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-md noise ${
          flipped ? 'lg:order-2' : ''
        }`}
        style={{ background: project.gradient }}
      >
        <div className="absolute inset-0 flex items-end justify-between p-6 md:p-10 text-white/95">
          <span className="font-display text-6xl md:text-8xl font-medium leading-none tracking-tighter">
            {project.number}
          </span>
          <span className="font-display text-2xl md:text-4xl opacity-80 group-hover:opacity-100 transition-opacity">
            ↗
          </span>
        </div>
      </div>

      <div className={`lg:col-span-6 ${flipped ? 'lg:order-1 lg:pl-0' : ''}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="font-display text-3xl md:text-5xl font-medium text-ink">{project.name}</h3>
          <span className="text-sm text-muted font-mono">{project.period}</span>
        </div>

        <ul className="mt-6 flex flex-col gap-2">
          {project.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm md:text-base text-muted leading-relaxed">
              <span className="mt-2 h-1 w-1 rounded-full bg-accent shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-white/80 px-3 py-1 text-xs text-ink/75"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink">
          <span>Visit live</span>
          <motion.span className="inline-flex" whileHover={{ x: 4 }}>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  return (
    <section id="work" className="relative py-24 md:py-40 px-6 md:px-12">
      <div className="mx-auto max-w-container">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted mb-12">
          <span className="h-px w-10 bg-ink" />
          <span>Selected Work</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <RevealText
            as="h2"
            text="Projects in production."
            className="font-display text-[clamp(2rem,5vw,4rem)] font-medium text-ink max-w-3xl"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm text-muted max-w-sm"
          >
            A selection of projects shipped to real users — from AI chat to multi-tenant commerce.
          </motion.p>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {resume.projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
