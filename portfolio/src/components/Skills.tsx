import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import RevealText from './RevealText';
import { resume } from '../data/resume';

function SkillCard({ title, items, index }: { title: string; items: readonly string[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });
  const spotlightX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const spotlightY = useTransform(my, [-0.5, 0.5], ['0%', '100%']);

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className="group relative overflow-hidden rounded-md border border-line bg-white/60 p-6 md:p-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(220px circle at ${spotlightX.get()}% ${spotlightY.get()}%, rgba(226,117,0,0.12), transparent 70%)`,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]: number[] | string[]) =>
                `radial-gradient(260px circle at ${x} ${y}, rgba(226,117,0,0.14), transparent 70%)`,
            ),
          }}
        />
      </motion.div>

      <div className="flex items-start justify-between" style={{ transform: 'translateZ(20px)' }}>
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-muted mb-3">
            0{index + 1} / {String(resume.skills.length).padStart(2, '0')}
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-medium text-ink">{title}</h3>
        </div>
        <span className="font-display text-5xl text-accent/20 leading-none">✺</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" style={{ transform: 'translateZ(15px)' }}>
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-line bg-white/80 px-3 py-1.5 text-xs md:text-sm text-ink/80"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-40 px-6 md:px-12 bg-bgAlt/40">
      <div className="mx-auto max-w-container">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted mb-12">
          <span className="h-px w-10 bg-ink" />
          <span>Skills</span>
        </div>

        <RevealText
          as="h2"
          text="The stack I build with."
          className="font-display text-[clamp(2rem,5vw,4rem)] font-medium text-ink max-w-3xl mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {resume.skills.map((s, i) => (
            <SkillCard key={s.title} title={s.title} items={s.items} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
