<template>
  show checkbox with `check-strictly`:
  <el-tree-select
    v-model="valueStrictly"
    :data="data"
    multiple
    :render-after-expand="false"
    show-checkbox
    check-strictly
    check-on-click-node
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref()
const valueStrictly = ref()

const data = [
  {
    value: '1',
    label: 'Level one 1',
  },
  {
    value: '2',
    label: 'Level one 2',
  },
  {
    value: '3',
    label: 'Level one 3',
  },
]
</script>
