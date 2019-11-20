import { expect } from 'chai';

import { AbsoluteExpiration } from '../../../lib/cache/expirations/AbsoluteExpiration';
import { ExpirationFactory } from '../../../lib/cache/expirations/factory';
import { SlidingExpiration } from '../../../lib/cache/expirations/SlidingExpiration';

describe('@cache ExpirationFactory', () => {

  const timeout = 42;
  let service: ExpirationFactory;

  beforeEach(() => service = new ExpirationFactory(timeout));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ExpirationFactory));

  });

  describe('create', () => {

    it('should create instance of AbsoluteExpiration if expiration is "absolute"', () => {
      expect(service.create('absolute')).to.be.instanceOf(AbsoluteExpiration);
    });

    it('should create instance of SlidingExpiration if expiration is "sliding"', () => {
      expect(service.create('sliding')).to.be.instanceOf(SlidingExpiration);
    });

    it('should throw error if expiration parameter is not valid', () => {
      const expiration = '123' as any;
      const message = `@cache Expiration type is not supported: ${expiration}.`;

      expect(() => service.create(expiration)).to.throw(message);
    });

  });

});
