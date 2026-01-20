<template>
  <div v-if="ifOnTest">
    {{ glossary }}<br />
    {{ result }}
  </div>
  <!-- =====  main  =====  -->
  <section class="login relative">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="login_outer">
            <div class="banner">
              <img src="/frontend-assets/Img/WRWSR_LOGO.svg" alt="" />
            </div>

            <form
              action="/Account/Login?ReturnUrl=%2F"
              autocomplete="off"
              method="post"
              role="form"
            >
              <input
                name="__RequestVerificationToken"
                type="hidden"
                value="9WDHo5R7dsTmUUVxupTcGTaquoPjbDOFJvLy0RJQq-AY_J32sKqRAITE9qmyC2uvSkA_YGLcEVAfPc_etQo3-m3DewZRm_5CQbmF3LS1Cs01"
              />
              <div class="login_content py-4">
                <div class="title text-center mb-4">
                  <h4
                    data-bs-toggle="modal"
                    data-bs-target="#tipError"
                    class="fw_700"
                  >
                    系統登入
                  </h4>
                </div>

                <form class="row g-2 needs-validation" novalidate="">
                  <div class="col-md-12 position-relative mb-2">
                    <input
                      autocomplete="off"
                      class="form-control"
                      data-val="true"
                      data-val-length="帳號 的長度至少必須為 3 個字元。"
                      data-val-length-max="20"
                      data-val-length-min="3"
                      data-val-required="請輸入帳號"
                      id="UserName"
                      name="UserName"
                      placeholder="請輸入您的帳號"
                      required=""
                      type="text"
                      v-model="crediential.UserName"
                    />
                    <span
                      class="field-validation-valid text-danger"
                      data-valmsg-for="UserName"
                      data-valmsg-replace="true"
                    ></span>
                  </div>

                  <div class="col-md-12 position-relative">
                    <input
                      autocomplete="off"
                      class="form-control"
                      data-val="true"
                      data-val-required="請輸入密碼"
                      id="Password"
                      name="Password"
                      placeholder="請輸入您的密碼"
                      required=""
                      type="password"
                      v-model="crediential.Password"
                    />
                    <span
                      class="field-validation-valid text-danger"
                      data-valmsg-for="Password"
                      data-valmsg-replace="true"
                    ></span>
                  </div>

                  <div class="col-lg-12 d-flex justify-content-end my-3">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        id="flexCheckChecked"
                        type="checkbox"
                        value=""
                        checked=""
                      />
                      <label class="form-check-label" for="flexCheckChecked"
                        >記住我</label
                      >
                    </div>
                  </div>

                  <div class="col-12">
                    <button
                      class="btn login_btn btn_lg"
                      type="submit"
                      @click.prevent="login"
                    >
                      <span class="fw_700">登入</span>
                    </button>
                  </div>
                </form>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!--帳號密碼輸入錯誤提示dialog-->
    <!-- Modal-->
  </section>
</template>

<script setup>
import { createApp, ref, onBeforeMount, computed, inject } from "vue";
import Swal from "sweetalert2";
const ifOnTest = ref(true);
const glossary = inject("glossary");
const apiCallerValue = inject("apiCallerValue");
const result = ref(null);
const Apis = inject("Apis");

const crediential = ref({
  UserName: null,
  Password: null,
});

const login = async () => {
  Swal.showLoading();
  let _api = copyJsonObject(Apis.Account.login);
  let data = crediential.value;
  // data.__RequestVerificationToken = window.__RequestVerificationToken;
  let _axios = await apiCallerValue
    .call({
      apiItem: _api,
      // data: crediential.value,
      data: data,
      exceptionCallback: (t) => {
        console.log(t);
      }
    })
    .then(async (res) => {
      let result = res.data;
      result.value = result;

      Swal.close();
      if (result.ifSuccess) {
        location.href = result.returnUrl;
      } else {
        if (result.returnUrl != null) {
          location.href = result.returnUrl;
        }else{
          Swal.fire(
            {
              title: '登入失敗', 
              text: result.message, 
              icon: 'error'
            }
          )
        }
      }
    });
};
</script>

<style scoped></style>
