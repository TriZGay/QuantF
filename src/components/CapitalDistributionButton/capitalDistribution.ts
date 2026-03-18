import { useFutuStomp } from "@/stores/futu-stomp";
import type { CapitalDistributionCommand } from "@/types/message";
import type { Stock } from "@/api/futu";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuCapitalDistribution } = storeToRefs(useFutuStomp());

export function useCapitalDistribution() {
  const sendCapitalDistributionCommand = (
    row: Pick<Stock, "marketCode" | "code">
  ) => {
    let capitalDistributionCommand: CapitalDistributionCommand = {
      type: "CAPITAL_DISTRIBUTION",
      security: {
        market: row.marketCode,
        code: row.code,
      },
    };
    sendFtCommandOnNotifyEndPoint(capitalDistributionCommand);
  };
  const capitalDistribution = computed(
    () => futuCapitalDistribution.value?.content
  );
  return {
    capitalDistribution,
    sendCapitalDistributionCommand,
  };
}
