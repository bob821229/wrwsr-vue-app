<template>
  <div v-if="ifOnTest">
    {{ glossary }}<br />
    {{ result }}
  </div>

  <Header></Header>
  
  <section class="index_main">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">body</div>
      </div>
    </div>
  </section>
  <div class="footer_block">
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from "@/components/general/header.vue";
import Footer from "@/components/general/footer.vue";
import { createApp, ref, onBeforeMount, computed, inject } from "vue";
import Swal from "sweetalert2";
const ifOnTest = false;
const glossary = inject("glossary");
const apiCallerValue = inject("apiCallerValue");
const result = ref(null);
const Apis = inject("Apis");
</script>

<style scoped></style>
