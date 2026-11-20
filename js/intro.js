// Animation d'entrée « Rayan's workspace »
// Jouée à chaque ouverture de la page. Clic, touche ou toucher pour passer.
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;

  // Découpe les mots en lettres animées une à une
  const words = [['Rayan’s', 'first'], ['workspace', 'second']];
  const from = [124, 92, 255], to = [34, 211, 238]; // violet → cyan
  const title = intro.querySelector('.intro-title');
  let i = 0;
  words.forEach(([word, cls]) => {
    const w = document.createElement('span');
    w.className = 'intro-word ' + cls;
    [...word].forEach((c, k) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.style.setProperty('--i', i++);
      if (cls === 'second') {
        const t = word.length > 1 ? k / (word.length - 1) : 0;
        s.style.color = `rgb(${from.map((v, j) => Math.round(v + (to[j] - v) * t)).join(',')})`;
      }
      w.append(s);
    });
    title.append(w);
  });
  title.setAttribute('aria-label', "Rayan's workspace");
  document.body.classList.add('intro-on');

  let done = false;
  function leave() {
    if (done) return;
    done = true;
    intro.classList.add('out');
    document.body.classList.remove('intro-on');
    document.body.classList.add('revealing');
    document.querySelectorAll('.card').forEach((c, n) => c.style.setProperty('--n', n));
    setTimeout(() => { intro.remove(); document.body.classList.remove('revealing'); }, 1600);
  }

  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(leave, reduce ? 900 : 3000);
  intro.addEventListener('click', leave);
  window.addEventListener('keydown', leave, { once: true });
  intro.addEventListener('touchstart', leave, { passive: true });
})();
