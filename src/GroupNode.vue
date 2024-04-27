<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core';
import { NodeResizer } from '@vue-flow/node-resizer'

const props = defineProps<NodeProps>();
</script>

<template>
  <NodeResizer :minWidth="100" :minHeight="30" />
  <div class="group">{{ props.label }}</div>
</template>

<style scoped>
.group {
  height: 100%;
  width: 100%;
  padding: 4px 10px;
  background: #82ccdd;
  border: 1px solid #3c6382;
  border-radius: 3px;
  color: black;
  font-size: 13px;
}
</style>
