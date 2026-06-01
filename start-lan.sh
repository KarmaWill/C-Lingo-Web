#!/bin/bash
# C-Lingo 官网 — 局域网 / 本地 SPA 预览（支持 /experience 等 clean URL）
# 用法: ./start-lan.sh [端口]   默认 8080

PORT="${1:-8080}"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "❌ 端口 ${PORT} 已被占用，服务无法启动。"
  echo ""
  echo "占用进程："
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN
  echo ""
  echo "处理方式（任选其一）："
  echo "  1. 结束占用进程后重试，例如："
  echo "     kill \$(lsof -t -iTCP:${PORT} -sTCP:LISTEN)"
  echo "     ./start-lan.sh ${PORT}"
  echo "  2. 换用其他端口，例如："
  echo "     ./start-lan.sh 3009"
  exit 1
fi

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  C-Lingo 官网 — SPA 局域网服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  本机访问:   http://localhost:${PORT}/"
if [ -n "$IP" ]; then
  echo "  局域网访问: http://${IP}:${PORT}/"
fi
echo ""
echo "  可分享路径示例:"
echo "    http://localhost:${PORT}/experience"
echo "    http://localhost:${PORT}/about"
echo ""
echo "  本机所有可用 IP（iPad 连不上时可逐个尝试）："
ifconfig | awk '/inet / && $2 != "127.0.0.1" { printf "    http://%s:%s/\n", $2, "'"$PORT"'" }'
echo ""
echo "  iPad 须与 Mac 在同一网络"
echo "  按 Ctrl+C 停止服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 spa_server.py "$PORT"
