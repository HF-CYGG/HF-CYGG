import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

const DEFAULT_USERNAME = "HF-CYGG";
const API_BASE = "https://api.github.com";
const LINGUIST_COLORS_URL =
  "https://raw.githubusercontent.com/github-linguist/linguist/master/lib/linguist/languages.yml";

export function parseLanguageColors(yaml) {
  const colors = new Map();
  let language = null;

  for (const line of String(yaml).split(/\r?\n/)) {
    const nameMatch = line.match(/^(?:"([^"]+)"|'([^']+)'|([^\s][^:]*)):\s*$/);
    if (nameMatch) {
      language = nameMatch[1] ?? nameMatch[2] ?? nameMatch[3];
      continue;
    }

    const colorMatch = line.match(
      /^\s+color:\s*(?:["']([^"']+)["']|(\S+))\s*$/
    );
    if (language && colorMatch) {
      colors.set(language, colorMatch[1] ?? colorMatch[2]);
    }
  }

  return colors;
}

export function buildPublicStatsData({
  profile,
  repos,
  languagesByRepo,
  languageColors,
  linesChangedByRepo,
  contributions,
}) {
  const publicRepos = repos.filter(
    (repo) => !repo.private && !repo.fork && !repo.archived
  );

  return {
    repositories: publicRepos.map((repo) => ({
      name: repo.full_name,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      languages: Object.entries(languagesByRepo.get(repo.full_name) ?? {}).map(
        ([name, size]) => ({
          name,
          size,
          color: languageColors.get(name) ?? null,
        })
      ),
      lines_changed: linesChangedByRepo.get(repo.full_name) ?? 0,
      views: 0,
      private: false,
    })),
    user: profile.login,
    name: profile.name || profile.login,
    emails: [`${profile.login}@users.noreply.github.com`],
    repo_contributions: 0,
    issue_contributions: 0,
    commit_contributions: contributions,
    pr_contributions: 0,
    review_contributions: 0,
  };
}

function requestHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "HF-CYGG-profile-readme",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function githubGet(path, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: requestHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${path}`);
  }

  return response.json();
}

async function githubGraphql(query, variables, token) {
  const response = await fetch(`${API_BASE}/graphql`, {
    method: "POST",
    headers: {
      ...requestHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();

  if (!response.ok || body.errors?.length) {
    const reason = body.errors?.map((error) => error.message).join("; ");
    throw new Error(`GitHub GraphQL failed: ${response.status} ${reason ?? ""}`);
  }

  return body.data;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
  return results;
}

async function listPublicRepos(username, token) {
  const repos = [];

  for (let page = 1; ; page += 1) {
    const batch = await githubGet(
      `/users/${username}/repos?type=owner&sort=full_name&per_page=100&page=${page}`,
      token
    );
    repos.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }

  return repos.filter(
    (repo) =>
      !repo.private &&
      !repo.fork &&
      !repo.archived &&
      repo.full_name.toLowerCase() !== `${username}/${username}`.toLowerCase()
  );
}

async function collectContributionTotal(username, token) {
  if (!token) {
    return 0;
  }

  const yearData = await githubGraphql(
    `query($login: String!) {
      user(login: $login) {
        contributionsCollection { contributionYears }
      }
    }`,
    { login: username },
    token
  );
  const years = yearData.user?.contributionsCollection?.contributionYears ?? [];
  const totals = await mapWithConcurrency(years, 4, async (year) => {
    const data = await githubGraphql(
      `query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar { totalContributions }
          }
        }
      }`,
      {
        login: username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
      token
    );
    return (
      data.user?.contributionsCollection?.contributionCalendar
        ?.totalContributions ?? 0
    );
  });

  return totals.reduce((sum, total) => sum + total, 0);
}

export function sumUserLinesChanged(contributors, username) {
  if (!Array.isArray(contributors)) {
    return 0;
  }

  const contributor = contributors.find(
    (item) => item.author?.login?.toLowerCase() === username.toLowerCase()
  );

  return (contributor?.weeks ?? []).reduce(
    (sum, week) => sum + (week.a ?? 0) + (week.d ?? 0),
    0
  );
}

async function collectLinesChanged(repo, username, token) {
  const contributors = await githubGet(
    `/repos/${repo.full_name}/stats/contributors`,
    token
  ).catch(() => []);
  return sumUserLinesChanged(contributors, username);
}

async function collectPublicStats(username, token) {
  const [profile, repos, colorsResponse, contributions] = await Promise.all([
    githubGet(`/users/${username}`, token),
    listPublicRepos(username, token),
    fetch(LINGUIST_COLORS_URL),
    collectContributionTotal(username, token).catch((error) => {
      console.warn(`Public contribution total unavailable: ${error.message}`);
      return 0;
    }),
  ]);

  const languageColors = colorsResponse.ok
    ? parseLanguageColors(await colorsResponse.text())
    : new Map();

  const perRepo = await mapWithConcurrency(repos, 6, async (repo) => {
    const [languages, linesChanged] = await Promise.all([
      githubGet(`/repos/${repo.full_name}/languages`, token).catch((error) => {
        console.warn(`Skip languages for ${repo.full_name}: ${error.message}`);
        return {};
      }),
      collectLinesChanged(repo, username, token),
    ]);
    return { repo, languages, linesChanged };
  });

  return buildPublicStatsData({
    profile,
    repos,
    languagesByRepo: new Map(
      perRepo.map(({ repo, languages }) => [repo.full_name, languages])
    ),
    languageColors,
    linesChangedByRepo: new Map(
      perRepo.map(({ repo, linesChanged }) => [repo.full_name, linesChanged])
    ),
    contributions,
  });
}

async function main() {
  const outputPath = process.argv[2];
  if (!outputPath) {
    throw new Error("Usage: node scripts/github-stats-public.mjs <output.json>");
  }

  const username = process.env.GITHUB_REPOSITORY_OWNER || DEFAULT_USERNAME;
  const data = await collectPublicStats(username, process.env.GITHUB_TOKEN);
  await fs.writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `Collected public GitHub stats for ${username}: ${data.repositories.length} repositories.`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
