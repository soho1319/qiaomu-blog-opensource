# Qiaomu Blog Open Source

基于 Cloudflare Workers + OpenNext + Next.js 16 + D1 + R2 的开源博客模板。默认只要求 `D1 + R2`，`KV / Queues / Workers AI / Vectorize / 图片增强` 都是可选增强能力。

这个仓库适合直接 `Use this template` 或 `fork` 后部署成你自己的博客。

## 内置能力

- Novel / Tiptap 可视化编辑器
- D1 + SQLite FTS5 全文搜索
- Cloudflare Workers 边缘部署
- 4 套首页主题：默认、精致极简、杂志编辑、AI 终端
- 后台可切换主题和正文字体
- 内置 AI 文本供应商预设
- 内置 AI 生图供应商预设
- 内置摘要、标签、slug、封面生成器

AI 相关预设不会携带任何 API Key。首次进入后台设置页时会自动初始化到数据库。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- OpenNext for Cloudflare
- Cloudflare D1
- Cloudflare R2
- Novel / Tiptap

## 快速开始

### 1. 创建你自己的仓库

- 直接点击 GitHub 上的 `Use this template`
- 或克隆本仓库：

```bash
git clone https://github.com/joeseesun/qiaomu-blog-opensource.git
cd qiaomu-blog-opensource
npm install
```

### 2. 配置本地环境变量

```bash
cp .env.example .env.local
```

最少需要：

```env
ADMIN_PASSWORD=change-me
ADMIN_TOKEN_SALT=change-me-to-a-random-string
AI_CONFIG_ENCRYPTION_SECRET=change-me-to-another-random-string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 本地开发

```bash
npm run dev
```

常用入口：

- 首页：`/`
- 后台：`/admin`
- 编辑器：`/editor`

如果你要用 Worker 运行时本地预览：

```bash
npm run preview
```

## 初始化 Cloudflare

先登录：

```bash
npx wrangler login
```

然后执行：

```bash
npm run cf:init -- --site-url=https://your-domain.com
```

如果你还要创建公共缓存 KV：

```bash
npm run cf:init -- --site-url=https://your-domain.com --with-kv
```

`npm run cf:init` 会自动：

1. 从模板 `wrangler.toml` 复制出本地 `wrangler.local.toml`
2. 创建 D1 数据库
3. 创建 R2 bucket
4. 可选创建 KV namespace
5. 写入真实 Cloudflare 绑定
6. 执行 `db/schema.sql`
7. 执行 `db/seed-template.sql`

初始化后，默认主题、默认字体和默认导航会直接可用。

## 部署

先设置 secrets：

```bash
npx wrangler secret put ADMIN_PASSWORD -c wrangler.local.toml
npx wrangler secret put ADMIN_TOKEN_SALT -c wrangler.local.toml
npx wrangler secret put AI_CONFIG_ENCRYPTION_SECRET -c wrangler.local.toml
```

如果你要启用外部 AI：

```bash
npx wrangler secret put AI_API_KEY -c wrangler.local.toml
```

然后：

```bash
npm run cf-typegen
npm run build
npm run deploy
```

当前链路是 OpenNext + Cloudflare Workers，不是 Cloudflare Pages。

## 资源要求

必需：

- `D1`
- `R2`

可选：

- `KV`
- `Queues`
- `Workers AI`
- `Vectorize`

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | Next.js 本地开发 |
| `npm run preview` | Worker 运行时本地预览 |
| `npm run build` | Next.js 构建 |
| `npm run verify:quick` | lint + test + build |
| `npm run verify` | 完整校验，额外包含 OpenNext build |
| `npm run cf:init` | 初始化 Cloudflare 资源和模板默认设置 |
| `npm run cf-typegen` | 生成 Cloudflare 类型 |
| `npm run deploy` | 部署到 Cloudflare Workers |

## 模板约定

- 提交到 Git 的 `wrangler.toml` 永远只放模板配置
- 真实资源绑定写进本地 `wrangler.local.toml`
- 仓库不包含任何私有资源 ID、私有域名、私有 API Key
- AI 功能默认可关闭，不会阻塞博客的写作、发布、搜索和展示

## License

MIT
