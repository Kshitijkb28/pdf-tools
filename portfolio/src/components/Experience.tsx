import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { MapPin } from 'lucide-react';
import RevealText from './RevealText';
import { resume } from '../data/resume';

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 30%'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="relative py-24 md:py-40 px-6 md:px-12">
      <div className="mx-auto max-w-container">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted mb-12">
          <span className="h-px w-10 bg-ink" />
          <span>Experience</span>
        </div>

        <RevealText
          as="h2"
          text="Where I've shipped."
          className="font-display text-[clamp(2rem,5vw,4rem)] font-medium text-ink max-w-3xl mb-20"
        />

        <div ref={ref} className="relative pl-8 md:pl-14">
          <div className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px bg-line" />
          <motion.div
            className="absolute left-[7px] md:left-[11px] top-2 w-px bg-accent origin-top"
            style={{ height: lineHeight }}
          />

          <div className="flex flex-col gap-16 md:gap-24">
            {resume.experience.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="relative"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                  className="absolute -left-[33px] md:-left-[47px] top-2 h-4 w-4 md:h-6 md:w-6 rounded-full bg-bg border-2 border-accent flex items-center justify-center"
                >
                  <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-accent" />
                </motion.span>

                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
                  <div>
                    <h3 className="font-display text-2xl md:text-4xl font-medium text-ink">
                      {exp.role}
                    </h3>
                    <div className="mt-1 text-base md:text-lg text-accent font-medium">
                      {exp.company}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted font-mono">{exp.period}</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                      <MapPin size={12} />
                      {exp.location}
                    </div>
                  </div>
                </div>

                <ul className="mt-4 flex flex-col gap-2.5 max-w-3xl">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm md:text-base text-muted leading-relaxed">
                      <span className="mt-2 h-1 w-1 rounded-full bg-accent shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
