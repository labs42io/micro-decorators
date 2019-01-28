export class Bulkhead {

  private count: number = 0;

  constructor(private size: number) { }

  pass(): boolean {
    if (this.size !== 0 && this.count >= this.size) return false;

    this.count += 1;

    // TODO: after function is completed empty pool
    return true;
  }
}
