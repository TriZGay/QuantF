import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBackTest } from "@/api/analyze";

export const useAnalyzeStrategy = defineStore("ana-strategy", () => {
  const {
    run: addBackTest
  } = useRequest(fetchBackTest, {
    manual: true
  });

  return {
    addBackTest
  };
});
