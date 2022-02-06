import type {RouteRecordRaw} from "vue-router";
import {PageEnum} from "../../enum/pageEnum";
import {PAGE_NOT_FOUNT_ROUTE, REDIRECT_ROUTE} from "./basic";

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
})

export const asyncRoutes = [PAGE_NOT_FOUNT_ROUTE, ...routeModuleList];

export const RootRoute: RouteRecordRaw = {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_HOME,
    meta: {
        title: 'Root'
    }
}

export const basicRoutes = [
    RootRoute,
    REDIRECT_ROUTE,
    PAGE_NOT_FOUNT_ROUTE
]
