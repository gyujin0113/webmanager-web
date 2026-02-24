# 모바일 전문 에이전시 최적화 디자인

## 목표
WebManager 랜딩페이지가 모바일에서도 전문 웹 에이전시의 퀄리티를 체감할 수 있도록 전면 최적화.

## 변경 사항

### 1. 타이포그래피 3단계 스케일링
모든 섹션 헤딩을 `text-2xl sm:text-3xl md:text-4xl`로 통일.
Pricing 가격 숫자도 동일 스케일 적용.

### 2. 그리드 중간 브레이크포인트
Problem, Solution, Portfolio 섹션: `md:grid-cols-3` → `sm:grid-cols-2 lg:grid-cols-3`.
태블릿에서 2열 레이아웃 제공.

### 3. GSAP 애니메이션 모바일 최적화
- ScrollReveal: prefers-reduced-motion 체크 + 모바일(640px 미만) duration 0.5s
- HeroTitle: 모바일 stagger 간소화 + prefers-reduced-motion 지원
- Pricing gradient: prefers-reduced-motion 시 paused

### 4. 터치 타겟 개선
- Button 컴포넌트: min-h-[44px] 추가
- FAQ 플러스 아이콘: w-8 h-8 터치 영역 래퍼
- Footer 이메일 링크: py-2 패딩

### 5. 세부 디자인 폴리시
- CTA 카드: rounded-2xl sm:rounded-3xl
- 섹션 패딩: py-16 md:py-20
- FeatureCard description: text-xs sm:text-sm

### 6. 접근성
- prefers-reduced-motion 전역 지원
- 모든 인터랙티브 요소 44px+ 터치 타겟

## 변경하지 않는 것
- DotNav: 모바일 숨김 유지
- ScrollDown: 모바일 숨김 유지
- Hero 타이포 clamp: 이미 잘 동작
- Container 패딩: px-4 sm:px-6 이미 적절
- Scroll snap: 모바일 proximity 유지
