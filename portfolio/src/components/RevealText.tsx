import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

type Props = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
} & Omit<HTMLMotionProps<'h1'>, 'children'>;

export default function RevealText({ text, className = '', as = 'h2', delay = 0, ...rest }: Props) {
  const words = text.split(' ');
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.04, delayChildren: delay }}
      {...rest}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top" style={{ marginRight: '0.25em' }}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
