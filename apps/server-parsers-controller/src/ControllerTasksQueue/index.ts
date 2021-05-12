/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueueBigint } from './QueueBigint';
import { Task } from "./types";

export type ControllerTasksQueueItemType = {
  id: bigint;
  result?: any;
} & Task;
export * as ControllerTasksQueueTypes from './types'
export class ControllerTasksQueue {
  #newTasks: ControllerTasksQueueItemType[] = [];
  #inWorkTasks: ControllerTasksQueueItemType[] = [];
  #doneTasks: ControllerTasksQueueItemType[] = [];
  #bigintQueue = new QueueBigint();
  constructor() {
    return;
  }
  add(task: Task): bigint {
    const id = this.#bigintQueue.getNext();
    this.#newTasks.push({ id, ...task });
    return id;
  }
  startNext(): ControllerTasksQueueItemType | null {
    const task = this.#newTasks.shift();
    if (task) {
      this.#inWorkTasks.push(task);
      return task;
    } else return null;
  }
  done(id: bigint, result: any): ControllerTasksQueueItemType | null {
    const task = this.#inWorkTasks.splice(this.#inWorkTasks.findIndex(task => task.id === id), 1)[0];
    if (task) {
      this.#doneTasks.push({ result, ...task })
      return task;
    } else return null;
  }
  getResult(id: bigint): any {
    const index = this.#doneTasks.findIndex(task => task.id === id);
    if (index) {
      const task = this.#doneTasks.splice(index, 1)[0];
      if (task) return task.result;
      else return null;
    } else return null;
  }
  error(id: bigint): ControllerTasksQueueItemType | null {
    const task = this.#inWorkTasks.splice(this.#inWorkTasks.findIndex(task => task.id === id), 1)[0];
    if (task) return task.result;
    else return null;
  }
}