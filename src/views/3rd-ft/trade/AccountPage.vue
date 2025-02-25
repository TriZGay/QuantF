<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import type { AccountItem, AccountsCommand } from "@/types/message";
import { useTimeoutFn } from "@vueuse/core";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const {
  futuAccounts
} = storeToRefs(useFutuStomp());

const { start: sendAccountsCommand } = useTimeoutFn(() => {
  let accountsCommand: AccountsCommand = {
    type: "ACCOUNTS"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(accountsCommand));
}, 1000);

onMounted(() => {
  sendAccountsCommand();
});

const simulatorAccounts = computed<Array<AccountItem>>(() => {
  return futuAccounts.value?.accounts?.filter(acc => {
    return acc.simAccType != null;
  });
});

const realAccounts = computed<Array<AccountItem>>(() => {
  return futuAccounts.value?.accounts?.filter(acc => {
    return acc.simAccType == null;
  });
});

</script>
<template>
  <div class="account-list-container">
    <a-typography>
      <a-typography-title :level="5">模拟账号</a-typography-title>
      <a-typography-paragraph>
        <a-row type="flex" :gutter="8" justify="start">
          <a-col :md="8" v-for="simAcc in simulatorAccounts">
            <a-card size="small" :title="simAcc.simAccTypeStr" style="margin-bottom: 16px">
              <div>
                <a-space>
                  <span>ACC_ID:</span>
                  <span style="font-weight: bold;font-style: italic">{{ simAcc.accID }}</span>
                  <a-tag color="success" v-if="simAcc.accStatus===0">
                    <template #icon>
                      <check-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                  <a-tag color="error" v-if="simAcc.accStatus===1">
                    <template #icon>
                      <close-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                </a-space>
              </div>
              <div>{{ simAcc.accTypeStr }}</div>
              <div>可交易市场:[]</div>
              <template #extra>
                <a href="#">交易</a>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="5">真实账号</a-typography-title>
      <a-typography-paragraph>
        <a-row type="flex" :gutter="8" justify="start">
          <a-col :md="8" v-for="simAcc in realAccounts">
            <a-card size="small" :title="simAcc.simAccTypeStr" style="margin-bottom: 16px">
              <div>
                <a-space>
                  <span>ACC_ID:</span>
                  <span style="font-weight: bold;font-style: italic">{{ simAcc.accID }}</span>
                  <a-tag color="success" v-if="simAcc.accStatus===0">
                    <template #icon>
                      <check-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                  <a-tag color="error" v-if="simAcc.accStatus===1">
                    <template #icon>
                      <close-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                </a-space>
              </div>
              <div>{{ simAcc.accTypeStr }}</div>
              <div>可交易市场:[]</div>
              <template #extra>
                <a href="#">交易</a>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>
<style lang="less" scoped>
.searchResult {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
}
</style>
