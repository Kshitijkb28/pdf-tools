import { motion } from 'framer-motion';
import RevealText from './RevealText';
import { resume } from '../data/resume';

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-40 px-6 md:px-12">
      <div className="mx-auto max-w-container">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted mb-12">
          <span className="h-px w-10 bg-ink" />
          <span>About</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7 lg:col-start-2">
            <RevealText
              as="h2"
              text="Full stack engineer shipping products across the modern web and AI."
              className="font-display text-[clamp(2rem,5vw,4rem)] font-medium text-ink max-w-4xl"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 max-w-xl text-base md:text-lg text-muted leading-relaxed"
            >
              {resume.summary} Currently building AI-powered systems at{' '}
              <span className="text-ink font-medium">Ethara AI</span>, previously maintained
              production infrastructure at Mind2web LLP.
            </motion.p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            {resume.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-baseline justify-between gap-6 border-b border-line pb-6"
              >
                <div>
                  <div className="font-display text-5xl md:text-6xl font-medium text-ink leading-none">
                    {s.value}
                  </div>
                  <div className="mt-3 text-sm text-muted">{s.label}</div>
                </div>
                <span className="font-display text-xs text-accent">0{i + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
