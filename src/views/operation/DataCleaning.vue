<script setup lang="ts">
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useTaskStore } from "@/stores/task";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { type FormInstance, message } from "ant-design-vue";
import type { ColumnProps } from "ant-design-vue/es/table";
import Cron from "@/components/CronPicker/Cron.vue";
import type { AddKLineRaw2ArcTaskRequest, AddKLineRepeatCheckTaskRequest } from "@/api/task";
import { FT_REHABTYPE } from "@/api/code";

const analyzeMetaStores = useAnalyzeMeta();
const fetchTables = analyzeMetaStores.requestTables;
const fetchDbInfos = analyzeMetaStores.requestMetaDbInfo;
const fetchTableInfo = analyzeMetaStores.requestTableInfo;
const fetchTruncateTable = analyzeMetaStores.requestTruncateTable;
const fetchDataQa = analyzeMetaStores.requestDataQa;
const {
  metaTables, metaDbInfos, dbInfoLoading,
  tableInfoLoading, metaTableInfo, dataQaPerDay
} = storeToRefs(analyzeMetaStores);

const taskStores = useTaskStore();
const fetchKLineRaw2Arc = taskStores.requestAddKLineRaw2ArcTask;
const fetchKLineRepeatCheck = taskStores.requestAddKLineRepeatCheckTask;
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

fetchDbInfos();
fetchTables();
fetchTasks();

const refreshDbInfo = (): void => {
  fetchDbInfos();
};

const showModal = ref<boolean>(false);
const taskForm = ref<FormInstance>();
const isImmediate = ref<Number>(1);
const kLineRaw2ArcTaskModel = ref<AddKLineRaw2ArcTaskRequest>({
  jobName: "",
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

const handleKLineRaw2ArcOk = (): void => {
  fetchKLineRaw2Arc(kLineRaw2ArcTaskModel.value)
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
  table: ""
});
const handleKLineRepeatOk = (): void => {
  fetchKLineRepeatCheck(kLineRepeatTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
        fetchTasks();
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};

fetchDataQa({
  start: dayjs().startOf("month").format("YYYY-MM-DD"),
  end: dayjs().endOf("month").format("YYYY-MM-DD")
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
            <a @click="handleTruncateTable(record.table)">清空</a>
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
      <a-calendar :fullscreen="false">
        <template #dateFullCellRender="{current}">
          <div :class="eventsClass(current)">{{ current.date() }}</div>
        </template>
      </a-calendar>
    </div>
    <a-button type="primary" shape="round" size="small" @click="showModal=true">
      <template #icon>
        <PlusOutlined />
      </template>
      K线[raw->arc]
    </a-button>
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
    <a-button type="primary" shape="round" size="small" @click="showModalRepeat=true">
      <template #icon>
        <PlusOutlined />
      </template>
      K线重复数据检查[arc]
    </a-button>
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
