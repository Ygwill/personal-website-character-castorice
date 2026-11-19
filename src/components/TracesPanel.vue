<script setup>
import { computed } from 'vue'
import { fillParams } from '../utils/format.js'
import { iconUrl } from '../utils/assets.js'
const props = defineProps({ char: { type: Object, required: true } })

const exclusive = computed(() => props.char.traces.filter((t) => t.kind === 'exclusive'))
const stat = computed(() => props.char.traces.filter((t) => t.kind === 'stat'))
const boost = computed(() => props.char.traces.filter((t) => t.kind === 'boost' && t.name))

// 行迹数值：解包里 <1 的都是比率（暴击、生命百分比等），按百分比显示
function bonusList(t) {
  return t.bonus.map((b) => ({
    name: b.name,
    icon: b.icon,
    value: Math.abs(b.value) < 1 ? (b.value * 100).toFixed(1).replace(/\.0$/, '') + '%' : b.value,
  }))
}
</script>

<template>
  <div class="grid">
    <div class="panel">
      <h2 class="panel-title">专属行迹</h2>
      <article v-for="t in exclusive" :key="t.id" class="trace">
        <header>
          <img v-if="iconUrl(t.icon)" class="ic" :src="iconUrl(t.icon)" alt="" />
          <h3>{{ t.name }}</h3>
          <span class="chip is-warn" v-if="t.minPromotion">需 {{ t.minPromotion }} 阶解锁</span>
        </header>
        <p class="body">{{ fillParams(t.desc, t.params) }}</p>
      </article>
    </div>

    <div class="panel">
      <h2 class="panel-title">属性行迹（{{ stat.length }} 条）</h2>
      <div class="stats">
        <div v-for="t in stat" :key="t.id" class="st">
          <img v-if="iconUrl(t.icon)" class="ic" :src="iconUrl(t.icon)" :alt="t.name" />
          <span v-if="t.bonus.length" class="boni">
            <span v-for="b in bonusList(t)" :key="b.name" class="b">
              <img v-if="iconUrl(b.icon)" class="pic" :src="iconUrl(b.icon)" :alt="b.name" />{{ b.value }}
            </span>
          </span>
          <span v-else class="num">{{ t.name }}</span>
        </div>
      </div>
      <p class="small muted">
        额外能力与属性行迹的解锁材料同样在解包数据中，本页只展示数值，材料明细留待「晋阶」一栏统一整理。
      </p>
    </div>

    <div class="panel" v-if="boost.length">
      <h2 class="panel-title">忆灵强化行迹</h2>
      <ul class="boosts">
        <li v-for="t in boost" :key="t.id">
          <b>{{ t.name }}</b>
          <span class="small muted">可升 {{ t.maxLevel }} 级，提升 {{ t.levelUpSkills.map((s) => s.name).length }} 条忆灵技 / 天赋</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.boni { display: inline-flex; gap: 10px; flex-wrap: wrap; }
.b { display: inline-flex; align-items: center; gap: 4px; font-variant-numeric: tabular-nums; }
.pic { width: 16px; height: 16px; object-fit: contain; vertical-align: -3px; }
.trace { padding: 12px 0; border-top: 1px dashed var(--line); }
.trace:first-of-type { border-top: 0; padding-top: 2px; }
header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
h3 { margin: 0; font-size: 1rem; }
.ic { width: 32px; height: 32px; border-radius: 8px; object-fit: contain; background: #ffffff0d; }
.body { margin: 8px 0 0; white-space: pre-line; }
.stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; }
.st { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 10px; background: #ffffff06; font-size: .86rem; }
.st .ic { width: 24px; height: 24px; }
.num { font-variant-numeric: tabular-nums; }
.boosts { margin: 0; padding-left: 20px; display: grid; gap: 8px; }
.boosts span { display: block; }
</style>
