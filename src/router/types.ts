import {RouteMeta} from "vue-router";
import {RoleEnum} from "../enum/roleEnum";

export interface MenuTag {
    type?: 'primary' | 'error' | 'warn' | 'success';
    content?: string;
    dot?: boolean;
}

export interface Menu {
    name: string;
    icon?: string;
    path: string;
    paramPath?: string;
    disabled?: boolean;
    children?: Menu[];
    orderNo?: number;
    roles?: RoleEnum[];
    meta?: Partial<RouteMeta>;
    tag?: MenuTag;
    hideMenu?: boolean;
}

export interface MenuModule {
    orderNo?: number;
    menu: Menu;
}
