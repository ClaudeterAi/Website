/* Site-wide ambient video background: picks one file, starts after the page
   has loaded so it never competes with first paint, and stays off for
   reduced-motion, Save-Data and 2G visitors (they keep the poster). */
(() => {
  const host = document.querySelector('.site-bg');
  if (!host) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const net = navigator.connection || {};
  if (reduce.matches || net.saveData || /(^|-)2g$/.test(net.effectiveType || '')) return;

  const start = () => {
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.disablePictureInPicture = true; v.preload = 'auto';
    const small = Math.min(innerWidth, screen.width || innerWidth) < 900;
    const webm = !small && v.canPlayType('video/webm; codecs="vp9"') === 'probably' && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    v.src = small ? '/bg/bg-v1-720.mp4' : webm ? '/bg/bg-v1-1080.webm' : '/bg/bg-v1-1080.mp4';
    const show = () => v.classList.add('on');
    v.addEventListener('playing', show, { once: true });
    v.addEventListener('timeupdate', () => { if (v.currentTime > 0) show(); });
    host.appendChild(v);
    const play = () => { const p = v.play(); if (p) p.catch(() => {}); };
    play();
    document.addEventListener('visibilitychange', () => (document.hidden ? v.pause() : play()));
    reduce.addEventListener && reduce.addEventListener('change', e => { if (e.matches) { v.pause(); v.classList.remove('on'); } });
  };
  if (document.readyState === 'complete') setTimeout(start, 0);
  else addEventListener('load', () => setTimeout(start, 0), { once: true });
})();
