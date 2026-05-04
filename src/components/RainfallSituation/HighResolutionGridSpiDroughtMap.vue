<template>
  <div class="spi-map-shell">
    <div ref="mapContainer" class="spi-map"></div>

    <div v-if="statusText" class="map-status">
      {{ statusText }}
    </div>

    <div class="map-legend">
      <div class="legend-title">SPI</div>
      <div v-for="item in legendItems" :key="item.label" class="legend-item">
        <span class="legend-swatch" :style="{ backgroundColor: item.color }"></span>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits(['loading-change', 'stats-computed', 'error']);

const IMAGE_SERVER_URL =
  'https://gis-project.triwra.org.tw/server/rest/services/wrwsr/T1_2droughtindex/ImageServer';
const POLYGON_MAP_SERVER_URL =
  'https://gis-project.triwra.org.tw/server/rest/services/wrwsr/SPI_Stats_Polygon/MapServer';
const ARCGIS_SCRIPT_ID = 'arcgis-js-api-430';
const ARCGIS_CSS_ID = 'arcgis-js-api-430-css';

const spiLevelMap = {
  SPI1: 1,
  SPI3: 3,
  SPI6: 4,
  SPI12: 6,
};

const categoryConfig = {
  行政區域: {
    layerId: 1,
    outFields: ['COUNTYID', 'COUNTYNAME', 'TOWNID', 'TOWNNAME'],
    buildWhere(payload) {
      if (payload.townCode) return sqlEqual('TOWNID', payload.townCode);
      if (payload.cityCode) return sqlEqual('COUNTYID', payload.cityCode);
      return '1=1';
    },
    getGroupKey(attributes, payload) {
      if (payload.townCode) return attributes.TOWNID;
      if (payload.cityCode) return attributes.TOWNID;
      return attributes.COUNTYID;
    },
    getGroupName(attributes, payload) {
      if (payload.townCode) return attributes.TOWNNAME;
      if (payload.cityCode) return attributes.TOWNNAME;
      return attributes.COUNTYNAME;
    },
  },
  事業區域: {
    layerId: 2,
    outFields: [
      '管理處編號',
      '管理處名稱',
      '分處編號',
      '分處名稱',
      '工作站編號',
      '工作站名稱',
      '水利小組編號',
      '水利小組名稱',
    ],
    buildWhere(payload) {
      if (payload.irrigationGroupCode) return sqlEqual('水利小組編號', payload.irrigationGroupCode);
      if (payload.workStationCode) return sqlEqual('工作站編號', payload.workStationCode);
      if (payload.branchOfficeCode) return sqlEqual('分處編號', payload.branchOfficeCode);
      if (payload.managementOfficeCode) return sqlEqual('管理處編號', payload.managementOfficeCode);
      return '1=1';
    },
    createGroupResolver(payload, features) {
      const level = resolveBusinessGroupLevel(payload, features);

      return (attributes) => getBusinessGroup(attributes, level);
    },
  },
  水庫集水區: {
    layerId: 3,
    outFields: ['編號', 'Name'],
    buildWhere(payload) {
      if (payload.watershedCode) return sqlEqual('編號', payload.watershedCode);
      return '1=1';
    },
    getGroupKey(attributes) {
      return attributes['編號'];
    },
    getGroupName(attributes) {
      return attributes.Name;
    },
  },
  水庫灌區: {
    layerId: 4,
    outFields: ['水庫灌區'],
    buildWhere(payload) {
      if (payload.irrigationDistrictCode) return sqlEqual('水庫灌區', payload.irrigationDistrictCode);
      return '1=1';
    },
    getGroupKey(attributes) {
      return attributes['水庫灌區'];
    },
    getGroupName(attributes) {
      return attributes['水庫灌區'];
    },
  },
};

const legendItems = [
  { label: '<= -2.0', color: '#053061' },
  { label: '-2.0 ~ -1.5', color: '#256baf' },
  { label: '-1.5 ~ -1.0', color: '#559ec9' },
  { label: '-1.0 ~ -0.5', color: '#a7d0e4' },
  { label: '> -0.5', color: '#f7b799' },
];

const mapContainer = ref(null);
const isInitializing = ref(true);
const isSearching = ref(false);
const initError = ref('');

let arcgisModules = null;
let map = null;
let view = null;
let droughtLayer = null;
let activeBoundaryLayer = null;
let activeBoundaryCategory = '';
let latestSearchId = 0;

const statusText = computed(() => {
  if (initError.value) return initError.value;
  if (isInitializing.value) return '地圖載入中...';
  if (isSearching.value) return 'GIS 統計中...';
  return '';
});

const sqlEqual = (field, value) => {
  return `${field} = '${String(value).replaceAll("'", "''")}'`;
};

const businessGroupFields = {
  managementOffice: {
    code: '管理處編號',
    name: '管理處名稱',
    subCategory: '管理處',
  },
  branchOffice: {
    code: '分處編號',
    name: '分處名稱',
    subCategory: '分處',
  },
  workStation: {
    code: '工作站編號',
    name: '工作站名稱',
    subCategory: '工作站',
  },
  irrigationGroup: {
    code: '水利小組編號',
    name: '水利小組名稱',
    subCategory: '水利小組',
  },
};

const isPlaceholderBusinessLevel = (name, subCategory) => {
  if (!name) return true;
  return String(name).includes(`無${subCategory}`);
};

const hasRealBusinessLevel = (features, level) => {
  const field = businessGroupFields[level];
  if (!field) return false;

  return features.some((feature) => {
    const name = feature.attributes?.[field.name];
    return !isPlaceholderBusinessLevel(name, field.subCategory);
  });
};

const resolveBusinessGroupLevel = (payload, features) => {
  if (payload.irrigationGroupCode) return 'irrigationGroup';
  if (payload.workStationCode) {
    return hasRealBusinessLevel(features, 'irrigationGroup')
      ? 'irrigationGroup'
      : 'workStation';
  }
  if (payload.branchOfficeCode) {
    if (hasRealBusinessLevel(features, 'workStation')) return 'workStation';
    if (hasRealBusinessLevel(features, 'irrigationGroup')) return 'irrigationGroup';
    return 'branchOffice';
  }
  if (payload.managementOfficeCode) {
    if (hasRealBusinessLevel(features, 'branchOffice')) return 'branchOffice';
    if (hasRealBusinessLevel(features, 'workStation')) return 'workStation';
    if (hasRealBusinessLevel(features, 'irrigationGroup')) return 'irrigationGroup';
    return 'managementOffice';
  }

  return 'managementOffice';
};

const getBusinessGroup = (attributes, level) => {
  const field = businessGroupFields[level] || businessGroupFields.managementOffice;
  return {
    key: attributes[field.code],
    name: attributes[field.name],
  };
};

const loadArcGis = () => {
  if (window.require) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    if (!document.getElementById(ARCGIS_CSS_ID)) {
      const link = document.createElement('link');
      link.id = ARCGIS_CSS_ID;
      link.rel = 'stylesheet';
      link.href = 'https://js.arcgis.com/4.30/esri/themes/light/main.css';
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById(ARCGIS_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = ARCGIS_SCRIPT_ID;
    script.src = 'https://js.arcgis.com/4.30/';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const requireArcGisModules = () => {
  if (arcgisModules) return Promise.resolve(arcgisModules);

  return new Promise((resolve, reject) => {
    window.require(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/ImageryLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/support/MosaicRule',
        'esri/rest/imageService',
        'esri/rest/support/ImageHistogramParameters',
        'esri/Graphic',
      ],
      (
        Map,
        MapView,
        ImageryLayer,
        FeatureLayer,
        MosaicRule,
        imageService,
        ImageHistogramParameters,
        Graphic,
      ) => {
        arcgisModules = {
          Map,
          MapView,
          ImageryLayer,
          FeatureLayer,
          MosaicRule,
          imageService,
          ImageHistogramParameters,
          Graphic,
        };
        resolve(arcgisModules);
      },
      reject,
    );
  });
};

const createDroughtRenderer = () => ({
  type: 'class-breaks',
  classBreakInfos: [
    { minValue: -9999, maxValue: -2.0, symbol: { type: 'simple-fill', color: '#053061', outline: null }, label: '<= -2.0' },
    { minValue: -2.0, maxValue: -1.5, symbol: { type: 'simple-fill', color: '#256baf', outline: null }, label: '-2.0 ~ -1.5' },
    { minValue: -1.5, maxValue: -1.0, symbol: { type: 'simple-fill', color: '#559ec9', outline: null }, label: '-1.5 ~ -1.0' },
    { minValue: -1.0, maxValue: -0.5, symbol: { type: 'simple-fill', color: '#a7d0e4', outline: null }, label: '-1.0 ~ -0.5' },
    { minValue: -0.5, maxValue: 0.0, symbol: { type: 'simple-fill', color: '#e2edf3', outline: null }, label: '-0.5 ~ 0.0' },
    { minValue: 0.0, maxValue: 0.5, symbol: { type: 'simple-fill', color: '#fae7dc', outline: null }, label: '0.0 ~ 0.5' },
    { minValue: 0.5, maxValue: 1.0, symbol: { type: 'simple-fill', color: '#f7b799', outline: null }, label: '0.5 ~ 1.0' },
    { minValue: 1.0, maxValue: 1.5, symbol: { type: 'simple-fill', color: '#dd6f59', outline: null }, label: '1.0 ~ 1.5' },
    { minValue: 1.5, maxValue: 2.0, symbol: { type: 'simple-fill', color: '#b6202f', outline: null }, label: '1.5 ~ 2.0' },
    { minValue: 2.0, maxValue: 9999, symbol: { type: 'simple-fill', color: '#67001f', outline: null }, label: '> 2.0' },
  ],
});

const formatSqlDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day} 00:00:00`;
};

const buildMosaicRule = (payload) => {
  const { MosaicRule } = arcgisModules;
  const level = spiLevelMap[payload.spiType] || 1;
  const monthIndex = Number(payload.month) - 1;
  const startDate = new Date(Number(payload.year), monthIndex, 1);
  const endDate = new Date(Number(payload.year), monthIndex + 1, 1);
  const where = [
    `lev = ${level}`,
    `StdTime >= timestamp '${formatSqlDate(startDate)}'`,
    `StdTime < timestamp '${formatSqlDate(endDate)}'`,
  ].join(' AND ');

  return new MosaicRule({
    method: 'attribute',
    where,
  });
};

const createBoundaryLayer = (config) => {
  const { FeatureLayer } = arcgisModules;

  return new FeatureLayer({
    url: `${POLYGON_MAP_SERVER_URL}/${config.layerId}`,
    outFields: config.outFields,
    opacity: 0,
    legendEnabled: false,
  });
};

const ensureBoundaryLayer = (category) => {
  const config = categoryConfig[category];
  if (!config) return null;

  if (activeBoundaryLayer && activeBoundaryCategory === category) {
    return activeBoundaryLayer;
  }

  if (activeBoundaryLayer) {
    map.remove(activeBoundaryLayer);
  }

  activeBoundaryLayer = createBoundaryLayer(config);
  activeBoundaryCategory = category;
  map.add(activeBoundaryLayer);
  return activeBoundaryLayer;
};

const initializeMap = async () => {
  try {
    await loadArcGis();
    const {
      Map,
      MapView,
      ImageryLayer,
      MosaicRule,
    } = await requireArcGisModules();

    droughtLayer = new ImageryLayer({
      url: IMAGE_SERVER_URL,
      renderer: createDroughtRenderer(),
      title: 'TaiSA Drought Index',
      opacity: 0.8,
      format: 'lerc',
      mosaicRule: new MosaicRule({ method: 'attribute', where: 'lev = 1' }),
    });

    map = new Map({
      basemap: 'gray-vector',
      layers: [droughtLayer],
    });

    view = new MapView({
      container: mapContainer.value,
      map,
      center: [120.982, 23.973],
      zoom: 7,
    });

    await view.when();
  } catch (error) {
    console.error('ArcGIS 地圖初始化失敗：', error);
    initError.value = '地圖載入失敗';
    emit('error', error);
  } finally {
    isInitializing.value = false;
  }
};

const createEmptyCounts = () => ({
  normal: 0,
  mild: 0,
  moderate: 0,
  severe: 0,
  extreme: 0,
});

const getFeatureStats = async (feature, mosaicRule) => {
  const { ImageHistogramParameters, imageService } = arcgisModules;
  const params = new ImageHistogramParameters({
    geometry: feature.geometry,
    mosaicRule,
  });
  const counts = createEmptyCounts();

  try {
    const response = await imageService.computeHistograms(IMAGE_SERVER_URL, params);
    const hist = response?.histograms?.[0];
    if (!hist?.counts?.length) {
      return {
        counts,
        hasData: false,
      };
    }

    const binWidth = (hist.max - hist.min) / hist.counts.length;
    let hasData = false;

    hist.counts.forEach((count, index) => {
      const value = hist.min + (index + 0.5) * binWidth;
      if (!count || value < -100) return;

      hasData = true;

      if (value <= -2.0) counts.extreme += count;
      else if (value <= -1.5) counts.severe += count;
      else if (value <= -1.0) counts.moderate += count;
      else if (value <= -0.5) counts.mild += count;
      else counts.normal += count;
    });

    return {
      counts,
      hasData,
    };
  } catch (error) {
    console.warn('SPI histogram 計算失敗：', error);
  }

  return {
    counts,
    hasData: false,
  };
};

const addCounts = (target, source) => {
  target.normal += source.normal;
  target.mild += source.mild;
  target.moderate += source.moderate;
  target.severe += source.severe;
  target.extreme += source.extreme;
};

const renderFeatureHighlight = (features) => {
  const { Graphic } = arcgisModules;
  const symbol = {
    type: 'simple-fill',
    color: [255, 255, 255, 0],
    outline: {
      color: [230, 108, 37, 1],
      width: 2,
    },
  };

  view.graphics.removeAll();
  features.forEach((feature) => {
    view.graphics.add(new Graphic({
      geometry: feature.geometry,
      attributes: feature.attributes,
      symbol,
    }));
  });
};

const runSearch = async (payload) => {
  const searchId = ++latestSearchId;
  const config = categoryConfig[payload.statisticsCategory];
  if (!config) return [];

  if (isInitializing.value) {
    await waitUntilMapReady();
  }

  if (!view || !droughtLayer) {
    throw new Error('地圖尚未初始化完成');
  }

  isSearching.value = true;
  emit('loading-change', true);

  try {
    const boundaryLayer = ensureBoundaryLayer(payload.statisticsCategory);
    const mosaicRule = buildMosaicRule(payload);
    droughtLayer.mosaicRule = mosaicRule;

    const query = boundaryLayer.createQuery();
    query.where = config.buildWhere(payload);
    query.returnGeometry = true;
    query.outFields = config.outFields;

    const result = await boundaryLayer.queryFeatures(query);
    const features = result.features || [];
    if (searchId !== latestSearchId) return [];

    if (!features.length) {
      view.graphics.removeAll();
      emit('stats-computed', []);
      return [];
    }

    renderFeatureHighlight(features);
    await view.goTo(features).catch(() => {});

    const rowsByGroup = new Map();
    const getRowGroup = config.createGroupResolver
      ? config.createGroupResolver(payload, features)
      : (attributes) => ({
        key: config.getGroupKey(attributes, payload),
        name: config.getGroupName(attributes, payload),
      });
    let hasAnyRasterData = false;

    for (const feature of features) {
      if (searchId !== latestSearchId) return [];

      const attributes = feature.attributes || {};
      const { key, name } = getRowGroup(attributes);
      if (!key || !name) continue;

      if (!rowsByGroup.has(key)) {
        rowsByGroup.set(key, {
          name,
          normal: 0,
          mild: 0,
          moderate: 0,
          severe: 0,
          extreme: 0,
        });
      }

      const { counts, hasData } = await getFeatureStats(feature, mosaicRule);
      if (hasData) {
        hasAnyRasterData = true;
      }
      addCounts(rowsByGroup.get(key), counts);
    }

    const rows = hasAnyRasterData ? Array.from(rowsByGroup.values()) : [];
    emit('stats-computed', rows);
    return rows;
  } catch (error) {
    console.error('GIS 查詢與統計失敗：', error);
    emit('error', error);
    emit('stats-computed', []);
    throw error;
  } finally {
    if (searchId === latestSearchId) {
      isSearching.value = false;
      emit('loading-change', false);
    }
  }
};

const waitUntilMapReady = () => {
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      if (!isInitializing.value) {
        window.clearInterval(timer);
        resolve();
      }
    }, 50);
  });
};

onMounted(() => {
  initializeMap();
});

onBeforeUnmount(() => {
  latestSearchId += 1;
  if (view) {
    view.destroy();
  }
  view = null;
  map = null;
  droughtLayer = null;
  activeBoundaryLayer = null;
  activeBoundaryCategory = '';
});

defineExpose({
  runSearch,
});
</script>

<style scoped>
.spi-map-shell {
  position: relative;
  min-height: 560px;
  width: 100%;
  border: 1px solid #d8d8d8;
  background: #eef1f3;
  overflow: hidden;
}

.spi-map {
  height: 560px;
  width: 100%;
}

.map-status {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
  color: #333;
  font-size: 16px;
  font-weight: 700;
}

.map-legend {
  position: absolute;
  right: 12px;
  bottom: 18px;
  z-index: 1;
  width: 132px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.14);
  font-size: 12px;
  color: #222;
}

.legend-title {
  margin-bottom: 6px;
  font-weight: 700;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.5;
}

.legend-swatch {
  width: 18px;
  height: 10px;
  flex: 0 0 18px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
