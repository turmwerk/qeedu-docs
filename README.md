<h1 align="center">QeEdu Docs</h1>

<p align="center">
  <img src="https://count.getloli.com/get/@qeedu-docs?theme=rule34" alt="Visitors">
</p>

<div align="center">

<div>
<a href="https://docs.qeedu.tech/" target="_blank">
  <img src="https://img.shields.io/badge/%E6%96%87%E6%A1%A3-docs.qeedu.tech-0D7D5F?style=flat-square&logo=readthedocs&logoColor=white&labelColor=555555" alt="QeEdu Docs">
</a>
<a href="https://qeedu.tech/" target="_blank">
  <img src="https://img.shields.io/badge/%E5%AE%98%E7%BD%91-qeedu.tech-B8FF5C?style=flat-square&logo=google-chrome&logoColor=white&labelColor=555555" alt="QeEdu 官网">
</a>
<a href="https://cloud.qeedu.tech/" target="_blank">
  <img src="https://img.shields.io/badge/CLOUD-cloud.qeedu.tech-083D31?style=flat-square&logo=cloudflare&logoColor=white&labelColor=555555" alt="QeEdu Cloud">
</a>
</div>

<div>
<a href="https://react.dev/" target="_blank">
  <img src="https://img.shields.io/badge/REACT-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=555555" alt="React 19">
</a>
<a href="https://vite.dev/" target="_blank">
  <img src="https://img.shields.io/badge/VITE-7-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=555555" alt="Vite 7">
</a>
<a href="https://www.markdownguide.org/mdx/" target="_blank">
  <img src="https://img.shields.io/badge/MDX-docs-1FC41F?style=flat-square&logo=markdown&logoColor=white&labelColor=555555" alt="MDX">
</a>
<a href="https://github.com/turmwerk/qeedu-docs/blob/main/LICENSE">
  <img src="https://img.shields.io/badge/LICENSE-MIT-green?style=flat-square&logo=github&logoColor=white&labelColor=555555" alt="License">
</a>
</div>

</div>

<div align="center">

简体中文 | [繁體中文](docs/README.zh-TW.md) | [English](docs/README.en.md) | [日本語](docs/README.ja.md)

</div>

## 项目定位

`qeedu-docs` 是启育 QeEdu 的文档站仓库，部署到 [docs.qeedu.tech](https://docs.qeedu.tech/)。

它参考 Dify Docs 的信息架构方式，保留 `docs.json` 与 MDX 文档树；同时提供一个轻量 Vite 前端，用于直接部署到 Cloudflare Pages。

## 相关仓库

| 仓库 | 地址 | 说明 |
| --- | --- | --- |
| QeEdu Home | <https://github.com/turmwerk/qeedu-home> | 官网与产品宣传站 |
| QeEdu Docs | <https://github.com/turmwerk/qeedu-docs> | 文档站、部署说明、试点手册 |
| QeEdu Cloud / Community | <https://github.com/turmwerk/qeedu> | 主产品前后端代码 |

## 文档范围

- 快速开始：产品定位、快速体验、关键概念。
- 版本与商业模式：Community、Cloud、Education。
- 部署与安全：Community 自部署、GHCR 镜像、Cloudflare Pages、环境变量、私有化部署、数据边界。
- 试点与交付：试点手册、教育版交付包、知识库初始化、成功指标。
- 校园场景：教师、学生、行政与学工。
- 路线图与 FAQ：版本路线和比赛/商业化常见问题。

## Community Edition 自部署

文档站已同步主仓库的 CE 自部署说明：

- 页面：<https://docs.qeedu.tech/zh/deployment/community-self-hosting>
- Compose 文件：<https://github.com/turmwerk/qeedu/blob/main/docker/docker-compose.release.yaml>
- 镜像仓库：`ghcr.io/turmwerk/qeedu-*`
- 已验证标签：`test-ce-20260604`

该标签已验证匿名拉取、完整栈启动、健康检查、前端代理、邮箱验证码注册和 `/api/v1/me` 登录态接口。

## 仓库结构

```text
qeedu-docs/
├── docs.json              # Mintlify 风格导航配置
├── zh/                    # 简体中文文档源
├── en/                    # 英文简版入口
├── src/                   # Vite 文档站渲染前端
├── public/                # Logo、字体、Cloudflare Pages _redirects
└── package.json
```

## 本地开发

```bash
pnpm install
pnpm dev
```

默认开发地址：

```text
http://localhost:5173
```

## 新增文档

1. 在 `zh/` 下创建 `.mdx` 文件。
2. 添加 YAML frontmatter：

```mdx
---
title: 页面标题
description: 页面描述
---
```

3. 在 `docs.json` 和 `src/App.tsx` 的 `groups` 中加入页面路径。
4. 运行 `pnpm build` 检查文档是否能被构建。

## 构建与部署

```bash
pnpm build
```

Cloudflare Pages 推荐配置：

| 项目 | 值 |
| --- | --- |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Production branch | `main` |

## 许可证

本仓库基于 [MIT License](LICENSE) 开源。
