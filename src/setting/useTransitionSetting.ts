import {TransitionSetting} from "../layouts/page/types";
import {RouterTransitionEnum} from "../enum/transitionEnum";

export function useTransitionSetting() {
    const transitionSetting: TransitionSetting = {
        enable: true,
        basicTransition: RouterTransitionEnum.FADE,
        openPageLoading: true,
        openNProgress: true
    }

    const getEnableTransition = transitionSetting.enable;
    const getBasicTransition = transitionSetting.basicTransition;
    const getOpenPageLoading = transitionSetting.openPageLoading;
    const getOpenNProgress = transitionSetting.openNProgress;

    return {
        getEnableTransition,
        getBasicTransition,
        getOpenPageLoading,
        getOpenNProgress
    }
}
