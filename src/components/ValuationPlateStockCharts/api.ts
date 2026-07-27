import type { ValuePlateStockListCommand } from "@/types/message.d";
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";

const { futuValuationPlateStockList } = storeToRefs(useFutuStomp());
const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();

export function useValuationPlateStock() {
  const requestValuationPlateStockList = (
    market: number,
    code: string,
    num: number = 10
  ) => {
    let command: ValuePlateStockListCommand = {
      type: "VALUATION_P_S_LIST",
      market: market,
      code: code,
      num: num,
    };
    sendFtCommandOnNotifyEndPoint(command);
  };

  return {
    futuValuationPlateStockList,
    requestValuationPlateStockList,
  };
}
