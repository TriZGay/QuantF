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
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "home",
        name: "Home",
        meta: {
          title: "首页",
        },
        component: () => import("@/views/home/Home.vue"),
      },
    ],
  },
  {
    path: "/market",
    name: "MartetPage",
    meta: {
      title: "市场",
      showSideBar: true,
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "list",
        name: "StockList",
        meta: {
          title: "股票列表",
        },
        component: () => import("@/views/stock/StockList.vue"),
      },
    ],
  },
  {
    path: "/operation",
    name: "OperationPage",
    meta: {
      title: "操作中心",
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [],
  },
  {
    path: "/trade",
    name: "TradePage",
    meta: {
      title: "交易",
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export { router, routes };
