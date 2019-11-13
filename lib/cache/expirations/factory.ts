import { CacheOptions } from '..';
import { AbsoluteExpiration } from './AbsoluteExpiration';
import { Expiration } from './Expiration';
import { SlidingExpiration } from './SlidingExpiration';

const expirationFactories: ReadonlyMap<'absolute' | 'sliding', (timeout: number) => Expiration> =
  new Map<'absolute' | 'sliding', (timeout: number) => Expiration>()
    .set('absolute', timeout => new AbsoluteExpiration(timeout))
    .set('sliding', timeout => new SlidingExpiration(timeout));

export function expirationFactory(timeout: number, options: CacheOptions): Expiration {
  const { expiration } = options;

  const factory = expirationFactories.get(expiration);

  if (!factory) {
    throw new Error(`@cache Expiration type is not supported: ${expiration}.`);
  }

  return factory(timeout);
}
