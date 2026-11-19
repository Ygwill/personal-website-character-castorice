<script setup>
import { computed } from 'vue'
import { iconUrl } from '../utils/assets.js'
const props = defineProps({ char: { type: Object, required: true } })

// 哪几条是「提升技能等级」的星魂，从文本里认，不写死数字
const skillRanks = computed(() =>
  props.char.eidolons.filter((e) => /等级\+\d/.test(e.desc)).map((e) => e.rank),
)
// 解锁材料：六条星魂的材料通常同一种，一致就合并成一句话，不一致就逐条列
const sharedCost = computed(() => {
  const sets = props.char.eidolons.map((e) => (e.cost || []).join('、'))
  return sets.every((x) => x === sets[0]) ? sets[0] : ''
})
</script>

<template>
  <div class="panel">
    <h2 class="panel-title">星魂</h2>
    <p v-if="skillRanks.length || sharedCost" class="muted small" style="margin-top:0">
      <template v-if="skillRanks.length">星魂 {{ skillRanks.join(' / ') }} 为技能等级提升；</template>
      <template v-if="sharedCost">每条星魂解锁需 1 枚 {{ sharedCost }}（取自解包 ranks.materials 字段）。</template>
    </p>
    <ol class="eids">
      <li v-for="e in props.char.eidolons" :key="e.id">
        <header>
          <span class="no">{{ e.rank }}</span>
          <img v-if="iconUrl(e.icon)" class="ic" :src="iconUrl(e.icon)" alt="" />
          <h3>{{ e.name }}</h3>
        </header>
        <p class="body">{{ e.desc }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.eids { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 12px; }
.eids li { padding: 14px; border: 1px solid var(--line); border-radius: 12px; background: #ffffff05; }
header { display: flex; align-items: center; gap: 10px; }
h3 { margin: 0; font-size: 1rem; color: var(--gold); }
.no { width: 24px; height: 24px; flex: none; display: grid; place-items: center; border-radius: 50%; background: #f0c96a22; border: 1px solid #f0c96a55; color: var(--gold); font-size: .8rem; }
.ic { width: 30px; height: 30px; border-radius: 8px; object-fit: contain; background: #ffffff0d; }
.body { margin: 8px 0 0; white-space: pre-line; font-size: .92rem; }
</style>
