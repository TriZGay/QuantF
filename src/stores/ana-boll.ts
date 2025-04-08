import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBoll202 } from "@/api/analyze";

export const useAnalyzeBoll = defineStore("ana-boll", () => {
  const {
    runAsync: requestBoll202
  } = useRequest(fetchBoll202, {
    manual: true
  });
  return {
    requestBoll202
  };
});
