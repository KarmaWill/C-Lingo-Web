#!/bin/bash
# C-Lingo 官网原型 — 局域网启动脚本
# 用法: ./start-lan.sh  或  bash start-lan.sh

PORT="${1:-8080}"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  C-Lingo 官网原型 v2.0 — 局域网服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ -n "$IP" ]; then
  echo "  本机访问:   http://localhost:${PORT}/"
  echo "  局域网访问: http://${IP}:${PORT}/"
  echo ""
  echo "  同一 Wi-Fi 下的 iPad / 手机 / 电脑浏览器打开上述地址即可"
else
  echo "  本机访问:   http://localhost:${PORT}/"
  echo "  (未能自动获取 IP，请在系统设置中查看本机局域网地址)"
fi
echo ""
echo "  按 Ctrl+C 停止服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 -m http.server "$PORT" --bind 0.0.0.0
