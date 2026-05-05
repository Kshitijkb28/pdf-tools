import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const onMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement | null;
      const hoverable = !!target?.closest('a, button, [role="button"], [data-cursor="hover"]');
      setHovering(hoverable);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [visible]);

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: 32,
          height: 32,
          border: '1.5px solid #0E0E0E',
          mixBlendMode: 'difference',
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          x: pos.x,
          y: pos.y,
          scale: hovering ? 1.8 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.3 }}
      />
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-ink"
        style={{ width: 5, height: 5, mixBlendMode: 'difference', translateX: '-50%', translateY: '-50%' }}
        animate={{ x: pos.x, y: pos.y, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      />
    </>
  );
}
