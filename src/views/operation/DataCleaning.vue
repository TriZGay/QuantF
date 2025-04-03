<script setup lang="ts">
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useTaskStore } from "@/stores/task";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { type FormInstance, message } from "ant-design-vue";
import type { ColumnProps } from "ant-design-vue/es/table";
import Cron from "@/components/CronPicker/Cron.vue";
import type {
  AddKLineRaw2ArcTaskRequest,
  AddKLineRepeatCheckTaskRequest,
  AddKLineTransToBollTaskRequest,
  AddKLineTransToMaTaskRequest,
  AddKLineTransToEmaTaskRequest,
  AddKLineTransToMacdTaskRequest,
  AddKLineTransToRsiTaskRequest
} from "@/api/task";
import { FT_REHABTYPE } from "@/api/code";

const analyzeMetaStores = useAnalyzeMeta();
const fetchTables = analyzeMetaStores.requestTables;
const fetchDbInfos = analyzeMetaStores.requestMetaDbInfo;
const fetchTableInfo = analyzeMetaStores.requestTableInfo;
const fetchTruncateTable = analyzeMetaStores.requestTruncateTable;
const fetchDataQa = analyzeMetaStores.requestDataQa;
const fetchDataQaDetails = analyzeMetaStores.requestDataQaDetails;
const {
  metaTables, metaDbInfos, dbInfoLoading,
  tableInfoLoading, metaTableInfo, dataQaPerDay,
  dataQaDetails
} = storeToRefs(analyzeMetaStores);

const taskStores = useTaskStore();
const fetchAddTask = taskStores.requestAddTask;
const fetchTasks = taskStores.requestTasks;
const fetchDelTask = taskStores.requestDelTask;
const { tasks, taskLoading } = storeToRefs(taskStores);

const dbInfoColumns = ref<ColumnProps[]>([
  {
    title: "数据库",
    dataIndex: "database",
    key: "database"
  }, {
    title: "表格",
    dataIndex: "table",
    key: "table"
  }, {
    title: "大小",
    dataIndex: "size",
    key: "size"
  }, {
    title: "硬盘里的大小",
    dataIndex: "bytesOnDisk",
    key: "bytesOnDisk"
  }, {
    title: "未压缩大小",
    dataIndex: "dataUncompressedBytes",
    key: "dataUncompressedBytes"
  }, {
    title: "压缩大小",
    dataIndex: "dataCompressedBytes",
    key: "dataCompressedBytes"
  }, {
    title: "压缩比率(%)",
    dataIndex: "compressedRate",
    key: "compressedRate"
  }, {
    title: "数据行数",
    dataIndex: "rows",
    key: "rows"
  }, {
    title: "操作",
    dataIndex: "action",
    key: "action"
  }
]);
const tasksColumns = ref<ColumnProps[]>([
  {
    title: "任务名称",
    dataIndex: "jobName",
    key: "jobName"
  }, {
    title: "任务组",
    dataIndex: "jobGroup",
    key: "jobGroup"
  }, {
    title: "触发器名称",
    dataIndex: "triggerName",
    key: "triggerName"
  }, {
    title: "触发器组",
    dataIndex: "triggerGroup",
    key: "triggerGroup"
  }, {
    title: "Cron表达式",
    dataIndex: "cron",
    key: "cron"
  }, {
    title: "状态",
    dataIndex: "state",
    key: "state"
  }, {
    title: "任务附加数据",
    dataIndex: "jobDataMap",
    key: "jobDataMap",
    ellipsis: true
  }, {
    title: "下次执行时间",
    dataIndex: "nextFireTime",
    key: "nextFireTime"
  }, {
    title: "操作",
    key: "action"
  }
]);
const metaTableColumns = ref<ColumnProps[]>([
  {
    title: "数据最大时间",
    dataIndex: "maxTime",
    key: "maxTime"
  }, {
    title: "数据最小",
    dataIndex: "minTime",
    key: "minTime"
  }, {
    title: "标的物代码",
    dataIndex: "code",
    key: "code"
  }, {
    title: "复权类型",
    dataIndex: "rehabType",
    key: "rehabType"
  }]);

const refreshDbInfo = (): void => {
  fetchDbInfos();
};

const showModal = ref<boolean>(false);
const taskForm = ref<FormInstance>();
const isImmediate = ref<Number>(1);
const kLineRaw2ArcTaskModel = ref<AddKLineRaw2ArcTaskRequest>({
  jobName: "",
  jobType: "KLINE_RAW_TO_ARC",
  fromTable: "",
  toTable: ""
});

const kLineRawTablesOptions = computed(() => {
  return metaTables.value.filter((tableName: string) => {
    return tableName.includes("kl") && tableName.includes("raw");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});
const kLineArcTablesOptions = computed(() => {
  return metaTables.value.filter((tableName: string) => {
    return tableName.includes("kl") && tableName.includes("arc");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});

const macdTablesOptions = computed(() => {
  return metaTables.value.filter((tableName: string) => {
    return tableName.includes("macd") && tableName.includes("arc");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});

const rsiTablesOptions = computed(() => {
  return metaTables.value.filter((tableName: string) => {
    return tableName.includes("rsi");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});

const maTablesOptions = computed(() => {
  return metaTables.value.filter((name: string) => {
    return name.includes("ma")
      && !name.includes("e")
      && !name.includes("cd")
      && name.includes("arc");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});

const bollTablesOptions = computed(() => {
  return metaTables.value.filter((name: string) => {
    return name.includes("boll") && name.includes("arc");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});

const emaTablesOptions = computed(() => {
  return metaTables.value.filter((name: string) => {
    return name.includes("ema") && name.includes("arc");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});

const handleKLineRaw2ArcOk = (): void => {
  fetchAddTask(kLineRaw2ArcTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};
const handleDelJob = (jobName: string): void => {
  fetchDelTask({
    jobName
  }).then(res => {
    if (res.status === 200) {
      message.success(res.data.toString());
      fetchTasks();
    }
  }).catch(err => {
    message.error(err.response.data.toString());
  });
};

const handleTableInfo = (tableName: string): void => {
  fetchTableInfo({
    tableName
  }).then(res => {
    if (res.status === 200) {
      showTableInfo.value = true;
    }
  }).catch(err => {
    message.error(err.response.data.toString());
  });
};

const showTableInfo = ref<boolean>(false);

const handleTruncateTable = (tableName: string): void => {
  fetchTruncateTable({
    tableName
  }).then(res => {
    if (res.status === 200) {
      message.success(res.data.toString());
      fetchDbInfos();
    }
  }).catch(err => {
    message.error(err.response.data.toString());
  });
};

const eventsClass = (date: Dayjs): string => {
  let dateStr = date.format("YYYY-MM-DD");
  if (dataQaPerDay.value.hasOwnProperty(dateStr)) {
    if (dataQaPerDay.value[dateStr]) {
      return "alarmDate";
    } else {
      return "normalDate";
    }
  } else {
    return "";
  }
};

const showModalRepeat = ref<boolean>(false);
const taskKLineRepeatForm = ref<FormInstance>();
const kLineRepeatTaskModel = ref<AddKLineRepeatCheckTaskRequest>({
  jobName: "",
  jobType: "KLINE_REPEAT_CHECK",
  table: ""
});
const handleKLineRepeatOk = (): void => {
  fetchAddTask(kLineRepeatTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};


const showDetailsModal = ref<boolean>(false);
const dataQaRepeatDetails = ref<ColumnProps[]>([
  {
    title: "日期",
    dataIndex: "checkDate",
    key: "checkDate"
  }, {
    title: "表格",
    dataIndex: "tableName",
    key: "tableName"
  }, {
    title: "标的物代码",
    dataIndex: "code",
    key: "code"
  }, {
    title: "复权类型",
    dataIndex: "rehabType",
    key: "rehabType"
  }, {
    title: "数据时间",
    dataIndex: "updateTime",
    key: "updateTime"
  }]);
const onSelectDate = (date: Dayjs): void => {
  fetchDataQaDetails({
    date: date.format("YYYY-MM-DD")
  });
  showDetailsModal.value = true;
};
const onPanelChange = (date: Dayjs, mode: string): void => {
  fetchDataQa({
    start: date.startOf("month").format("YYYY-MM-DD"),
    end: date.endOf("month").format("YYYY-MM-DD")
  });
};

const showModalTransMa = ref<boolean>(false);
const taskMaForm = ref<FormInstance>();
const kLine2MaTaskModel = ref<AddKLineTransToMaTaskRequest>({
  jobName: "",
  jobType: "KLINE_ARC_TO_MA",
  fromTableName: "",
  toTableName: "",
  startDateTime: "",
  endDateTime: ""
});
const handleKLineArc2MaOk = (): void => {
  fetchAddTask(kLine2MaTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};

const showModalTransBoll = ref<boolean>(false);
const taskBollForm = ref<FormInstance>();
const kLine2BollTaskModel = ref<AddKLineTransToBollTaskRequest>({
  jobName: "",
  jobType: "KLINE_ARC_TO_BOLL",
  fromTableName: "",
  toTableName: "",
  startDateTime: "",
  endDateTime: ""
});
const handleKLineArc2BollOk = (): void => {
  fetchAddTask(kLine2BollTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};

const showModalTransEMA = ref<boolean>(false);
const taskEMAForm = ref<FormInstance>();
const k2EMATaskModel = ref<AddKLineTransToEmaTaskRequest>({
  jobName: "",
  jobType: "KLINE_ARC_TO_EMA",
  kTableName: "",
  toTableName: "",
  startDateTime: "",
  endDateTime: ""
});
const handleKArc2EmaOk = (): void => {
  fetchAddTask(k2EMATaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};

const showModalTransMacd = ref<boolean>(false);
const taskMacdForm = ref<FormInstance>();
const k2MacdTaskModel = ref<AddKLineTransToMacdTaskRequest>({
  jobName: "",
  jobType: "KLINE_ARC_TO_MACD",
  fromTableName: "",
  toTableName: "",
  startDateTime: "",
  endDateTime: ""
});
const handleKArc2MacdOk = (): void => {
  fetchAddTask(k2MacdTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};

const showModalTransRsi = ref<boolean>(false);
const taskRsiForm = ref<FormInstance>();
const k2RsiTaskModel = ref<AddKLineTransToRsiTaskRequest>({
  jobName: "",
  jobType: "KLINE_ARC_TO_RSI",
  fromTableName: "",
  toTableName: "",
  startDateTime: "",
  endDateTime: ""
});
const handleKArc2RsiOk = (): void => {
  fetchAddTask(k2RsiTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};

onMounted(() => {
  fetchDbInfos();
  fetchTables();
  fetchTasks();
  fetchDataQa({
    start: dayjs().startOf("month").format("YYYY-MM-DD"),
    end: dayjs().endOf("month").format("YYYY-MM-DD")
  });
});
</script>

<template>
  <div class="container">
    <a-typography-title :level="3">数据清洗</a-typography-title>
    <a-button size="small" @click="refreshDbInfo">
      <template #icon>
        <reload-outlined />
      </template>
    </a-button>
    <a-table :data-source="metaDbInfos" :columns="dbInfoColumns"
             :loading="dbInfoLoading"
             size="small">
      <template #bodyCell="{column,record}">
        <template v-if="column.key==='action'">
          <span style="margin-right: 8px">
            <a @click="handleTableInfo(record.table)">概览</a>
          </span>
          <span>
            <a-popconfirm title="确认清空该表?"
                          @confirm="handleTruncateTable(record.table)">
               <a href="#">清空</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="showTableInfo" title="表信息">
      <a-table :data-source="metaTableInfo" :columns="metaTableColumns"
               :loading="tableInfoLoading"
               size="small">
        <template #bodyCell="{column,record}">
          <template v-if="column.key==='rehabType'">
            <span>{{ FT_REHABTYPE [record.rehabType] }}</span>
          </template>
        </template>
      </a-table>
    </a-modal>
    <div class="calendarWrapper">
      <a-calendar :fullscreen="false" @select="onSelectDate" @panelChange="onPanelChange">
        <template #dateFullCellRender="{current}">
          <div :class="eventsClass(current)">{{ current.date() }}</div>
        </template>
      </a-calendar>
    </div>
    <a-modal :width="648" v-model:visible="showDetailsModal" title="数据细节">
      <a-typography-title :level="5">重复数据</a-typography-title>
      <a-table :data-source="dataQaDetails.repeatDetails" :columns="dataQaRepeatDetails" size="small" />
    </a-modal>
    <!--    modal-->
    <a-modal v-model:visible="showModal" title="新建定时任务" @ok="handleKLineRaw2ArcOk">
      <a-form :ref="taskForm" :model="kLineRaw2ArcTaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="kLineRaw2ArcTaskModel.jobName" />
        </a-form-item>
        <a-form-item name="fromTable" label="源表">
          <a-select v-model:value="kLineRaw2ArcTaskModel.fromTable" :options="kLineRawTablesOptions" />
        </a-form-item>
        <a-form-item name="toTable" label="目的表">
          <a-select v-model:value="kLineRaw2ArcTaskModel.toTable" :options="kLineArcTablesOptions" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间" v-if="isImmediate===1">
          <a-date-picker :show-time="{defaultValue:dayjs('09:00:00','HH:mm:ss')}"
                         v-model:value="kLineRaw2ArcTaskModel.updateTimeStart"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
          -
          <a-date-picker :show-time="{defaultValue:dayjs('16:00:00','HH:mm:ss')}"
                         v-model:value="kLineRaw2ArcTaskModel.updateTimeEnd"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <a-input v-model:value="kLineRaw2ArcTaskModel.cron">
            <template #suffix>
              <a-popover title="表达式生成" trigger="click">
                <template #content>
                  <div class="cronWrapper">
                    <Cron v-model="kLineRaw2ArcTaskModel.cron" />
                  </div>
                </template>
                <PlusCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-popover>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="showModalRepeat" title="新建定时任务" @ok="handleKLineRepeatOk">
      <a-form :ref="taskKLineRepeatForm" :model="kLineRepeatTaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="kLineRepeatTaskModel.jobName" />
        </a-form-item>
        <a-form-item name="toTable" label="表">
          <a-select v-model:value="kLineRepeatTaskModel.table" :options="kLineArcTablesOptions" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间" v-if="isImmediate===1">
          <a-date-picker v-model:value="kLineRepeatTaskModel.startDate"
                         value-format="YYYY-MM-DD"
                         :show-now="false" />
          -
          <a-date-picker v-model:value="kLineRepeatTaskModel.endDate"
                         value-format="YYYY-MM-DD"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <a-input v-model:value="kLineRepeatTaskModel.cron">
            <template #suffix>
              <a-popover title="表达式生成" trigger="click">
                <template #content>
                  <div class="cronWrapper">
                    <Cron v-model="kLineRepeatTaskModel.cron" />
                  </div>
                </template>
                <PlusCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-popover>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="showModalTransMa" title="新建定时任务" @ok="handleKLineArc2MaOk">
      <a-form :ref="taskMaForm" :model="kLine2MaTaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="kLine2MaTaskModel.jobName" />
        </a-form-item>
        <a-form-item name="fromTable" label="源表">
          <a-select v-model:value="kLine2MaTaskModel.fromTableName" :options="kLineArcTablesOptions" />
        </a-form-item>
        <a-form-item name="toTable" label="目的表">
          <a-select v-model:value="kLine2MaTaskModel.toTableName" :options="maTablesOptions" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间" v-if="isImmediate===1">
          <a-date-picker :show-time="{defaultValue:dayjs('09:00:00','HH:mm:ss')}"
                         v-model:value="kLine2MaTaskModel.startDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
          -
          <a-date-picker :show-time="{defaultValue:dayjs('16:00:00','HH:mm:ss')}"
                         v-model:value="kLine2MaTaskModel.endDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <a-input v-model:value="kLine2MaTaskModel.cron">
            <template #suffix>
              <a-popover title="表达式生成" trigger="click">
                <template #content>
                  <div class="cronWrapper">
                    <Cron v-model="kLine2MaTaskModel.cron" />
                  </div>
                </template>
                <PlusCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-popover>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="showModalTransBoll" title="新建定时任务" @ok="handleKLineArc2BollOk">
      <a-form :ref="taskBollForm" :model="kLine2BollTaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="kLine2BollTaskModel.jobName" />
        </a-form-item>
        <a-form-item name="fromTable" label="源表">
          <a-select v-model:value="kLine2BollTaskModel.fromTableName" :options="kLineArcTablesOptions" />
        </a-form-item>
        <a-form-item name="toTable" label="目的表">
          <a-select v-model:value="kLine2BollTaskModel.toTableName" :options="bollTablesOptions" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间" v-if="isImmediate===1">
          <a-date-picker :show-time="{defaultValue:dayjs('09:00:00','HH:mm:ss')}"
                         v-model:value="kLine2BollTaskModel.startDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
          -
          <a-date-picker :show-time="{defaultValue:dayjs('16:00:00','HH:mm:ss')}"
                         v-model:value="kLine2BollTaskModel.endDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <a-input v-model:value="kLine2BollTaskModel.cron">
            <template #suffix>
              <a-popover title="表达式生成" trigger="click">
                <template #content>
                  <div class="cronWrapper">
                    <Cron v-model="kLine2BollTaskModel.cron" />
                  </div>
                </template>
                <PlusCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-popover>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="showModalTransEMA" title="新建定时任务" @ok="handleKArc2EmaOk">
      <a-form :ref="taskEMAForm" :model="k2EMATaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="k2EMATaskModel.jobName" />
        </a-form-item>
        <a-form-item name="fromTable" label="源表">
          <a-select v-model:value="k2EMATaskModel.kTableName" :options="kLineArcTablesOptions" />
        </a-form-item>
        <a-form-item name="toTable" label="目的表">
          <a-select v-model:value="k2EMATaskModel.toTableName" :options="emaTablesOptions" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间" v-if="isImmediate===1">
          <a-date-picker :show-time="{defaultValue:dayjs('09:30:00','HH:mm:ss')}"
                         v-model:value="k2EMATaskModel.startDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
          -
          <a-date-picker :show-time="{defaultValue:dayjs('16:00:00','HH:mm:ss')}"
                         v-model:value="k2EMATaskModel.endDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <a-input v-model:value="k2EMATaskModel.cron">
            <template #suffix>
              <a-popover title="表达式生成" trigger="click">
                <template #content>
                  <div class="cronWrapper">
                    <Cron v-model="k2EMATaskModel.cron" />
                  </div>
                </template>
                <PlusCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-popover>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="showModalTransMacd" title="新建定时任务" @ok="handleKArc2MacdOk">
      <a-form :ref="taskMacdForm" :model="k2MacdTaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="k2MacdTaskModel.jobName" />
        </a-form-item>
        <a-form-item name="fromTable" label="源表">
          <a-select v-model:value="k2MacdTaskModel.fromTableName" :options="emaTablesOptions" />
        </a-form-item>
        <a-form-item name="toTable" label="目的表">
          <a-select v-model:value="k2MacdTaskModel.toTableName" :options="macdTablesOptions" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间" v-if="isImmediate===1">
          <a-date-picker :show-time="{defaultValue:dayjs('09:30:00','HH:mm:ss')}"
                         v-model:value="k2MacdTaskModel.startDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
          -
          <a-date-picker :show-time="{defaultValue:dayjs('16:00:00','HH:mm:ss')}"
                         v-model:value="k2MacdTaskModel.endDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <a-input v-model:value="k2MacdTaskModel.cron">
            <template #suffix>
              <a-popover title="表达式生成" trigger="click">
                <template #content>
                  <div class="cronWrapper">
                    <Cron v-model="k2MacdTaskModel.cron" />
                  </div>
                </template>
                <PlusCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-popover>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="showModalTransRsi" title="新建定时任务" @ok="handleKArc2RsiOk">
      <a-form :ref="taskRsiForm" :model="k2RsiTaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="k2RsiTaskModel.jobName" />
        </a-form-item>
        <a-form-item name="fromTable" label="源表">
          <a-select v-model:value="k2RsiTaskModel.fromTableName" :options="kLineArcTablesOptions" />
        </a-form-item>
        <a-form-item name="toTable" label="目的表">
          <a-select v-model:value="k2RsiTaskModel.toTableName" :options="rsiTablesOptions" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间" v-if="isImmediate===1">
          <a-date-picker :show-time="{defaultValue:dayjs('09:30:00','HH:mm:ss')}"
                         v-model:value="k2RsiTaskModel.startDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
          -
          <a-date-picker :show-time="{defaultValue:dayjs('16:00:00','HH:mm:ss')}"
                         v-model:value="k2RsiTaskModel.endDateTime"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <a-input v-model:value="k2RsiTaskModel.cron">
            <template #suffix>
              <a-popover title="表达式生成" trigger="click">
                <template #content>
                  <div class="cronWrapper">
                    <Cron v-model="k2RsiTaskModel.cron" />
                  </div>
                </template>
                <PlusCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-popover>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--    -->
    <!--    button-->
    <a-space wrap style="margin-bottom: 8px">
      <a-button type="primary" shape="round" size="small" @click="showModal=true">
        <template #icon>
          <PlusOutlined />
        </template>
        K线[raw->arc]
      </a-button>
      <a-button type="primary" shape="round" size="small" @click="showModalRepeat=true">
        <template #icon>
          <PlusOutlined />
        </template>
        K线重复数据检查[arc]
      </a-button>
      <a-button type="primary" shape="round" size="small" @click="showModalTransMa=true">
        <template #icon>
          <PlusOutlined />
        </template>
        K线->MA[arc->ma_arc]
      </a-button>
      <a-button type="primary" shape="round" size="small" @click="showModalTransBoll=true">
        <template #icon>
          <PlusOutlined />
        </template>
        K线->BOLL[arc->boll_arc]
      </a-button>
      <a-button type="primary" shape="round" size="small" @click="showModalTransEMA=true">
        <template #icon>
          <PlusOutlined />
        </template>
        K线->EMA[k_arc->ema_arc]
      </a-button>
      <a-button type="primary" shape="round" size="small" @click="showModalTransMacd=true">
        <template #icon>
          <PlusOutlined />
        </template>
        EMA线->MACD[ema_arc->macd_arc]
      </a-button>
      <a-button type="primary" shape="round" size="small" @click="showModalTransRsi=true">
        <template #icon>
          <PlusOutlined />
        </template>
        K线->RSI[k_arc->rsi_arc]
      </a-button>
    </a-space>
    <!--    -->

    <a-table :data-source="tasks" :columns="tasksColumns"
             :loading="taskLoading"
             size="small">
      <template #bodyCell="{column,record}">
        <template v-if="column.key==='nextFireTime'">
          <span>{{ dayjs(record.nextFireTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
        <template v-if="column.key==='action'">
          <span>
            <a @click="handleDelJob(record.jobName)">删除</a>
          </span>
        </template>
      </template>

    </a-table>
  </div>
</template>

<style scoped lang="less">
.calendarWrapper {
  width: 300px;
  border: 1px solid #d9d9d9;
  border-radius: 4px
}

.cronWrapper {
  height: 360px;
  overflow: scroll;
}

.alarmDate {
  background-color: orangered;
}

.normalDate {
  background-color: greenyellow;
}

</style>
