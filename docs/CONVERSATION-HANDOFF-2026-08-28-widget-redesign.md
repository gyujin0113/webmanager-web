# 핸드오프 2026-08-28 — 가이드 위젯 UI 리디자인 (채널톡 수준으로 고도화)

> **다음 세션 시작 프롬프트:** `docs/CONVERSATION-HANDOFF-2026-08-28-widget-redesign.md 읽고 이어가줘`
> 읽는 순서: 이 문서 → `webmanager-widget/README.md` → `webmanager-widget/docs/[2026.08.27]_사이트가이드위젯_설계_v2.md` → `webmanager-widget/src/ui/*`. 랜딩 쪽 맥락은 `docs/CONVERSATION-HANDOFF-2026-08-27.md`.

## 한 줄 목표
현재 위젯(런처 원형 버튼 + 흰 패널 + 칩)은 **기능은 완성됐지만 디자인이 기본형**이다. **채널톡(Channel Talk) 수준의 세련된 위젯**으로 UI/모션/마이크로카피를 전면 리디자인한다. 기능·데이터 계약·번들 제약은 유지.

## 현재 상태 (2026-08-28)
| | 상태 |
|---|---|
| 레포 | `../webmanager-widget` (형제 폴더). main `4bc1ae4`, v1.2 배포됨 |
| 스택 | Preact + Vite, Shadow DOM 격리, 단일 `src/ui/styles.css`(36줄), Vitest 108 tests |
| UI 파일 | `src/ui/Fab.tsx`(런처) · `src/ui/Panel.tsx`(패널: 헤더·카테고리 탭·칩·카드/링크 답·직접질문 입력·fallback·"Powered by" 푸터) · `src/ui/Widget.tsx`(mount, open/close 컨트롤러) · `src/ui/ErrorBoundary.tsx` |
| 브랜딩 | 사이트별 `brand.color`(guide.json) → CSS 변수 `--wm-color` 하나. `brand.label`(헤더 문구), `brand.greeting` |
| 번들 | **11.3KB gz** (상한 30KB gz, `npm run size`) |
| 적용처 | grabis.co.kr(navy `#1e40af`, 28칩) · webmanager.co.kr 랜딩 자체(blue `#2563eb`, 15칩) · `/demo/` |
| 배포 | `npm run deploy`(직접 업로드, Git 연동 아님) → **전 고객 사이트 즉시 반영**. 호환 깨지면 `/v2/` 경로로 |

## 반드시 유지할 것 (계약)
- 설치 스니펫 1줄 `<script src="https://widget.webmanager.co.kr/v1/w.js" data-guide=… data-site=…>` 와 `data-*` 옵션, `window.WebmanagerGuide { open, close, version }`.
- guide.json 스키마(`schemaVersion 1`: brand·categories·items(link|card)·fallback(human, prefillParam)). 스키마 변경은 금지(고객 카탈로그 28개 호환).
- 런타임 LLM 0, 서버 호출은 `/log`뿐, Shadow DOM 격리, 호스트 페이지 CSS 무영향.
- 번들 ≤ 30KB gz(목표 ≤ 18KB). 폰트 파일 동봉 금지(시스템 폰트 스택). 새 런타임 의존성 금지(Preact 외).
- 접근성: 런처/칩 44px 터치, 포커스 링, `prefers-reduced-motion` 시 모션 제거, ESC 닫기, 패널 열릴 때 포커스 이동.
- 기존 테스트 108개 통과 + UI 테스트는 새 마크업에 맞게 갱신(`data-t=` 훅은 유지).

## 리디자인 방향 (채널톡 참고 포인트)
1. **런처(FAB)**: 그림자·hover lift·열림 시 아이콘 X 로 모핑, 선택적 라벨 확장("무엇을 도와드릴까요?") — 첫 방문 몇 초 후 접힘. 브랜드 색 그라데이션/글로우는 절제.
2. **패널**: 헤더에 브랜드 아바타(이니셜 또는 로고 슬롯)+타이틀+"보통 1분 내 답변" 류 서브라인 대신 **우리 성격에 맞는 정직한 카피**("미리 준비한 답으로 바로 안내해드려요"). 부드러운 spring 오픈(scale+fade, 200~250ms), 닫힘 애니메이션.
3. **본문**: 인사 말풍선 → 카테고리 pill(스크롤 가능, 활성 상태 명확) → 질문 칩(카드형, 아이콘 없이 타이포와 여백으로) → 답변은 채팅 버블(질문=내 말풍선, 답=봇 말풍선 + "바로가기" 버튼). 링크 답은 이동 전 1프레임 피드백.
4. **직접 질문 입력**: 하단 고정, 매칭 실패 시 fallback 카드(문의 폼 프리필 이동)를 공감형 카피로.
5. **모바일(≤480px)**: 전체화면 대신 **bottom sheet**(상단 핸들, 85dvh, 드래그/ESC 닫기). safe-area inset 반영.
6. **다크 호스트 대응**: 패널은 항상 밝은 카드(가독성) 유지하되, 런처는 호스트 배경과 대비되도록 테두리 1px 반투명.
7. **디자인 토큰**: `--wm-color` 외에 `--wm-radius`, `--wm-surface`, `--wm-text`, `--wm-muted`, `--wm-shadow` 를 `:host` 에 정의, 사이트별 오버라이드 가능(guide.json `brand` 확장은 **선택** 필드로만: `brand.avatar`, `brand.subtitle` — 없으면 기본값. 필수 필드 추가 금지).
8. **"Powered by webmanager" + 리드 링크**: 더 작고 은근하게. **랜딩(site==='webmanager')에서는 리드 링크 숨김**(자기 자신 가리키는 버그, 이번 릴리스에 포함).

## 진행 방식 (순서대로)
1. `superpowers:brainstorming` — 방향 확인 질문 2~3개(런처 라벨 확장 여부, 아바타 슬롯, 모바일 bottom sheet). **architectural 이 아닌 bounded** 로 취급하되 시각 결정이 많으므로 2번 필수.
2. **`design` 스킬(Claude Design 캔버스)** 로 아트보드 제작 → 규진 승인: ① 데스크톱 런처 닫힘/열림 ② 패널 상태 4종(인사+카테고리 / 칩 목록 / 카드 답변 / fallback 입력) ③ 모바일 bottom sheet ④ 브랜드 2종(grabis navy, webmanager blue) 비교. 참고 사이트: channel.io 런처·메신저 UI(구조·모션 참고만, 카피/아이콘 복제 금지).
3. 승인 후 `superpowers:writing-plans` → `subagent-driven-development` 로 구현 (`webmanager-widget` 브랜치 `feat/ui-v1.3`). 스타일은 `styles.css` 를 토큰 기반으로 재작성, 컴포넌트 마크업은 `data-t` 훅 유지.
4. 검증: `npm test` · `npx tsc --noEmit` · `npm run build && npm run size`(≤18KB 목표) · `/demo/` 로컬 육안(Playwright+시스템 Chrome 스크린샷: 데스크톱 1512×827, 모바일 375×812) · 랜딩 `webmanager.co.kr` 과 grabis 프리뷰에서 실제 카탈로그로 확인 · `prefers-reduced-motion` 에뮬레이션.
5. 규진 승인 → `npm run deploy`(**사용자 실행 또는 명시 승인**, 전 고객 즉시 반영) → grabis.co.kr·webmanager.co.kr 실기기 확인 → README/설계 v2 문서에 토큰·brand 선택 필드 추가.

## 수용 기준
- 채널톡 옆에 놓아도 촌스럽지 않다(규진 육안 승인).
- 기존 guide.json 28개(grabis)·15개(랜딩) 무수정으로 동작. 스키마 변경 0.
- 번들 ≤ 18KB gz, 108+ tests 통과, Lighthouse a11y 항목 회귀 0.
- 모션 200~250ms, reduced-motion 시 즉시 전환.
- 랜딩에서 리드 링크 미노출, grabis 에서는 노출.

## 사용자 수동 단계 (계획이 대신 못 함)
- 디자인 캔버스 승인, 배포(`npm run deploy`) 승인.
- 위젯 Pages env `ALLOWED_SITES` 에 `webmanager` 추가(아직 안 했으면).

## 참고
- 랜딩 v2·뷰포트 맞춤은 2026-08-28 프로덕션 배포 완료(`docs/CONVERSATION-HANDOFF-2026-08-27.md`). 남은 결정: 통신판매업 신고번호·`/catalog/` 삭제·익명 스크린샷.
- QA 팁: Chrome 확장 탭은 창 리사이즈가 안 먹을 수 있음 → Playwright(`~/.npm/_npx/*/node_modules/playwright`, `channel:'chrome'`)로 스크린샷. GSAP 페이지는 `main *{opacity:1!important;transform:none!important}` 주입.
