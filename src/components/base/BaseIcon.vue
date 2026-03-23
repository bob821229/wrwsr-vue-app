<script setup>
import { computed } from 'vue'
import { icons } from '@/icons'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 16
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  stroke: {
    type: Number,
    default: 2
  }
})

const iconComponent = computed(() => icons[props.name])
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :size="size"
    :color="color"
    :stroke="stroke"
  />

  <span v-else style="color:red">icon not found</span>
</template>