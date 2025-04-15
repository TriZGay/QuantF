import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBoll202, fetchRsiData, fetchKdjData } from "@/api/analyze";


export const useAnalyzeIndies = defineStore("ana-indies", () => {
  const {
    runAsync: requestRsiData
  } = useRequest(fetchRsiData, {
    manual: true
  });
  const {
    runAsync: requestKdjData
  } = useRequest(fetchKdjData, {
    manual: true
  });
  return {
    requestRsiData,
    requestKdjData
  };
});
