/* なぞってひらがな: オフライン用キャッシュ。ファイルが変わると VERSION が変わり、新しい版に入れ替わる */
const VERSION = 'nazotte-7894542da8';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "audio/a.mp3", "audio/chi.mp3", "audio/e.mp3", "audio/fu.mp3", "audio/ha.mp3", "audio/he.mp3", "audio/hi.mp3", "audio/ho.mp3", "audio/i.mp3", "audio/ka.mp3", "audio/ke.mp3", "audio/ki.mp3", "audio/ko.mp3", "audio/ku.mp3", "audio/ma.mp3", "audio/me.mp3", "audio/mi.mp3", "audio/mo.mp3", "audio/mu.mp3", "audio/n.mp3", "audio/na.mp3", "audio/ne.mp3", "audio/ni.mp3", "audio/no.mp3", "audio/nu.mp3", "audio/o.mp3", "audio/ra.mp3", "audio/re.mp3", "audio/ri.mp3", "audio/ro.mp3", "audio/ru.mp3", "audio/sa.mp3", "audio/se.mp3", "audio/shi.mp3", "audio/so.mp3", "audio/su.mp3", "audio/ta.mp3", "audio/te.mp3", "audio/to.mp3", "audio/tsu.mp3", "audio/u.mp3", "audio/w-ahiru.mp3", "audio/w-ase.mp3", "audio/w-ehon.mp3", "audio/w-ewokaku.mp3", "audio/w-fune.mp3", "audio/w-hana.mp3", "audio/w-heya.mp3", "audio/w-hoshi.mp3", "audio/w-ie.mp3", "audio/w-inu.mp3", "audio/w-kame.mp3", "audio/w-kinoko.mp3", "audio/w-kitsune.mp3", "audio/w-kuchi.mp3", "audio/w-kuma.mp3", "audio/w-me.mp3", "audio/w-mikan.mp3", "audio/w-momo.mp3", "audio/w-mushi.mp3", "audio/w-neko.mp3", "audio/w-oni.mp3", "audio/w-remon.mp3", "audio/w-risu.mp3", "audio/w-rousoku.mp3", "audio/w-saru.mp3", "audio/w-sora.mp3", "audio/w-suika.mp3", "audio/w-tanuki.mp3", "audio/w-te.mp3", "audio/w-tokei.mp3", "audio/w-tsuki.mp3", "audio/w-ushi.mp3", "audio/w-wani.mp3", "audio/w-yama.mp3", "audio/w-yoru.mp3", "audio/w-yuki.mp3", "audio/wa.mp3", "audio/wo.mp3", "audio/ya.mp3", "audio/yattane.mp3", "audio/yo.mp3", "audio/yu.mp3", "audio/zenbu.mp3"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* ページ本体は ネット優先(新しい版をすぐ反映)、つながらないときは保存した版 */
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('index.html', c)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  /* 音声・アイコン・フォントは 保存した版を優先 */
  if (url.origin === location.origin || url.host.endsWith('fonts.googleapis.com') || url.host.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); }
      return r;
    })));
  }
});
