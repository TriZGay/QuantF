import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import Cookies from "js-cookie";

export interface SideBar {
  collapsed: boolean;
  withoutAnimation: boolean;
}

const SIDE_BAR_KEY = "sidebarStatus";
const SIZE_KEY = "size";

export const useAppStore = defineStore("app", () => {
  const sidebar = ref<SideBar>({
    collapsed: Cookies.get(SIDE_BAR_KEY) === '1' ? true : false,
    withoutAnimation: false,
  });
  const device = ref<string>("desktop");
  const size = ref<string>(Cookies.get(SIZE_KEY) || "medium");

  function toggleSideBar(collapsed: boolean) {
    sidebar.value.collapsed = collapsed;
    if (collapsed) {
      Cookies.set(SIDE_BAR_KEY, "1");
    } else {
      Cookies.set(SIDE_BAR_KEY, "0");
    }
  }

  //todo
  function closeSideBar(withoutAnimation: boolean) {
    Cookies.set(SIDE_BAR_KEY, "0");
    sidebar.value.collapsed = false;
    sidebar.value.withoutAnimation = withoutAnimation;
  }
  //todo
  function toggleDevice(_device: string) {
    device.value = _device;
  }
  //todo
  function setSize(_size: string) {
    size.value = _size;
  }

  return {
    sidebar,
    device,
    size,
    toggleSideBar,
    closeSideBar,
    toggleDevice,
    setSize,
  };
});
