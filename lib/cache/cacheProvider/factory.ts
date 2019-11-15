import { Factory } from '../../interfaces/factory';
import { CacheFactory } from '../caches/factory';
import { CacheProvider } from './CacheProvider';
import { ClassCacheProvider } from './ClassCacheProvider';
import { InstanceCacheProvider } from './InstanceCacheProvider';

export class CacheProviderFactory implements Factory<CacheProvider> {

  constructor(
    private readonly scope: 'class' | 'instance',
    private readonly cacheFactory: CacheFactory,
  ) { }

  public create() {
    switch (this.scope) {
      case 'class':
        return new ClassCacheProvider(this.cacheFactory);

      case 'instance':
        return new InstanceCacheProvider(this.cacheFactory);

      default:
        throw new Error(`@cache invalid scope option: ${this.scope}.`);
    }
  }

}
