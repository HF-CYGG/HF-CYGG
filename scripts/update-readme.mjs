import fs from "node:fs/promises";

import {
  renderActivityCardsEmbed,
  renderProjectPulseCard,
  renderRecentCommitsCard,
} from "./readme-cards.mjs";

const USERNAME = "HF-CYGG";
const README_PATH = "README.md";
const GENERATED_DIR = "assets/generated";
const RECENT_COMMITS_CARD_PATH = `${GENERATED_DIR}/recent-project-commits.svg`;
const PROJECT_PULSE_CARD_PATH = `${GENERATED_DIR}/project-pulse.svg`;

const TRACKED_REPOS = [
  "HF-CYGG/Dawn-Course",
  "HF-CYGG/Y-Link",
  "HF-CYGG/qq-emote-deck",
  "HF-CYGG/LumaSR",
  "HF-CYGG/EquipTrack",
  "HF-CYGG/InfraCount",
];

const EXCLUDED_REPOS = new Set([
  `${USERNAME}/${USERNAME}`,
]);

const token = process.env.GITHUB_TOKEN;
const headers = {
  "Accept": "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

async function githubGet(url) {
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API failed: ${res.status} ${url}\n${text}`);
  }

  return res.json();
}

function shortMessage(message) {
  return message.split("\n")[0].trim();
}

async function getTrackedRepos() {
  const repos = await githubGet(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`
  );

  const repoByFullName = new Map(
    repos
      .filter((repo) => !repo.fork && !repo.archived && !EXCLUDED_REPOS.has(repo.full_name))
      .map((repo) => [repo.full_name, repo])
  );

  return TRACKED_REPOS
    .map((fullName) => repoByFullName.get(fullName))
    .filter(Boolean);
}

async function getRecentCommits(repoFullName) {
  const commits = await githubGet(
    `https://api.github.com/repos/${repoFullName}/commits?author=${USERNAME}&per_page=10`
  );

  return commits.map((item) => ({
    repo: repoFullName,
    sha: item.sha,
    message: shortMessage(item.commit.message),
    date: item.commit.committer.date,
  }));
}

async function main() {
  const repos = await getTrackedRepos();

  const allCommits = [];
  const repoStats = [];

  for (const repo of repos) {
    try {
      const commits = await getRecentCommits(repo.full_name);
      repoStats.push({
        name: repo.full_name,
        count: commits.length,
        pushedAt: repo.pushed_at,
      });
      allCommits.push(...commits);
    } catch (error) {
      console.warn(`Skip ${repo.full_name}: ${error.message}`);
    }
  }

  allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));

  const recentCommits = allCommits.slice(0, 6);
  const activeRepos = repoStats.sort(
    (a, b) => new Date(b.pushedAt) - new Date(a.pushedAt)
  );

  const updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

  await fs.mkdir(GENERATED_DIR, { recursive: true });
  await Promise.all([
    fs.writeFile(
      RECENT_COMMITS_CARD_PATH,
      renderRecentCommitsCard(recentCommits, { updatedAt })
    ),
    fs.writeFile(
      PROJECT_PULSE_CARD_PATH,
      renderProjectPulseCard(activeRepos, { updatedAt })
    ),
  ]);

  const generated = renderActivityCardsEmbed({
    recentCardPath: RECENT_COMMITS_CARD_PATH,
    pulseCardPath: PROJECT_PULSE_CARD_PATH,
    updatedAt,
  });

  const readme = await fs.readFile(README_PATH, "utf8");

  const nextReadme = readme.replace(
    /<!-- RECENT_ACTIVITY:START -->[\s\S]*?<!-- RECENT_ACTIVITY:END -->/,
    `<!-- RECENT_ACTIVITY:START -->\n${generated}\n<!-- RECENT_ACTIVITY:END -->`
  );

  if (nextReadme === readme) {
    throw new Error("README markers not found.");
  }

  await fs.writeFile(README_PATH, nextReadme);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
