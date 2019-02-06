import { expect } from 'chai';

import { cache, CacheOptions } from '../lib';

describe('@cache', () => {
  const factory = (timeout: number, options?: CacheOptions) => {
    class Test {
      @cache(timeout, options)
      public method(n: number) {
        return n ** 2;
      }
    }
    return new Test();
  };

  describe('options', () => {
    it('should work without options', () => {
      expect(() => factory(300)).to.not.throw();
    });

    it('should work with correct options', () => {
      const options: CacheOptions = {
        scope: 'instance',
        expiration: 'sliding',
        storage: 'memory',
        size: 300,
      };
      expect(() => factory(300, options)).to.not.throw();
    });

    describe('should throw for wrong options', () => {
      it('should throw if expiration is not a valid value', () => {
        const options: CacheOptions = { expiration: 'abc' as any };
        expect(() => factory(300, options)).to.throw(/.*not supported.*/i);
      });

      it('should throw if scope is not a valid value', () => {
        const options: CacheOptions = { scope: 'any' as any };
        expect(() => factory(300, options)).to.throw(/.*not supported.*/i);
      });

      it('should throw if storage is not a valid value', () => {
        const options: CacheOptions = { storage: 'abc' as any };
        expect(() => factory(300, options)).to.throw(/.*not supported.*/i);
      });
    });
  });
});
