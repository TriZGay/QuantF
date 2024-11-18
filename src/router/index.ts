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
    path: "/market",
    name: "MartetPage",
    redirect: "/market/stockList",
    meta: {
      title: "市场",
      icon: "account-book-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/market/stockList",
        name: "StockList",
        meta: {
          title: "正股",
          icon: "container-filled"
        },
        component: () => import("@/views/market/StockList.vue")
      },
      {
        path: "/market/futuresList",
        name: "FuturesList",
        meta: {
          title: "期货",
          icon: "bank-filled"
        },
        component: () => import("@/views/market/FuturesList.vue")
      },
      {
        path: "/market/indies",
        name: "IndexList",
        meta: {
          title: "指数",
          icon: "line-chart-outlined"
        },
        component: () => import("@/views/market/Indies.vue")
      }, {
        path: "/market/bond",
        name: "BondList",
        meta: {
          title: "债券",
          icon: "audit-outlined"
        },
        component: () => import("@/views/market/Bond.vue")
      }, {
        path: "/market/warrant",
        name: "WarrantList",
        meta: {
          title: "窝轮",
          icon: "chrome-outlined"
        },
        component: () => import("@/views/market/Warrant.vue")
      }, {
        path: "/market/plates",
        name: "PlateList",
        meta: {
          title: "板块",
          icon: "pie-chart-outlined"
        },
        component: () => import("@/views/market/PlateList.vue")
      }
    ]
  },
  {
    path: "/operation",
    name: "OperationPage",
    meta: {
      title: "操作中心",
      icon: "bank-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/operation/sync",
        name: "SyncCenter",
        meta: {
          title: "数据同步",
          icon: "tool-outlined",
          noCache: true
        },
        component: () => import("@/views/operation/SyncCenter.vue")
      }
    ]
  },
  {
    path: "/trade",
    name: "TradePage",
    redirect: "/trade/rtk",
    meta: {
      title: "交易",
      icon: "bank-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/trade/account",
        name: "AccountPage",
        meta: {
          title: "账户管理",
          icon: "credit-card-outlined"
        },
        component: () => import("@/views/trade/AccountPage.vue")
      },
      {
        path: "/trade/position",
        name: "PositionPage",
        meta: {
          title: "持仓管理",
          icon: "table-outlined"
        },
        component: () => import("@/views/trade/PositionPage.vue")
      },
      {
        path: "/trade/sub",
        name: "SubscribePage",
        meta: {
          title: "富途订阅",
          icon: "bank-filled"
        },
        component: () => import("@/views/trade/SubscribePage.vue")
      }
    ]
  },
  {
    path: "/realtime",
    meta: {
      title: "实时",
      icon: "fund-outlined"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/realtime/rtk_min1",
        name: "RealTimeKMin1",
        meta: {
          title: "1分钟实时K线图",
          icon: "sliders-outlined"
        },
        component: () => import("@/views/trade/k/RealTimeKLine.vue")
      },
      {
        path: "/realtime/rtk_min3",
        name: "RealTimeKMin3",
        meta: {
          title: "3分钟实时K线图",
          icon: "sliders-outlined"
        },
        component: () => import("@/views/trade/k/RealTimeKLineMin3.vue")
      },
      {
        path: "/realtime/rtk_min5",
        name: "RealTimeKMin5",
        meta: {
          title: "5分钟实时K线图",
          icon: "sliders-outlined"
        },
        component: () => import("@/views/trade/k/RealTimeKLineMin5.vue")
      },
      {
        path: "/realtime/rtk_min15",
        name: "RealTimeKMin15",
        meta: {
          title: "15分钟实时K线图",
          icon: "sliders-outlined"
        },
        component: () => import("@/views/trade/k/RealTimeKLineMin15.vue")
      },
      {
        path: "/realtime/rtk_min30",
        name: "RealTimeKMin30",
        meta: {
          title: "30分钟实时K线图",
          icon: "sliders-outlined"
        },
        component: () => import("@/views/trade/k/RealTimeKLineMin30.vue")
      },
      {
        path: "/realtime/rtk_min60",
        name: "RealTimeKMin60",
        meta: {
          title: "60分钟实时K线图",
          icon: "sliders-outlined"
        },
        component: () => import("@/views/trade/k/RealTimeKLineMin60.vue")
      },
      {
        path: "/realtime/rto",
        name: "RealTimeBaseQuote",
        meta: {
          title: "实时报价",
          icon: "area-chart-outlined"
        },
        component: () => import("@/views/trade/RealTimeBaseQuote.vue")
      }
    ]
  },
  {
    path: "/analyze",
    meta: {
      title: "统计分析",
      icon: "stock-outlined"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [{
      path: "/analyze/k",
      meta: {
        title: "K线",
        icon: "sliders-outlined"
      },
      component: () => import("@/views/analyze/K.vue")
    }, {
      path: "/analyze/strategy",
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
