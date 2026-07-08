# webmanager — 사업 개요 + ops 수정 파이프라인

> 이 문서는 (주)3&D의 webmanager 사업 라인 기획·운영 가이드다. 2026-06-24 3&D repo에서 이 repo(webmanager-web)로 졸업·통합됐다. 사이트 **코드** 가이드는 repo 루트 `CLAUDE.md` 참조.

## 무엇
(주)3&D 의 신규 사업. **맞춤 홈페이지 제작 + 월 구독형 "무제한 수정" 유지보수** 서비스.
고객이 홈페이지에 수정사항을 텍스트로 업로드하면 (AI 보조 + 사람 게이트로) 당일 반영·재배포.
AI는 기능이 아니라 무제한 수정을 수익성 있게 만드는 **마진 엔진**.
홍보 페이지: webmanager.co.kr

## 세션 시작 시 먼저 읽을 것
- `docs/CONVERSATION-HANDOFF-2026-06-08.md` — 이 프로젝트가 어떻게 정의됐는지 전체 맥락 (필독)
- `docs/artifacts/01_product-design.md` — 제품 설계 (MVP = A+C 하이브리드: 카톡 인입 + 사람 게이트)
- `docs/artifacts/02_pricing-strategy.md` — 가격 전략 (정액 무제한, 친구가 5만 고정 / 신규 7~9.9만)
- `docs/artifacts/03_catalog-and-landing.md` — 서비스 카탈로그 + 랜딩 청사진
- `docs/artifacts/04_phase2-architecture-and-scope.md` — 시세 리서치 + ICP/버킷 + 표준 스택 아키텍처 + 수정범위 4티어
- `docs/artifacts/05_phase2-v1-design.md` — **Phase 2 v1 실행 설계 (승인본): 콘텐츠 컨벤션 + /apply-edit 스킬 + R2 + PR 게이트** (최신 합의)
- `docs/artifacts/06_business-model-and-market-direction.md` — **2026 시장 리서치 + 수익구조 3라인(제작/구독/별도) + 운영모델(Productized Solo+AI Factory) + 권고 방향**

## 저장소 구조
이 repo(`webmanager-web`, remote `gyujin0113/webmanager-web`, Cloudflare Pages 연결)가 webmanager 사업의 **허브**다:
- 루트(`src/` 등) = 랜딩 사이트 코드 (Next.js, webmanager.co.kr).
- `ops/` = 고객 사이트 수정 파이프라인 도구 (레지스트리·스킬·스크립트).
- `docs/` = 사업 기획 문서(artifacts·plans·handoff·이 문서).

부모 폴더 `주식회사쓰리앤디/` 안에 **고객 사이트 repo가 형제로 독립** 배치된다 (각자 Cloudflare Pages에 개별 연결 — 절대 합치지 말 것):
- `grabis-web/` = (주)그래비스 (gyujin0113/grabis-web, grabis.co.kr)
- `goddmenz-web/` = 미용실 (gyujin0113/goddmenz-web, 재구축 대기)

> 회사 차원 문서(견적·계약·회사정보)는 별도 repo `3&D`(gyujin0113/3andD)에 있다. webmanager 관련 용역·기획은 이 repo로 일원화됐다.

## 현재 상태 (2026-06-08 기준 + 2026-06-24 이관)
- demand 검증 통과: 기존 2고객(미용실 원장·진엽 형 회사)이 월 5만 구독 확답(자발적 제시).
- 랜딩(webmanager.co.kr)은 이미 완성·배포됨(Next.js+GSAP, 10섹션).
- www DNS 해결됨(2026-06-10): www 커스텀도메인+CNAME 추가, HTTPS 200.
- Phase 2 v1 엔진 구축 완료(2026-06-15): `ops/`에 고객 레지스트리·/apply-edit 스킬·가드레일·R2 파이프라인. GraBis 콘텐츠 분리 적용·배포됨. 흐름=카톡→/apply-edit→PR+프리뷰→merge(폰 GitHub앱 또는 이 세션에서 규진 승인 시 `gh pr merge`)→배포.
- GraBis 전체 이미지 에셋 content/ 분리 + R2 이관 완료(2026-06-16, PR#4): 코드·CSS 하드코딩 이미지 0건, 실물 102개 R2 이관·git 바이너리 제거. 05 §2.5 충족 → 이미지 교체가 티어① /apply-edit로 자동화됨. (계획: `docs/plans/2026-06-16-grabis-content-asset-separation.md`)
- 비즈니스·운영 모델 합의됨 → `docs/artifacts/06`. ICP 확정: **1인~소수 기술/제조 회사(회사소개 사이트)**. 방향 = "AI-운영형 회사소개 사이트 구독(Managed-Brochure WaaS + AI 마진엔진)". 제작=무료/바우처(CAC도구), 구독=본진(7~15만), 기능개발=별도 프로젝트(구독 밖).
- GTM 합의: 채널 = 디렉토리 기반 정조준 콜드(전시회 참가사·채용중 소규모 기술회사) + 진엽 형 시드 + 프로스펙팅 자동화. 멘트 = "낡은 사이트 신호 콕 집기 + 무료 새단장" 1:1 개인화. 크몽/숨고는 보조만.
- 다음 액션: ①공개가 7/9.9만 확정(시장천장상 9.9 권장) ②콜드 첫 사이클(30곳 발굴→발송→학습) ③실전 엔드투엔드 1건(GraBis 실제 카톡 요청 처리, plan Task 7) ④정부 중소기업홈페이지제작 지원사업 공급기업 자격 실체 검증 ⑤goddmenz 표준스택 재구축(별도 계획) ⑥before/after+후기.

## ops 도구 (ops/)
- `setup-machine.sh` — **새 기기 1회 셋업**: apply-edit 스킬 심링크 생성 + 형제 고객 repo·도구·인증 점검. 경로는 기기 독립(심링크 역추적·형제 상대경로)이라 이것만 돌리면 어느 맥에서도 동작. 사용: `bash ops/setup-machine.sh`.
- `customers.json` — 고객 레지스트리(repo·로컬경로[**`local`은 이 repo 기준 형제 상대경로** 예 `../grabis-web`]·pagesProject·previewPattern·defaultBranch·status).
- `skills/apply-edit/SKILL.md` — 수정요청→content/만 편집→빌드·가드레일→PR. `~/.claude/skills/apply-edit`에 심링크. 사용: `/apply-edit <slug> "<요청문>" [파일]`.
- `scripts/check-content-only.sh` — diff가 content/ 안인지 검사(미커밋 포함).
- `scripts/r2-upload.sh` — 이미지→webp→R2(`assets.webmanager.co.kr`), URL 반환.
- `scripts/get-preview-url.sh` — Pages 실제 프리뷰 alias 조회(URL 직접 조립 금지).
- `LEARNINGS.md` — 운영 학습·알려진 한계·실전 처리 기록.

## 핵심 원칙
- 정액 무제한만(건당 과금 금지 — 마찰이 status quo로 회귀). "무제한"의 경계 명문화(콘텐츠수정 ≠ 개발).
- 라이브 사이트 자동수정은 사람 게이트/수정구역제약 없이는 auto-deploy 금지. git 1커밋=1수정 → revert.
- 랜딩 카피 = 제품 스펙. 정직하게 쓰면 그게 개발 백로그.
