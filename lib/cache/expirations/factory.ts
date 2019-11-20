import { Factory } from '../../interfaces/factory';
import { AbsoluteExpiration } from './AbsoluteExpiration';
import { Expiration } from './Expiration';
import { SlidingExpiration } from './SlidingExpiration';

export class ExpirationFactory implements Factory<Expiration, ['absolute' | 'sliding']> {

  constructor(
    private readonly timeout: number,
  ) { }

  public create(expiration: 'absolute' | 'sliding'): Expiration {
    switch (expiration) {
      case 'absolute':
        return new AbsoluteExpiration(this.timeout);

      case 'sliding':
        return new SlidingExpiration(this.timeout);

      default:
        throw new Error(`@cache Expiration type is not supported: ${expiration}.`);
    }
  }

}
