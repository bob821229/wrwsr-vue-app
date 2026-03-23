<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    fill="none"
    :stroke="color"
    :stroke-width="stroke"
    viewBox="0 0 24 24"
  >
    <path d="M12 6v6l4 2" />
    <circle cx="12" cy="12" r="10" />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: [String, Number], default: 16 },
  color: { type: String, default: 'currentColor' },
  stroke: { type: Number, default: 2 }
})
</script>