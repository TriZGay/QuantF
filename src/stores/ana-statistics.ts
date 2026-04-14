import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchHeatmapByPlates } from "@/api/analyze";
import { computed } from "vue";

export const useAnalyzeStatistics = defineStore("analyzeStatistics", () => {
  const { run: requestHeatmapByPlates, data: heatmapByPlatesResp } = useRequest(
    fetchHeatmapByPlates,
    {
      manual: true,
    }
  );
  const heatmapByPlates = computed(() => heatmapByPlatesResp.value?.data || []);

  return {
    requestHeatmapByPlates,
    heatmapByPlates,
  };
});
