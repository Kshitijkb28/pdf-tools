import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  ariaLabel?: string;
  onClick?: () => void;
};

type Props =
  | (BaseProps & { as?: 'button'; href?: undefined; download?: undefined })
  | (BaseProps & { as: 'a'; href: string; download?: boolean | string })
  | (BaseProps & { as: 'div'; href?: undefined; download?: undefined });

export default function MagneticButton(props: Props) {
  const { children, className = '', strength = 0.35, ariaLabel, onClick } = props;
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.6 });

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  const motionStyle = { x: sx, y: sy };

  if (props.as === 'a') {
    const anchorProps: HTMLMotionProps<'a'> = {
      onPointerMove: handleMove,
      onPointerLeave: handleLeave,
      onClick,
      className,
      'aria-label': ariaLabel,
      style: motionStyle,
      href: props.href,
      download: props.download,
      target: props.href?.startsWith('http') ? '_blank' : undefined,
      rel: props.href?.startsWith('http') ? 'noopener noreferrer' : undefined,
    };
    return (
      <motion.a ref={setRef as React.Ref<HTMLAnchorElement>} data-cursor="hover" {...anchorProps}>
        {children}
      </motion.a>
    );
  }

  if (props.as === 'div') {
    return (
      <motion.div
        ref={setRef as React.Ref<HTMLDivElement>}
        data-cursor="hover"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={onClick}
        className={className}
        aria-label={ariaLabel}
        style={motionStyle}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      ref={setRef as React.Ref<HTMLButtonElement>}
      data-cursor="hover"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      style={motionStyle}
    >
      {children}
    </motion.button>
  );
}
