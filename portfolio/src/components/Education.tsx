import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import RevealText from './RevealText';
import { resume } from '../data/resume';

export default function Education() {
  return (
    <section id="education" className="relative py-24 md:py-32 px-6 md:px-12 bg-bgAlt/40">
      <div className="mx-auto max-w-container">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted mb-12">
          <span className="h-px w-10 bg-ink" />
          <span>Education</span>
        </div>

        <RevealText
          as="h2"
          text="The foundation."
          className="font-display text-[clamp(2rem,5vw,4rem)] font-medium text-ink max-w-3xl mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resume.education.map((e, i) => (
            <motion.div
              key={e.degree}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-md border border-line bg-white/60 p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <GraduationCap size={28} className="text-accent" />
                <span className="text-xs text-muted font-mono">{e.period}</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-medium text-ink">{e.degree}</h3>
              <div className="mt-2 text-sm text-muted">{e.school}</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {e.score}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
