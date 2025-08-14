import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import {
  fetchMaData, fetchEMAData, fetchBollData,
  fetchRsiData, fetchKdjData, fetchMacdData, fetchArbrData, fetchKdj933Init
} from "@/api/analyze";

export const useAnalyzeIndies = defineStore("ana-indies", () => {
  const {
    runAsync: requestMacdData
  } = useRequest(fetchMacdData, {
    manual: true
  });

  const {
    runAsync: requestMaData
  } = useRequest(fetchMaData, {
    manual: true
  });
  const {
    runAsync: requestEmaData
  } = useRequest(fetchEMAData, {
    manual: true
  });

  const {
    runAsync: requestBollData
  } = useRequest(fetchBollData, {
    manual: true
  });

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

  const {
    runAsync: requestArbrData
  } = useRequest(fetchArbrData, {
    manual: true
  });

  const {
    runAsync: requestKdj933Init
  } = useRequest(fetchKdj933Init, {
    manual: true
  });

  return {
    requestBollData,
    requestRsiData,
    requestKdjData,
    requestEmaData,
    requestMaData,
    requestMacdData,
    requestArbrData,
    requestKdj933Init
  };
});
