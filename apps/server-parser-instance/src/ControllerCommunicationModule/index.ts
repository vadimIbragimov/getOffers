import fetch, { Response, Headers } from 'node-fetch';

export class ControllerCommunicationModule {
  #controllerAddress: string;
  constructor(controllerAddress: string) {
    this.#controllerAddress = controllerAddress;
  }

  private errorHandler(response: Response) {
    return new Promise<Response>((resolve, reject) => {
      const status = response.status;
      if (status === 200) {
        resolve(response);
      } else {
        response.text()
          .then((text) => {
            reject(new Error(`fetch failed with code ${status}: ${text}`))
          })
          .catch((e) => reject(e));
      }
    });
  }

  getTask(): Promise<Record<PropertyKey, unknown>> {
    return new Promise((resolve, reject) => {
      fetch(this.#controllerAddress.concat('getNextTask'))
        .then((response) => this.errorHandler(response))
        .then((response) => response.json())
        .then((jsonBody) => resolve(jsonBody))
        .catch((e) => reject(e));
    });
  }

  doneTask(id: string, result: Record<PropertyKey, unknown>): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ id, result })
    };

    return new Promise<void>((resolve, reject) => {
      fetch(this.#controllerAddress.concat('doneTask'), requestOptions)
        .then((response) => this.errorHandler(response))
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  }

  errorTask(id: string): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ id })
    };

    return new Promise<void>((resolve, reject) => {
      fetch(this.#controllerAddress.concat('doneTask'), requestOptions)
        .then((response) => this.errorHandler(response))
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  }
}
