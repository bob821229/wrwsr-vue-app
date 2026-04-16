<template>
    <div class="reservoir-chart-panel">
        <div v-if="loading" class="chart-state chart-loading">
            <div class="spinner"></div>
            <span>圖表資料載入中...</span>
        </div>

        <div v-else-if="!hasData" class="chart-state chart-empty">
            尚無模擬結果，請先設定參數並開始模擬
        </div>

        <VChart v-else class="chart" :option="chartOption" autoresize />
    </div>
</template>

<script setup>
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    ToolboxComponent,
    DataZoomComponent,
    MarkAreaComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";

use([
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    ToolboxComponent,
    DataZoomComponent,
    MarkAreaComponent,
    LineChart,
]);

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    chartData: {
        type: Object,
        default: () => ({
            xAxis: [],
            actualSeries: [],
            simulationSeries: [],
            warningStorage: 0,
        }),
    },
    title: {
        type: String,
        default: "蓄水量模擬歷線圖",
    },
    height: {
        type: String,
        default: "520px",
    },
});

const hasData = computed(() => {
    const hasXAxis =
        Array.isArray(props.chartData?.xAxis) &&
        props.chartData.xAxis.length > 0;

    const hasActual =
        Array.isArray(props.chartData?.actualSeries) &&
        props.chartData.actualSeries.some(
            (item) => item !== null && item !== undefined,
        );

    const hasSimulation =
        Array.isArray(props.chartData?.simulationSeries) &&
        props.chartData.simulationSeries.some(
            (series) =>
                Array.isArray(series?.data) &&
                series.data.some((item) => item !== null && item !== undefined),
        );

    return hasXAxis && (hasActual || hasSimulation);
});

const chartOption = computed(() => {
    const series = [];
    const xAxis = props.chartData?.xAxis ?? [];
    const actualSeries = props.chartData?.actualSeries ?? [];
    const simulationSeries = props.chartData?.simulationSeries ?? [];
    const warningStorage = Number(props.chartData?.warningStorage ?? 0);

    // 實際蓄水量
    if (Array.isArray(actualSeries) && actualSeries.length > 0) {
        series.push({
            name: "實際蓄水量",
            type: "line",
            data: actualSeries,
            symbol: "none",
            smooth: false,
            connectNulls: false,
            color: "#000000",
            lineStyle: {
                width: 4,
                color: "#000000",
            },
            emphasis: {
                focus: "series",
            },
            z: 3,
            markArea: {
                silent: true,
                itemStyle: {
                    color: "rgba(234, 120, 120, 0.65)",
                },
                data:
                    warningStorage > 0
                        ? [[{ yAxis: 0 }, { yAxis: warningStorage }]]
                        : [],
            },
        });
    }

    // 模擬方案
    if (Array.isArray(simulationSeries)) {
        simulationSeries.forEach((item, index) => {
            const color = getSeriesColor(index);
            series.push({
                name: item?.name ?? "模擬方案",
                type: "line",
                data: Array.isArray(item?.data) ? item.data : [],
                symbol: "none",
                smooth: false,
                connectNulls: false,
                color: color,
                lineStyle: {
                    width: 3,
                    type: "dashed",
                    color: color,
                },
                itemStyle: {
                    color: color,
                },
                emphasis: {
                    focus: "series",
                },
                z: 2,
            });
        });
    }
    // 安全蓄水線
    if (warningStorage > 0 && Array.isArray(xAxis) && xAxis.length > 0) {
    series.push({
        name: "安全蓄水線",
        type: "line",
        data: xAxis.map(() => warningStorage),
        symbol: "none",
        smooth: false,
        connectNulls: false,
        color: "#d9534f",
        lineStyle: {
            width: 2,
            type: "solid",
            color: "#d9534f",
        },
        itemStyle: {
            color: "#d9534f",
        },
        emphasis: {
            focus: "series",
        },
        silent: true,
        z: 1,
    });
}

const legendData = series
    .map((item) => item.name)
    .filter((name) => name !== "安全蓄水線");
    return {
        backgroundColor: "#ffffff",
        animation: true,
        title: {
            text: props.title,
            left: "center",
            top: 10,
            textStyle: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
            },
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(50, 50, 50, 0.88)",
            borderWidth: 0,
            textStyle: {
                color: "#fff",
                fontSize: 13,
            },
            axisPointer: {
                type: "line",
            },
            valueFormatter: (value) => {
                if (value === null || value === undefined || value === "") {
                    return "-";
                }
                return Number(value).toLocaleString();
            },
        },
        legend: {
            type: "scroll",
            top: 48,
            left: 80,
            right: 80,
            data: legendData,
            pageIconColor: "#666",
            pageIconInactiveColor: "#ccc",
            pageTextStyle: {
                color: "#666",
            },
            itemWidth: 22,
            itemHeight: 4,
            textStyle: {
                fontSize: 13,
                color: "#333",
            },
        },
        toolbox: {
            right: 18,
            top: 0,
            itemGap: 14,
            feature: {
                restore: {
                    title: "重設",
                },
                saveAsImage: {
                    title: "下載圖片",
                    name: props.title || "simulation-chart",
                    pixelRatio: 2,
                },
            },
            iconStyle: {
                borderColor: "#666",
            },
            emphasis: {
                iconStyle: {
                    borderColor: "#409eff",
                },
            },
        },
        grid: {
            left: 100,
            right: 36,
            top: 130,
            bottom: 100,
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: xAxis,
            axisLine: {
                lineStyle: {
                    color: "#666",
                },
            },
            axisTick: {
                show: true,
            },
            axisLabel: {
                color: "#444",
                fontSize: 12,
            },
        },
        yAxis: {
            type: "value",
            min: 0,
            name: "有效蓄水量(萬噸)",
            nameLocation: "end",
            // nameGap: 80,
            nameTextStyle: {
                color: "#444",
                fontSize: 14,
                padding: [0, 0, 18, 0],
                align: "center",
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#666",
                },
            },
            axisLabel: {
                color: "#444",
                fontSize: 12,
                formatter: (value) => Number(value).toLocaleString(),
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#d8d8d8",
                    type: "solid",
                },
            },
        },
        dataZoom: [
            {
                type: "slider",
                height: 18,
                bottom: 18,
                borderColor: "#cfd6e4",
                fillerColor: "rgba(80, 134, 210, 0.18)",
                backgroundColor: "#eef2f7",
                moveHandleSize: 8,
                showDetail: false,
            },
            {
                type: "inside",
            },
        ],
        series,
    };
});
function getSeriesColor(index) {
    const presetColors = [
        "#43b97f",
        "#2f80ed",
        "#f5a623",
        "#9b51e0",
        "#eb5757",
        "#00b8d9",
        "#ff7f50",
        "#6a5acd",
    ];

    // 前 8 條先用固定色
    if (index < presetColors.length) {
        return presetColors[index];
    }

    // 超過之後用 golden angle 產生分散色
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 65%, 50%)`;
}
</script>

<style scoped>
.reservoir-chart-panel {
    width: 100%;
    min-height: 520px;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    padding: 8px 8px 0;
    box-sizing: border-box;
}

.chart {
    width: 100%;
    height: v-bind(height);
}

.chart-state {
    min-height: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #606266;
    font-size: 14px;
    flex-direction: column;
    gap: 10px;
}

.spinner {
    width: 22px;
    height: 22px;
    border: 3px solid #d9d9d9;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
