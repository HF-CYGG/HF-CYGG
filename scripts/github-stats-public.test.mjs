import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

import {
  buildPublicStatsData,
  parseLanguageColors,
  sumUserLinesChanged,
} from "./github-stats-public.mjs";

test("parseLanguageColors reads quoted names and GitHub Linguist colors", () => {
  const colors = parseLanguageColors(`Kotlin:
  type: programming
  color: "#A97BFF"
"C#":
  type: programming
  color: "#178600"
Markdown:
  type: prose
`);

  assert.equal(colors.get("Kotlin"), "#A97BFF");
  assert.equal(colors.get("C#"), "#178600");
  assert.equal(colors.has("Markdown"), false);
});

test("buildPublicStatsData creates jstrieb-compatible public repository input", () => {
  const data = buildPublicStatsData({
    profile: { login: "HF-CYGG", name: "夜喵cats" },
    repos: [
      {
        full_name: "HF-CYGG/Dawn-Course",
        stargazers_count: 9,
        forks_count: 2,
        fork: false,
        archived: false,
        private: false,
      },
      {
        full_name: "HF-CYGG/old-fork",
        stargazers_count: 99,
        forks_count: 99,
        fork: true,
        archived: false,
        private: false,
      },
    ],
    languagesByRepo: new Map([
      ["HF-CYGG/Dawn-Course", { Kotlin: 1200, Java: 300 }],
    ]),
    languageColors: new Map([
      ["Kotlin", "#A97BFF"],
      ["Java", "#b07219"],
    ]),
    linesChangedByRepo: new Map([["HF-CYGG/Dawn-Course", 4200]]),
    contributions: 321,
  });

  assert.equal(data.user, "HF-CYGG");
  assert.equal(data.name, "夜喵cats");
  assert.equal(data.commit_contributions, 321);
  assert.equal(data.repositories.length, 1);
  assert.deepEqual(data.repositories[0], {
    name: "HF-CYGG/Dawn-Course",
    stars: 9,
    forks: 2,
    languages: [
      { name: "Kotlin", size: 1200, color: "#A97BFF" },
      { name: "Java", size: 300, color: "#b07219" },
    ],
    lines_changed: 4200,
    views: 0,
    private: false,
  });
});

test("sumUserLinesChanged tolerates pending contributor-stat responses", () => {
  assert.equal(
    sumUserLinesChanged(
      [
        {
          author: { login: "HF-CYGG" },
          weeks: [
            { a: 4, d: 2 },
            { a: 1, d: 0 },
          ],
        },
      ],
      "hf-cygg"
    ),
    7
  );
  assert.equal(sumUserLinesChanged({}, "HF-CYGG"), 0);
});

test("workflow pins jstrieb and generates both public stats SVGs without a PAT", async () => {
  const workflow = await fs.readFile(
    new URL("../.github/workflows/update-readme.yml", import.meta.url),
    "utf8"
  );

  assert.match(workflow, /repository: jstrieb\/github-stats/);
  assert.match(workflow, /ref: ef574fae2ce8311f3e1ebb43e07c0c0fae0a41b6/);
  assert.match(workflow, /node scripts\/github-stats-public\.mjs/);
  assert.match(workflow, /github-overview\.svg/);
  assert.match(workflow, /github-languages\.svg/);
  assert.doesNotMatch(workflow, /ACCESS_TOKEN/);
});
