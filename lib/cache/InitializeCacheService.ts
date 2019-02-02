import { CacheOptions } from '../cache';
import { Cache } from './Cache';
import { DEFAULT_EXPIRATION, DEFAULT_OPTIONS, DEFAULT_SIZE, DEFAULT_STORAGE } from './CacheOptions';
import { ExpirationStrategy } from './ExpirationStrategy';
import { MemoryStorage } from './MemoryStorage';
import { StorageType } from './StorageType';

export function initializeCacheService<K = any, V = any>(
  timeout: number,
  options: CacheOptions = DEFAULT_OPTIONS,
): Cache<K, V> {
  const storage = initializeStore<K, V>(options);
  const expiration = initializeExpiration(storage, timeout, options);
  return new Cache<K, V>(expiration, storage);
}

function initializeStore<K, V>(options: CacheOptions): StorageType<K, V> {
  const limit = options.size || DEFAULT_SIZE;
  const storage = options.storage || DEFAULT_STORAGE;

  switch (storage) {
    case 'memory':
      return new MemoryStorage<K, V>(limit);

    default:
      throw new Error('Unsuported storage type');
  }
}

function initializeExpiration<K>(
  storage: StorageType<K, unknown>,
  timeout: number,
  options: CacheOptions,
): ExpirationStrategy<K> {
  const expirationType = options.expiration || DEFAULT_EXPIRATION;
  return new ExpirationStrategy<K>(storage, expirationType, timeout);
}
