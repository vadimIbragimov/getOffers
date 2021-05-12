/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { File } from "./File";
import { LoggerOptionsType } from "./types";

type LogLevel = 'ERROR' | 'WARN' | 'DEBUG' | 'TRACE' | 'INFO';

const defaultOptions: LoggerOptionsType = {
  dateGenerator: (time: Date) => time.toLocaleString(),
};

export class Logger {
  private static _instance: Logger;
  #options: LoggerOptionsType;
  #file: File;

  private constructor(options?: LoggerOptionsType) {
    if (!Logger._instance) {
      this.#options = options || {};
      console.log(this.#options);
      this.#file = new File(options?.fileOptions);
      Logger._instance = this;
    }
    return Logger._instance;
  }

  static init(options?: LoggerOptionsType): void {
    if (!Logger._instance) new Logger(options);
    else console.error(new Error('Instance of Logger already exist'));
  }

  private static getInstance() {
    if (Logger._instance) return Logger._instance;
    else console.error(new Error('Instance of logger is not initialized'));
  }

  private log(type: LogLevel, text: string): void {
    this.#file.write(
      `${(this.#options.dateGenerator || defaultOptions.dateGenerator)?.(new Date())} [${type}] - ${text}`
    )
  }

  private static log(type: LogLevel, text: string) {
    const instance = this.getInstance();
    if (instance) instance.log(type, text);
  }

  static error (text: string) {
    this.log('ERROR', text);
  }

  static warn  (text: string) {
    this.log('WARN', text);
  }

  static info (text: string) {
    this.log('INFO', text);
  }

  static debug (text: string) {
    this.log('DEBUG', text);
  }

  static trace (text: string) {
    this.log('TRACE', text);
  }
}
