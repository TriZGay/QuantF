import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import {
  fetchAddKLineRaw2ArcTask,
  fetchAddKLineRepeatCheckTask,
  fetchAddKLineTransToMaTask,
  fetchDelTask,
  fetchTasks
} from "@/api/task";
import { computed } from "vue";

export const useTaskStore = defineStore("taskStore", () => {
  const {
    runAsync: requestAddKLineRaw2ArcTask
  } = useRequest(fetchAddKLineRaw2ArcTask, {
    manual: true
  });

  const {
    run: requestTasks,
    loading: taskLoading,
    data: tasksRaw
  } = useRequest(fetchTasks, {
    manual: true
  });

  const {
    runAsync: requestDelTask
  } = useRequest(fetchDelTask, {
    manual: true
  });

  const tasks = computed(() => {
    return tasksRaw.value?.data || [];
  });

  const {
    runAsync: requestAddKLineRepeatCheckTask
  } = useRequest(fetchAddKLineRepeatCheckTask, {
    manual: true
  });

  const {
    runAsync: requestAddKLineTransToMaTask
  } = useRequest(fetchAddKLineTransToMaTask, {
    manual: true
  });

  return {
    requestAddKLineRaw2ArcTask,
    requestTasks,
    taskLoading,
    tasks,
    requestDelTask,
    requestAddKLineRepeatCheckTask,
    requestAddKLineTransToMaTask
  };
});
