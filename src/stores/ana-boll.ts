import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBoll2002 } from "@/api/analyze";

export const useAnalyzeBoll = defineStore("ana-boll", () => {
  const {
    runAsync: requestBoll2002
  } = useRequest(fetchBoll2002, {
    manual: true
  });
  return {
    requestBoll2002
  };
});
