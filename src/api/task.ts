import request from "@/utils/request";

export interface AddKLineRaw2ArcTaskRequest {
  jobName: string,
  jobGroup?: string,
  triggerName?: string,
  triggerGroup?: string,
  cron?: string,
  fromTable: string,
  toTable: string,
  updateTimeStart?: string,
  updateTimeEnd?: string
}

export interface TaskResponse {
  jobGroup: string,
  jobName: string,
  triggerName: string,
  triggerGroup: string,
  cron: string,
  state: string,
  jobDataMap: string,
  nextFireTime: Date
}

export interface DelTaskRequest {
  jobName: string,
}

export function fetchAddKLineRaw2ArcTask(addRequest: AddKLineRaw2ArcTaskRequest) {
  return request.post<string>("/ana/task/addKLineRaw2ArcTask", addRequest);
}

export function fetchTasks() {
  return request.get<TaskResponse>("/ana/task/list");
}

export function fetchDelTask(delRequest: DelTaskRequest) {
  return request.post<string>("/ana/task/del", delRequest);
}
