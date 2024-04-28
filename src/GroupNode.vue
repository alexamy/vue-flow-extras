<script setup lang="ts">
import { useNode, useVueFlow, type GraphNode, type NodeProps } from '@vue-flow/core';
import { NodeResizer } from '@vue-flow/node-resizer'
import { onMounted, ref, toRaw } from 'vue';

const props = defineProps<NodeProps>();
const emit = defineEmits<{
  updateNodeInternals: [],
}>();

const { node: self } = useNode();
const childNodes = ref<GraphNode[]>([]);
const { getIntersectingNodes, updateNodeInternals } = useVueFlow();

onMounted(() => {
  updateNodeInternals();
  updateGroup();
});

async function updateGroup() {
  const intersecting = getIntersectingNodes(self);

  const outer: GraphNode[] = childNodes.value
    .filter(node => !intersecting.includes(node));

  for(const node of outer) {
    node.parentNode = '';
    node.position.x += self.position.x;
    node.position.y += self.position.y;
  }

  const inner = intersecting
    .filter(node => {
      const isOwned = childNodes.value.includes(node);
      const isGroup = node.type === 'group';
      if(isGroup) {
        console.warn('Inner groups are not supported');
      }

      return !isOwned && !isGroup;
    });

  for(const node of inner) {
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
