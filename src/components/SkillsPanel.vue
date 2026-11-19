<script setup>
import { computed, reactive } from 'vue'
import { fillParams } from '../utils/format.js'
import { iconUrl } from '../utils/assets.js'
const props = defineProps({ char: { type: Object, required: true } })

// 忆灵技（含 14 条「献予」）单独归到献诗栏目，这里按类型分组列本体技能
const groups = computed(() => {
  const order = ['Normal', 'BPSkill', 'Ultra', 'Talent', 'Maze', 'MemospriteSkill', 'MemospriteTalent']
  const m = new Map()
  for (const s of props.char.skills) {
    if (s.name.includes('献予「')) continue
    if (!m.has(s.type)) m.set(s.type, { label: s.typeLabel, items: [] })
    m.get(s.type).items.push(s)
  }
  return order.filter((k) => m.has(k)).map((k) => ({ key: k, ...m.get(k) }))
})

const lv = reactive({})
function levelOf(id) { return lv[id] ?? 1 }
function setLevel(id, n) { lv[id] = n }
function render(s) {
  const row = s.levels?.[levelOf(s.id) - 1]
  return fillParams(s.desc, row)
}
</script>

<template>
  <div class="grid">
    <div v-for="g in groups" :key="g.key" class="panel">
      <h2 class="panel-title">{{ g.label }}</h2>
      <article v-for="s in g.items" :key="s.id" class="skill">
        <header>
          <img v-if="iconUrl(s.icon)" class="ic" :src="iconUrl(s.icon)" :alt="s.name" />
          <h3>{{ s.name }}</h3>
          <span class="chip">{{ s.id }}</span>
          <label v-if="s.maxLevel > 1" class="picker">
            <span class="muted small">Lv</span>
            <input
              type="range" min="1" :max="s.maxLevel" :value="levelOf(s.id)"
              @input="setLevel(s.id, Number($event.target.value))"
            />
            <b>{{ levelOf(s.id) }}</b>
            <span class="muted small">/ {{ s.maxLevel }}</span>
          </label>
        </header>
        <p class="body">{{ render(s) }}</p>
        <p v-if="levelOf(s.id) === 1 && s.maxLevel > 1" class="small muted note">
          默认显示 1 级数值，拖动可看高等级 —— 数值由解包参数表按等级还原。
        </p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.skill { padding: 14px 0; border-top: 1px dashed var(--line); }
.skill:first-of-type { border-top: 0; padding-top: 4px; }
header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
h3 { margin: 0; font-size: 1.02rem; }
.ic { width: 34px; height: 34px; border-radius: 8px; object-fit: contain; background: #ffffff0d; }
.body { margin: 10px 0 0; white-space: pre-line; }
.note { margin: 6px 0 0; }
.picker { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.picker b { color: var(--accent); font-variant-numeric: tabular-nums; }
input[type="range"] { width: 120px; accent-color: var(--accent); }
</style>
