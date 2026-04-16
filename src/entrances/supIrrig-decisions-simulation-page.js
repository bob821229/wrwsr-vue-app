import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";

import "@/assets/css/style.css";
import "@/assets/css/responsive.css";

import { createApp, ref } from 'vue'
import App from '@/views/SupIrrigDecisions/SimulationPage.vue'

import axios from 'axios';
import { ApiCaller } from '@/myLibraries/api-caller';
import { ApiTokenHelper } from '@/myLibraries/api-token-helper';
import { Apis } from '@/apis/apis.js';

// 新增你自己的新 API
import { getGlossaryData } from '@/apis/modules/common'

const glossary = ref(null);

const apiCaller = ref(new ApiCaller({
  axios: axios,
  finallyCallback: function () {
    console.log("finally");
  },
  loginUrl: '/account/login'
}));

const mountVueApp = () => {
  const app = createApp(App);

  app.provide('glossary', glossary);
  app.provide('Apis', Apis);
  app.provide('apiCallerValue', apiCaller.value);

  app.mount('#app');
};

async function bootstrapApp() {
  try {
    const apiTokenHelper = new ApiTokenHelper({
      apiCaller: apiCaller.value,
      AdminApi: Apis,
    });

    // 先拿 token
    await apiTokenHelper.getToken();

    console.log('token ready:', {
      formToken: window.RequestVerificationToken,
      cookieToken: window.__RequestVerificationToken
    });

    // 用你新的 axios 架構測試打一支 API
    const glossaryApi = copyJsonObject(Apis.General.getGlossaryData);
    const res = await getGlossaryData()

    console.log('glossary data from new API:', res);
    glossary.value = res.data;

    // 成功後再開始自動 refresh token
    apiTokenHelper.autoRefreshToken();

    mountVueApp();
  } catch (error) {
    console.error('bootstrapApp error:', error);
  }
}

bootstrapApp();