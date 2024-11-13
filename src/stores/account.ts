import { defineStore } from "pinia";
import { fetchAccounts } from '@/api/account'
import { useRequest } from "vue-request";
import { computed } from "vue";

export const useAccountStore = defineStore("account", () => {

    const { data, loading, run } = useRequest(fetchAccounts)
    const list = computed(() => {
        return data.value?.data || []
    })

    return {
        run,
        list,
        loading
    }
})