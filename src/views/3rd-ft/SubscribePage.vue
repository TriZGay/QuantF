<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, createVNode, onMounted, ref } from "vue";
import { parseFTsubType, parseSecurityType } from "@/api/code";
import { Modal, type TableColumnProps } from "ant-design-vue";
import { useFutuApi } from "@/stores/futu-api";
import type { SubscribeInfo } from "@/api/futu";
import type { SubOrUnSubCommand } from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import HistoryKLineButton from "@/components/HistoryKLineButton/index.vue";

const {
  sendFtCommandOnNotifyEndPoint
} = useFutuStomp();

const {
  querySubscribeInfo,
  querySubscribeDetails
} = useFutuApi();
const {
  subscribeInfoLoading,
  subscribeInfos,
  subscribeDetailsLoading,
  subscribeDetails
} = storeToRefs(useFutuApi());

onMounted(() => {
  querySubscribeInfo({
    size: 10,
    current: 1
  });
  querySubscribeDetails({
    size: 10,
    current: 1
  });
});
const subscribeInfoColumns = ref<TableColumnProps[]>([
  {
    title: "代码",
    dataIndex: "securityCode",
    fixed: "left"
  },
  {
    title: "名称",
    dataIndex: "securityName"
  },
  {
    title: "标的物类型",
    dataIndex: "securityType"
  },
  {
    title: "订阅类型",
    dataIndex: "subTypes"
  },
  {
    title: "操作",
    key: "action"
  }
]);
const subscribeDetailsColumns = ref<TableColumnProps[]>([
  {
    title: "代码",
    dataIndex: "securityCode",
    fixed: "left"
  },
  {
    title: "名称",
    dataIndex: "securityName"
  },
  {
    title: "标的物类型",
    dataIndex: "securityType"
  },
  {
    title: "订阅类型",
    dataIndex: "subType"
  },
  {
    title: "操作",
    key: "action"
  }
]);

function onChangeTable(tableProps: Object) {
  let queryForm = tableProps.form;
  let { pageSize, current } = tableProps.pagination;
  querySubscribeInfo({
    ...queryForm,
    size: pageSize,
    current: current
  });
}

function onChangeDetailsTable(tableProps: Object) {
  let queryForm = tableProps.form;
  let { pageSize, current } = tableProps.pagination;
  querySubscribeDetails({
    ...queryForm,
    size: pageSize,
    current: current
  });
}

const pagination = computed<Object>(() => {
  return {
    total: subscribeInfos.value.total,
    current: subscribeInfos.value.current,
    pageSize: subscribeInfos.value.pageSize,
    showTotal: (total: Number, range: Array<any>) => `${range[0]}-${range[1]} of ${total} items`
  };
});
const paginationDetails = computed<Object>(() => {
  return {
    total: subscribeDetails.value.total,
    current: subscribeDetails.value.current,
    pageSize: subscribeDetails.value.pageSize,
    showTotal: (total: Number, range: Array<any>) => `${range[0]}-${range[1]} of ${total} items`
  };
});

function cancelSubscribe(row: SubscribeInfo) {
  let { securityMarket, securityCode, securityName, securityType, subType } = row;
  Modal.confirm({
    title: "请确认",
    icon: createVNode(ExclamationCircleOutlined),
    content: "确定取消订阅?",
    okText: "是",
    okType: "danger",
    cancelText: "否",
    onOk() {
      let subMessage: SubOrUnSubCommand = {
        type: "SUBSCRIPTION",
        securityList: [{
          market: securityMarket,
          code: securityCode,
          name: securityName,
          type: securityType
        }],
        subTypeList: [subType],
        unsub: true
      };
      sendFtCommandOnNotifyEndPoint(subMessage);
    }
  });
}

const computeKlType = (subType: number) => {
  if (subType === 11) {
    return 1;
  }
};


</script>
<template>
  <div class="subscribe-info-container">
    <a-typography>
      <a-typography-title :level="5">订阅情况</a-typography-title>
      <a-typography-paragraph>
        <a-table :columns="subscribeInfoColumns" :data-source="subscribeInfos.data"
                 :loading="subscribeInfoLoading" :pagination="pagination" @change="onChangeTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'securityType'">
              {{ parseSecurityType(record.securityType) }}
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="5">订阅细节</a-typography-title>
      <a-typography-paragraph>
        <a-table :columns="subscribeDetailsColumns"
                 :data-source="subscribeDetails.data"
                 :loading="subscribeDetailsLoading"
                 :pagination="paginationDetails"
                 @change="onChangeDetailsTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'securityType'">
              {{ parseSecurityType(record.securityType) }}
            </template>
            <template v-if="column.dataIndex === 'subType'">
              {{ parseFTsubType(record.subType) }}
            </template>
            <template v-if="column.key === 'action'">
                    <span>
                        <a-button type="link" size="small" @click="cancelSubscribe(record)">取消订阅</a-button>
                        <a-divider type="vertical" />
                        <HistoryKLineButton :kl-type="computeKlType(record.subType)"
                                            :market="record.securityMarket"
                                            :code="record.securityCode" />
                    </span>
            </template>
          </template>
        </a-table>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>
<style lang="less" scoped>
</style>
