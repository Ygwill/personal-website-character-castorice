<script setup>
import { iconUrl } from '../utils/assets.js'
const props = defineProps({ char: { type: Object, required: true } })
</script>

<template>
  <div class="panel">
    <h2 class="panel-title">星魂</h2>
    <p class="muted small" style="margin-top:0">
      星魂 3 / 5 为技能等级提升；每条星魂解锁需 1 枚「昔涟星魂」材料（解包 materials 字段）。
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
