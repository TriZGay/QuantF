import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBoll202, fetchRsiData } from "@/api/analyze";


export const useAnalyzeIndies = defineStore("ana-indies", () => {
  const {
    runAsync: requestRsiData
  } = useRequest(fetchRsiData, {
    manual: true
  });
  return {
    requestRsiData
  };
});
