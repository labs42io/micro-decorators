export class Counter {
  private count: number = 0;

  public get(): number {
    return this.count;
  }

  public next(): number {
    this.count += 1;

    return this.count;
  }
}
