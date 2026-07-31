<script setup>
import { marketTypeToSelectOptions } from "@/api/code";
import { onMounted, ref, watch } from "vue";
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import { useFutuStomp } from "@/stores/futu-stomp";

const { queryStocks } = useFutuApi();
const { stocks } = storeToRefs(useFutuApi());

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const {
  futuCompanyProfile,
  futuCompanyExecutives,
  futuCompanyExecutiveBg,
  futuCompanyOpEff,
  futuCoActionsDividend,
  futuCoActionsBuyBack,
} = storeToRefs(useFutuStomp());

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
  queryCompanyOpEff(market, code);
  queryCoActionsDividend(market, code);
  queryCoActionsBuyback(market, code);
};

const coActionsBuybackVisible = ref(false);
const coActionsBuybackHkColumns = ref([
  { title: "公告日", dataIndex: "publDateStr", width: 120 },
  { title: "回购截止日", dataIndex: "endDateStr", width: 100 },
  { title: "回购金额", dataIndex: "buyBackMoney", width: 100 },
  { title: "回购股数(股)", dataIndex: "buyBackSum", width: 100 },
  { title: "占已发行股份百分比(%)", dataIndex: "percentage", width: 200 },
  { title: "最高回购价", dataIndex: "highPrice", width: 100 },
  { title: "最低回购价", dataIndex: "lowPrice", width: 100 },
  { title: "本轮累计回购股数(股)", dataIndex: "cumulativeSum", width: 200 },
  {
    title: "本轮累计回购占总股本百分比(%)",
    dataIndex: "cumulativePercentage",
    width: 220,
  },
  { title: "股份类别", dataIndex: "shareType", width: 100 },
]);
const queryCoActionsBuyback = (market, code) => {
  let command = {
    type: "CO_ACTIONS_BUYBACK",
    market: market,
    code: code,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

const coActionsDividendVisible = ref(false);
const coActionsDividendColumns = ref([
  { title: "公告日", dataIndex: "pubDate", width: 120 },
  { title: "分配方案描述", dataIndex: "statement", width: 100 },
  { title: "事件进展", dataIndex: "process", width: 100 },
  { title: "股权登记日", dataIndex: "recordDate", width: 100 },
  { title: "除权除息日", dataIndex: "exDate", width: 100 },
  { title: "派息日", dataIndex: "dividendPayableDate", width: 100 },
  { title: "财政年度", dataIndex: "fiscalYear", width: 100 },
]);
const queryCoActionsDividend = (market, code) => {
  let command = {
    type: "CO_ACTIONS_DIVIDEND",
    market: market,
    code: code,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

const companyOpEffVisible = ref(false);
const companyOpEffColumns = ref([
  { title: "财务年度", dataIndex: "fiscalYear", width: 120 },
  { title: "财报类型", dataIndex: "financialTypeStr", width: 120 },
  { title: "财报周期", dataIndex: "periodText", width: 100 },
  { title: "截止日", dataIndex: "endDateStr", width: 150 },
  { title: "员工人数", dataIndex: "employeeNum", width: 100 },
  { title: "员工人数同比增长率(%)", dataIndex: "employeeNumYoy", width: 220 },
  { title: "人均营收", dataIndex: "incomePerCapita", width: 100 },
  {
    title: "人均营收同比增长率(%)",
    dataIndex: "incomePerCapitaYoy",
    width: 220,
  },
  { title: "人均营业利润", dataIndex: "fiscalYear", width: 100 },
  {
    title: "人均营业利润同比增长率(%)",
    dataIndex: "profitPerCapitaYoy",
    width: 220,
  },
  { title: "人均净利润", dataIndex: "netProfitPerCapita", width: 100 },
  {
    title: "人均净利润同比增长率(%)",
    dataIndex: "netProfitPerCapitaYoy",
    width: 220,
  },
]);
const queryCompanyOpEff = (market, code) => {
  let command = {
    type: "COMPANY_OP_EFFICIENCY",
    market: market,
    code: code,
  };
  sendFtCommandOnNotifyEndPoint(command);
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
      <a-card bordered>
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
              <a-button block @click="executivesModalVisible = true">
                高管信息
              </a-button>
              <a-button block @click="companyOpEffVisible = true">
                经营效率
              </a-button>
              <a-button block @click="coActionsDividendVisible = true">
                分红派息
              </a-button>
              <a-button block @click="coActionsBuybackVisible = true"
                >回购</a-button
              >
            </div>
          </a-card>
          <a-modal
            v-model:visible="coActionsBuybackVisible"
            :width="900"
            title="回购"
          >
            <!--            todo big a buyback-->
            <span>NextKey:{{ futuCoActionsBuyBack?.content?.nextKey }}</span>
            <a-table
              :columns="coActionsBuybackHkColumns"
              :data-source="futuCoActionsBuyBack?.content?.hkBuyBackList"
              size="small"
              :scroll="{ x: 1500 }"
            />
          </a-modal>
          <a-modal
            v-model:visible="coActionsDividendVisible"
            :width="900"
            title="分红派息"
          >
            <a-table
              :columns="coActionsDividendColumns"
              :data-source="futuCoActionsDividend?.contents"
              size="small"
            />
          </a-modal>
          <a-modal
            v-model:visible="companyOpEffVisible"
            :width="900"
            title="经营效率"
          >
            <span>NextKey:{{ futuCompanyOpEff?.content?.nextKey }}</span>
            <a-table
              :columns="companyOpEffColumns"
              :data-source="futuCompanyOpEff?.content?.itemList"
              size="small"
              :scroll="{ x: 1800 }"
            />
          </a-modal>
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
                        {{ futuCompanyExecutiveBg?.content?.briefBackground }}
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
