# ฅ^•ﻌ•^ฅ 你好，我是 夜喵cats

> 平时写点代码，拍点照片，飞飞无人机。  
> 深夜修 bug 的时候，有“他”一直陪着我。

```text
HF-CYGG / 夜喵cats
Student · Android / Web Developer · Furry
China · he/him
```

---

## 🐾 About

我是 **夜喵cats**，GitHub ID 是 **HF-CYGG**。

大学生，平时会做一些 Android、Web、后端和自动化相关的小项目。很多项目都来自校园、社团和自己遇到的实际问题：课程表、物资管理、出库系统、本地图片超分、QQNT 插件之类。

一般使用 AI 辅助写代码，但不会做成“全自动交付”。需求能否拆分清楚、数据是否混乱、边界情况有没有超限、代码过几个月还能不能维护，这些都是我在努力完善的地方。

头像里的小家伙是“他”也是另一个我 —— **夜喵 / YEMIAO**。

---

## 🌙 Now

现在主要维护以下仓库：

| Repo | 最近在做什么 |
| --- | --- |
| [Dawn-Course](https://github.com/HF-CYGG/Dawn-Course) | 课程表导入、本地数据、提醒、小组件和教务系统适配。 |
| [Y-Link](https://github.com/HF-CYGG/Y-Link) | 文创出入库 / O2O 预订系统，继续补库存、报表、安全和部署细节。 |
| [LumaSR](https://github.com/HF-CYGG/LumaSR) | Android 本地 AI 图片超分，重点在 ncnn / Vulkan、分块处理和极限导出。 |
| [EquipTrack](https://github.com/HF-CYGG/EquipTrack) | 面向高校组织的物资追踪与管理系统。 |
| [qq-emote-deck](https://github.com/HF-CYGG/qq-emote-deck) | QQNT 表情相关插件。 |
| [InfraCount](https://github.com/HF-CYGG/InfraCount) | 硬件计数器数据统计后端。 |

---

## 🧩 Projects

### 📱 Dawn Course / 破晓课程表

> 免费、轻量、开源的 Android 课程表 App，已经适配新旧正方、强智、青果等教务系统。

Repo: [HF-CYGG/Dawn-Course](https://github.com/HF-CYGG/Dawn-Course)

`Kotlin` · `Jetpack Compose` · `Room` · `Hilt` · `Flow` · `WorkManager` · `QuickJS`

想把它做成一个真的能长期使用的学生工具，而不是只停留在课程表界面：

* 教务系统导入和脚本解析
* ICS 导入、本地课程管理
* 上课提醒、小组件
* 备份 / 还原、WebDAV 同步
* 本地优先的数据结构

---

### 🔗 Y-Link

> 基于 Vue 3、Express 和 TypeORM 的文创产品出入库与 O2O 预订系统。

Repo: [HF-CYGG/Y-Link](https://github.com/HF-CYGG/Y-Link)

`Vue 3` · `TypeScript` · `Express` · `TypeORM` · `SQLite` · `MySQL` · `Docker`

这个项目更像一个完整业务系统，管理端和客户端都在里面：

* 线上预订、线下核销
* 出库追踪、供货入库
* 客户反馈、附件处理
* 亮暗主题、移动端适配
* Docker / Onebox 部署
* SQLite 到 MySQL 的迁移方案

---

### 🌌 LumaSR

> 面向 Android 的本地 AI 图像超分工具，基于 ncnn 与 Vulkan 加速做离线推理。

Repo: [HF-CYGG/LumaSR](https://github.com/HF-CYGG/LumaSR)

`Kotlin` · `Jetpack Compose` · `Android NDK` · `ncnn` · `Vulkan` · `Waifu2x` · `RealCUGAN`

现在重点在稳定性和处理体验：

* Waifu2x / RealCUGAN 等模型支持
* 本地离线推理，不依赖云端
* 分块处理进度预览
* 前后画质对比
* 超大图极限导出和 OOM 保护

---

### 📦 EquipTrack

> 面向组织、社团、实验室的物资追踪与管理系统。

Repo: [HF-CYGG/EquipTrack](https://github.com/HF-CYGG/EquipTrack)  
Server: [HF-CYGG/HF-CYGG-equiptrack-server](https://github.com/HF-CYGG/HF-CYGG-equiptrack-server)

`Android` · `Kotlin` · `Node.js` · `TypeScript` · `Express` · `Docker`

主要解决物资从登记、借用、审批到归还的闭环问题。它不复杂，但权限和状态流转必须清楚。

---

### 🧸 qq-emote-deck

> QQNT 相关插件 / 表情包增强工具。

Repo: [HF-CYGG/qq-emote-deck](https://github.com/HF-CYGG/qq-emote-deck)

做这个主要是因为表情包真的太多了，插件稳定性也有待提高。

---

### 🧮 InfraCount

> 基于淘宝商家硬件的计数器统计后端。

Repo: [HF-CYGG/InfraCount](https://github.com/HF-CYGG/InfraCount)

偏后端和数据统计的小项目，用来处理硬件侧传来的计数数据。

---

### 🛠️ Side quests

一些暂时不算主线、但还会偶尔维护的小东西：

* [Alist-sync](https://github.com/HF-CYGG/Alist-sync) — Alist 同步相关脚本。
* [Noctis-Portfolio](https://github.com/HF-CYGG/Noctis-Portfolio) — 我的个人作品集页面。
* [DawnCourse-ios](https://github.com/HF-CYGG/DawnCourse-ios) — Dawn Course 的 iOS 端探索。

---

## 🧰 Stack

```text
Languages:
Kotlin / TypeScript / JavaScript / Python / Java / Swift

Mobile:
Android / Jetpack Compose / SwiftUI

Frontend:
Vue 3 / Vite / Pinia / HTML / CSS

Backend:
Node.js / Express / TypeORM / REST API

Database:
Room / SQLite / MySQL / JSON-based storage

Tools:
Git / Docker / Linux / GitHub Actions / Android Studio / Xcode

Currently learning:
SwiftUI / iOS architecture / KMP / AI-assisted code review
```

---

## 🐱 My Way

我的项目通常不是从“我要用什么技术栈”开始，而是先从一个真实场景开始：生活实践里遇到的问题、别人委托我解决的需求、某个流程太麻烦，或者某类数据需要被整理。

确定要解决什么之后，我会从框架开始一点点搭起来。先让整体流程跑通，再把前端慢慢调成我想要的样子。对我来说，前端不只是“能用”，它也应该像一件看起来顺眼、摸起来舒服的艺术品。

后端则是另一种打磨：让数据流更清楚，让接口更稳定，让处理速度更快，也让系统在出错时更容易排查。

最后再把它打包成 Docker 镜像、Android App、网页服务，或者其他可以真正交付和长期运行的形态。到这一步，一个项目才更接近我心里的“完成”。

---

## 📊 GitHub Activity

<p align="center">
  <img
    src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=20&duration=2600&pause=900&color=3BA4FF&center=true&vCenter=true&width=720&lines=code+notes+from+a+blue+cat;late-night+commits+%2F+quiet+builds;building+small+useful+things+slowly;debug+%E2%86%92+refine+%E2%86%92+ship"
    alt="Typing SVG"
  />
</p>

<p align="center">
  <img
    src="https://github-readme-activity-graph.vercel.app/graph?username=HF-CYGG&bg_color=0d1117&color=7aa2f7&line=3fb950&point=8b949e&area=true&hide_border=true&radius=14&title_color=7aa2f7&custom_title=%E5%A4%9C%E5%96%B5cats%27s%20Contribution%20Graph"
    alt="GitHub Activity Graph"
  />
</p>

<!-- RECENT_ACTIVITY:START -->
<p align="center">
  <img src="https://img.shields.io/badge/project_repos-6-7aa2f7?style=for-the-badge&labelColor=1f2335" alt="Project Repos" />
  <img src="https://img.shields.io/badge/recent_commits-33-9ece6a?style=for-the-badge&labelColor=1f2335" alt="Recent Commits" />
  <img src="https://img.shields.io/badge/profile_repo-excluded-f7768e?style=for-the-badge&labelColor=1f2335" alt="Profile repository excluded" />
</p>

> Last generated: `2026-07-05 15:14 UTC` · only project repositories are counted.

### Recent project commits

| Date | Repo | Commit |
| --- | --- | --- |
| 2026-07-05 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [de4d562](https://github.com/HF-CYGG/Y-Link/commit/de4d562bbd7cb876a898edf85f1049ac05dc64ab) Merge pull request #23 from HF-CYGG/codex/client-mall-update |
| 2026-07-03 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [79a0d53](https://github.com/HF-CYGG/Y-Link/commit/79a0d53d09635e96198349db7da708816850c5f9) Merge pull request #22 from HF-CYGG/codex/passive-wheel-listeners |
| 2026-07-02 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [77c7f60](https://github.com/HF-CYGG/Y-Link/commit/77c7f6007ca1a2cecb7bb58a40f86cab43fb8481) Merge pull request #21 from HF-CYGG/codex/login-geometry-motion-upgrade |
| 2026-07-02 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [e3cd85e](https://github.com/HF-CYGG/Y-Link/commit/e3cd85eed05aea3976e7a924a41c1e0fb9bdeda9) feat(auth): 升级认证页几何动效与玻璃视觉 |
| 2026-07-02 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [a6df136](https://github.com/HF-CYGG/Y-Link/commit/a6df136b1038dbb81f94611040adc68c60db762d) Merge pull request #19 from HF-CYGG/codex/department-account-governance |
| 2026-07-01 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [39d09e1](https://github.com/HF-CYGG/Y-Link/commit/39d09e1dfd41726667a98b48b64ade4a113f82a1) Merge pull request #18 from HF-CYGG/codex/sku-current-stock-fix |
| 2026-07-01 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [81c5cfa](https://github.com/HF-CYGG/Y-Link/commit/81c5cfa524004df7e84470eb7bf2b7ad0b9053a4) Merge branch 'main' into codex/sku-current-stock-fix |
| 2026-07-01 | [Y-Link](https://github.com/HF-CYGG/Y-Link) | [3be13e5](https://github.com/HF-CYGG/Y-Link/commit/3be13e534e1e3f835b752bdeb676eb0fa6996d75) Merge pull request #12 from HF-CYGG/codex/fix-acr-registry-variable-vulnerability |

### Project pulse

| Project | Recent commits | Pulse | Last push |
| --- | ---: | --- | --- |
| [Y-Link](https://github.com/HF-CYGG/Y-Link) | 10 | `▰▰▰▰▰▰▰▰▰▰` | 2026-07-05 |
| [LumaSR](https://github.com/HF-CYGG/LumaSR) | 10 | `▰▰▰▰▰▰▰▰▰▰` | 2026-07-05 |
| [Dawn-Course](https://github.com/HF-CYGG/Dawn-Course) | 10 | `▰▰▰▰▰▰▰▰▰▰` | 2026-07-03 |
| [qq-emote-deck](https://github.com/HF-CYGG/qq-emote-deck) | 2 | `▰▰▱▱▱▱▱▱▱▱` | 2026-06-30 |
| [InfraCount](https://github.com/HF-CYGG/InfraCount) | 1 | `▰▱▱▱▱▱▱▱▱▱` | 2026-03-03 |
| [EquipTrack](https://github.com/HF-CYGG/EquipTrack) | 0 | `▱▱▱▱▱▱▱▱▱▱` | 2026-02-15 |

<sub>Generated by GitHub Actions. Tracked project repositories only.</sub>
<!-- RECENT_ACTIVITY:END -->

---

## 📫 Contact

```text
Portfolio: https://hf-cygg.github.io/Noctis-Portfolio/
GitHub:    https://github.com/HF-CYGG
Gitee:     https://gitee.com/YeMiao_cats
X:         @yyh163
Email:     yyh1677696627@outlook.com
```

---

<p align='center'>
  <sub>漫漫长夜，慢慢写代码。</sub>
</p>
