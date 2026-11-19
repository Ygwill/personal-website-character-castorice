<script setup>
const props = defineProps({ char: { type: Object, required: true } })
</script>

<template>
  <div class="grid">
    <div v-for="l in props.char.lore" :key="l.id" class="panel">
      <h2 class="panel-title">{{ l.title }} <span class="chip">解包条目 {{ l.id }}</span></h2>
      <p class="body">{{ l.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.body { margin: 0; white-space: pre-line; }
.panel-title .chip { margin-left: 6px; }
</style>
