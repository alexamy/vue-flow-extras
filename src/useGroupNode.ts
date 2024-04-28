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
    if(!intersections) return;
    if(node.id === self.id) {
      onGroupDrag(intersections);
    } else {
      onNodeDrag(node, intersections);
    }
  });

  async function onGroupResize() {
    const intersecting = getIntersectingNodes(self);
    const { outer, inner } = splitNodes(childNodes.value, intersecting);

    for(const node of outer) {
      excludeNode(node);
    }
    for(const node of inner) {
      includeNode(node);
    }
  }

  function splitNodes(nodes: GraphNode[], intersecting: GraphNode[]) {
    const outer: GraphNode[] = nodes
      .filter(node => !intersecting.includes(node));

    const inner: GraphNode[] = intersecting
      .filter(node => node.type !== 'group');

    return { inner, outer } as const;
  }

  function onGroupDrag(intersections: GraphNode[]) {
    intersections
      .filter(node => node.type !== 'group')
      .filter(node => node.parentNode !== self.id)
      .forEach(node => includeNode(node));
  }

  function onNodeDrag(node: GraphNode, intersections: GraphNode[]) {
    const isInGroup = node.parentNode === self.id;
    const intersectsWithGroup = intersections
      ?.find(node => node.id === self.id);

    if(isInGroup && !intersectsWithGroup) {
      excludeNode(node);
    } else if(!isInGroup && intersectsWithGroup) {
      includeNode(node);
    }
  }

  function excludeNode(node: GraphNode) {
    node.parentNode = '';
    node.position.x += self.position.x;
    node.position.y += self.position.y;
  }

  function includeNode(node: GraphNode) {
    if(node.parentNode === self.id) return;
    node.parentNode = self.id;
    node.position.x -= self.position.x;
    node.position.y -= self.position.y;
  }

  return { childNodes, onGroupResize } as const;
}
