import { CacheOptions } from '..';
import { DEFAULT_EXPIRATION } from '../CacheOptions';
import { AbsoluteExpiration } from '../expirations/AbsoluteExpiration';
import { Expiration } from '../expirations/Expiration';
import { SlidingExpiration } from '../expirations/SlidingExpiration';

const expirationFactories: ReadonlyMap<'absolute' | 'sliding', (timeout: number) => Expiration> =
  new Map<'absolute' | 'sliding', (timeout: number) => Expiration>()
    .set('absolute', timeout => new AbsoluteExpiration(timeout))
    .set('sliding', timeout => new SlidingExpiration(timeout));

export function expirationFactory(
  timeout: number,
  options: CacheOptions,
): Expiration {
  const expirationType = options.expiration || DEFAULT_EXPIRATION;

  const factory = expirationFactories.get(expirationType);

  if (!factory) {
    throw new Error(`@cache Expiration type is not supported: ${expirationType}.`);
  }

  return factory(timeout);
}
