import { Task } from "../ParserInstanceEngine/types";
import { Page } from "puppeteer";

const pause = (time: number) => new Promise<void>(resolve => setTimeout(() => resolve(), time));

export default async (page: Page, task: Task) => {
  console.log(task);
  console.log(await page.title());
  await pause(1000 * 60)
  return task;
};
