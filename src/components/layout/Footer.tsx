import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted-foreground">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; 2025 Generalist Lab. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="mailto:hello@generalistlab.com" className="hover:text-foreground transition-colors">
            이메일 문의
          </a>
        </div>
      </Container>
    </footer>
  );
}
