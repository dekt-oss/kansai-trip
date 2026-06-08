# 간사이 여행 대시보드 🗾

오사카·교토 간사이 여행을 위한 **자동 갱신 일정 대시보드**입니다.
구글 시트(공개 CSV)를 데이터 소스로 읽어, **시트만 고치고 새로고침하면** 대시보드에 반영됩니다.
서버 로직·DB·비밀키 없이 동작하는 **단일 정적 HTML**입니다.

🔗 **배포 URL:** `https://dekt-oss.github.io/kansai-trip/`

---

## ✨ 기능

- **타임라인** — 일차별 그룹, 시간순 정렬, `type`별 색/뱃지 (축제·시그니처·미식·이동·기타)
- **일자 탭** — 1~4일차 네비, 스크롤 연동(현재 보이는 day 자동 강조)
- **D-day 카운트다운** — 여행 전 `D-n`, 기간 중 `여행중`, 이후 `다녀왔어요`
- **비용 자동 합계** — `cost_jpy` 합산 + 환율 입력칸(기본 100엔=9.3원) → 원화 환산
- **준비물 체크리스트** — `localStorage` 저장(체크 상태 유지), 미리보기 환경 폴백
- **오늘 일정 강조** — 여행 기간 중이면 해당 day로 자동 스크롤·`오늘` 뱃지
- **날씨 예보** — [Open-Meteo](https://open-meteo.com/)(키 불필요)로 오사카 7/23~26 예보 카드

> 시트를 연결하지 않아도 **내장 기본 데이터**로 바로 미리보기됩니다.

---

## 🚀 데이터 소스 (우선순위)

대시보드는 아래 순서로 데이터를 찾습니다.

1. **`CONFIG.SHEET_CSV`** — Google Sheet published CSV (설정한 경우만)
2. **`data/schedule.csv`** — 레포 안 CSV 파일 ← **기본·권장**
3. **내장 `FALLBACK`** — 위 둘이 모두 실패할 때(예: `file://` 직접 열람)

### ✅ 권장 워크플로 — 레포 CSV 편집 (Claude 자동 반영)
별도 구글 시트 없이, **`data/schedule.csv`** 한 파일만 고치면 됩니다.

```
Claude에 "수정 요청"  →  data/schedule.csv 편집·커밋·푸시  →  GitHub Pages 자동 배포  →  새로고침 반영
```

- 추천스폿은 `data/spots.csv` (`category, title, note`)
- 컬럼 스키마는 아래 표 참고. `data/schedule.sample.csv` 가 동일 양식의 예시입니다.
- 사람이 직접 셀을 편집하고 싶으면 엑셀/구글시트로 열어 → CSV로 내보내 같은 파일에 덮어쓰면 됩니다.

### (옵션) Google Sheet 연결
비개발자가 브라우저에서 셀만 고치게 하고 싶을 때만 사용합니다.
1. `data/schedule.sample.csv`의 **헤더(컬럼명)** 를 그대로 사용해 구글 시트를 만듭니다.
2. **파일 → 공유 → 웹에 게시(Publish to web) → 해당 탭 → CSV** 게시 → URL 복사:
   ```
   https://docs.google.com/spreadsheets/d/e/{ID}/pub?gid=0&single=true&output=csv
   ```
3. `index.html` 상단 `CONFIG.SHEET_CSV` 에 붙여넣기. (설정 시 시트가 1순위)

> 공개 CSV는 CORS 허용이라 브라우저 `fetch()`로 바로 읽히고, 읽기 전용 공개 데이터라 **시크릿/키가 불필요**합니다.

---

## 📊 데이터 스키마

시트 1행 = 헤더, 이후 각 행 = 일정 항목. (`data/schedule.sample.csv` 참고)

| 키 | 설명 | 예시 |
|---|---|---|
| `day` | 일차(1~4) | `2` |
| `date` | 날짜 라벨 | `7/24(금)` |
| `start` | 시작 시각 | `09:30` |
| `end` | 종료 시각 | `11:20` |
| `city` | 도시 | `교토` |
| `place` | 장소 | `오이케도리~시조` |
| `transport` | 이동수단 | `도보` |
| `type` | 구분 | `fes` / `sig` / `eat` / `move` / `etc` |
| `title` | 제목 | `기온 야마보코 후기 순행` |
| `desc` | 설명 | `9:30 출발…'츠지마와시' 백미` |
| `cost_jpy` | 예상비용(엔) | `0` |
| `note` | 비고 | `양산·물` |

**`type` 색/뱃지:** `fes`=축제(朱), `sig`=시그니처(金), `eat`=미식(녹), `move`=이동(회), 그 외 `etc`(보라).

추천스폿 탭(`SPOTS_CSV`)은 `category, title, note` 컬럼을 사용합니다. (`data/spots.sample.csv` 참고)

---

## 🛠 기술 스택

- 바닐라 JS + [PapaParse](https://www.papaparse.com/) (CSV 파싱)
- 빌드리스 단일 `index.html` (의존성 CDN)
- 디자인 톤: 와시 배경 / 藍 `#1f4068` / 朱 `#c0432b` / 金 `#9a7b34`, 폰트 *Gowun Batang · Shippori Mincho*
- **사용 안 함:** 서버사이드 코드, DB, 비밀키

---

## 📦 배포

### A. GitHub Pages (권장)
- **Settings → Pages → Source:** `Deploy from a branch` → `main` / `/ (root)`
  결과: `https://dekt-oss.github.io/kansai-trip/`
- 또는 본 레포의 `.github/workflows/deploy.yml` 사용 시 **Source: GitHub Actions** 로 설정하면 푸시마다 자동 배포됩니다.

### B. Oracle Cloud nginx (선택)
정적 파일이라 부하 ≈ 0. ARIA 등 기존 서비스와 자원 경쟁 없음.
```nginx
location /kansai/ {
    alias /var/www/kansai/;
    index index.html;
    try_files $uri $uri/ =404;
}
```

---

## 🔐 관리 분리 원칙

- **레포 분리** — 본 대시보드(`kansai-trip`)는 public·무키. 비밀 데이터 없음.
- **자격증명 비공유** — 코드/레포에 어떤 시크릿도 두지 않음(공개 CSV만 사용).
- nginx 공유 시 디렉터리·location만 추가하며, 다른 프로세스/포트/DB는 불변.

---

## ✅ 인수 기준

- [x] 시트 한 줄 수정 → 새로고침 시 반영 (`SHEET_CSV` 연결 시)
- [x] 1~4일차 타임라인이 `type`별 색/뱃지로 표시
- [x] D-day, 비용 합계(원화 환산), 체크리스트 저장 동작
- [x] 모바일(≤390px) 가독성·탭 스크롤
- [x] 공개 URL에서 콘솔 에러 없이 로드
