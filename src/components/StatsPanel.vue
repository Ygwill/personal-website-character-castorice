<script setup>
import { computed } from 'vue'
import { statAt } from '../utils/format.js'
import { iconUrl } from '../utils/assets.js'
const props = defineProps({ char: { type: Object, required: true } })

// 解包给的是 7 个晋阶档的 base/step；同一档内线性增长：base + step ×(等级-1)
// 该算法已与 bwiki 长夜月属性表逐格核对（Lv20 前 350 / 后 421、Lv80 1319 543 582）
const THRESHOLDS = [1, 20, 30, 40, 50, 60, 70]   // 各档的解锁等级
const levels = [1, 20, 30, 40, 50, 60, 70, 80]

function currentTier(level) {
  let idx = 0
  THRESHOLDS.forEach((l, i) => { if (level >= l) idx = i })
  return idx
}

// 晋阶等级这一行：「突破前」= 未吃本次晋阶（上一档），「突破后」= 已晋阶（本档）
function pairFor(level) {
  const tiers = props.char.tiers
  if (level === 1) return { pre: tiers[0], post: null }
  const idx = THRESHOLDS.indexOf(level)
  if (idx > 0) return { pre: tiers[idx - 1], post: tiers[idx] }
  return { pre: tiers[currentTier(level)], post: null }
}

const table = computed(() =>
  levels.map((lv) => {
    const { pre, post } = pairFor(lv)
    const cell = (k) => ({ pre: statAt(pre[k], lv), post: post ? statAt(post[k], lv) : null })
    return {
      lv,
      hp: cell('hp'), atk: cell('atk'), def: cell('def'),
      spd: Math.round(pre.spd.base),
    }
  }),
)

function pct(v) { return (v * 100).toFixed(1).replace(/\.0$/, '') + '%' }

// 80 级满晋阶面板；暴击率 / 暴击伤害是初始值，不随晋阶变化（解包里 base 恒定、step 为 0）
const maxStats = computed(() => {
  const t = props.char.tiers.at(-1)
  return {
    hp: statAt(t.hp, 80), atk: statAt(t.atk, 80), def: statAt(t.def, 80),
    spd: Math.round(t.spd.base),
    critRate: pct(t.crit_rate.base), critDmg: pct(t.crit_dmg.base),
  }
})
const ascension = computed(() => props.char.ascension)
</script>

<template>
  <div class="grid">
    <div class="panel">
      <h2 class="panel-title">80 级面板（无加成）</h2>
      <ul class="max">
        <li><span>生命值</span><b>{{ maxStats.hp }}</b></li>
        <li><span>攻击力</span><b>{{ maxStats.atk }}</b></li>
        <li><span>防御力</span><b>{{ maxStats.def }}</b></li>
        <li><span>速度</span><b>{{ maxStats.spd }}</b></li>
        <li><span>暴击率</span><b>{{ maxStats.critRate }}</b></li>
        <li><span>暴击伤害</span><b>{{ maxStats.critDmg }}</b></li>
      </ul>
    </div>

    <div class="panel scroll-x">
      <h2 class="panel-title">等级属性</h2>
      <table>
        <thead>
          <tr>
            <th rowspan="2">等级</th>
            <th colspan="2">生命值</th>
            <th colspan="2">攻击力</th>
            <th colspan="2">防御力</th>
            <th rowspan="2">速度</th>
          </tr>
          <tr>
            <th v-for="n in 6" :key="n">{{ n % 2 ? '突破前' : '突破后' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in table" :key="r.lv">
            <td class="num">{{ r.lv }}</td>
            <td class="num">{{ r.hp.pre }}</td>
            <td class="num muted">{{ r.hp.post ?? '—' }}</td>
            <td class="num">{{ r.atk.pre }}</td>
            <td class="num muted">{{ r.atk.post ?? '—' }}</td>
            <td class="num">{{ r.def.pre }}</td>
            <td class="num muted">{{ r.def.post ?? '—' }}</td>
            <td class="num">{{ r.spd }}</td>
          </tr>
        </tbody>
      </table>
      <p class="small muted">「突破后」为空表示该档已是最高晋阶。<code>base + step ×(等级-1)</code> 取整，算法见页脚溯源。</p>
    </div>

    <div class="panel">
      <h2 class="panel-title">晋阶材料</h2>
      <ol class="asc">
        <li v-for="a in ascension" :key="a.tier">
          <span class="lv">{{ ['20 级', '30 级', '40 级', '50 级', '60 级', '70 级'][a.tier] || (a.tier + ' 档') }}</span>
          <ul>
            <li v-for="m in a.items" :key="m.id" class="mat">
              <img v-if="iconUrl(m.icon)" class="ic" :src="iconUrl(m.icon)" :alt="m.name" />
              {{ m.name }} <b class="num">×{{ m.num }}</b>
            </li>
          </ul>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.max { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; }
.max li { padding: 12px; border: 1px solid var(--line); border-radius: 12px; background: #ffffff06; }
.max span { display: block; color: var(--dim); font-size: .78rem; }
.max b { font-size: 1.5rem; font-variant-numeric: tabular-nums; color: var(--accent); }
.asc { margin: 0; padding-left: 20px; display: grid; gap: 10px; }
.asc ul { margin: 4px 0 0; padding-left: 18px; color: var(--dim); font-size: .88rem; }
.asc b { color: var(--text); }
.mat { display: flex; align-items: center; gap: 6px; }
.ic { width: 22px; height: 22px; object-fit: contain; }
.lv { color: var(--accent-2); font-weight: 600; }
</style>
