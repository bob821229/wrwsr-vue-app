import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getGlossaryData } from '@/api/modules/common'

export const useSimulationStore = defineStore('simulation', () => {
  const glossary = ref(null)
  const loading = ref(false)

  async function fetchGlossary() {
    try {
      loading.value = true
      const res = await getGlossaryData()
      glossary.value = res.data
    } finally {
      loading.value = false
    }
  }

  return {
    glossary,
    loading,
    fetchGlossary
  }
})