import { useNode, useVueFlow, type GraphNode } from '@vue-flow/core';
import { onMounted, ref, toRaw } from 'vue';

export function useGroupNode() {
  const { node: self } = useNode();
  const childNodes = ref<GraphNode[]>([]);
  const { getIntersectingNodes, updateNodeInternals } = useVueFlow();

  onMounted(() => {
    updateNodeInternals();
    onGroupResize();
  });

  async function onGroupResize() {
    const intersecting = getIntersectingNodes(self);
    const { outer, inner } = splitNodes(childNodes.value, intersecting);

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

  return { childNodes, onGroupResize } as const;
}

function splitNodes(
  nodes: GraphNode[],
  intersecting: GraphNode[]
) {
  const outer: GraphNode[] = nodes
    .filter(node => !intersecting.includes(node));

  const inner: GraphNode[] = intersecting
    .filter(node => {
      const isGroup = node.type === 'group';
      if(isGroup) {
        console.warn('Inner groups are not supported');
      }
      return !isGroup;
    });

  return { inner, outer } as const;
}
