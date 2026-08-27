import Container from "@/components/ui/Container";
import { KAKAO_URL } from "@/lib/formConfig";

const CONTACT_EMAIL = "contact@webmanager.co.kr";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-6 text-sm text-muted-foreground">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center sm:text-left">
          (주)쓰리앤디
          <span className="mx-2 text-white/20">·</span>
          &copy; {new Date().getFullYear()} WebManager
        </p>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="py-2 transition-colors hover:text-foreground"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 transition-colors hover:text-foreground"
          >
            카카오톡
          </a>
        </div>
      </Container>
    </footer>
  );
}
