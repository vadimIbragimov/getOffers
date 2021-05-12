import * as fs from 'fs';
import * as path from 'path';
import { FileOptionsType } from './types';

const defaultOptions: FileOptionsType = {
  fileName: 'log',
  path: __dirname,
  clearIfExists: true,
  addStartTimeToFileName: false,
  addEndTimeToFileName: false,
  dateGenerator: (time: Date) => time.valueOf().toString(),
  fileExtension: 'txt',
};

export class File {
  #options: FileOptionsType;
  #fullPath: string;
  constructor(options?: FileOptionsType) {
    this.#options = options || defaultOptions;
    this.generateFullPath();
  }

  private generateFullPath(cb?: (path: string) => void) {
    let _path: string;
    let _fileName: string;

    if (typeof this.#options.path === 'string') _path = this.#options.path;
    else if (typeof this.#options.path === 'function') _path = this.#options.path();
    else _path = defaultOptions.path as string;

    if (typeof this.#options.fileName === 'string') _fileName = this.#options.fileName;
    else if (typeof this.#options.fileName === 'function') _fileName = this.#options.fileName();
    else _fileName = defaultOptions.fileName as string;

    if (this.#options.addStartTimeToFileName) {
      _fileName = `${_fileName}_${this.#options.dateGenerator ? this.#options.dateGenerator(new Date()) : defaultOptions.dateGenerator?.(new Date)}`
    }

    this.#fullPath = path.resolve(
      _path,
      `${_fileName}.${this.#options.fileExtension || defaultOptions.fileExtension}`,
    );

    this.checkAccess(cb);
  }

  private checkAccess(cb?: (path: string) => void) {
    fs.access(this.#fullPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(this.#fullPath, '', (err) => {
          if (err) {
            console.error(err);
            return;
          }
          cb?.(this.#fullPath);
        })
        return;
      }
      fs.access(this.#fullPath, fs.constants.W_OK, (err) => {
        if (err) {
          console.error(err)
          return
        }
        if (this.#options.clearIfExists) fs.writeFileSync(this.#fullPath, '');
        cb?.(this.#fullPath);
      });
    });
  }

  write(text: string): void {
    const writeFunc = (path: string) => {
      fs.appendFile(path, text.concat('\n'), (err) => {
        if (err) console.error(err);
      });
    };
    if (!this.#fullPath) this.generateFullPath(writeFunc);
    writeFunc(this.#fullPath);
  }
}