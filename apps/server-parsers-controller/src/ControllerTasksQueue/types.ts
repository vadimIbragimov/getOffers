export type TaskBody = {
  url?: string;
  service: string;
  funcName?: string;
  variables?: unknown;
};

export type Task = {
  timeout?: number;
  taskBody: TaskBody;
};
