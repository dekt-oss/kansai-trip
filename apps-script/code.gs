/**
 * 간사이 여행 일정표 — 메모/쇼핑 웹 저장용 Apps Script 웹앱
 *
 * 설치(1회):
 *  1) 데이터용 구글 시트 열기 → 확장 프로그램 > Apps Script
 *  2) 이 코드 전체를 붙여넣고 저장
 *  3) 배포 > 새 배포 > 유형: 웹 앱
 *     - 실행 계정: 나
 *     - 액세스 권한: 모든 사용자
 *  4) 배포 후 나오는 '웹 앱 URL'(.../exec)을 복사 → index.html CONFIG.WEBAPP_URL 에 붙여넣기
 *  5) (공유 목록 표시까지 원하면) 시트의 'memos','shopping' 탭을
 *     파일 > 공유 > 웹에 게시(CSV)로 공개 → 그 CSV URL을 CONFIG.MEMOS_CSV / SHOPPING_CSV 에 입력
 *
 * 보안(선택): 아래 TOKEN 을 바꾸고 index.html 에서도 같은 값을 보내면 무단 쓰기를 줄일 수 있음.
 */
var TOKEN = ''; // 예: 'kansai2026' (빈 값이면 토큰 검사 안 함)

function doPost(e) {
  var out = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    if (TOKEN && d.token !== TOKEN) {
      return _json({ ok: false, error: 'bad token' });
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var name = (d.sheet === 'shopping') ? 'shopping' : 'memos';
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(name === 'shopping'
        ? ['timestamp', 'item', 'store', 'price_jpy', 'category', 'note']
        : ['timestamp', 'day', 'text', 'image_url']);
    }
    if (name === 'shopping') {
      sh.appendRow([new Date(), d.item || '', d.store || '', d.price_jpy || '', d.category || '', d.note || '']);
    } else {
      sh.appendRow([new Date(), d.day || '', d.text || '', d.image_url || '']);
    }
    out.ok = true;
  } catch (err) {
    out.error = String(err);
  }
  return _json(out);
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = (e && e.parameter && e.parameter.sheet === 'shopping') ? 'shopping' : 'memos';
  var sh = ss.getSheetByName(name);
  var vals = sh ? sh.getDataRange().getValues() : [];
  return _json(vals);
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
