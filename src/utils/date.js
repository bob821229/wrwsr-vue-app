import dayjs from "dayjs";
// 轉變顯示民國年格式
export const toROCDate = (dateStr) => {
    const d = dayjs(dateStr);
    if (!d.isValid()) return "";

    const rocYear = d.year() - 1911;
    return `${rocYear}-${d.format("MM-DD")}`;
};
