# 핸드오프 2026-08-28 — 랜딩 v2 + 뷰포트 맞춤 프로덕션 배포 완료

> 다음 세션은 이 문서 → `CLAUDE.md`(v2 기준으로 갱신됨) → `docs/business-and-ops.md` 순으로 읽는다. SDD 레저 `.superpowers/sdd/2026-08-27-guide-widget-landing-v2/progress.md`(git 제외, 로컬)에 룰링 전부 기록.

## 오늘 끝난 것
- **PR #2 머지·검증** — Telegram 토큰이 `/api/notify` Pages Function 으로 이전(`a4d82f1`). 사용자가 BotFather 토큰 재발급 + `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` 시크릿 입력 → 재배포 후 `/api/notify` **204** + 텔레그램 DM 수신 확인. (Pages 시크릿은 **다음 배포부터** 적용됨 — 대시보드 Retry deployment 필요했음.)
- **랜딩 v2 전체 구현 완료** — `feat/landing-v2` → **PR #3** https://github.com/gyujin0113/webmanager-web/pull/3 (10 commits, base main). Task 5 fix → 6 → 7 → 8 문서 → 최종 전체 브랜치 리뷰(opus) Important 4건 fix wave → 재리뷰 클린. 67 tests · lint 0 · typecheck clean.
- **프리뷰 QA 통과** (`https://feat-landing-v2.webmanager-web.pages.dev`): OG `image/png`(`public/_headers`), `?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial` 진입 → 리드 캡처·hidden·착지 96px, 위젯 15칩·앵커·가격 치환, Hero "지금 눌러보기" → 위젯 오픈, Pricing 월 기본, FAQ `inert`, 푸터 법정표기, 375px 오버플로 0·단어 줄바꿈 정상, catalog noindex, **체험 폼 실제 제출 1회**(web3forms 200 → 메일 `[위젯 체험 신청] https://example.co.kr` QA 메일 1통 도착 — 무시). 프리뷰의 `/api/notify` 는 503(프리뷰 env 시크릿 없음, 정상).

## 2026-08-28 추가로 끝난 것
- **PR #3 머지** (`42703c8`) + **PR #5 뷰포트 맞춤 머지** (`eb43cb3`, PR #4 는 스쿼시 조상 충돌로 닫고 main 위 rebase 로 재발행). 프로덕션 검증: v2 타이틀 · `id="trial"` · `--header-h` CSS · OG `image/png` · `/api/notify` 204 · `guide.json` 200.
- 뷰포트 맞춤: 전 섹션 `md:h-dvh md:pt-(--header-h)`(헤더 65px), `short:` 변형(max-height 900px), clamp(vh) 리듬, Trial 폼 2열, FAQ·푸터 압축, 데스크톱 스냅 `proximity`. 실측 1512×827·1440×760·1920×1000 전 섹션 fit.
- robots.txt 는 Cloudflare 관리형(AI 봇 차단) 블록이 앞에 자동 삽입됨 — 우리 규칙은 그 뒤에 유지.

## 다음 세션 할 일 (순서대로)
1. 브라우저에서 grabis.co.kr 위젯 푸터 "이런 안내 위젯, 우리 사이트에도 →" 클릭 → `#trial` 착지 실확인(규진 실기기). 규진 맥북 크롬에서 스크롤·`proximity` 스냅 체감 확인.
2. **위젯 Pages env `ALLOWED_SITES`** 에 `webmanager` 추가(현재 `grabis,demo`) — 안 하면 랜딩 위젯의 미매칭 질문 `/log` 만 거절됨(동작 무영향). 위젯 프로젝트 대시보드 env var (시크릿 아님).
3. 규진 결정 필요: ① 통신판매업 신고 여부 → 번호 나오면 `content/company.json` `ecommerceRegNo` ② `public/catalog/*.html` 삭제 여부(현재 noindex 메타 유지, 공유 링크 살아있음) ③ 위젯 자체 푸터 리드 링크가 랜딩에서 자기 자신을 가리킴 → `webmanager-widget` 에서 `site==='webmanager'` 면 숨김(위젯 repo 후속) ④ 익명 스크린샷 `public/showcase/site-1.webp` 승인(Showcase `showcaseImageSrc` prop 이미 배선됨) ⑤ 진엽 형 실명 후기 동의.
4. 후속 Minor 백로그(최종 리뷰 deferred, 레저 참조): "11KB" 하드코딩 3곳 → content 로 · 허니팟 무응답 · 검증 실패 시 첫 오류 포커스 · `contact` kind 잔존 · `content/*.json` 상대경로 → `@content` alias · 사업자번호 하이픈 줄바꿈(`whitespace-nowrap`) · FAQ `max-h-60` 상한 · `normalizeSiteUrl` 쿼리만 있는 입력의 non-ASCII 과잉 거부.

## 라이브 상태
| | 상태 |
|---|---|
| 위젯 엔진 `webmanager-widget` | v1.2 배포됨. `ALLOWED_SITES=grabis,demo` (→ `webmanager` 추가 필요) |
| grabis.co.kr | 위젯 적용, 푸터 링크 → `webmanager.co.kr/?ref=grabis…#trial` (랜딩 v2 배포됨 → `#trial` 착지) |
| webmanager-web `main` | **랜딩 v2 + 뷰포트 맞춤 배포됨** (`eb43cb3`), `/api/notify` 204 |

## 실행 방식 메모
- 랜딩 QA 시 Chrome 확장 탭은 백그라운드 rAF 정지로 GSAP 진행 안 됨 → `main *{opacity:1!important;transform:none!important}` 주입 후 캡처. 창 리사이즈가 안 먹으면 페이지 안에 375px iframe 을 띄워 모바일 확인.
- 강제 push 는 auto 모드 권한 정책이 막는다 → 사용자가 `! git push --force-with-lease …` 로 직접.
- Pages 시크릿(`wrangler pages secret put`)은 다음 배포부터 적용 — 입력 후 Retry deployment.

- 뷰포트 맞춤 후속 Minor: `--header-h`(globals.css)는 `Header.tsx` `h-16`+border 와 수동 동기화 · FAQ `short:` 트리거가 가로모드 폰에서 44px 경계 · 1280×650 에서 Trial +7px(타깃 밖).
