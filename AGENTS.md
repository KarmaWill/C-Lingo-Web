# C-Lingo 官网

纯静态 SPA,没有构建步骤,不需要 npm。

## 启动(必须用这个方式)

```bash
chmod +x start-lan.sh
./start-lan.sh 8008
# → http://127.0.0.1:8008/hsk
```

**不要用 `python3 -m http.server`。** 普通静态服务器不做 SPA 回退,刷新 `/hsk`、`/experience` 这类 clean URL 会返回 404。必须用 `start-lan.sh` 或它调用的 `spa_server.py`。

端口被占用时脚本会直接报错并列出占用进程,不会静默失败。

## 目录

```text
index.html          入口
js/router.js        前端路由
js/hsk-page.js      HSK 页面逻辑
js/hsk-app-config.js  平板端嵌入地址配置
js/api-config.js
js/clingo-api.js
js/clingo-cms.js
spa_server.py       SPA 回退服务器
start-lan.sh        启动脚本
vercel.json         生产部署配置
Web v1.0/2.0/3.0.html  历史设计稿,不是线上页面
```

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
