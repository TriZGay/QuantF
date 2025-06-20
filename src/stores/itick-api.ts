import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchProductList } from "@/api/itick";
import { computed } from "vue";

export const useItickApi = defineStore("itick-api", () => {
  const {
    data: rawProducts,
    run: requestProducts
  } = useRequest(fetchProductList, {
    manual: true
  });

  const products = computed(() => rawProducts.value?.data);

  return {
    products,
    requestProducts
  };
});
