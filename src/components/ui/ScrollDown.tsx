interface ScrollDownProps {
  href: string;
}

export default function ScrollDown({ href }: ScrollDownProps) {
  return (
    <a
      href={href}
      className="absolute bottom-0 right-4 sm:right-8 hidden sm:flex flex-col items-center gap-0 text-muted-foreground"
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
