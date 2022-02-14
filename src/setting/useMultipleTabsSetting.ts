import {MultiTabsSetting} from "../layouts/default/multiTabs/types";

export function useMultipleTabsSetting() {
    const multipleTabsSetting: MultiTabsSetting = {
        cache: true,
        show: true,
        showQuick: true,
        canDrag: true,
        showRedo: true,
        showFold: true
    }
    const getShowMultipleTab = multipleTabsSetting.show;
    const getShowQuick = multipleTabsSetting.showQuick;
    const getShowRedo = multipleTabsSetting.showRedo;
    const getShowFold = multipleTabsSetting.showFold;
    const getIsCache = multipleTabsSetting.cache;
    const getCanDrag = multipleTabsSetting.canDrag;
    return {
        getShowMultipleTab,
        getShowQuick,
        getShowRedo,
        getShowFold,
        getIsCache,
        getCanDrag
    }
}
