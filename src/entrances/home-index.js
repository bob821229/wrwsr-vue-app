
// import '../assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";



import "@/assets/css/style.css";
import "@/assets/css/responsive.css";

import { createApp, ref, onBeforeMount, computed } from 'vue'
import App from '@/view-hubs/home-index.vue'
import { VuePageHelper } from '@/myLibraries/helper-vue-page';

import axios from 'axios';
import { ApiCaller } from '@/myLibraries/api-caller';
import { ApiTokenHelper } from '@/myLibraries/api-token-helper';
import { Apis } from '@/apis/apis.js';


const glossary = ref(null);

const apiCaller = ref(new ApiCaller({
   axios: axios,
   finallyCallback: function () {
       console.log("finally");
   },
   loginUrl: '/account/login'
}));



const mountVueApp = () => {
   //to mount vue app

   const app = createApp(App);

   app.provide('glossary', glossary);
   app.provide('Apis', Apis);
   app.provide('apiCallerValue', apiCaller.value);

   app.mount('#app');
};

const getGlossary = (callback) => {
    let apiTokenHelper = new ApiTokenHelper(
        {
            apiCaller: apiCaller.value, 
            AdminApi: Apis, 
            // refreshInterval: 3000
        }
    )
    

   let _api = copyJsonObject(Apis.General.getGlossaryData);
   apiCaller.value.call(
       {
           apiItem: _api,
       }).then((res) => {
           console.log(res);
           console.log(res.data);

        //    let vuePageHelper = (new VuePageHelper(res.data));
        //    glossary.value = vuePageHelper.getGlossary();
        glossary.value = res.data;


            apiTokenHelper.autoRefreshToken();

           if (callback != null) {
               callback();
           }
       });
}

getGlossary(mountVueApp);

