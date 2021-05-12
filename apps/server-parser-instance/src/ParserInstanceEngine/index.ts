import { Logger } from '@go/server-shared-components';
import puppeteer, { Browser } from 'puppeteer';
import { Queue } from './queue';
import { StreamsQuantityType, Task } from './types';
import beautify from 'json-beautify';

const TIMEOUT_BROWSER_CLOSE = 1000 * 60 * 10;

const browserConfig = {
  headless: true,
}

export * as ParserInstanceEngineTypes from './types';

export class ParserInstanceEngine {
  #browser: Browser | undefined;
  #queue = new Queue();
  #streamsQuantity: StreamsQuantityType;
  #timoutBrowserClose: ReturnType<typeof setTimeout> | undefined;
  onEmtyQueue: () => void;
  constructor(streamsQuantity: StreamsQuantityType = 1) {
    this.#streamsQuantity = streamsQuantity;
  }

  exec(task: Task): Promise<Record<PropertyKey, unknown>> {
    Logger.trace(`Task ${task.funcName} ${task.service} ${task.url} incoming to execution`);
    if (this.#timoutBrowserClose) clearTimeout(this.#timoutBrowserClose);
    return new Promise((resolve, reject) => {
      this.#queue.add(task, (resp, e) => {
        if (e) reject(e);
        else resolve(resp || {})
      });
      this.run();
    })
  }

  async freeStreams(): Promise<number> {
    if (!this.#browser) return this.#streamsQuantity;
    else return this.#streamsQuantity - (await this.#browser?.pages()).length + 1;
  }

  private async run(): Promise<void> {
    if (!this.#browser) {
      Logger.trace('Browser closed, open browser');
      this.#browser = await puppeteer.launch(browserConfig);
      Logger.trace('Browser opened');
    } else {
      Logger.trace('Browser opened');
    }
    const freeStreams = await this.freeStreams();
    Logger.trace(`Parser have ${freeStreams} free streams`);
    if (freeStreams) {
      const queueItem = this.#queue.get();
      if (queueItem) {
        Logger.trace(`QueueItem ${queueItem?.task.funcName} ${queueItem?.task.service} ${queueItem?.task.url} start execution`);
        const { task, callback } = queueItem;
        Logger.trace(`Task ${task.funcName} ${task.service} ${task.url} start execution`);
        try {
          const modulePath = `../parserModules/${queueItem.task.service}${task.funcName ? '/'.concat(task.funcName) : ''}`;
          const [page, execModule] = await Promise.all([
            this.#browser.newPage(),
            import(modulePath),
          ]);
          Logger.trace(`Module ${task.service}/${task.funcName || ''} ${task.url} by path "${modulePath}" is found`);
          Logger.trace('New page is opened')
          if (execModule.default) {
            Logger.trace(`Run module ${task.service}/${task.funcName || ''} ${task.url}`);
            const response = await execModule.default(page, task);
            Logger.trace(`Run module ${task.service}/${task.funcName || ''} ${task.url} return ${beautify(response, [], 2, 100)}`);
            Logger.trace(`Task ${task.funcName} ${task.service} ${task.url} end execution`);
            callback(response);
          } else {
            Logger.error(`Task ${task.funcName} ${task.service} ${task.url} execution failed`);
            callback(undefined, new Error(`Can not find default function "${modulePath}"`));
          }
          await page.close();
        } catch (e) {
          Logger.error(`Task ${task.funcName} ${task.service} ${task.url} execution failed`);
          callback(undefined, e);
        }
        this.run();
      } else if (freeStreams === this.#streamsQuantity) {
        this.#timoutBrowserClose = setTimeout(() => {
          this.#browser?.close()
            .then(() => {
              this.#browser = undefined;
            })
        }, TIMEOUT_BROWSER_CLOSE);
        this.onEmtyQueue?.();
      }
    }
  }
}
