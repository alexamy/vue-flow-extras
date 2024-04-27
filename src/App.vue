<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { ref } from 'vue';

const nodes = ref([
  { id: '1', type: 'input', label: 'Node 1', position: { x: 0, y: 0 }},
  { id: '2', type: 'output', label: 'Node 2', position: { x: 50, y: 50 }},
]);

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' },
]);

const { onPaneReady, fitView } = useVueFlow();

onPaneReady(() => fitView());
</script>

<template>
  <div class="graph">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :default-viewport="{ zoom: 1.0 }"
      :min-zoom="0.2"
      :max-zoom="4"
    >
    </VueFlow>
  </div>
</template>

<style scoped>
.graph {
  width: 400px;
  height: 600px;
}
</style>
