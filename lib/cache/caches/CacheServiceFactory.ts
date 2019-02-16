import { CacheOptions } from '..';
import { Factory } from '../../interfaces/factory';
import { expirationFactory } from '../factories/expirationFactory';
import { storeFactory } from '../factories/storeFactory';
import { CacheService } from './CacheService';

export class CacheServiceFactory<T = any> implements Factory<CacheService<T>> {

  constructor(
    private readonly timeout: number,
    private readonly options: CacheOptions,
  ) { }

  public create(): CacheService<T> {
    const storage = storeFactory<T>(this.options);
    const expiration = expirationFactory(storage, this.timeout, this.options);

    return new CacheService<T>(expiration, storage);
  }
}
