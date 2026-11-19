// 临时脚本：用 SSR 把每个栏目渲染一遍，检查模板里有没有 undefined / NaN / 取值错误。
// 用法：npm run check（= vite build --ssr + node，逐个栏目渲染，看有没有 undefined / NaN / 缺字段）
import fs from 'node:fs'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import character from '../src/data/character.js'
import snapshot from '../src/data/snapshot.js'
import SiteHeader from '../src/components/SiteHeader.vue'
import CharHero from '../src/components/CharHero.vue'
import InfoPanel from '../src/components/InfoPanel.vue'
import StatsPanel from '../src/components/StatsPanel.vue'
import SkillsPanel from '../src/components/SkillsPanel.vue'
import PoemsPanel from '../src/components/PoemsPanel.vue'
import TracesPanel from '../src/components/TracesPanel.vue'
import EidolonsPanel from '../src/components/EidolonsPanel.vue'
import LorePanel from '../src/components/LorePanel.vue'
import SourcesPanel from '../src/components/SourcesPanel.vue'
import SiteFooter from '../src/components/SiteFooter.vue'

const comps = { SiteHeader, CharHero, InfoPanel, StatsPanel, SkillsPanel, PoemsPanel,
  TracesPanel, EidolonsPanel, LorePanel, SourcesPanel, SiteFooter }

async function main() {
  let total = 0
  const parts = {}
  for (const [cname, C] of Object.entries(comps)) {
    const html = await renderToString(createSSRApp(C, { char: character, snapshot }))
    parts[cname] = html
    fs.writeFileSync('/tmp/ssr-' + cname + '.html', html)
    total += html.length
    const bad = /undefined|NaN|\[object Object\]/.test(html)
    console.log(`${bad ? '!!' : 'ok'} ${cname.padEnd(13)} ${String(html.length).padStart(6)} B`)
    if (bad) console.log('   ', (html.match(/.{50}(undefined|NaN|\[object Object\]).{30}/g) || []).slice(0, 3).join('\n     '))
  }
  const joined = Object.values(parts).join('\n').replace(/<[^>]+>/g, ' ')
  console.log('---- 关键内容抽查 ----')
  const keys = ['昔涟', '冰', '记忆', '看，希望的起始！', '盛放吧，来世的乐土', '众愿啊，汇流如歌',
    '记忆的净子', '空白，在诗篇的起点', '恐惧踏碎血肉', '海妖残鳍', 'Mar-7th/StarRailRes', '尚未确认',
    '德谬歌', '献予「真我」之诗', '长夜月', '1319', '5%']
  const miss = keys.filter((k) => !joined.includes(k))
  miss.forEach((k) => console.log('✗ 缺失 ' + k))
  console.log('关键串 %d/%d 命中，总渲染字节 %d（模板不存图，故无 <img> 属正常）',
    keys.length - miss.length, keys.length, total)
}
main()
