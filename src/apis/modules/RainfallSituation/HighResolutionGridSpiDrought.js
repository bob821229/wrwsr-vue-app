import { Apis } from '../../apis'
import { apiGet, apiPost } from '../../request'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const getRawStatisticOptions = (params = {}, config = {}) => {
  return apiGet(Apis.RainfallSituation.getRawStatisticOptions.uri)
}