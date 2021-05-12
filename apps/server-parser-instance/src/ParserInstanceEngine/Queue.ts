import { Task } from "./types";

type CallbackType = (response?: Record<PropertyKey, unknown>, error?: Error) => void;

type QueueItemType = {
  task: Task;
  callback: CallbackType;
}

export class Queue {
  #array: QueueItemType[] = [];
  constructor() {
    return;
  }
  get(): QueueItemType | undefined {
    return this.#array.shift();
  }
  add(task: Task, callback: CallbackType): void {
    this.#array.push({ task, callback });
  }
}