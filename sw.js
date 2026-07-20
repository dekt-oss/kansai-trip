/* 간사이 여행 일정표 — 서비스워커 (오프라인 지원) */
const CACHE = "kansai-v7";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./icons/icon.svg",
  "./data/schedule.csv", "./data/spots.csv", "./data/days.csv",
  "./data/todo.csv", "./data/shopping.csv",
  "./data/info.csv", "./data/geo.csv",
  "./data/alt_plan.csv", "./data/alt_food.csv", "./data/food_genres.csv",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))  // 일부 실패해도 설치 진행
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;

  // 앱 화면(HTML/네비게이션) + 데이터 CSV: network-first → 캐시 폴백
  // → 새 배포가 즉시 반영되도록(오프라인일 때만 캐시 사용)
  const isHTML = req.mode === "navigate" || (sameOrigin && url.pathname.endsWith(".html"));
  const isData = sameOrigin && url.pathname.includes("/data/");
  if (isHTML || isData) {
    // cache:"reload" → 브라우저 HTTP 캐시(=GitHub Pages max-age)를 우회해 항상 최신 받기
    e.respondWith(
      fetch(req, { cache: "reload" }).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (isHTML ? caches.match("./index.html") : undefined)))
    );
    return;
  }

  // 그 외 동일 출처 정적 자원(아이콘·매니페스트 등): cache-first
  if (sameOrigin) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(r =>
        r || fetch(req).then(rr => { const cp = rr.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return rr; })
      )
    );
    return;
  }

  // 교차 출처(폰트 등): network → 성공 시 캐시 → 실패 시 캐시
  e.respondWith(
    fetch(req).then(r => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
        const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp));
      }
      return r;
    }).catch(() => caches.match(req))
  );
});
