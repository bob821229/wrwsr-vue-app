<script setup>
import { onMounted, ref, inject } from "vue";

const ifOnTest = false;
const apiCallerValue = inject("apiCallerValue");

onMounted(async () => {});
</script>

<template>
  <div v-if="ifOnTest"></div>

  <h4>專案架構</h4>
  <div>
    <ul>
      <li class="top-layer">
        前端開發進入點：/pages
        <ul>
          <li class="eg">
            引用：
          </li>
          <li class="eg">
            e.g. 要建立供灌模組： /pages/supIrrig-decisions/simulation.html
          </li>
        </ul>
      </li>
      <li class="top-layer">
        專案架構
        <ul>
          <li>
            頁面進入點：/pages/supIrrig-decisions/simulation.html
          </li>
          <li>
            程式進入點：/src/entrances/supIrrig-decisions-simulation.js
          </li>
          <li>
            View(畫面)入口：
            <ul>
              <li>
                如果View裡面只有一個畫面<br>
                入口：/src/view-hubs/supIrrig-decisions-simulation.vue
              </li>
              <li>
                如果View裡面會有很多View(畫面)切換：<br>
                入口：/src/view-hubs/supIrrig-decisions-simulation-hub.vue
                在supIrrig-decisions-simulation-hub.vue裡面再引用 /src/views/ 的畫面vue
              </li>
            </ul>
          </li>
          <hr>
          <li>
            /src/apis/*.js: 定義不同用途的api endpoints
          </li>
          <li>
            /src/components/*.vue: 定義共用的vue components
          </li>
          <li>
            /src/myLibraries/*.js: 定義共用的js libraries
          </li>

        </ul>
      </li>

      <li class="top-layer">
        專案架構-範例程式
        <ul>
          <li>
            頁面進入點：/pages/sample-index.html
          </li>
          <li>
            程式進入點：/src/entrances/sample-index.js
          </li>
          <li>
            View(畫面)入口：
            <ul>
              <li>
                <s>
                如果View裡面只有一個畫面<br>
                入口：/src/view-hubs/supIrrig-decisions-simulation.vue
                </s>
              </li>
              <li>
                如果View裡面會有很多View(畫面)切換：<br>
                入口：/src/view-hubs/sample-index-hub.vue<br>
                並引用2個畫面
                <ul>
                  <li>
                    /src/views/sample/intro.vue 專案說明畫面
                  </li>
                  <li>
                    /src/views/sample/todo.vue 待辦清單
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <hr>
          <li>
            /src/apis/*.js: 定義不同用途的api endpoints
          </li>
          <li>
            /src/components/*.vue: 定義共用的vue components
          </li>
          <li>
            /src/myLibraries/*.js: 定義共用的js libraries
          </li>

        </ul>
      </li>
    </ul>
  </div>
</template>
<style scoped>

</style>
