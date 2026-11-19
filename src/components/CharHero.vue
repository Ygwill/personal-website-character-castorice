<script setup>
import { computed } from 'vue'
import { charUrl, iconUrl } from '../utils/assets.js'
const props = defineProps({ char: { type: Object, required: true } })

const portrait = computed(() => charUrl(`${props.char.slug}-portrait.webp`))
const stars = computed(() => '★'.repeat(props.char.rarity))
// 档案里第一条作为引言（官方 descriptions 索引）
const quote = computed(() => {
  const line = (props.char.lore[0]?.text || '').split('\n')[0]
  return line
})
</script>

<template>
  <section class="hero">
    <div class="art">
      <img v-if="portrait" :src="portrait" :alt="props.char.name + ' 立绘'" />
      <div v-else class="noart">立绘未入库</div>
    </div>

    <div class="meta">
      <p class="eyebrow">崩坏：星穹铁道 · 翁法罗斯</p>
      <h1>{{ props.char.name }}</h1>
      <p class="stars">{{ stars }}</p>

      <ul class="facts">
        <li>
          <span class="k">命途</span>
          <img v-if="iconUrl(char.pathIcon)" class="ic" :src="iconUrl(char.pathIcon)" :alt="char.pathName" />
          <span>{{ props.char.pathName }}</span>
        </li>
        <li>
          <span class="k">属性</span>
          <img v-if="iconUrl(char.elementIcon)" class="ic" :src="iconUrl(char.elementIcon)" :alt="char.elementName" />
          <span>{{ props.char.elementName }}</span>
        </li>
        <li>
          <span class="k">能量上限</span>
          <span class="v">{{ props.char.energyMax == null ? '—' : props.char.energyMax }}</span>
        </li>
        <li><span class="k">角色 ID</span><span class="v">{{ props.char.id }}</span></li>
      </ul>

      <blockquote v-if="quote" class="quote">{{ quote }}</blockquote>
      <p class="src small muted">数据取自官方解包索引，见「数据溯源」。</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) 1.15fr;
  gap: 22px;
  align-items: stretch;
  margin-top: 6px;
}
.art {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: linear-gradient(160deg, #16203a, #0b1120 60%);
  min-height: 320px;
}
.art img { display: block; width: 100%; height: 100%; object-fit: cover; }
.noart { display: grid; place-items: center; height: 100%; color: var(--dim); }
.meta { padding: 6px 4px; display: flex; flex-direction: column; }
.eyebrow { margin: 0; color: var(--dim); font-size: .8rem; letter-spacing: .22em; }
h1 { margin: .25em 0 0; font-size: clamp(2.1rem, 5vw, 3.2rem); letter-spacing: .06em; }
.stars { margin: .1em 0 .6em; color: var(--gold); letter-spacing: .18em; }
.facts { list-style: none; margin: 0 0 16px; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.facts li { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; }
.k { color: var(--dim); font-size: .8rem; }
.v { font-variant-numeric: tabular-nums; }
.ic { width: 20px; height: 20px; object-fit: contain; }
.quote {
  margin: 0 0 10px;
  padding: 14px 16px;
  border-left: 3px solid var(--accent-2);
  background: #b79cff12;
  border-radius: 0 10px 10px 0;
  color: #dcd6f5;
}
@media (max-width: 780px) { .hero { grid-template-columns: 1fr; } .art { min-height: 0; } }
</style>
