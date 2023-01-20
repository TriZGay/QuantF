import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";

export interface SideBar {
  opened: boolean;
  withoutAnimation: boolean;
}

const SIDE_BAR_KEY = "sidebarStatus";
const SIZE_KEY = "size";

export const useAppStore = defineStore("app", () => {
  const sidebar = ref<SideBar>({
    opened: Cookies.get(SIDE_BAR_KEY) ? !!Cookies.get(SIDE_BAR_KEY) : true,
    withoutAnimation: false,
  });
  const device = ref<string>("desktop");
  const size = ref<string>(Cookies.get(SIZE_KEY) || "medium");

  function toggleSideBar() {
    sidebar.value.opened = !sidebar.value.opened;
    sidebar.value.withoutAnimation = false;
    if (sidebar.value.opened) {
      Cookies.set(SIDE_BAR_KEY, "1");
    } else {
      Cookies.set(SIDE_BAR_KEY, "0");
    }
  }

  function closeSideBar(withoutAnimation: boolean) {
    Cookies.set(SIDE_BAR_KEY, "0");
    sidebar.value.opened = false;
    sidebar.value.withoutAnimation = withoutAnimation;
  }

  function toggleDevice(_device: string) {
    device.value = _device;
  }

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
