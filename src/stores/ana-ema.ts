import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchEMAData } from "@/api/analyze";

export const useAnalyzeEma = defineStore("ana-ema", () => {
  const {
    runAsync: requestEma
  } = useRequest(fetchEMAData, {
    manual: true
  });
  return {
    requestEma
  };
});
