import { CacheOptions } from '.';
import { Cache } from './Cache';
import { DEFAULT_EXPIRATION, DEFAULT_OPTIONS, DEFAULT_SIZE, DEFAULT_STORAGE } from './CacheOptions';
import { MemoryStorage } from './storages/MemoryStorage';
import { Storage } from './storages/Storage';
import { Expiration } from './expirations/Expiration';
import { AbsoluteExpiration } from './expirations/AbsoluteExpiration';
import { SlidingExpiration } from './expirations/SlidingExpiration';

export function CacheFactory<K = any>(
  timeout: number,
  options: CacheOptions = DEFAULT_OPTIONS,
): Cache<K> {
  const storage = factoryStore<K>(options);
  const expiration = initializeExpiration(storage, timeout, options);
  return new Cache<K>(expiration, storage);
}

function factoryStore<K>(options: CacheOptions): Storage<K> {
  const limit = options.size || DEFAULT_SIZE;
  const storage = options.storage || DEFAULT_STORAGE;

  switch (storage) {
    case 'memory':
      return new MemoryStorage<K>(limit);

    default:
      throw new Error('Storage type is not supported.');
  }
}

function initializeExpiration<K>(
  storage: Storage<K>,
  timeout: number,
  options: CacheOptions,
): Expiration<K> {
  const expirationType = options.expiration || DEFAULT_EXPIRATION;
  switch (expirationType) {
    case 'absolute':
      return new AbsoluteExpiration<K>(storage, timeout);

    case 'sliding':
      return new SlidingExpiration<K>(storage, timeout);

    default:
      throw new Error('Expiration type is not supported.');
  }
}
