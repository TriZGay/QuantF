import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    icon?: string;
    hidden?: boolean;
    noCache?: boolean;
    affix?: boolean;
    alwaysShow?: boolean;
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
    meta: {
      title: "首页",
      icon: "home-filled"
    },
    children: [{
      path: "/home",
      name: "Home",
      component: () => import("@/views/home/Home.vue"),
    }],
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
          title: "股票",
          icon: "container-filled"
        },
        component: () => import("@/views/market/StockList.vue"),
      },
      {
        path: "/market/futuresList",
        name: "FuturesList",
        meta: {
          title: "期货",
          icon: "bank-filled"
        },
        component: () => import("@/views/market/FuturesList.vue"),
      },
      {
        path: "/market/indies",
        name: "IndexList",
        meta: {
          title: "指数",
          icon: "line-chart-outlined"
        },
        component: () => import("@/views/market/Indies.vue")
      }
    ],
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
          icon: "tool-outlined"
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
    redirect:"/realtime/rtk",
    meta: {
      title: "实时",
      icon:"fund-outlined"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/realtime/rtk",
        name: "RealTimeK",
        meta: {
          title: "实时K线图",
          icon: "sliders-outlined"
        },
        component: () => import("@/views/trade/RealTimeKLine.vue")
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
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export { router, routes };
