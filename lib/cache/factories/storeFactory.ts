import { CacheOptions } from '..';
import { DEFAULT_SIZE, DEFAULT_STORAGE } from '../CacheOptions';
import { MemoryStorage } from '../storages/MemoryStorage';
import { Storage } from '../storages/Storage';

const storeFactories: ReadonlyMap<'memory', (limit: number) => Storage> =
  new Map<'memory', (limit: number) => Storage>()
    .set('memory', limit => new MemoryStorage(limit));

export function storeFactory(options: CacheOptions): Storage {
  const limit = options.size || DEFAULT_SIZE;
  const storageType = options.storage || DEFAULT_STORAGE;

  const factory = storeFactories.get(storageType);

  if (!factory) {
    throw new Error(`@cache Storage type is not supported: ${storageType}.`);
  }

  return factory(limit);
}
