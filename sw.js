/* 간사이 여행 일정표 — 서비스워커 (오프라인 지원) */
const CACHE = "kansai-v1";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./icons/icon.svg",
  "./data/schedule.csv", "./data/spots.csv", "./data/days.csv",
  "./data/todo.csv", "./data/decisions.csv", "./data/shopping.csv",
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

  // 데이터 CSV: network-first → 캐시 폴백 (캐시버스터 쿼리 무시하고 매칭)
  if (sameOrigin && url.pathname.includes("/data/")) {
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // 앱 셸/동일 출처 자원: cache-first
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
