import {RouteLocationNormalized, RouteLocationRaw, Router} from "vue-router";
import {useMultipleTabsSetting} from "../setting/useMultipleTabsSetting";
import {defineStore} from "pinia";
import {Persistent} from "../utils/cache/persistent";
import {MULTIPLE_TABS_KEY} from "../enum/cacheEnum";
import {getRawRoute} from "../utils";
import {toRaw, unref} from "vue";
import {useGo, useRedo} from "../layouts/page/usePage";
import {PageEnum} from "../enum/pageEnum";
import {PAGE_NOT_FOUNT_ROUTE, REDIRECT_ROUTE} from "../router/routes/basic";

export interface MultipleTabState {
    cacheTabList: Set<string>;
    tabList: RouteLocationNormalized[];
    lastDragEndIndex: number;
}

function handleGotoPage(router: Router) {
    const go = useGo(router);
    go(unref(router.currentRoute).path, true);
}

const getToTarget = (tabItem: RouteLocationNormalized) => {
    const {params, path, query} = tabItem;
    return {
        params: params || {},
        path,
        query: query || {},
    };
};

const cacheTab = useMultipleTabsSetting().getIsCache;

export const useMultipleTabStore = defineStore({
    id: 'app-multiple-tab',
    state: (): MultipleTabState => ({
        cacheTabList: new Set(),
        tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
        lastDragEndIndex: 0
    }),
    getters: {
        getTabList(): RouteLocationNormalized[] {
            // @ts-ignore
            return this.tabList;
        },
        getCachedTabList(): string[] {
            return Array.from(this.cacheTabList);
        },
        getLastDragEndIndex(): number {
            return this.lastDragEndIndex;
        }
    },
    actions: {
        async updateCacheTab() {
            const cacheMap: Set<string> = new Set<string>();
            for (const tab of this.tabList) {
                // @ts-ignore
                const item = getRawRoute(tab);
                const needCache = !item.meta?.ignoreKeepAlive;
                if (!needCache) {
                    continue;
                }
                const name = item.name as string;
                cacheMap.add(name);
            }
            this.cacheTabList = cacheMap;
        },

        async refreshPage(router: Router) {
            const {currentRoute} = router;
            const route = unref(currentRoute);
            const name = route.name;
            const findTab = this.getCachedTabList.find(item => item === name);
            if (findTab) {
                this.cacheTabList.delete(findTab);
            }
            const redo = useRedo(router);
            await redo();
        },

        clearCacheTabs(): void {
            this.cacheTabList = new Set();
        },

        resetState(): void {
            this.tabList = [];
            this.clearCacheTabs();
        },

        goToPage(router: Router) {
            const go = useGo(router);
            const len = this.tabList.length;
            const {path} = unref(router.currentRoute);
            let toPath: PageEnum | string = PageEnum.BASE_HOME;
            if (len > 0) {
                const page = this.tabList[len - 1];
                const p = page.fullPath || page.path;
                if (p) {
                    toPath = p;
                }
            }
            path !== toPath && go(toPath as PageEnum, true);
        },

        async addTab(route: RouteLocationNormalized) {
            const {path, name, fullPath, params, query, meta} = getRawRoute(route);
            if (path === PageEnum.ERROR_PAGE || path === PageEnum.BASE_LOGIN || !name
                || [REDIRECT_ROUTE.name, PAGE_NOT_FOUNT_ROUTE.name].includes(name as string)) {
                return;
            }
            let updateIndex = -1;

            const tabHasExists = this.tabList.some((tab, index) => {
                updateIndex = index;
                return (tab.fullPath || tab.path) === (fullPath || path);
            })

            if (tabHasExists) {
                const curTab = toRaw(this.tabList)[updateIndex];
                if (!curTab) {
                    return;
                }
                curTab.params = params || curTab.params;
                curTab.query = query || curTab.query;
                curTab.fullPath = fullPath || curTab.fullPath;
                this.tabList.splice(updateIndex, 1, curTab);
            } else {
                //???????????????????????????,??????0??????????????????????????????
                const dynamicLevel = meta?.dynamicLevel ?? -1;
                // @ts-ignore
                if (dynamicLevel > 0) {
                    // ?????????????????????????????? 0 ??????????????????????????????????????????????????????
                    const realPath = meta?.realPath ?? '';
                    // ???????????????????????????????????????, ??????????????????????????????
                    //@ts-ignore
                    if (this.tabList.filter((e) => e.meta?.realPath ?? '' === realPath).length >= dynamicLevel) {
                        const index = this.tabList.findIndex((item) => item.meta.realPath === realPath);
                        index !== -1 && this.tabList.splice(index, 1);
                    }
                }
                this.tabList.push(route);
            }
            this.updateCacheTab();
            // @ts-ignore
            cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, this.tabList);
        },

        async closeTab(tab: RouteLocationNormalized, router: Router) {
            const close = (route: RouteLocationNormalized) => {
                const {fullPath, meta: {affix} = {}} = route;
                if (affix) {
                    return;
                }
                const index = this.tabList.findIndex((item) => item.fullPath === fullPath);
                index !== -1 && this.tabList.splice(index, 1);
            };

            const {currentRoute, replace} = router;
            const {path} = unref(currentRoute);
            if (path !== tab.path) {
                close(tab)
                return;
            }
            let toTarget: RouteLocationRaw = {};
            const index = this.tabList.findIndex((item) => item.path === path);
            if (index === 0) {
                //????????????tab
                if (this.tabList.length === 1) {
                    toTarget = PageEnum.BASE_HOME;
                } else {
                    const page = this.tabList[index + 1];
                    //@ts-ignore
                    toTarget = getToTarget(page);
                }
            } else {
                const page = this.tabList[index - 1];
                // @ts-ignore
                toTarget = getToTarget(page);
            }
            await replace(toTarget);
        },

        async closeTabByKey(key: string, router: Router) {
            const index = this.tabList.findIndex((item) => (item.fullPath || item.path) === key);
            if (index !== -1) {
                //@ts-ignore
                await this.closeTab(this.tabList[index], router);
                const {currentRoute, replace} = router;
                // ?????????????????????????????????tabList???
                const isActivated = this.tabList.findIndex((item) => {
                    return item.fullPath === currentRoute.value.fullPath;
                });
                // ??????????????????????????????TabList?????????????????????????????????
                if (isActivated === -1) {
                    let pageIndex;
                    if (index > 0) {
                        pageIndex = index - 1;
                    } else if (index < this.tabList.length - 1) {
                        pageIndex = index + 1;
                    } else {
                        pageIndex = -1;
                    }
                    if (pageIndex >= 0) {
                        const page = this.tabList[index - 1];
                        //@ts-ignore
                        const toTarget = getToTarget(page);
                        await replace(toTarget)
                    }
                }
            }
        },

        async sortTabs(oldIndex: number, newIndex: number) {
            const currentTab = this.tabList[oldIndex];
            this.tabList.splice(oldIndex, 1);
            this.tabList.splice(newIndex, 0, currentTab);
            this.lastDragEndIndex = this.lastDragEndIndex + 1;
        },

        async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
            const index = this.tabList.findIndex((item) => item.path === route.path);

            if (index > 0) {
                const leftTabs = this.tabList.slice(0, index);
                const pathList: string[] = [];
                for (const item of leftTabs) {
                    const affix = item?.meta?.affix ?? false;
                    if (!affix) {
                        pathList.push(item.fullPath);
                    }
                }
                this.bulkCloseTabs(pathList);
            }
            this.updateCacheTab();
            handleGotoPage(router);
        },

        async closeRightTabs(route: RouteLocationNormalized, router: Router) {
            const index = this.tabList.findIndex((item) => item.fullPath === route.fullPath);

            if (index >= 0 && index < this.tabList.length - 1) {
                const rightTabs = this.tabList.slice(index + 1, this.tabList.length);

                const pathList: string[] = [];
                for (const item of rightTabs) {
                    const affix = item?.meta?.affix ?? false;
                    if (!affix) {
                        pathList.push(item.fullPath);
                    }
                }
                this.bulkCloseTabs(pathList);
            }
            this.updateCacheTab();
            handleGotoPage(router);
        },

        async closeAllTab(router: Router) {
            this.tabList = this.tabList.filter((item) => item?.meta?.affix ?? false);
            this.clearCacheTabs();
            this.goToPage(router)
        },

        async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
            const closePathList = this.tabList.map((item) => item.fullPath);

            const pathList: string[] = [];

            for (const path of closePathList) {
                if (path !== route.fullPath) {
                    const closeItem = this.tabList.find((item) => item.path === path);
                    if (!closeItem) {
                        continue;
                    }
                    const affix = closeItem?.meta?.affix ?? false;
                    if (!affix) {
                        pathList.push(closeItem.fullPath);
                    }
                }
            }
            this.bulkCloseTabs(pathList);
            this.updateCacheTab();
            handleGotoPage(router);
        },

        async bulkCloseTabs(pathList: string[]) {
            this.tabList = this.tabList.filter((item) => !pathList.includes(item.fullPath));
        },

        async setTabTitle(title: string, route: RouteLocationNormalized) {
            const findTab = this.getTabList.find((item) => item === route);
            if (findTab) {
                findTab.meta.title = title;
                await this.updateCacheTab();
            }
        },

        async updateTabPath(fullPath: string, route: RouteLocationNormalized) {
            const findTab = this.getTabList.find((item) => item === route);
            if (findTab) {
                findTab.fullPath = fullPath;
                findTab.path = fullPath;
                await this.updateCacheTab();
            }
        }
    }
});
