/* AjayOS — home screen, lock screen, apps. Content comes from js/config.js */
(function () {
  'use strict';

  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var store = {
    get: function (k) { try { return localStorage.getItem('ajayos.' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('ajayos.' + k, v); } catch (e) { } }
  };
  var PH = '<span class="ph">Placeholder</span>';

  var os = $('#os'), home = $('#home'), lock = $('#lock'), pagesEl = $('#pages'), dock = $('#dock'),
    layer = $('#appLayer'), win = $('#appwin'), body = $('#appBody'), wall = $('#wall');

  /* ======================================================================
     Glyphs (generic, no brand marks)
     ====================================================================== */
  var G = {
    notes: '<svg viewBox="0 0 34 30"><g stroke="#c9b26b" stroke-width="2.2"><path d="M2 12h30M2 19h30M2 26h20"/></g></svg>',
    photos: '<svg viewBox="0 0 34 28" fill="#fff"><circle cx="24" cy="8" r="4"/><path d="M0 28 11 12l8 10 5-5 10 11z"/></svg>',
    maps: '<svg viewBox="0 0 26 34"><path fill="#fff" d="M13 0a13 13 0 0 1 13 13c0 9-13 21-13 21S0 22 0 13A13 13 0 0 1 13 0z"/><circle cx="13" cy="13" r="5" fill="#3e9a5a"/></svg>',
    weather: '<svg viewBox="0 0 36 30"><circle cx="13" cy="11" r="7" fill="#ffd60a"/><path fill="#fff" d="M11 30a7 7 0 0 1-.6-14A9 9 0 0 1 27.6 15 6.5 6.5 0 0 1 28 30z"/></svg>',
    rides: '<svg viewBox="0 0 40 26" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="18" r="7"/><circle cx="32" cy="18" r="7"/><path d="M8 18 15 6h12l5 12M15 6l6 12H8M24 2h5"/></svg>',
    code: '<svg viewBox="0 0 36 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4 2 12l8 8M26 4l8 8-8 8M21 2l-6 20"/></svg>',
    work: '<svg viewBox="0 0 34 28" fill="#fff"><path d="M12 0h10a3 3 0 0 1 3 3v3h6a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h6V3a3 3 0 0 1 3-3zm0 3v3h10V3z"/></svg>',
    cam: '<svg viewBox="0 0 34 28"><path fill="#fff" d="M11 0h12l3 4h5a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h5z"/><circle cx="17" cy="15" r="7" fill="#c23f9f"/><circle cx="17" cy="15" r="4" fill="#fff"/></svg>',
    at: '<svg viewBox="0 0 32 32"><text x="16" y="24.5" text-anchor="middle" font-size="27" font-weight="700" fill="#fff" font-family="-apple-system,Helvetica,Arial,sans-serif">@</text></svg>',
    gear: '<svg viewBox="0 0 36 36"><defs><rect id="gt" x="15.5" y="1" width="5" height="8" rx="1.5"/></defs><g fill="#fff"><circle cx="18" cy="18" r="11"/><use href="#gt"/><use href="#gt" transform="rotate(45 18 18)"/><use href="#gt" transform="rotate(90 18 18)"/><use href="#gt" transform="rotate(135 18 18)"/><use href="#gt" transform="rotate(180 18 18)"/><use href="#gt" transform="rotate(225 18 18)"/><use href="#gt" transform="rotate(270 18 18)"/><use href="#gt" transform="rotate(315 18 18)"/></g><circle cx="18" cy="18" r="5" fill="#8a8f99"/></svg>',
    msg: '<svg viewBox="0 0 34 30"><path fill="#fff" d="M17 0C26.4 0 34 6 34 13.5S26.4 27 17 27c-1.8 0-3.6-.2-5.2-.7L4 30l1.6-6.4A12.6 12.6 0 0 1 0 13.5C0 6 7.6 0 17 0z"/></svg>',
    mail: '<svg viewBox="0 0 36 26"><rect width="36" height="26" rx="4" fill="#fff"/><path d="m2 3 16 12L34 3" fill="none" stroke="#1a6ef0" stroke-width="2.5"/></svg>',
    web: '<svg viewBox="0 0 34 34" fill="none" stroke="#2f6fd6" stroke-width="2.4"><circle cx="17" cy="17" r="15"/><ellipse cx="17" cy="17" rx="6.5" ry="15"/><path d="M2 17h30M5 9h24M5 25h24"/></svg>',
    drive: '<svg viewBox="0 0 38 24"><path fill="#3b2a00" d="M7 8 11 2h16l4 6h3a4 4 0 0 1 4 4v6h-4a4 4 0 0 0-8 0H12a4 4 0 0 0-8 0H0v-6a4 4 0 0 1 4-4z"/><path fill="#fff6" d="M12 4h6v4h-9zM20 4h6l3 4h-9z"/><circle cx="8" cy="19" r="3.5" fill="#3b2a00"/><circle cx="30" cy="19" r="3.5" fill="#3b2a00"/></svg>',
    music: '<svg viewBox="0 0 30 34" fill="#fff"><path d="M10 6 28 2v22a5 5 0 1 1-3-4.6V9.5L13 12v16a5 5 0 1 1-3-4.6z"/></svg>',
    books: '<svg viewBox="0 0 36 28" fill="#fff"><path d="M2 3c5-2 10-2 15 1v24c-5-3-10-3-15-1zM34 3c-5-2-10-2-15 1v24c5-3 10-3 15-1z"/></svg>',
    files: '<svg viewBox="0 0 28 34"><path fill="#fff" d="M3 0h15l10 10v21a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z"/><path fill="#a9d6ff" d="M18 0v10h10z"/><g stroke="#2c8ff0" stroke-width="2"><path d="M6 17h16M6 22h16M6 27h10"/></g></svg>',
    proj: '<svg viewBox="0 0 34 34" fill="#fff"><path d="M14 2c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z"/><path d="M27 20c.5 4 2 5.5 6 6-4 .5-5.5 2-6 6-.5-4-2-5.5-6-6 4-.5 5.5-2 6-6z" opacity=".8"/></svg>',
    classic: '<svg viewBox="0 0 34 30"><text x="17" y="25" text-anchor="middle" font-size="26" font-family="Georgia,serif" fill="#4a6741">Aa</text></svg>'
  };

  // Weather glyphs
  var W = {
    sun: '<svg viewBox="0 0 32 32"><g stroke="#ffd60a" stroke-width="2.4" stroke-linecap="round"><path d="M16 2v4M16 26v4M2 16h4M26 16h4M6 6l3 3M23 23l3 3M6 26l3-3M23 9l3-3"/></g><circle cx="16" cy="16" r="6.5" fill="#ffd60a"/></svg>',
    moon: '<svg viewBox="0 0 32 32"><path fill="#f5f0d0" d="M21 4a12 12 0 1 0 7 21A13 13 0 0 1 21 4z"/></svg>',
    partly: '<svg viewBox="0 0 32 32"><circle cx="12" cy="11" r="6" fill="#ffd60a"/><path fill="#fff" d="M10 28a6 6 0 0 1-.5-12A8 8 0 0 1 24.6 15 5.5 5.5 0 0 1 25 28z"/></svg>',
    cloud: '<svg viewBox="0 0 32 32"><path fill="#fff" d="M9 26a7 7 0 0 1-.6-14A9 9 0 0 1 25.6 11 7 7 0 0 1 25 26z"/></svg>',
    rain: '<svg viewBox="0 0 32 32"><path fill="#fff" d="M9 20a6 6 0 0 1-.5-12A8 8 0 0 1 23.6 7 6.5 6.5 0 0 1 24 20z"/><g stroke="#64b5ff" stroke-width="2.4" stroke-linecap="round"><path d="M10 24l-2 5M17 24l-2 5M24 24l-2 5"/></g></svg>',
    snow: '<svg viewBox="0 0 32 32"><path fill="#fff" d="M9 20a6 6 0 0 1-.5-12A8 8 0 0 1 23.6 7 6.5 6.5 0 0 1 24 20z"/><g fill="#fff"><circle cx="10" cy="26" r="1.8"/><circle cx="16" cy="28" r="1.8"/><circle cx="22" cy="26" r="1.8"/></g></svg>',
    storm: '<svg viewBox="0 0 32 32"><path fill="#fff" d="M9 20a6 6 0 0 1-.5-12A8 8 0 0 1 23.6 7 6.5 6.5 0 0 1 24 20z"/><path fill="#ffd60a" d="M17 18l-5 8h4l-2 6 7-9h-4l2-5z"/></svg>',
    fog: '<svg viewBox="0 0 32 32"><g stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M5 11h22M3 17h26M7 23h18"/></g></svg>'
  };

  /* ======================================================================
     App registry
     ====================================================================== */
  var L = S.links || {};
  var APPS = {
    about:     { name: 'About', tile: 't-notes', glyph: 'notes', view: viewAbout },
    photos:    { name: 'Photos', tile: 't-photos', glyph: 'photos', view: viewPhotos },
    maps:      { name: 'Maps', tile: 't-maps', glyph: 'maps', view: viewMaps },
    calendar:  { name: 'Calendar', tile: 't-cal', view: viewCalendar },
    weather:   { name: 'Weather', tile: 't-weather', glyph: 'weather', view: viewWeather },
    rides:     { name: 'Rides', tile: 't-rides', glyph: 'rides', view: viewRides },
    projects:  { name: 'Projects', tile: 't-proj', glyph: 'proj', view: viewProjects },
    github:    { name: 'GitHub', tile: 't-code', glyph: 'code', url: L.github },
    linkedin:  { name: 'LinkedIn', tile: 't-work', glyph: 'work', url: L.linkedin },
    instagram: { name: 'Instagram', tile: 't-cam', glyph: 'cam', url: L.instagram },
    twitter:   { name: 'Twitter', tile: 't-at', glyph: 'at', url: L.twitter },
    drive:     { name: 'Drive', tile: 't-drive', glyph: 'drive', view: viewDrive },
    settings:  { name: 'Settings', tile: 't-set', glyph: 'gear', view: viewSettings },
    messages:  { name: 'Messages', tile: 't-msg', glyph: 'msg', view: viewMessages },
    mail:      { name: 'Mail', tile: 't-mail', glyph: 'mail', view: viewMail },
    web:       { name: 'Safari', tile: 't-web', glyph: 'web', view: viewWeb },
    music:     { name: 'Music', tile: 't-music', glyph: 'music', view: viewMusic },
    books:     { name: 'Books', tile: 't-books', glyph: 'books', view: viewBooks },
    resume:    { name: 'Resume', tile: 't-files', glyph: 'files', view: viewResume },
    classic:   { name: 'Classic', tile: 't-classic', glyph: 'classic', url: '/classic/', sameTab: true }
  };
  // Link apps with no URL yet fall back to a "coming soon" screen
  Object.keys(APPS).forEach(function (id) { var a = APPS[id]; a.id = id; if ('url' in a && !a.url) { a.view = viewComingSoon; } });

  var LAYOUT = {
    // iPad (wide screens)
    pages: [
      ['w:profile', 'w:weather', 'photos', 'maps', 'calendar', 'rides', 'projects', 'github', 'linkedin', 'instagram', 'twitter', 'drive', 'settings'],
      ['w:now', 'music', 'books', 'resume', 'weather', 'classic']
    ],
    // iPhone (narrow screens have less height, so the weather widget moves to page 2)
    phonePages: [
      ['w:profile', 'photos', 'maps', 'calendar', 'rides', 'projects', 'github', 'linkedin', 'instagram', 'twitter', 'drive', 'settings'],
      ['w:weather', 'music', 'books', 'resume', 'classic', 'w:now']
    ],
    dock: ['messages', 'mail', 'web', 'about'],
    dockRecent: ['drive', 'photos'] // iPad only, after the divider
  };

  /* ======================================================================
     Helpers
     ====================================================================== */
  function tileHTML(app) {
    if (app.id === 'calendar') {
      var d = new Date();
      return '<span class="icon-tile t-cal"><small data-cal-day>' + d.toLocaleDateString('en-US', { weekday: 'short' }) + '</small><b data-cal-date>' + d.getDate() + '</b></span>';
    }
    return '<span class="icon-tile ' + app.tile + '">' + (G[app.glyph] || '') + '</span>';
  }
  function appHTML(id, i) {
    var a = APPS[id];
    var inner = tileHTML(a) + (id === 'messages' && store.get('seenMsgs') !== '1' ? '<span class="badge">1</span>' : '') + '<span class="app__label">' + esc(a.name) + '</span>';
    var attrs = ' class="app pop" style="--i:' + i + '" data-app="' + id + '"';
    if (a.url) return '<a' + attrs + ' href="' + esc(a.url) + '"' + (a.sameTab ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' + inner + '</a>';
    return '<button' + attrs + ' type="button">' + inner + '</button>';
  }
  var toastT;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200); }
  function emailAddr() { var e = S.email || []; return e.length >= 3 ? e[0] + '@' + e.slice(1).join('.') : ''; }
  function isIpad() { return os.classList.contains('ipad'); }
  function deviceName() { return isIpad() ? 'iPad' : 'iPhone'; }

  /* ======================================================================
     Widgets
     ====================================================================== */
  var weather = null; // filled by fetchWeather()
  function widgetHTML(kind, i) {
    if (kind === 'profile') {
      return '<div class="widget-cell span-4x2 pop" style="--i:' + i + '"><button class="widget w-profile" data-app="about" aria-label="About Ajay">' +
        '<img src="' + esc(S.photo) + '" alt="' + esc(S.name) + '">' +
        '<span class="w-profile__txt"><span><h2>' + esc(S.name) + '</h2><p>' + esc(S.role) + ' at ' + esc(S.employer) + ', working on large-scale distributed systems. ' + esc(S.location) + '.</p></span>' +
        '<span class="chip">UVA ’19 · cyclist · swimmer-in-training</span></span></button><span class="app__label">Profile</span></div>';
    }
    if (kind === 'weather') {
      return '<div class="widget-cell span-2x2 pop" style="--i:' + i + '"><button class="widget w-weather" data-app="weather" aria-label="Weather in Brooklyn" id="wWeather">' + weatherWidgetInner() + '</button><span class="app__label">Weather</span></div>';
    }
    if (kind === 'now') {
      return '<div class="widget-cell span-4x2 pop" style="--i:' + i + '"><button class="widget w-now" data-app="about"><h3>Currently</h3><ul>' +
        (S.now || []).map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul></button><span class="app__label">Now</span></div>';
    }
    return '';
  }
  function weatherWidgetInner() {
    var w = weather;
    return '<span class="city">Brooklyn</span><span class="temp">' + (w ? w.temp + '°' : '--°') + '</span>' +
      '<span>' + (w ? W[w.icon] : W.partly) + '<span class="cond" style="display:block">' + (w ? esc(w.text) : 'Loading…') + '</span>' +
      '<span class="hl">' + (w ? 'H:' + w.hi + '° L:' + w.lo + '°' : '') + '</span></span>';
  }

  /* ======================================================================
     Render home
     ====================================================================== */
  function renderHome() {
    var i = 0;
    var pages = isIpad() ? LAYOUT.pages : LAYOUT.phonePages;
    pagesEl.innerHTML = pages.map(function (items, p) {
      return '<section class="page" aria-label="Page ' + (p + 1) + '"><div class="grid">' + items.map(function (it) {
        i++;
        return it.indexOf('w:') === 0 ? widgetHTML(it.slice(2), i) : appHTML(it, i);
      }).join('') + '</div></section>';
    }).join('');
    $('#pageDots').innerHTML = pages.map(function (_, p) { return '<i' + (p === 0 ? ' class="on"' : '') + '></i>'; }).join('');
    var d = LAYOUT.dock.map(function (id) { return appHTML(id, 30); });
    if (isIpad()) d = d.concat(['<span class="dock__divider"></span>'], LAYOUT.dockRecent.map(function (id) { return appHTML(id, 30); }));
    dock.innerHTML = d.join('');
    dock.classList.add('pop'); dock.style.setProperty('--i', 20);
    $$('#searchPill').forEach(function (el) { el.classList.add('pop'); el.style.setProperty('--i', 19); });
    if (unlocked) home.classList.add('in');
    requestAnimationFrame(fitGrid);
  }

  // Shrink rows/icons so a page fits without scrolling
  function fitGrid() {
    var ipad = isIpad();
    var avail = pagesEl.clientHeight;
    $$('.grid', pagesEl).forEach(function (grid) {
      grid.style.removeProperty('--row'); grid.style.removeProperty('--icon');
      var rows = getComputedStyle(grid).gridTemplateRows.split(' ').filter(Boolean).length || 1;
      var gap = ipad ? 26 : 12;
      var maxRow = ipad ? 118 : 96, minRow = ipad ? 92 : (avail < 440 ? 54 : 66);
      var row = Math.max(minRow, Math.min(maxRow, Math.floor((avail - 8 - gap * (rows - 1)) / rows)));
      grid.style.setProperty('--row', row + 'px');
      grid.style.setProperty('--row-gap', gap + 'px');
      var maxIcon = ipad ? 74 : 60;
      grid.style.setProperty('--icon', Math.min(maxIcon, row - 24) + 'px');
    });
  }

  // page dots + search pill
  var scrollT;
  pagesEl.addEventListener('scroll', function () {
    home.classList.add('scrolling');
    var p = Math.round(pagesEl.scrollLeft / pagesEl.clientWidth);
    $$('#pageDots i').forEach(function (d, k) { d.classList.toggle('on', k === p); });
    clearTimeout(scrollT); scrollT = setTimeout(function () { home.classList.remove('scrolling'); }, 900);
  }, { passive: true });
  // mouse users: horizontal wheel / shift-wheel and drag to change page
  pagesEl.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaY) < 30 || pagesEl._wheelLock) return;
    var page = $$('.page', pagesEl).find(function (pg) { return Math.abs(pg.offsetLeft - pagesEl.scrollLeft) < 5; });
    if (page && page.scrollHeight > page.clientHeight + 4) return; // let the page scroll vertically
    pagesEl._wheelLock = true; setTimeout(function () { pagesEl._wheelLock = false; }, 500);
    pagesEl.scrollBy({ left: (e.deltaY > 0 ? 1 : -1) * pagesEl.clientWidth, behavior: 'smooth' });
  }, { passive: true });
  (function mouseDragPages() {
    var sx = null, sl = 0, moved = false;
    pagesEl.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; sx = e.clientX; sl = pagesEl.scrollLeft; moved = false; });
    addEventListener('pointermove', function (e) {
      if (sx === null) return; var dx = e.clientX - sx;
      if (Math.abs(dx) > 6) { moved = true; pagesEl.style.scrollSnapType = 'none'; pagesEl.scrollLeft = sl - dx; }
    });
    addEventListener('pointerup', function (e) {
      if (sx === null) return; var dx = e.clientX - sx; sx = null;
      if (!moved) return;
      var w = pagesEl.clientWidth, cur = Math.round(sl / w), target = cur + (dx < -60 ? 1 : dx > 60 ? -1 : 0);
      pagesEl.scrollTo({ left: Math.max(0, target) * w, behavior: 'smooth' });
      setTimeout(function () { pagesEl.style.scrollSnapType = ''; }, 400);
      pagesEl._suppressClick = true; setTimeout(function () { pagesEl._suppressClick = false; }, 50);
    });
  })();

  /* ======================================================================
     Clock / battery
     ====================================================================== */
  function tick() {
    var d = new Date();
    var t = (d.getHours() % 12 || 12) + ':' + String(d.getMinutes()).padStart(2, '0');
    $('#sbTime').textContent = t; $('#lkTime').textContent = t;
    $('#lkDate').textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    $('#sbDate').textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    $$('[data-cal-day]').forEach(function (el) { el.textContent = d.toLocaleDateString('en-US', { weekday: 'short' }); });
    $$('[data-cal-date]').forEach(function (el) { el.textContent = d.getDate(); });
  }
  tick(); setInterval(tick, 5000);
  if (navigator.getBattery) navigator.getBattery().then(function (b) {
    var upd = function () { $('#batt').style.width = Math.max(10, Math.round(b.level * 100)) + '%'; };
    upd(); b.addEventListener('levelchange', upd);
  }).catch(function () { });

  /* ======================================================================
     Lock screen
     ====================================================================== */
  var unlocked = false;
  function renderNotifs() {
    var n = [
      { app: 'messages', title: S.firstName, time: 'now', text: 'hey 👋 unlock to look around' }
    ];
    if (weather) n.push({ app: 'weather', title: 'Weather', time: 'now', text: weather.temp + '° and ' + weather.text.toLowerCase() + ' in Brooklyn' });
    $('#notifs').innerHTML = n.map(function (x) {
      return '<div class="notif">' + tileHTML(APPS[x.app]) + '<div class="notif__t"><b>' + esc(x.title) + ' <span>' + esc(x.time) + '</span></b><p>' + esc(x.text) + '</p></div></div>';
    }).join('');
  }
  renderNotifs();

  function unlock(instant, then) {
    if (unlocked) return; unlocked = true;
    lock.classList.add('opening');
    var go = function () {
      lock.style.transition = instant ? 'none' : 'transform .55s cubic-bezier(.3,.8,.3,1)';
      lock.style.transform = 'translateY(-105%)';
      os.classList.remove('locked');
      wall.style.filter = 'blur(14px)'; wall.style.transform = 'scale(1.08)';
      requestAnimationFrame(function () { wall.style.filter = ''; wall.style.transform = ''; });
      home.classList.add('in'); home.removeAttribute('aria-hidden');
      setTimeout(function () { lock.hidden = true; if (then) then(); else { var f = $('.app', home); if (f) f.focus({ preventScroll: true }); } }, instant ? 0 : 560);
    };
    if (instant) go(); else setTimeout(go, 240);
  }
  function relock() {
    closeApp(true);
    lock.hidden = false; lock.classList.remove('opening'); os.classList.add('locked');
    lock.style.transition = 'none'; lock.style.transform = 'translateY(-105%)';
    requestAnimationFrame(function () { requestAnimationFrame(function () { lock.style.transition = 'transform .5s cubic-bezier(.3,.8,.3,1)'; lock.style.transform = ''; }); });
    home.classList.remove('in'); home.setAttribute('aria-hidden', 'true'); unlocked = false;
    renderNotifs(); setTimeout(function () { lock.focus(); }, 500);
  }

  (function lockGesture() {
    var sy = null, dy = 0, t0 = 0, type = '';
    lock.addEventListener('pointerdown', function (e) {
      if (e.target.closest('#hint')) return;
      sy = e.clientY; dy = 0; t0 = performance.now(); type = e.pointerType; lock.style.transition = 'none';
      try { lock.setPointerCapture(e.pointerId); } catch (_) { }
    });
    lock.addEventListener('pointermove', function (e) {
      if (sy === null) return; dy = Math.min(0, e.clientY - sy);
      lock.style.transform = 'translateY(' + dy + 'px)';
      wall.style.filter = 'blur(' + Math.min(10, -dy / 30) + 'px)';
    });
    var end = function () {
      if (sy === null) return; var v = dy / Math.max(1, performance.now() - t0); sy = null;
      wall.style.filter = '';
      if (dy < -120 || v < -0.5 || (type === 'mouse' && dy > -6)) unlock();
      else { lock.style.transition = 'transform .4s cubic-bezier(.3,1.4,.5,1)'; lock.style.transform = ''; }
    };
    lock.addEventListener('pointerup', end); lock.addEventListener('pointercancel', end);
    lock.addEventListener('wheel', function (e) { if (e.deltaY > 20) unlock(); }, { passive: true });
    lock.addEventListener('keydown', function (e) { if (['Enter', ' ', 'ArrowUp'].indexOf(e.key) > -1) { e.preventDefault(); unlock(); } });
    $('#hint').addEventListener('click', function () { unlock(); });
  })();

  /* ======================================================================
     Jiggle mode (long press)
     ====================================================================== */
  var pressT, longPressed = false;
  home.addEventListener('pointerdown', function (e) {
    var t = e.target.closest('.app, .widget'); if (!t) return;
    longPressed = false;
    pressT = setTimeout(function () { longPressed = true; home.classList.add('jiggle'); if (navigator.vibrate) navigator.vibrate(12); }, 600);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { home.addEventListener(ev, function () { clearTimeout(pressT); }); });
  pagesEl.addEventListener('scroll', function () { clearTimeout(pressT); }, { passive: true });
  $('#jiggleDone').addEventListener('click', function () { home.classList.remove('jiggle'); });
  home.addEventListener('contextmenu', function (e) { if (e.target.closest('.app, .widget')) e.preventDefault(); });

  /* ======================================================================
     Opening / closing apps
     ====================================================================== */
  var current = null, currentView = null, originEl = null;

  home.addEventListener('click', function (e) {
    var t = e.target.closest('[data-app]');
    if (home.classList.contains('jiggle')) {
      e.preventDefault();
      if (!t && !e.target.closest('.jiggle-done')) home.classList.remove('jiggle');
      return;
    }
    if (longPressed || pagesEl._suppressClick) { e.preventDefault(); longPressed = false; return; }
    if (!t) return;
    var app = APPS[t.dataset.app];
    if (app.url) return; // real link, let the browser follow it
    e.preventDefault();
    openApp(app.id, t.querySelector('.icon-tile') || t);
  });

  function origin(el) {
    var W = os.clientWidth, H = os.clientHeight, left = 0, top = 0;
    if (isIpad()) {
      var w = win.offsetWidth, h = win.offsetHeight;
      left = W / 2 - w / 2;
      top = win.classList.contains('max') ? H / 2 - h / 2 + 17 : H / 2 - h * 0.48;
    }
    if (!el || !el.getBoundingClientRect) return '50% 50%';
    var r = el.getBoundingClientRect();
    if (!r.width) return '50% 50%';
    return (r.left + r.width / 2 - left) + 'px ' + (r.top + r.height / 2 - top) + 'px';
  }

  function render(id) {
    var app = APPS[id];
    if (currentView && currentView.unmount) currentView.unmount();
    var v = app.view(app) || {};
    currentView = v; current = id;
    body.className = 'appwin__body' + (v.flush ? ' flush' : '');
    body.innerHTML = v.html || '';
    body.scrollTop = 0;
    os.classList.toggle('app-dark', !!v.dark);
    $('#appTitle').textContent = app.name;
    if (v.mount) v.mount(body);
  }

  function openApp(id, fromEl) {
    var app = APPS[id]; if (!app) return;
    if (app.url) { window.open(app.url, app.sameTab ? '_self' : '_blank', 'noopener'); return; }
    if (!unlocked) { unlock(true); }
    if (current) { render(id); setHash(id); return; } // already in an app: swap content
    if (id === 'messages') { store.set('seenMsgs', '1'); $$('.badge').forEach(function (b) { b.remove(); }); }
    originEl = fromEl || $('[data-app="' + id + '"] .icon-tile', home);
    if (isIpad() && store.get('winMax') === '1') win.classList.add('max'); else win.classList.remove('max');
    layer.hidden = false;
    win.classList.add('closed');
    win.style.transition = 'none';
    win.style.transformOrigin = origin(originEl);
    render(id);
    void win.offsetWidth;
    win.style.transition = '';
    requestAnimationFrame(function () { win.classList.remove('closed'); os.classList.add('app-open'); });
    setHash(id);
    setTimeout(function () { var f = body.querySelector('input, textarea, button, a'); if (f && isIpad()) f.focus({ preventScroll: true }); }, 500);
  }

  function closeApp(instant) {
    if (!current) return;
    if (currentView && currentView.unmount) currentView.unmount();
    var el = originEl && document.contains(originEl) ? originEl : $('[data-app="' + current + '"] .icon-tile', home);
    win.style.transformOrigin = origin(el);
    win.classList.add('closed'); os.classList.remove('app-open', 'app-dark');
    var done = function () { layer.hidden = true; body.innerHTML = ''; if (el && el.closest) { var b = el.closest('[data-app]'); if (b) b.focus({ preventScroll: true }); } };
    current = null; currentView = null;
    if (instant) done(); else setTimeout(done, 420);
    setHash('');
  }

  function setHash(id) {
    try { history.replaceState(null, '', id ? '#' + id : location.pathname + location.search); } catch (e) { }
  }

  $('#grab').addEventListener('click', function () { closeApp(); });
  $('#winClose').addEventListener('click', function () { closeApp(); });
  $('#winMin').addEventListener('click', function () { closeApp(); });
  $('#winMax').addEventListener('click', function () { var m = win.classList.toggle('max'); store.set('winMax', m ? '1' : '0'); });
  $('#appBackdrop').addEventListener('click', function () { closeApp(); });
  // swipe up from the bottom edge to go home (phones)
  (function homeGesture() {
    var sy = null;
    win.addEventListener('pointerdown', function (e) { var r = win.getBoundingClientRect(); if (!isIpad() && e.clientY > r.bottom - 44) sy = e.clientY; });
    win.addEventListener('pointerup', function (e) { if (sy !== null && sy - e.clientY > 40) closeApp(); sy = null; });
  })();

  /* ======================================================================
     Keyboard
     ====================================================================== */
  addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '');
    if (e.key === 'Escape') {
      if (!$('#spotlight').hidden) return closeSpot();
      if (home.classList.contains('jiggle')) return home.classList.remove('jiggle');
      if (current && !(currentView && currentView.captureEscape)) return closeApp();
    }
    if (typing) return;
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !current)) {
      if (!unlocked) unlock(true);
      e.preventDefault(); openSpot();
    }
  });

  /* ======================================================================
     Spotlight
     ====================================================================== */
  function openSpot() {
    if (current) closeApp(true);
    var sp = $('#spotlight'); sp.hidden = false;
    var inp = $('#spotIn'); inp.value = ''; spotRender(''); setTimeout(function () { inp.focus(); }, 30);
  }
  function closeSpot() { $('#spotlight').hidden = true; }
  function spotRender(q) {
    q = q.trim().toLowerCase();
    var ids = Object.keys(APPS).filter(function (id) { return !q || APPS[id].name.toLowerCase().indexOf(q) > -1 || id.indexOf(q) > -1; });
    $('#spotResults').innerHTML = ids.map(function (id, i) { return appHTML(id, i).replace('class="app pop"', 'class="app"'); }).join('') ||
      '<p style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,.7)">No results</p>';
  }
  $('#searchPill').addEventListener('click', function (e) { if (home.classList.contains('scrolling')) return; e.stopPropagation(); openSpot(); });
  $('#spotIn').addEventListener('input', function (e) { spotRender(e.target.value); });
  $('#spotIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = $('#spotResults .app'); if (f) f.click(); } });
  $('#spotCancel').addEventListener('click', closeSpot);
  $('#spotlight').addEventListener('click', function (e) {
    var t = e.target.closest('[data-app]');
    if (!t) { if (e.target.id === 'spotlight') closeSpot(); return; }
    closeSpot();
    var app = APPS[t.dataset.app];
    if (app.url) return;
    e.preventDefault();
    openApp(app.id, null);
  });

  /* ======================================================================
     Views
     ====================================================================== */
  function title(t, sub) { return '<h1 class="large-title">' + esc(t) + '</h1>' + (sub ? '<p class="subtitle">' + sub + '</p>' : ''); }
  function linkCell(app, label, sub) {
    var a = APPS[app];
    if (a.url) return '<a class="cell" href="' + esc(a.url) + '"' + (a.sameTab ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' + tileHTML(a) + '<span class="cell__main">' + esc(label || a.name) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><span class="cell__chev">›</span></a>';
    return '<button class="cell" data-open="' + app + '">' + tileHTML(a) + '<span class="cell__main">' + esc(label || a.name) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><span class="cell__chev">›</span></button>';
  }
  // any [data-open] inside an app switches to that app
  body.addEventListener('click', function (e) { var t = e.target.closest('[data-open]'); if (t) { e.preventDefault(); openApp(t.dataset.open); } });

  function viewAbout() {
    var d = new Date();
    return {
      html: '<div class="notes-paper"><p class="meta">' + d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + '</p>' +
        '<h2>Hi, I’m ' + esc(S.firstName) + '.</h2><div class="prose">' + S.bio.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></div>' +
        '<p class="section-h">Find me elsewhere</p><div class="list">' + linkCell('linkedin', 'LinkedIn', 'Best place for work stuff') + linkCell('github', 'GitHub') + linkCell('messages', 'Send me a message') + '</div>'
    };
  }

  function viewPhotos() {
    var ph = S.photos || [];
    return {
      html: title('Library', ph.filter(function (p) { return !p.placeholder; }).length + ' Photos') +
        '<div class="photo-grid">' + ph.map(function (p, i) {
          return p.placeholder ? '<div>' + esc(p.caption) + '<br>' + PH + '</div>' : '<img src="' + esc(p.src) + '" alt="' + esc(p.caption || '') + '" data-i="' + i + '" loading="lazy">';
        }).join('') + '</div>',
      mount: function (el) {
        el.addEventListener('click', function (e) {
          var img = e.target.closest('img[data-i]'); if (!img) return;
          var p = ph[+img.dataset.i];
          var lb = document.createElement('div'); lb.className = 'lightbox';
          lb.innerHTML = '<img src="' + esc(p.src) + '" alt=""><span>' + esc(p.caption || '') + '</span><button class="btn btn--gray">Done</button>';
          lb.addEventListener('click', function () { lb.remove(); os.classList.remove('app-dark'); });
          win.appendChild(lb); os.classList.add('app-dark');
        });
      },
      unmount: function () { $$('.lightbox', win).forEach(function (l) { l.remove(); }); }
    };
  }

  function viewMaps() {
    var pl = S.places || [];
    return {
      html: title('Maps', 'Places that matter') +
        '<div class="map"><svg viewBox="0 0 400 380" preserveAspectRatio="none" aria-hidden="true"><rect width="400" height="380" fill="#e8efe2"/>' +
        '<path d="M250 0c-14 60 34 110 12 170s22 120 0 210h138V0z" fill="#a8d0ef"/><path d="M0 300c60-10 120 10 160 40l-10 40H0z" fill="#a8d0ef"/>' +
        '<path d="M40 40h60v50H40zM120 220h60v50h-60zM300 60h60v60h-60z" fill="#cfe6c1"/>' +
        '<g stroke="#fff" stroke-width="7"><path d="M0 110h400M0 230h400M90 0v380M200 0v380"/></g>' +
        '<g stroke="#ffd98a" stroke-width="6"><path d="M0 340 400 70"/></g></svg>' +
        pl.map(function (p, i) { return '<div class="pin" style="left:' + p.x + '%;top:' + p.y + '%;animation-delay:' + (i * .12 + .2) + 's"><span>' + esc(p.name) + '</span><i></i></div>'; }).join('') +
        '</div><p class="section-h">Saved places</p><div class="list">' +
        pl.map(function (p) { return '<div class="cell"><span class="icon-tile t-maps">' + G.maps + '</span><span class="cell__main">' + esc(p.name) + '<small>' + esc(p.note) + '</small></span></div>'; }).join('') + '</div>' +
        '<div style="margin-top:16px"><button class="btn btn--block" data-open="drive">Drive around Brooklyn</button></div>'
    };
  }

  function viewCalendar() {
    var d = new Date(), y = d.getFullYear(), m = d.getMonth();
    var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    var cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (x) { return '<b>' + x + '</b>'; });
    for (var i = 0; i < first; i++) cells.push('<span></span>');
    for (var k = 1; k <= days; k++) cells.push('<span' + (k === d.getDate() ? ' class="today"' : '') + '>' + k + '</span>');
    return {
      html: title(d.toLocaleDateString('en-US', { month: 'long' }), String(y)) + '<div class="month">' + cells.join('') + '</div>' +
        '<p class="section-h">Today</p><div class="list">' + (S.calendar || []).map(function (c) {
          return '<div class="cell"><span class="cell__main">' + esc(c.what) + '</span><span class="cell__value">' + esc(c.time) + '</span></div>';
        }).join('') + '</div><div style="margin-top:16px"><button class="btn btn--block" data-open="messages">Grab coffee with Ajay</button></div>'
    };
  }

  function viewWeather() {
    var w = weather;
    var night = w && !w.isDay;
    return {
      flush: true, dark: true,
      html: '<div class="weather-app' + (night ? ' night' : '') + '" style="height:100%;overflow-y:auto"><div class="city">Brooklyn</div>' +
        '<div class="big">' + (w ? w.temp + '°' : '--°') + '</div><div class="cond">' + (w ? esc(w.text) : 'Loading…') + '</div>' +
        '<div class="cond" style="font-size:17px">' + (w ? 'H:' + w.hi + '°  L:' + w.lo + '°' : '') + '</div>' +
        '<div class="card"><h4>Where Ajay lives</h4><div class="hours">' + (w ? w.hours.map(function (h) { return '<div><span>' + h.label + '</span>' + W[h.icon] + '<span>' + h.temp + '°</span></div>'; }).join('') : '') + '</div></div>' +
        '<p style="margin-top:18px;font-size:12px;opacity:.7">Live data from Open-Meteo' + (w ? ' · updated ' + w.updated : '') + '</p></div>'
    };
  }

  function viewRides() {
    var r = S.rides || { stats: [] };
    return {
      html: title('Rides', r.placeholder ? 'Sample numbers ' + PH : '') + '<div class="list">' + r.stats.map(function (s) {
        return '<div class="cell"><span class="cell__main">' + esc(s[0]) + '</span><span class="cell__value">' + esc(s[1]) + '</span></div>';
      }).join('') + '</div><p class="section-h">Idea</p><div class="list"><div class="cell"><span class="cell__main">Pull real stats from a ride-tracking export, or show a map of a favorite loop.</span></div></div>'
    };
  }

  function viewProjects() {
    return {
      html: title('Projects', 'Things I’ve built') + '<div class="list">' + (S.projects || []).map(function (p) {
        var inner = '<span class="icon-tile t-proj">' + G.proj + '</span><span class="cell__main">' + esc(p.name) + (p.placeholder ? PH : '') + '<small>' + esc(p.blurb) + '</small></span>';
        return p.url ? '<a class="cell" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' + inner + '<span class="cell__chev">›</span></a>' : '<div class="cell">' + inner + '</div>';
      }).join('') + '</div><p class="section-h">More</p><div class="list">' + linkCell('github', 'Everything on GitHub') + '</div>'
    };
  }

  function viewComingSoon(app) {
    return {
      html: '<div class="empty">' + tileHTML(app) + '<h2>' + esc(app.name) + '</h2><p>Link coming soon. ' + PH + '</p>' +
        '<p style="margin-top:20px"><button class="btn btn--gray" data-open="messages">Message Ajay instead</button></p></div>'
    };
  }

  function listView(t, sub, items, glyph, tile, line2) {
    return title(t, sub) + '<div class="list">' + items.map(function (b) {
      return '<div class="cell"><span class="icon-tile ' + tile + '">' + G[glyph] + '</span><span class="cell__main">' + esc(b.title) + (b.placeholder ? PH : '') + '<small>' + esc(b[line2]) + '</small></span></div>';
    }).join('') + '</div>';
  }
  function viewBooks() { return { html: listView('Books', 'Reading list', S.books || [], 'books', 't-books', 'author') }; }
  function viewMusic() {
    return {
      html: listView('Music', 'What’s playing', S.music || [], 'music', 't-music', 'artist') +
        (L.music ? '<div style="margin-top:16px"><a class="btn btn--block" href="' + esc(L.music) + '" target="_blank" rel="noopener noreferrer">Open my profile</a></div>' : '')
    };
  }
  function viewResume(app) {
    if (!L.resume) return viewComingSoon(app);
    return { html: title('Files', 'Recents') + '<div class="list"><a class="cell" href="' + esc(L.resume) + '" target="_blank" rel="noopener">' + tileHTML(app) + '<span class="cell__main">Resume<small>PDF</small></span><span class="cell__chev">›</span></a>' + linkCell('linkedin', 'LinkedIn profile') + '</div>' };
  }

  function viewWeb() {
    var favs = ['classic', 'github', 'linkedin', 'instagram', 'twitter'].filter(function (id) { return APPS[id].url; });
    return {
      html: '<div class="urlbar"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="7" r="5.5"/><path d="m11 11 4 4"/></svg>ajayppatel.com</div>' +
        '<h2 style="font-size:22px;margin:0 4px 10px">Favorites</h2><div class="fav-grid">' + favs.map(function (id) {
          var a = APPS[id];
          return '<a class="fav" href="' + esc(a.url) + '"' + (a.sameTab ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' + tileHTML(a) + '<span>' + esc(id === 'classic' ? 'Classic site' : a.name) + '</span></a>';
        }).join('') + '</div>' +
        '<p class="section-h">Privacy Report</p><div class="list"><div class="cell"><span class="cell__main">0 trackers on this site<small>No analytics, no cookies.</small></span></div></div>'
    };
  }

  function viewMail() {
    var a = emailAddr();
    if (!a) return {
      html: title('Mail') + '<div class="empty">' + tileHTML(APPS.mail) + '<h2>Inbox Zero</h2><p>Email is hidden to keep the bots out. Messages is the fastest way to reach me.</p>' +
        '<p style="margin-top:20px"><button class="btn" data-open="messages">Open Messages</button></p></div>'
    };
    return {
      html: title('Mail', 'Write to ' + esc(S.firstName)) + '<div class="list" id="mailCard"><button class="cell" id="reveal"><span class="cell__main" style="color:var(--tint)">Show email address</span></button></div>' +
        '<p class="subtitle" style="margin-top:10px">The address is put together only when you tap, so it never sits in the page for scrapers.</p>',
      mount: function () {
        $('#reveal').addEventListener('click', function () {
          var addr = emailAddr();
          $('#mailCard').innerHTML = '<div class="cell"><span class="cell__main" style="user-select:text;-webkit-user-select:text;font-weight:600">' + esc(addr) + '</span></div>' +
            '<button class="cell" id="copyMail"><span class="cell__main" style="color:var(--tint)">Copy address</span></button>' +
            '<a class="cell" href="mailto:' + esc(addr) + '"><span class="cell__main" style="color:var(--tint)">Open in mail app</span></a>';
          $('#copyMail').addEventListener('click', function () {
            (navigator.clipboard ? navigator.clipboard.writeText(addr) : Promise.reject()).then(function () { toast('Copied'); }).catch(function () { toast('Select the address to copy'); });
          });
        });
      }
    };
  }

  function viewMessages() {
    var timers = [];
    var state = { step: 0, message: '' };
    return {
      flush: true,
      html: '<div class="msg-app"><div class="msg-head"><img src="' + esc(S.photo) + '" alt=""><b>' + esc(S.firstName) + ' ›</b></div>' +
        '<div class="thread" id="thread" aria-live="polite"></div>' +
        '<form class="composer" id="composer"><textarea id="msgIn" rows="1" placeholder="iMessage" aria-label="Message"></textarea>' +
        '<button class="send" id="sendBtn" aria-label="Send" disabled><svg width="16" height="16" viewBox="0 0 16 16" fill="#fff"><path d="M8 1 2 7l1.4 1.4L7 4.8V15h2V4.8l3.6 3.6L14 7z"/></svg></button></form></div>',
      mount: function () {
        var th = $('#thread'), inp = $('#msgIn'), btn = $('#sendBtn');
        var add = function (txt, who) { var b = document.createElement('div'); b.className = 'bub ' + who; b.textContent = txt; th.appendChild(b); th.scrollTop = th.scrollHeight; return b; };
        var say = function (lines, cb) {
          var i = 0;
          (function next() {
            if (i >= lines.length) { if (cb) cb(); return; }
            var t = document.createElement('div'); t.className = 'bub them'; t.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; th.appendChild(t); th.scrollTop = th.scrollHeight;
            timers.push(setTimeout(function () { t.textContent = lines[i++]; th.scrollTop = th.scrollHeight; timers.push(setTimeout(next, 380)); }, 650 + Math.min(900, lines[i].length * 12)));
          })();
        };
        var intro = ['hey! thanks for stopping by 👋', 'I’m Ajay. engineer in Brooklyn, usually on a bike', 'send me a message here and it comes straight to me'];
        if (store.get('introSeen') === '1') intro.forEach(function (l) { add(l, 'them'); }); else { say(intro); store.set('introSeen', '1'); }

        inp.addEventListener('input', function () { btn.disabled = !inp.value.trim(); inp.style.height = 'auto'; inp.style.height = Math.min(110, inp.scrollHeight) + 'px'; });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#composer').requestSubmit ? $('#composer').requestSubmit() : $('#composer').dispatchEvent(new Event('submit')); } });
        $('#composer').addEventListener('submit', function (e) {
          e.preventDefault();
          var v = inp.value.trim(); if (!v) return;
          add(v, 'me'); inp.value = ''; inp.style.height = ''; btn.disabled = true;
          if (state.step === 0) {
            state.message = v; state.step = 1;
            say(['got it! how should I get back to you?', 'drop an email, a handle, or just say “skip”']);
            inp.placeholder = 'Email or handle';
          } else if (state.step === 1) {
            state.step = 2; inp.placeholder = 'iMessage';
            send(state.message, /^skip$/i.test(v) ? '' : v);
          } else {
            state.message = v; state.step = 1;
            say(['another one, love it. same way to reach you? (or “skip”)']);
          }
        });
        function send(message, contact) {
          var status = add('Sending…', 'sys');
          if (!S.formEndpoint) {
            timers.push(setTimeout(function () { status.textContent = 'Demo mode: add a form endpoint in js/config.js to deliver messages.'; say(['(this is a prototype, so that one didn’t actually reach me yet)']); state.step = 0; }, 500));
            return;
          }
          var payload = Object.assign({ message: message, contact: contact, _subject: 'New message from ajayppatel.com' }, S.formFields || {});
          fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
            .then(function (r) { if (!r.ok) throw new Error(r.status); status.textContent = 'Delivered'; say(['got it, thank you! I’ll get back to you soon 🙌']); state.step = 0; })
            .catch(function () { status.textContent = 'Not Delivered'; status.style.color = 'var(--red)'; say(['hmm, that didn’t go through. try LinkedIn?']); state.step = 0; });
        }
      },
      unmount: function () { timers.forEach(clearTimeout); }
    };
  }

  function viewSettings() {
    var ap = store.get('appearance') || 'auto';
    var wl = store.get('wall') || 'dusk';
    var rm = store.get('reduceMotion') === '1';
    var row = function (k, v) { return '<div class="cell"><span class="cell__main">' + esc(k) + '</span><span class="cell__value">' + esc(v) + '</span></div>'; };
    return {
      html: title('Settings') +
        '<div class="list"><button class="cell" data-open="about" style="min-height:76px"><img src="' + esc(S.photo) + '" alt="" style="width:58px;height:58px;border-radius:50%;object-fit:cover"><span class="cell__main" style="font-size:20px">' + esc(S.name) + '<small>AjayOS Account, iCloud+ (the plus is cycling)</small></span><span class="cell__chev">›</span></button></div>' +
        '<p class="section-h">Display & Brightness</p><div class="list"><div class="cell"><div class="seg" id="segAp" style="flex:1">' +
        ['light', 'dark', 'auto'].map(function (x) { return '<button data-v="' + x + '"' + (x === ap ? ' class="on"' : '') + '>' + x[0].toUpperCase() + x.slice(1) + '</button>'; }).join('') + '</div></div>' +
        '<div class="cell"><span class="cell__main">Reduce Motion</span><button class="switch" id="swRm" role="switch" aria-checked="' + rm + '" aria-label="Reduce Motion"></button></div></div>' +
        '<p class="section-h">Wallpaper</p><div class="list"><div class="cell" style="gap:10px">' +
        [['dusk', 'Bridge at dusk'], ['river', 'East River'], ['park', 'Prospect Park']].map(function (x) {
          return '<button class="wallpick" data-v="' + x[0] + '" aria-label="' + x[1] + '" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;color:var(--label)"><span data-wall="' + x[0] + '" class="wall-swatch" style="width:100%;aspect-ratio:9/16;max-height:120px;border-radius:10px;outline:' + (x[0] === wl ? '3px solid var(--tint)' : '0') + ';outline-offset:2px"></span>' + x[1] + '</button>';
        }).join('') + '</div></div>' +
        '<p class="section-h">General · About</p><div class="list">' + row('Name', S.name) + row('Model', 'Human, Brooklyn edition') + row('Software Version', 'AjayOS 26') + row('Build', 'UVA ’19') +
        row('Employer', S.employer) + row('Storage', 'Mostly tweets') + row('Background App Refresh', 'Cycling, swimming') + '</div>' +
        '<p class="section-h">More</p><div class="list">' + linkCell('classic', 'Classic website', 'The plain old version') +
        '<button class="cell" id="relock"><span class="cell__main" style="color:var(--red)">Lock ' + deviceName() + '</span></button></div>',
      mount: function (el) {
        // swatch previews reuse the wallpaper gradients
        $$('.wall-swatch', el).forEach(function (s) { var tmp = document.createElement('div'); tmp.className = 'wall'; tmp.dataset.wall = s.dataset.wall; tmp.style.cssText = 'position:absolute;visibility:hidden'; document.body.appendChild(tmp); s.style.background = getComputedStyle(tmp).backgroundImage; tmp.remove(); });
        $('#segAp').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; setAppearance(b.dataset.v); $$('#segAp button').forEach(function (x) { x.classList.toggle('on', x === b); }); });
        $('#swRm').addEventListener('click', function () { var on = this.getAttribute('aria-checked') !== 'true'; this.setAttribute('aria-checked', on); store.set('reduceMotion', on ? '1' : '0'); document.documentElement.classList.toggle('reduce-motion', on); });
        $$('.wallpick', el).forEach(function (b) { b.addEventListener('click', function () { setWall(b.dataset.v); $$('.wall-swatch', el).forEach(function (s) { s.style.outline = s.dataset.wall === b.dataset.v ? '3px solid var(--tint)' : '0'; }); }); });
        $('#relock').addEventListener('click', relock);
      }
    };
  }
  function setAppearance(v) { store.set('appearance', v); if (v === 'auto') document.documentElement.removeAttribute('data-appearance'); else document.documentElement.setAttribute('data-appearance', v); }
  function setWall(v) { store.set('wall', v); if (v === 'dusk') wall.removeAttribute('data-wall'); else wall.dataset.wall = v; }

  function viewDrive() {
    var game;
    return {
      flush: true, dark: true, captureEscape: false,
      html: '<div class="drive" id="drive"></div>',
      mount: function () {
        if (!window.DriveGame) return;
        game = window.DriveGame($('#drive'), {
          touch: !isIpad() || matchMedia('(pointer: coarse)').matches,
          onEnter: function (id) { openApp(id); },
          onExit: function () { closeApp(); }
        });
      },
      unmount: function () { if (game) game.destroy(); }
    };
  }

  /* ======================================================================
     Weather (Open-Meteo, no key needed)
     ====================================================================== */
  function wmo(code, isDay) {
    if (code === 0) return [isDay ? 'sun' : 'moon', 'Clear'];
    if (code <= 2) return [isDay ? 'partly' : 'moon', 'Partly Cloudy'];
    if (code === 3) return ['cloud', 'Cloudy'];
    if (code === 45 || code === 48) return ['fog', 'Foggy'];
    if (code >= 51 && code <= 67) return ['rain', code < 60 ? 'Drizzle' : 'Rain'];
    if (code >= 71 && code <= 77) return ['snow', 'Snow'];
    if (code >= 80 && code <= 82) return ['rain', 'Showers'];
    if (code === 85 || code === 86) return ['snow', 'Snow Showers'];
    if (code >= 95) return ['storm', 'Thunderstorms'];
    return ['cloud', 'Cloudy'];
  }
  function fetchWeather() {
    var c = S.coords;
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon +
      '&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min' +
      '&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=2';
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      var cur = j.current, wc = wmo(cur.weather_code, cur.is_day);
      var idx = j.hourly.time.findIndex(function (t) { return t >= cur.time.slice(0, 13); });
      var hours = [];
      for (var k = Math.max(0, idx); k < Math.max(0, idx) + 6 && k < j.hourly.time.length; k++) {
        var hh = +j.hourly.time[k].slice(11, 13);
        hours.push({ label: k === idx ? 'Now' : ((hh % 12 || 12) + (hh < 12 ? 'AM' : 'PM')), temp: Math.round(j.hourly.temperature_2m[k]), icon: wmo(j.hourly.weather_code[k], j.hourly.is_day[k])[0] });
      }
      var now = new Date();
      weather = { temp: Math.round(cur.temperature_2m), icon: wc[0], text: wc[1], isDay: !!cur.is_day, hi: Math.round(j.daily.temperature_2m_max[0]), lo: Math.round(j.daily.temperature_2m_min[0]), hours: hours,
        updated: (now.getHours() % 12 || 12) + ':' + String(now.getMinutes()).padStart(2, '0') };
      var ww = $('#wWeather'); if (ww) ww.innerHTML = weatherWidgetInner();
      if (!unlocked) renderNotifs();
      if (current === 'weather') render('weather');
    }).catch(function () { });
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  var mq = matchMedia('(min-width: 768px) and (min-height: 560px)');
  function applyMode() { os.classList.toggle('ipad', mq.matches); renderHome(); }
  if (mq.addEventListener) mq.addEventListener('change', applyMode); else mq.addListener(applyMode);
  addEventListener('resize', function () { requestAnimationFrame(fitGrid); });

  setAppearance(store.get('appearance') || 'auto');
  setWall(store.get('wall') || 'dusk');
  if (store.get('reduceMotion') === '1') document.documentElement.classList.add('reduce-motion');

  os.classList.add('locked');
  home.setAttribute('aria-hidden', 'true');
  applyMode();
  fetchWeather(); setInterval(fetchWeather, 15 * 60 * 1000);

  // Deep links: ajayppatel.com/#drive opens straight into an app
  function fromHash() {
    var id = location.hash.slice(1);
    if (APPS[id] && !APPS[id].url) { unlock(true); openApp(id); }
  }
  if (location.hash) fromHash(); else lock.focus({ preventScroll: true });
  addEventListener('hashchange', fromHash);
})();
