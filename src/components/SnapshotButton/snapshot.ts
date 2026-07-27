import type { PlateItem, SnapshotCommand } from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();

export function useSnapshot() {
  const requestSnapshot = (market: number, code: string): void => {
    let snapshotCommand: SnapshotCommand = {
      type: "SNAPSHOT",
      securities: [
        {
          market: market,
          code: code,
        },
      ] as PlateItem[],
    };
    sendFtCommandOnNotifyEndPoint(snapshotCommand);
  };
  return {
    requestSnapshot,
  };
}
