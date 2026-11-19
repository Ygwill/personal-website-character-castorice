#!/usr/bin/env bash
# 抓取 Mar-7th/StarRailRes（官方游戏数据的解包索引，中文服）到 tools/raw/
# 索引会随版本更新，重新生成 character.js 前请先跑这个脚本。
set -euo pipefail

BRANCH="${BRANCH:-master}"
LANG_DIR="${LANG_DIR:-cn}"
BASE="https://raw.githubusercontent.com/Mar-7th/StarRailRes/${BRANCH}/index_new/${LANG_DIR}"
OUT="$(cd "$(dirname "$0")" && pwd)/raw"
mkdir -p "$OUT"

FILES=(
  characters            # 角色基础字段：ID、命途、属性、能量上限、立绘路径
  character_skills      # 技能文本 + 每级参数（#1[f1]% 之类占位符）
  character_skill_trees # 行迹
  character_ranks       # 星魂
  character_promotions  # 晋阶属性档位与材料
  items                 # 材料名（id -> name、图标）
  descriptions          # 档案 / 背景文案
  nickname              # 角色别名
  elements              # 战斗属性（含图标）
  paths                 # 命途（含图标）
  properties            # 属性名（行迹强化节点显示成中文）
)


for f in "${FILES[@]}"; do
  dest="$OUT/$f.json"
  if curl -fsSL --retry 5 --retry-all-errors --max-time 180 \
       -o "$dest.tmp" "$BASE/$f.json"; then
    mv "$dest.tmp" "$dest"
    printf '%-24s %8d B\n' "$f.json" "$(stat -c%s "$dest")"
  else
    rm -f "$dest.tmp"
    echo "!! $f.json 下载失败" >&2
    exit 1
  fi
done
echo "-> $OUT"
