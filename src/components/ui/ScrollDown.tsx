interface ScrollDownProps {
  href: string;
}

export default function ScrollDown({ href }: ScrollDownProps) {
  return (
    <a
      href={href}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground/60 transition-colors"
    >
      {/* Mouse wheel icon */}
      <div className="w-6 h-10 rounded-full border-2 border-current/30 flex justify-center pt-2">
        <div className="w-1 h-2.5 rounded-full bg-current animate-[scroll-wheel_2s_ease-in-out_infinite]" />
      </div>
      <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
    </a>
  );
}
