<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { ref } from 'vue';
import GroupNode from './GroupNode.vue';

const nodes = ref([
  { id: '1', type: 'input', label: 'Node 1', position: { x: 100, y: 100 }},
  { id: '2', type: 'output', label: 'Node 2', position: { x: 150, y: 150 }},
  { id: '3', type: 'group', label: 'Group 1', position: { x: 20, y: 20 } },
]);

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' },
]);

const { onPaneReady, fitView, onNodeDragStop } = useVueFlow();

onNodeDragStop(console.log);

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
