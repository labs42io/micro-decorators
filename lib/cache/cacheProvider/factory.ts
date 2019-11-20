import { Factory } from '../../interfaces/factory';
import { CacheFactory } from '../caches/factory';
import { CacheProvider } from './CacheProvider';
import { ClassCacheProvider } from './ClassCacheProvider';
import { InstanceCacheProvider } from './InstanceCacheProvider';

export class CacheProviderFactory implements Factory<CacheProvider, ['class' | 'instance']> {

  constructor(
    private readonly cacheFactory: CacheFactory,
  ) { }

  public create(scope: 'class' | 'instance') {
    switch (scope) {
      case 'class':
        return new ClassCacheProvider(this.cacheFactory);

      case 'instance':
        return new InstanceCacheProvider(this.cacheFactory);

      default:
        throw new Error(`@cache invalid scope option: ${scope}.`);
    }
  }

}
