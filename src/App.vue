<script setup lang="ts">
import { VueFlow, useVueFlow, type Node } from '@vue-flow/core';
import { Background } from '@vue-flow/background'
import { ref, toRaw } from 'vue';
import GroupNode from './GroupNode.vue';

const nodes = ref<Node[]>([
  { id: '1', type: 'input', label: 'Node 1', position: { x: 200, y: 200 }},
  { id: '2', type: 'output', label: 'Node 2', position: { x: 250, y: 250 }},
  { id: '3', type: 'group', label: 'Group 1', position: { x: 140, y: 140 } },
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
      <Background />
      <template #node-group="groupNodeProps">
        <GroupNode v-bind="groupNodeProps" />
      </template>
    </VueFlow>
  </div>
</template>

<style scoped>
.graph {
  width: 900px;
  height: 700px;
  border: 1px solid grey;
}
</style>
