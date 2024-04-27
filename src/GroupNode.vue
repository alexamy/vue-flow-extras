<script setup lang="ts">
import { useNode, useVueFlow, type GraphNode, type NodeProps } from '@vue-flow/core';
import { NodeResizer } from '@vue-flow/node-resizer'
import { onMounted, ref } from 'vue';

const props = defineProps<NodeProps>();
const emit = defineEmits<{
  updateNodeInternals: [],
}>();

const { node: self } = useNode();
const prevNodes = ref<GraphNode[]>([]);
const { getIntersectingNodes, onNodeDragStop } = useVueFlow();

onMounted(updateGroup);
onNodeDragStop(updateGroup);

function updateGroup() {
  const nodes = getIntersectingNodes(self);
  for(const node of prevNodes.value) {
    node.parentNode = '';
    node.position.x += self.position.x;
    node.position.x += self.position.x;
  }
  for(const node of nodes) {
    if(node.parentNode = self.id) continue;

    node.parentNode = self.id;
    node.expandParent = true;
    node.position.x -= self.position.x;
    node.position.x -= self.position.x;
  }
  prevNodes.value = nodes;
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
  background: rgba(130, 204, 221, 0.2);
  color: white;
  border: 1px solid #3c6382;
  border-radius: 3px;
  font-size: 13px;
}
</style>
