import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchMaData } from "@/api/analyze";

export const useAnalyzeMa = defineStore("ana-ma", () => {
  const {
    runAsync: requestMaData
  } = useRequest(fetchMaData, {
    manual: true
  });
  return {
    requestMaData
  };
});
