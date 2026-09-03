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

中英文内容分别位于 `src/content/zh/` 与 `src/content/en/`。

## 构建取舍

当前公开文档没有图表、数学公式、阅读时长和代码高亮需求，因此通过 pnpm 补丁移除了 Nextra 对应的静态编译导入；Markdown 普通代码块仍可正常展示和复制。站内搜索也暂不展示，因为静态构建尚未生成 Pagefind 索引，保留搜索框只会增加前端资源且无法返回结果。

如果后续要启用这些能力，应先调整 `patches/` 和 `next.config.mjs`，并为搜索补齐 Pagefind 构建步骤及中英文索引验收，不能只恢复界面入口。
