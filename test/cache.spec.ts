import { expect } from 'chai';

import { cache, CacheOptions } from '../lib';
import { delay, executionTime } from './utils';

describe('@cache', () => {

  const delayTime = 5;
  const timePrecision = 1;

  async function asyncFunction(n: number): Promise<number> {
    await delay(delayTime);
    return n + 1;
  }

  const classFactory = (timeout: number, options?: CacheOptions) => {
    class Test {

      @cache(timeout, options)
      public method(n: number): Promise<number> {
        return asyncFunction(n);
      }
    }

    return Test;
  };

  it('should cache value if method is called with same arguments', async () => {
    const timeout = 1000;
    const options: CacheOptions = { size: 3 };
    const instance = new (classFactory(timeout, options));

    await instance.method(42);
    const time = await executionTime(() => instance.method(42));

    expect(time).to.be.approximately(0, timePrecision);
  });

  it('should not cache value if method is called with different arguments', async () => {
    const timeout = 1000;
    const options: CacheOptions = { size: 3 };
    const instance = new (classFactory(timeout, options));

    const initialTime = await executionTime(() => instance.method(42));
    const time = await executionTime(() => instance.method(24));

    expect(time).to.be.approximately(delayTime, timePrecision);
  });

  describe('options values', () => {

    const timeout = 1000;

    it('should work without options', () => {
      expect(() => new (classFactory(timeout))).to.not.throw();
    });

    it('should work with correct options', () => {
      const options: CacheOptions = {
        scope: 'instance',
        expiration: 'sliding',
        storage: 'memory',
        size: 300,
      };

      expect(() => new (classFactory(timeout, options))).to.not.throw();
    });

    describe('should throw for wrong options', () => {

      it('should throw if expiration is not a valid value', () => {
        const options: CacheOptions = { expiration: 'abc' as any };
        const expectedError = '@cache Expiration type is not supported: abc.';
        expect(() => new (classFactory(timeout, options))).to.throw(expectedError);
      });

      it('should throw if scope is not a valid value', () => {
        const options: CacheOptions = { scope: 'xyz' as any };
        const expectedError = '@cahce Scope type is not suported: xyz.';
        expect(() => new (classFactory(timeout, options))).to.throw(expectedError);
      });

      it('should throw if storage is not a valid value', () => {
        const options: CacheOptions = { storage: 'qwe' as any };
        const expectedError = '@cache Storage type is not supported: qwe.';
        expect(() => new (classFactory(timeout, options))).to.throw(expectedError);
      });

    });

  });

  describe("it shouldn't change method behaivor", () => {

    it('should return same value as without decorator', async () => {
      const instance = new (classFactory(1000));
      expect(await asyncFunction(42)).to.be.equals(await instance.method(42));
    });

    describe('result should be same at multiple calls', () => {

      it('for async methods', async () => {
        const instance = new (classFactory(1000));
        const promises = Array.from({ length: 10 }, () => instance.method(42));
        const values = await Promise.all(promises);

        expect(new Set(values).size).to.be.equals(1);
      });

    });

  });

  describe('options behaivor', () => {

    describe('expiration', () => {

      describe('absolute', () => {

        const options: CacheOptions = { expiration: 'absolute' };

        it('should return cached value', async () => {
          const timeout = 20;
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(0, timePrecision);
        });

        it('should exprie after given timeout', async () => {
          const timeout = delayTime + 5;
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          await delay(timeout + 1);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(delayTime, timePrecision);
        });

        it('should not refresh if was call before expire', async () => {
          const timeout = 2 * delayTime;
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          await delay(timeout / 2);
          await instance.method(42);
          await delay(timeout / 2 + 1);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(delayTime, timePrecision);
        });

      });

      describe('sliding', () => {

        const options: CacheOptions = { expiration: 'sliding', scope: 'class' };

        it('should return cached value', async () => {
          const timeout = 20;
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(0, timePrecision);
        });

        it('should expire after given timeout', async () => {
          const timeout = delayTime + 5;
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          await delay(timeout + 1);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(delayTime, timePrecision);
        });

        it('should refresh if was call before expire', async () => {
          const timeout = 3 * delayTime;
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          await delay(timeout / 3);
          await instance.method(42);
          await delay(2 * timeout / 3);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(0, timePrecision);
        });

      });

    });

    describe('scope', () => {

      describe('class', () => {

        const timeout = 1000;
        const options: CacheOptions = { scope: 'class' };

        it('should return cached value for same instance of class', async () => {
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(0, timePrecision);
        });

        it('should return cached value for every instances of class', async () => {
          const constructor = classFactory(timeout, options);
          await new constructor().method(42);

          const time = await executionTime(() => new constructor().method(42));
          expect(time).to.be.approximately(0, timePrecision);
        });

      });

      describe('instance', () => {

        const timeout = 1000;
        const options: CacheOptions = { scope: 'instance' };

        it('should return cached value for same instance of class', async () => {
          const instance = new (classFactory(timeout, options));
          await instance.method(42);

          const time = await executionTime(() => instance.method(42));
          expect(time).to.be.approximately(0, timePrecision);
        });

        it('should not return cached value for differenct instances of class', async () => {
          const constructor = classFactory(timeout, options);
          await new constructor().method(42);

          const time = await executionTime(() => new constructor().method(42));
          expect(time).to.be.approximately(delayTime, timePrecision);
        });

      });

    });

    describe('size', () => {

      const timeout = 1000;

      it('should cache value if storage limit is not reached', async () => {
        const options: CacheOptions = { size: 3 };
        const instance = new (classFactory(timeout, options));

        await Promise.all([instance.method(42), instance.method(24)]);
        const times = await Promise.all([
          executionTime(() => instance.method(42)),
          executionTime(() => instance.method(24)),
        ]);

        times.forEach(time => expect(time).to.be.approximately(0, timePrecision));
      });

      it('should not cache value if storage limit is reached', async () => {
        const options: CacheOptions = { size: 1 };
        const instance = new (classFactory(timeout, options));

        await Promise.all([
          instance.method(42),
          instance.method(24),
        ]);
        const [firstTime, secondTime] = await Promise.all([
          executionTime(() => instance.method(42)),
          executionTime(() => instance.method(24)),
        ]);

        expect(firstTime).to.be.approximately(0, timePrecision);
        expect(secondTime).to.be.approximately(delayTime, timePrecision);
      });

    });

  });

});
