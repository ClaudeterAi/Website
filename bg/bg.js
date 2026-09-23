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
