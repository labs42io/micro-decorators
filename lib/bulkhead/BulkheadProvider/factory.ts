import { Factory } from '../../interfaces/factory';
import { BulkheadFactory } from '../Bulkhead/factory';
import { BulkheadProvider } from './BulkheadProvider';
import { ClassBulkheadProvider } from './ClassBulkheadProvider';
import { InstanceBulkheadProvider } from './InstanceBulkheadProvider';

export class BulkheadProviderFactory<T = any>
  implements Factory<BulkheadProvider<T>, ['class' | 'instance']> {

  constructor(
    private readonly bulkheadFactory: BulkheadFactory<T>,
  ) { }

  public create(scope: 'class' | 'instance'): BulkheadProvider<T> {
    switch (scope) {
      case 'class':
        return new ClassBulkheadProvider(this.bulkheadFactory);

      case 'instance':
        return new InstanceBulkheadProvider(this.bulkheadFactory);

      default:
        throw new Error(`@bulkhead unsuported scope type: ${scope}.`);
    }
  }

}
