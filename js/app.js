// Nebula Host — version statique (GitHub Pages)
// La liste des sites vient de sites.json, généré automatiquement par la GitHub Action.
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (b) => { const u = ['o', 'Ko', 'Mo', 'Go']; let i = 0; while (b >= 1024 && i < 3) { b /= 1024; i++; } return (i ? b.toFixed(1) : b) + ' ' + u[i]; };
function ago(t) {
  const s = (Date.now() - t) / 1000;
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 86400 * 30) return `il y a ${Math.floor(s / 86400)} j`;
  return new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const base = new URL('.', location.href);
const siteUrl = (name) => new URL(`sites/${encodeURIComponent(name)}/`, base).href;
const shortUrl = (name) => siteUrl(name).replace(/^https?:\/\//, '').replace(/\/$/, '');

let data = { sites: [] };

async function load() {
  try {
    const r = await fetch('sites.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    data = await r.json();
  } catch {
    data = { sites: [] };
  }
  $('builtAt').textContent = data.builtAt ? ago(data.builtAt) : '—';
  const link = $('uploadLink');
  if (data.repo) link.href = `https://github.com/${data.repo}/upload/${data.branch || 'main'}/sites`;
  else link.hidden = true;
  $('exampleUrl').textContent = shortUrl('mon-site') + '/';
  render();
}

function render() {
  const sites = data.sites || [];
  const q = $('q').value.toLowerCase().trim();
  const list = sites.filter((s) => `${s.title} ${s.name} ${s.description || ''}`.toLowerCase().includes(q));
  $('sCount').textContent = sites.length;
  $('sFiles').textContent = sites.reduce((a, s) => a + s.files, 0);
  $('sSize').textContent = fmt(sites.reduce((a, s) => a + s.size, 0));

  if (!sites.length) {
    $('grid').innerHTML = `<div class="blank"><div style="font-size:40px">🚀</div><h3>Aucun site pour l'instant</h3><p>Ajoute le dossier de ton premier site sur GitHub, il apparaîtra ici.</p><button class="btn primary" type="button" data-action="add">Ajouter un site</button></div>`;
    return;
  }
  if (!list.length) { $('grid').innerHTML = `<div class="blank">Aucun résultat pour « ${esc(q)} »</div>`; return; }

  $('grid').innerHTML = list.map((s) => {
    const url = esc(siteUrl(s.name));
    return `
    <article class="card">
      <div class="thumb">
        ${s.hasIndex ? `<iframe src="${url}" loading="lazy" tabindex="-1" title="Aperçu de ${esc(s.title)}" sandbox="allow-scripts allow-same-origin"></iframe>` : `<div class="empty">Pas de index.html</div>`}
        <a href="${url}" target="_blank" rel="noopener" aria-label="Ouvrir ${esc(s.title)}"></a>
      </div>
      <div class="card-body">
        <div class="card-title"><h3>${esc(s.title)}</h3><span class="pill ${s.hasIndex ? '' : 'off'}">${s.hasIndex ? 'En ligne' : 'Incomplet'}</span></div>
        <a class="url" href="${url}" target="_blank" rel="noopener">${esc(shortUrl(s.name))}</a>
        ${s.description ? `<div class="desc">${esc(s.description)}</div>` : ''}
        <div class="meta"><span>${s.files} fichiers</span><span>${fmt(s.size)}</span>${s.updated ? `<span>Modifié ${ago(s.updated)}</span>` : ''}</div>
        <div class="actions"><a class="btn sm" href="${url}" target="_blank" rel="noopener">Visiter ↗</a></div>
      </div>
    </article>`;
  }).join('');
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'add') $('ov').classList.add('open');
  if (el.dataset.action === 'close') $('ov').classList.remove('open');
});
$('ov').addEventListener('click', (e) => { if (e.target === $('ov')) $('ov').classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('ov').classList.remove('open'); });
$('q').addEventListener('input', render);
load();
