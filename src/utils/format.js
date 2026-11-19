// —— 数值还原：把官方文本里的 #1[f1]% 之类占位符按等级换成真实数字 ——
// 规则（已用长夜月/昔涟的解包数据验证）：
//   [i]  → 整数；   [f1] → 1 位小数；   [f2] → 2 位小数
//   占位符后紧跟 % 时，把原始小数 ×100 再格式化
export function fillParams(text, row) {
  if (!text) return ''
  return text.replace(/#(\d+)\[([a-z0-9]+)\](%?)/g, (m, idx, fmt, pct) => {
    const raw = row?.[Number(idx) - 1]
    if (raw === undefined || raw === null) return m
    const v = pct ? raw * 100 : raw
    if (fmt === 'i') return stripZeros(round(v, 2)) + pct
    const digits = fmt === 'f2' ? 2 : 1
    return v.toFixed(digits) + pct
  })
}

function round(n, p) {
  const k = 10 ** p
  return Math.round(n * k) / k
}
function stripZeros(n) {
  return String(round(n, 2))
}

// —— 等级属性：base + step ×(等级-1)，向下取整 ——
// 该算法已与 bwiki 长夜月属性表逐格核对（Lv20 350/421、Lv80 1319/543/582 等）
export function statAt(tier, level) {
  return Math.floor(tier.base + tier.step * (level - 1))
}

export function pct(v, digits = 0) {
  return (v * 100).toFixed(digits) + '%'
}

// 信用点等数字加千分位
export function grouped(n) {
  return Number(n).toLocaleString('en-US')
}
