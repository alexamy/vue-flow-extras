import { useNode, useVueFlow, type GraphNode } from '@vue-flow/core';
import { computed, onMounted } from 'vue';

export function useGroupNode() {
  const { node: group } = useNode();
  const {
    getIntersectingNodes,
    updateNodeInternals,
    onNodeDragStop,
    nodes,
  } = useVueFlow();

  const childNodes = computed(() => {
    return nodes.value
      .filter(node => node.parentNode === group.id);
  });

  onMounted(() => {
    updateNodeInternals();
    onGroupResize();
  });

  onNodeDragStop(({ node, intersections }) => {
    if(!intersections) return;
    if(node.id === group.id) {
      onGroupDrag(intersections);
    } else if(node.type !== group.type) {
      onNodeDrag(node, intersections);
    }
  });

  function onGroupResize() {
    const intersections = getIntersectingNodes(group);
    const outer = childNodes.value.filter((node) => !intersections.includes(node));
    const inner = intersections.filter((node) => node.type !== group.type);
    outer.forEach(excludeNode);
    inner.forEach(includeNode);
  }

  function onGroupDrag(intersections: GraphNode[]) {
    intersections
      .filter(node => node.type !== group.type)
      .filter(node => node.parentNode !== group.id)
      .forEach(includeNode);
  }

  function onNodeDrag(node: GraphNode, intersections: GraphNode[]) {
    const isInGroup = node.parentNode === group.id;
    const intersectsWithGroup = intersections.some((node) => node.id === group.id);

    if(isInGroup && intersectsWithGroup) {
      resizeGroupByNode(node);
    } else if(isInGroup && !intersectsWithGroup) {
      excludeNode(node);
    } else if(!isInGroup && intersectsWithGroup) {
      includeNode(node);
    }
  }

  function excludeNode(node: GraphNode) {
    node.parentNode = '';
    node.position.x += group.position.x;
    node.position.y += group.position.y;
  }

  function includeNode(node: GraphNode) {
    if (node.parentNode) return;
    node.parentNode = group.id;
    node.position.x -= group.position.x;
    node.position.y -= group.position.y;
    resizeGroupByNode(node);
  }

  function resizeGroupByNode(node: GraphNode) {
    node.expandParent = true;
    updateNodeInternals();
    node.expandParent = false;
  }

  return { childNodes, onGroupResize } as const;
}
