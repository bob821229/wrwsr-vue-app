<template>
  <div v-if="ifOnTest">
    {{ glossary }}<br />
    {{ result }}
  </div>

  <Header></Header>

  <section class="index_main">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <ul class="nav nav-tabs my-2">
            <li class="nav-item">
              <a class="nav-link" :class="{'active': currentComponentName == 'SampleIntro'}" aria-current="page" href="#" @click.prevent="switchView('SampleIntro')">Intro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'active': currentComponentName == 'SampleTodo'}" href="#" @click.prevent="switchView('SampleTodo')">Todo</a>
            </li>
          </ul>

          <component :is="currentComponentData" @switch-view="switchView"></component>
        </div>
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
import SampleIntro from "@/views/sample/intro.vue";
import SampleTodo from "@/views/sample/todo.vue";
import {
  createApp,
  ref,
  onBeforeMount,
  onMounted,
  computed,
  inject,
} from "vue";
import Swal from "sweetalert2";
const ifOnTest = false;
const glossary = inject("glossary");

/*************** api組件 **************** */
const apiCallerValue = inject("apiCallerValue");
const Apis = inject("Apis");
/*************** api組件 **************** */

/*************** 定義畫面(View)之前的切換 **************** */
const components = {
  'SampleIntro': SampleIntro,
  'SampleTodo': SampleTodo,
};

const currentComponentName = ref(null);
const currentComponentData = computed(() =>{
  return components[currentComponentName.value];
})

const switchView = async (componentName) => {
  currentComponentName.value = componentName;
}
/*************** 定義畫面(View)之前的切換 **************** */

const init = async() =>{
  await switchView('SampleIntro');

  //call api if needed
  /* the way to do api call as below:
  ******************
  let _api = copyJsonObject(Apis.General.getGlossaryData);  //copy api endpoint from Apis object
  apiCaller.value.call(
      {
          apiItem: _api,
          data: null  //json payload
      }).then((res) => {
          console.log(res);
          console.log(res.data);

      
          glossary.value = res.data;


          apiTokenHelper.autoRefreshToken();

          if (callback != null) {
              callback();
          }
      });
  */
}

onMounted(async () => {
  await init();
});
</script>

<style scoped></style>
