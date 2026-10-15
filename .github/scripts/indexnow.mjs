// Submits changed site URLs to IndexNow after the Vercel Production deploy is live.
// Node built-ins only. Run by .github/workflows/indexnow.yml, or locally with
// --before <sha> --after <sha> | --full <rev>, plus --dry-run.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const HOST = 'www.knetixmarketing.com';
export const ORIGIN = 'https://www.knetixmarketing.com';
export const KEY = '1494f227c88e0c47afe15734bfde3105';
export const KEY_LOCATION = ORIGIN + '/' + KEY + '.txt';
export const ENDPOINT = 'https://api.indexnow.org/indexnow';
export const DEADLINE_MS = 15 * 60 * 1000;
export const POLL_MS = 15000;

const HTML_RE = /\.html?$/i;
const FULL_MODE_HINT = 'Run the workflow manually (workflow_dispatch) with mode full.';

function git(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const defaultNow = () => Date.now();

// ---------- git helpers ----------

export function gitShow(cwd, rev, path) {
  try {
    return git(cwd, ['show', rev + ':' + path]);
  } catch {
    return null;
  }
}

export function resolveCommit(cwd, rev) {
  return git(cwd, ['rev-parse', '--verify', rev + '^{commit}']).trim();
}

export function changedFiles(cwd, before, after) {
  if (!before || /^0+$/.test(before)) {
    throw new Error(
      'No usable "before" commit (' + before + '): this push created the branch or has no parent. ' + FULL_MODE_HINT
    );
  }
  try {
    git(cwd, ['cat-file', '-e', before + '^{commit}']);
  } catch {
    throw new Error(
      'The "before" commit ' + before + ' is not in the clone (force push or missing history). ' + FULL_MODE_HINT
    );
  }
  const out = git(cwd, ['diff', '-z', '--name-status', '-M', before, after]);
  const tokens = out.split('\0');
  if (tokens.length && tokens[tokens.length - 1] === '') tokens.pop();

  const changed = [];
  const deleted = [];
  const addChanged = (p) => { if (HTML_RE.test(p)) changed.push(p); };
  const addDeleted = (p) => { if (HTML_RE.test(p)) deleted.push(p); };

  let i = 0;
  while (i < tokens.length) {
    const status = tokens[i++];
    const kind = status.charAt(0);
    if (kind === 'R' || kind === 'C') {
      const from = tokens[i++];
      const to = tokens[i++];
      if (kind === 'R') addDeleted(from);
      addChanged(to);
    } else {
      const p = tokens[i++];
      if (kind === 'A' || kind === 'M' || kind === 'T') addChanged(p);
      else if (kind === 'D') addDeleted(p);
    }
  }
  return { changed, deleted };
}

// ---------- HTML and sitemap parsing ----------

function decodeAmp(s) {
  return s.replace(/&amp;/gi, '&');
}

// Backup noindex scan only. Two meta matchers: plain (a quoted '>' ends the tag
// early) and quote-aware (a stray quote swallows later tags).
const TAG_RES = [
  { meta: /<meta\b[^>]*>/gi },
  { meta: /<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi },
];

// Includes the abrupt <!--> and <!---> forms. An unterminated comment is left in
// place and scanned, which fails closed.
const stripComments = (s) => s.replace(/<!--(?:>|->|[\s\S]*?--!?>)/g, '');
const stripScripts = (s) => s.replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, '');

function parseAttrs(tag) {
  const attrs = {};
  const re = /([^\s=/<>"']+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let m;
  while ((m = re.exec(tag)) !== null) {
    const name = m[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

export function parseSitemap(xml) {
  const set = new Set();
  const re = /<loc>([\s\S]*?)<\/loc>/gi;
  let m;
  while ((m = re.exec(xml || '')) !== null) {
    const loc = decodeAmp(m[1].trim());
    if (loc) set.add(loc);
  }
  return set;
}

// Robots meta names that can carry noindex for an IndexNow engine, and the
// separators accepted between directives (';' is not documented but fails closed).
const ROBOT_NAMES = new Set(['robots', 'googlebot', 'bingbot', 'msnbot', 'yandex']);
const ROBOTS_SPLIT = /[\s,;/]+/;

function scanNoindex(src, res) {
  for (const tag of src.match(res.meta) || []) {
    const a = parseAttrs(tag);
    const name = decodeRefs((a.name || '').trim()).value.toLowerCase();
    if (!ROBOT_NAMES.has(name)) continue;
    const tokens = decodeRefs(a.content || '').value.toLowerCase().split(ROBOTS_SPLIT);
    if (tokens.includes('noindex') || tokens.includes('none')) return true;
  }
  return false;
}

// Elements whose content is text, not markup, in an HTML document.
const RAW_TEXT = new Set(['script', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'title', 'textarea']);
// Elements whose content a browser does not apply (inert, or text when scripting is on).
const INERT = new Set(['template', 'noscript']);
const isAlpha = (ch) => /[A-Za-z]/.test(ch);
const isSpace = (ch) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f';

const NAMED_REFS = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", comma: ',', sol: '/', colon: ':', semi: ';',
  period: '.', excl: '!', num: '#', equals: '=', lowbar: '_', nbsp: '\u00a0', Tab: '\t', NewLine: '\n',
};

// Decodes character references in an attribute value. unknown is true if any
// named reference is not in the table; callers treat that strictly.
function decodeRefs(v) {
  let unknown = false;
  const value = v.replace(/&(#[xX][0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);?/g, (m, ref) => {
    if (ref[0] === '#') {
      const cp = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      try { return String.fromCodePoint(cp); } catch { unknown = true; return m; }
    }
    if (Object.hasOwn(NAMED_REFS, ref)) return NAMED_REFS[ref];
    unknown = true;
    return m;
  });
  return { value, unknown };
}

// Minimal tokenizer following browser rules for comments, attribute quoting and
// raw-text elements, so '<!--' inside an attribute or a <title> is not a comment.
// Anything unterminated sets malformed; the caller then skips the page.
// noscriptRaw treats <noscript> content as text, as browsers do with scripting on.
export function tokenizeTags(src, noscriptRaw = false) {
  const tags = [];
  const n = src.length;
  const inert = { template: 0, noscript: 0 };
  let afterBody = false;
  let i = 0;
  while (i < n) {
    const lt = src.indexOf('<', i);
    if (lt < 0) break;
    i = lt;
    if (src.startsWith('<!--', i)) {
      if (src.startsWith('<!-->', i)) { i += 5; continue; }
      if (src.startsWith('<!--->', i)) { i += 6; continue; }
      const m = /--!?>/g;
      m.lastIndex = i + 4;
      const end = m.exec(src);
      if (!end) return { tags, malformed: 'unterminated comment' };
      i = end.index + end[0].length;
      continue;
    }
    if (src[i + 1] === '!' || src[i + 1] === '?' || (src[i + 1] === '/' && !isAlpha(src[i + 2] || ''))) {
      const gt = src.indexOf('>', i + 2);
      if (gt < 0) return { tags, malformed: 'unterminated markup declaration' };
      i = gt + 1;
      continue;
    }
    const closing = src[i + 1] === '/';
    const start = i + (closing ? 2 : 1);
    if (!isAlpha(src[start] || '')) { i++; continue; }
    let j = start;
    while (j < n && !isSpace(src[j]) && src[j] !== '/' && src[j] !== '>') j++;
    const name = src.slice(start, j).toLowerCase();
    const attrs = {};
    const unknown = {};
    let done = false;
    while (j < n) {
      while (j < n && (isSpace(src[j]) || src[j] === '/')) j++;
      if (j >= n) break;
      if (src[j] === '>') { j++; done = true; break; }
      let k = j + 1;
      while (k < n && !isSpace(src[k]) && src[k] !== '/' && src[k] !== '>' && src[k] !== '=') k++;
      const an = src.slice(j, k).toLowerCase();
      j = k;
      while (j < n && isSpace(src[j])) j++;
      let value = '';
      if (src[j] === '=') {
        j++;
        while (j < n && isSpace(src[j])) j++;
        const q = src[j];
        if (q === '"' || q === "'") {
          const close = src.indexOf(q, j + 1);
          if (close < 0) return { tags, malformed: 'unterminated attribute value' };
          value = src.slice(j + 1, close);
          j = close + 1;
        } else {
          let k2 = j;
          while (k2 < n && !isSpace(src[k2]) && src[k2] !== '>') k2++;
          value = src.slice(j, k2);
          j = k2;
        }
      }
      if (!closing && !Object.hasOwn(attrs, an)) {
        const d = decodeRefs(value);
        attrs[an] = d.value;
        unknown[an] = d.unknown;
      }
    }
    if (!done) return { tags, malformed: 'unterminated tag' };
    i = j;
    if (closing) {
      if (INERT.has(name) && inert[name] > 0) inert[name]--;
      continue;
    }
    if (name === 'plaintext') return { tags, malformed: 'plaintext element' };
    if (name === 'body') afterBody = true;
    tags.push({ name, attrs, unknown, inert: inert.template + inert.noscript > 0, afterBody });
    if (INERT.has(name)) inert[name]++;
    if (RAW_TEXT.has(name) || (noscriptRaw && name === 'noscript')) {
      const re = new RegExp('</' + name + '(?=[\\s/>])', 'gi');
      re.lastIndex = i;
      const end = re.exec(src);
      if (!end) return { tags, malformed: 'unterminated ' + name + ' element' };
      i = end.index;
    }
  }
  return { tags, malformed: null };
}

// An unknown character reference in the name or content of a robots-like meta
// counts as noindex, so the check fails closed.
const robotsNoindex = (t) => {
  const name = (t.attrs.name || '').trim().toLowerCase();
  if (!ROBOT_NAMES.has(name) && !t.unknown.name) return false;
  const tokens = (t.attrs.content || '').toLowerCase().split(ROBOTS_SPLIT);
  return tokens.includes('noindex') || tokens.includes('none') || Boolean(t.unknown.content);
};

function analyze(src, noscriptRaw) {
  let { tags, malformed } = tokenizeTags(src, noscriptRaw);
  const canonicals = [];
  let noindex = false;
  for (const t of tags) {
    // HTML splits rel on ASCII whitespace only.
    const rels = (t.attrs.rel || '').toLowerCase().split(/[\t\n\f\r ]+/);
    if (t.name === 'link' && (rels.includes('canonical') || t.unknown.rel)) {
      canonicals.push((t.attrs.href || '').trim());
      if (!malformed && t.inert) malformed = 'canonical inside template or noscript';
      if (!malformed && t.afterBody) malformed = 'canonical after <body>';
    }
    if (t.name === 'meta' && robotsNoindex(t)) noindex = true;
  }
  return { canonicals, noindex, malformed };
}

// The tokenizer is the source of truth for canonicals and noindex. It runs twice,
// with <noscript> as markup and as text; noindex if either pass sees it, and the
// canonicals must match. The regex scans can only ADD a noindex finding.
// Commented-out markup is ignored, so the template's HOW TO USE comment does not
// block posts built from it. A canonical inside template/noscript or after <body>
// is not applied by browsers or search engines, so it marks the page malformed.
export function pageInfo(html) {
  const src = String(html);
  const a = analyze(src, false);
  const b = analyze(src, true);
  let noindex = a.noindex || b.noindex;
  let malformed = a.malformed || b.malformed;
  if (!malformed && JSON.stringify(a.canonicals) !== JSON.stringify(b.canonicals)) {
    malformed = 'canonicals differ when noscript is read as text';
  }
  const variants = [stripComments(src), stripComments(stripScripts(src)), stripScripts(stripComments(src))];
  for (const v of variants) for (const res of TAG_RES) if (scanNoindex(v, res)) noindex = true;
  return { canonicals: a.canonicals, noindex, malformed };
}

export function eligibleUrl(html, sitemapSet) {
  if (html === null || html === undefined) return { skip: 'file not present' };
  const { canonicals, noindex, malformed } = pageInfo(html);
  if (noindex) return { skip: 'robots meta noindex' };
  if (malformed) return { skip: 'malformed markup: ' + malformed };
  if (canonicals.length !== 1) return { skip: 'expected 1 canonical, found ' + canonicals.length };
  const url = canonicals[0];
  if (!url.startsWith(ORIGIN + '/')) return { skip: 'canonical not on ' + ORIGIN + ': ' + url };
  if (!sitemapSet.has(url)) return { skip: 'canonical not in sitemap.xml: ' + url };
  return { url };
}

// ---------- URL computation ----------

export function computeChangedUrls(cwd, before, after) {
  const files = changedFiles(cwd, before, after);
  const afterMap = parseSitemap(gitShow(cwd, after, 'sitemap.xml') || '');
  const beforeMap = parseSitemap(gitShow(cwd, before, 'sitemap.xml') || '');
  const changed = new Set();
  const deleted = new Set();
  const skipped = [];

  for (const path of files.changed) {
    const r = eligibleUrl(gitShow(cwd, after, path), afterMap);
    if (r.url) changed.add(r.url);
    else skipped.push({ path, reason: r.skip });
  }
  for (const path of files.deleted) {
    const r = eligibleUrl(gitShow(cwd, before, path), beforeMap);
    if (r.url) deleted.add(r.url);
    else skipped.push({ path, reason: r.skip });
  }
  for (const url of changed) deleted.delete(url);

  return {
    changed: [...changed],
    deleted: [...deleted],
    skipped,
    htmlFiles: files.changed.length + files.deleted.length,
  };
}

export function computeFullUrls(cwd, rev) {
  const sitemap = parseSitemap(gitShow(cwd, rev, 'sitemap.xml') || '');
  const files = git(cwd, ['ls-tree', '-r', '-z', '--name-only', rev])
    .split('\0')
    .filter((p) => p && HTML_RE.test(p));
  const byUrl = new Map();
  const skipped = [];

  for (const path of files) {
    const r = eligibleUrl(gitShow(cwd, rev, path), sitemap);
    if (r.url) {
      if (!byUrl.has(r.url)) byUrl.set(r.url, path);
    } else {
      skipped.push({ path, reason: r.skip });
    }
  }
  const changed = [];
  for (const loc of sitemap) {
    if (byUrl.has(loc)) changed.push(loc);
    else skipped.push({ path: loc, reason: 'sitemap URL has no eligible HTML file' });
  }
  return { changed, deleted: [], skipped, htmlFiles: files.length };
}

// ---------- network gates ----------

function ghHeaders(token) {
  const h = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) h.Authorization = 'Bearer ' + token;
  return h;
}

async function ghGet(fetchImpl, url, token) {
  const res = await fetchImpl(url, { headers: ghHeaders(token) });
  if (res.status < 200 || res.status > 299) {
    const text = await res.text().catch(() => '');
    throw new Error('GitHub API ' + res.status + ' for ' + url + ': ' + text.slice(0, 200));
  }
  return res.json();
}

export async function waitForDeploy({
  repo,
  sha,
  token,
  fetchImpl = globalThis.fetch,
  sleep = defaultSleep,
  now = defaultNow,
  deadline,
}) {
  const end = deadline ?? now() + DEADLINE_MS;
  const listUrl =
    'https://api.github.com/repos/' + repo + '/deployments?sha=' + encodeURIComponent(sha) +
    '&environment=Production&per_page=100';
  let poll = 0;

  for (;;) {
    poll++;
    let failed = null;
    try {
      const all = await ghGet(fetchImpl, listUrl, token);
      const candidates = (Array.isArray(all) ? all : []).filter(
        (d) => d && d.environment === 'Production' && d.creator && d.creator.login === 'vercel[bot]' && d.sha === sha
      );
      const newest = [];
      let ok = null;
      for (const d of candidates) {
        let statuses;
        try {
          statuses = await ghGet(
            fetchImpl,
            'https://api.github.com/repos/' + repo + '/deployments/' + d.id + '/statuses?per_page=100',
            token
          );
        } catch (err) {
          console.log('  deployment ' + d.id + ': ' + err.message);
          newest.push(null);
          continue;
        }
        const list = (Array.isArray(statuses) ? statuses : []).slice().sort((a, b) => (b.id || 0) - (a.id || 0));
        // Judge by the newest status that is not inactive. GitHub can add inactive
        // statuses to a superseded deployment; that does not undo an earlier success.
        const active = list.filter((s) => s.state !== 'inactive');
        const top = active.length ? active[0].state : null;
        if (top === 'success') ok = d.id;
        newest.push(top);
      }
      console.log(
        'Deploy poll ' + poll + ': ' + candidates.length + ' Production deployment(s) for ' + sha +
          (newest.length ? ' [' + newest.map((s) => s || 'no status').join(', ') + ']' : '')
      );
      if (ok !== null) {
        console.log('Production deployment ' + ok + ' reported success.');
        return ok;
      }
      if (newest.length > 0 && newest.every((s) => s === 'failure' || s === 'error')) {
        failed = 'Production deployment for ' + sha + ' failed (' + newest.join(', ') + '); nothing was submitted.';
      }
    } catch (err) {
      console.log('Deploy poll ' + poll + ': ' + err.message);
    }
    if (failed) throw new Error(failed);
    const remaining = end - now();
    if (remaining <= 0) {
      throw new Error(
        'The Production deployment for ' + sha + ' never reported success within 15 minutes and nothing was submitted.'
      );
    }
    await sleep(Math.min(POLL_MS, remaining));
  }
}

export async function waitForLive({
  changed,
  deleted,
  fetchImpl = globalThis.fetch,
  sleep = defaultSleep,
  now = defaultNow,
  deadline,
}) {
  const end = deadline ?? now() + DEADLINE_MS;
  const pending = new Map();
  for (const url of changed) pending.set(url, { kind: 'changed', last: 'not checked' });
  for (const url of deleted) pending.set(url, { kind: 'deleted', last: 'not checked' });
  const robotsSkipped = new Set();
  let round = 0;

  for (;;) {
    round++;
    for (const [url, entry] of pending) {
      try {
        const res = await fetchImpl(url, { redirect: 'manual', headers: { 'Cache-Control': 'no-cache' } });
        if (res.body && typeof res.body.cancel === 'function') await res.body.cancel().catch(() => {});
        entry.last = res.status;
        if (entry.kind === 'changed') {
          if (res.status === 200) {
            const xr = res.headers.get('x-robots-tag') || '';
            if (/\b(noindex|none)\b/i.test(xr)) {
              robotsSkipped.add(url);
              console.log('  skip ' + url + ': X-Robots-Tag "' + xr + '"');
            }
            pending.delete(url);
          }
        } else if ([404, 410, 301, 308].includes(res.status)) {
          pending.delete(url);
        }
      } catch (err) {
        entry.last = 'error: ' + err.message;
      }
    }
    console.log('Live check ' + round + ': ' + pending.size + ' URL(s) not yet in the expected state.');
    if (pending.size === 0) break;
    const remaining = end - now();
    if (remaining <= 0) {
      const lines = [...pending].map(
        ([url, e]) => url + ' (' + e.kind + ', last status ' + e.last + ')'
      );
      throw new Error('URLs did not reach the expected state before the deadline: ' + lines.join('; '));
    }
    await sleep(Math.min(POLL_MS, remaining));
  }
  return changed.filter((u) => !robotsSkipped.has(u)).concat(deleted);
}

export async function checkKey({ fetchImpl = globalThis.fetch } = {}) {
  const res = await fetchImpl(KEY_LOCATION, { redirect: 'manual', headers: { 'Cache-Control': 'no-cache' } });
  const body = await res.text();
  if (res.status !== 200 || body !== KEY) {
    throw new Error(
      'Key file check failed at ' + KEY_LOCATION + ': status ' + res.status + ', body ' + JSON.stringify(body.slice(0, 80))
    );
  }
  console.log('Key file verified at ' + KEY_LOCATION);
}

export async function submit({ urls, fetchImpl = globalThis.fetch }) {
  const res = await fetchImpl(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });
  const text = await res.text().catch(() => '');
  console.log('IndexNow response: HTTP ' + res.status + (text ? ' ' + text.slice(0, 500) : ''));
  switch (res.status) {
    case 200:
      return;
    case 202:
      console.log('202 means the URLs were accepted and key validation is pending.');
      return;
    case 400:
      throw new Error('Bad request: invalid format');
    case 403:
      throw new Error('Forbidden: key not valid (key file not found or does not match)');
    case 422:
      throw new Error('Unprocessable: URLs do not belong to the host or key does not match the schema');
    case 429:
      throw new Error('Too many requests: potential spam, retry later');
    default:
      throw new Error('Unexpected IndexNow response status ' + res.status);
  }
}

// ---------- entry point ----------

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--before') out.before = argv[++i];
    else if (a === '--after') out.after = argv[++i];
    else if (a === '--full') out.full = argv[++i];
    else throw new Error('Unknown argument: ' + a);
  }
  return out;
}

async function main() {
  const env = process.env;
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const repo = env.GITHUB_REPOSITORY || 'mohamadaldossari/Knetix-Site';
  const token = env.GITHUB_TOKEN || '';
  const dryRun = args.dryRun || env.INPUT_DRY_RUN === 'true';
  const event = env.GITHUB_EVENT_NAME || '';

  // a) compute URLs (no network before step c)
  let result;
  let sha;
  let mode;
  if (args.full || args.before || args.after) {
    if (args.full) {
      mode = 'full';
      sha = resolveCommit(cwd, args.full);
      console.log('Mode: full at ' + sha);
      result = computeFullUrls(cwd, sha);
    } else {
      if (!args.before || !args.after) throw new Error('Changed mode needs both --before and --after.');
      mode = 'changed';
      sha = resolveCommit(cwd, args.after);
      console.log('Mode: changed ' + args.before + '..' + sha);
      result = computeChangedUrls(cwd, args.before, sha);
    }
  } else if (event === 'push') {
    const payload = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    mode = 'changed';
    if (!payload.after || /^0+$/.test(payload.after)) {
      throw new Error('Push event has no usable "after" commit (' + payload.after + '); nothing to submit.');
    }
    sha = payload.after;
    console.log('Mode: changed (push) ' + payload.before + '..' + sha);
    result = computeChangedUrls(cwd, payload.before, sha);
  } else if (event === 'workflow_dispatch') {
    const inputMode = env.INPUT_MODE || 'changed';
    if (inputMode !== 'full') {
      throw new Error('Mode "' + inputMode + '" is not supported on workflow_dispatch; run it with mode full.');
    }
    mode = 'full';
    sha = resolveCommit(cwd, env.GITHUB_SHA);
    console.log('Mode: full (workflow_dispatch) at ' + sha);
    result = computeFullUrls(cwd, sha);
  } else {
    throw new Error('Nothing to do: pass --before/--after or --full, or run from a push or workflow_dispatch event.');
  }

  // b) report
  if (mode === 'changed') console.log('Found ' + result.htmlFiles + ' changed HTML file(s)');
  else console.log('Found ' + result.htmlFiles + ' HTML file(s) at ' + sha);
  for (const u of result.changed) console.log('  changed: ' + u);
  for (const u of result.deleted) console.log('  deleted: ' + u);
  for (const s of result.skipped) console.log('  skipped: ' + s.path + ' (' + s.reason + ')');
  console.log(
    'Counts: ' + result.changed.length + ' changed, ' + result.deleted.length + ' deleted, ' +
      result.skipped.length + ' skipped'
  );

  // c) nothing to do
  if (result.changed.length + result.deleted.length === 0) {
    console.log('No eligible URLs to submit; exiting without a request.');
    return;
  }

  // d) and e) gates share one deadline; neither can be skipped
  const deadline = Date.now() + DEADLINE_MS;
  await waitForDeploy({ repo, sha, token, deadline });
  const urls = await waitForLive({ changed: result.changed, deleted: result.deleted, deadline });
  if (urls.length === 0) {
    console.log('No eligible URLs left after the live check; exiting without a request.');
    return;
  }

  // f) key file
  await checkKey({});

  // g) dry run stops here
  if (dryRun) {
    console.log('Dry run: would submit ' + urls.length + ' URL(s)');
    for (const u of urls) console.log('  ' + u);
    return;
  }

  // h) the only submit call
  await submit({ urls });
  console.log('Submitted ' + urls.length + ' URL(s) to IndexNow');
  for (const u of urls) console.log('  ' + u);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.log('IndexNow FAILED: ' + (err && err.message ? err.message : String(err)));
    process.exitCode = 1;
  });
}
