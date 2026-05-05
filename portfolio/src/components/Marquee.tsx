type Props = {
  words: readonly string[];
};

export default function Marquee({ words }: Props) {
  const line = [...words, ...words];
  return (
    <div
      className="group relative w-full overflow-hidden border-y border-line py-8 md:py-12 select-none"
      aria-hidden
    >
      <div
        className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
        style={{ willChange: 'transform' }}
      >
        {line.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-4xl md:text-6xl font-medium text-ink px-6 md:px-10">
              {w}
            </span>
            <span className="font-display text-4xl md:text-6xl text-accent px-2">*</span>
          </span>
        ))}
      </div>
    </div>
  );
}
