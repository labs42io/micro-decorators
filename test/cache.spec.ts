import { expect } from 'chai';

import { cache, CacheOptions } from '../lib';
import { delay } from './utils';

describe('@cache', () => {
  function numberFunction(n: number): number {
    return n ** 2;
  }

  function stringFunction(s: string): string {
    return s + s;
  }

  async function asyncFunction(n: number): Promise<number> {
    await delay(30);
    return n ** 2;
  }

  const factory = (timeout: number, options?: CacheOptions) => {
    class Test {

      @cache(timeout, options)
      public numberMethod(n: number): number {
        return numberFunction(n);
      }

      @cache(timeout, options)
      public stringMethod(s: string): string {
        return stringFunction(s);
      }

      @cache(timeout, options)
      public async asyncMethod(n: number): Promise<number> {
        return await asyncFunction(n);
      }
    }

    return Test;
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

  describe("it shouldn't change method behaivor", () => {
    const decorated = new (factory(1000))();

    it('should return same value as without decorator', () => {
      expect(numberFunction(3)).to.be.equals(decorated.numberMethod(3));
    });

    it('should return same value as without decorator for async methods', async () => {
      expect(await asyncFunction(3)).to.be.equals(await decorated.asyncMethod(3));
    });

    describe('result should be same at multiple calls', () => {
      it('for sync methods', () => {
        // tslint:disable-next-line:prefer-array-literal
        const values = new Array(100).fill(null).map(() => decorated.numberMethod(4));
        expect(new Set(values).size).to.be.equals(1);
      });

      it('for async methods', async () => {
        // tslint:disable-next-line:prefer-array-literal
        const promises = new Array(10).fill(null).map(() => decorated.asyncMethod(4));
        const values = await Promise.all(promises);
        expect(new Set(values).size).to.be.equals(1);
      });
    });
  });
});
