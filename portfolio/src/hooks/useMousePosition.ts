import { useEffect, useRef, useState } from 'react';

export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    const tick = () => {
      setPos((prev) => ({
        x: prev.x + (target.current.x - prev.x) * 0.18,
        y: prev.y + (target.current.y - prev.y) * 0.18,
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', handleMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return pos;
}
