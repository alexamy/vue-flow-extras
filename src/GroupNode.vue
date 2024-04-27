<script setup lang="ts">
import { useNode, useVueFlow, type NodeProps } from '@vue-flow/core';
import { NodeResizer } from '@vue-flow/node-resizer'

const props = defineProps<NodeProps>();
const emit = defineEmits<{
  updateNodeInternals: [],
}>();

const self = useNode();
const { getIntersectingNodes } = useVueFlow();

function updateConnections() {
  const nodes = getIntersectingNodes({ id: self.id });
}
</script>

<template>
  <NodeResizer :minWidth="100" :minHeight="30" @resizeEnd="updateConnections" />
  <div class="group">{{ props.label }}</div>
</template>

<style scoped>
.group {
  height: 100%;
  width: 100%;
  padding: 4px 10px;
  background: rgba(130, 204, 221, 0.2);
  color: white;
  border: 1px solid #3c6382;
  border-radius: 3px;
  font-size: 13px;
}
</style>
