interface ScrollDownProps {
  href: string;
}

export default function ScrollDown({ href }: ScrollDownProps) {
  return (
    <a
      href={href}
      className="absolute bottom-0 right-8 flex flex-col items-center gap-0 text-muted"
    >
      <span
        className="text-[10px] tracking-[0.25em] uppercase"
        style={{ writingMode: "vertical-rl" }}
      >
        Scroll Down
      </span>
      <span className="w-px h-12 bg-current/30 mt-2 animate-scroll-line" />
    </a>
  );
}
