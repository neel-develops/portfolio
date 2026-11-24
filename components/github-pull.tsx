"use client";

import { useEffect, useState } from "react";

type Repo = {
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  subscribers_count?: number;
  open_issues_count: number;
  default_branch: string;
  license: { spdx_id: string } | null;
  created_at: string;
  pushed_at: string;
  size: number;
  topics?: string[];
  visibility?: string;
};
type Commit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { name: string; date: string } };
  author: { login: string } | null;
};
type Contributor = { login: string; contributions: number; html_url: string };
type Data = {
  repo: Repo;
  languages: Record<string, number>;
  commits: Commit[];
  contributors: Contributor[];
  commitCount: number | null;
};

const cache = new Map<string, Data | "error">();

const parse = (url: string) => {
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, "")}` : null;
};

const ago = (iso: string) => {
  const d = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
  return d < 2 ? "today" : d < 30 ? `${d} days ago` : d < 365 ? `${Math.round(d / 30)} mo ago` : `${Math.round(d / 365)} yr ago`;
};

async function load(slug: string): Promise<Data> {
  const base = `https://api.github.com/repos/${slug}`;
  const get = async (path: string) => {
    const r = await fetch(base + path, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(String(r.status));
    return r;
  };
  const [repo, languages, commitsRes, contributors] = await Promise.all([
    get("").then((r) => r.json()),
    get("/languages").then((r) => r.json()).catch(() => ({})),
    get("/commits?per_page=5"),
    get("/contributors?per_page=5").then((r) => r.json()).catch(() => [])
  ]);
  // total commit count from the pagination Link header of a per_page=1 request
  let commitCount: number | null = null;
  try {
    const r = await get("/commits?per_page=1");
    const link = r.headers.get("link");
    const last = link?.match(/[?&]page=(\d+)>; rel="last"/);
    commitCount = last ? Number(last[1]) : (await r.json()).length;
  } catch {}
  return { repo, languages, commits: await commitsRes.json(), contributors: Array.isArray(contributors) ? contributors : [], commitCount };
}

export function GitHubPull({ repoUrl }: { repoUrl?: string }) {
  const slug = repoUrl ? parse(repoUrl) : null;
  const [state, setState] = useState<Data | "error" | "loading">("loading");

  useEffect(() => {
    if (!slug) return;
    const hit = cache.get(slug);
    if (hit) { setState(hit); return; }
    setState("loading");
    let live = true;
    load(slug)
      .then((d) => { cache.set(slug, d); if (live) setState(d); })
      .catch(() => { if (live) setState("error"); });
    return () => { live = false; };
  }, [slug]);

  if (!slug) {
    return <div className="gp"><p className="gp-dim">$ git pull — this project is private, so there is no public repository to pull.</p></div>;
  }
  if (state === "loading") {
    return <div className="gp"><p>$ git pull origin main</p><p className="gp-dim">remote: Enumerating objects from github.com/{slug} …</p></div>;
  }
  if (state === "error") {
    return (
      <div className="gp">
        <p>$ git pull origin main</p>
        <p className="gp-bad">fatal: could not read from github.com/{slug} (private, renamed, or API rate limit)</p>
        <a className="gp-link" href={`https://github.com/${slug}`} target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a>
      </div>
    );
  }

  const { repo, languages, commits, contributors, commitCount } = state;
  const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const hues = ["#ff334b", "#f5a623", "#4cc38a", "#3b82f6", "#a855f7"];

  return (
    <div className="gp">
      <p>$ git pull origin {repo.default_branch}</p>
      <p className="gp-ok">From github.com/{repo.full_name} · Already up to date.</p>
      {repo.description && <p className="gp-dim">{repo.description}</p>}

      <div className="gp-stats">
        <span><b>{repo.stargazers_count}</b> stars</span>
        <span><b>{repo.forks_count}</b> forks</span>
        <span><b>{repo.subscribers_count ?? 0}</b> watching</span>
        <span><b>{repo.open_issues_count}</b> issues</span>
        <span><b>{commitCount ?? "—"}</b> commits</span>
        <span><b>{Math.round(repo.size / 1024 * 10) / 10}</b> MB</span>
      </div>

      <div className="gp-meta">
        <span>branch <b>{repo.default_branch}</b></span>
        <span>license <b>{repo.license?.spdx_id ?? "none"}</b></span>
        <span>created <b>{new Date(repo.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</b></span>
        <span>last push <b>{ago(repo.pushed_at)}</b></span>
      </div>

      {langs.length > 0 && (
        <>
          <div className="gp-langbar">
            {langs.map(([l, n], i) => <i key={l} style={{ width: `${(n / total) * 100}%`, background: hues[i] }} />)}
          </div>
          <div className="gp-langs">
            {langs.map(([l, n], i) => <span key={l}><u style={{ background: hues[i] }} />{l} {Math.round((n / total) * 100)}%</span>)}
          </div>
        </>
      )}

      {repo.topics && repo.topics.length > 0 && (
        <div className="gp-langs">{repo.topics.map((t) => <span key={t}>#{t}</span>)}</div>
      )}

      <p className="gp-head">Recent commits</p>
      {commits.map((c) => (
        <a key={c.sha} className="gp-commit" href={c.html_url} target="_blank" rel="noopener noreferrer">
          <code>{c.sha.slice(0, 7)}</code>
          <span>{c.commit.message.split("\n")[0]}</span>
          <em>{c.author?.login ?? c.commit.author.name} · {ago(c.commit.author.date)}</em>
        </a>
      ))}

      {contributors.length > 0 && (
        <>
          <p className="gp-head">Contributors</p>
          <div className="gp-langs">
            {contributors.map((c) => <a key={c.login} href={c.html_url} target="_blank" rel="noopener noreferrer">@{c.login} ({c.contributions})</a>)}
          </div>
        </>
      )}

      <a className="gp-link" href={repo.html_url} target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a>
    </div>
  );
}
