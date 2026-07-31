<script setup>
import { marketTypeToSelectOptions } from "@/api/code";
import { onMounted, ref, watch } from "vue";
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
const { queryStocks } = useFutuApi();
const { stocks } = storeToRefs(useFutuApi());
import { useFutuStomp } from "@/stores/futu-stomp";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuCompanyProfile, futuCompanyExecutives, futuCompanyExecutiveBg } =
  storeToRefs(useFutuStomp());

const market = ref("1");
const stockCode = ref("");
const stockSelectOptions = ref([]);

onMounted(() => {
  queryStocks({
    market: parseInt(market.value),
    size: 200,
    current: 1,
  });
});

const queryStockInfos = (market, code) => {
  queryCompanyProfile(market, code);
  queryCompanyExecutives(market, code);
};

const queryCompanyExecutiveBg = (leaderName) => {
  let command = {
    type: "COMPANY_EXECUTIVE_BACKGROUND",
    market: parseInt(market.value),
    code: stockCode.value,
    leaderName: leaderName,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

const executivesModalVisible = ref(false);
const executivesColumns = ref([
  { title: "高管展示名称", dataIndex: "displayLeaderName", width: 120 },
  { title: "高管姓名", dataIndex: "leaderName", width: 100 },
  { title: "职位名称", dataIndex: "positionName", width: 100 },
  { title: "任职起始日", dataIndex: "beginDateStr", width: 100 },
  { title: "性别", dataIndex: "leaderGender", width: 100 },
  { title: "年龄", dataIndex: "leaderAge", width: 100 },
  { title: "最高学历", dataIndex: "highestEducation", width: 100 },
  { title: "年薪", dataIndex: "annualSalary", width: 100 },
  { title: "发布日期", dataIndex: "issueDateStr", width: 100 },
]);

const queryCompanyExecutives = (market, code) => {
  let command = {
    type: "COMPANY_EXECUTIVES",
    market: market,
    code: code,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

const queryCompanyProfile = (market, code) => {
  let command = {
    type: "COMPANY_PROFILE",
    market: market,
    code: code,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

watch(stocks, (newStocks) => {
  if (newStocks.data.length > 0) {
    let stocksOnPage = stocks.value.data.map((p) => {
      return { value: p.code, label: p.name, market: p.marketCode };
    });
    stockSelectOptions.value = stockSelectOptions.value.concat(stocksOnPage);
    if (stocks.value.current === 1) {
      stockCode.value = newStocks.data[0].code;
      queryStockInfos(newStocks.data[0].marketCode, newStocks.data[0].code);
    }
  } else {
    stockSelectOptions.value = [];
    stockCode.value = null;
  }
});

const companyBizInfo = ref("");
const companyIntroduction = ref("");

watch(
  futuCompanyProfile,
  (profile) => {
    if (profile?.content?.itemList.length > 0) {
      let independents = profile.content.itemList.filter(
        (i) => i.fieldTypeStr === "独立标题"
      );
      if (independents.length > 0) {
        let foundBizInfo = independents.find((i) => i.name === "公司业务");
        if (typeof foundBizInfo !== "undefined") {
          companyBizInfo.value = foundBizInfo.value;
        }
        let foundIntroduction = independents.find((i) => i.name === "公司简介");
        if (typeof foundIntroduction !== "undefined") {
          companyIntroduction.value = foundIntroduction.value;
        }
      }
    }
  },
  { deep: true }
);

const stockFilterOption = (input, option) => {
  return option.label.includes(input);
};

const onPopupScroll = (e) => {
  const { target } = e;
  const { scrollTop, scrollHeight, offsetHeight } = target;
  if (scrollTop + 2 + offsetHeight >= scrollHeight) {
    if (stocks.value.current !== stocks.value.totalPage) {
      let current = stocks.value.current;
      current = current + 1;
      queryStocks({
        market: parseInt(market.value),
        size: 200,
        current: current,
      });
      let stocksOnPage = stocks.value.data.map((p) => {
        return {
          value: p.id,
          label: p.name,
          code: p.code,
          market: p.marketCode,
        };
      });
      stockSelectOptions.value = stockSelectOptions.value.concat(stocksOnPage);
    }
  }
};

const onSelectStock = (value, option) => {
  // queryAllStocks({
  //   plateId: value,
  // });
  // //查询板块快照
  // let foundPlate = platesSelectOptions.value.find((ps) => ps.value === value);
  // market.value = foundPlate.market.toString();
  // plateCode.value = foundPlate.code;
  // querySnapshots({
  //   market: foundPlate.market,
  //   code: foundPlate.code,
  //   securityType: 7, //7-板块
  // });
};
</script>

<template>
  <div class="border-gray-700 border-solid p-4 rounded overflow-y-auto">
    <div class="mb-2">
      <a-form layout="inline">
        <a-form-item>
          <a-select
            v-model:value="market"
            placeholder="市场"
            :options="marketTypeToSelectOptions()"
          />
        </a-form-item>
        <a-form-item class="w-52">
          <a-select
            v-model:value="stockCode"
            placeholder="个股"
            show-search
            :filter-option="stockFilterOption"
            :options="stockSelectOptions"
            @select="onSelectStock"
            @popupScroll="onPopupScroll"
          />
        </a-form-item>
        <a-form-item label="页数">
          {{
            "(" +
            stocks.current +
            "/" +
            stocks.totalPage +
            ")" +
            "(" +
            stocks.total +
            ")"
          }}
        </a-form-item>
      </a-form>
    </div>
    <div class="h-[480px]">
      <!-- 顶部股票头部信息 -->
      <a-card class="mb-6 shadow-sm" bordered>
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xl font-bold"
            >
              zzz
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">zzzz</h2>
              <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>股票代码：</span>
                <span>行业：zzz</span>
                <span>上市时间：zzzz</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-red-500">zzz</div>
              <div class="text-xs text-gray-400">当前股价(元)</div>
            </div>
            <a-button type="primary">加入自选</a-button>
          </div>
        </div>
      </a-card>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧主体：公司概览数组动态渲染 -->
        <div class="lg:col-span-3">
          <a-card title="公司核心概览" bordered size="small" class="shadow-sm">
            <!-- 数组循环渲染概览信息 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                v-for="(
                  item, index
                ) in futuCompanyProfile?.content?.itemList.filter(
                  (i) => i.fieldTypeStr !== '独立标题'
                )"
                :key="index"
                class="dark:bg-gray-50 rounded-lg p-4 border-solid border border-gray-50"
              >
                <div class="text-sm dark:text-gray-400 mb-1">
                  {{ item.name }}
                </div>
                <div class="text-base font-medium dark:text-gray-700 break-all">
                  {{ item.value }}
                </div>
              </div>
            </div>

            <!-- 公司简介大文本区域 -->
            <div class="mt-8 pt-6 border-t dark:border-gray-100">
              <h3 class="text-base font-semibold dark:text-gray-800 mb-3">
                企业简介
              </h3>
              <p class="dark:text-gray-600 leading-relaxed whitespace-pre-line">
                {{ companyIntroduction }}
              </p>
            </div>
          </a-card>
        </div>

        <!-- 右侧侧边栏辅助卡片 -->
        <div class="lg:col-span-1 flex flex-col gap-6">
          <a-card title="主营业务" bordered size="small">
            <p class="dark:text-gray-600 text-sm leading-relaxed">
              {{ companyBizInfo }}
            </p>
          </a-card>

          <a-card title="股本规模" bordered size="small">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">总股本</span>
                <span class="font-medium">zzz 万股</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">流通股本</span>
                <span class="font-medium">zzz 万股</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">总市值</span>
                <span class="font-medium">zzz 亿元</span>
              </div>
            </div>
          </a-card>

          <a-card title="操作工具" bordered size="small">
            <div class="flex flex-col gap-3">
              <a-button block>财务报表</a-button>
              <a-button block @click="executivesModalVisible = true"
                >高管信息</a-button
              >
              <a-button block>行业对比</a-button>
            </div>
          </a-card>
          <a-modal
            v-model:visible="executivesModalVisible"
            :width="900"
            title="高管信息"
          >
            <!-- 表格 -->
            <a-table
              :columns="executivesColumns"
              :data-source="futuCompanyExecutives?.content?.directorList"
              size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'leaderName'">
                  <a-popover title="高管背景" trigger="click">
                    <template #content>
                      <div class="w-96">
                        {{ futuCompanyExecutiveBg?.content?.briefBackground}}
                      </div>
                    </template>
                    <a @click="queryCompanyExecutiveBg(record.leaderName)">{{
                        record.leaderName
                      }}</a>
                  </a-popover>
                </template>
              </template>
            </a-table>
          </a-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
