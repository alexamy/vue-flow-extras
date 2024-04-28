import { useNode, useVueFlow, type GraphNode } from '@vue-flow/core';
import { onMounted, ref } from 'vue';

export function useGroupNode() {
  const { node: self } = useNode();
  const childNodes = ref<GraphNode[]>([]);
  const { getIntersectingNodes, updateNodeInternals } = useVueFlow();

  onMounted(() => {
    updateNodeInternals();
    updateGroup();
  });

  async function updateGroup() {
    const intersecting = getIntersectingNodes(self);
    const { outer, inner } = splitNodes(childNodes.value, intersecting);

    for(const node of outer) {
      node.parentNode = '';
      node.position.x += self.position.x;
      node.position.y += self.position.y;
    }

    for(const node of inner) {
      node.parentNode = self.id;
      node.expandParent = true;
      node.position.x -= self.position.x;
      node.position.y -= self.position.y;
    }

    updateNodeInternals();
    childNodes.value = inner;
  }

  return { childNodes, updateGroup } as const;
}

function splitNodes(nodes: GraphNode[], intersecting: GraphNode[]) {
  const outer: GraphNode[] = nodes
    .filter(node => !intersecting.includes(node));

  const inner: GraphNode[] = intersecting
    .filter(node => {
      const isOwned = nodes.includes(node);
      const isGroup = node.type === 'group';
      if(isGroup) {
        console.warn('Inner groups are not supported');
      }
      return !isOwned && !isGroup;
    });

  return { inner, outer } as const;
}
