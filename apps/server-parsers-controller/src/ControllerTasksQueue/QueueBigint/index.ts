export class QueueBigint {
  #current: bigint;
  constructor (initialValue = 0) {
    this.#current = BigInt(initialValue);
  }
  getNext (): bigint {
    return ++this.#current;
  }
  qurrent (): bigint {
    return this.#current;
  }
}