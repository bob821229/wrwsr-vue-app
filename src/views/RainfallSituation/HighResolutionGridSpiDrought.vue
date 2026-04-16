<template>
  <Header />

  <div class="simulation-outer">
    <div class="simulation-layout">
      <PageHeader>
        <template #title>高解析格點SPI乾旱指標模組</template>
        <template #subtitle>
          降雨情勢 / 乾旱監測 / 高解析格點SPI乾旱指標模組
        </template>
        <template #update-time></template>
      </PageHeader>

      <div class="content-row">
        <div class="left-panel">
          <div class="left-card">
            <div class="left-body">
              <div class="inner-form-box">
                <div class="form-row form-row-date">
                  <label class="form-label">日期</label>
                  <div class="date-select-group">
                    <select v-model="queryForm.rocYear" class="custom-select date-select">
                      <option v-for="year in rocYearOptions" :key="year" :value="year">
                        {{ year }}
                      </option>
                    </select>
                    <span class="date-unit">年</span>

                    <select v-model="queryForm.month" class="custom-select date-select">
                      <option v-for="month in monthOptions" :key="month.value" :value="month.value">
                        {{ month.label }}
                      </option>
                    </select>
                    <span class="date-unit">月</span>
                  </div>
                </div>

                <div class="form-row">
                  <label class="form-label">統計分類</label>
                  <select v-model="queryForm.statisticsCategory" class="custom-select">
                    <option v-for="item in statisticsCategoryOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </option>
                  </select>
                </div>

                <template v-if="queryForm.statisticsCategory === '行政區域'">
                  <div class="form-row">
                    <label class="form-label">縣市</label>
                    <select v-model="queryForm.cityName" class="custom-select">
                      <option value="">全部</option>
                      <option v-for="item in cityOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-row">
                    <label class="form-label">鄉鎮市區</label>
                    <select
                      v-model="queryForm.townName"
                      class="custom-select"
                      :disabled="!townOptions.length"
                    >
                      <option value="">全部</option>
                      <option v-for="item in townOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                </template>

                <template v-else-if="queryForm.statisticsCategory === '事業區域'">
                  <div class="form-row">
                    <label class="form-label">管理處</label>
                    <select v-model="queryForm.managementOfficeName" class="custom-select">
                      <option value="">全部</option>
                      <option v-for="item in managementOfficeOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-row">
                    <label class="form-label">分處</label>
                    <select
                      v-model="queryForm.branchOfficeName"
                      class="custom-select"
                      :disabled="!branchOfficeOptions.length"
                    >
                      <option value="">全部</option>
                      <option v-for="item in branchOfficeOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-row">
                    <label class="form-label">工作站</label>
                    <select
                      v-model="queryForm.workStationName"
                      class="custom-select"
                      :disabled="!workStationOptions.length"
                    >
                      <option value="">全部</option>
                      <option v-for="item in workStationOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-row">
                    <label class="form-label">水利小組</label>
                    <select
                      v-model="queryForm.irrigationGroupName"
                      class="custom-select"
                      :disabled="!irrigationGroupOptions.length"
                    >
                      <option value="">全部</option>
                      <option v-for="item in irrigationGroupOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                </template>

                <template v-else-if="queryForm.statisticsCategory === '水庫集水區'">
                  <div class="form-row">
                    <label class="form-label">集水區</label>
                    <select v-model="queryForm.watershedName" class="custom-select">
                      <option value="">全部</option>
                      <option v-for="item in watershedOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                </template>

                <template v-else-if="queryForm.statisticsCategory === '水庫灌區'">
                  <div class="form-row">
                    <label class="form-label">灌區</label>
                    <select v-model="queryForm.irrigationDistrictName" class="custom-select">
                      <option value="">全部</option>
                      <option v-for="item in irrigationDistrictOptions" :key="item.code" :value="item.name">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                </template>

                <div class="form-row">
                  <label class="form-label">選擇 SPI</label>
                  <select v-model="queryForm.spiType" class="custom-select">
                    <option v-for="item in spiOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </option>
                  </select>
                </div>

                <div class="form-row form-row-note">
                  <label class="form-label">備註</label>
                  <div class="remark-text">
                    SPI1、3、6、12 分別為 1、3、6、12 個月之 SPI 數值
                  </div>
                </div>
              </div>

              <div class="left-actions">
                <button
                  type="button"
                  class="action-btn action-btn-primary"
                  :disabled="isLoading"
                  @click="handleSearch"
                >
                  {{ isLoading ? '查詢中...' : '查詢' }}
                </button>

                
              </div>
            </div>
          </div>
        </div>

        <div class="right-panel">
          <div class="right-card">
            <div class="result-layout">
              <div class="map-panel">
                <!-- <div class="panel-title">{{ queryForm.spiType }}</div> -->
                <div class="map-placeholder">
                  <div class="placeholder-title">GIS 圖資區塊</div>
                  <div class="placeholder-desc">
                    查詢後將依 API 回傳結果更新地圖圖層 / raster / legend
                  </div>

                  <pre class="payload-preview">{{ requestPayloadPreview }}</pre>
                </div>
              </div>

              <div class="table-panel">
                <div class="result-note">
                  依查詢條件顯示各乾旱等級統計結果
                </div>

                <div class="table-wrapper">
                  <table class="result-table">
                    <thead>
                      <tr>
                        <th>{{ tableFirstColumnLabel }}</th>
                        <th>正常<br />SPI大於-0.5</th>
                        <th>輕度乾旱<br />SPI介於-0.5 ~ -1.0</th>
                        <th>中度乾旱<br />SPI介於-1.0 ~ -1.5</th>
                        <th>重度乾旱<br />SPI介於-1.5 ~ -2.0</th>
                        <th>極度乾旱<br />SPI小於-2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="!tableRows.length">
                        <td colspan="6" class="empty-cell">尚無資料，請先查詢</td>
                      </tr>

                      <tr v-for="row in tableRows" :key="row.name">
                        <td>{{ row.name }}</td>
                        <td>{{ row.normal }}</td>
                        <td>{{ row.mild }}</td>
                        <td>{{ row.moderate }}</td>
                        <td>{{ row.severe }}</td>
                        <td>{{ row.extreme }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import Header from '@/components/general/header.vue';
import PageHeader from '@/components/PageHeader.vue';

/**
 * 這裡請改成你實際放置 JSON 的路徑
 * 例如：@/assets/json/statistics-options.json
 */
import { getRawStatisticOptions } from '@/apis/modules/RainfallSituation/HighResolutionGridSpiDrought';

// 改為由 API 取得
const rawStatisticOptions = ref([]);

// 若你 API 已經完成，請打開這行並移除下方 mock function
// import { getHighResolutionGridSpiDrought } from '@/apis/modules/RainfallSituation/HighResolutionGridSpiDrought';

const now = dayjs();
const currentRocYear = now.year() - 1911;

const spiOptions = [
  { label: 'SPI1', value: 'SPI1' },
  { label: 'SPI3', value: 'SPI3' },
  { label: 'SPI6', value: 'SPI6' },
  { label: 'SPI12', value: 'SPI12' },
];

const statisticsCategoryOptions = [
  { label: '行政區域', value: '行政區域' },
  { label: '事業區域', value: '事業區域' },
  { label: '水庫集水區', value: '水庫集水區' },
  { label: '水庫灌區', value: '水庫灌區' },
];

const rocYearOptions = Array.from({ length: 10 }, (_, index) => currentRocYear - index);
const monthOptions = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1).padStart(2, '0');
  return {
    label: value,
    value,
  };
});

const queryForm = reactive({
  rocYear: currentRocYear,
  month: now.format('MM'),
  statisticsCategory: '行政區域',
  spiType: 'SPI1',
  cityName: '',
  townName: '',
  managementOfficeName: '',
  branchOfficeName: '',
  workStationName: '',
  irrigationGroupName: '',
  watershedName: '',
  irrigationDistrictName: '',
});

const isLoading = ref(false);
const tableRows = ref([]);

const normalizeOptions = (list) => {
  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    category: item.category,
    subCategory: item.subCategory,
    code: item.code,
    name: item.name,
  }));
};

const allOptions = computed(() => {
  return normalizeOptions(rawStatisticOptions.value);
});

const getUniqueOptions = (list) => {
  const map = new Map();

  list.forEach((item) => {
    const key = `${item.category}-${item.subCategory}-${item.name}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values());
};

const cityOptions = computed(() => {
  return getUniqueOptions(
    allOptions.value.filter(
      (item) => item.category === '行政區域' && item.subCategory === '縣市',
    ),
  );
});

const allTownOptions = computed(() => {
  return getUniqueOptions(
    allOptions.value.filter(
      (item) => item.category === '行政區域' && item.subCategory === '鄉鎮市區',
    ),
  );
});

const townOptions = computed(() => {
  if (!queryForm.cityName) return [];

  const selectedCity = cityOptions.value.find((item) => item.name === queryForm.cityName);
  if (!selectedCity) return [];

  return getUniqueOptions(
    allTownOptions.value.filter((item) => item.code.startsWith(selectedCity.code)),
  );
});

const managementOfficeOptions = computed(() => {
  return getUniqueOptions(
    allOptions.value.filter(
      (item) => item.category === '事業區域' && item.subCategory === '管理處',
    ),
  );
});

const allBranchOfficeOptions = computed(() => {
  return getUniqueOptions(
    allOptions.value.filter(
      (item) => item.category === '事業區域' && item.subCategory === '分處',
    ),
  );
});

const branchOfficeOptions = computed(() => {
  if (!queryForm.managementOfficeName) return [];

  const selectedManagementOffice = managementOfficeOptions.value.find(
    (item) => item.name === queryForm.managementOfficeName,
  );
  if (!selectedManagementOffice) return [];

  return getUniqueOptions(
    allBranchOfficeOptions.value.filter((item) =>
      item.code.startsWith(selectedManagementOffice.code),
    ),
  );
});

const allWorkStationOptions = computed(() => {
  return getUniqueOptions(
    allOptions.value.filter(
      (item) => item.category === '事業區域' && item.subCategory === '工作站',
    ),
  );
});

const workStationOptions = computed(() => {
  if (queryForm.branchOfficeName) {
    const selectedBranchOffice = branchOfficeOptions.value.find(
      (item) => item.name === queryForm.branchOfficeName,
    );

    if (!selectedBranchOffice) return [];

    return getUniqueOptions(
      allWorkStationOptions.value.filter((item) =>
        item.code.startsWith(selectedBranchOffice.code),
      ),
    );
  }

  if (queryForm.managementOfficeName) {
    const selectedManagementOffice = managementOfficeOptions.value.find(
      (item) => item.name === queryForm.managementOfficeName,
    );

    if (!selectedManagementOffice) return [];

    return getUniqueOptions(
      allWorkStationOptions.value.filter((item) =>
        item.code.startsWith(selectedManagementOffice.code),
      ),
    );
  }

  return [];
});

const allIrrigationGroupOptions = computed(() => {
  return getUniqueOptions(
    allOptions.value.filter(
      (item) => item.category === '事業區域' && item.subCategory === '水利小組',
    ),
  );
});

const irrigationGroupOptions = computed(() => {
  if (!queryForm.workStationName) return [];

  const selectedWorkStation = workStationOptions.value.find(
    (item) => item.name === queryForm.workStationName,
  );
  if (!selectedWorkStation) return [];

  return getUniqueOptions(
    allIrrigationGroupOptions.value.filter((item) =>
      item.code.startsWith(selectedWorkStation.code),
    ),
  );
});

const watershedOptions = computed(() => {
  return getUniqueOptions(allOptions.value.filter((item) => item.category === '水庫集水區'));
});

const irrigationDistrictOptions = computed(() => {
  return getUniqueOptions(allOptions.value.filter((item) => item.category === '水庫灌區'));
});

watch(
  () => queryForm.statisticsCategory,
  () => {
    queryForm.cityName = '';
    queryForm.townName = '';
    queryForm.managementOfficeName = '';
    queryForm.branchOfficeName = '';
    queryForm.workStationName = '';
    queryForm.irrigationGroupName = '';
    queryForm.watershedName = '';
    queryForm.irrigationDistrictName = '';
  },
);

watch(
  () => queryForm.cityName,
  () => {
    queryForm.townName = '';
  },
);

watch(
  () => queryForm.managementOfficeName,
  () => {
    queryForm.branchOfficeName = '';
    queryForm.workStationName = '';
    queryForm.irrigationGroupName = '';
  },
);

watch(
  () => queryForm.branchOfficeName,
  () => {
    queryForm.workStationName = '';
    queryForm.irrigationGroupName = '';
  },
);

watch(
  () => queryForm.workStationName,
  () => {
    queryForm.irrigationGroupName = '';
  },
);

const requestPayload = computed(() => {
  const adYear = Number(queryForm.rocYear) + 1911;

  return {
    year: adYear,
    month: queryForm.month,
    spiType: queryForm.spiType,
    statisticsCategory: queryForm.statisticsCategory,
    cityName: queryForm.cityName || null,
    townName: queryForm.townName || null,
    managementOfficeName: queryForm.managementOfficeName || null,
    branchOfficeName: queryForm.branchOfficeName || null,
    workStationName: queryForm.workStationName || null,
    irrigationGroupName: queryForm.irrigationGroupName || null,
    watershedName: queryForm.watershedName || null,
    irrigationDistrictName: queryForm.irrigationDistrictName || null,
  };
});

const requestPayloadPreview = computed(() => {
  return JSON.stringify(requestPayload.value, null, 2);
});

const tableFirstColumnLabel = computed(() => {
  const map = {
    行政區域: '行政區域',
    事業區域: '事業區域',
    水庫集水區: '水庫集水區',
    水庫灌區: '水庫灌區',
  };

  return map[queryForm.statisticsCategory] || '分類';
});

const handleReset = () => {
  queryForm.rocYear = currentRocYear;
  queryForm.month = now.format('MM');
  queryForm.statisticsCategory = '行政區域';
  queryForm.spiType = 'SPI1';
  queryForm.cityName = '';
  queryForm.townName = '';
  queryForm.managementOfficeName = '';
  queryForm.branchOfficeName = '';
  queryForm.workStationName = '';
  queryForm.irrigationGroupName = '';
  queryForm.watershedName = '';
  queryForm.irrigationDistrictName = '';
  tableRows.value = [];
};

// 初始化時先取得統計分類資料
const initStatisticOptions = async () => {
  try {
    const response = await getRawStatisticOptions();
    const options = response?.data?.data || response?.data || response || [];
    rawStatisticOptions.value = Array.isArray(options) ? options : [];
  } catch (error) {
    console.error('取得統計分類資料失敗：', error);
    rawStatisticOptions.value = [];
  }
};

initStatisticOptions();

const handleSearch = async () => {
  isLoading.value = true;

  try {
    const payload = requestPayload.value;

    // ====== 這裡換成你真正的 API ======
    // const { data } = await getHighResolutionGridSpiDrought(payload);
    // tableRows.value = data.tableRows;
    // mapData.value = data.mapData;

    const data = await mockGetHighResolutionGridSpiDrought(payload);
    tableRows.value = data.tableRows;
  } catch (error) {
    console.error('高解析格點 SPI 乾旱指標查詢失敗：', error);
    tableRows.value = [];
  } finally {
    isLoading.value = false;
  }
};

const mockGetHighResolutionGridSpiDrought = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const sourceOptionsMap = {
    行政區域: cityOptions.value,
    事業區域: managementOfficeOptions.value,
    水庫集水區: watershedOptions.value,
    水庫灌區: irrigationDistrictOptions.value,
  };

  const rows = (sourceOptionsMap[payload.statisticsCategory] || []).slice(0, 8).map((item, index) => ({
    name: item.name,
    normal: 20 + index,
    mild: 15 + index,
    moderate: 8 + index,
    severe: index,
    extreme: index % 2,
  }));

  return { tableRows: rows };
};
</script>

<style scoped>
.simulation-outer {
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  width: 100%;
}

.simulation-layout {
  width: 100%;
  background: #efefef;
  padding: 12px 20px 24px;
  border-radius: 10px;
  font-family: Arial, 'Microsoft JhengHei', sans-serif;
}

.content-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.left-panel {
  flex: 0 0 300px;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

.left-card,
.right-card {
  background: #f6f6f6;
  border-radius: 4px;
  min-height: 480px;
}

.left-body {
  padding: 12px 14px 20px;
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
  gap: 12px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-row-note {
  align-items: flex-start;
}

.form-label {
  width: 88px;
  flex-shrink: 0;
  font-size: 16px;
  color: #222;
}

.custom-select {
  width: 100%;
  height: 44px;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
  background: #fff;
  padding: 0 12px;
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

.date-select-group {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.date-select {
  width: 92px;
}

.date-unit {
  color: #333;
  white-space: nowrap;
}

.remark-text {
  flex: 1;
  line-height: 1.7;
  color: #555;
  font-size: 14px;
}

.left-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.action-btn-primary {
  background: #0f80bb;
  color: #fff;
}



.right-card {
  padding: 16px;
}

.result-layout {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}

.map-panel {
  width: 800px;
  flex-shrink: 0;
}

.panel-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 12px;
}

.map-placeholder {
  min-height: 560px;
  border: 1px solid #d8d8d8;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.placeholder-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.placeholder-desc {
  color: #666;
  margin-bottom: 20px;
}

.payload-preview {
  width: 100%;
  padding: 12px;
  background: #f1f3f5;
  border-radius: 6px;
  font-size: 13px;
  overflow: auto;
}

.table-panel {
  flex: 1;
  min-width: 0;
}

.result-note {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
}

.result-table th,
.result-table td {
  border: 1px solid #f1dfd8;
  padding: 10px 8px;
  text-align: center;
  font-size: 14px;
}

.result-table th {
  background: #ea7f2f;
  color: #fff;
  font-weight: 700;
}

.result-table td:first-child {
  background: #ea7f2f;
  color: #fff;
  font-weight: 700;
}

.empty-cell {
  background: #fff !important;
  color: #666 !important;
}

@media (max-width: 1400px) {
  .content-row {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    min-width: 0;
  }

  .result-layout {
    flex-direction: column;
  }

  .map-panel {
    width: 100%;
  }
}
</style>
