// 资源解析：解包索引里的图标是文件名（1415_skill.png），这里按 basename 映射到本地 assets
const icons = import.meta.glob('../assets/icons/*.png', { eager: true, import: 'default' })
const charImgs = import.meta.glob('../assets/char/*', { eager: true, import: 'default' })
const items = import.meta.glob('../assets/items/*.png', { eager: true, import: 'default' })

function pick(map, name) {
  if (!name) return ''
  const hit = Object.keys(map).find((p) => p.endsWith('/' + name))
  return hit ? map[hit] : ''
}

export function iconUrl(name) {
  return pick(icons, name) || pick(items, name) || ''
}
export function charUrl(name) {
  return pick(charImgs, name)
}
