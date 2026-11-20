// Génère sites.json à partir des dossiers de sites/.
// Lancé automatiquement par la GitHub Action ; en local : node scripts/build-sites.mjs
//
// Titre d'un site : sites/<nom>/site.json {"title","description"} s'il existe,
// sinon la balise <title> de son index.html, sinon le nom du dossier.
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITES = join(ROOT, 'sites');

function walk(dir) {
  let files = 0, size = 0, mtime = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { const r = walk(p); files += r.files; size += r.size; mtime = Math.max(mtime, r.mtime); }
    else if (e.isFile()) { const s = statSync(p); files++; size += s.size; mtime = Math.max(mtime, s.mtimeMs); }
  }
  return { files, size, mtime };
}

// Date du dernier commit qui touche ce dossier (plus fiable que la date des fichiers en CI)
function lastCommit(rel) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%ct', '--', rel], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out ? Number(out) * 1000 : 0;
  } catch { return 0; }
}

function readMeta(dir, name) {
  let meta = {};
  try { meta = JSON.parse(readFileSync(join(dir, 'site.json'), 'utf8')); } catch {}
  let title = typeof meta.title === 'string' ? meta.title : '';
  if (!title) {
    try {
      const m = /<title[^>]*>([^<]*)<\/title>/i.exec(readFileSync(join(dir, 'index.html'), 'utf8'));
      if (m) title = m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();
    } catch {}
  }
  return {
    title: (title || name).slice(0, 80),
    description: typeof meta.description === 'string' ? meta.description.slice(0, 200) : '',
  };
}

const sites = existsSync(SITES)
  ? readdirSync(SITES, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => {
        const dir = join(SITES, e.name);
        const { files, size, mtime } = walk(dir);
        return {
          name: e.name,
          ...readMeta(dir, e.name),
          hasIndex: existsSync(join(dir, 'index.html')),
          files, size,
          updated: lastCommit(`sites/${e.name}`) || Math.round(mtime),
        };
      })
      .sort((a, b) => b.updated - a.updated)
  : [];

const out = {
  repo: process.env.GITHUB_REPOSITORY || null,
  branch: process.env.GITHUB_REF_NAME || 'main',
  builtAt: Date.now(),
  sites,
};
writeFileSync(join(ROOT, 'sites.json'), JSON.stringify(out, null, 2));
console.log(`sites.json : ${sites.length} site(s)`);
