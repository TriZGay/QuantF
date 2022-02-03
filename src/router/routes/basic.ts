import {
    REDIRECT_NAME,
    EXCEPTION_COMPONENT,
    PAGE_NOT_FOUND_NAME,
    LAYOUT
} from "../constant";
import type{RouteRecordRaw} from "vue-router";

export const PAGE_NOT_FOUNT_ROUTE: RouteRecordRaw = {
    path: '/:path(.*)*',
    name: PAGE_NOT_FOUND_NAME,
    component: LAYOUT,
    meta: {
        title: 'ErrorPage'
    },
    children: [{
        path: '/:path(.*)*',
        name: PAGE_NOT_FOUND_NAME,
        component: EXCEPTION_COMPONENT,
        meta: {
            title: 'ErrorPage'
        }
    }]
}

export const REDIRECT_ROUTE: RouteRecordRaw = {
    path: '/redirect',
    name: 'RedirectTo',
    component: LAYOUT,
    meta: {
        title: REDIRECT_NAME
    },
    children: [{
        path: '/redirect/:path(.*)*',
        name: REDIRECT_NAME,
        component: () => import('../../pages/sys/redirect/index.vue'),
        meta: {
            title: REDIRECT_NAME
        }
    }]
}

export const ERROR_LOG_ROUTE: RouteRecordRaw = {
    path: '/error-log',
    name: 'ErrorLog',
    component: LAYOUT,
    redirect: '/error-log/list',
    meta: {
        title: 'ErrorLog'
    },
    children: [{
        path: 'list',
        name: 'ErrorLogList',
        component: () => import('../../pages/sys/error-log/index.vue'),
        meta: {
            title: 'ErrorLogList'
        }
    }]
}
