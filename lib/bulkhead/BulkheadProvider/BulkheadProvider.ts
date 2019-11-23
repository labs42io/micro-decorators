import { Bulkhead } from '../Bulkhead/Bulkhead';

export interface BulkheadProvider<T = any> {
  get(instance: any): Bulkhead<T>;
}
