<script setup lang="ts">
import { useNode, useVueFlow, type GraphNode, type NodeProps } from '@vue-flow/core';
import { NodeResizer } from '@vue-flow/node-resizer'
import { nextTick, ref, toRaw } from 'vue';

const props = defineProps<NodeProps>();
const emit = defineEmits<{
  updateNodeInternals: [],
}>();

const { node: self } = useNode();
const childNodes = ref<GraphNode[]>([]);
const { getIntersectingNodes, updateNodeInternals } = useVueFlow();

// onMounted(updateGroup);

async function updateGroup() {
  const inner = getIntersectingNodes(self);
  const outer: GraphNode[] = childNodes.value
    .filter(node => !inner.includes(node));

  for(const node of outer) {
    node.parentNode = '';
    node.position.x += self.position.x;
    node.position.y += self.position.y;
  }

  for(const node of inner) {
    if(node.parentNode === self.id) continue;
    node.parentNode = self.id;
    node.expandParent = true;
    node.position.x -= self.position.x;
    node.position.y -= self.position.y;
  }

  updateNodeInternals();
  childNodes.value = inner;
}
</script>

<template>
  <NodeResizer :minWidth="100" :minHeight="30" @resizeEnd="updateGroup" />
  <div class="group">{{ props.label }}</div>
</template>

<style scoped>
.group {
  height: 100%;
  width: 100%;
  padding: 4px 10px;
  background: rgba(130, 204, 221, 0.3);
  color: white;
  border: 1px solid #3c6382;
  border-radius: 3px;
  font-size: 13px;
}
</style>
