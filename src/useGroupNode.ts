import { useNode, useVueFlow, type GraphNode } from '@vue-flow/core';
import { onMounted, ref, toRaw } from 'vue';

export function useGroupNode() {
  const { node: self } = useNode();
  const childNodes = ref<GraphNode[]>([]);
  const {
    getIntersectingNodes,
    updateNodeInternals,
    onNodeDragStop,
  } = useVueFlow();

  onMounted(() => {
    updateNodeInternals();
    onGroupResize();
  });

  onNodeDragStop(({ node, intersections }) => {
    if(node.type === 'group') return;

    const isInGroup = node.parentNode === self.id;
    const intersectsWithGroup = intersections
      ?.find(node => node.id === self.id);

    if(isInGroup && !intersectsWithGroup) {
      // can be dragged out of a group -> exclude
      excludeNode(self, node);
    } else if(!isInGroup && intersectsWithGroup) {
      // can be dragged into a group -> include
      includeNode(self, node);
    }

    // can be dragged inside a group -> ignore
  });

  async function onGroupResize() {
    const intersecting = getIntersectingNodes(self);
    const { outer, inner } = splitNodes(childNodes.value, intersecting);

    for(const node of outer) {
      excludeNode(self, node);
    }
    for(const node of inner) {
      includeNode(self, node);
    }

    updateNodeInternals();
    childNodes.value = inner;
  }

  return { childNodes, onGroupResize } as const;
}

function excludeNode(self: GraphNode, node: GraphNode) {
  node.parentNode = '';
  node.position.x += self.position.x;
  node.position.y += self.position.y;
}

function includeNode(self: GraphNode, node: GraphNode) {
  if(node.parentNode === self.id) return;
  node.parentNode = self.id;
  node.position.x -= self.position.x;
  node.position.y -= self.position.y;
}

function splitNodes(
  nodes: GraphNode[],
  intersecting: GraphNode[]
) {
  const outer: GraphNode[] = nodes
    .filter(node => !intersecting.includes(node));

  const inner: GraphNode[] = intersecting
    .filter(node => node.type !== 'group');

  return { inner, outer } as const;
}
