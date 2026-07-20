# C-Lingo 官网

C-Lingo 品牌官网静态站点 — *Beyond Language. To Bigger Worlds.*

纯 HTML / CSS / JavaScript 单页应用，支持 **可分享的 clean URL**（如 `/experience`），无需构建步骤，可直接部署到任意静态托管平台。

## 项目结构

```
C-Lingo官网/
├── index.html              # 生产入口（部署用这个）
├── Web v3.0.html           # v3.3 版本检查点（当前里程碑快照）
├── Web v2.0.html           # 开发同步副本（与 index.html 保持一致）
├── Web v1.0.html           # 历史版本（仅供参考）
├── vercel.json             # Vercel 重定向 + SPA rewrite
├── start-lan.sh            # 本地 / 局域网 SPA 预览脚本
├── spa_server.py           # 带 fallback 的静态服务（clean URL）
├── js/
│   ├── router.js           # 路径路由（History API）
│   ├── experience-page.js  # 体验官活动页内容
│   ├── hsk-app-config.js   # HSK 平板应用 embed 地址
│   ├── hsk-page.js         # Try HSK 页（平板 iframe）
│   ├── api-config.js       # API 地址配置
│   └── clingo-api.js       # 账号 / 反馈 API 封装
├── account.html            # 账号登录 / 注册
├── feedback.html           # 用户反馈
├── assets/                 # 图片、Logo、字体、新闻图等
│   └── fonts/              # OPPO Sans 本地字体
└── Product Details/        # 平板详情页长图（详情页_01–10）
```

## 本地预览

> **复制命令时注意**：只复制命令本身，**不要**复制 markdown 的 ` ```bash ` 或 ` ``` ` 标记，否则终端会卡住并出现 `>` 续行提示。若已卡住，按 `Ctrl + C` 退出后重新执行。

先进入项目目录：

    cd "/Users/maxjellyfish/Desktop/C-Lingo官网"

### 本机

    chmod +x start-lan.sh
    ./start-lan.sh 8080

浏览器打开：http://localhost:8080/

### 局域网（iPad / 手机同 Wi-Fi 预览）

    ./start-lan.sh 8080

终端会显示局域网地址，例如 `http://192.168.18.94:8080/`。

**可分享路径示例**（刷新后仍停留在对应页面）：

- http://192.168.x.x:8080/experience
- http://192.168.x.x:8080/hsk
- http://192.168.x.x:8080/about
- http://192.168.x.x:8080/news

`start-lan.sh` 使用 `spa_server.py`，会将无静态文件的路径回落到 `index.html`。

### API 联调页面

- 账号：http://localhost:8080/account.html
- 反馈：http://localhost:8080/feedback.html
- API 默认地址：`http://localhost:3000`（见 `js/api-config.js`）
- HSK 模考 embed 默认地址：`http://localhost:3001`（见 `js/hsk-app-config.js`，需同时运行 AIOS `local-agent-app`）
- 后端项目：单独运行 `c-lingo-cms-backend` 的 `npm run dev`

### 备用：纯静态服务（不支持 clean URL）

    python3 -m http.server 8080 --bind 0.0.0.0

此方式下 `/experience` 会 404，请改用 `./start-lan.sh`。

## 部署

本项目为纯静态站点，**无需 build**。生产入口为根目录 `index.html`（路径 `/`）。

### Vercel（推荐，项目已配置 vercel.json）

`vercel.json` 含 SPA rewrite：静态资源优先，其余路径回落到 `index.html`。

#### 方式 A：命令行部署

    cd "/Users/maxjellyfish/Desktop/C-Lingo官网"
    npx vercel login
    npx vercel
    npx vercel --prod

首次运行 `npx vercel` 时的建议选项：

- Framework Preset: **Other**
- Build Command: **留空**（直接回车）
- Output Directory: **`.`**
- 最后一次 `npx vercel --prod` 发布到生产环境

#### 方式 B：GitHub + Vercel 网页部署

在 [Vercel Dashboard](https://vercel.com/dashboard) 中 Connect Git，Framework Preset 选 **Other**，Build Command 留空，Output Directory 为 **`.`**。

#### 部署后访问

- 预览地址：`https://你的项目名.vercel.app`
- 活动页：`https://你的项目名.vercel.app/experience`
- 自定义域名：在 Vercel 项目 **Settings → Domains** 中绑定

`vercel.json` 已将 `/Web v2.0.html`、`/Web v3.0.html` 等旧路径永久重定向到 `/`。

### 其他静态托管

需配置 **SPA fallback**（所有非静态文件路径 → `index.html`），例如 Netlify `_redirects`、Cloudflare Pages、Nginx `try_files`.

## 常见问题

**终端出现 `>` 且不启动服务**

- 原因：误粘贴了 README 中的 markdown 代码块标记
- 处理：按 `Ctrl + C` 退出，重新逐行粘贴命令

**浏览器打不开 localhost:8080**

- 确认终端里已显示 `Serving SPA on ...`
- 确认访问的是 `http://localhost:8080/`（不是 https）
- 若端口被占用，可换端口：`./start-lan.sh 3009`

**启动时报 `Address already in use`**

      kill $(lsof -t -iTCP:8080 -sTCP:LISTEN)
      ./start-lan.sh 8080

**局域网 IP 在 iPad 上打不开**

- 本机先确认能打开：`http://localhost:8080/`
- iPad 必须与 Mac **同一 Wi-Fi**；注意 172.x 与 192.168.x 网段不一致的情况

## 页面与 URL 路由

站内通过 `goTo('page-id')` 切换页面，并与浏览器地址栏同步。主要映射：

| URL 路径 | 页面 ID | 说明 |
|----------|---------|------|
| `/` | `home` | 首页（含体验官 Banner / 活动卡片） |
| `/methodology` | `methodology` | 方法论 |
| `/products` | `products` | 产品列表 |
| `/product-tablet` | `product-tablet` | AI 学习平板详情 |
| `/product-scanpen` | `product-scanpen` | 中文扫描笔详情 |
| `/about` | `about` | 关于我们 |
| `/partners` | `partners` | 合作伙伴 |
| `/experience` | `experience` | **体验官活动页** |
| `/hsk` | `hsk` | **HSK 模考体验（平板 embed）** |
| `/news` | `news` | 新闻列表 |
| `/news/utar` | `news-article` | UTAR AI 中文教育交流 |
| `/news/brics` | `news-article-brics` | BRICS+ 科技政策实践营 |
| `/news/launch` | `news-article-launch` | 发布会新闻 |
| `/news/vietnam` | `news-article-vietnam` | Education Vietnam 2026 |
| `/news/values` | `news-article-values` | Clarity / Confidence / Connection |
| `/news/interview` | `news-article-interview` | Team Spotlight |

顶栏 **About** 下拉：About Us · Methodology · Partners · News & Updates；**Try HSK** 与 **Experience（Try FREE）** 为 Home 旁独立 Tab（共 5 个主导航项）。

## 开发约定

- 功能改动请**同时更新** `index.html` 与 `Web v2.0.html`
- **`Web v3.0.html`** 为 **v3.3 里程碑检查点**，仅在发布节点更新，日常开发勿改
- 活动页文案在 `js/experience-page.js`，路由逻辑在 `js/router.js`
- 线上入口为 `index.html`（路径 `/`）
- 通用资源放在 `assets/`，平板详情长图放在 `Product Details/`
- 字体：OPPO Sans 本地托管于 `assets/fonts/`；其余为 Google Fonts、YouTube 嵌入

## 技术栈

- 纯 HTML / CSS / JavaScript（无框架、无 npm 依赖）
- History API 路由 + SPA 静态 fallback
- 响应式布局，支持 iPad 预览与局域网调试

## 许可证

© 2026 HK NSK IT LIMITED. All rights reserved.
