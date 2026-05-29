# C-Lingo 官网

C-Lingo 品牌官网静态站点 — *Beyond Language. To Bigger Worlds.*

纯 HTML / CSS / JavaScript 单页应用，无需构建步骤，可直接部署到任意静态托管平台。

## 项目结构

```
C-Lingo官网/
├── index.html          # 生产入口（部署用这个）
├── Web v2.0.html       # 开发同步副本（与 index.html 保持一致）
├── Web v1.0.html       # 历史版本（仅供参考）
├── vercel.json         # Vercel 重定向配置
├── start-lan.sh        # 本地 / 局域网预览脚本
├── assets/             # 图片、Logo、新闻图等
└── Product Details/    # 平板详情页长图（详情页_01–10）
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

终端会显示局域网地址，例如 `http://192.168.x.x:8080/`。

### API 联调页面

- 账号：http://localhost:8080/account.html
- 反馈：http://localhost:8080/feedback.html
- API 默认地址：`http://localhost:3000`（见 `js/api-config.js`）

### 备用：Python 静态服务

    python3 -m http.server 8080 --bind 0.0.0.0

## 部署

本项目为纯静态站点，**无需 build**。生产入口为根目录 `index.html`（路径 `/`）。

### Vercel（推荐，项目已配置 vercel.json）

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

    cd "/Users/maxjellyfish/Desktop/C-Lingo官网"
    git add .
    git commit -m "Prepare C-Lingo site for deployment"
    git push origin main

然后在 [Vercel Dashboard](https://vercel.com/dashboard) 中：

1. **Add New → Project**
2. 选择 GitHub 仓库
3. Framework Preset: **Other**
4. Build Command: **留空**
5. Output Directory: **`.`**
6. 点击 **Deploy**

#### 部署后访问

- 预览地址：`https://你的项目名.vercel.app`
- 自定义域名：在 Vercel 项目 **Settings → Domains** 中绑定（如 `clingo.hk`）

`vercel.json` 已将 `/Web v2.0.html` 等旧路径永久重定向到 `/`。

### 其他静态托管

将整个仓库根目录上传即可，无需构建：

- Netlify（拖拽或 Connect Git）
- Cloudflare Pages
- GitHub Pages
- Nginx / Apache 等自有服务器

## 常见问题

**终端出现 `>` 且不启动服务**

- 原因：误粘贴了 README 中的 ` ```bash ` 等 markdown 标记
- 处理：按 `Ctrl + C` 退出，重新逐行粘贴命令

**浏览器打不开 localhost:8080**

- 确认终端里已显示 `Serving HTTP on ... port 8080`
- 确认访问的是 `http://localhost:8080/`（不是 https）
- 若端口被占用，可换端口：`./start-lan.sh 3009`

**启动时报 `Address already in use` / 端口已被占用**

- 原因：旧的服务进程未退出，占用了 8080 端口且可能已僵死
- 处理：

      kill $(lsof -t -iTCP:8080 -sTCP:LISTEN)
      ./start-lan.sh 8080

- 或换端口：`./start-lan.sh 3009`

**局域网 IP（如 172.26.x.x）在 iPad 上打不开**

- 本机先确认能打开：`http://localhost:8080/`
- iPad 必须与 Mac **同一 Wi-Fi**；若 Mac 显示 `172.26.x.x` 而 iPad 在 `192.168.x.x`，说明不在同一网段，请在 Mac「系统设置 → 网络 → Wi-Fi → 详细信息」查看 Wi-Fi IP
- 启动脚本会列出本机所有 IP，可逐个在 iPad 上尝试

## 页面说明

通过 `goTo('page-id')` 切换页面，主要路由如下：

| 页面 ID | 说明 |
|---------|------|
| `home` | 首页 |
| `methodology` | 方法论 |
| `products` | 产品列表 |
| `product-tablet` | AI 学习平板详情 |
| `product-scanpen` | 中文扫描笔详情 |
| `about` | 关于我们 |
| `partners` | 合作伙伴 |
| `news` | 新闻列表 |
| `news-article` | 发布会新闻 |
| `news-article-vietnam` | Education Vietnam 2026 |
| `news-article-values` | Clarity / Confidence / Connection |
| `news-article-interview` | Team Spotlight（含 YouTube 视频） |

## 开发约定

- 功能改动请**同时更新** `index.html` 与 `Web v2.0.html`
- 线上入口为 `index.html`（路径 `/`）
- 通用资源放在 `assets/`，平板详情长图放在 `Product Details/`
- 外部依赖：Google Fonts、YouTube 嵌入与缩略图、OPPO Sans CDN

## 技术栈

- 纯 HTML / CSS / JavaScript（无框架、无 npm 依赖）
- 单文件内联样式与脚本
- 响应式布局，支持 iPad 预览与局域网调试

## 许可证

© NSK Smart Education. All rights reserved.
