import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBackTest } from "@/api/analyze";

export const useAnalyzeStrategy = defineStore("ana-strategy", () => {
  const {
    loading: backTestLoading,
    runAsync: addBackTest
  } = useRequest(fetchBackTest, {
    manual: true
  });

  return {
    backTestLoading,
    addBackTest
  };
});
