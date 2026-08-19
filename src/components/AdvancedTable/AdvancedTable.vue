<script lang="ts" setup>
//@ts-nocheck
import {
  useAttrs,
  useSlots,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import SearchArea from "@/components/SearchArea/SearchArea.vue";

const attrs = useAttrs();
const slots = useSlots();

function handleSearchFormState(values: any) {
  let queryForm: Object = {};
  Object.keys(values).forEach((key) => {
    queryForm[key] = values[key].bindValue;
  });
  return queryForm;
}

const emit = defineEmits<{
  (e: "onFinish", formValue: Object): void;
  (e: "onChangeTable", tableProps: Object): void;
  (e: "loadMore", form: Object): void;
  (e: "update:dataSource"): void;
  (e: "update:loading"): void;
}>();

function onEmitFinish(queryForm: Object) {
  emit("onFinish", queryForm);
}

function onEmitChangeTable(pagination, filters, sorter, { currentDataSource }) {
  let queryForm = handleSearchFormState(attrs.form);
  emit("onChangeTable", {
    pagination: pagination,
    form: queryForm,
    filters: filters,
    sorter: sorter,
    data: currentDataSource,
  });
}

const props = defineProps({
  virtual: {
    type: Boolean,
    required: false,
    default: false,
  },
  // 数据源，外部传入，也可组件内部拼接
  dataSource: {
    type: Array,
    default: () => [],
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false,
  },
  // rowKey 必填
  rowKey: {
    type: [String, Function],
    required: false,
  },
  // 距离底部多少px触发加载更多
  offset: {
    type: Number,
    default: 80,
  },
  // 是否还有更多数据
  hasMore: {
    type: Boolean,
    default: true,
  },
  // 是否重置列表（切换查询条件，清空数据重置页码）
  resetFlag: {
    type: [Number, Boolean],
    default: 0,
  },
});

const tableRef = ref(null);
let scrollDom = ref(null);

// 内部数据源
const innerDataSource = computed({
  get() {
    return props.dataSource;
  },
  set(val) {
    emit("update:dataSource", val);
  },
});

const innerLoading = computed({
  get() {
    return props.loading;
  },
  set(val) {
    emit("update:loading", val);
  },
});

if (props.virtual) {
  // 滚动处理
  const handleScroll = (e) => {
    if (innerLoading.value || !props.hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - props.offset) {
      let queryForm = handleSearchFormState(attrs.form);
      emit("loadMore", queryForm);
    }
  };
  // 绑定滚动监听
  const bindScroll = async () => {
    await nextTick();
    if (!tableRef.value) return;
    scrollDom.value = tableRef.value.$el.querySelector(".ant-table-body");
    if (scrollDom.value) {
      scrollDom.value.removeEventListener("scroll", handleScroll);
      scrollDom.value.addEventListener("scroll", handleScroll);
    }
  };

  // 监听重置标记，重置滚动位置
  watch(
    () => props.resetFlag,
    async () => {
      await nextTick();
      if (scrollDom.value) {
        scrollDom.value.scrollTop = 0;
      }
      bindScroll();
    }
  );
  onMounted(() => {
    bindScroll();
  });

  onUnmounted(() => {
    if (scrollDom.value) {
      scrollDom.value.removeEventListener("scroll", handleScroll);
    }
  });
}
const onResetFields = () => {
  if(props.virtual) {

  }
};
</script>
<template>
  <SearchArea
    v-bind="attrs"
    @on-finish="onEmitFinish"
    @on-reset-field="onResetFields"
  />
  <a-table
    class="searchResult"
    ref="tableRef"
    v-bind="attrs"
    :data-source="innerDataSource"
    :loading="innerLoading"
    :row-key="rowKey"
    @change="onEmitChangeTable"
  >
    <template v-for="(_value, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"></slot>
    </template>
  </a-table>
</template>
<style lang="less" scoped>
.searchResult {
  margin-top: 16px;
}
</style>
