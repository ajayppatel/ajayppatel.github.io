/* Drive — a tiny top-down Brooklyn. Pull up to a building to open that app.
   window.DriveGame(container, { touch, onEnter(appId), onExit() }) -> { destroy() } */
(function () {
  'use strict';

  var WORLD = { w: 2400, h: 1600 };
  var ROAD_W = 92;
  var ROADS_H = [300, 800, 1300];   // y centers
  var ROADS_V = [300, 1000, 1700];  // x centers
  var RIVER_X = 2120;

  // Destinations: app = id in os.js. door = where you park.
  var DESTS = [
    { app: 'about',    name: 'Museum of Ajay', sub: 'Learn about me',      emoji: '🏛️', x: 400,  y: 392, w: 330, h: 190, color: '#e9e2d0', roof: '#d8cfb8', door: [565, 318] },
    { app: 'messages', name: 'Post Office',    sub: 'Send me a message',   emoji: '📮', x: 1080, y: 392, w: 250, h: 170, color: '#4f6fa8', roof: '#3f5c91', door: [1205, 318] },
    { app: 'calendar', name: 'Corner Café',    sub: 'Grab a coffee',       emoji: '☕', x: 1400, y: 400, w: 200, h: 140, color: '#a8664a', roof: '#8e523a', door: [1500, 318] },
    { app: 'rides',    name: 'Bike Shop',      sub: 'Where I ride',        emoji: '🚲', x: 1790, y: 392, w: 240, h: 170, color: '#e07a3a', roof: '#c4652b', door: [1910, 318] },
    { app: 'photos',   name: 'Photo Gallery',  sub: 'Pictures',            emoji: '🖼️', x: 400,  y: 868, w: 250, h: 180, color: '#c9a4d8', roof: '#b38cc4', door: [525, 818] },
    { app: 'projects', name: 'Code Lab',       sub: 'Things I’ve built',   emoji: '💻', x: 1080, y: 862, w: 260, h: 200, color: '#3a3f4b', roof: '#2a2e37', door: [1210, 818] },
    { app: 'linkedin', name: 'Office Tower',   sub: 'Work history',        emoji: '🏢', x: 1410, y: 862, w: 210, h: 250, color: '#6c8fc7', roof: '#5a7db5', door: [1515, 818] },
    { app: 'books',    name: 'Library',        sub: 'Reading list',        emoji: '📚', x: 1790, y: 870, w: 250, h: 200, color: '#8a5a44', roof: '#744a37', door: [1915, 818] },
    { app: 'music',    name: 'Record Store',   sub: 'What I listen to',    emoji: '🎵', x: 410,  y: 1362, w: 230, h: 160, color: '#e85d75', roof: '#cf4a62', door: [525, 1318] },
    { app: 'weather',  name: 'Weather Station', sub: 'Brooklyn right now', emoji: '🌤️', x: 1800, y: 1365, w: 200, h: 150, color: '#7fb8e6', roof: '#69a3d3', door: [1900, 1318] }
  ];
  var PARK = { x: 1060, y: 1350, w: 590, h: 230, name: 'Prospect Park' };

  // Deterministic random for brownstones/trees
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  function blocks() {
    var xs = [0].concat(ROADS_V.map(function (x) { return [x - ROAD_W / 2, x + ROAD_W / 2]; }).reduce(function (a, b) { return a.concat(b); }, []), [RIVER_X]);
    var ys = [0].concat(ROADS_H.map(function (y) { return [y - ROAD_W / 2, y + ROAD_W / 2]; }).reduce(function (a, b) { return a.concat(b); }, []), [WORLD.h]);
    var out = [];
    for (var i = 0; i < xs.length; i += 2) for (var j = 0; j < ys.length; j += 2) out.push({ x: xs[i], y: ys[j], w: xs[i + 1] - xs[i], h: ys[j + 1] - ys[j] });
    return out;
  }
  function overlaps(a, b, pad) { pad = pad || 0; return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y; }

  // Build static world: brownstones along block edges, trees on sidewalks
  var BUILDINGS = [], TREES = [];
  (function build() {
    var r = rng(42);
    var tones = ['#9c5b45', '#a8674e', '#8d4f3c', '#b07a5e', '#7e4a3a', '#c08b6b', '#94604d'];
    var solid = DESTS.map(function (d) { return { x: d.x, y: d.y, w: d.w, h: d.h }; }).concat([PARK]);
    blocks().forEach(function (b) {
      var inset = 26; // sidewalk
      var inner = { x: b.x + inset, y: b.y + inset, w: b.w - inset * 2, h: b.h - inset * 2 };
      if (inner.w < 60 || inner.h < 60) return;
      [0, 1].forEach(function (side) {
        var x = inner.x, depth = Math.min(110, inner.h / 2 - 6);
        while (x < inner.x + inner.w - 50) {
          var w = 55 + Math.floor(r() * 45); if (x + w > inner.x + inner.w) w = inner.x + inner.w - x;
          var h = depth - r() * 25;
          var bd = { x: x, y: side ? inner.y + inner.h - h : inner.y, w: w - 4, h: h, color: tones[Math.floor(r() * tones.length)] };
          if (!solid.some(function (s) { return overlaps(s, bd, 10); })) BUILDINGS.push(bd);
          x += w;
        }
      });
      // trees along sidewalks
      for (var tx = b.x + 40; tx < b.x + b.w - 20; tx += 70 + r() * 40) {
        TREES.push({ x: tx, y: b.y + 12, r: 13 + r() * 6 }); TREES.push({ x: tx + 20, y: b.y + b.h - 12, r: 13 + r() * 6 });
      }
    });
    for (var k = 0; k < 40; k++) TREES.push({ x: PARK.x + 30 + r() * (PARK.w - 60), y: PARK.y + 25 + r() * (PARK.h - 50), r: 16 + r() * 14, park: true });
    DESTS.forEach(function (d) { BUILDINGS.push({ x: d.x, y: d.y, w: d.w, h: d.h, color: d.color, roof: d.roof, dest: d }); });
  })();

  window.DriveGame = function (root, opts) {
    opts = opts || {};
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    root.appendChild(canvas);

    var hud = document.createElement('div');
    hud.innerHTML =
      '<div class="drive__hud"><div class="drive__title">Brooklyn<small>Pull up to a building to go inside</small></div><button class="drive__exit" aria-label="Exit drive">✕</button></div>' +
      '<div class="drive__prompt" role="status"><span style="font-size:28px" data-e></span><span><b data-n></b><small data-s></small></span><a class="btn" data-go href="#">Go in</a></div>' +
      (opts.touch ? '<div class="drive__stick" aria-label="Joystick"><i></i></div>' : '') +
      '<div class="drive__keys">Arrow keys or WASD to drive · Enter to go inside</div>' +
      '<div class="drive__hint">' + (opts.touch ? 'Drag the joystick to drive' : 'Use the arrow keys or WASD to drive') + '</div>';
    while (hud.firstChild) root.appendChild(hud.firstChild);

    var prompt = root.querySelector('.drive__prompt'), goBtn = root.querySelector('[data-go]'), hint = root.querySelector('.drive__hint');
    root.querySelector('.drive__exit').addEventListener('click', function () { opts.onExit && opts.onExit(); });

    var car = { x: 640, y: 800, a: 0, v: 0 };
    var keys = {}, stick = { x: 0, y: 0, on: false };
    var cam = { x: car.x, y: car.y };
    var near = null, raf = 0, last = performance.now(), dpr = 1, vw = 0, vh = 0, scale = 1, moved = false, t = 0;

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      vw = root.clientWidth; vh = root.clientHeight;
      canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
      scale = vw < 500 ? 0.72 : vw < 900 ? 0.85 : 1;
    }
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(root); else window.addEventListener('resize', resize);
    resize();

    // ---- input ----
    function kd(e) {
      var k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].indexOf(k) > -1) { keys[k] = true; e.preventDefault(); }
      if (k === 'enter' && near) { e.preventDefault(); enter(); }
    }
    function ku(e) { keys[e.key.toLowerCase()] = false; }
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);

    var stickEl = root.querySelector('.drive__stick');
    if (stickEl) {
      var knob = stickEl.querySelector('i'), sid = null;
      var setStick = function (e) {
        var r = stickEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = e.clientX - cx, dy = e.clientY - cy, m = Math.hypot(dx, dy), max = r.width / 2;
        if (m > max) { dx = dx / m * max; dy = dy / m * max; }
        stick.x = dx / max; stick.y = dy / max; stick.on = true;
        knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      };
      stickEl.addEventListener('pointerdown', function (e) { sid = e.pointerId; stickEl.setPointerCapture(sid); setStick(e); });
      stickEl.addEventListener('pointermove', function (e) { if (e.pointerId === sid) setStick(e); });
      var rel = function (e) { if (e.pointerId !== sid) return; sid = null; stick.on = false; stick.x = stick.y = 0; knob.style.transform = ''; };
      stickEl.addEventListener('pointerup', rel); stickEl.addEventListener('pointercancel', rel);
    }

    function enter() {
      if (!near) return;
      var link = goBtn.getAttribute('target') === '_blank';
      if (link) { window.open(goBtn.href, '_blank', 'noopener'); return; }
      opts.onEnter && opts.onEnter(near.app);
    }
    goBtn.addEventListener('click', function (e) {
      if (goBtn.getAttribute('target') === '_blank') return; // real link
      e.preventDefault(); enter();
    });

    // ---- physics ----
    var MAX = 330, REV = 140, ACC = 520, TURN = 2.9;
    function step(dt) {
      var up = keys.arrowup || keys.w, down = keys.arrowdown || keys.s, left = keys.arrowleft || keys.a, right = keys.arrowright || keys.d;
      var throttle = 0, steer = 0;
      if (stick.on && Math.hypot(stick.x, stick.y) > 0.15) {
        var want = Math.atan2(stick.y, stick.x), diff = Math.atan2(Math.sin(want - car.a), Math.cos(want - car.a));
        throttle = Math.min(1, Math.hypot(stick.x, stick.y));
        car.a += Math.max(-TURN * dt, Math.min(TURN * dt, diff)) * Math.min(1, Math.abs(car.v) / 80 + 0.25);
        if (Math.abs(diff) > 2.4) throttle = -0.5;
      } else {
        throttle = (up ? 1 : 0) - (down ? 1 : 0);
        steer = (right ? 1 : 0) - (left ? 1 : 0);
      }
      if (throttle || steer) { if (!moved) { moved = true; hint.style.opacity = 0; } }
      car.v += throttle * ACC * dt;
      if (keys[' ']) car.v *= 0.9;
      car.v *= throttle ? 0.995 : 0.975;
      car.v = Math.max(-REV, Math.min(MAX, car.v));
      if (Math.abs(car.v) < 2 && !throttle) car.v = 0;
      car.a += steer * TURN * dt * Math.max(-1, Math.min(1, car.v / 120));

      var nx = car.x + Math.cos(car.a) * car.v * dt, ny = car.y + Math.sin(car.a) * car.v * dt, R = 17;
      // world bounds + river (bridge on middle road)
      var onBridge = Math.abs(ny - ROADS_H[1]) < ROAD_W / 2 - 8;
      var maxX = onBridge ? WORLD.w - R : RIVER_X - R;
      if (nx < R || nx > maxX || ny < R || ny > WORLD.h - R) { nx = Math.max(R, Math.min(maxX, nx)); ny = Math.max(R, Math.min(WORLD.h - R, ny)); car.v *= -0.3; }
      if (!onBridge && car.x > RIVER_X - R && nx > RIVER_X - R) { /* already handled */ }
      // buildings
      for (var i = 0; i < BUILDINGS.length; i++) {
        var b = BUILDINGS[i];
        var cx = Math.max(b.x, Math.min(nx, b.x + b.w)), cy = Math.max(b.y, Math.min(ny, b.y + b.h));
        var dx = nx - cx, dy = ny - cy, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          var d = Math.sqrt(d2) || 0.01; nx = cx + dx / d * R; ny = cy + dy / d * R;
          car.v *= -0.35;
        }
      }
      car.x = nx; car.y = ny;

      // nearest door
      var found = null;
      for (var k = 0; k < DESTS.length; k++) { var de = DESTS[k]; if (Math.hypot(car.x - de.door[0], car.y - de.door[1]) < 62) { found = de; break; } }
      if (found !== near) { near = found; updatePrompt(); }

      // camera with a little look-ahead
      var lx = car.x + Math.cos(car.a) * car.v * 0.35, ly = car.y + Math.sin(car.a) * car.v * 0.35;
      cam.x += (lx - cam.x) * Math.min(1, dt * 4); cam.y += (ly - cam.y) * Math.min(1, dt * 4);
    }

    function updatePrompt() {
      if (!near) { prompt.classList.remove('show'); return; }
      prompt.querySelector('[data-e]').textContent = near.emoji;
      prompt.querySelector('[data-n]').textContent = near.name;
      prompt.querySelector('[data-s]').textContent = near.sub;
      var url = opts.urlFor ? opts.urlFor(near.app) : null;
      var linkApps = { linkedin: (window.SITE.links || {}).linkedin };
      url = linkApps[near.app] || url;
      if (url) { goBtn.href = url; goBtn.target = '_blank'; goBtn.rel = 'noopener noreferrer'; } else { goBtn.href = '#'; goBtn.removeAttribute('target'); }
      prompt.classList.add('show');
    }

    // ---- drawing ----
    function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

    function draw() {
      var s = scale * dpr;
      var halfW = vw / 2 / scale, halfH = vh / 2 / scale;
      var cx = Math.max(halfW, Math.min(WORLD.w - halfW, cam.x)), cy = Math.max(halfH, Math.min(WORLD.h - halfH, cam.y));
      if (WORLD.w < halfW * 2) cx = WORLD.w / 2;
      if (WORLD.h < halfH * 2) cy = WORLD.h / 2;
      var view = { x: cx - halfW, y: cy - halfH, w: halfW * 2, h: halfH * 2 };
      ctx.setTransform(s, 0, 0, s, -view.x * s, -view.y * s);

      // ground (sidewalk/concrete)
      ctx.fillStyle = '#d6d1c4'; ctx.fillRect(view.x - 10, view.y - 10, view.w + 20, view.h + 20);
      // block interiors
      ctx.fillStyle = '#c7c1b2';
      blocks().forEach(function (b) { ctx.fillRect(b.x + 24, b.y + 24, b.w - 48, b.h - 48); });

      // river
      ctx.fillStyle = '#4f8fc6'; ctx.fillRect(RIVER_X, 0, WORLD.w - RIVER_X, WORLD.h);
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3;
      for (var wy = 40; wy < WORLD.h; wy += 70) { ctx.beginPath(); for (var wx = RIVER_X + 20; wx < WORLD.w; wx += 40) { var o = Math.sin(t * 1.5 + wx * .05 + wy) * 5; ctx.moveTo(wx, wy + o); ctx.lineTo(wx + 18, wy + o); } ctx.stroke(); }
      ctx.fillStyle = '#2f3a2a'; ctx.font = '600 22px -apple-system, system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.save(); ctx.translate(RIVER_X + 140, 400); ctx.rotate(-Math.PI / 2); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText('EAST RIVER', 0, 0); ctx.restore();

      // park
      ctx.fillStyle = '#7fbf6a'; rr(PARK.x, PARK.y, PARK.w, PARK.h, 30); ctx.fill();
      ctx.strokeStyle = '#e8dcb5'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(PARK.x + PARK.w / 2, PARK.y + PARK.h / 2, PARK.w / 2 - 50, PARK.h / 2 - 40, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#5aa7d6'; ctx.beginPath(); ctx.ellipse(PARK.x + PARK.w / 2 + 40, PARK.y + PARK.h / 2, 70, 34, .2, 0, Math.PI * 2); ctx.fill();

      // roads
      ctx.fillStyle = '#3c3f47';
      ROADS_H.forEach(function (y, i) { ctx.fillRect(0, y - ROAD_W / 2, i === 1 ? WORLD.w : RIVER_X, ROAD_W); });
      ROADS_V.forEach(function (x) { ctx.fillRect(x - ROAD_W / 2, 0, ROAD_W, WORLD.h); });
      // bridge
      ctx.fillStyle = '#5b5f6a'; ctx.fillRect(RIVER_X - 10, ROADS_H[1] - ROAD_W / 2 - 10, WORLD.w - RIVER_X + 10, 10); ctx.fillRect(RIVER_X - 10, ROADS_H[1] + ROAD_W / 2, WORLD.w - RIVER_X + 10, 10);
      // lane lines
      ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 3; ctx.setLineDash([22, 18]);
      ROADS_H.forEach(function (y, i) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(i === 1 ? WORLD.w : RIVER_X, y); ctx.stroke(); });
      ROADS_V.forEach(function (x) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, WORLD.h); ctx.stroke(); });
      ctx.setLineDash([]);
      // intersections (clear lines) + crosswalks
      ROADS_V.forEach(function (x) { ROADS_H.forEach(function (y) {
        ctx.fillStyle = '#3c3f47'; ctx.fillRect(x - ROAD_W / 2, y - ROAD_W / 2, ROAD_W, ROAD_W);
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        for (var c = -ROAD_W / 2 + 8; c < ROAD_W / 2 - 4; c += 14) {
          ctx.fillRect(x + c, y - ROAD_W / 2 - 16, 8, 14); ctx.fillRect(x + c, y + ROAD_W / 2 + 2, 8, 14);
          ctx.fillRect(x - ROAD_W / 2 - 16, y + c, 14, 8); ctx.fillRect(x + ROAD_W / 2 + 2, y + c, 14, 8);
        }
      }); });

      // parking zones
      DESTS.forEach(function (d) {
        var pulse = 0.5 + Math.sin(t * 3) * 0.5, isNear = near === d;
        ctx.fillStyle = isNear ? 'rgba(10,132,255,.35)' : 'rgba(255,255,255,' + (0.12 + pulse * 0.12) + ')';
        ctx.strokeStyle = isNear ? '#0a84ff' : 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]);
        rr(d.door[0] - 44, d.door[1] - 22, 88, 44, 10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '700 14px -apple-system, system-ui, sans-serif'; ctx.fillText('P', d.door[0], d.door[1] + 5);
      });

      // buildings
      BUILDINGS.forEach(function (b) {
        if (b.x > view.x + view.w || b.x + b.w < view.x || b.y > view.y + view.h || b.y + b.h < view.y) return;
        ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(b.x + 8, b.y + 8, b.w, b.h);
        ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = b.roof || 'rgba(0,0,0,.12)'; ctx.fillRect(b.x + 6, b.y + 6, b.w - 12, b.h - 12);
        if (!b.dest) { ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(b.x + b.w / 2 - 6, b.y + b.h / 2 - 6, 12, 12); return; }
        var d = b.dest;
        if (d.app === 'about') { ctx.fillStyle = '#f7f2e6'; for (var p = 0; p < 7; p++) ctx.fillRect(d.x + 20 + p * ((d.w - 40) / 6) - 6, d.y + d.h - 26, 12, 22); }
        ctx.font = '44px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(d.emoji, d.x + d.w / 2, d.y + d.h / 2 + 4);
        ctx.font = '700 17px -apple-system, system-ui, sans-serif';
        var tw = ctx.measureText(d.name).width + 18;
        ctx.fillStyle = 'rgba(0,0,0,.6)'; rr(d.x + d.w / 2 - tw / 2, d.y + d.h / 2 + 18, tw, 26, 13); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText(d.name, d.x + d.w / 2, d.y + d.h / 2 + 37);
      });

      // trees
      TREES.forEach(function (tr) {
        if (tr.x < view.x - 30 || tr.x > view.x + view.w + 30 || tr.y < view.y - 30 || tr.y > view.y + view.h + 30) return;
        ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.arc(tr.x + 5, tr.y + 5, tr.r, 0, 7); ctx.fill();
        ctx.fillStyle = tr.park ? '#4c9a48' : '#5aa553'; ctx.beginPath(); ctx.arc(tr.x, tr.y, tr.r, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.arc(tr.x - tr.r / 3, tr.y - tr.r / 3, tr.r / 2.5, 0, 7); ctx.fill();
      });
      ctx.fillStyle = '#fff'; ctx.font = '700 20px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(0,0,0,.55)'; rr(PARK.x + PARK.w / 2 - 80, PARK.y + 14, 160, 30, 15); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(PARK.name, PARK.x + PARK.w / 2, PARK.y + 35);

      // car (yellow cab)
      ctx.save(); ctx.translate(car.x, car.y); ctx.rotate(car.a);
      ctx.fillStyle = 'rgba(0,0,0,.3)'; rr(-22, -10, 48, 26, 7); ctx.fill();
      ctx.fillStyle = '#f7c325'; rr(-24, -13, 48, 26, 7); ctx.fill();
      ctx.fillStyle = '#26303d'; rr(4, -10, 10, 20, 3); ctx.fill(); rr(-16, -10, 8, 20, 3); ctx.fill();
      ctx.fillStyle = '#fff'; rr(-6, -5, 10, 10, 2); ctx.fill();
      ctx.fillStyle = '#111'; ctx.font = '700 6px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('AJ', -1, 2.5);
      ctx.fillStyle = '#fff6c0'; ctx.fillRect(22, -11, 3, 6); ctx.fillRect(22, 5, 3, 6);
      ctx.fillStyle = '#d33'; ctx.fillRect(-25, -11, 2, 5); ctx.fillRect(-25, 6, 2, 5);
      ctx.restore();

      // off-screen destination markers
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      DESTS.forEach(function (d) {
        var sx = (d.door[0] - view.x) * scale, sy = (d.door[1] - view.y) * scale;
        if (sx > 0 && sx < vw && sy > 0 && sy < vh) return;
        var ang = Math.atan2(sy - vh / 2, sx - vw / 2), m = 28;
        var ex = Math.max(m, Math.min(vw - m, vw / 2 + Math.cos(ang) * vw)), ey = Math.max(m + 40, Math.min(vh - m - 10, vh / 2 + Math.sin(ang) * vh));
        ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.arc(ex, ey, 17, 0, 7); ctx.fill();
        ctx.font = '18px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; ctx.textAlign = 'center'; ctx.fillText(d.emoji, ex, ey + 6);
      });
    }

    function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      step(dt); draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    canvas.tabIndex = 0; setTimeout(function () { try { canvas.focus({ preventScroll: true }); } catch (e) { } }, 50);

    return {
      destroy: function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
        root.innerHTML = '';
      }
    };
  };
})();
