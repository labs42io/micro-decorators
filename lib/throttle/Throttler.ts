export class Throttler {
  private count: number = 0;

  constructor(private limit: number, private interval: number) {
  }

  pass(): boolean {
    if (this.count >= this.limit) return false;

    this.count += 1;
    setTimeout(() => this.count -= 1, this.interval);
    return true;
  }
}
