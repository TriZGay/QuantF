import request from "@/utils/request";

export interface AddKLineRaw2ArcTaskRequest {
  jobName: string,
  jobGroup?: string,
  triggerName?: string,
  triggerGroup?: string,
  cron?: string,
  fromTable:string,
  toTable: string,
  updateTimeStart?: string,
  updateTimeEnd?: string
}

export function fetchAddKLineRaw2ArcTask(addRequest: AddKLineRaw2ArcTaskRequest) {
  return request.post<string>("/ana/task/addKLineRaw2ArcTask", addRequest);
}

