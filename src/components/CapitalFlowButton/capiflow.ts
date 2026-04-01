import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import type { CapitalFlowCommand } from "@/types/message";
import { computed } from "vue";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuCapitalFlow } = storeToRefs(useFutuStomp());
export function useCapitalFlow() {
  const sendCapitalFlowCommand = (
    market: number,
    code: string,
    periodType: number,
    beginTime: string,
    endTime: string
  ) => {
    let capitalFlowCommand: CapitalFlowCommand = {
      type: "CAPITAL_FLOW",
      security: {
        market: market,
        code: code,
      },
      periodType: periodType,
      beginTime: beginTime,
      endTime: endTime,
    };
    sendFtCommandOnNotifyEndPoint(capitalFlowCommand);
  };
  const capitalFlow = computed(() => {
    return futuCapitalFlow.value?.contentList;
  });
  return {
    capitalFlow,
    sendCapitalFlowCommand,
  };
}
