import assert from "node:assert/strict";
import test from "node:test";

import {
  FEATURED_PROJECTS,
  renderFeaturedProjectCard,
} from "./featured-project-cards.mjs";

test("desktop featured project card is compact, theme-aware, and accessible", () => {
  const svg = renderFeaturedProjectCard(FEATURED_PROJECTS[0]);

  assert.match(svg, /^<svg\b/);
  assert.match(svg, /width="415" height="118"/);
  assert.match(svg, /role="img"/);
  assert.match(svg, /aria-labelledby="title description"/);
  assert.match(svg, /id="gh-dark-mode-only"/);
  assert.match(svg, /@media \(prefers-color-scheme: dark\)/);
  assert.match(svg, /#gh-dark-mode-only:target \.card/);
  assert.match(svg, /Dawn Course \/ 破晓课程表/);
  assert.match(svg, /教务导入 · 提醒组件 · 备份同步/);
  assert.match(svg, /Kotlin/);
  assert.match(svg, /Jetpack Compose/);
  assert.match(svg, /打开仓库 ↗/);
  assert.doesNotMatch(svg, /<foreignObject|<script/);
});

test("mobile featured project card preserves readable text instead of shrinking desktop art", () => {
  const svg = renderFeaturedProjectCard(FEATURED_PROJECTS[2], { mobile: true });

  assert.match(svg, /width="180" height="150"/);
  assert.match(svg, /完全离线的 Android AI 图像超分工具/);
  assert.match(svg, /分块处理 · 超大图导出/);
  assert.match(svg, /OOM 保护 · 多模型稳定性/);
  assert.match(svg, /Android NDK/);
  assert.match(svg, /Vulkan/);
});

test("featured projects form an even two-by-two set", () => {
  assert.equal(FEATURED_PROJECTS.length, 4);
  assert.deepEqual(
    FEATURED_PROJECTS.map((project) => project.slug),
    ["dawn-course", "y-link", "lumasr", "equiptrack"]
  );
});

test("featured project card escapes user-visible content", () => {
  const svg = renderFeaturedProjectCard({
    ...FEATURED_PROJECTS[0],
    title: "A <B> & C",
    description: ["safe <text>", "second & line"],
  });

  assert.match(svg, /A &lt;B&gt; &amp; C/);
  assert.match(svg, /safe &lt;text&gt;/);
  assert.match(svg, /second &amp; line/);
  assert.doesNotMatch(svg, /A <B>/);
});
