# Knetix-Site agent rules

Public marketing site for KNETIX at https://www.knetixmarketing.com. This repo is PUBLIC on GitHub: anything committed is published permanently, and a later delete does not undo it.

Mohamad Aldossari is the product owner and final authority on every design, content and product decision. Decisions are locked once made unless he reopens them. Canadian English spelling.

## Workflow

- Plan mode first. Investigate and report, then propose a plan. No code until Mohamad approves it.
- One feature per commit. Stage by explicit path, never `git add -A` or `git add .`.
- Review the staged diff yourself before every commit. Commit only after Mohamad approves the staged diff, or when the prompt pre-approves that commit.
- Undo with `git revert`. Never `git reset` on shared history, never force-push.
- Pushing `main` deploys production. Push only when the prompt authorizes it, then run the post-deploy checks below.
- Never push any other branch or tag without being asked.

## Writing rules (code, comments, commit messages, page copy)

- No em dashes and no en dashes in new or edited code, comments, commit messages and page copy. No emojis.
- Existing em dashes in page titles and og tags stay until the repositioning commit rewrites those titles. Never rewrite titles unasked.
- No `Co-Authored-By` or any other attribution trailer in commits or PRs.
- Secrets are referenced by env var name only. Never print, commit or log a secret value. (The IndexNow key file is public by design and is the one exception.)

## The site

- Plain static HTML, CSS and JS. No build step, no framework, no bundler.
- Never run npm, npx or any package install inside this repo. No `package.json`, no `node_modules`. Tooling belongs in a scratch directory outside the project.
- Canonical host is `https://www.knetixmarketing.com`. The apex 308-redirects to www. Every canonical tag, og:url and sitemap entry uses www.
- `/index.html` 308-redirects to `/` (vercel.json). Internal links use `/` for the homepage.
- `blog-post-template.html` is a noindex template, never a real page. It stays out of sitemap.xml and is not deployed (listed in `.vercelignore`); the IndexNow script reads it from the repo and skips it.
- Design rules live in `.superdesign/design-system.md` (tracked, not deployed).
- SEO and publishing checklist lives in `SEO-AI-PLAYBOOK.md` (local only, gitignored, never commit it).

## Deploy discipline (.vercelignore)

- Vercel serves every file it is not told to ignore. Only public pages and assets may be served.
- Every dot-folder, dot-file and internal file that is not part of the live site is listed in `.vercelignore`. Today that is `.agents/`, `.claude/`, `.codex/`, `.gemini/`, `.github/`, `.impeccable/`, `.superdesign/`, `.gitignore`, `SEO-AI-PLAYBOOK.md`, `AGENTS.md`, `CLAUDE.md` and `blog-post-template.html`.
- Adding a new tool folder, config file or internal doc: add its `.vercelignore` line in the same commit, before or with the file, so there is no window in which it is served.
- Never ignore anything public: the public HTML pages, `tokens.css`, `motion.js`, `fonts/`, the images pages use (`knetixwhopbanner.png`, `phone-hero.webp`), favicons (`favicon.ico`, `favicon-96.png`, `favicon-192.png`, `apple-touch-icon.png`), `robots.txt`, `sitemap.xml`, `llms.txt`, or the IndexNow key file `1494f227c88e0c47afe15734bfde3105.txt`.
- The `phone-hero.png` source image lives in `.superdesign/brand/`, not at the root; pages use `phone-hero.webp`.
- `.claude/settings.local.json` is per-machine and gitignored. Never commit it.

## IndexNow (automatic, do not submit by hand)

- `.github/workflows/indexnow.yml` runs `.github/scripts/indexnow.mjs` on every push to `main`. It submits the push's changed and deleted pages to IndexNow (Bing and partners) only after the Vercel Production deployment for that commit reports success and every URL is live.
- A page is submitted only if it has no robots noindex, exactly one canonical on the www host, and its canonical is listed in `sitemap.xml`. A new page must be added to `sitemap.xml` or it will never be submitted.
- Pushes with no HTML changes log `Found 0 changed HTML file(s)` and exit cleanly. That is expected.
- Manual run: Actions, IndexNow, Run workflow, mode `full`, which submits every sitemap URL. To retry a failed push run, use Re-run jobs on that run.
- Never move the key into an env var or secret, never rename or edit the key file, never add a second key.
- Google Search Console Request Indexing is still manual for new pages.

## Self-verification

- Every change ends with real verification, reported with real output, never a manual checklist for Mohamad unless a check truly cannot be automated (say why).
- Local checks: any local server binds to 127.0.0.1 only. Stop it by the PID or the port you started it on.
- Never kill processes by image name or pattern. Kill only by specific PID or by the port you started the process on.
- Bulk checks against the live site must be paced: sequential, about 1 request per second, never a parallel burst. Vercel bot protection challenges the whole site for about 10 minutes when tripped.
- After a push to `main`: wait for the Vercel Production deployment, then curl the changed pages and confirm 200, confirm public pages, favicons, the key file, sitemap.xml, robots.txt and llms.txt still return 200, confirm excluded paths return 404, and report the IndexNow run for that push (conclusion plus its key log lines).
- Report `git log -1` and `git status` at the end.
- State plainly what could not be verified (for example, whether Bing processed a submission).
