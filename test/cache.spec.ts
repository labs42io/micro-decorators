import { expect } from 'chai';

import { cache, CacheOptions } from '../lib';
import { delay, executionTime } from './utils';

describe.only('@cache', () => {
  const delayTime = 10;

  function numberFunction(n: number): number {
    return n ** 2;
  }

  function stringFunction(s: string): string {
    return s + s;
  }

  async function asyncFunction(n: number): Promise<number> {
    await delay(delayTime);
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

  describe('options values', () => {
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

  describe.only('options behaivor', () => {

    describe('expiration', () => {
      describe('absolute', () => {
        const decorated = new (factory(1000))();

      });

      describe('sliding', () => {
        const decorated = new (factory(1000))();

      });
    });

    describe('scope', () => {
      describe('class', () => {
        const decorated = new (factory(1000))();

      });

      describe('instance', () => {
        const decorated = new (factory(1000))();

      });
    });

    describe('storage', () => {
      describe('memory', () => {
        const decorated = new (factory(1000))();

      });
    });

    describe('size', () => {
      const options: CacheOptions = { size: 3 };

      it('should cache value if are cached less values than size', async () => {
        const decorated = new (factory(1000, options))();
        await decorated.asyncMethod(0);
        await decorated.asyncMethod(1);

        const time = await executionTime(async () => await decorated.asyncMethod(1));
        expect(time).to.be.lessThan(delayTime);
      });

      it('should not cache value if are cached more values than size', async () => {
        const decorated = new (factory(1000, options))();
        await decorated.asyncMethod(0);
        await decorated.asyncMethod(1);
        await decorated.asyncMethod(2);
        await decorated.asyncMethod(3);

        const time = await executionTime(() => decorated.asyncMethod(3));
        expect(time).to.be.gte(delayTime);
      });
    });

  });

});
