import assert from "node:assert/strict";
import test from "node:test";

import {
  renderActivityCardsEmbed,
  renderProjectPulseCard,
  renderRecentCommitsCard,
} from "./readme-cards.mjs";

const UPDATED_AT = "2026-09-01 01:30 UTC";

test("recent commits card is accessible, theme-aware, escaped, and limited to six rows", () => {
  const commits = Array.from({ length: 7 }, (_, index) => ({
    repo: `HF-CYGG/project-${index + 1}`,
    sha: `${index + 1}`.repeat(40),
    message:
      index === 0
        ? "fix: <script> & keep the profile safe"
        : `docs: update project ${index + 1}`,
    date: `2026-09-0${index + 1}T00:00:00Z`,
  }));

  const svg = renderRecentCommitsCard(commits, { updatedAt: UPDATED_AT });

  assert.match(svg, /^<svg\b/);
  assert.match(svg, /id="gh-dark-mode-only"/);
  assert.match(svg, /role="img"/);
  assert.match(svg, /aria-labelledby="title description"/);
  assert.match(svg, /@media \(prefers-color-scheme: dark\)/);
  assert.match(svg, /#gh-dark-mode-only:target \.card/);
  assert.match(svg, /Recent project commits/);
  assert.match(svg, /project-1/);
  assert.match(svg, /1111111/);
  assert.match(svg, /fix: &lt;script&gt; &amp; keep the prof…/);
  assert.doesNotMatch(svg, /<script>/);
  assert.match(svg, /project-6/);
  assert.doesNotMatch(svg, /project-7/);
  assert.match(svg, /Updated 2026-09-01 01:30 UTC/);
});

test("project pulse card renders proportional activity bars and an empty state", () => {
  const card = renderProjectPulseCard(
    [
      {
        name: "HF-CYGG/Dawn-Course",
        count: 10,
        pushedAt: "2026-09-01T00:00:00Z",
      },
      {
        name: "HF-CYGG/Y-Link",
        count: 5,
        pushedAt: "2026-08-31T00:00:00Z",
      },
      {
        name: "HF-CYGG/quiet-project",
        count: 0,
        pushedAt: "2026-01-01T00:00:00Z",
      },
    ],
    { updatedAt: UPDATED_AT }
  );

  assert.match(card, /Project pulse/);
  assert.match(card, /Dawn-Course/);
  assert.match(card, /10 commits/);
  assert.match(card, /width="168"/);
  assert.match(card, /Y-Link/);
  assert.match(card, /5 commits/);
  assert.match(card, /width="84"/);
  assert.match(card, /quiet-project/);
  assert.match(card, /width="0"/);
  assert.match(card, /2026-09-01/);

  const empty = renderProjectPulseCard([], { updatedAt: UPDATED_AT });
  assert.match(empty, /No tracked project activity yet\./);
});

test("README embed selects light and dark variants without duplicating visible cards", () => {
  const markup = renderActivityCardsEmbed({
    recentCardPath: "assets/generated/recent-project-commits.svg",
    pulseCardPath: "assets/generated/project-pulse.svg",
    updatedAt: UPDATED_AT,
  });

  assert.equal((markup.match(/<picture>/g) ?? []).length, 2);
  assert.match(
    markup,
    /recent-project-commits\.svg#gh-dark-mode-only/
  );
  assert.match(
    markup,
    /recent-project-commits\.svg#gh-light-mode-only/
  );
  assert.match(markup, /project-pulse\.svg#gh-dark-mode-only/);
  assert.match(markup, /project-pulse\.svg#gh-light-mode-only/);
  assert.match(markup, /alt="HF-CYGG 最近项目提交动态卡片"/);
  assert.match(markup, /alt="HF-CYGG 项目活跃度动态卡片"/);
  assert.doesNotMatch(markup, /<details>/);
});
