# 가이드 위젯 단일 상품 랜딩 v2 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** webmanager.co.kr을 "AI 안내 위젯" 단일 상품 랜딩으로 교체하고(체험 신청 폼 + 랜딩 자체 위젯 데모), 위젯 엔진을 v1.2(호스티드 카탈로그·`open()` API·`#trial` 앵커·루트 리다이렉트·`--live` 검증기)로 올리며, 랜딩 폼의 Telegram 토큰 노출을 제거한다.

**Architecture:** 랜딩은 기존 Next.js 16 정적 export(Cloudflare Pages Git 연동, `main` push = 배포)를 유지하고 섹션만 교체한다(8→7). 폼 알림은 새 Pages Function `/api/notify`가 서버에서 Telegram을 호출하고 토큰은 Pages 환경변수에만 둔다. 가격·체험 조건은 `src/lib/pricing.ts` 단일 출처에서 Pricing·FAQ·Hero·JSON-LD·랜딩 `guide.json`(sync 시 치환)으로 흐른다. 위젯 v1.2는 `webmanager-widget` repo에서 배포(직접 업로드).

**Tech Stack:** Next.js 16 App Router + Tailwind v4 + GSAP(기존), Cloudflare Pages Functions, Vitest(랜딩에 신규 도입, 로직만), webmanager-widget(Preact/Vite, Vitest 97 tests).

**Spec:** `docs/artifacts/07_guide-widget-product-and-landing-v2.md` (확정본). 위젯 설계: `3andD/cs-agent/[2026.08.27]_사이트가이드위젯_설계_v2.md`.

## Global Constraints

- **공개 상품은 위젯 하나.** 랜딩 어디에도 홈페이지 제작·클론·복원·유지보수 구독·티어(베이직/스탠다드/프로) 문구가 남지 않는다 (`grep -rn "클론\|복원\|유지보수\|베이직\|스탠다드\|프로 " src/` = 0건이 완료 기준). FAQ에 "홈페이지 제작도 하나요? → 아니요, 위젯만 합니다" 명시.
- 가격·조건 상수 단일 출처 `src/lib/pricing.ts`: `TRIAL_DAYS=30`, `TRIAL_CATALOG_MAX=20`, `WIDGET_MONTHLY=29000`, `WIDGET_ANNUAL=290000`, `WIDGET_CATALOG=30`. 컴포넌트·FAQ·JSON-LD·guide.json에 숫자 하드코딩 금지.
- 랜딩 위젯 스크립트: `https://widget.webmanager.co.kr/v1/w.js`, `<Script strategy="afterInteractive">`. 랜딩 `content/guide.json` → `public/guide.json` sync(예: grabis `scripts/sync-guide.mjs`), `postbuild`에 검증기(존재 시).
- 섹션 id 고정: `hero` `why` `showcase` `how` `pricing` `trial` `faq`. 각 섹션 `min-h-dvh md:h-dvh md:snap-start`(기존 패턴), 앵커 착지용 `scroll-mt-24`.
- 디자인 톤 유지: Dark cinematic, `brand-accent #2563eb`, FeatureCard·ScrollReveal·HeroTitle·Button·Container 재사용. 이모지 금지(lucide-react). 새 라이브러리 추가 금지(vitest devDep 제외).
- Telegram 토큰·chat_id는 **코드·번들에 절대 없음**. `grep -rn "AAGK\|8461798262\|1707030083" src out` = 0건. Web3Forms access key는 공개 키 설계라 유지.
- 위젯 repo: 번들 ≤ 30KB gz, 답 유형 link|card, 런타임 LLM 0, `/log` 외 서버 호출 없음 — 기존 제약 유지.
- 커밋 prefix `feat:` `fix:` `docs:` `chore:` `test:`, 트레일러 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. 랜딩은 브랜치 `feat/landing-v2` → PR → 규진 확인 후 머지(=배포). 보안 선행(Task 3)은 별도 브랜치 `fix/notify-function` → 즉시 PR.
- 사용자 수동 단계(계획이 대신 못 함): BotFather 토큰 재발급, Pages 환경변수 입력, 익명 스크린샷 승인, PR 머지.

---

## File Structure

### webmanager-widget (v1.2)
```
src/config.ts                 LEAD_BASE_URL 앵커 → #trial (LEAD_ANCHOR 상수 분리)
src/core/lead.ts              앵커 상수 사용
src/main.ts                   window.WebmanagerGuide = { open, close, version } 노출
src/ui/Widget.tsx             mountWidget 이 controller {open, close} 반환
src/cli/validate.ts           --live <origin> 모드
public/_redirects             / → https://webmanager.co.kr/#trial 302
public/_headers               /guide/* CORS
public/guide/.gitkeep          호스티드 카탈로그 디렉토리
public/demo/index.html        (public/index.html 이동) + demo 링크 경로 수정
tests/ui/boot.test.ts, tests/cli/validate.test.ts, tests/core/lead.test.ts  갱신
README.md                     호스티드 카탈로그·open() API·--live
```

### webmanager-web (랜딩)
```
functions/api/notify.ts       Telegram 서버 프록시 (rate limit, kind 별 메시지)
functions/tsconfig.json
wrangler.toml                 pages_build_output_dir = "out"
vitest.config.ts, tests/**    Vitest 도입 (로직만)
src/lib/pricing.ts            가격·체험 상수 단일 출처 + 포맷 헬퍼
src/lib/lead.ts               ref/utm 캡처(sessionStorage) + 읽기
src/lib/validation.ts         폼 검증 순수 함수 (url/name/contact)
src/hooks/useFormSubmit.ts    Web3Forms + /api/notify 제출 훅 (상태·에러)
src/components/ui/TrialForm.tsx      체험 신청 폼 (§5)
src/components/sections/Hero.tsx     교체
src/components/sections/Why.tsx      신규 (Problem 대체)
src/components/sections/Showcase.tsx 신규
src/components/sections/How.tsx      신규
src/components/sections/Pricing.tsx  2열로 교체
src/components/sections/Trial.tsx    신규 (폼 섹션)
src/components/sections/FAQ.tsx      교체
src/components/layout/Footer.tsx     독립 푸터 (회사정보)
src/components/ui/DotNav.tsx         섹션 목록 갱신
src/components/layout/Header.tsx     CTA → #trial
src/app/page.tsx, layout.tsx, opengraph-image.tsx   구성·메타·JSON-LD·OG 카피
content/guide.json, scripts/sync-guide.mjs, scripts/check-guide-if-present.mjs, public/.gitkeep
public/sitemap.xml            lastmod
public/showcase/*.webp        익명화 스크린샷 (사용자 승인 후)
CLAUDE.md                     비즈니스 모델·섹션 구성 갱신
docs/business-and-ops.md, docs/artifacts/06_…md, ops/customers.json   갱신
삭제: Problem.tsx Solution.tsx Process.tsx Portfolio.tsx CTA.tsx ContactForm.tsx
```

---

## Task 1: 위젯 v1.2 — `#trial` 앵커 · `open()` API · 루트 리다이렉트 · 호스티드 카탈로그 CORS

**Files:** (webmanager-widget) Modify `src/config.ts`, `src/core/lead.ts`, `src/main.ts`, `src/ui/Widget.tsx`, `README.md`, `tests/core/lead.test.ts`, `tests/ui/boot.test.ts`. Create `public/_redirects`, `public/_headers`, `public/guide/.gitkeep`. Move `public/index.html` → `public/demo/index.html`.

**Interfaces:**
- Produces: `window.WebmanagerGuide: { open(): void; close(): void; version: string }` (부트 성공 시에만 정의). `mountWidget(...)` returns `{ host: HTMLElement; open(): void; close(): void }` (기존 host 반환 → 객체로 변경; 테스트의 `mountWidget(...)` 호출부는 `.host` 사용으로 갱신). `LEAD_ANCHOR = 'trial'`.

- [ ] **Step 1: 실패 테스트**

`tests/core/lead.test.ts`에 기대값 갱신: `leadUrl('grabis','cta')` → `https://webmanager.co.kr/?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial`.
`tests/ui/boot.test.ts` 추가:
```ts
test('exposes window.WebmanagerGuide after successful boot', async () => {
  await boot(attrsWithStubbedFetch); // 기존 테스트 헬퍼 재사용
  const api = (window as any).WebmanagerGuide;
  expect(typeof api.open).toBe('function');
  api.open();
  await Promise.resolve();
  expect(document.querySelector('[data-wm-guide]')!.shadowRoot!.querySelector('[data-t=panel]')).not.toBeNull();
  api.close();
  await Promise.resolve();
  expect(document.querySelector('[data-wm-guide]')!.shadowRoot!.querySelector('[data-t=panel]')).toBeNull();
});
test('does not define window.WebmanagerGuide when boot fails', async () => { /* 404 fetch → undefined */ });
```

- [ ] **Step 2: 실패 확인** — `npx vitest run tests/core/lead.test.ts tests/ui/boot.test.ts` → FAIL (앵커 불일치, api undefined)

- [ ] **Step 3: 구현**

`src/config.ts`: `export const LEAD_ANCHOR = 'trial';` `src/core/lead.ts`: `#${LEAD_ANCHOR}`.
`src/ui/Widget.tsx`: `App`이 `open` state setter를 외부로 노출 — 간단히 `mountWidget`이 `let setOpenRef: ((v:boolean)=>void)|null` 를 App에 콜백으로 넘겨 저장하고 `{ host, open: () => setOpenRef?.(true), close: () => setOpenRef?.(false) }` 반환.
`src/main.ts` `boot()` 마운트 성공 직후: `(window as any).WebmanagerGuide = { open: ctl.open, close: ctl.close, version: WIDGET_VERSION };`
`public/_redirects`: `/  https://webmanager.co.kr/#trial  302`
`public/_headers`:
```
/guide/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=300
```
`public/index.html` → `public/demo/index.html` (링크 `/demo/product` 등은 그대로; 데모 스크립트 태그 유지). `public/guide.json`은 그대로(데모용, `/demo/` 페이지가 `data-guide="/guide.json"` 명시).
README: 호스티드 카탈로그 스니펫(`data-guide="https://widget.webmanager.co.kr/guide/<site>.json"`), `WebmanagerGuide.open()`, 루트 리다이렉트 안내.

- [ ] **Step 4: 통과 확인** — 전체 `npm test`(≥ 99), `npx tsc --noEmit`, `npm run build && npm run size`(≤30KB), `node dist/validate-guide.mjs public/guide.json dist` OK.
- [ ] **Step 5: Commit** — `feat: v1.2 — #trial 리드 앵커, WebmanagerGuide.open() API, 루트 리다이렉트, /guide/* 호스팅 CORS` · push main.

---

## Task 2: 위젯 검증기 `--live <origin>` 모드

**Files:** Modify `src/cli/validate.ts`, `tests/cli/validate.test.ts`, `package.json`(`guide:check:live` 스크립트), README.

**Interfaces:** `validateGuideLive(guidePath, origin, fetchImpl = fetch): Promise<FileResult>` — internal href마다 `GET origin+path`(HEAD가 405면 GET) 200 확인, hash가 있으면 응답 HTML에 `id="<hash>"` 존재 확인(기존 `hasId` 재사용). CLI: `node dist/validate-guide.mjs --live https://example.com guide.json`.

- [ ] **Step 1: 실패 테스트** — `fetchImpl` 스텁으로: 존재 페이지 200+HTML(id 포함) → ok; 404 → `page not found (404)` 오류; id 없음 → anchor 오류; 네트워크 예외 → `fetch failed` 오류(throw 아님).
- [ ] **Step 2: 실패 확인** — `npx vitest run tests/cli`
- [ ] **Step 3: 구현** — `validate.ts`에 `validateGuideLive` 추가(스키마 검증·보안 규칙은 기존 함수 공유), CLI arg 파싱 `--live <origin>` 분기, 동시 요청 4개 제한(간단한 큐).
- [ ] **Step 4: 통과 확인** — `npm test`, `npm run build`, 실사용 스모크: `node dist/validate-guide.mjs --live https://grabis.co.kr ../grabis-web/content/guide.json` → ✅.
- [ ] **Step 5: Commit** — `feat(cli): --live 모드 (원격 사이트 페이지·앵커 존재 검사)` · push · **배포 `npm run deploy`(컨트롤러)** → `curl -I https://widget.webmanager.co.kr/` 302 확인, `curl -sI https://widget.webmanager.co.kr/guide/.gitkeep`는 무시.

---

## Task 3: 보안 선행 — `/api/notify` Pages Function + Telegram 토큰 제거 (브랜치 `fix/notify-function`)

**Files:** (webmanager-web) Create `functions/api/notify.ts`, `functions/tsconfig.json`, `wrangler.toml`, `vitest.config.ts`, `tests/functions/notify.test.ts`, `src/hooks/useFormSubmit.ts`. Modify `src/components/ui/ContactForm.tsx`(토큰 제거 → 훅 사용), `package.json`(vitest devDep, `test` 스크립트), `.gitignore`(`.dev.vars`, `.wrangler`).

**Interfaces:**
- `POST /api/notify` body `{ kind: 'trial' | 'contact'; fields: Record<string,string> }` → 204. env `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NOTIFY_RATE_PER_MIN?`(기본 5). 필드 값은 각 500자 절단, 키는 화이트리스트(`site,name,contact,mgmt,message,ref,utm_source,utm_medium,landing_path,phone`). 토큰 미설정 시 503(로그만).
- `handleNotify(request, env, ip): Promise<Response>` 테스트용 export. Telegram 호출은 `fetchImpl` 주입.
- `useFormSubmit({ web3formsSubject, kind })` → `{ status, error, submit(fields) }`: Web3Forms POST(access key 상수 유지) → 성공 시 `/api/notify` POST(실패 무시).

- [ ] **Step 1: 실패 테스트** — `tests/functions/notify.test.ts`: 정상 → 204 + Telegram fetch 1회, 메시지 텍스트에 kind 라벨·필드 포함; 화이트리스트 외 키 제외; 토큰 없음 → 503; 6번째 요청 → 429(메모리 Map 카운터, TTL 60s); bad body → 400.
- [ ] **Step 2: 실패 확인** — `npx vitest run`
- [ ] **Step 3: 구현**

```ts
// functions/api/notify.ts
export interface Env { TELEGRAM_BOT_TOKEN?: string; TELEGRAM_CHAT_ID?: string; NOTIFY_RATE_PER_MIN?: string }
const ALLOWED = ['site','name','contact','phone','mgmt','message','ref','utm_source','utm_medium','landing_path'] as const;
const LABEL: Record<string,string> = { trial: '위젯 체험 신청', contact: '상담 문의' };
const rl = new Map<string, { n: number; exp: number }>();  // 워커 인스턴스 로컬 — soft limit
export async function handleNotify(req: Request, env: Env, ip: string, fetchImpl: typeof fetch = fetch): Promise<Response> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return new Response('notify disabled', { status: 503 });
  let body: any; try { body = await req.json(); } catch { return new Response('bad json', { status: 400 }); }
  if (!body || (body.kind !== 'trial' && body.kind !== 'contact') || typeof body.fields !== 'object') return new Response('bad body', { status: 400 });
  const limit = Number(env.NOTIFY_RATE_PER_MIN) > 0 ? Number(env.NOTIFY_RATE_PER_MIN) : 5;
  const now = Date.now(); const e = rl.get(ip); const cur = e && e.exp > now ? e : { n: 0, exp: now + 60_000 };
  if (cur.n >= limit) return new Response(null, { status: 429 }); cur.n++; rl.set(ip, cur);
  const lines = [`📩 *${LABEL[body.kind]}*`, ''];
  for (const k of ALLOWED) { const v = body.fields[k]; if (typeof v === 'string' && v.trim()) lines.push(`*${k}:* ${String(v).slice(0, 500).replace(/[*_`\[]/g, ' ')}`); }
  await fetchImpl(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join('\n'), parse_mode: 'Markdown' }) });
  return new Response(null, { status: 204 });
}
export const onRequestPost: PagesFunction<Env> = ({ request, env }) => handleNotify(request, env, request.headers.get('CF-Connecting-IP') ?? 'unknown');
```
`wrangler.toml`: `name = "webmanager-web"`, `compatibility_date = "2026-08-01"`, `pages_build_output_dir = "out"`. `functions/tsconfig.json`: grabis-web/webmanager-widget 것과 동일(`lib: ["ES2022"]`, workers-types v5 devDep 추가).
`src/hooks/useFormSubmit.ts`: 상태 머신 + Web3Forms + notify. `ContactForm.tsx`: 토큰 상수·`sendTelegramNotification` 삭제, 훅 사용 (동작 동일).

- [ ] **Step 4: 통과 확인** — `npm test`, `npm run build`, `grep -rn "AAGK\|8461798262\|1707030083" src out` = 0.
- [ ] **Step 5: Commit + PR** — `fix(security): Telegram 알림을 Pages Function 으로 이전, 토큰 클라이언트 노출 제거` · `gh pr create` (base main). PR 본문에 **사용자 수동 단계** 명시: ① BotFather `/revoke` → 새 토큰 ② `printf '<token>' | npx wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name webmanager-web`, `printf '1707030083' | npx wrangler pages secret put TELEGRAM_CHAT_ID --project-name webmanager-web` (사용자가 `!` 프리픽스로 직접 실행) ③ 머지. **환경변수 입력 전 머지하면 알림만 503으로 조용히 꺼짐(메일은 정상)** — 안전.

---

## Task 4: 랜딩 기반 — `pricing.ts` · `lead.ts` · `validation.ts` · TrialForm (브랜치 `feat/landing-v2`, base = Task 3 머지 후 main; 아직 미머지면 `fix/notify-function` 위에서 시작)

**Files:** Create `src/lib/pricing.ts`, `src/lib/lead.ts`, `src/lib/validation.ts`, `src/components/ui/TrialForm.tsx`, `tests/lib/*.test.ts`.

**Interfaces:**
```ts
// pricing.ts
export const TRIAL_DAYS = 30, TRIAL_CATALOG_MAX = 20, WIDGET_MONTHLY = 29000, WIDGET_ANNUAL = 290000, WIDGET_CATALOG = 30;
export const won = (n: number) => n.toLocaleString('ko-KR') + '원';          // 29,000원
export const manwon = (n: number) => (n / 10000).toString().replace(/\.0$/, '') + '만원'; // 2.9만원 / 29만원
export const ANNUAL_FREE_MONTHS = 12 - Math.round(WIDGET_ANNUAL / WIDGET_MONTHLY); // 2
// lead.ts (client only)
export interface Lead { ref: string; utm_source: string; utm_medium: string; landing_path: string }
export function captureLead(search = location.search, path = location.pathname): void  // 값 있으면 sessionStorage 'wm-lead' 저장(빈 값 덮어쓰지 않음)
export function readLead(): Lead   // 없으면 빈 문자열들
// validation.ts
export function normalizeSiteUrl(v: string): string | null   // 'grabis.co.kr' → 'https://grabis.co.kr', 유효하지 않으면 null
export function validateTrial(f: TrialFields): TrialErrors    // site/name/contact 필수, contact = 휴대폰 또는 이메일
```
TrialForm 필드: `site`, `name`, `contact`, `mgmt`(라디오 4지: `self|agency|none|unknown`, 라벨 "직접 관리합니다 / 제작업체에 맡기고 있어요 / 관리하고 있지 않아요 / 잘 모르겠어요", 안내문 "설치 안내에 참고합니다"), `message`, honeypot `botcheck`, hidden lead 4개. 제출: `useFormSubmit({ web3formsSubject: \`[위젯 체험 신청] ${site}\`, kind: 'trial' })`. 성공 화면 문구 §5. 스타일은 기존 `inputClasses` 재사용(ContactForm에서 `src/lib/formStyles.ts`로 추출).

- [ ] **Step 1: 실패 테스트** — `pricing` 포맷 3케이스, `ANNUAL_FREE_MONTHS === 2`; `normalizeSiteUrl` 5케이스(도메인/https/공백/한글 도메인 거부/`javascript:` 거부); `validateTrial` 필수·연락처 형식; `captureLead/readLead` 저장·미덮어쓰기.
- [ ] **Step 2: 실패 확인** · **Step 3: 구현** · **Step 4: 통과** (`npm test`) · **Step 5: Commit** `feat(landing): 가격 단일 출처·리드 캡처·체험 폼 검증·TrialForm`.

---

## Task 5: 섹션 교체 — Hero · Why · Showcase · How · Pricing · Trial · FAQ · Footer · page/DotNav/Header

**Files:** Create `Why.tsx`, `Showcase.tsx`, `How.tsx`, `Trial.tsx`; Rewrite `Hero.tsx`, `Pricing.tsx`, `FAQ.tsx`, `Footer.tsx`; Modify `page.tsx`, `DotNav.tsx`, `Header.tsx`; Delete `Problem.tsx Solution.tsx Process.tsx Portfolio.tsx CTA.tsx ContactForm.tsx`.

**카피(확정 초안 — 구현자는 어조 유지하며 다듬어도 되나 사실·숫자는 pricing.ts에서):**
- Hero: 배지 "홈페이지 AI 안내 위젯 · 한 줄 설치" / H1 세그먼트 `["홈페이지에", "AI 안내 위젯을", "달아드립니다."]`(마지막 highlight) / desc "방문자가 묻는 질문에 바로 답하고, 원하는 페이지로 데려다줍니다. 설치는 한 줄, 월 {manwon(WIDGET_MONTHLY)}." / 버튼 1 `30일 무료 체험` → `#trial`, 버튼 2 `지금 눌러보기 ↘` → `onClick: window.WebmanagerGuide?.open()` (없으면 `#trial`로 폴백), 버튼 아래 캡션 "우하단 버튼이 바로 그 위젯입니다."
- Why(`#why`) H2 "방문자는 3초 안에 못 찾으면 나갑니다" / 카드 3(FeatureCard, lucide `PhoneOff` `Map` `DoorOpen`): "전화번호를 못 찾는다 — 연락처는 푸터 맨 아래" / "가격 페이지가 어디 있는지 모른다 — 메뉴 4단계" / "문의는 하고 싶은데 폼까지 안 간다 — 뭘 써야 할지 막막" / 각 카드 하단 한 줄 "→ 위젯: 질문 한 번 누르면 바로 그 자리로".
- Showcase(`#showcase`) H2 "이미 쓰고 있는 사이트" / 좌: 스크린샷 `public/showcase/site-1.webp`(Task 8 전까지 placeholder 카드 "국내 바이오 제조사 적용 중") / 우: 3스텝 "질문을 누르면 → 그 페이지로 이동 → 못 찾은 질문은 문의 폼에 자동으로 채워짐" / 후기 슬롯(없으면 비표시).
- How(`#how`) H2 "챗봇이 아닙니다" / 카드 3(`ShieldCheck` `Code2` `Inbox`): "미리 작성한 질문과 답으로만 동작합니다 — AI가 지어내는 답 없음, 헛소리 0" / "코드를 건드리지 않습니다 — 스크립트 한 줄, 완전 격리, 11KB" / "못 찾은 질문은 사장님께 — 매월 리포트로 어떤 질문이 왔는지 알려드려요".
- Pricing(`#pricing`) H2 "가격은 하나입니다" / 토글 연/월 유지 / 2열 카드: **무료 체험 30일**(0원, TRIAL_CATALOG_MAX개 카탈로그, 종료 리포트 1회, 자동 종료·사이트 무영향, 버튼 "체험 신청" → #trial) · **가이드 위젯**(popular, 월 `won(WIDGET_MONTHLY)` / 연 `won(WIDGET_ANNUAL)` + 배지 `${ANNUAL_FREE_MONTHS}개월 무료`, WIDGET_CATALOG개 + 월 갱신, 매월 리포트, 문의 프리필 연결, 모든 스택, 약정 없음, 버튼 "체험으로 시작" → #trial) / 하단 "제작·리뉴얼은 하지 않습니다. 위젯만 정직하게."
- Trial(`#trial`) 좌 텍스트 "이 페이지 우하단 버튼이 바로 그 위젯입니다" + 체험 포함 3줄 / 우 `<TrialForm/>` / 하단 카카오 링크 유지.
- FAQ(`#faq`) 7문항(스펙 §4 #7) + 답변 각 2문장, 숫자는 pricing.ts. 섹션 하단에 `<Footer/>`(회사정보: (주)쓰리앤디 · contact@webmanager.co.kr · 카카오 · © 연도).
- DotNav: `why 왜` `showcase 사례` `how 원리` `pricing 가격` `trial 체험` `faq FAQ`. Header CTA → `#trial` "무료 체험".
- `page.tsx`: 순서 Hero→Why→Showcase→How→Pricing→Trial→FAQ. JSON-LD: `WebSite` + `Product`(name "가이드 위젯", offers 월/연 KRW, `ProfessionalService` 제거).

- [ ] **Step 1**: 각 섹션 구현(서버 컴포넌트 기본, Hero/Pricing/FAQ/TrialForm만 client). 삭제 파일 제거 후 `grep` 제약 검사.
- [ ] **Step 2**: `npm run build` 성공, `npm run lint` 0 에러, `grep -rn "클론\|복원\|유지보수\|베이직\|스탠다드" src/` = 0.
- [ ] **Step 3**: `npm run dev`로 스냅·GSAP·DotNav 동작 육안(구현자: 서브에이전트면 빌드 산출물 curl로 섹션 id 7개 존재 확인으로 대체, 시각은 컨트롤러 QA).
- [ ] **Step 4: Commit** `feat(landing): 위젯 단일 상품 7섹션으로 교체 (Hero/Why/Showcase/How/Pricing/Trial/FAQ)`.

---

## Task 6: 랜딩 자체 위젯 — `content/guide.json` · sync/검증 · `<Script>` · 앵커

**Files:** Create `content/guide.json`, `scripts/sync-guide.mjs`(grabis 것 복사 + `{{price}}`·`{{trialDays}}` 치환: `src/lib/pricing.ts`를 import 못 하므로 `pricing.json`을 sync 스크립트가 `src/lib/pricing.ts`에서 정규식으로 상수 추출 — 또는 상수를 `content/pricing.json`에 두고 `pricing.ts`가 그것을 import(**이쪽 채택**: `content/pricing.json` 단일 출처, `pricing.ts`는 re-export + 헬퍼)), `scripts/check-guide-if-present.mjs`(grabis 복사), `public/.gitkeep`; Modify `package.json`(`build`: `node scripts/sync-guide.mjs && next build`, `postbuild`), `.gitignore`(`/public/guide.json`), `layout.tsx`(`<Script>`), 섹션에 `scroll-mt-24`.

**guide.json 15개 (site "webmanager", brand color `#2563eb`, label "무엇을 도와드릴까요?"):**
카테고리 `widget 위젯` · `price 가격·체험` · `setup 도입` · `company 회사`.
- widget: "이 위젯이 뭔가요?"→card "지금 보고 계신 이 버튼이에요. 방문자 질문에 답하고 페이지로 안내합니다." href `#how` / "챗GPT 같은 건가요?"→card "아니요. 미리 써둔 질문·답으로만 동작해 지어내는 답이 없습니다." `#how` / "사이트가 느려지나요?"→card "11KB, 페이지 로드 후 실행돼 속도에 영향 없습니다." `#how` / "적용 사례 있나요?"→link `#showcase`
- price: "가격이 얼마예요?"→card "월 {{price}} (연 {{annual}}, {{freeMonths}}개월 무료). 약정 없음." `#pricing` / "무료 체험은?"→card "{{trialDays}}일, 질문 {{trialMax}}개까지. 끝나면 버튼만 사라집니다." `#pricing` / "체험 신청은 어떻게?"→link `#trial` / "해지는?"→card "월 결제는 언제든, 연 결제는 잔여분 환불 상담." `#faq`
- setup: "우리 사이트도 되나요?"→card "워드프레스·아임웹·카페24·윅스·직접 제작 전부 됩니다." `#faq` / "설치는 어떻게?"→card "스크립트 한 줄을 넣거나, 저희가 대신 넣어드립니다." `#faq` / "질문은 누가 쓰나요?"→card "저희가 사이트를 보고 작성합니다. 원하시면 수정 요청 무제한." `#faq` / "홈페이지 제작도 하나요?"→card "아니요, 위젯만 합니다." `#faq`
- company: "연락처"→card "contact@webmanager.co.kr" `mailto:contact@webmanager.co.kr` / "카카오톡 상담"→link `https://open.kakao.com/me/webmanager` / "회사 정보"→link `#faq`
fallback: mode human, href `/#trial`, prefillParam `message`, text "못 찾으셨나요? 체험 신청 메모에 남겨주시면 답해드립니다." (TrialForm은 `?message=`를 메모 필드 프리필로 읽음 — Task 4에 포함.)

- [ ] **Step 1**: `content/pricing.json` 생성 + `pricing.ts` 리팩터(값 동일) → 기존 테스트 통과.
- [ ] **Step 2**: sync 스크립트(치환 포함) + 테스트(치환 결과 문자열) · guide.json 작성 · `layout.tsx` Script · `scroll-mt-24`.
- [ ] **Step 3**: `npm run build` → `out/guide.json` 존재, 치환 완료(`grep "29,000원" out/guide.json`), postbuild 검증기 `✅`(검증기는 `../webmanager-widget/dist/validate-guide.mjs`).
- [ ] **Step 4: Commit** `feat(landing): 랜딩 자체 가이드 위젯 (guide.json 15개, 가격 치환 sync, 검증)`.

---

## Task 7: 메타·SEO·OG·sitemap·CLAUDE.md

**Files:** Modify `layout.tsx`(title/description/keywords), `opengraph-image.tsx`(카피 "홈페이지 AI 안내 위젯 / 한 줄 설치 · 월 2.9만"), `public/sitemap.xml`(lastmod 2026-08-27), `CLAUDE.md`(비즈니스 모델·타겟·섹션 구조·Contact form 설명을 위젯 단일 상품으로 교체; 구독 모델은 "내부 가격표, 랜딩 비노출" 한 줄).

- [ ] Step 1 수정 · Step 2 `npm run build` + `out/index.html`에서 `<title>`·description 확인, OG 이미지 생성 확인 · Step 3 Commit `docs(seo): 위젯 단일 상품 메타·OG·CLAUDE.md`.

---

## Task 8: PR · 프리뷰 QA · 운영 문서 · 스크린샷

**Files:** `docs/business-and-ops.md`, `docs/artifacts/06_…md`(공개 상품=위젯 한 줄), `ops/customers.json`(스키마: `plan`, `guideHosting`, `trialEndsAt`, `mgmtStatus` — grabis `plan:'founding', guideHosting:'site'`), `ops/skills/apply-edit/SKILL.md`(hosted 카탈로그 편집 경로 한 줄), `public/showcase/site-1.webp`(사용자 승인 후 — 컨트롤러가 grabis 스크린샷 익명화 캡처).

- [ ] Step 1: `git push -u origin feat/landing-v2` + `gh pr create` (체크리스트: 7섹션·폼 실수신·위젯 15칩·모바일·Lighthouse·`grep` 제약 0건·토큰 0건).
- [ ] Step 2: 프리뷰(`bash ops/scripts/get-preview-url.sh webmanager-web feat/landing-v2`)에서 컨트롤러 QA: `?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial` 진입 → 스크롤·hidden 값, 체험 폼 제출 1회(메일+Telegram), 위젯 15칩 앵커 착지(스냅), Hero "지금 눌러보기" → 위젯 오픈, 모바일 375px.
- [ ] Step 3: 운영 문서·customers.json 커밋(같은 PR).
- [ ] Step 4: 규진 머지 → 프로덕션 확인 → grabis 위젯 푸터 링크가 `#trial`에 착지하는지 실확인.

---

## Self-Review
- **Spec coverage**: §1-2 상품(T5 Pricing/FAQ, T4 pricing.ts) · §3 퍼널(T1 앵커, T4 lead.ts, T5 Trial) · §4 7섹션(T5) · §5 폼(T4) · §6.1(T3) · §6.2(T6) · §6.3(T4/T6 content/pricing.json) · §6.4(T1 CORS/디렉토리, T2 --live; 실제 호스티드 고객 온보딩은 첫 체험 고객 때) · §6.5(T1) · §6.6(T1/T2) · §7(T7) · §9 검증(T8) · §10 순서 = T3 → T1/T2 → T4~T7 → T8.
- **Placeholder scan**: 스크린샷 파일은 사용자 승인 후(placeholder 카드로 출시 가능) — 명시됨. 토큰 값은 사용자 수동.
- **Type consistency**: `useFormSubmit({web3formsSubject, kind})` T3 정의 ↔ T4 TrialForm 사용; `readLead()` ↔ hidden 필드; `mountWidget` 반환 변경 ↔ 위젯 테스트 `.host`; `LEAD_ANCHOR` ↔ Trial 섹션 id `trial`.
