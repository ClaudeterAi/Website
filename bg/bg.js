/* Homepage ambient video background. Picks one file per device, starts as
   soon as the DOM is ready (not after the heavy 3D scene loads), and if the
   browser blocks autoplay (Low Power Mode, Safari "Never Auto-Play") it
   starts on the visitor's first tap, click or key press. Stays off for
   prefers-reduced-motion, Save-Data and 2G: those keep the poster. */
(() => {
  const host = document.querySelector('.site-bg');
  if (!host) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const net = navigator.connection || {};
  if (reduce.matches || net.saveData || /(^|-)2g$/.test(net.effectiveType || '')) return;

  const v = document.createElement('video');
  v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
  v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('autoplay', ''); v.setAttribute('aria-hidden', 'true');
  v.disablePictureInPicture = true; v.preload = 'auto';
  const small = Math.min(innerWidth, screen.width || innerWidth) < 900;
  const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  const webm = !small && !safari && v.canPlayType('video/webm; codecs="vp9"') === 'probably';
  v.src = small ? '/bg/bg-v1-720.mp4' : webm ? '/bg/bg-v1-1080.webm' : '/bg/bg-v2-1080.mp4';

  const show = () => v.classList.add('on');
  v.addEventListener('playing', show, { once: true });
  v.addEventListener('timeupdate', () => { if (v.currentTime > 0) show(); });

  const gestures = ['pointerdown', 'touchend', 'keydown'];
  const onGesture = () => { gestures.forEach(g => removeEventListener(g, onGesture, true)); play(); };
  const play = () => {
    const p = v.play();
    if (p && p.catch) p.catch(() => gestures.forEach(g => addEventListener(g, onGesture, { capture: true, passive: true })));
  };
  host.appendChild(v);
  play();
  document.addEventListener('visibilitychange', () => (document.hidden ? v.pause() : play()));
  if (reduce.addEventListener) reduce.addEventListener('change', e => { if (e.matches) { v.pause(); v.classList.remove('on'); } });
})();

/* Homepage client stories on phones: position dots and a counter for the
   swipe row (the row itself is pure CSS scroll-snap, see bg.css). */
(() => {
  const row = document.querySelector('.stories.eleven');
  if (!row) return;
  const cards = [...row.querySelectorAll('.story')];
  const dots = document.createElement('div'); dots.className = 'stories-dots';
  const count = document.createElement('p'); count.className = 'stories-count'; count.setAttribute('aria-live', 'polite');
  row.setAttribute('role', 'region'); row.setAttribute('aria-label', 'Client stories, swipe for more'); row.tabIndex = 0;
  const go = i => cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  cards.forEach((c, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Show story ${i + 1} of ${cards.length}`);
    b.addEventListener('click', () => go(i)); dots.appendChild(b);
  });
  row.after(dots); dots.after(count);
  const set = i => {
    [...dots.children].forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    count.textContent = `${i + 1} / ${cards.length}`;
  };
  set(0);
  // active card = the one whose centre is closest to the row's centre
  let raf = 0, last = -1;
  const update = () => {
    raf = 0;
    const r = row.getBoundingClientRect(), mid = r.left + r.width / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, k) => { const b = c.getBoundingClientRect(); const d = Math.abs(b.left + b.width / 2 - mid); if (d < dist) { dist = d; best = k; } });
    if (best !== last) { last = best; set(best); }
  };
  row.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update, { passive: true });
})();
