// api/modules/common.js
import { apiGet } from '../request'
import { Apis } from '@/apis/apis.js'

export function getGlossaryData() {
  return apiGet(Apis.General.getGlossaryData.uri)
}