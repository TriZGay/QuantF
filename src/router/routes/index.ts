import type {RouteRecordRaw} from "vue-router";
import {PageEnum} from "../../enum/pageEnum";
import {PAGE_NOT_FOUNT_ROUTE, REDIRECT_ROUTE} from "./basic";

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
