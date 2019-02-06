import { CacheOptions } from '.';
import { Cache } from './Cache';
import { DEFAULT_EXPIRATION, DEFAULT_OPTIONS, DEFAULT_SIZE, DEFAULT_STORAGE } from './CacheOptions';
import { ExpirationStrategy } from './ExpirationStrategy';
import { MemoryStorage } from './MemoryStorage';
import { StorageType } from './StorageType';

export function factoryCacheService<K = any>(
  timeout: number,
  options: CacheOptions = DEFAULT_OPTIONS,
): Cache<K> {
  const storage = factoryStore<K>(options);
  const expiration = initializeExpiration(storage, timeout, options);
  return new Cache<K>(expiration, storage);
}

function factoryStore<K>(options: CacheOptions): StorageType<K> {
  const limit = options.size || DEFAULT_SIZE;
  const storage = options.storage || DEFAULT_STORAGE;

  switch (storage) {
    case 'memory':
      return new MemoryStorage<K>(limit);

    default:
      throw new Error('Unsuported storage type');
  }
}

function initializeExpiration<K>(
  storage: StorageType<K>,
  timeout: number,
  options: CacheOptions,
): ExpirationStrategy<K> {
  const expirationType = options.expiration || DEFAULT_EXPIRATION;
  return new ExpirationStrategy<K>(storage, expirationType, timeout);
}
