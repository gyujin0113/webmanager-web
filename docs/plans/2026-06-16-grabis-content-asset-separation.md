# grabis 이미지 에셋 content/ 분리 + R2 이관 — 실행 계획

**Date**: 2026-06-16
**대상 repo**: `grabis-web` (gyujin0113/grabis-web, grabis.co.kr)
**선행 설계**: [05 §2.5 자동화 전제조건](../artifacts/05_phase2-v1-design.md) — "고객이 바꿀 수 있는 모든 것의 *참조*는 content/에"
**도출 배경**: 2026-06-15 첫 실전(영문 데이터 이미지 교체)에서 이미지가 코드+public/ 하드코딩이라 자동 /apply-edit 불가 → 수동 처리. 재발 방지.

## 확정 결정 (2026-06-16 브레인스토밍)

| 축 | 확정 |
|---|---|
| 범위 | **전부** — 페이지에 뜨는 모든 이미지/영상/문서 참조를 content/로 |
| 바이너리 | **전부 R2** — 사용 중인 실물을 R2(assets.webmanager.co.kr)로, content엔 공개 URL만 |
| 작은 아이콘·로고 | `r2-upload.sh` 개선 후(업스케일 방지) **함께 R2** |
| 구조 | 기존 컨벤션 확장: `content/sections/*.json` → `lib/data.ts` re-export → 컴포넌트 import. 이미지가 박힌 데이터 배열은 **배열 통째로** content로 |
| PR | 1리팩토링 = 1PR. 빌드 실패 시 중단 |

## content 파일 매핑

| content 파일 | 담을 것 | 현재 위치(코드) |
|---|---|---|
| `sections/product-detail.json` | GRABEADS variants/SEM/advantages/videos, extraction kit components/data images, extron 이미지 | `components/ProductPageLayout.tsx` |
| `sections/ngs.json` | NGS 아이콘, NCB 호환성/사이즈/가시성 비교 이미지(ko/en), VSM 차트, 96well 영상, 제품샷 | `app/product/ngs/page.tsx` |
| `sections/company.json` | sub_bg/content2_bg/values_img 배경, value 아이콘 3종, CEO 프로필, 연혁 이미지 | `app/company/*` |
| `sections/careers.json` | careers 아이콘, 채용공고 이미지, 자사양식 .doc | `app/contact/careers/page.tsx`, `components/JobAccordion.tsx` |
| `site.json` `assets` 블록(신규) | 로고(white/blue), OG 이미지, press 사이드 이미지 | `Header/Footer/layout.tsx`, `home/*` |
| 기존 `products.json`/`press.json`/`partners.json`/`slides.json` | image 경로를 R2 URL로 치환 | 이미 content |

## r2-upload.sh 개선

- 업로드 전 `sips -g pixelWidth`로 원본 가로폭 측정 → **1600px 초과일 때만 `-resize 1600 0`**, 이하면 리사이즈 없이 webp 변환 (cwebp는 PNG 투명도 보존)
- mp4/doc/webp는 기존대로 원본 업로드
- 향후 모든 고객 에셋에도 적용되는 일반 개선

## 실행 순서

1. `r2-upload.sh` 개선 + 작은 아이콘 1건 리허설(업스케일 0 확인)
2. 코드+기존 content에서 **실제 참조되는** 바이너리만 R2 일괄 업로드 → `public경로→R2URL` 매핑표 (미사용 파일 제외)
3. content JSON 작성/갱신 (새 4파일 + site.json assets + 기존 json image 치환)
4. `lib/data.ts` import·re-export 추가, 컴포넌트를 `@/lib/data` 참조로 전환 (하드코딩 0건)
5. 검증: `npm run build` 통과 + grep 하드코딩 0건 + R2 URL 200 + 프리뷰 육안 무손상(§6.1)
6. R2로 옮긴 public 실물 삭제 (빌드/검증 통과 후)

## 안전장치

- R2 URL은 업로드 직후 `curl -I` 200 확인 후 content 기입 (깨진 URL 커밋 방지, 05 §5)
- 가드레일과 별개: 이 작업은 `src/` 리팩토링이라 의도적으로 content/ 밖도 변경(티어③ 1회성 구조개선). 완료 후엔 이미지 교체가 티어①로 자동화됨
- 화면 무손상: 리팩토링 전후 렌더 동일

## 완료 정의

- 페이지 렌더 이미지 중 코드 하드코딩 0건 (grep 검증)
- 실물 바이너리는 R2, content엔 URL만, git에서 사용 이미지 제거
- `/apply-edit grabis "<이미지 교체>"`가 content/만 수정으로 처리 가능 (리허설 1건)
