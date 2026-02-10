import Container from "@/components/ui/Container";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-md">
      <Container className="flex items-center justify-between h-16">
        <a href="#" className="text-lg font-bold tracking-tight text-foreground">
          Generalist Lab
        </a>
        <a
          href="#contact"
          className="text-xs font-medium px-4 py-2 rounded-lg border border-border hover:border-foreground text-cta cursor-pointer transition-all duration-200"
        >
          무료 진단 받기
        </a>
      </Container>
    </header>
  );
}
