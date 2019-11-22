import { Bulkhead } from '../Bulkhead/Bulkhead';
import { BulkheadFactory } from '../Bulkhead/factory';
import { BulkheadProvider } from './BulkheadProvider';

export class InstanceBulkheadProvider<T = any> implements BulkheadProvider<T> {

  private readonly instancesBulkeads = new WeakMap<any, Bulkhead<T>>();

  constructor(
    private readonly bulkheadFactory: BulkheadFactory<T>,
  ) { }

  public get(instance: any): Bulkhead<T> {
    const hasBulkhead = this.instancesBulkeads.has(instance);
    if (!hasBulkhead) {
      const bulkheadService = this.bulkheadFactory.create();
      this.instancesBulkeads.set(instance, bulkheadService);
    }

    return this.instancesBulkeads.get(instance);
  }

}
