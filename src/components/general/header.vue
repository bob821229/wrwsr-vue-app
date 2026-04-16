<template>
    <div v-if="ifOnTest">
        {{ userMenuList }}
    </div>
    <div class="header_block">
        <header class="header_outer">
            <div class="navleft w_100" v-show="isNavVisible">
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
                            <img
                                src="/frontend-assets/Img/WRWSR_LOGO_Only.svg"
                                alt=""
                            />
                        </div>
                        <div class="navbar-brand nav-txt">
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
                                @mouseenter="isMobile ? null : onLayer1Hover(layer1Idx)"
                                @mouseleave="isMobile ? null : onLayer1Leave(layer1Idx)"
                            >
                                <a
                                    class="nav-link dropdown-toggle"
                                    href="#"
                                    @click.prevent="isMobile ? onLayer1Click(layer1Idx) : null"
                                    :class="{ show: openedLayer1 === layer1Idx }"
                                    >{{ layer1Menu.Label }}
                                    <BaseIcon name="chevron-down"
                                /></a>
                                <ul
                                    class="dropdown-menu menu1"
                                    v-if="
                                        layer1Menu.subList != null &&
                                        layer1Menu.subList.length > 0
                                    "
                                    :class="{ show: openedLayer1 === layer1Idx }"
                                >
                                    <li
                                        v-for="(
                                            layer2Menu, layer2Idx
                                        ) in layer1Menu.subList"
                                        :key="layer2Idx"
                                        @mouseenter="isMobile ? null : onLayer2Hover(layer1Idx, layer2Idx)"
                                        @mouseleave="isMobile ? null : onLayer2Leave(layer1Idx, layer2Idx)"
                                    >
                                        <a 
                                            class="dropdown-item" 
                                            href="#"
                                            @click.prevent="isMobile && onLayer2Click(layer1Idx, layer2Idx)"
                                            :class="{ show: openedLayer2[layer1Idx] === layer2Idx }"
                                        >
                                            <div
                                                class="outer d-flex align_center justify-content-between"
                                            >
                                                <div
                                                    class="link_item d-flex align-items-center"
                                                >
                                                    <BaseIcon
                                                        :name="
                                                            layer2Menu.IconComponentName
                                                        "
                                                    />
                                                    <!-- {{ layer2Menu.Glyphicon }} -->
                                                    <!-- <i :class="layer2Menu.Glyphicon"></i> -->
                                                    <span class="ms-1">{{
                                                        layer2Menu.Label
                                                    }}</span>
                                                    <BaseIcon
                                                        v-if="
                                                            layer2Menu.subList !=
                                                                null &&
                                                            layer2Menu.subList
                                                                .length > 0
                                                        "
                                                        name="chevron-right"
                                                    />
                                                </div>
                                            </div>
                                        </a>
                                        <ul
                                            class="submenu dropdown-menu"
                                            v-if="
                                                layer2Menu.subList != null &&
                                                layer2Menu.subList.length > 0
                                            "
                                            :class="{ show: openedLayer2[layer1Idx] === layer2Idx }"
                                        >
                                            <li
                                                v-for="(
                                                    layer3Menu, layer3Idx
                                                ) in layer2Menu.subList"
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
                    <div
                        class="user-menu-wrapper nav-item dropdown rain_menu"
                        @mouseenter="isMobile ? null : userMenuOpen = true"
                        @mouseleave="isMobile ? null : userMenuOpen = false"
                    >
                        <button
                            class="dropdown-toggle user-menu-btn d-flex align-items-center gap-1"
                            type="button"
                            @click.prevent="isMobile && (userMenuOpen = !userMenuOpen)"
                            :class="{ show: userMenuOpen }"
                        >
                            <BaseIcon
                                name="user-circle"
                                :size="18"
                                color="#39a771"
                            />
                            <span class="user-name">{{ userInfo.name }}</span>
                        </button>

                        <ul
                            class="dropdown-menu dropdown-menu-end user-dropdown-menu"
                            :class="{ show: userMenuOpen }"
                        >
                            <li v-for="item in userMenuItems" :key="item.label">
                                <a
                                    class="dropdown-item"
                                    :href="item.href"
                                    @click.prevent="
                                        item.action ?
                                        handleUserMenuAction(
                                            item.action,
                                            $event,
                                        ) : (window.location.href = item.href)
                                    "
                                >
                                    {{ item.label }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div
                        class="btn-group sm_admin_acc"
                        style="z-index: 1300"
                        v-if="false"
                    >
                        <button
                            class="btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <BaseIcon name="user-circle" stroke="#39a771" />
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a href="/DataSourceInfo/Home">資料來源頁面</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <!-- 新增縮放按鈕 -->
            <div class="header-toggle w_100">
                <button class="toggle-btn w_100 nav-txt" @click="toggleNav">
                    <!-- 向下（收起狀態顯示） -->
                    <BaseIcon v-if="isNavVisible" name="chevron-compact-up" />

                    <!-- 向上（展開狀態顯示） -->
                    <BaseIcon v-else name="chevron-compact-down" />
                </button>
            </div>
        </header>
    </div>
</template>
<script setup>
import { onMounted, ref, inject, computed } from "vue";
import BaseIcon from "../base/BaseIcon.vue";

const ifOnTest = false;
const apiCallerValue = inject("apiCallerValue");
const userMenuList = ref([]);

// 檢測是否為行動設備
const isMobile = ref(false);
function checkIsMobile() {
    isMobile.value = window.innerWidth < 992; // Bootstrap lg breakpoint
}
window.addEventListener('resize', checkIsMobile);
onMounted(() => {
    checkIsMobile();
});

// 菜單展開狀態
const openedLayer1 = ref(null);
const openedLayer2 = ref({});
const userMenuOpen = ref(false);

// 第一層菜單事件
function onLayer1Hover(idx) {
    openedLayer1.value = idx;
}

function onLayer1Leave(idx) {
    openedLayer1.value = null;
    openedLayer2.value = {};
}

function onLayer1Click(idx) {
    if (openedLayer1.value === idx) {
        // 已經打開，再點一次收起
        openedLayer1.value = null;
        openedLayer2.value = {};
    } else {
        // 打開新的第一層菜單，重置第二層
        openedLayer1.value = idx;
        openedLayer2.value = {};
    }
}

// 第二層菜單事件
function onLayer2Hover(layer1Idx, layer2Idx) {
    openedLayer2.value[layer1Idx] = layer2Idx;
}

function onLayer2Leave(layer1Idx, layer2Idx) {
    if (openedLayer2.value[layer1Idx] === layer2Idx) {
        openedLayer2.value[layer1Idx] = null;
    }
}

function onLayer2Click(layer1Idx, layer2Idx) {
    if (openedLayer2.value[layer1Idx] === layer2Idx) {
        openedLayer2.value[layer1Idx] = null;
    } else {
        // 先檢查第一層是否打開
        if (openedLayer1.value !== layer1Idx && isMobile.value) {
            openedLayer1.value = layer1Idx;
        }
        openedLayer2.value[layer1Idx] = layer2Idx;
    }
}

// 控制選單收合
const isNavVisible = ref(true);
function toggleNav() {
    isNavVisible.value = !isNavVisible.value;
}
// 模擬使用者資訊
const userInfo = {
    name: "許弘毅",
};

const userMenuItems = [
    { label: "使用者管理", href: "/UserManagement/Home" },
    { label: "使用者鎖定管理", href: "/UserLockManagement/Home" },
    { label: "群組管理", href: "/GroupManagement/Home" },
    { label: "單位管理", href: "/UnitManagement/Home" },
    { label: "存取記錄查詢", href: "/AccessLog/Home" },
    { label: "Error Log", href: "/ErrorLog/Home" },
    { label: "資料來源頁面", href: "/DataSourceInfo/Home" },
    { label: "變更密碼", href: "/Account/ChangePassword" },
    { label: "登出", href: "/Account/Logout", action: "logout" },
];

function handleUserMenuAction(action, event) {
    if (action === "logout") {
        const confirmed = window.confirm("確定要登出嗎？");

        if (!confirmed) {
            event.preventDefault();
        }
    }
}
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
            console.log("@@:", res.data);

            //    let vuePageHelper = (new VuePageHelper(res.data));
            //    glossary.value = vuePageHelper.getGlossary();
            //   userMenuList.value = res.data;

            let list = res.data;
            userMenuList.value = buildMenuTree(list);
        });
});

</script>

<style scoped>

/* 縮放按鈕樣式 */
.header-toggle {
    position: relative;
    text-align: center;
    margin-top: -10px;
    display: none; /* 預設隱藏 */
}

.header_block:hover .header-toggle {
    display: block; /* hover header 時顯示按鈕 */
}

.toggle-btn {
    background-color: #f3f5f7;
    color: #39a771;
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
.header_outer {
    display: flex;
    flex-direction: column;
}
.nav-txt {
    color: #39a771;
}

/* ===== dropdown item（完全照原樣）===== */
.dropdown-menu .dropdown-item {
    font-family: "Noto Sans TC", sans-serif;
    font-weight: 400;
    font-size: 19px;
    line-height: 29px;

    color: #39a771; /* 預設綠字 */

    padding: 8px 16px;
}

/* ===== hover（你原本的樣子：綠底 + 白字）===== */
.dropdown-menu .dropdown-item:hover,
.dropdown-menu .dropdown-item:focus {
    background-color: #39a771 !important;
    color: rgb(255, 255, 255) !important;
}

/* ===== active（點擊時）===== */
.dropdown-menu .dropdown-item:active {
    background-color: #39a771 !important;
    color: rgb(255, 255, 255) !important;
}

/* ===== icon（SVG）===== */
.dropdown-menu .dropdown-item svg {
    stroke: #39a771;
    fill: none;
}

/* hover icon 變白（照你畫面） */
.dropdown-menu .dropdown-item:hover svg {
    stroke: #ffffff;
    fill: #ffffff;
}

/* ===== 上層「資料來源」文字 ===== */
.nav-link.dropdown-toggle {
    font-family: "Noto Sans TC", sans-serif;
    font-weight: 400;
    font-size: 19px;
    line-height: 29px;

    color: #39a771;
}

/* hover 不改太多（維持原樣） */
.nav-link.dropdown-toggle:hover {
    color: #39a771;
}

/* ===== 自訂 dropdown 顯示邏輯 ===== */
.dropdown-menu.show {
    display: block;
}

.submenu.show {
    display: block !important;
}

.nav-item.rain_menu:hover > .dropdown-menu:not(.show) {
    display: block;
}

/* 使用者菜單樣式調整 */
.user-menu-wrapper {
    position: relative;
}

.user-menu-btn {
    /* min-width: 140px; */
    justify-content: flex-start;
}

.user-dropdown-menu {
    /* min-width: 180px; */
    /* max-height: 400px; */
    overflow-y: auto;
    position: absolute;
    right: 0;
}

/* 使用者名稱（許弘毅） */
.user-name {
    font-family: "Noto Sans TC", sans-serif;
    font-weight: 400;
    font-size: 19px;
    line-height: 29px;
    color: rgb(57, 167, 113);
}
</style>
