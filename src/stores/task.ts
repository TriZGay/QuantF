import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchAddKLineRaw2ArcTask } from "@/api/task";

export const useTaskStore = defineStore("taskStore", () => {
  const {
    runAsync: requestAddKLineRaw2ArcTask
  } = useRequest(fetchAddKLineRaw2ArcTask, {
    manual: true
  });

  return {
    requestAddKLineRaw2ArcTask
  };
});
