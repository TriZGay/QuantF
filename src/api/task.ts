import request from "@/utils/request";

export interface TaskRequest {
  jobName: string,
  jobType: "KLINE_RAW_TO_ARC" | "KLINE_REPEAT_CHECK" | "KLINE_ARC_TO_MA"
    | "KLINE_ARC_TO_BOLL" | "KLINE_ARC_TO_EMA" | "KLINE_ARC_TO_MACD"
    | "KLINE_ARC_TO_RSI" | "KLINE_ARC_TO_KDJ",
  jobGroup?: string,
  triggerName?: string,
  triggerGroup?: string,
  cron?: string,
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

export interface AddKLineRaw2ArcTaskRequest extends TaskRequest {
  fromTable: string,
  toTable: string,
  updateTimeStart?: string,
  updateTimeEnd?: string
}

export interface AddKLineRepeatCheckTaskRequest extends TaskRequest {
  table: string;
  startDate?: string;
  endDate?: string;
}

export interface AddKLineTransToMaTaskRequest extends TaskRequest {
  toTableName: string,
  fromTableName: string,
  startDateTime: string,
  endDateTime: string,
}

export interface AddKLineTransToBollTaskRequest extends TaskRequest {
  toTableName: string,
  fromTableName: string,
  startDateTime: string,
  endDateTime: string,
}

export interface AddKLineTransToEmaTaskRequest extends TaskRequest {
  toTableName: string,
  kTableName: string,
  startDateTime: string,
  endDateTime: string,
}

export interface AddKLineTransToMacdTaskRequest extends TaskRequest {
  toTableName: string,
  fromTableName: string,
  startDateTime: string,
  endDateTime: string,
}

export interface AddKLineTransToRsiTaskRequest extends TaskRequest {
  toTableName: string,
  fromTableName: string,
  startDateTime: string,
  endDateTime: string,
}

export interface AddKLineTransToKdjTaskRequest extends TaskRequest {
  toTableName: string,
  fromTableName: string,
  startDateTime: string,
  endDateTime: string,
}

export function fetchAddTask(addTaskRequest: TaskRequest) {
  return request.post<string>("/ana/task/addTask", addTaskRequest);
}

export function fetchTasks() {
  return request.get<TaskResponse>("/ana/task/list");
}

export function fetchDelTask(delRequest: DelTaskRequest) {
  return request.post<string>("/ana/task/del", delRequest);
}
