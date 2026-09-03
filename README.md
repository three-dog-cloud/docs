# tdcloud-docs

三狗云服务用户与开发者文档站，基于 Next.js App Router 与 Nextra 构建。

## 本地开发

环境要求：Node.js 22.22.3（见 `.node-version`）、pnpm 11.7.0（见 `package.json#packageManager`）。

Cloudflare Pages 负责安装依赖、校验、构建与发布。GitHub Actions 只保留手动校验入口，使用相同的 `pnpm run ci`，不会发布网站。升级 Node.js 或 pnpm 时，同步更新版本文件与 Cloudflare 的构建环境变量。

```bash
pnpm install
pnpm dev
```

默认开发服务运行在 `http://localhost:3000`。如需对照排查 Turbopack 问题，可运行 `pnpm dev:webpack`。

## 检查与构建

```bash
pnpm install --frozen-lockfile
pnpm run ci
```

构建结果输出到 `out/`，可直接部署到支持静态文件的网站服务。项目启用了尾斜杠路由，因此 `/zh/welcome/` 对应 `out/zh/welcome/index.html`，不依赖服务器额外配置无扩展名重写。

`pnpm run ci` 按顺序执行路由类型生成、TypeScript 检查、回归测试、Next.js 静态构建和产物校验；任一步失败都会停止发布。校验通过后才生成 `out/deployment.json`，其中 `commit` 来自 Cloudflare 的 `CF_PAGES_COMMIT_SHA`。手动 GitHub 校验使用 `GITHUB_SHA`；本地构建使用当前 Git HEAD，本地未提交改动不会体现在这个 SHA 中。

## Cloudflare Pages 发布配置

发布链路为 `main → Cloudflare Pages 构建与校验 → out/ → Cloudflare Pages 托管`。不再依赖 `gh-pages` 产物分支，也不需要 GitHub Pages 或 GitHub 托管 runner。

在现有 Cloudflare Pages 项目 `docs` 的设置中配置以下内容。提交仓库文件不会自动更改后台的构建命令或生产分支，迁移时必须同步设置：

| 设置 | 值 |
| --- | --- |
| Git 仓库 | `three-dog-cloud/docs` |
| Production branch | `main` |
| Framework preset | `Next.js (Static HTML Export)` |
| Root directory | 留空，使用仓库根目录 |
| Build command | `pnpm install --frozen-lockfile && pnpm run ci` |
| Build output directory | `out` |
| Build system | v3 |

Production 和 Preview 环境均设置：

| 环境变量 | 值 |
| --- | --- |
| `NODE_VERSION` | `22.22.3` |
| `PNPM_VERSION` | `11.7.0` |
| `SKIP_DEPENDENCY_INSTALL` | `1` |

关闭自动依赖安装后，由上面的构建命令显式使用锁文件安装，避免重复安装或误用 npm。不要手动设置 Cloudflare 自动注入的 `CF_PAGES_COMMIT_SHA`。启用 `main` 的自动生产部署；其他源码分支可启用预览部署，并排除旧产物分支 `gh-pages`。

首次切换先验证新的 Pages 部署地址，再确认 `docs.tdcloud.cc` 已绑定到这个 Cloudflare Pages 项目且 DNS 指向正确。如果 GitHub Pages 仍绑定同一域名，应在 Cloudflare 域名验证完成后清理旧绑定，避免误把旧站仍可访问当作新版本已上线。

## 上线验收

使用本次源码的完整 SHA 验证 Cloudflare 的部署地址和正式域名：

```bash
pnpm verify:deployment https://<deployment>.docs-6bp.pages.dev <source-commit-sha>
pnpm verify:deployment https://docs.tdcloud.cc <source-commit-sha>
```

脚本核对 `/deployment.json` 的源码版本、中英文主要页面，以及页面引用的 JS/CSS 资源。Cloudflare 检查显示成功只代表它完成了配置中的部署操作；预览地址 404 或版本不一致都不能算发布完成。

回归测试：`pnpm test`。仅需本地开发构建时仍可使用 `pnpm build`；正式部署必须使用包含校验和版本标记的 `pnpm run ci`。

GitHub 中的 `Validate docs (manual)` 仅用于需要时手动复查构建。其 runner 不可用不会阻塞 Cloudflare 的生产与预览部署。

参考：[Cloudflare 静态 Next.js 部署](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)、[构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[构建环境与版本](https://developers.cloudflare.com/pages/configuration/build-image/)。

中英文内容分别位于 `src/content/zh/` 与 `src/content/en/`。

内容维护的实现依据、覆盖范围和后续补充条件见 [文档内容覆盖与维护](docs/content-coverage.md)。更新操作说明时，应同步两个语言版本，并核对前端入口与后端真实行为。

## 构建取舍

当前公开文档没有图表、数学公式、阅读时长和代码高亮需求，因此通过 pnpm 补丁移除了 Nextra 对应的静态编译导入；Markdown 普通代码块仍可正常展示和复制。站内搜索也暂不展示，因为静态构建尚未生成 Pagefind 索引，保留搜索框只会增加前端资源且无法返回结果。

如果后续要启用这些能力，应先调整 `patches/` 和 `next.config.mjs`，并为搜索补齐 Pagefind 构建步骤及中英文索引验收，不能只恢复界面入口。
