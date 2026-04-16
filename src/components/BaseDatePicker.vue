<template>
    <div
        class="base-date-picker"
        :class="{
            'is-focus': isFocus,
            'is-disabled': disabled,
        }"
        :style="{ width: width }"
    >
        <input
            ref="inputRef"
            type="text"
            class="date-input"
            :placeholder="placeholder"
            :disabled="disabled"
            readonly
            @click.stop="handleOpen"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Mandarin } from "flatpickr/dist/l10n/zh.js";
import dayjs from "dayjs";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "請選擇日期",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    displayFormat: {
        type: String,
        default: "ROC-YYYY-MM-DD",
    },
    valueFormat: {
        type: String,
        default: "YYYY-MM-DD",
    },
    minDate: {
        type: String,
        default: "",
    },
    maxDate: {
        type: String,
        default: "",
    },
    width: {
        type: String,
        default: "100%",
    },
    // panelYearMode: {
    //     type: String,
    //     default: "roc", // ad | roc
    // },
});

const emit = defineEmits(["update:modelValue", "change"]);

const inputRef = ref(null);
const flatpickrInstance = ref(null);
const isFocus = ref(false);

function formatDisplay(value) {
    if (!value) return "";

    const date = dayjs(value);
    if (!date.isValid()) return "";

    const format = props.displayFormat || "YYYY-MM-DD";

    // 民國年格式
    if (format.includes("ROC")) {
        const rocYear = String(date.year() - 1911);

        return format
            .replace("ROC-YYYY", rocYear)
            .replace("ROC-YY", rocYear)
            .replace("MM", date.format("MM"))
            .replace("DD", date.format("DD"));
    }

    // 一般 dayjs 格式
    return date.format(format);
}

function toDateObject(value) {
    if (!value) return null;
    const date = dayjs(value);
    if (!date.isValid()) return null;
    return date.toDate();
}

function syncInputDisplay() {
    if (!inputRef.value) return;
    inputRef.value.value = formatDisplay(props.modelValue);
}

function handleOpen() {
    if (props.disabled) return;
    flatpickrInstance.value?.open();
}

function initFlatpickr() {
    if (!inputRef.value) return;

    flatpickrInstance.value = flatpickr(inputRef.value, {
        locale: Mandarin,
        appendTo: document.body,
        defaultDate: toDateObject(props.modelValue),
        minDate: props.minDate || null,
        maxDate: props.maxDate || null,
        allowInput: false,
        clickOpens: false,
        disableMobile: true,
        dateFormat: "Y-m-d",
        prevArrow: "‹",
        nextArrow: "›",
        onReady: () => {
            syncInputDisplay();
            // nextTick(() => {
            //     updateCalendarHeader();
            // });
        },
        onOpen: () => {
            isFocus.value = true;
            // nextTick(() => {
            //     updateCalendarHeader();
            // });
        },
        onClose: () => {
            isFocus.value = false;
            syncInputDisplay();
        },
        onChange: (selectedDates) => {
            if (!selectedDates.length) {
                emit("update:modelValue", "");
                emit("change", "");
                syncInputDisplay();
                return;
            }

            const formattedValue = dayjs(selectedDates[0]).format(
                props.valueFormat,
            );

            emit("update:modelValue", formattedValue);
            emit("change", formattedValue);
            syncInputDisplay();
        },
        onMonthChange: () => {
            // nextTick(() => {
            //     updateCalendarHeader();
            // });
        },
        onYearChange: () => {
            // nextTick(() => {
            //     updateCalendarHeader();
            // });
        },
    });

    syncInputDisplay();
}

onMounted(() => {
    initFlatpickr();
});

watch(
    () => props.modelValue,
    (newValue) => {
        if (!flatpickrInstance.value) return;

        if (!newValue) {
            flatpickrInstance.value.clear();
            syncInputDisplay();
            return;
        }

        const nextDate = toDateObject(newValue);
        if (!nextDate) {
            flatpickrInstance.value.clear();
            syncInputDisplay();
            return;
        }

        const currentSelected = flatpickrInstance.value.selectedDates?.[0];
        const currentValue = currentSelected
            ? dayjs(currentSelected).format(props.valueFormat)
            : "";

        const nextValue = dayjs(nextDate).format(props.valueFormat);

        if (currentValue !== nextValue) {
            flatpickrInstance.value.setDate(nextDate, false);
        }

        syncInputDisplay();
    },
);

watch(
    () => props.minDate,
    (value) => {
        flatpickrInstance.value?.set("minDate", value || null);
    },
);

watch(
    () => props.maxDate,
    (value) => {
        flatpickrInstance.value?.set("maxDate", value || null);
    },
);

watch(
    () => props.disabled,
    () => {
        syncInputDisplay();
    },
);
// watch(
//     () => props.panelYearMode,
//     () => {
//         nextTick(() => {
//             updateCalendarHeader();
//         });
//     },
// );
onBeforeUnmount(() => {
    if (flatpickrInstance.value) {
        flatpickrInstance.value.destroy();
        flatpickrInstance.value = null;
    }
});
///********* */
// 顯示民國年在日曆 header 上
// function updateCalendarHeader() {
//     const fp = flatpickrInstance.value;
//     if (!fp) return;

//     const calendar = fp.calendarContainer;
//     if (!calendar) return;

//     const currentMonthWrap = calendar.querySelector(".flatpickr-current-month");
//     if (!currentMonthWrap) return;

//     const currentYear = fp.currentYear;
//     const currentMonth = fp.currentMonth + 1;

//     const displayYear =
//         props.panelYearMode === "roc" ? currentYear - 1911 : currentYear;

//     const headerText = `  ${displayYear}年`;

//     let customTitle = currentMonthWrap.querySelector(".custom-calendar-title");

//     if (!customTitle) {
//         customTitle = document.createElement("span");
//         customTitle.className = "custom-calendar-title";
//         currentMonthWrap.appendChild(customTitle);
//     }

//     customTitle.textContent = headerText;
// }
</script>

<style scoped>
.base-date-picker {
    width: 100%;
    display: inline-block;
}

.date-input {
    width: 100%;
    height: 38px;
    padding: 0 12px;
    border: 1px solid #d4d4d4;
    border-radius: 3px;
    background: #fff;
    color: #333;
    font-size: 16px;
    line-height: 38px;
    outline: none;
    box-sizing: border-box;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    cursor: pointer;
}

.base-date-picker.is-focus .date-input {
    border-color: #39b37b;
    box-shadow: 0 0 0 1px #39b37b inset;
}

.base-date-picker.is-disabled .date-input {
    background: #f3f3f3;
    color: #999;
    cursor: not-allowed;
}
</style>

<style>
.flatpickr-calendar {
    transform: none !important;
    rotate: none !important;
    translate: none !important;
    scale: none !important;
    z-index: 9999 !important;

    border: 1px solid #d8d8d8;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    background: #fff;
    font-family: Arial, "Microsoft JhengHei", sans-serif;
}

.flatpickr-months {
    padding-top: 4px;
}

.flatpickr-current-month {
    font-size: 16px;
    padding-top: 6px;
    color: #333;
}

.flatpickr-current-month .flatpickr-monthDropdown-months,
.flatpickr-current-month input.cur-year {
    font-size: 16px;
    font-weight: 400;
}

.flatpickr-weekdays {
    background: #fff;
}

span.flatpickr-weekday {
    color: #222;
    font-size: 14px;
    font-weight: 400;
}

.flatpickr-day {
    border-radius: 0;
    font-size: 14px;
    color: #222;
}

.flatpickr-day.today {
    border-color: #39b37b;
}

.flatpickr-day.selected,
.flatpickr-day.startRange,
.flatpickr-day.endRange {
    background: #39b37b;
    border-color: #39b37b;
    color: #fff;
}

.flatpickr-day:hover {
    background: #edf8f2;
    border-color: #edf8f2;
}

.flatpickr-day.disabled,
.flatpickr-day.prevMonthDay,
.flatpickr-day.nextMonthDay {
    color: #ccc;
}

.flatpickr-prev-month,
.flatpickr-next-month {
    fill: #666;
}

.numInputWrapper:hover,
.flatpickr-current-month input.cur-year:hover {
    background: transparent;
}

body .flatpickr-calendar {
    transform: none !important;
}

/******* */

.flatpickr-current-month {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 28px;
}
/* 顯示民國年在日曆 header 上 */
/* .flatpickr-current-month .cur-month,
.flatpickr-current-month .numInputWrapper {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.custom-calendar-title {
    position: relative;
    z-index: 2;
    display: inline-block;
    font-size: 16px;
    font-weight: 400;
    color: #333;
    line-height: 1;
    white-space: nowrap;
} */
</style>
