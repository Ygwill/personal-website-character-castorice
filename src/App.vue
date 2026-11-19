<script setup>
import { computed, ref } from 'vue'
import character from './data/character.js'
import SiteHeader from './components/SiteHeader.vue'
import CharHero from './components/CharHero.vue'
import InfoPanel from './components/InfoPanel.vue'
import StatsPanel from './components/StatsPanel.vue'
import SkillsPanel from './components/SkillsPanel.vue'
import PoemsPanel from './components/PoemsPanel.vue'
import TracesPanel from './components/TracesPanel.vue'
import EidolonsPanel from './components/EidolonsPanel.vue'
import LorePanel from './components/LorePanel.vue'
import SourcesPanel from './components/SourcesPanel.vue'
import SiteFooter from './components/SiteFooter.vue'

// 「献诗」栏目只在角色真有这批技能条目时出现（昔涟的德谬歌献诗是特例，别的角色不该空一栏）
const hasPoems = computed(() => (character.skills || []).some((s) => (s.name || '').includes('献予「')))
const tabs = [
  { key: 'info', label: '信息' },
  { key: 'skill', label: '技能' },
  { key: 'poem', label: '献诗' },
  { key: 'trace', label: '行迹' },
  { key: 'eidolon', label: '星魂' },
  { key: 'stats', label: '属性' },
  { key: 'lore', label: '档案' },
  { key: 'src', label: '数据溯源' },
]
const shownTabs = computed(() => tabs.filter((t) => t.key !== 'poem' || hasPoems.value))
const active = ref('info')
</script>

<template>
  <SiteHeader :char="character" />

  <main class="wrap">
    <CharHero :char="character" />

    <nav class="tabs" aria-label="角色页栏目">
      <button
        v-for="t in shownTabs"
        :key="t.key"
        class="btn"
        :class="{ 'is-active': active === t.key }"
        @click="active = t.key"
      >{{ t.label }}</button>
    </nav>

    <section class="stage">
      <InfoPanel v-if="active === 'info'" :char="character" />
      <SkillsPanel v-else-if="active === 'skill'" :char="character" />
      <PoemsPanel v-else-if="active === 'poem'" :char="character" />
      <TracesPanel v-else-if="active === 'trace'" :char="character" />
      <EidolonsPanel v-else-if="active === 'eidolon'" :char="character" />
      <StatsPanel v-else-if="active === 'stats'" :char="character" />
      <LorePanel v-else-if="active === 'lore'" :char="character" />
      <SourcesPanel v-else-if="active === 'src'" :char="character" />
    </section>
  </main>

  <SiteFooter />
</template>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 16px;
  padding: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  position: sticky;
  top: 8px;
  z-index: 5;
  backdrop-filter: blur(8px);
}
.stage { padding-bottom: 34px; }
</style>
