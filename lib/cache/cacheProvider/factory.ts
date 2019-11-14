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
        return this.classCacheProvider();

      case 'instance':
        return this.instanceCacheProvider();

      default:
        throw new Error(`@cache invalid scope option: ${this.scope}.`);
    }
  }

  private classCacheProvider(): ClassCacheProvider {
    return new ClassCacheProvider(this.cacheFactory);
  }

  private instanceCacheProvider(): InstanceCacheProvider {
    return new InstanceCacheProvider(this.cacheFactory);
  }

}
