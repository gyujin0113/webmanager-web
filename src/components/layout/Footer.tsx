import Container from "@/components/ui/Container";
import { KAKAO_URL } from "@/lib/formConfig";
import company from "../../../content/company.json";

/**
 * 전자상거래법상 표시 의무 항목(상호·대표·사업자등록번호·통신판매업신고·주소·전화).
 *
 * 회사 정보는 `content/company.json` 한 곳에만 산다 — 컴포넌트에 하드코딩하지 않는다.
 * 통신판매업 신고번호처럼 아직 없는 값은 라벨째 빼서, 빈 항목이 노출되지 않게 한다.
 */
const legalItems = [
  ["상호", company.name],
  ["대표", company.ceo],
  ["사업자등록번호", company.bizRegNo],
  ["통신판매업신고", company.ecommerceRegNo],
  ["주소", company.address],
  ["전화", company.phone],
]
  .filter(([, value]) => value.trim() !== "")
  .map(([label, value]) => `${label} ${value}`);

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-[clamp(0.75rem,2vh,1.5rem)] pb-24 md:pb-[clamp(0.75rem,2vh,1.5rem)] text-sm text-muted-foreground">
      <Container className="flex flex-col gap-4 short:md:gap-2.5">
        <div className="flex flex-col items-center justify-between gap-4 short:md:gap-2.5 sm:flex-row">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} WebManager
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${company.email}`}
              className="py-2 short:md:py-1 transition-colors hover:text-foreground"
            >
              {company.email}
            </a>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 short:md:py-1 transition-colors hover:text-foreground"
            >
              카카오톡
            </a>
          </div>
        </div>
        <p className="text-center text-xs leading-relaxed text-white/40 break-keep sm:text-left">
          {legalItems.join(" · ")}
        </p>
      </Container>
    </footer>
  );
}
