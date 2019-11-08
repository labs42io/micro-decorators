import { CacheOptions } from '..';
import { DEFAULT_EXPIRATION } from '../CacheOptions';
import { AbsoluteExpiration } from '../expirations/AbsoluteExpiration';
import { Expiration } from '../expirations/Expiration';
import { SlidingExpiration } from '../expirations/SlidingExpiration';

export function expirationFactory(
  timeout: number,
  options: CacheOptions,
): Expiration {
  const expirationType = options.expiration || DEFAULT_EXPIRATION;

  switch (expirationType) {
    case 'absolute':
      return new AbsoluteExpiration(timeout);

    case 'sliding':
      return new SlidingExpiration(timeout);

    default:
      throw new Error(`@cache Expiration type is not supported: ${expirationType}.`);
  }
}
