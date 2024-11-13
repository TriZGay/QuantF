import { onMounted, onBeforeMount, onBeforeUnmount, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useRoute } from "vue-router";
const { body } = document;
const WIDTH = 992;

export default function useResize() {
  const route = useRoute();

  watch(
    () => route.path,
    (newRoute, oldRoute) => {
      console.log(newRoute, oldRoute);
      // if (this.device === 'mobile' && this.sidebar.opened) {
      // store.dispatch('app/closeSideBar', { withoutAnimation: false })
      //   }
    }
  );

  onBeforeMount(() => {
    window.addEventListener("resize", resizeHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler);
  });

  onMounted(() => {
    const is_mobile = isMobile();
    const { toggleDevice, closeSideBar } = useAppStore();
    if (is_mobile) {
      toggleDevice("mobile");
      closeSideBar(false);
    }
  });

  function isMobile() {
    const rect = body.getBoundingClientRect();
    return rect.width - 1 < WIDTH;
  }
  function resizeHandler() {
    const { toggleDevice, closeSideBar } = useAppStore();
    if (!document.hidden) {
      const is_Mobile = isMobile();
      toggleDevice(is_Mobile ? "mobile" : "desktop");
      if (is_Mobile) {
        closeSideBar(false);
      }
    }
  }
}
