<template>
    <Header />
    <div class="simulation-outer">
        <div class="simulation-layout">
            <PageHeader>
                <template #title> 供灌情境方案模擬(水庫灌區) </template>

                <template #subtitle>
                    供灌決策 / 供灌情境方案模擬(水庫灌區)
                </template>

                <template #update-time> 更新日期：{{ updateTime }} </template>
            </PageHeader>

            <!-- 左右主區 -->
            <div class="content-row">
                <!-- 左側 -->
                <div class="left-panel" :class="{ collapsed: !leftShow }">
                    <div class="left-card">
                        <div class="section-header">
                            <span class="section-icon">
                                <i class="bi bi-gear"></i>
                            </span>
                            <span class="section-title">
                                {{ currentStepTitle }}
                            </span>
                        </div>
                        <!-- 切換按鈕 -->
                        <div class="step-switch-arrow" @click="leftPanelHide">
                            <button type="button" class="arrow-btn">
                                <i
                                    class="bi"
                                    :class="
                                        leftShow
                                            ? 'bi-chevron-left'
                                            : 'bi-chevron-right'
                                    "
                                ></i>
                            </button>
                        </div>

                        <div class="left-body">
                            <!-- TODO:Step 1 -->
                            <div
                                v-if="currentStep === 1"
                                class="inner-form-box"
                            >
                                <div class="form-row">
                                    <label class="form-label">選擇水庫</label>
                                    <select
                                        class="custom-select"
                                        v-model="form.stationNo"
                                        @change="handleStationChange"
                                    >
                                        <option value="" disabled>
                                            請選擇水庫
                                        </option>
                                        <option
                                            v-for="item in reservoirOptions"
                                            :key="item.StationNo"
                                            :value="item.StationNo"
                                        >
                                            {{ item.StationName }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label class="form-label"
                                        >展示起始日期</label
                                    >
                                    <BaseDatePicker
                                        v-model="form.demoStartDate"
                                        display-format="ROC-YYYY-MM-DD"
                                    />
                                </div>

                                <div class="form-row">
                                    <label class="form-label">模擬期間</label>
                                    <div class="date-range-group">
                                        <BaseDatePicker
                                            v-model="form.simuStartDate"
                                            display-format="ROC-YYYY-MM-DD"
                                        />
                                        <BaseDatePicker
                                            v-model="form.simuEndDate"
                                            display-format="ROC-YYYY-MM-DD"
                                        />
                                    </div>
                                </div>

                                <div class="form-row">
                                    <label class="form-label"
                                        >初始蓄水量
                                        <br />
                                        <span>
                                            {{ toROCDate(form.compareDate) }}
                                        </span>
                                    </label>
                                    <div class="storage-row">
                                        <input
                                            type="number"
                                            class="custom-input storage-input"
                                            v-model.number="
                                                form.effectiveStorage
                                            "
                                            disabled="effectiveStorageLoading"
                                            :placeholder="
                                                effectiveStorageLoading
                                                    ? '載入中...'
                                                    : ''
                                            "
                                        />
                                        <span class="unit-text">萬噸</span>
                                        <button
                                            type="button"
                                            class="history-btn"
                                            :class="{
                                                'is-disabled':
                                                    effectiveStorageLoading,
                                            }"
                                            @click="openHistoryModal"
                                            :disabled="effectiveStorageLoading"
                                        >
                                            歷史同期
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- TODO:Step 2 -->
                            <div
                                v-if="currentStep === 2"
                                class="inner-form-box"
                            >
                                <!-- 水庫設定 -->
                                <div class="form-row">
                                    <label class="form-label">水庫</label>
                                    <select
                                        class="custom-select"
                                        v-model="form.stationNo"
                                        disabled
                                    >
                                        <option
                                            v-for="item in reservoirOptions"
                                            :key="item.StationNo"
                                            :value="item.StationNo"
                                        >
                                            {{ item.StationName }}
                                        </option>
                                    </select>
                                </div>
                                <!-- 情境設定 -->
                                <div class="form-row">
                                    <label class="form-label">選擇情境</label>
                                    <select
                                        class="custom-select"
                                        v-model="form.selectedSolutionId"
                                    >
                                        <option
                                            v-for="s in scenarioOptions"
                                            :key="s.id"
                                            :value="s.id"
                                        >
                                            {{ s.solutionName }}
                                        </option>
                                    </select>
                                </div>
                                <!-- 安全蓄水量設定 -->
                                <div class="form-row">
                                    <label class="form-label">安全蓄水量</label>
                                    <div class="storage-row">
                                        <input
                                            type="number"
                                            class="custom-input storage-input"
                                            :value="form.safeStorage"
                                            @input="
                                                (e) =>
                                                    handleNumberInput(
                                                        e,
                                                        form,
                                                        'safeStorage',
                                                    )
                                            "
                                        />
                                        <span class="unit-text">萬噸</span>
                                    </div>
                                </div>
                                <!-- 供灌表格設定 -->
                                <div class="scenario-section-wrapper">
                                    <div
                                        v-if="scenarioLoading"
                                        class="section-loading-mask"
                                    >
                                        <div class="loading-content">
                                            <div class="spinner"></div>
                                            <span>情境資料更新中...</span>
                                        </div>
                                    </div>
                                    <div class="water-table-wrap">
                                        <table class="water-setting-table">
                                            <thead>
                                                <tr>
                                                    <th
                                                        class="th-check"
                                                        rowspan="2"
                                                    >
                                                        供灌
                                                    </th>
                                                    <th rowspan="2">名稱</th>
                                                    <th rowspan="2">
                                                        用水量<br />(萬噸)
                                                    </th>
                                                    <th rowspan="2">
                                                        供灌日期
                                                    </th>
                                                    <th rowspan="2">面積(%)</th>
                                                    <th colspan="2">用水(%)</th>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        整田
                                                        <span
                                                            class="info-tooltip"
                                                        >
                                                            <i
                                                                class="bi bi-info-circle"
                                                            ></i>
                                                            <span
                                                                class="tooltip-text"
                                                            >
                                                                計畫用水*面積百分比*整田折扣
                                                            </span>
                                                        </span>
                                                    </th>

                                                    <th>
                                                        本田
                                                        <span
                                                            class="info-tooltip"
                                                        >
                                                            <i
                                                                class="bi bi-info-circle"
                                                            ></i>
                                                            <span
                                                                class="tooltip-text"
                                                            >
                                                                計畫用水*面積百分比*本田折扣
                                                            </span>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                    v-for="(item, index) in form
                                                        .waterSetting
                                                        .irrigationList"
                                                    :key="index"
                                                    :class="{
                                                        'row-disabled':
                                                            !item.enabled,
                                                    }"
                                                >
                                                    <td class="td-check">
                                                        <input
                                                            type="checkbox"
                                                            v-model="
                                                                item.enabled
                                                            "
                                                        />
                                                    </td>
                                                    <td class="text">
                                                        {{ item.manageName }}
                                                    </td>
                                                    <td class="text">
                                                        {{ item.waterUsage }}
                                                    </td>
                                                    <td>
                                                        <div
                                                            :class="{
                                                                'date-disabled':
                                                                    !item.enabled,
                                                            }"
                                                        >
                                                            <BaseDatePicker
                                                                v-model="
                                                                    item.irrigationDate
                                                                "
                                                                display-format="MM-DD"
                                                                value-format="YYYY-MM-DD"
                                                                width="65px"
                                                                :disabled="
                                                                    !item.enabled
                                                                "
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            class="table-input"
                                                            v-model="
                                                                item.IrrigationAreaPercent
                                                            "
                                                            @input="
                                                                (e) =>
                                                                    handleNumberInput(
                                                                        e,
                                                                        item,
                                                                        'IrrigationAreaPercent',
                                                                        {
                                                                            min: 0,
                                                                            max: 100,
                                                                        },
                                                                    )
                                                            "
                                                            @keydown="
                                                                preventInvalidInput
                                                            "
                                                            @blur="
                                                                () =>
                                                                    handleBlurNumber(
                                                                        item,
                                                                        'IrrigationAreaPercent',
                                                                    )
                                                            "
                                                            :disabled="
                                                                !item.enabled
                                                            "
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            class="table-input"
                                                            v-model="
                                                                item.WaterPercentOfFieldPeriod
                                                            "
                                                            @input="
                                                                (e) =>
                                                                    handleNumberInput(
                                                                        e,
                                                                        item,
                                                                        'WaterPercentOfFieldPeriod',
                                                                        {
                                                                            min: 0,
                                                                            max: 100,
                                                                        },
                                                                    )
                                                            "
                                                            @keydown="
                                                                preventInvalidInput
                                                            "
                                                            @blur="
                                                                () =>
                                                                    handleBlurNumber(
                                                                        item,
                                                                        'WaterPercentOfFieldPeriod',
                                                                    )
                                                            "
                                                            :disabled="
                                                                !item.enabled
                                                            "
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            class="table-input"
                                                            v-model="
                                                                item.WaterPercentOfVegetativePeriod
                                                            "
                                                            @input="
                                                                (e) =>
                                                                    handleNumberInput(
                                                                        e,
                                                                        item,
                                                                        'WaterPercentOfVegetativePeriod',
                                                                        {
                                                                            min: 0,
                                                                            max: 100,
                                                                        },
                                                                    )
                                                            "
                                                            @keydown="
                                                                preventInvalidInput
                                                            "
                                                            @blur="
                                                                () =>
                                                                    handleBlurNumber(
                                                                        item,
                                                                        'WaterPercentOfVegetativePeriod',
                                                                    )
                                                            "
                                                            :disabled="
                                                                !item.enabled
                                                            "
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <!-- 入流量設定 -->
                                <div class="setting-block inflow-setting-block">
                                    <div
                                        class="setting-block-title green-title"
                                    >
                                        入流量設定
                                    </div>

                                    <div class="inflow-options">
                                        <div class="inflow-select-group">
                                            <div class="inflow-row">
                                                <div class="inflow-btn-group">
                                                    <button
                                                        v-for="item in inflowOptions"
                                                        :key="item.value"
                                                        type="button"
                                                        class="inflow-btn"
                                                        :class="{
                                                            active: form.selectedInflows.includes(
                                                                item.value,
                                                            ),
                                                        }"
                                                        @click="
                                                            toggleInflow(
                                                                item.value,
                                                            )
                                                        "
                                                    >
                                                        {{ item.label }}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="left-actions">
                                <button
                                    v-if="currentStep > 1"
                                    type="button"
                                    class="action-btn action-btn-secondary"
                                    @click="prevStep"
                                >
                                    上一步
                                </button>

                                <button
                                    v-if="currentStep < 2"
                                    type="button"
                                    class="action-btn action-btn-primary next-btn"
                                    :class="{
                                        'is-disabled': isNextDisabled,
                                        'is-loading': nextLoading,
                                    }"
                                    @click="nextStep"
                                    :disabled="isNextDisabled"
                                    :title="getNextBtnTitle"
                                >
                                    <span v-if="nextLoading">
                                        <i class="spinner"></i> 載入中...</span
                                    >
                                    <span v-else>下一步</span>
                                </button>

                                <button
                                    v-if="currentStep === 2"
                                    type="button"
                                    class="action-btn action-btn-primary"
                                    @click="fetchSetSimulationParams"
                                >
                                    開始模擬
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右側 -->
                <div class="right-panel">
                    <div class="right-card">
                        <div class="toolbar">
                            <button type="button" class="tool-btn">
                                匯出參數
                            </button>
                            <button type="button" class="tool-btn">
                                excel
                            </button>
                        </div>

                        <div class="result-box">
                            <div class="empty-text" v-if="false">
                                尚未設定模擬條件，請先於左側設定！
                            </div>
                            <ReservoirSimulationChart
                                :loading="chartLoading"
                                :chart-data="chartData"
                                title="蓄水量模擬歷線圖"
                                height="520px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 歷史同期表格 -->
    <div
        v-if="historyModalVisible"
        class="history-modal-mask"
        @click.self="closeHistoryModal"
    >
        <div class="history-modal">
            <div class="history-modal-header">
                <h3 class="history-modal-title">歷年初始蓄水量</h3>
                <button
                    type="button"
                    class="history-modal-close"
                    @click="closeHistoryModal"
                >
                    ×
                </button>
            </div>

            <div class="history-modal-body">
                <div class="form-row">
                    <label class="form-label">選擇日期</label>
                    <div class="date-input-wrap">
                        <!-- 歷史同期 -->
                        <BaseDatePicker
                            v-model="form.compareDate"
                            display-format="MM-DD"
                        />
                    </div>
                </div>
                <div class="history-table-wrap">
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th class="radio-col"></th>

                                <th
                                    @click="handleSort('Rank')"
                                    class="sortable"
                                >
                                    排名
                                    <span v-if="sortKey === 'Rank'">
                                        {{ sortOrder === "asc" ? "▲" : "▼" }}
                                    </span>
                                </th>

                                <th
                                    @click="handleSort('year')"
                                    class="sortable"
                                >
                                    年度
                                    <span v-if="sortKey === 'year'">
                                        {{ sortOrder === "asc" ? "▲" : "▼" }}
                                    </span>
                                </th>

                                <th
                                    @click="handleSort('EffectiveStorage')"
                                    class="sortable"
                                >
                                    有效蓄水量(萬噸)
                                    <span v-if="sortKey === 'EffectiveStorage'">
                                        {{ sortOrder === "asc" ? "▲" : "▼" }}
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody v-if="historyLoading">
                            <tr>
                                <td colspan="4" class="loading-text">
                                    資料載入中...
                                </td>
                            </tr>
                        </tbody>

                        <tbody v-else-if="historyStorageList.length > 0">
                            <tr
                                v-for="item in sortedHistoryList"
                                :key="item.year"
                                :class="{
                                    active: selectedHistoryYear === item.year,
                                }"
                            >
                                <td class="radio-col">
                                    <input
                                        type="radio"
                                        name="historyStorage"
                                        :value="item.year"
                                        v-model="selectedHistoryYear"
                                    />
                                </td>
                                <td>{{ item.Rank }}</td>
                                <td>{{ item.year }}</td>
                                <td>
                                    {{ formatNumber(item.EffectiveStorage) }}
                                </td>
                            </tr>
                        </tbody>

                        <tbody v-else>
                            <tr>
                                <td colspan="4" class="no-data">
                                    無歷史同期資料
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="history-modal-footer">
                <button
                    type="button"
                    class="modal-btn modal-btn-confirm"
                    @click="confirmHistoryStorage"
                >
                    確定
                </button>
                <button
                    type="button"
                    class="modal-btn modal-btn-cancel"
                    @click="closeHistoryModal"
                >
                    關閉
                </button>
            </div>
        </div>
    </div>
    <hr />
    <div class="p-2" v-if="false">
        {{ form }}
    </div>
</template>

<script setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import Header from "@/components/general/header.vue";
import PageHeader from "@/components/PageHeader.vue";
import dayjs from "dayjs";
import ReservoirSimulationChart from "@/views/SupIrrigDecisions/ReservoirSimulationChart.vue";
import BaseDatePicker from "@/components/BaseDatePicker.vue";
import { watchDebounced } from "@vueuse/core";
import {
    getLastUpdate,
    getReservoirsList,
    getInitialWaterStorage,
    getHistoricalPeriod,
    getPiTypeValue,
    getSolutionList,
    setSimulationParams,
    getSafetyWaterLine,
} from "@/apis/modules/SupIrrigDecisions/SimulationPage";

onMounted(async () => {
    await fetchReservoirs();
    await fetchUpdate();
    fetchInitialWaterStorage();
});

//設定的參數
const form = reactive({
    stationNo: "", //目前選擇的水庫
    compareDate: dayjs().format("YYYY-MM-DD"), //歷史同期比較日期
    demoStartDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"), //展示起始日期
    simuEndDate: dayjs().add(2, "month").format("YYYY-MM-DD"), //模擬結束日期
    simuStartDate: dayjs().format("YYYY-MM-DD"), //模擬開始日期
    solutionName: "", //選擇的解決方案名稱
    selectedSolutionId: "", //選擇的解決方案id
    safeStorage: 4800, //安全蓄水量
    selectedInflows: [], //選擇的入流量選項
    effectiveStorage: 0,
    waterSetting: {
        irrigationList: [], //灌溉用水
    },
});
// 當前步驟
const currentStep = ref(1);
// 步驟標題對應表
const stepTitleMap = {
    1: "模擬期間與蓄水量設定",
    2: "用水量設定",
};
// 計算當前步驟標題
const currentStepTitle = computed(() => stepTitleMap[currentStep.value]);

// 下一步按鈕狀態
const isNextDisabled = computed(() => {
    return nextLoading.value || effectiveStorageLoading.value;
});
// 下一步按鈕提示文字
const getNextBtnTitle = computed(() => {
    if (effectiveStorageLoading.value) return "資料更新中，請稍候";
    if (nextLoading.value) return "資料載入中...";
    return "";
});
// 下一步
const nextLoading = ref(false);

async function nextStep() {
    if (isNextDisabled.value) return;
    if (currentStep.value >= 3) return;
    if (nextLoading.value) return;

    nextLoading.value = true;

    try {
        if (currentStep.value === 1) {
            // await fetchWaterDemandData();
            await fetchPiTypeValue();
            await fetchSolutionList();
        }

        currentStep.value += 1;
    } catch (error) {
        console.error("下一步資料取得失敗:", error);
    } finally {
        nextLoading.value = false;
    }
}

function prevStep() {
    if (currentStep.value > 1) {
        currentStep.value -= 1;
    }
}
// ========取得水庫選項============================
//  水庫選項
const effectiveStorageLoading = ref(false);
const reservoirOptions = ref([]);
async function fetchReservoirs() {
    try {
        const res = await getReservoirsList();
        reservoirOptions.value = res?.data ?? [];

        if (reservoirOptions.value.length > 0) {
            form.stationNo = reservoirOptions.value[0].StationNo;
        }
    } catch (error) {
        console.error("取得水庫列表失敗:", error);
        reservoirOptions.value = [];
        form.stationNo = "";
    }
}
// 切換水庫
async function handleStationChange() {
    effectiveStorageLoading.value = true;
    form.effectiveStorage = null;

    try {
        await fetchInitialWaterStorage();
    } finally {
        effectiveStorageLoading.value = false;
    }
}
// ========取得更新時間============================
// 更新時間
const updateTime = ref(null);
async function fetchUpdate() {
    try {
        const res = await getLastUpdate();
        updateTime.value = res?.data?.LastUpdate ?? "--";
    } catch (error) {
        console.error("取得更新時間失敗:", error);
        updateTime.value = "--";
    }
}
// ========取得初始蓄水量============================
async function fetchInitialWaterStorage() {
    try {
        let payload = {
            StationNo: form.stationNo,
            CompareDate: form.compareDate,
        };
        const res = await getInitialWaterStorage(payload);
        form.effectiveStorage = Math.round(res?.data?.EffectiveStorage ?? 0);
    } catch (error) {
        console.error("取得初始蓄水量失敗:", error);
        form.effectiveStorage = 0;
    }
}
// ========取得歷史同期============================
// 歷史同期表格
const historyModalVisible = ref(false);
const historyLoading = ref(false);
const selectedHistoryYear = ref(null);

//原始資料
const historyStorageList = ref([]);
//排序後
const sortKey = ref("Rank"); // 預設用排名
const sortOrder = ref("asc"); // asc / desc
const sortedHistoryList = computed(() => {
    const list = [...historyStorageList.value];

    return list.sort((a, b) => {
        const valA = a[sortKey.value] ?? 0;
        const valB = b[sortKey.value] ?? 0;

        if (sortOrder.value === "asc") {
            return valA - valB;
        } else {
            return valB - valA;
        }
    });
});
//控制排序
function handleSort(key) {
    if (sortKey.value === key) {
        // 同一欄 → 切換順序
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        // 不同欄 → 換欄 + 預設 asc
        sortKey.value = key;
        sortOrder.value = "asc";
    }
}
async function fetchHistoricalPeriod() {
    try {
        if (!form.stationNo || !form.compareDate) {
            console.warn("查詢條件不足，略過歷史同期查詢");
            historyStorageList.value = [];
            return;
        }

        const compareDateObj = dayjs(form.compareDate);

        if (!compareDateObj.isValid()) {
            console.warn("compareDate 格式不合法：", form.compareDate);
            historyStorageList.value = [];
            return;
        }

        const compareDate = compareDateObj.format("MM-DD");

        const payload = {
            StationNo: form.stationNo,
            CompareDate: compareDate,
        };

        const res = await getHistoricalPeriod(payload);

        historyStorageList.value = (res?.data ?? []).map((item) => {
            const dateObj = dayjs(item.Date);
            const rocYear = dateObj.isValid() ? dateObj.year() - 1911 : "";

            const storage =
                item.EffectiveStorage != null &&
                !isNaN(Number(item.EffectiveStorage))
                    ? Math.round(Number(item.EffectiveStorage))
                    : 0;

            return {
                ...item,
                year: rocYear,
                EffectiveStorage: storage,
            };
        });
    } catch (error) {
        console.error("取得歷史同期資料失敗:", error);
        historyStorageList.value = [];
    }
}

async function openHistoryModal() {
    historyModalVisible.value = true;
    historyLoading.value = true;

    try {
        await fetchHistoricalPeriod();
    } finally {
        historyLoading.value = false;
    }
}
function closeHistoryModal() {
    historyModalVisible.value = false;
}

function confirmHistoryStorage() {
    if (selectedHistoryYear.value === null) return;

    const selectedItem = historyStorageList.value.find(
        (item) => item.year === selectedHistoryYear.value,
    );

    if (!selectedItem) return;

    form.effectiveStorage = selectedItem.EffectiveStorage;
    historyModalVisible.value = false;
}

// 監聽歷史同期日期變化，自動更新歷史同期表格
watchDebounced(
    () => form.compareDate,
    async () => {
        console.log("🔥 觸發 API:", form.compareDate);
        if (!historyModalVisible.value) return;

        historyLoading.value = true;
        selectedHistoryYear.value = null;

        try {
            await fetchHistoricalPeriod();
        } finally {
            historyLoading.value = false;
        }
    },
    {
        debounce: 500,
    },
);

// ========取得入流量設定============================

//入流量選項（之後可以改成 API）
const inflowOptions = ref([]);

async function fetchPiTypeValue() {
    try {
        let payload = {
            StationNo: form.stationNo,
        };
        const res = await getPiTypeValue(payload);
        inflowOptions.value = res?.data ?? [];
    } catch (error) {
        console.error("取得入流量設定失敗:", error);
        inflowOptions.value = [];
    }
}
function toggleInflow(value) {
    const index = form.selectedInflows.indexOf(value);

    if (index === -1) {
        form.selectedInflows.push(value);
    } else {
        form.selectedInflows.splice(index, 1);
    }
}

// 轉變顯示民國年格式
function toROCDate(dateStr) {
    const d = dayjs(dateStr);
    if (!d.isValid()) return "";

    const rocYear = d.year() - 1911;
    return `${rocYear}-${d.format("MM-DD")}`;
}

// 監聽水庫切換（之後你會用到）
watch(
    () => form.stationNo,
    (val) => {
        if (!val) return;

        console.log("目前選擇水庫:", val);

        // 👉 這裡之後可以做：
        // 1. 更新 options（方案/需水量）
        // 2. 設定預設值
        // 3. 清空舊資料
    },
);
// 設定參數區塊縮放
const leftShow = ref(true);
function leftPanelHide() {
    leftShow.value = !leftShow.value;
}
//step2
// ================取得情境清單============================================

//情境計畫選項
const scenarioOptions = ref([]);
//情境計畫載入狀態
const scenarioLoading = ref(false);
async function fetchSolutionList() {
    try {
        const res = await getSolutionList({
            stationNo: form.stationNo,
        });

        scenarioOptions.value = res?.data ?? [];

        if (scenarioOptions.value.length > 0) {
            form.selectedSolutionId = scenarioOptions.value[0].id;
        } else {
            form.selectedSolutionId = "";
            form.solutionName = "";
            form.waterSetting.irrigationList = [];
            form.selectedInflows = [];
        }
    } catch (error) {
        console.error("取得情境清單失敗:", error);
        scenarioOptions.value = [];
        form.selectedSolutionId = "";
        form.solutionName = "";
        form.waterSetting.irrigationList = [];
        form.selectedInflows = [];
    }
}
// 轉換資料格式（API格式轉成畫面需要的格式）
function mapSolutionToIrrigationList(irrigationList = []) {
    return irrigationList.map((item) => ({
        enabled: false,
        manageId: item.ManageID ?? "",
        manageName: item.ManageName ?? "",
        waterUsage: Math.round(item.WaterUsage ?? 0),
        irrigationDate: dayjs(item.IrrigationDate).isValid()
            ? dayjs(item.IrrigationDate).format("YYYY-MM-DD")
            : "",
        IrrigationAreaPercent: 100,
        WaterPercentOfFieldPeriod: 100,
        WaterPercentOfVegetativePeriod: 100,
    }));
}
// 取得入流量列表
async function applySelectedScenario() {
    const selectedScenario = scenarioOptions.value.find(
        (item) => item.id === form.selectedSolutionId,
    );

    if (!selectedScenario) {
        resetScenarioState();
        return;
    }

    scenarioLoading.value = true;

    try {
        form.solutionName = selectedScenario.solutionName ?? "";

        // 🔥 清空舊資料（避免殘留）
        form.selectedInflows = [];
        form.waterSetting.irrigationList = [];

        // 👉 模擬 loading（如果未來改 API 也可用）
        await Promise.resolve();

        form.waterSetting.irrigationList = mapSolutionToIrrigationList(
            selectedScenario.irrigationList,
        );
    } catch (error) {
        console.error("套用情境失敗:", error);
        resetScenarioState();
    } finally {
        scenarioLoading.value = false;
    }
}
watch(
    () => form.selectedSolutionId,
    (newValue, oldValue) => {
        if (!newValue || newValue === oldValue) return;

        applySelectedScenario();
    },
);

// =========開始模擬============================
const isSimulationDirty = ref(false);   // 是否有未儲存的模擬結果
const hasSimulationResult = ref(false); // 是否有模擬結果
// 任何可能影響模擬結果的參數變動都應該呼叫這個函式來標記模擬結果為過期
function markSimulationDirty() {
    // 還沒跑過模擬就不用標
    if (!hasSimulationResult.value) return;

    isSimulationDirty.value = true;
}

async function fetchSetSimulationParams() {
    let params = {
        stationNo: form.stationNo,
        SolutionPrefix: "",
        DemoStartDate: form.demoStartDate,
        SimuStartDate: form.simuStartDate,
        SimuEndDate: form.simuEndDate,
        EffectiveStorage: form.effectiveStorage,
        WaterSetting: {
            ItemType: 1,
            HasWaterSubsidy: 0,
            DomesicIndustrialWaterOfDay: "0",
            AdvancedSetting: {
                Period: 1,
                CropTR: [
                    {
                        ManageID: "NO1",
                        ManageName: "新化",
                        IrrigationDate: "2026-01-21",
                        IrrigationAreaPercent: 1,
                        WaterPercentOfFieldPeriod: 1,
                        WaterPercentOfVegetativePeriod: 1,
                    },
                    {
                        ManageID: "NO2",
                        ManageName: "佳里",
                        IrrigationDate: "2026-01-21",
                        IrrigationAreaPercent: 1,
                        WaterPercentOfFieldPeriod: 1,
                        WaterPercentOfVegetativePeriod: 1,
                    },
                ],
                CropTM: [],
            },
            InflowSetting: {
                TriwraQ70: 0,
                TriwraQ80: 0,
                TriwraQ90: 0,
                TriwraQ95: 0,
                WraQ70: 0,
                WraQ80: 0,
                WraQ90: 0,
                TenYear: 0,
                selectedInflows: form.selectedInflows,
                EveryTenDay: [
                    0,
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                ],
                EveryTenDayNoSort: [
                    0,
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                ],
                HistoryInflow: [0, "", ""],
            },
        },
    };
    let safetyWaterParams = {
        StationNo: form.stationNo,
        DemoStartDate: form.demoStartDate,
        SimuStartDate: form.simuStartDate,
        SimuEndDate: form.simuEndDate,
        EffectiveStorage: form.effectiveStorage,
        CustomSafeWater: form.safeStorage,
    };
    console.log(params);

    try {
        chartLoading.value = true;

        const payload = buildSimulationPayload();
        console.log("送出的 payload:", payload);

        const [simulationRes, safetyRes] = await Promise.all([
            setSimulationParams(payload),
            getSafetyWaterLine(safetyWaterParams),
        ]);

        const mapped = mapSimulationApiToChartData(
            simulationRes?.data ?? [],
            safetyRes?.data ?? [],
        );

        chartXAxisData.value = mapped.xAxisData;
        actualSeries.value = mapped.actualSeries;
        simulationSeries.value = mapped.simulationSeries;
        warningStorage.value = mapped.warningStorage;

        // ✅ 模擬成功後，標記為最新
        isSimulationDirty.value = false;
        hasSimulationResult.value = true;
    } catch (error) {
        console.error("開始模擬失敗:", error);

        chartXAxisData.value = [];
        actualSeries.value = [];
        simulationSeries.value = [];
        warningStorage.value = 0;
    } finally {
        chartLoading.value = false;
    }
}
function buildSimulationPayload() {
    return {
        DemoStartDate: form.demoStartDate,
        EffectiveStorage: Number(form.effectiveStorage ?? 0),
        SimuEndDate: form.simuEndDate,
        SimuStartDate: form.simuStartDate,
        SolutionPrefix: form.solutionName,
        stationNo: form.stationNo,

        WaterSetting: {
            ItemType: 1,
            HasWaterSubsidy: 0,
            DomesicIndustrialWaterOfDay: 0,

            AdvancedSetting: {
                Period: 1,

                CropTR: form.waterSetting.irrigationList
                    .filter((item) => item.enabled)
                    .map((item) => ({
                        ManageID: item.manageId,
                        ManageName: item.name,
                        IrrigationDate: normalizeDate(item.irrigationDate),
                        IrrigationAreaPercent: normalizePercent(
                            item.IrrigationAreaPercent,
                        ),
                        WaterPercentOfFieldPeriod: normalizePercent(
                            item.WaterPercentOfFieldPeriod,
                        ),
                        WaterPercentOfVegetativePeriod: normalizePercent(
                            item.WaterPercentOfVegetativePeriod,
                        ),
                    })),

                CropTM: [],
            },

            InflowSetting: {
                selectedInflows: [...form.selectedInflows],
                EveryTenDay: [],
                EveryTenDayNoSort: [],
                HistoryInflow: [0, "", ""],
            },
        },
    };
}
function normalizePercent(value) {
    let num = Number(value);

    if (isNaN(num)) return 0;
    if (num < 0) num = 0;
    if (num > 100) num = 100;

    return num / 100;
}

function normalizeDate(value) {
    const d = dayjs(value);

    if (!d.isValid()) return "";

    return d.format("YYYY-MM-DD");
}
// ============ api整理成echarts格式 ===================
const chartLoading = ref(false);
const chartXAxisData = ref([]);
const actualSeries = ref([]);
const simulationSeries = ref([]);
const warningStorage = ref(0);
const chartData = computed(() => {
    return {
        xAxis: chartXAxisData.value,
        actualSeries: actualSeries.value,
        simulationSeries: simulationSeries.value,
        warningStorage: warningStorage.value,
    };
});
function mapSimulationApiToChartData(simulationRes = [], safetyWaterRes = []) {
    const allDateSet = new Set();

    // 只收模擬結果日期
    simulationRes.forEach((group) => {
        (group.Values ?? []).forEach((item) => {
            const d = dayjs(String(item.Date).replace(/\//g, "-"));
            if (d.isValid()) {
                allDateSet.add(d.format("YYYY-MM-DD"));
            }
        });
    });

    const sortedDates = [...allDateSet].sort((a, b) => {
        return dayjs(a).valueOf() - dayjs(b).valueOf();
    });

    const xAxisData = sortedDates.map((date) => dayjs(date).format("MM-DD"));

    const actualGroup = simulationRes.find(
        (item) => item.Soluction === "實際蓄水量",
    );

    const actualMap = new Map(
        (actualGroup?.Values ?? []).map((item) => [
            dayjs(String(item.Date).replace(/\//g, "-")).format("YYYY-MM-DD"),
            Number(item.Storage ?? 0),
        ]),
    );

    const actualSeries = sortedDates.map((date) => {
        return actualMap.has(date) ? actualMap.get(date) : null;
    });

    const simColorMap = {
        "各旬-Q80": "#43b97f",
        "各旬-Q90": "#2f80ed",
        "各旬-Q70": "#f5a623",
        "各旬-Q95": "#9b51e0",
    };

    const simulationSeries = simulationRes
        .filter((item) => item.Soluction !== "實際蓄水量")
        .map((group, index) => {
            const storageMap = new Map(
                (group.Values ?? []).map((item) => [
                    dayjs(String(item.Date).replace(/\//g, "-")).format(
                        "YYYY-MM-DD",
                    ),
                    Number(item.Storage ?? 0),
                ]),
            );

            return {
                name: group.Soluction || `方案${index + 1}`,
                data: sortedDates.map((date) => {
                    return storageMap.has(date) ? storageMap.get(date) : null;
                }),
            };
        });

    const safeWaterList = (safetyWaterRes ?? [])
        .map((item) => Number(item.SafeWater ?? 0))
        .filter((num) => !isNaN(num));

    const warningStorage = safeWaterList.length > 0 ? safeWaterList[0] : 0;

    return {
        xAxisData,
        actualSeries,
        simulationSeries,
        warningStorage,
    };
}
// 數字輸入限制
function handleNumberInput(e, model, key, options = {}) {
    let value = e.target.value;

    // 🔥 允許輸入中（不要強制變0）
    if (value === "") {
        model[key] = "";
        return;
    }

    value = Number(value);

    const min = options.min ?? 0;
    const max = options.max ?? Infinity;

    if (isNaN(value)) {
        value = min;
    }

    if (value < min) value = min;
    if (value > max) value = max;

    // 🔥 整數處理（改用 round）
    if (options.integer !== false) {
        value = Math.round(value);
    }

    model[key] = value;
}
// 禁止輸入非數字和特殊字符
function preventInvalidInput(e) {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
    }
}
// 當輸入框失去焦點時，如果輸入為空，則設置為0
function handleBlurNumber(model, key) {
    if (model[key] === "" || model[key] === null) {
        model[key] = 0;
    }
}
function formatNumber(value) {
    return Number(value).toLocaleString();
}
</script>

<style scoped>
.simulation-outer {
    display: flex;
    justify-content: center;
    padding: 0.5rem 1rem;
    width: 100%;
    /* height: 100vh; */
}

.simulation-layout {
    width: 100%;
    /* min-height: 100vh; */
    background: #efefef;
    padding: 12px 20px 24px;
    border-radius: 10px;
    font-family: Arial, "Microsoft JhengHei", sans-serif;
}

.content-row {
    display: flex;
    gap: 35px;
}

.left-panel {
    position: relative;
    width: 42%;
    min-width: 420px;
    transition:
        width 0.3s ease,
        min-width 0.3s ease;
}

.left-panel.collapsed {
    width: 44px;
    min-width: 44px;
}

.right-panel {
    flex: 1;
    min-width: 0;
    transition: all 0.3s ease;
}

.left-card,
.right-card {
    position: relative;
    background: #f6f6f6;
    border-radius: 4px;
    padding: 0;
    min-height: 480px;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    color: #2ca25f;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
}

.section-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2ca25f;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
}

.section-title {
    transition: opacity 0.2s ease;
}

.step-switch-arrow {
    position: absolute;
    top: 12px;
    right: -26px;
    z-index: 10;
}

.arrow-btn {
    width: 24px;
    height: 34px;
    border: none;
    border-radius: 3px;
    background: #bfbfbf;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.left-body {
    padding: 8px 14px 20px;
}

.inner-form-box {
    background: #ededed;
    border-radius: 8px;
    padding: 14px 18px;
}

.form-row {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
}

.form-row:last-child {
    margin-bottom: 0;
}

.form-label {
    width: 120px;
    flex-shrink: 0;
    font-size: 16px;
    color: #222;
}

.custom-input,
.custom-select {
    width: 100%;
    height: 30px;
    border: 1px solid #d4d4d4;
    background: #fff;
    padding: 0 10px;
    font-size: 16px;
    color: #333;
    outline: none;
}
.custom-select:disabled {
    background: #e9ecef;
    color: #868e96;
    border-color: #dee2e6;
    cursor: not-allowed;
}
.custom-input.short {
    width: 100%;
    max-width: 620px;
}

.date-range-group {
    display: flex;
    gap: 8px;
    width: 100%;
}

.date-range-group .custom-input {
    flex: 1;
}

.storage-row {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
}

.storage-input {
    width: 180px;
}

.unit-text {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
}

.date-input {
    width: 180px;
}

.history-btn {
    height: 30px;
    padding: 0 14px;
    border: 1px solid #33aa66;
    background: #fff;
    color: #33aa66;
    font-size: 16px;
    white-space: nowrap;
}

.left-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
}

.action-btn {
    min-width: 90px;
    height: 32px;
    border: none;
    border-radius: 3px;
    font-size: 16px;
    color: #fff;
}

.action-btn-primary {
    background: #ff9800;
}
.action-btn-primary:hover {
    background: #ffa534;
}

.action-btn-secondary {
    background: #9e9e9e;
}

.toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    padding: 14px 16px 10px;
}

.tool-btn {
    height: 32px;
    padding: 0 12px;
    border: none;
    border-radius: 3px;
    background: #a8a8a8;
    color: #fff;
    font-size: 14px;
}

.result-box {
    margin: 8px 12px 14px;
    min-height: 404px;
    border: 1px solid #d0d0d0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-text {
    color: #b8b8b8;
    font-size: 16px;
}

/* ===== 左側收合狀態 ===== */
.left-panel.collapsed .section-title {
    opacity: 0;
    width: 0;
    overflow: hidden;
}

.left-panel.collapsed .left-body {
    display: none;
}

.left-panel.collapsed .left-card {
    min-height: 480px;
}

.left-panel.collapsed .section-header {
    justify-content: center;
    padding: 10px 8px;
}

/* ===== RWD ===== */
@media (max-width: 1200px) {
    .content-row {
        flex-direction: column;
    }

    .left-panel {
        width: 100%;
        min-width: 0;
    }

    .left-panel.collapsed {
        width: 100%;
        min-width: 0;
    }

    .step-switch-arrow {
        display: none;
    }
}

.scheme-setting-box {
    padding-bottom: 24px;
}

.setting-block {
    margin-top: 20px;
}

.setting-block-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 14px;
    line-height: 1.4;
}

.red-title,
.red-label {
    color: #b34b4b;
    font-weight: 700;
}

.green-title {
    color: #4a9d6d;
    font-weight: 700;
}

.align-start {
    align-items: flex-start;
}

.flex-1 {
    flex: 1;
}

.safe-storage-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
}

.safe-storage-value {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 180px;
}

.safe-storage-number {
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
}

.safe-storage-label {
    font-size: 16px;
    font-weight: 700;
}
/* 表格 */
.water-table-wrap {
    margin-top: 16px;
    overflow-x: hidden;
    border-top: 1px solid #e3e3e3;
    overflow: visible !important;
}

.water-setting-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}
.water-setting-table input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;

    accent-color: #4f93b5; /* 跟你按鈕一樣的藍色 */
}
.water-setting-table th,
.water-setting-table td {
    padding: 10px 6px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #ececec;
    background: #f8f8f8;
    font-size: 14px;
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
}

.water-setting-table thead th {
    color: #8d8d8d;
    font-weight: 700;
    background: #f8f8f8;
    white-space: nowrap;
}

.water-setting-table .th-check,
.water-setting-table .td-check {
    width: 44px;
}

/* 名稱欄：允許換行 */
.water-setting-table th:nth-child(2),
.water-setting-table td:nth-child(2) {
    width: 24%;
}

.water-setting-table td:nth-child(2) {
    white-space: normal;
    word-break: break-word;
    line-height: 1.4;
    text-align: left;
}

/* 用水量 */
.water-setting-table th:nth-child(3),
.water-setting-table td:nth-child(3) {
    width: 50px;
    white-space: nowrap;
}

/* 供灌日期 */
.water-setting-table th:nth-child(4),
.water-setting-table td:nth-child(4) {
    width: 50px;
    white-space: nowrap;
}

/* 面積 */
.water-setting-table th:nth-child(5),
.water-setting-table td:nth-child(5) {
    width: 50px;
    white-space: nowrap;
}

/* 整田 / 本田 */
.water-setting-table th:nth-child(6),
.water-setting-table td:nth-child(6),
.water-setting-table th:nth-child(7),
.water-setting-table td:nth-child(7) {
    width: 70px;
    white-space: nowrap;
}

.water-setting-table .text-red {
    font-weight: 700;
}

/* 表格內輸入框 */
.table-input {
    width: 100%;
    max-width: 58px;
    height: 36px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    background: #fff;
    text-align: center;
    font-size: 14px;
    color: #333;
    outline: none;
    box-sizing: border-box;
}

.table-input:focus {
    border-color: #39b37b;
    box-shadow: 0 0 0 1px #39b37b inset;
}

/* 日期選擇器在表格中的寬度控制 */
.water-setting-table td:nth-child(4) .base-date-picker {
    width: 65px;
    margin: 0 auto;
}

/* checkbox 對齊 */
.water-setting-table input[type="checkbox"] {
    width: 16px;
    height: 16px;
    vertical-align: middle;
}

/* 小螢幕時稍微放寬，避免擠壓太嚴重 */
@media (max-width: 1200px) {
    .water-setting-table th,
    .water-setting-table td {
        padding: 8px 4px;
        font-size: 13px;
    }

    .table-input {
        max-width: 52px;
        height: 32px;
        font-size: 13px;
    }

    .water-setting-table td:nth-child(4) .base-date-picker {
        width: 60px;
    }
}
/* tooltip 容器 */
.info-tooltip {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    cursor: pointer;
}

/* icon */
.info-tooltip i {
    font-size: 12px;
    color: #9aa0a6;
}

/* tooltip 內容 */
.tooltip-text {
    position: absolute;
    bottom: 140%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;

    background: #5f5f5f;
    color: #fff;
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 4px;

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;

    z-index: 999;
}

/* 小箭頭 */
.tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #5f5f5f transparent transparent transparent;
}

/* hover 顯示 */
.info-tooltip:hover .tooltip-text {
    opacity: 1;
}
/* ======表格結束 */
.inflow-setting-block {
    margin-top: 28px;
}

.inflow-options {
    display: flex;
    flex-wrap: wrap;
    gap: 18px 24px;
    margin-top: 8px;
}

.inflow-option {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 90px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
}

.inflow-option input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #f59a23;
    cursor: pointer;
}

.water-setting-table input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

@media (max-width: 1200px) {
    .safe-storage-row {
        flex-direction: column;
        align-items: flex-start;
    }

    .inflow-options {
        gap: 14px 18px;
    }
}
/* 入流量設定的按鈕 */
/* 外框 */
.inflow-select-group {
    background: #eef1f4;
    border-radius: 12px;
    padding: 18px 20px;
}

/* 每一列 */
.inflow-row {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    gap: 12px;
}

/* label */
.inflow-label {
    min-width: 110px;
    font-size: 16px;
    color: #333;
}

/* 按鈕群 */
.inflow-btn-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

/* 按鈕 */
.inflow-btn {
    min-width: 100px;
    height: 44px;
    border-radius: 8px;
    border: 2px solid #5aa3c5;
    background: #fff;
    color: #5aa3c5;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

/* hover */
.inflow-btn:hover {
    background: #e6f3f8;
}

/* 選中狀態（重點） */
.inflow-btn.active {
    background: #4f93b5;
    color: #fff;
    border-color: #4f93b5;
}

/* 大按鈕 */
.inflow-btn.large {
    flex: 1;
    height: 48px;
    font-size: 18px;
}

/* 歷史同期表格 */
.history-modal-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20px;
    z-index: 9999;
}

.history-modal {
    width: 600px;
    max-width: calc(100vw - 32px);
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.history-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border-bottom: 1px solid #dddddd;
}

.history-modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: #555;
}

.history-modal-close {
    border: none;
    background: transparent;
    font-size: 34px;
    line-height: 1;
    color: #888;
    cursor: pointer;
}

.history-modal-body {
    padding: 14px 16px 8px;
}

.history-table-wrap {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #d8d8d8;
}

.history-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.history-table th,
.history-table td {
    border: 1px solid #d8d8d8;
    padding: 10px 8px;
    text-align: center;
    font-size: 16px;
    color: #444;
    background: #fff;
}

.history-table thead th {
    background: #6b6b6b;
    color: #fff;
    font-weight: 700;
}

.history-table .radio-col {
    width: 36px;
}

.history-table tbody tr.active td {
    background: #f3f3f3;
}

.history-table input[type="radio"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #3ca66b;
}

.history-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px;
}

.modal-btn {
    min-width: 56px;
    height: 36px;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
}

.modal-btn-confirm {
    background: #35a86b;
}

.modal-btn-cancel {
    background: #7b7b88;
}

.loading-text,
.no-data {
    text-align: center;
    padding: 24px 12px;
    color: #666;
    font-size: 14px;
}
.sortable {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}
.is-disabled {
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}
.history-btn.is-disabled {
    border-color: #ccc;
    color: #999;
    background-color: #f5f5f5;
}
.next-btn.is-disabled {
    background-color: #ddd;
    border-color: #ddd;
    color: #888;
}
.history-btn.is-disabled:hover,
.next-btn.is-disabled:hover {
    background-color: inherit;
    border-color: inherit;
    color: inherit;
}

.spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    margin-right: 6px;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.scenario-section-wrapper {
    position: relative;
}

.section-loading-mask {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.7);
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
}

.loading-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ccc;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

.table-input:disabled {
    background-color: #f0f0f0;
    color: #aaa;
    border: 1px solid #ddd;
    cursor: not-allowed;
}

/* 避免 focus 還有藍框 */
.table-input:disabled:focus {
    outline: none;
    box-shadow: none;
}

.row-disabled {
    opacity: 0.6;
}
.date-disabled {
    opacity: 0.6;
    pointer-events: none; /* 🔥 關鍵：完全不能點 */
}
</style>
