import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {basicRoutes} from "./routes";

const WHITE_LIST: string[] = [];
const getRoutesNames = (array: any[]) => {
    array.forEach((item) => {
        WHITE_LIST.push(item.name);
        getRoutesNames(item.children || []);
    })
}

getRoutesNames(basicRoutes);

export const router = createRouter({
    history: createWebHistory(),
    routes: basicRoutes as unknown as RouteRecordRaw[],
    strict: true,
    scrollBehavior: () => ({left: 0, top: 0})
})

console.log(router.getRoutes())

export function resetRouter() {
    router.getRoutes().forEach((route) => {
        const {name} = route;
        if (name && !WHITE_LIST.includes(name as string)) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    })
}
