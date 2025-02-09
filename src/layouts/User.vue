<script setup lang="ts">
import { DisconnectOutlined, LinkOutlined, UserOutlined } from "@ant-design/icons-vue";
import { onMounted, onUnmounted } from "vue";
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";

const {
  connectToNotifyEndPoint,
  closeFtStompNotifyConn
} = useFutuStomp();
const futuStompStore = useFutuStomp();
const { futuStompNotifyClientStatus } = storeToRefs(futuStompStore);
onMounted(() => {
  connectToNotifyEndPoint();
});

onUnmounted(() => {
  closeFtStompNotifyConn();
});

</script>
<template>
  <a-dropdown>
    <a-avatar>
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <a>祝你发大财</a>
        </a-menu-item>
        <a-menu-item title="FUTU-STOMP状态">
          <LinkOutlined v-if="futuStompNotifyClientStatus" />
          <DisconnectOutlined v-else />
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<style lang="less" scoped></style>
