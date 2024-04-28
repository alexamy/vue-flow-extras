import { useNode, useVueFlow, type GraphNode } from '@vue-flow/core';
import { computed, onMounted, ref, toRaw } from 'vue';

export function useGroupNode() {
  const { node: self } = useNode();
  const {
    getIntersectingNodes,
    updateNodeInternals,
    onNodeDragStop,
    nodes,
  } = useVueFlow();

  const childNodes = computed(() => {
    return nodes.value
      .filter(node => node.parentNode === self.id);
  });

  onMounted(() => {
    updateNodeInternals();
    onGroupResize();
  });

  onNodeDragStop(({ node, intersections }) => {
    if(node.id === self.id) {
      onGroupDrag(node, intersections);
    } else {
      onNodeDrag(self, node, intersections);
    }
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
  }

  return { childNodes, onGroupResize } as const;
}

function onGroupDrag(self: GraphNode, intersections?: GraphNode[]) {
  intersections
    ?.filter(node => node.type !== 'group')
    ?.filter(node => node.parentNode !== self.id)
    ?.forEach(node => includeNode(self, node));
}

function onNodeDrag(self: GraphNode, node: GraphNode, intersections?: GraphNode[]) {
  const isInGroup = node.parentNode === self.id;
  const intersectsWithGroup = intersections
    ?.find(node => node.id === self.id);

  if(isInGroup && !intersectsWithGroup) {
    excludeNode(self, node);
  } else if(!isInGroup && intersectsWithGroup) {
    includeNode(self, node);
  }
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
