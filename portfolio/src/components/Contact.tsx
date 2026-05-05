import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Mail, Send } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { resume } from '../data/resume';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(resume.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${resume.email}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${resume.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 md:py-40 px-6 md:px-12">
      <div className="mx-auto max-w-container">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted mb-12">
          <span className="h-px w-10 bg-ink" />
          <span>Contact</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="font-display text-[clamp(2.25rem,7vw,6rem)] font-medium text-ink max-w-4xl"
        >
          Let's build <span className="italic text-accent">something.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted leading-relaxed"
        >
          Open to full-time roles, freelance, and meaningful collaborations. Drop a line — I
          usually respond within 24 hours.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-left"
              aria-label="Copy email address"
            >
              <span className="font-display text-2xl md:text-4xl font-medium text-accent break-all hover:text-accentDark transition-colors">
                {resume.email}
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shrink-0">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </span>
            </button>

            <div className="text-sm text-muted">
              <div>{resume.phone}</div>
              <div>{resume.location}</div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <MagneticButton
                as="a"
                href={`mailto:${resume.email}`}
                ariaLabel="Email"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-ink hover:text-bg transition-colors"
              >
                <Mail size={18} />
              </MagneticButton>
              <MagneticButton
                as="a"
                href={resume.links.linkedin}
                ariaLabel="LinkedIn"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-ink hover:text-bg transition-colors"
              >
                <LinkedinIcon size={18} />
              </MagneticButton>
              <MagneticButton
                as="a"
                href={resume.links.github}
                ariaLabel="GitHub"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-ink hover:text-bg transition-colors"
              >
                <GithubIcon size={18} />
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-5 rounded-md border border-line bg-white/60 p-6 md:p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted">Name</span>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-transparent border-b border-line py-3 text-base text-ink focus:border-accent outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted">Email</span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-transparent border-b border-line py-3 text-base text-ink focus:border-accent outline-none transition-colors"
                        placeholder="you@company.com"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted">Message</span>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="bg-transparent border-b border-line py-3 text-base text-ink focus:border-accent outline-none transition-colors resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </label>
                  <div className="pt-2">
                    <MagneticButton
                      as="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-ink px-7 py-4 text-sm font-medium text-bg hover:bg-accent transition-colors"
                    >
                      Send message
                      <Send size={16} />
                    </MagneticButton>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-md border border-accent bg-accent/5 p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, type: 'spring', stiffness: 200 }}
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white mb-6"
                  >
                    <Check size={32} />
                  </motion.div>
                  <h3 className="font-display text-3xl font-medium text-ink">Message sent</h3>
                  <p className="mt-3 text-muted max-w-sm mx-auto">
                    Your email client should have opened. I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
