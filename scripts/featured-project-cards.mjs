import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DESKTOP_SIZE = { width: 415, height: 118 };
const MOBILE_SIZE = { width: 180, height: 150 };

export const FEATURED_PROJECTS = [
  {
    slug: "dawn-course",
    title: "Dawn Course / 破晓课程表",
    mobileTitle: "Dawn Course / 破晓",
    description: [
      "免费、轻量、开源的 Android 课程表 App",
      "适配多类高校教务系统与本地课程管理",
    ],
    techs: ["Kotlin", "Jetpack Compose", "Room", "QuickJS"],
    mobileTechs: ["Kotlin", "Compose", "Room", "QuickJS"],
    mobileDescription: ["免费、轻量的 Android 课程表", "适配多类高校教务系统"],
    focus: "教务导入 · 提醒组件 · 备份同步",
    mobileFocus: ["教务导入 · 提醒组件", "备份同步"],
  },
  {
    slug: "y-link",
    title: "Y-Link",
    description: [
      "文创产品出入库与 O2O 预订系统",
      "覆盖预订、核销、库存、供货与权限安全",
    ],
    techs: ["Vue 3", "TypeScript", "Express", "MySQL"],
    mobileTechs: ["Vue 3", "TS", "Express", "MySQL"],
    mobileDescription: ["文创产品出入库与 O2O 系统", "覆盖预订、核销与库存流转"],
    focus: "线上预订 · 权限安全 · Onebox 部署",
    mobileFocus: ["线上预订 · 权限安全", "Onebox 部署"],
  },
  {
    slug: "lumasr",
    title: "LumaSR",
    description: [
      "完全离线的 Android AI 图像超分工具",
      "使用 ncnn 与 Vulkan 完成端侧推理",
    ],
    techs: ["Kotlin", "Android NDK", "ncnn", "Vulkan"],
    mobileTechs: ["Kotlin", "Android NDK", "ncnn", "Vulkan"],
    mobileDescription: ["完全离线的 Android AI 超分工具", "ncnn + Vulkan 端侧推理"],
    focus: "分块处理 · 超大图导出 · OOM 保护",
    mobileFocus: ["分块处理 · 超大图导出", "OOM 保护 · 多模型稳定性"],
  },
  {
    slug: "equiptrack",
    title: "EquipTrack",
    description: [
      "面向高校组织的物资追踪与管理系统",
      "覆盖登记、借用、审批与归还流程",
    ],
    techs: ["Kotlin", "Node.js", "Docker", "MySQL"],
    mobileTechs: ["Kotlin", "Node.js", "Docker", "MySQL"],
    mobileDescription: ["高校组织物资追踪系统", "覆盖借用、审批与归还"],
    focus: "物资追踪 · 权限流转 · 独立服务端",
    mobileFocus: ["物资追踪 · 权限流转", "独立服务端"],
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

function cardStyle({ mobile }) {
  const typography = mobile
    ? `.title { font: 600 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .body { font: 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .muted { font: 9px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .pill-text { font: 600 8.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .link { font: 600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }`
    : `.title { font: 600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .body { font: 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .muted { font: 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .pill-text { font: 600 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .link { font: 600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }`;

  return `<style>
    .card { fill: #f6f8fa; stroke: #d0d7de; }
    .accent-line { fill: #6e7781; }
    .title, .link { fill: #0969da; }
    .body, .pill-text { fill: #24292f; }
    .muted { fill: #57606a; }
    .pill { fill: #eaeef2; }
    ${typography}
    @media (prefers-color-scheme: dark) {
      .card { fill: #161b22; stroke: #30363d; }
      .accent-line { fill: #8c959f; }
      .title, .link { fill: #58a6ff; }
      .body, .pill-text { fill: #f0f6fc; }
      .muted { fill: #8b949e; }
      .pill { fill: #21262d; }
    }
    #gh-dark-mode-only:target .card { fill: #161b22; stroke: #30363d; }
    #gh-dark-mode-only:target .accent-line { fill: #8c959f; }
    #gh-dark-mode-only:target .title,
    #gh-dark-mode-only:target .link { fill: #58a6ff; }
    #gh-dark-mode-only:target .body,
    #gh-dark-mode-only:target .pill-text { fill: #f0f6fc; }
    #gh-dark-mode-only:target .muted { fill: #8b949e; }
    #gh-dark-mode-only:target .pill { fill: #21262d; }
  </style>`;
}

function estimatePillWidth(label, { mobile }) {
  const characterWidth = mobile ? 5.2 : 6.2;
  const padding = mobile ? 14 : 16;
  return Math.max(mobile ? 34 : 42, Math.round(Array.from(label).length * characterWidth + padding));
}

function renderPills(techs, { mobile }) {
  const maxX = mobile ? 168 : 399;
  const startX = mobile ? 12 : 16;
  const startY = mobile ? 65 : 68;
  const rowHeight = mobile ? 21 : 22;
  const pillHeight = mobile ? 17 : 18;
  const textInset = mobile ? 7 : 8;
  const textBaseline = mobile ? 12 : 13;
  const gap = mobile ? 5 : 6;
  let x = startX;
  let y = startY;

  return techs
    .map((tech) => {
      const width = estimatePillWidth(tech, { mobile });
      if (x + width > maxX) {
        x = startX;
        y += rowHeight;
      }

      const markup = `<rect class="pill" x="${x}" y="${y}" width="${width}" height="${pillHeight}" rx="4" />
  <text class="pill-text" x="${x + textInset}" y="${y + textBaseline}">${escapeXml(tech)}</text>`;
      x += width + gap;
      return markup;
    })
    .join("\n  ");
}

export function renderFeaturedProjectCard(project, { mobile = false } = {}) {
  const { width, height } = mobile ? MOBILE_SIZE : DESKTOP_SIZE;
  const description = project.description ?? [];
  const visibleDescription = mobile ? project.mobileDescription ?? description : description;
  const focusLines = mobile ? project.mobileFocus ?? [project.focus] : [project.focus];
  const descriptionY = mobile ? [40, 54] : [43, 58];
  const focusY = mobile ? [119, 134] : [106];
  const textX = mobile ? 12 : 16;

  const descriptionMarkup = visibleDescription
    .slice(0, 2)
    .map(
      (line, index) =>
        `<text class="body" x="${textX}" y="${descriptionY[index]}">${escapeXml(line)}</text>`
    )
    .join("\n  ");
  const focusMarkup = focusLines
    .slice(0, 2)
    .map(
      (line, index) =>
        `<text class="muted" x="${textX}" y="${focusY[index]}">${escapeXml(line)}</text>`
    )
    .join("\n  ");
  const linkX = mobile ? 168 : 399;
  const linkY = mobile ? 21 : 22;
  const titleText = mobile ? project.mobileTitle ?? project.title : project.title;
  const techs = mobile ? project.mobileTechs ?? project.techs ?? [] : project.techs ?? [];
  const linkText = mobile ? "↗" : "打开仓库 ↗";

  return `<svg id="gh-dark-mode-only" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(project.title)}</title>
  <desc id="description">${escapeXml([...description, ...(project.techs ?? []), ...focusLines].join("。"))}</desc>
  ${cardStyle({ mobile })}
  <rect class="card" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="10" />
  <rect class="accent-line" x="0" y="${mobile ? 12 : 14}" width="3" height="${mobile ? 126 : 90}" rx="1.5" />
  <text class="title" x="${textX}" y="${mobile ? 21 : 22}">${escapeXml(titleText)}</text>
  ${descriptionMarkup}
  ${renderPills(techs, { mobile })}
  ${focusMarkup}
  <text class="link" x="${linkX}" y="${linkY}" text-anchor="end">${linkText}</text>
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
