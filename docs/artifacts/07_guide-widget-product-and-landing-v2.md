# 07 — 가이드 위젯 단일 상품 + 랜딩 v2

**Date**: 2026-08-27 (v2: 위젯 단일 상품으로 재정의)
**상태**: 설계 확정 (2026-08-27, 규진 승인) → 구현 계획
**선행**: [06 비즈니스·운영 모델](06_business-model-and-market-direction.md) · 위젯 설계 `3andD/cs-agent/[2026.08.27]_사이트가이드위젯_설계_v2.md` · 위젯 repo `webmanager-widget` (live `widget.webmanager.co.kr`, v1.1 리드 푸터 배포됨) · 1호 grabis.co.kr 적용 완료

---

## 1. 결정: 랜딩은 "위젯을 파는 곳"이다

**공개 메시지는 하나** — "홈페이지에 AI 안내 위젯을 달아드립니다. 한 줄 설치, 월 2.9만."
홈페이지 제작·구출·유지보수 구독은 **랜딩에서 뺀다.** (사업이 다각화돼 보이면 신뢰가 아니라 혼란을 산다.)

관리 구독은 죽는 게 아니라 **영업 대화로 내려간다**:
- 체험 신청 폼에 "지금 홈페이지 관리는 어떻게 하고 계세요?" 한 칸 (§5) → 답이 "제작업체에 월 N만" 이면 온보딩 통화에서 자연스럽게 "그 비용이면 저희가 위젯 포함해서 관리해드릴 수 있어요"로 이어진다.
- 위젯 미매칭 리포트에 "사이트에 없는 답"이 반복되면 → "그 페이지 만들어드릴까요" = 개별 견적.
- 기존 파운딩 고객 2곳·06의 구독 티어는 **내부 가격표로 유지**(랜딩 비노출). 06 문서엔 "공개 상품 = 위젯, 구독은 인바운드 후 제안"으로 한 줄 갱신.

Why 이 구조가 맞나: 위젯은 30초에 보여줄 수 있고, 한계비용이 카탈로그 1시간이라 2.9만에도 남고, 설치가 스크립트 한 줄이라 어떤 스택이든 된다. 방문자는 "저거 갖고 싶다"로 들어오지 "관리 맡기고 싶다"로 안 들어온다. 관리 니즈는 위젯을 붙인 *뒤* 데이터로 드러난다.

---

## 2. 상품 (공개)

| | 무료 체험 30일 | 가이드 위젯 |
|---|---|---|
| 가격 | 0원 | **월 2.9만** 또는 **연 29만**(2개월 무료) — 정액, 월 결제는 약정 없음 |
| 카탈로그(질문·답·링크) | 최대 20개, 우리가 작성 | 30개 + **월 1회 갱신 무제한 요청** |
| 설치 | 스크립트 1줄 (안내해드림 / 원하면 대신 넣어드림) | 동일 |
| 리포트 | 체험 종료 시 1회 (방문자가 물었지만 답 못 한 질문) | 매월 |
| 문의 연결 | 사이트의 기존 문의 폼/전화로 프리필 연결 | 동일 |
| 지원 스택 | 워드프레스·아임웹·카페24·윅스·직접 제작 전부 | 동일 |
| 종료 | 30일 후 자동 종료(버튼만 사라짐, 사이트 무영향) — 종료 7일 전 안내 | 해지 시 즉시 |

- 티어는 **하나**. "프로/스탠다드" 같은 분할은 만들지 않는다 — 단순함이 상품이다.
- 명시적으로 **하지 않는 것**(FAQ에 적시): 홈페이지 제작·리뉴얼·기능 개발. 요청이 오면 "개별 상담"으로 받는다(랜딩엔 문구 없음).
- 가격 확정: 월 29,000 / 연 290,000. `src/lib/pricing.ts` 단일 출처. Pricing 섹션의 기존 월/연 토글을 재사용(연 선택 시 "2개월 무료" 배지).

---

## 3. 유입 퍼널

```
고객 사이트 위젯 푸터 "이런 안내 위젯, 우리 사이트에도 →"   (grabis 라이브)
  → webmanager.co.kr/?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial
  → 랜딩: 우하단에 실제 위젯(도그푸딩 데모) + #trial 체험 신청 폼
  → Web3Forms 메일 + Telegram (hidden: ref/utm + "관리 현황" 답)
  → 24h 내 답신 → 카탈로그 작성(1~2일) → 설치 → 체험 시작
```
추적은 문의 메일에 유입 사이트·관리 현황이 찍히는 것까지 (분석툴 없음, YAGNI).
위젯 푸터 링크 앵커 `#guide-widget` → `#trial`로 변경 (widget v1.2, `LEAD_BASE_URL` 상수 1곳).

---

## 4. 랜딩 v2 구조 — 7섹션

현재 8섹션(Hero/Problem/Solution/Pricing/Process/Portfolio/FAQ/CTA)을 **위젯 단일 상품 기준 7섹션**으로 교체. 다크 시네마틱 톤·스냅·GSAP은 유지(리디자인 아님).

| # | 섹션 (id) | 역할 | 카피 초안 |
|---|---|---|---|
| 1 | **Hero** | 상품 한 줄 + 데모 | H1 "홈페이지에 **AI 안내 위젯**을 달아드립니다" / sub "방문자가 묻는 질문에 바로 답하고, 원하는 페이지로 데려다줍니다. 설치 한 줄, 월 2.9만." / CTA "30일 무료 체험" (→ #trial) + "지금 눌러보기 ↘" (→ 우하단 위젯 열기). |
| 2 | **Problem** (`#why`) | 방문자 관점 문제 3개 | "전화번호 찾다가 나간다" / "가격 페이지 어디 있는지 모른다" / "문의는 하고 싶은데 폼까지 안 간다" — 각 카드에 "위젯이 하는 일" 한 줄 대응. (기존 4유형 에이전시 불만 카피는 삭제) |
| 3 | **Showcase** (`#showcase`) | 증거 | 적용 사이트 스크린샷(로고·상호 블러) + 3컷 흐름(질문 클릭 → 페이지 이동 → 문의 프리필) + "국내 바이오 제조사 적용 중" (실명 비노출, 동의 시 교체) + 후기 한 줄(확보 시). |
| 4 | **How** (`#how`) | 불안 제거 3카드 | "챗봇이 아닙니다 — 미리 작성한 질문·답으로만 동작, 헛소리 0" / "코드를 안 건드립니다 — 스크립트 1줄, 격리, 11KB" / "못 찾은 질문은 사장님께 — 매월 리포트". |
| 5 | **Pricing** (`#pricing`) | 2열 | 체험 0원 / 위젯 2.9만 (§2 표 그대로). 하단 한 줄: "제작·리뉴얼은 하지 않습니다. 위젯만 정직하게." |
| 6 | **Trial** (`#trial`) | **전환 지점** | 좌: "이 페이지 우하단 버튼이 바로 그 위젯입니다" + 체험 포함 내용 / 우: 신청 폼(§5). `?ref=` 진입 시 여기로 스크롤. |
| 7 | **FAQ + Footer** (`#faq`) | | "우리 사이트는 워드프레스/아임웹인데요?" / "챗GPT 같은 건가요?" / "질문은 누가 쓰나요?" / "체험 끝나면?" / "사이트 느려지나요?" / "홈페이지 제작도 하나요? → 아니요, 위젯만 합니다" / "해지는?" + 회사정보 푸터. |

삭제: Solution(에이전시 대비), Process(클론→이전), Portfolio(→Showcase 흡수), 기존 CTA 상담폼(→Trial 폼으로 대체, 하나만).

---

## 5. 체험 신청 폼 (#trial)

| 필드 | 필수 | 비고 |
|---|---|---|
| 홈페이지 주소 | ✅ | 도메인 형태 검증, `https://` 자동 보정 |
| 회사/이름 | ✅ | |
| 연락처 (휴대폰 또는 이메일) | ✅ | 둘 중 하나 |
| **지금 홈페이지 관리는 어떻게 하고 계세요?** | 선택 | 라디오: 직접 관리 / 제작업체에 맡김 / 관리 안 하고 있음 / 잘 모름 — **업셀 근거 수집**(금액은 묻지 않음, 통화에서), 폼엔 "설치 안내에 참고합니다"로만 설명 |
| 메모 | 선택 | 500자 |
| hidden `ref` `utm_source` `utm_medium` `landing_path` | 자동 | sessionStorage |
| honeypot | 자동 | 기존 패턴 |

제출: Web3Forms(제목 `[위젯 체험 신청] <사이트>`) + `/api/notify`(§6.1). 성공 화면: "24시간 안에 연락드립니다. 그동안 우하단 버튼을 눌러보세요."

**온보딩 통화 스크립트 한 줄 (ops 문서에)**: 관리 현황이 "업체에 월 N만"이면 → "위젯 붙이면서 사이트도 같이 봐드릴게요. 그 비용이면 저희가 위젯 포함해서 관리해드릴 수 있습니다" — 여기서만 구독이 등장한다.

---

## 6. 기술 변경

### 6.1 보안 선행 — Telegram 토큰 클라이언트 노출 제거
`src/components/ui/ContactForm.tsx`에 봇 토큰·chat_id 하드코딩 → 번들 공개 중.
- `functions/api/notify.ts` (Pages Function): POST `{kind, fields}` → 서버가 Telegram 호출. 환경변수 `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. IP당 분당 5회.
- **BotFather `/revoke`로 토큰 재발급** 후 Pages 환경변수에만 저장. `wrangler.toml`(`pages_build_output_dir = "out"`) 추가.
- 랜딩 개편과 분리해 **먼저** 배포.

### 6.2 랜딩 자체 위젯 (도그푸딩 = 데모)
- `content/guide.json` (grabis 패턴: sync 스크립트·postbuild 검증 이식). 카테고리: 위젯 / 가격·체험 / 도입 / 회사. 약 15개 — "가격이 얼마예요?"(card, `{{price}}`) / "우리 사이트도 되나요?"(→`#faq`) / "체험 신청은?"(→`#trial`) / "챗GPT인가요?"(card→`#how`) / "설치는 어떻게?"(card) / "연락처"(card) / "그래비스 적용 사례"(→`#showcase`) …
- `<Script src="https://widget.webmanager.co.kr/v1/w.js" strategy="afterInteractive" />`, 섹션 id + `scroll-mt`. 스크롤 스냅 환경에서 앵커 착지 E2E 확인.
- Hero "지금 눌러보기" = 위젯 `window.WebmanagerGuide.open()` (widget v1.2에 공개 API 추가, 5줄). 없으면 텍스트 안내로 폴백.

### 6.3 가격 단일 출처
`src/lib/pricing.ts`: `TRIAL_DAYS = 30`, `TRIAL_CATALOG_MAX = 20`, `WIDGET_MONTHLY = 29000`, `WIDGET_ANNUAL = 290000`, `WIDGET_CATALOG = 30` → Pricing·FAQ·Hero·guide.json(sync 시 `{{price}}` 치환)·JSON-LD 전부 여기서.

### 6.4 호스티드 카탈로그 (우리가 소유하지 않은 사이트 전부) — widget repo
- `webmanager-widget/public/guide/<site>.json` + `public/_headers` (`/guide/*` → `Access-Control-Allow-Origin: *`).
- 고객 스니펫: `<script src="https://widget.webmanager.co.kr/v1/w.js" data-guide="https://widget.webmanager.co.kr/guide/<site>.json" defer></script>`.
- 검증기 `--live <origin>` 모드(HEAD로 페이지 존재, HTML fetch로 앵커 검사). `npm run guide:check:live -- <site>`.
- **킬 스위치**: 체험 종료·미납 → `guide/<site>.json` 삭제(404 → 버튼 소멸) + `ALLOWED_SITES`에서 제거.
- ops `customers.json`: `plan: 'trial'|'widget'|'founding'|…`, `guideHosting: 'site'|'hosted'`, `trialEndsAt`, `mgmtStatus`(폼 답). `/apply-edit`는 hosted면 widget repo 파일을 편집.

### 6.5 위젯 루트
`public/_redirects`: `/  https://webmanager.co.kr/#trial  302`. 데모는 `/demo/`로 이동(비노출, QA용).

### 6.6 위젯 v1.2 (widget repo)
`LEAD_BASE_URL` 앵커 `#guide-widget` → `#trial` · `window.WebmanagerGuide.open()` · `/guide/*` + `_headers` · `--live` 검증기 · `_redirects`.

---

## 7. SEO / 메타
title "홈페이지 AI 안내 위젯 — 한 줄 설치, 월 2.9만 | Web Manager". 키워드: 홈페이지 챗봇, 사이트 안내 위젯, 홈페이지 FAQ 위젯, 채널톡 대안(검색어용; 본문에 타사명 비교 문구 없음). JSON-LD `Product`(offers: 29000 KRW/월, 290000 KRW/년). 기존 "유지보수·클론" 키워드·카피 제거.

## 8. 비범위
디자인 시스템 변경 · 다국어 · 결제 자동화 · 분석 대시보드 · LLM 애드온 · 셀프 카탈로그 콘솔 · 홈페이지 제작/구독 공개 상품화(내부 가격표로만).

## 9. 검증
폼(검증·허니팟·hidden 동봉·메일/Telegram 실수신 1회) · `/api/notify`(토큰 미노출 grep, 429) · 랜딩 위젯 15칩 앵커 착지(스냅) · 모바일 · Lighthouse 전후 · 호스티드 카탈로그 CORS(grabis 프리뷰로 임시) · `?ref=…#trial` 진입 스크롤+hidden 값.

## 10. 실행 순서
1. **보안 선행**: `/api/notify` + 토큰 재발급 + 환경변수 (즉시)
2. widget v1.2: `#trial` 앵커·`open()`·`/guide/*`+CORS·`--live`·`_redirects`
3. 랜딩: `pricing.ts` → 7섹션 교체 → 체험 폼 → guide.json + 위젯 장착 → 앵커·SEO
4. 06 갱신("공개 상품=위젯, 구독은 인바운드 후 제안") · `customers.json` 스키마 · business-and-ops · 온보딩 통화 스크립트
5. 적용 사이트 스크린샷(익명화)·후기 → Showcase

## 11. 결정 기록 (2026-08-27, 규진)
- 가격: **월 2.9만 / 연 29만** 확정.
- 체험: 카탈로그 20개, 30일 후 자동 종료(버튼 소멸) 확정.
- Showcase: **익명("국내 바이오 제조사")**. 실명은 진엽 형 동의 시.
- 관리 현황 질문: 금액 선택지 없이 4지선다만.
