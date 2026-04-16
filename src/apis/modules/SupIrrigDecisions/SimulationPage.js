import { Apis } from '../../apis'
import { apiGet, apiPost } from '../../request'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const getLastUpdate = (params = {}, config = {}) => {
  return apiGet(Apis.SupIrrigDecisions.GetLastUpdate.uri)
}
//取得 水庫初始蓄水量資料
export const getInitialWaterStorage = (data = {}, config = {}) => {
  return apiPost(Apis.SupIrrigDecisions.GetInitialWaterStorage.uri, data, config)
}
//取得 歷年初始蓄水量資料
export const getHistoricalPeriod = (data = {}, config = {}) => {
  return apiPost(Apis.SupIrrigDecisions.GetHistoricalPeriod.uri, data, config)
}
//取得 水庫列表
export const getReservoirsList = (params = {}, config = {}) => {
  return apiGet(Apis.SupIrrigDecisions.GetReservoirsList.uri, params, config)
}
//取得 入流量列表
export const getPiTypeValue = (params = {}, config = {}) => {
  return apiPost(Apis.SupIrrigDecisions.GetPiTypeValue.uri, params, config)
}
//取得 情境列表
export const getSolutionList = (params = {}, config = {}) => {
  return apiPost(Apis.SupIrrigDecisions.GetSolutionList.uri, params, config)
}
//設定 模擬參數
export const setSimulationParams = (data = {}, config = {}) => {
  return apiPost(Apis.SupIrrigDecisions.SetSimulationParams.uri, data, config)
}
//取得 安全水位線資料
export const getSafetyWaterLine = (data = {}, config = {}) => {
  return apiPost(Apis.SupIrrigDecisions.GetSafetyWaterLine.uri, data, config)
}