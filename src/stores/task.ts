import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import {
  fetchAddTask,
  fetchDelTask,
  fetchTasks
} from "@/api/task";
import { computed } from "vue";

export const useTaskStore = defineStore("taskStore", () => {
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
    runAsync: requestAddTask
  } = useRequest(fetchAddTask, {
    manual: true
  });

  return {
    requestTasks,
    taskLoading,
    tasks,
    requestDelTask,
    requestAddTask
  };
});
