import fs from "node:fs/promises";

const USERNAME = "HF-CYGG";
const README_PATH = "README.md";

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

function formatDate(dateString) {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function shortMessage(message) {
  return message.split("\n")[0].trim();
}

function escapeMd(text) {
  return text
    .replace(/\|/g, "\\|")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");
}

async function getPublicRepos() {
  const repos = await githubGet(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`
  );

  return repos
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
}

async function getRecentCommits(repoFullName) {
  const commits = await githubGet(
    `https://api.github.com/repos/${repoFullName}/commits?author=${USERNAME}&per_page=10`
  );

  return commits.map((item) => ({
    repo: repoFullName,
    sha: item.sha,
    url: item.html_url,
    message: shortMessage(item.commit.message),
    date: item.commit.committer.date,
  }));
}

async function main() {
  const repos = await getPublicRepos();

  const allCommits = [];
  const repoStats = [];

  for (const repo of repos.slice(0, 12)) {
    try {
      const commits = await getRecentCommits(repo.full_name);
      if (commits.length > 0) {
        repoStats.push({
          name: repo.full_name,
          url: repo.html_url,
          count: commits.length,
          pushedAt: repo.pushed_at,
        });
        allCommits.push(...commits);
      }
    } catch (error) {
      console.warn(`Skip ${repo.full_name}: ${error.message}`);
    }
  }

  allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));

  const recentCommits = allCommits.slice(0, 8);
  const activeRepos = repoStats
    .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt))
    .slice(0, 6);

  const totalRecentCommits = allCommits.length;
  const updatedAt = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

  const lines = [];

  lines.push(`> Last updated: \`${updatedAt}\``);
  lines.push("");
  lines.push(`最近扫描到 **${activeRepos.length}** 个活跃公开仓库，读取到 **${totalRecentCommits}** 条近期提交。`);
  lines.push("");

  lines.push("### Recent commits");
  lines.push("");
  lines.push("| Date | Repo | Commit |");
  lines.push("| --- | --- | --- |");

  for (const commit of recentCommits) {
    const repoName = commit.repo.replace(`${USERNAME}/`, "");
    const shortSha = commit.sha.slice(0, 7);
    lines.push(
      `| ${formatDate(commit.date)} | [${repoName}](https://github.com/${commit.repo}) | [${shortSha}](${commit.url}) ${escapeMd(commit.message)} |`
    );
  }

  lines.push("");
  lines.push("### Active repos");
  lines.push("");
  lines.push("| Repo | Recent commits | Last pushed |");
  lines.push("| --- | ---: | --- |");

  for (const repo of activeRepos) {
    const repoName = repo.name.replace(`${USERNAME}/`, "");
    lines.push(
      `| [${repoName}](${repo.url}) | ${repo.count} | ${formatDate(repo.pushedAt)} |`
    );
  }

  const generated = lines.join("\n");

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
