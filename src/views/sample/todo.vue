<script setup>
import { onMounted, ref, inject } from "vue";

const ifOnTest = false;
const apiCallerValue = inject("apiCallerValue");


onMounted(async () => {
  
});
</script>

<template>
  <div v-if="ifOnTest">
    
  </div>
  <h4>todo</h4>
  <ul>
    <li>修改header樣式
      <ul>
        <li>依現在的決策平台修改header樣式</li>
        <li>把icon另建component方便抽換</li>
      </ul>
    </li>
    
    <li>建立新供灌模組(舜年-決策平台-期中報告畫面)</li>
  </ul>
</template>
<style scoped>
</style>
