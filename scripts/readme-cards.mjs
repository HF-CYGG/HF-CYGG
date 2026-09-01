const CARD_WIDTH = 560;
const CARD_HEIGHT = 282;
const ROW_LIMIT = 6;
const BAR_WIDTH = 168;

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(value, limit) {
  const characters = Array.from(String(value ?? ""));
  if (characters.length <= limit) {
    return characters.join("");
  }

  return `${characters.slice(0, Math.max(0, limit - 1)).join("")}…`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "-" : date.toISOString().slice(0, 10);
}

function repoShortName(fullName) {
  return String(fullName ?? "").replace(/^HF-CYGG\//, "");
}

function cardStyle() {
  return `<style>
    .card { fill: #ffffff; stroke: #d0d7de; }
    .divider { fill: #d8dee4; }
    .title, .project { fill: #1f2328; }
    .muted, .meta { fill: #57606a; }
    .accent { fill: #0969da; }
    .track { fill: #eaeef2; }
    .bar { fill: #6e7781; }
    .title { font: 600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .project { font: 600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .muted, .accent { font: 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .meta { font: 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    @media (prefers-color-scheme: dark) {
      .card { fill: #0d1117; stroke: #30363d; }
      .divider { fill: #21262d; }
      .title, .project { fill: #f0f6fc; }
      .muted, .meta { fill: #8b949e; }
      .accent { fill: #58a6ff; }
      .track { fill: #21262d; }
      .bar { fill: #8c959f; }
    }
    #gh-dark-mode-only:target .card { fill: #0d1117; stroke: #30363d; }
    #gh-dark-mode-only:target .divider { fill: #21262d; }
    #gh-dark-mode-only:target .title,
    #gh-dark-mode-only:target .project { fill: #f0f6fc; }
    #gh-dark-mode-only:target .muted,
    #gh-dark-mode-only:target .meta { fill: #8b949e; }
    #gh-dark-mode-only:target .accent { fill: #58a6ff; }
    #gh-dark-mode-only:target .track { fill: #21262d; }
    #gh-dark-mode-only:target .bar { fill: #8c959f; }
  </style>`;
}

function renderCard({ title, description, headerMeta, rows, footer }) {
  return `<svg id="gh-dark-mode-only" xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  ${cardStyle()}
  <rect class="card" x="0.5" y="0.5" width="559" height="281" rx="10" />
  <text class="title" x="20" y="30">${escapeXml(title)}</text>
  <text class="meta" x="540" y="30" text-anchor="end">${escapeXml(headerMeta)}</text>
  <rect class="divider" x="20" y="44" width="520" height="1" />
  ${rows.join("\n  ")}
  <text class="meta" x="20" y="266">${escapeXml(footer)}</text>
</svg>
`;
}

export function renderRecentCommitsCard(commits, { updatedAt }) {
  const visibleCommits = commits.slice(0, ROW_LIMIT);
  const rows = visibleCommits.map((commit, index) => {
    const y = 70 + index * 30;
    const repo = escapeXml(truncate(repoShortName(commit.repo), 16));
    const sha = escapeXml(String(commit.sha ?? "").slice(0, 7));
    const message = escapeXml(truncate(commit.message, 30));
    const date = escapeXml(formatDate(commit.date));

    return `<circle class="accent" cx="23" cy="${y - 4}" r="3" />
  <text class="project" x="34" y="${y}">${repo}</text>
  <text class="accent" x="150" y="${y}">${sha}</text>
  <text class="muted" x="211" y="${y}">${message}</text>
  <text class="meta" x="540" y="${y}" text-anchor="end">${date}</text>`;
  });

  if (rows.length === 0) {
    rows.push(
      `<text class="muted" x="20" y="78">No recent project commits found.</text>`
    );
  }

  return renderCard({
    title: "Recent project commits",
    description: "The latest commits authored by HF-CYGG in tracked public project repositories.",
    headerMeta: `latest ${visibleCommits.length}`,
    rows,
    footer: `Updated ${updatedAt}`,
  });
}

export function renderProjectPulseCard(repos, { updatedAt }) {
  const visibleRepos = repos.slice(0, ROW_LIMIT);
  const maxCount = Math.max(...visibleRepos.map((repo) => repo.count), 1);
  const rows = visibleRepos.map((repo, index) => {
    const y = 70 + index * 30;
    const name = escapeXml(truncate(repoShortName(repo.name), 17));
    const count = Math.max(0, Number(repo.count) || 0);
    const activityWidth = Math.round((count / maxCount) * BAR_WIDTH);
    const date = escapeXml(formatDate(repo.pushedAt));

    return `<text class="project" x="20" y="${y}">${name}</text>
  <rect class="track" x="150" y="${y - 9}" width="${BAR_WIDTH}" height="7" rx="3.5" />
  <rect class="bar" x="150" y="${y - 9}" width="${activityWidth}" height="7" rx="3.5" />
  <text class="muted" x="330" y="${y}">${count} commits</text>
  <text class="meta" x="540" y="${y}" text-anchor="end">${date}</text>`;
  });

  if (rows.length === 0) {
    rows.push(
      `<text class="muted" x="20" y="78">No tracked project activity yet.</text>`
    );
  }

  return renderCard({
    title: "Project pulse",
    description: "Recent commit activity and last push dates for HF-CYGG tracked project repositories.",
    headerMeta: "last 10 commits / repo",
    rows,
    footer: `Updated ${updatedAt}`,
  });
}

function renderThemeImage(path, alt, theme) {
  const source = escapeXml(`./${path}`);
  const description = escapeXml(alt);

  return `<img width="49.5%" src="${source}#gh-${theme}-mode-only" alt="${description}" />`;
}

export function renderActivityCardsEmbed({
  recentCardPath,
  pulseCardPath,
  updatedAt,
}) {
  const recentAlt = "HF-CYGG 最近项目提交动态卡片";
  const pulseAlt = "HF-CYGG 项目活跃度动态卡片";

  return `<div>
  ${renderThemeImage(recentCardPath, recentAlt, "dark")}
  ${renderThemeImage(pulseCardPath, pulseAlt, "dark")}
  ${renderThemeImage(recentCardPath, recentAlt, "light")}
  ${renderThemeImage(pulseCardPath, pulseAlt, "light")}
</div>

<sub>由 GitHub Actions 更新 · 仅统计已跟踪的公开项目仓库 · ${escapeXml(updatedAt)}</sub>`;
}
