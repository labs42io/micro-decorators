import { expect } from 'chai';

import { AbsoluteExpiration } from '../../../lib/cache/expirations/AbsoluteExpiration';
import { ExpirationFactory } from '../../../lib/cache/expirations/factory';
import { SlidingExpiration } from '../../../lib/cache/expirations/SlidingExpiration';

describe('@cache ExpirationFactory', () => {

  describe('constructor', () => {

    it('should create', () => {
      expect(new ExpirationFactory(3, 'absolute')).to.be.instanceOf(ExpirationFactory);
    });

  });

  describe('create', () => {

    it('should create instance of AbsoluteExpiration if expiration is "absolute"', () => {
      expect(new ExpirationFactory(3, 'absolute').create()).to.be.instanceOf(AbsoluteExpiration);
    });

    it('should create instance of SlidingExpiration if expiration is "sliding"', () => {
      expect(new ExpirationFactory(3, 'sliding').create()).to.be.instanceOf(SlidingExpiration);
    });

    it('should throw error if expiration parameter is not valid', () => {
      const expiration = '123' as any;
      const message = `@cache Expiration type is not supported: ${expiration}.`;

      expect(() => new ExpirationFactory(3, expiration).create()).to.throw(message);
    });

  });

});
