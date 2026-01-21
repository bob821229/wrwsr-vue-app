<script setup>
import { onMounted, ref, inject } from "vue";

const ifOnTest = false;
const apiCallerValue = inject("apiCallerValue");
const userMenuList = ref([]);

onMounted(async () => {
  let _api = copyJsonObject({
    uri: `/dummy/user-menu.json`,
    method: "get",
  });
  apiCallerValue
    .call({
      apiItem: _api,
    })
    .then((res) => {
      console.log(res);
      console.log(res.data);

      //    let vuePageHelper = (new VuePageHelper(res.data));
      //    glossary.value = vuePageHelper.getGlossary();
      //   userMenuList.value = res.data;

      let list = res.data;
      userMenuList.value = buildMenuTree(list);
    });
});
</script>

<template>
  <div v-if="ifOnTest">
    {{ userMenuList }}
  </div>

  <div class="header_block">
    <header class="header_outer">
      <div class="navleft w_100">
        <nav class="navbar navbar-expand-lg d-flex">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main_nav"
            aria-controls="main_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div class="hambergerIcon"></div>
          </button>
          <a class="logo_outer d-flex align_center" href="/">
            <div class="logo w_15">
              <img src="/frontend-assets/Img/WRWSR_LOGO_Only.svg" alt="" />
            </div>
            <div class="navbar-brand">
              <span>農業水資源<br />智慧決策支援平台</span>
            </div>
          </a>
          <div
            class="collapse navbar-collapse justify-content-between"
            id="main_nav"
          >
            <ul class="navbar-nav">
              <li
                :id="`MenuID` + layer1Menu.Id"
                class="nav-item dropdown rain_menu"
                v-for="(layer1Menu, layer1Idx) in userMenuList"
                :key="layer1Idx"
              >
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                  >{{ layer1Menu.Label }}</a
                >
                <ul
                  class="dropdown-menu menu1"
                  v-if="
                    layer1Menu.subList != null && layer1Menu.subList.length > 0
                  "
                >
                  <li
                    v-for="(layer2Menu, layer2Idx) in layer1Menu.subList"
                    :key="layer2Idx"
                  >
                    <a class="dropdown-item" href="#">
                      <div
                        class="outer d-flex align_center justify-content-between"
                      >
                        <div class="link_item">
                          <i class="ti ti-clock-hour-4"></i>
                          <span class="">{{ layer2Menu.Label }}</span>
                        </div>
                        <i class="ti ti-chevron-right"> </i>
                      </div>
                    </a>
                    <ul
                      class="submenu dropdown-menu"
                      v-if="
                        layer2Menu.subList != null &&
                        layer2Menu.subList.length > 0
                      "
                    >
                      <li
                        v-for="(layer3Menu, layer3Idx) in layer2Menu.subList"
                        :key="layer3Idx"
                      >
                        <a
                          class="dropdown-item link_1"
                          href="/RainfallSituation/ReservoirDailyCumulativeRainfall"
                        >
                          {{ layer3Menu.Label }}</a
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="btn-group sm_admin_acc" style="z-index: 1300">
            <button
              class="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <!-- <i class="ti ti-user-circle"> </i> -->
               <i class="bi bi-person"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a href="/DataSourceInfo/Home">資料來源頁面</a>
              </li>
            </ul>
            <!-- <ul class="dropdown-menu dropdown-menu-end">
                        @if (User.IsInRole(CommonHelper.RoleAdmin))
                        {
                            <li>
                                @Html.ActionLink("使用者管理", "Index", "User", null, new { @class = "dropdown-item" })
                            </li>
                            <li>
                                @Html.ActionLink("使用者鎖定管理", "LockoutList", "User", null, new { @class = "dropdown-item" })
                            </li>
                            <li>
                                @Html.ActionLink("群組管理", "Index", "Role", null, new { @class = "dropdown-item" })
                            </li>
                            <li>
                                @Html.ActionLink("單位管理", "Index", "Unit", null, new { @class = "dropdown-item" })
                            </li>
                            <li>
                                @Html.ActionLink("存取記錄查詢", "Index", "ActionLog", null, new { @class = "dropdown-item" })
                            </li>
                            <li>
                                <a class="dropdown-item" href="@(CommonHelper.GetSiteUrl(Url) + "twelmah")" target="_blank">Elmah Error Log</a>
                            </li>
                        }
                        <li>
                            @Html.ActionLink("資料來源頁面", "DataSourceInfo", "Home", null, new { @class = "dropdown-item" })
                        </li>
                        <li>
                            @Html.ActionLink("變更密碼", "ChangePassword", "Manage", null, new { @class = "dropdown-item" })
                        </li>
                        <li>
                            <a class="dropdown-item" href="javascript:document.getElementById('logoutForm').submit()">登出</a>
                        </li>
                    </ul> -->
          </div>
          
        </nav>
      </div>
      <!-- 新增縮放按鈕 -->
      <div class="header-toggle w_100">
        <button id="toggleHeader" class="toggle-btn w_100">
          <i class="ti ti-chevron-up" id="icon-up"></i>
          <i
            class="ti ti-chevron-down"
            id="icon-down"
            style="display: none"
          ></i>
        </button>
      </div>
    </header>
  </div>
</template>
<style scoped>
    /* .table > :not(:first-child) {
        border-top: 2px solid #e0e0e0
    }

    table.table-bordered {
        border: 1px solid #e0e0e0 !important;
    }

        table.table-bordered > thead > tr > th {
            border: 1px solid #e0e0e0 !important;
        }

        table.table-bordered > tbody > tr > td {
            border: 1px solid #e0e0e0 !important;
        }

    .leaflet-container {
        background: white;
    }

    .modal {
        z-index: 1300;
    } */
/* 縮放按鈕樣式 */
.header-toggle {
    position: relative;
    text-align: center;
    margin-top: -10px;
    display: none; /* 預設隱藏 */
}

.header_block:hover  .header-toggle {
    display: block; /* hover header 時顯示按鈕 */
}

.toggle-btn {
    background-color: #F3F5F7;
    color: #39A771;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
}

.toggle-btn:hover {
    background-color: #cccccc;
    color: #fff;
}

.header-collapsed {
    max-height: 0;
    overflow: hidden;
    transition: max-height 1s ease;
}

.header-expanded {
    max-height: 500px; 
    transition: max-height 3s ease;
}
.header_outer{
    display: flex;
    flex-direction: column;
}
#toggleHeader i{
    font-size: 20px;
}

</style>
