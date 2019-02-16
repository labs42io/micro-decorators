import { CacheOptions } from '..';
import { DEFAULT_EXPIRATION } from '../CacheOptions';
import { AbsoluteExpiration } from '../expirations/AbsoluteExpiration';
import { Expiration } from '../expirations/Expiration';
import { SlidingExpiration } from '../expirations/SlidingExpiration';
import { Storage } from '../storages/Storage';

export function expirationFactory<K>(
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
