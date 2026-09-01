import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DESKTOP_SIZE = { width: 760, height: 170 };
const MOBILE_SIZE = { width: 360, height: 224 };

export const FEATURED_PROJECTS = [
  {
    slug: "dawn-course",
    kicker: "ANDROID · CAMPUS TOOL",
    title: "Dawn Course / 破晓课程表",
    description: [
      "免费、轻量、开源的 Android 课程表 App",
      "适配多类高校教务系统与本地课程管理",
    ],
    techs: ["Kotlin", "Jetpack Compose", "Room", "QuickJS"],
    focus: "多教务系统课程导入 · 提醒与小组件 · 备份与同步",
    mobileFocus: ["多教务系统课程导入 · 提醒与小组件", "备份、同步与脚本解析"],
  },
  {
    slug: "y-link",
    kicker: "WEB · FULL STACK",
    title: "Y-Link",
    description: [
      "文创产品出入库与 O2O 预订系统",
      "覆盖预订、核销、库存、供货与权限安全",
    ],
    techs: ["Vue 3", "TypeScript", "Express", "MySQL"],
    focus: "线上预订 · 库存流转 · 客户反馈 · Onebox 部署",
    mobileFocus: ["线上预订 · 库存流转 · 客户反馈", "权限安全与 Onebox 部署"],
  },
  {
    slug: "lumasr",
    kicker: "ANDROID · ON-DEVICE AI",
    title: "LumaSR",
    description: [
      "完全离线的 Android AI 图像超分工具",
      "使用 ncnn 与 Vulkan 完成端侧推理",
    ],
    techs: ["Kotlin", "Android NDK", "ncnn", "Vulkan"],
    focus: "分块处理 · 超大图导出 · OOM 保护 · 多模型稳定性",
    mobileFocus: ["分块处理 · 超大图导出", "OOM 保护 · 多模型稳定性"],
  },
];

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cardStyle() {
  return `<style>
    .card { fill: #f6f8fa; stroke: #d0d7de; }
    .accent-line { fill: #6e7781; }
    .title, .link { fill: #0969da; }
    .body, .pill-text { fill: #24292f; }
    .muted, .kicker { fill: #57606a; }
    .pill { fill: #eaeef2; }
    .title { font: 600 21px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .body { font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .muted { font: 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .kicker { font: 600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: 0.8px; }
    .pill-text { font: 600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .link { font: 600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    @media (prefers-color-scheme: dark) {
      .card { fill: #161b22; stroke: #30363d; }
      .accent-line { fill: #8c959f; }
      .title, .link { fill: #58a6ff; }
      .body, .pill-text { fill: #f0f6fc; }
      .muted, .kicker { fill: #8b949e; }
      .pill { fill: #21262d; }
    }
    #gh-dark-mode-only:target .card { fill: #161b22; stroke: #30363d; }
    #gh-dark-mode-only:target .accent-line { fill: #8c959f; }
    #gh-dark-mode-only:target .title,
    #gh-dark-mode-only:target .link { fill: #58a6ff; }
    #gh-dark-mode-only:target .body,
    #gh-dark-mode-only:target .pill-text { fill: #f0f6fc; }
    #gh-dark-mode-only:target .muted,
    #gh-dark-mode-only:target .kicker { fill: #8b949e; }
    #gh-dark-mode-only:target .pill { fill: #21262d; }
  </style>`;
}

function estimatePillWidth(label) {
  return Math.max(48, Math.round(Array.from(label).length * 7.2 + 20));
}

function renderPills(techs, { mobile }) {
  const maxX = mobile ? 336 : 736;
  const startX = 24;
  const startY = mobile ? 116 : 110;
  const rowHeight = 30;
  let x = startX;
  let y = startY;

  return techs
    .map((tech) => {
      const width = estimatePillWidth(tech);
      if (x + width > maxX) {
        x = startX;
        y += rowHeight;
      }

      const markup = `<rect class="pill" x="${x}" y="${y}" width="${width}" height="22" rx="5" />
  <text class="pill-text" x="${x + 10}" y="${y + 15}">${escapeXml(tech)}</text>`;
      x += width + 8;
      return markup;
    })
    .join("\n  ");
}

export function renderFeaturedProjectCard(project, { mobile = false } = {}) {
  const { width, height } = mobile ? MOBILE_SIZE : DESKTOP_SIZE;
  const description = project.description ?? [];
  const focusLines = mobile ? project.mobileFocus ?? [project.focus] : [project.focus];
  const descriptionY = mobile ? [80, 102] : [78, 98];
  const focusY = mobile ? [188, 207] : [154];

  const descriptionMarkup = description
    .slice(0, 2)
    .map(
      (line, index) =>
        `<text class="body" x="24" y="${descriptionY[index]}">${escapeXml(line)}</text>`
    )
    .join("\n  ");
  const focusMarkup = focusLines
    .slice(0, 2)
    .map(
      (line, index) =>
        `<text class="muted" x="24" y="${focusY[index]}">${escapeXml(line)}</text>`
    )
    .join("\n  ");
  const linkX = mobile ? 336 : 736;
  const linkY = mobile ? 25 : 154;

  return `<svg id="gh-dark-mode-only" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(project.title)}</title>
  <desc id="description">${escapeXml([...description, ...focusLines].join("。"))}</desc>
  ${cardStyle()}
  <rect class="card" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" />
  <rect class="accent-line" x="0" y="24" width="3" height="${height - 48}" rx="1.5" />
  <text class="kicker" x="24" y="25">${escapeXml(project.kicker)}</text>
  <text class="title" x="24" y="52">${escapeXml(project.title)}</text>
  ${descriptionMarkup}
  ${renderPills(project.techs ?? [], { mobile })}
  ${focusMarkup}
  <text class="link" x="${linkX}" y="${linkY}" text-anchor="end">打开仓库 ↗</text>
</svg>
`;
}

export async function writeFeaturedProjectCards(outputDirectory) {
  const defaultOutput = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../assets/generated"
  );
  const output = outputDirectory ? path.resolve(outputDirectory) : defaultOutput;
  await fs.mkdir(output, { recursive: true });

  const writtenFiles = [];
  for (const project of FEATURED_PROJECTS) {
    const desktopPath = path.join(output, `featured-${project.slug}.svg`);
    const mobilePath = path.join(output, `featured-${project.slug}-mobile.svg`);
    await fs.writeFile(desktopPath, renderFeaturedProjectCard(project), "utf8");
    await fs.writeFile(
      mobilePath,
      renderFeaturedProjectCard(project, { mobile: true }),
      "utf8"
    );
    writtenFiles.push(desktopPath, mobilePath);
  }

  return writtenFiles;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const modulePath = fileURLToPath(import.meta.url);
if (invokedPath && invokedPath.toLowerCase() === modulePath.toLowerCase()) {
  await writeFeaturedProjectCards();
}
