import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchMacdData } from "@/api/analyze";

export const useAnalyzeMacd = defineStore("ana-macd", () => {
  const {
    runAsync: requestMacdData
  } = useRequest(fetchMacdData, {
    manual: true
  });
  return {
    requestMacdData
  };
});
