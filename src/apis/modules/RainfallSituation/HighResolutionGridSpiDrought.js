const GIS_STATISTIC_POLYGON_URL =
  'https://gis-project.triwra.org.tw/server/rest/services/wrwsr/SPI_Stats_Polygon/MapServer';

const GIS_CATEGORY_CONFIG = {
  行政區域: {
    layerId: 1,
    outFields: ['COUNTYID', 'COUNTYNAME', 'TOWNID', 'TOWNNAME'],
    normalize(features) {
      return features.flatMap(({ attributes }) => [
        {
          category: '行政區域',
          subCategory: '縣市',
          code: attributes.COUNTYID,
          name: attributes.COUNTYNAME,
          parentCode: null,
        },
        {
          category: '行政區域',
          subCategory: '鄉鎮市區',
          code: attributes.TOWNID,
          name: attributes.TOWNNAME,
          parentCode: attributes.COUNTYID,
        },
      ]);
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
    normalize(features) {
      return features.flatMap(({ attributes }) => [
        {
          category: '事業區域',
          subCategory: '管理處',
          code: attributes['管理處編號'],
          name: attributes['管理處名稱'],
          parentCode: null,
        },
        {
          category: '事業區域',
          subCategory: '分處',
          code: attributes['分處編號'],
          name: attributes['分處名稱'],
          parentCode: attributes['管理處編號'],
        },
        {
          category: '事業區域',
          subCategory: '工作站',
          code: attributes['工作站編號'],
          name: attributes['工作站名稱'],
          parentCode: attributes['分處編號'],
        },
        {
          category: '事業區域',
          subCategory: '水利小組',
          code: attributes['水利小組編號'],
          name: attributes['水利小組名稱'],
          parentCode: attributes['工作站編號'],
        },
      ]);
    },
  },
  水庫集水區: {
    layerId: 3,
    outFields: ['編號', 'Name'],
    normalize(features) {
      return features.map(({ attributes }) => ({
        category: '水庫集水區',
        subCategory: '水庫集水區',
        code: attributes['編號'],
        name: attributes.Name,
        parentCode: null,
      }));
    },
  },
  水庫灌區: {
    layerId: 4,
    outFields: ['水庫灌區'],
    normalize(features) {
      return features.map(({ attributes }) => ({
        category: '水庫灌區',
        subCategory: '水庫灌區',
        code: attributes['水庫灌區'],
        name: attributes['水庫灌區'],
        parentCode: null,
      }));
    },
  },
};

const uniqueOptions = (options) => {
  const map = new Map();

  options.forEach((item) => {
    if (!item?.code || !item?.name) return;

    const key = [
      item.category,
      item.subCategory,
      item.parentCode || '',
      item.code,
      item.name,
    ].join('|');

    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    return String(a.name).localeCompare(String(b.name), 'zh-Hant');
  });
};

const queryLayerFeatures = async ({ layerId, outFields }) => {
  const pageSize = 2000;
  const features = [];
  let resultOffset = 0;

  while (true) {
    const params = new URLSearchParams({
      f: 'json',
      where: '1=1',
      outFields: outFields.join(','),
      returnGeometry: 'false',
      resultOffset: String(resultOffset),
      resultRecordCount: String(pageSize),
    });

    const response = await fetch(
      `${GIS_STATISTIC_POLYGON_URL}/${layerId}/query?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`GIS 圖資查詢失敗 (${response.status})`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'GIS 圖資查詢失敗');
    }

    const pageFeatures = Array.isArray(data.features) ? data.features : [];
    features.push(...pageFeatures);

    if (!data.exceededTransferLimit && pageFeatures.length < pageSize) {
      break;
    }

    if (!pageFeatures.length) {
      break;
    }

    resultOffset += pageFeatures.length;
  }

  return features;
};

export const getGisStatisticOptionsByCategory = async (category) => {
  const config = GIS_CATEGORY_CONFIG[category];

  if (!config) {
    return [];
  }

  const features = await queryLayerFeatures(config);
  return uniqueOptions(config.normalize(features));
};
