<script setup>
import { onMounted, ref, inject } from "vue";

const ifOnTest = false;
// const apiCallerValue = inject("apiCallerValue");

onMounted(async () => {
  
});
</script>

<template>
  <div v-if="ifOnTest">
    this if footer
  </div>
</template>
<style scoped></style>
