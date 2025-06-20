import {
  createRouter, createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw
} from "vue-router";
import * as process from "node:process";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    icon?: string;
    hidden?: boolean;
    noCache?: boolean;
    affix?: boolean;
    alwaysShow?: boolean;
    closable?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/views/login/Login.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    redirect: "/home",
    component: () => import("@/layouts/Layout.vue"),
    children: [{
      path: "/home",
      name: "Home",
      meta: {
        title: "首页",
        icon: "home-filled",
        closable: false
      },
      component: () => import("@/views/home/Home.vue")
    }]
  },
  {
    path: "/thirdFutu",
    name: "ThirdFutuPage",
    redirect: "/thirdFutu/index",
    meta: {
      title: "第三方-富途",
      icon: "account-book-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/thirdFutu/index",
        name: "FutuIndex",
        meta: {
          title: "概况",
          icon: "laptop-outlined"
        },
        component: () => import("@/views/3rd-ft/Ovr.vue")
      },
      {
        path: "/thirdFutu/sub",
        name: "SubscribePage",
        meta: {
          title: "订阅",
          icon: "bank-filled"
        },
        component: () => import("@/views/3rd-ft/SubscribePage.vue")
      },
      {
        path: "/thirdFutu/filter",
        name: "StockFilterPage",
        meta: {
          title: "自选器",
          icon: "filter-outlined"
        },
        component: () => import("@/views/3rd-ft/MyFilter.vue")
      },
      {
        path: "/thirdFutu/market",
        name: "MartetPage",
        redirect: "/thirdFutu/market/stockList",
        meta: {
          title: "市场",
          icon: "account-book-filled"
        },
        children: [
          {
            path: "/thirdFutu/market/stockList",
            name: "StockList",
            meta: {
              title: "标的物",
              icon: "container-filled"
            },
            component: () => import("@/views/3rd-ft/market/StockList.vue")
          }, {
            path: "/thirdFutu/market/plates",
            name: "PlateList",
            meta: {
              title: "板块",
              icon: "pie-chart-outlined"
            },
            component: () => import("@/views/3rd-ft/market/PlateList.vue")
          }
        ]
      },
      {
        path: "/thirdFutu/trade",
        name: "TradePage",
        redirect: "/thirdFutu/trade/account",
        meta: {
          title: "交易",
          icon: "bank-filled"
        },
        children: [
          {
            path: "/thirdFutu/trade/account",
            name: "AccountPage",
            meta: {
              title: "账户",
              icon: "credit-card-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/AccountPage.vue")
          },
          {
            path: "/thirdFutu/trade/order",
            name: "OrderPage",
            meta: {
              title: "订单",
              icon: "table-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/OrderList.vue")
          }
        ]
      },
      {
        path: "/thirdFutu/realtime",
        name: "RTMonitor",
        redirect: "/thirdFutu/realtime/rtk_min1",
        meta: {
          title: "实时",
          icon: "fund-outlined"
        },
        children: [
          {
            path: "/thirdFutu/realtime/rtk_min1",
            name: "RealTimeKMin1",
            meta: {
              title: "1分钟实时K线图",
              icon: "sliders-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/k/RealTimeKLine.vue")
          },
          {
            path: "/thirdFutu/realtime/rtk_min3",
            name: "RealTimeKMin3",
            meta: {
              title: "3分钟实时K线图",
              icon: "sliders-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/k/RealTimeKLineMin3.vue")
          },
          {
            path: "/thirdFutu/realtime/rtk_min5",
            name: "RealTimeKMin5",
            meta: {
              title: "5分钟实时K线图",
              icon: "sliders-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/k/RealTimeKLineMin5.vue")
          },
          {
            path: "/thirdFutu/realtime/rtk_min15",
            name: "RealTimeKMin15",
            meta: {
              title: "15分钟实时K线图",
              icon: "sliders-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/k/RealTimeKLineMin15.vue")
          },
          {
            path: "/thirdFutu/realtime/rtk_min30",
            name: "RealTimeKMin30",
            meta: {
              title: "30分钟实时K线图",
              icon: "sliders-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/k/RealTimeKLineMin30.vue")
          },
          {
            path: "/thirdFutu/realtime/rtk_min60",
            name: "RealTimeKMin60",
            meta: {
              title: "60分钟实时K线图",
              icon: "sliders-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/k/RealTimeKLineMin60.vue")
          },
          {
            path: "/thirdFutu/realtime/rto",
            name: "RealTimeBaseQuote",
            meta: {
              title: "实时报价",
              icon: "area-chart-outlined"
            },
            component: () => import("@/views/3rd-ft/trade/RealTimeBaseQuote.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/thirdItick",
    name: "ThirdItickPage",
    redirect: "/thirdFutu/products",
    meta: {
      title: "第三方-Itick",
      icon: "account-book-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/thirdFutu/products",
        name: "ProductList",
        meta: {
          title: "标的清单",
          icon: "container-filled"
        },
        component: () => import("@/views/3rd-itick/ProductList.vue")
      }
    ]
  },
  {
    path: "/operation",
    name: "OperationPage",
    redirect: "/operation/sync",
    meta: {
      title: "操作中心",
      icon: "bank-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/operation/cleaning",
        name: "DataClean",
        meta: {
          title: "数据清洗",
          icon: "bg-colors-outlined"
        },
        component: () => import("@/views/operation/DataCleaning.vue")
      }
    ]
  },
  {
    path: "/analyze",
    name: "AnalyzeData",
    meta: {
      title: "统计分析",
      icon: "stock-outlined"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [{
      path: "/analyze/k",
      name: "KLineAnalyze",
      meta: {
        title: "K线",
        icon: "sliders-outlined"
      },
      component: () => import("@/views/analyze/K.vue")
    }, {
      path: "/analyze/strategy",
      name: "StrategyAnalyze",
      meta: {
        title: "策略",
        icon: "code-sandbox-outlined"
      },
      component: () => import("@/views/analyze/Strategy.vue")
    }]
  }
];

const router = createRouter({
  history: process.env.NODE_ENV === "development" ? createWebHashHistory(import.meta.env.BASE_URL) :
    createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

export { router, routes };
