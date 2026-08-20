# C-Lingo 官网

纯静态 SPA,没有构建步骤,不需要 npm。

## 启动(必须用这个方式)

```bash
chmod +x start-lan.sh
./start-lan.sh 8008
# → http://127.0.0.1:8008/hsk
# 双栏预览（网页 1440 + 手机 390，仅本地）: http://127.0.0.1:8008/preview
```

**不要用 `python3 -m http.server`。** 普通静态服务器不做 SPA 回退,刷新 `/hsk`、`/experience` 这类 clean URL 会返回 404。必须用 `start-lan.sh` 或它调用的 `spa_server.py`。

端口被占用时脚本会直接报错并列出占用进程,不会静默失败。

## 目录

```text
index.html          入口
js/router.js        前端路由
js/home-bgm.js      首页 BGM 迷你播放器
js/hsk-page.js      HSK 页面逻辑
js/hsk-app-config.js  平板端嵌入地址配置
js/api-config.js
js/clingo-api.js
js/clingo-cms.js
assets/audio/       首页歌单本地音源(mp3)
preview.html        本地双栏预览（网页+手机），生产会重定向走
spa_server.py       SPA 回退服务器
start-lan.sh        启动脚本
vercel.json         生产部署配置
Web v1.0/2.0/3.0.html  历史设计稿,不是线上页面
```

## 首页 BGM 播放器

仅 `#page-home` 显示右下角 BGM 控件。逻辑在 `js/home-bgm.js`,路由切换时由 `router.js` 调 `syncHomeBgm()`。

### 行为(已拍板)

- **默认收起**:只有约 44px 圆形播放/暂停钮;展开后才出歌名 + 上一首/下一首/静音
- **展开/收起**:桌面悬停展开、移开收起;点击也可展开;点页面空白收起。触摸端正在播放时点圆钮先展开(不直接暂停);被拦自动播时点圆钮直接播放且保持收起
- 进首页**立即尝试有声自动播放**(目标体验:打开即响)
- 若被浏览器拦截:圆钮脉冲高亮,点圆钮播放;同时仍监听页面任意首次手势起播
- 播放中收起态圆钮显示**暂停图标**
- 歌单固定顺序循环到末尾再回第一首
- 用户点暂停后,本会话(`sessionStorage`)不再自动播;离开首页只暂停,不算「用户暂停」
- 说明:Chrome/Safari/iOS 对「从未互动就出声」有硬限制,无法 100% 保证零手势出声
- 默认音量约 `0.32`,静音状态本会话记住
- 缺文件时自动跳过该曲,继续下一首

### 音源规则

**禁止**把 Suno 分享页 URL 当作 `<audio src>`。Suno 只作文案/曲目来源;必须导出本地文件放进 `assets/audio/`。

| # | 曲名 | 文件 | Suno 来源 |
|---|---|---|---|
| 1 | Beyond Language | `01-beyond-language.mp3` | https://suno.com/s/Pg7yHwGRxmbioDoz |
| 2 | Beyond Language Y | `02-beyond-language-y.mp3` | https://suno.com/s/e6F0ZEePbedBijGp |
| 3 | Lumi-Nation (OP) | `03-lumi-nation-op.mp3` | https://suno.com/s/T8iRA6gHNFqL3r1M |
| 4 | Lumi-Nation (Musical) | `04-lumi-nation-musical.mp3` | https://suno.com/s/z9ktnhOEpie36ptv |
| 5 | Beyond Language (Global Version) | `05-beyond-language-global.mp3` | https://suno.com/s/bdztZwE6SgN4GRNT |
| 6 | Beyond Language Z | `06-beyond-language-z.mp3` | https://suno.com/s/1YyhyYhiORokjtkg |
| 7 | 探索者 | `07-explorer.mp3` | https://suno.com/s/yXJFtJLJpadkh2X6 |
| 8 | The Explorer | `08-the-explorer.mp3` | https://suno.com/s/skwOfICJYuB4lPri |

改歌单只改 `js/home-bgm.js` 的 `PLAYLIST`,并同步本表与文件名。

## 首页视觉抛光(进行中)

原则:**不砍业务信息,不改文案去向,不换品牌色。** 一个模块一个模块抬工艺。主受众倾向家长/机构决策人,但首页现有板块全部保留。

### Hero CTA 行(已拍板 · 2026-08-14)

范围:4 张首页 Hero 片共用的 `.hero-slides .hero-actions`,不是全站 `.btn-primary`。

- 文案与跳转不动:`Explore C-Lingo` → about;`Explore Products` + `Try HSK Mock →` → products / hsk;`Explore Methodology` → methodology;`Apply NOW` → experience#apply
- 主钮:实心 `--ink`(森绿),不要渐变绿胶囊;悬停到 `--accent-strong`;有偏移阴影,不要外发光
- 次钮(仅 Products 片):描边幽灵,透明底
- `NOW` 与主钮同字重,不再加粗吼叫
- 不改导航 Partnerships、不改页内其他按钮

### Hero 字体与板式(已拍板 · 2026-08-14)

范围:首页 `<section class="hero">` 四张轮播片。文案、`<br>`、路由、其他板块的 `.hero-label` 胶囊都不动。

- 左对齐文案 + 右侧平板静物实拍(`assets/hero-tablet.webp`),贴 1200 栅格;右边不能空
- 标题 IBM Plex Serif,约 36–60px,字距 -0.028em;副文/备注改 DM Sans 15–17px,和标题分家
- 片标(Who We Are 等)去掉胶囊,只留大写字标;字还在
- 光斑跟字走(偏左)；双栏后取消游离金线，平板只用偏移 drop-shadow 落地
- 圆点跟字列左齐;窄屏 `24px` 边距,钮可换行
- 不改 Methodology / Products / Experience / NSK / 新闻

### About intro(已拍板 · 2026-08-19)

范围:首页 `section.about-intro-section`。文案、数字、跳转不动。3D logo 撤出这一屏(About 页仍保留)。

- 工作:信任证据。左文案 + 两钮,右森绿实底 `#004735` 三行白字数字
- `12+` Years Experience 最大,跟 h2 押韵;`40M+` / `400+` 配角,行间发丝线
- 数字 IBM Plex Serif;去掉 `About NSK & C-Lingo` 片标
- 钮跟 Hero 对齐:Explore Products 实心 `--ink`,Partner With Us 幽灵描边。不改全站 `.btn-dark`
- 窄屏先左文后右卡

## 平板端嵌入

`js/hsk-app-config.js` 按 hostname 判断环境:

- 本地 / 局域网(`localhost`、`127.0.0.1`、`192.168.*`、`10.*`、`172.16-31.*`)→ 嵌 `当前协议://当前host:3001`
- 其他 → 嵌 `https://app.clingoaios.com`

嵌入 URL 由 `buildHskEmbedUrl()` 拼装,带 `mode=website`、`skin`、`track` 参数,指向 `/hsk-prep-training`。

**官网页面空白、拒绝连接或一直加载时,先查平板端 3001 有没有起来,不要先改官网代码。**

## 职责边界(一期)

官网只承载 iframe 和页面布局。**不保存考试状态、题目、答案、计时或成绩。**

唯一允许的跨 iframe 通信是:iframe 向官网单向发送「是否存在进行中作答」的生命周期标志,用于关闭/离开确认。不传输任何业务数据。

用户在考试中关闭模拟平板弹窗时:官网先提示考试仍在进行,确认后销毁 iframe 停止音频和页面运行,但**不清理作答缓存或后端作答记录**。

## 注意

官网当前的宣传文案属于早期设计,不作为一期验收范围,也不据此扩展功能。
