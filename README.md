# 🗂️ MARC 학습

> 정사서 자격증 준비 + 실무 MARC 작성 능력 향상을 위한 게임형 웹 애플리케이션

**배포 주소**: [marc-learning.vercel.app](https://marc-learning.vercel.app)

---

## 📖 프로젝트 소개

단순 퀴즈가 아니라, **구조 이해 → 작성 능력 → 판단 능력**을 단계적으로 학습할 수 있도록 설계한 MARC 필드 학습 앱입니다.

실제 국립중앙도서관 MARC 데이터(디지털 인문학 입문, ISBN 9791159010873)를 기반으로 문제를 구성했으며, 목록 규칙(KORMARC 기반) 기술 방식(구두점 포함, 기본표목 미사용)을 반영합니다.

---

## ✨ 주요 기능

### 🎮 MARC 훈련 (4가지 모드)

| 모드 | 설명 |
|---|---|
| 🃏 플래시카드 | MARC 필드 설명 ↔ 필드번호 매칭, 랜덤 출제 |
| 🧩 퍼즐 모드 | 태그에 맞는 필드 내용을 드래그 앤 드롭으로 매칭 (기본표목/245필드 선택) |
| ✏️ 작성 훈련 | 서지정보를 보고 식별기호 포함 MARC 필드 직접 입력, 힌트 제공 |
| ⚖️ 판단 퀴즈 | 헷갈리는 필드 구분 (100 vs 700, 245 vs 246 등), 해설 제공 |

### 📊 학습 분석
- 필드별 정답률 progress bar
- localStorage 기반 누적 데이터 (새로고침 후에도 유지)

### 🎯 약점 필드
- 오답 횟수 기준 약점 필드 목록
- 정답률 표시

### 🏠 홈 화면
- 학습일수 / 평균 정답률 / 약점 필드 수 통계
- 오늘의 MARC 미리보기

---

## 🛠 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | React + Vite |
| 스타일링 | Tailwind CSS v3 |
| 라우팅 | react-router-dom |
| 드래그 앤 드롭 | @dnd-kit/core, @dnd-kit/sortable |
| 데이터 저장 | localStorage |
| 폰트 | Noto Sans KR, IBM Plex Mono |
| 배포 | Vercel |

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── BottomNav.jsx     # 하단 탭 네비게이션
│   └── Layout.jsx        # 공통 레이아웃
├── data/
│   ├── flashcards.js     # 플래시카드 데이터
│   ├── judgeQuestions.js # 판단 퀴즈 데이터
│   └── writeQuestions.js # 작성 훈련 데이터
├── pages/
│   ├── Home.jsx          # 홈 화면
│   ├── Training.jsx      # MARC 훈련 메뉴
│   ├── Flashcard.jsx     # 플래시카드
│   ├── Puzzle.jsx        # 퍼즐 모드
│   ├── Write.jsx         # 작성 훈련
│   ├── Judge.jsx         # 판단 퀴즈
│   ├── Weak.jsx          # 약점 필드
│   └── Analytics.jsx     # 학습 분석
└── utils/
    └── storage.js        # localStorage 유틸 함수
```

---

## 🚀 로컬 실행 방법

```bash
# 저장소 클론
git clone https://github.com/pinakes-me/marc-learning.git
cd marc-learning

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 📚 학습 데이터 기반 도서

현재 **디지털 인문학 입문** (김현, 임영상, 김바로 공저 / 한국외국어대학교 지식출판원, 2016) 데이터를 기반으로 문제가 구성되어 있습니다.

```
020    $a 9791159010873
245 00 $a 디지털 인문학 입문 = $x Digital humanities /
          $d 김현, $e 임영상, $e 김바로 공저
260    $a 서울 : $b Huebooks :
          $b 한국외국어대학교 지식출판원, $c 2016
300    $a 510 p. : $b 삽화, 도표, 초상 ; $c 23 cm
650  8 $a 인문 과학
700 1  $a 김현
700 1  $a 임영상
700 1  $a 김바로
```

---

## 🗺 향후 계획

- [ ] 다양한 도서 데이터 추가 (번역서, 총서, 편저 등 5종)
- [ ] 약점 필드 기반 재출제 기능 (예정)


---

## 📝 목록 규칙 관련 학습 포인트

이 앱은 다음 목록 규칙을 반영합니다:

- **기본표목 방식**: 기본표목(100) 사용 (예전 방식)
- **245필드 방식**: 기본표목 미사용 (현행 방식)
- **현장**: KORMARC 관행상 구두점 사용

> 퍼즐 모드에서 기본표목/245필드 방식을 직접 선택하며 차이를 체험할 수 있습니다.

---

*정사서 자격증 준비 중인 사서 지망생을 위해 만들었습니다* 📚
