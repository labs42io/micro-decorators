import { expect } from 'chai';

import { cache, CacheOptions } from '../lib';
import { delay, repeat } from './utils';

describe.only('@cache', () => {
  class Test {
    public numberMethod(n: number): number {
      return n ** 2;
    }

    public stringMethod(s: string): string {
      return s + s;
    }

    public async asyncMethod(n: number): Promise<number> {
      await delay(30);
      return n ** 2;
    }
  }

  const factory = (timeout: number, options?: CacheOptions) => {
    const test = new Test();

    class TestWithCache implements Test {

      @cache(timeout, options)
      public numberMethod(n: number): number {
        return test.numberMethod(n);
      }

      @cache(timeout, options)
      public stringMethod(s: string): string {
        return test.stringMethod(s);
      }

      @cache(timeout, options)
      public async asyncMethod(n: number): Promise<number> {
        return await test.asyncMethod(n);
      }
    }

    return TestWithCache;
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
    const initial = new Test();
    const decorated = new (factory(1000))();

    it('should return same value as without decorator', () => {
      expect(initial.numberMethod(3)).to.be.equals(decorated.numberMethod(3));
    });

    it('should return same value as without decorator for async methods', async () => {
      expect(await initial.asyncMethod(3)).to.be.equals(await decorated.asyncMethod(3));
    });

    describe('result should be same at multiple calls', () => {
      it('for sync methods', () => {
        const expection =
          () => expect(initial.numberMethod(3)).to.be.equals(decorated.numberMethod(3));

        repeat(expection, 100);
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
