import type { AxiosResponse } from "axios";

export function isAll200(responses: Array<AxiosResponse<any, any>>): boolean {
  for (let i = 0; i < responses.length; i++) {
    if (responses[i].status !== 200) {
      return false;
    }
  }
  return true;
}
