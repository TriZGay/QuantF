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
      icon:"home-filled"
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
      icon:"account-book-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "/market/stockList",
        name: "StockList",
        meta: {
          title: "股票列表",
          icon:"container-filled"
        },
        component: () => import("@/views/market/StockList.vue"),
      },
      {
        path: "/market/futuresList",
        name: "FuturesList",
        meta: {
          title: "期货列表",
          icon:"bank-filled"
        },
        component: () => import("@/views/market/FuturesList.vue"),
      },
    ],
  },
  {
    path: "/operation",
    name: "OperationPage",
    meta: {
      title: "操作中心",
      icon:"bank-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
  },
  {
    path: "/trade",
    name: "TradePage",
    meta: {
      title: "交易",
      icon:"bank-filled"
    },
    component: () => import("@/layouts/Layout.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export { router, routes };
