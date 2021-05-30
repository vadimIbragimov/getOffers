import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class QueueService {
  #newTasks: TaskDto[] = [];
  #workTasks: TaskDto[] = [];
  #endTasks: TaskDto[] = [];
  #taskQueueIndex = 0;
  addTask(addTaskDto: TaskDto) {
    const id = this.#taskQueueIndex++;
    this.#newTasks.push({ ...addTaskDto, id });
    return { id };
  }

  getTaskForParsing() {
    const task = this.#newTasks.shift();
    if (task) {
      this.#workTasks.push(task);
      return task;
    } else return null;
  }

  done({
    id,
    result,
    error,
  }: {
    id: number;
    result: unknown;
    error: TaskDto['error'];
  }) {
    const task = this.#workTasks.splice(
      this.#workTasks.findIndex((task) => task.id === id),
      1,
    )[0];
    if (task) {
      this.#endTasks.push({ ...task, result, error });
      return task;
    } else return null;
  }

  getResult(id: number) {
    const task = this.#endTasks.find((task) => task.id === id);
    if (task) {
      setTimeout(() => {
        this.#endTasks.splice(
          this.#endTasks.findIndex((task) => task.id === id),
          1,
        )[0];
      }, 1000 * 60);

      return { ...task, variables: undefined };
    } else return null;
  }
}
