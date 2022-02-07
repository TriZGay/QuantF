import {RouterTransitionEnum} from "../../enum/transitionEnum";

export interface TransitionSetting {
    enable: boolean;
    basicTransition: RouterTransitionEnum;
    openPageLoading: boolean;
    openNProgress: boolean;
}
