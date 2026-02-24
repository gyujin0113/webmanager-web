import Container from "@/components/ui/Container";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <Container className="flex items-center justify-between h-16">
        <a href="#" className="text-lg font-bold tracking-tight text-foreground">
          WebManager
        </a>
        <a
          href="#contact"
          className="text-xs font-medium px-4 py-2.5 rounded-lg border border-white/10 hover:border-brand-accent/50 text-brand-accent cursor-pointer transition-all duration-200"
        >
          무료 진단 받기
        </a>
      </Container>
    </header>
  );
}
