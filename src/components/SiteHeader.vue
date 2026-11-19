<script setup>
import { computed } from 'vue'
import { org } from '../data/site.js'
const props = defineProps({ char: { type: Object, required: true } })
const home = computed(() => org.site + '/')
</script>

<template>
  <header class="bar wrap">
    <div class="brand">
      <span class="mark">✦</span>
      <span class="cname">{{ props.char.name }}</span>
      <span class="en">{{ props.char.slug }}</span>
    </div>
    <nav class="links">
      <a :href="home">主站</a>
      <a :href="org.url + '/' + (props.char.slug === 'cyrene' ? 'character-cyrene' : 'character-' + props.char.slug)">仓库</a>
      <a :href="org.url">组织</a>
    </nav>
  </header>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-top: 18px;
  padding-bottom: 6px;
}
.brand { display: flex; align-items: baseline; gap: 10px; }
.mark { color: var(--accent-2); font-size: 1.2rem; }
.cname { font-size: 1.06rem; font-weight: 650; letter-spacing: .06em; }
.en { color: var(--dim); font-size: .78rem; text-transform: uppercase; letter-spacing: .18em; }
.links { display: flex; gap: 16px; font-size: .88rem; }
</style>
