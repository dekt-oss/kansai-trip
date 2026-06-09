# 간사이 여행 일정표 🗾

부산(김해)↔오사카 간사이 여행(3박4일·2인)을 위한 **자동 갱신 일정표**입니다.
레포 안 CSV(`data/*.csv`)를 데이터 소스로 읽어, **CSV만 고치고 새로고침하면** 반영됩니다.
서버 로직·DB·비밀키 없이 동작하는 **단일 정적 HTML**입니다.

🔗 **배포 URL:** `https://dekt-oss.github.io/kansai-trip/`

상위 메뉴(**📅 일정 · 🗺 지도 · 💴 비용 · ✅ 준비 · ⚖️ 결정 · ⭐ 추천 · 🛍 쇼핑 · 📝 메모**)로 화면이 나뉩니다.

---

## ✨ 기능

**📅 일정**
- **타임라인** — 일차별 그룹, 시간순 정렬, `type`별 색/뱃지 (축제·**관광**·미식·이동·기타)
- **항목 펼치기** — 일정 항목을 누르면 세부내역(설명·비고)이 아코디언으로 펼쳐짐
- **이동수단 아이콘** — 도보 🚶 / 지하철 🚇 / 기차·특급 🚆 / 버스 🚌 / 택시 🚕 / 비행기 ✈️ (조합 표시: `지하철+한큐` → 🚇🚆)
- **일자 탭** — 1~4일차 네비(가로 확대), 스크롤 연동(현재 보이는 day 자동 강조), 상위 메뉴 아래 고정
- **일자 요약** — 각 day 헤더에 오전/오후 핵심 일정 한 줄 표시 (`data/days.csv`)
- **장소 지도** — 일정의 `📍 장소`를 누르면 모달에 구글맵 미리보기, 한 번 더 누르면 구글맵 앱으로 이동
- **사진** — `image_url`이 있으면 카드에 썸네일, 누르면 크게(라이트박스). 없으면 생략. 사진은 `images/` 폴더에 두고 경로를 적거나 외부 URL 사용 (자세히는 `images/README.md`)
- **D-day** — 여행 전 `D-n`, 기간 중 `여행중`, 이후 `다녀왔어요`
- **날씨** — [Open-Meteo](https://open-meteo.com/)(키 불필요) 오사카 7/23~26 예보

**⭐ 추천**
- **추천 스폿·맛집** — 시드(`data/spots.csv`) + **웹에서 직접 추가**(분류·이름·메모·이미지 URL)

**💴 비용**
- **합계** — 확정 지출(🔴) + 예상 지출(⚫) → 총합. 환율 입력칸(기본 100엔=960원), **1인/2인 토글**
- **항목 결제 체크(✓)** — 화면에서 결제 완료 처리 → 확정/예상 자동 갱신(`localStorage`)
- **카테고리별 / 일자별 비용** — 자동 집계(아코디언)

**✅ 준비**
- **핵심·비상 정보** — 항공·숙소·여권·총영사관·긴급 (`data/info.csv`), 전화/주소는 눌러서 연결
- **예약 체크리스트** — 예약·결제할 항목 (`data/todo.csv`)
- **준비물 체크리스트** — 출발 전 챙길 것

**⚖️ 결정**
- **A/B 결정 리스트** — 숙소(난바 vs 신사이바시)·식당·관람 옵션 등을 골라 저장 (`data/decisions.csv`)

**🛍 쇼핑**
- **쇼핑리스트** — 시드 항목(`data/shopping.csv`) + **웹에서 직접 추가**, 품목별 구매완료 체크, 예상 총액(¥/₩)

**🗺 지도**
- **여행 지도** — Google **My Maps**에 직접 찍은 핀 지도를 iframe으로 임베드(무료·API 키 불필요). My Maps에서 핀을 추가/삭제하면 자동 반영
- `CONFIG.MAP_EMBED_URL`에 My Maps **퍼가기(iframe) src**를 넣으면 표시(비우면 오사카·교토 기본 지도 + 만드는 법 안내)

**📝 메모**
- **메모·추천 입력** — 웹에서 메모/추천스폿을 입력해 저장. day 태그, **이미지 URL**(썸네일) 지원

> 추천·메모·쇼핑 입력은 기본적으로 **이 기기(localStorage)** 에 저장됩니다. **Apps Script 웹앱을 연결**하면 구글 시트에 저장되어 다른 기기·동행과 공유됩니다(아래 설정 참고).
> 각 항목의 **✕ 버튼**으로 삭제할 수 있습니다(이 기기에서 숨김). 공유 시트에서도 지우려면 구글 시트에서 해당 행을 삭제하세요.

> CSV를 못 불러오는 환경(예: `file://` 직접 열람)에서는 **내장 기본 데이터**로 미리보기됩니다.

---

## 📝 메모·쇼핑 웹 저장 (Apps Script · 선택)

입력한 메모/쇼핑을 **여러 기기·동행과 공유**하려면 구글 시트 + Apps Script 웹앱을 연결합니다. (안 해도 이 기기엔 저장됩니다.)

1. 데이터용 구글 시트 열기 → **확장 프로그램 → Apps Script**
2. `apps-script/code.gs` 내용을 붙여넣고 저장
3. **배포 → 새 배포 → 웹 앱** (실행: 나 / 액세스: **모든 사용자**) → 권한 승인 → **웹 앱 URL(.../exec)** 복사
4. `index.html`의 `CONFIG.WEBAPP_URL`에 붙여넣기 (선택: 토큰 쓰면 `code.gs`의 `TOKEN`과 `CONFIG.WEBAPP_TOKEN`을 같은 값으로)
5. 다른 기기·동행에게도 목록을 **보이게(읽기)** 하려면 → 웹앱이 JSONP로 직접 읽어주므로 **추가 설정 없이** 위 `WEBAPP_URL`만 있으면 됩니다. (코드를 새로 배포하면 자동 적용. published CSV 방식을 쓰려면 `CONFIG.MEMOS_CSV`/`SHOPPING_CSV`/`SPOTS_SHARED_CSV`에 게시 CSV URL 입력도 가능)

- 쓰기는 `text/plain` POST(프리플라이트 회피), 읽기는 JSONP(`?callback=`) — CORS 없이 동작, 코드/레포에 비밀키 없음.
- ⚠ 웹앱 access=모든 사용자라 URL을 아는 사람은 쓰기 가능 → 필요하면 `TOKEN`으로 가벼운 보호.

### 🖼 이미지 직접 업로드는?
정적 사이트라 **파일 업로드(저장)는 불가**합니다. 대신 메모의 **이미지 URL 칸**에 사진 주소를 붙여넣으면 썸네일로 표시됩니다(외부 호스팅 또는 레포 `images/` 경로). 진짜 파일 업로드가 필요하면 Apps Script가 구글 드라이브에 올리도록 확장하는 방법이 있습니다(요청 시 안내).

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
| `cost_krw` | 원화 확정비용(엔이 아닌 항목, 예: 항공권) | `566080` |
| `note` | 비고 | `양산·물` |
| `image_url` | 사진 주소(선택, `images/foo.jpg` 또는 외부 URL) | `images/sample-kiyomizu.svg` |

**`type` 색/뱃지:** `fes`=축제(朱), `sig`=관광(金), `eat`=미식(녹), `move`=이동(회), `shop`=쇼핑(황갈), `stay`=숙소(청), 그 외 `etc`(보라). 한 항목에 여러 분류를 주려면 `/`로 구분 — 예: `sig/shop` → 관광·쇼핑 뱃지 둘 다 표시(첫 분류가 좌측 색).

### 그 외 데이터 파일
| 파일 | 컬럼 | 용도 |
|---|---|---|
| `data/spots.csv` | `category, title, note, image_url` | 추천 스폿(사진 선택) |
| `data/shopping.csv` | `item, store, price_jpy, category, note` | 쇼핑리스트 시드 항목 |
| `data/info.csv` | `label, value, note, type` | 핵심·비상 정보(`type`=`tel`/`map`이면 링크) |
| `apps-script/code.gs` | — | 메모·쇼핑 웹 저장용 Apps Script(시트에 붙여넣기) |
| `data/days.csv` | `day, date, am, pm` | 일자별 오전/오후 요약 |
| `data/todo.csv` | `id, category, task, note, done` | 예약 체크리스트 (`done`=`1`이면 기본 체크) |
| `data/decisions.csv` | `id, title, option_a, option_b, note` | A/B 결정 리스트 |

> 항공권 등 원화 확정비용은 `data/schedule.csv`의 `cost_krw` 컬럼에 입력합니다(해당 일정 항목에 표시·합산).

---

## 🛠 기술 스택

- 바닐라 JS + **인라인 CSV 파서**(외부 CDN 의존 없음)
- 빌드리스 단일 `index.html`
- **PWA**: `manifest.webmanifest` + `sw.js`(서비스워커)로 **홈 화면 추가·오프라인** 지원. 한 번 열어두면 비행기·로밍 환경에서도 앱셸·일정 데이터가 캐시되어 열림.
- 디자인 톤: 와시 배경 / 藍 `#1f4068` / 朱 `#c0432b` / 金 `#9a7b34`, 폰트 *Gowun Batang · Shippori Mincho*
- **다크모드**: 헤더 🌙 토글(시스템 설정 기본값·`localStorage` 저장)
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
