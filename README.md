# tdcloud-docs

三狗云服务用户与开发者文档站，基于 Next.js App Router 与 Nextra 构建。

## 本地开发

环境要求：Node.js 22 或更高版本、pnpm 11。

GitHub Actions 使用 Node.js 22，pnpm 精确版本自动读取 `package.json` 的 `packageManager` 字段。CI 依次执行 `pnpm install --frozen-lockfile`、`pnpm exec next typegen`、`pnpm typecheck` 和 `pnpm build`；先生成路由类型，确保全新检出时也能完成类型检查。升级 pnpm 时应同步更新 `packageManager` 和锁文件，不需要在工作流中重复指定版本。

```bash
pnpm install
pnpm dev
```

默认开发服务运行在 `http://localhost:3000`。如需对照排查 Turbopack 问题，可运行 `pnpm dev:webpack`。

## 检查与构建

```bash
pnpm typecheck
pnpm build
```

构建结果输出到 `out/`，可直接部署到支持静态文件的网站服务。项目启用了尾斜杠路由，因此 `/zh/welcome/` 对应 `out/zh/welcome/index.html`，不依赖服务器额外配置无扩展名重写。

发布沿用 `main → GitHub Actions → out/ → gh-pages`，不在本次调整中变更 Cloudflare 项目的分支或构建设置。PR 只验证构建，不发布；`main` 推送或在 Actions 的 `Deploy static content` 中选择 `Run workflow`（分支选 `main`）可执行发布。

CI 在发布前运行 `node scripts/verify-export.mjs`，确认首页、中英文欢迎页、开发者入口和 JS/CSS 产物齐全；发布后重新读取远端 `gh-pages/deployment.json`，核对其中的 `commit` 是否等于本次源码 SHA。正式站是否更新还需核对该站的 `/deployment.json` 和实际页面，不能仅凭 `main` 的 Cloudflare 检查成功作结论。

若运行停在等待 runner，且 `Runner ready` 尚未执行，属于执行器尚未开始运行，不能通过修改文档内容或输出目录解决。保留该失败运行及错误信息，先检查 GitHub 托管执行器可用性，再重新运行原流程。

产物校验的回归测试：`node --test scripts/verify-export.test.mjs`。

中英文内容分别位于 `src/content/zh/` 与 `src/content/en/`。

## 构建取舍

当前公开文档没有图表、数学公式、阅读时长和代码高亮需求，因此通过 pnpm 补丁移除了 Nextra 对应的静态编译导入；Markdown 普通代码块仍可正常展示和复制。站内搜索也暂不展示，因为静态构建尚未生成 Pagefind 索引，保留搜索框只会增加前端资源且无法返回结果。

如果后续要启用这些能力，应先调整 `patches/` 和 `next.config.mjs`，并为搜索补齐 Pagefind 构建步骤及中英文索引验收，不能只恢复界面入口。
