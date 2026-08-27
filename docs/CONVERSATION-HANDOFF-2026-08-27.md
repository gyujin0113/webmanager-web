# 핸드오프 2026-08-27 — 가이드 위젯 v1.2 출시 + 랜딩 v2 진행 중

> 다음 세션은 이 문서 → `docs/artifacts/07_guide-widget-product-and-landing-v2.md`(스펙) → `docs/plans/2026-08-27-guide-widget-landing-v2.md`(계획) 순으로 읽고, SDD 레저 `.superpowers/sdd/2026-08-27-guide-widget-landing-v2/progress.md`(git 제외, 로컬)에서 이어간다.

## 오늘 결정된 것 (사업)
- **공개 상품은 "가이드 위젯" 하나.** 홈페이지 제작·클론·유지보수 구독은 랜딩에서 삭제. 관리 구독은 체험 신청 폼의 "지금 홈페이지 관리는 어떻게 하고 계세요?" 답을 보고 **온보딩 통화에서만** 제안.
- 가격: **월 2.9만 / 연 29만(2개월 무료)**, 티어 없음, 약정 없음. 무료 체험 30일(카탈로그 20개, 종료 시 버튼만 사라짐).
- Showcase는 익명("국내 바이오 제조사 적용 중"). 관리 현황 질문에 금액 선택지 없음.
- 마케팅 퍼널: grabis.co.kr 위젯 푸터 "이런 안내 위젯, 우리 사이트에도 →" → `webmanager.co.kr/?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial`.

## 라이브 상태
| | 상태 |
|---|---|
| 위젯 엔진 `webmanager-widget` | **v1.2 배포됨** (`widget.webmanager.co.kr/v1/w.js`, 108 tests). 루트 → 랜딩 `#trial` 302, `/demo/` 데모, `/guide/*` CORS(호스티드 카탈로그), `WebmanagerGuide.open()`, `--live` 검증기, `ALLOWED_SITES=grabis,demo` 활성 |
| grabis.co.kr | 위젯 프로덕션 적용 완료(PR #6 머지). 푸터 리드 링크가 `#trial`로 감 — **랜딩 v2 배포 전까지 홈 상단에 떨어짐** |
| webmanager-web `main` | 구 랜딩(8섹션) 그대로 배포 중. ops PR #1 머지됨 |
| webmanager-web **PR #2** `fix/notify-function` | **리뷰 클린, 미머지.** Telegram 토큰을 `/api/notify` Pages Function으로 이전 |
| webmanager-web `feat/landing-v2` | Task 4·5 완료(가격 단일 출처·리드 캡처·TrialForm·7섹션 교체, 커밋 `7cbff6f`). **Task 5 리뷰 진행 중이었음** — 결과는 레저/`.superpowers/sdd/.../task-5-report.md` 참조 |

## 다음 세션 할 일 (순서대로)
1. **사용자 수동 (5분)** — BotFather `/mybots` → 봇 → API Token → **Revoke** → 새 토큰. 그 다음:
   ```
   printf '<새토큰>' | npx wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name webmanager-web
   printf '1707030083' | npx wrangler pages secret put TELEGRAM_CHAT_ID --project-name webmanager-web
   ```
   (chat_id = 규진 텔레그램 ↔ 봇 1:1 대화방. 문의 알림은 메일 `contact@webmanager.co.kr` + 이 텔레그램 DM 두 군데로 온다.)
2. **PR #2 머지** (`gh pr merge 2 --squash`) → 배포 후 `curl -X POST https://webmanager.co.kr/api/notify -H 'Content-Type: application/json' -d '{"kind":"contact","fields":{"name":"t"}}'` → 204(시크릿 있음) 또는 503(없음). 404면 Pages가 `functions/`를 인식 못 한 것.
3. **Task 5 수정 라운드** (리뷰 완료: 구조·제약 전부 통과, 카피 2건 + QA 1건 수정 필요, 구현자 에이전트는 종료됐으니 fresh 구현자에게):
   - FAQ #1 "…동작을 확인했습니다" → "…전부 지원합니다" (실설치 1곳뿐, 검증 주장 금지)
   - Showcase 플레이스홀더의 "고객사 동의 후 실제 화면으로 교체됩니다." 한 줄 삭제(내부 메모 노출)
   - `sections/Trial.tsx` `md:h-dvh` → `md:min-h-dvh` (812px에서 제출 버튼 바닥, 낮은 화면 잘림 — 컨트롤러 QA)
   - Why 카드 3 문장 술어 보완("…그대로 채워서 전달"), 카카오 링크 `target/rel`, Pricing 토글 `aria-pressed`
   - **릴리스 게이트**: Hero/Trial 카피가 "우하단 버튼"을 전제하므로 Task 6(위젯 장착) 전에는 절대 main 머지 금지
   - Task 7로 넘길 것: `public/catalog/*.html`(구 유지보수 카탈로그 3개) robots `Disallow: /catalog/` 또는 삭제 · 푸터에 사업자등록번호·통신판매업신고·대표자·주소·전화(전자상거래법) · sitemap lastmod · CLAUDE.md 구 포지셔닝 전면 갱신 · Pricing 기본 토글 연→월 여부(히어로 "월 2.9만"과 첫 숫자 일치) 규진 결정 · FAQ 접힘 상태 a11y(`hidden`) · Product JSON-LD `image`
   - 모바일 375px은 프리뷰 실기기 확인.
4. **Task 6** 랜딩 자체 위젯(`content/guide.json` 15개 + sync/postbuild 검증 + `<Script>` + `scroll-mt-24`) — `content/pricing.json`이 이미 단일 출처, sync 스크립트가 `{{price}}` 등 치환.
5. **Task 7** 메타/OG/sitemap/CLAUDE.md (Task 5가 layout·OG 카피를 이미 일부 피벗함 — 리포트 참조).
6. **Task 8** `feat/landing-v2` PR → 프리뷰 QA(`?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial` 진입, 체험 폼 실제 제출 1회, 위젯 15칩 앵커, Hero "지금 눌러보기") → 운영 문서(06·business-and-ops·customers.json 스키마·온보딩 통화 스크립트) → 규진 머지 → grabis 푸터 링크가 `#trial`에 착지하는지 실확인.
7. 그 후: 익명 스크린샷(`public/showcase/site-1.webp`) 승인, 진엽 형 실명 동의 여부.

## 실행 방식 메모
- SDD(subagent-driven-development)로 태스크당 fresh 구현자 + 리뷰. 브리프는 `.superpowers/sdd/2026-08-27-guide-widget-landing-v2/task-N-brief.md`(로컬). 워크스페이스가 없으면 `scripts/sdd-workspace`/`task-brief`로 재생성 가능.
- 위젯 배포는 **`npm run deploy`**(직접 업로드, Git 연동 아님) — 전 고객 사이트에 즉시 반영. 호환 깨지면 `/v2/`.
- 랜딩 QA 시 Chrome 확장 탭은 백그라운드 rAF가 멈춰 GSAP이 진행 안 됨 → `main *{opacity:1!important;transform:none!important}` 주입 후 캡처.
- 레저에 룰링 전부 기록돼 있음(`Ruling:` grep).

## 참고 링크
- 위젯 설계: `3andD/cs-agent/[2026.08.27]_사이트가이드위젯_설계_v2.md` · 구현 리포트/레저: `3andD/.superpowers/sdd/…`(로컬)
- PR #2: https://github.com/gyujin0113/webmanager-web/pull/2
- 위젯 데모: https://widget.webmanager.co.kr/demo/
