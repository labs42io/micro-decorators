import { expect } from 'chai';
import * as sinon from 'sinon';

import { cache, CacheOptions } from '../../lib';
import { delay } from '../utils';

describe('@cache', () => {

  const delayTime = 2;
  const timeout = 6;
  let methodStub: sinon.SinonStub<[], unknown>;

  beforeEach(() => methodStub = sinon.stub());

  const factory = (timeout: number, options?: CacheOptions, methodSpy = methodStub) => {
    class Test {

      @cache(timeout, options)
      public async method(n: number): Promise<number> {
        methodSpy();
        await delay(delayTime);
        return n + 1;
      }

    }

    return Test;
  };

  it('should use cached value if method is called with same arguments', async () => {
    const instance = new (factory(timeout));

    await instance.method(42);
    methodStub.reset();

    await instance.method(42);

    expect(methodStub.called).to.be.false;
  });

  it('should not use cached value if method is called with different arguments', async () => {
    const instance = new (factory(timeout));

    await instance.method(42);
    methodStub.reset();

    await instance.method(24);

    expect(methodStub.calledOnce).to.be.true;
  });

  it('should propagate error if method reject', () => {
    const errorMessage = 'any error';
    class Test {

      @cache({ timeout: 100, scope: 'instance' })
      public async method() {
        throw new Error(errorMessage);
      }
    }

    const instance = new Test();
    expect(instance.method()).to.be.rejectedWith(errorMessage);
  });

  describe('options values', () => {

    it('should work without options', () => {
      expect(() => new (factory(timeout))().method(42)).to.not.throw();
    });

    it('should work with correct options', () => {
      const options: CacheOptions = {
        scope: 'instance',
        expiration: 'sliding',
        storage: 'memory',
        size: 300,
      };

      expect(() => new (factory(timeout, options))().method(42)).to.not.throw();
    });

    it('should work with one parameter', () => {
      const test = () => {
        class Test {

          @cache({ timeout: 100, scope: 'instance' })
          public async method() {
            return 42;
          }
        }

        return Test;
      };

      expect(() => new (test())().method()).not.to.throw();
    });

    describe('should throw for wrong options', () => {

      it('should throw if expiration is not a valid value', () => {
        const options: CacheOptions = { expiration: 'abc' as any };
        const instance = new (factory(timeout, options));

        const expectedError = '@cache Expiration type is not supported: abc.';
        expect(instance.method(42)).to.be.rejectedWith(expectedError);
      });

      it('should throw if scope is not a valid value', () => {
        const options: CacheOptions = { scope: 'xyz' as any };

        const expectedError = '@cache invalid scope option: xyz.';
        expect(() => new (factory(timeout, options))().method(42)).to.throw(expectedError);
      });

      it('should throw if storage is not a valid value', () => {
        const options: CacheOptions = { storage: 'qwe' as any };
        const instance = new (factory(timeout, options));

        const expectedError = '@cache Storage type is not supported: qwe.';
        expect(instance.method(42)).to.be.rejectedWith(expectedError);
      });

    });

  });

  describe("it shouldn't change method behaivor", () => {

    it('should return same value as without decorator', async () => {
      const instance = new (factory(timeout));

      expect(await instance.method(42)).to.equals(43);
    });

    describe('result should be same at multiple calls', () => {

      it('for async methods', async () => {
        const instance = new (factory(1000));
        const promises = Array.from({ length: 10 }, () => instance.method(42));
        const values = await Promise.all(promises);

        expect(new Set(values).size).to.equals(1);
      });

    });

  });

  describe('options behaivor', () => {

    describe('expiration', () => {

      describe('absolute', () => {

        const options: CacheOptions = { expiration: 'absolute' };
        let instance: InstanceType<ReturnType<typeof factory>>;

        beforeEach(() => instance = new (factory(timeout, options)));

        it('should return cached value', async () => {
          await instance.method(42);

          methodStub.reset();
          await instance.method(42);

          expect(methodStub.called).to.be.false;
        });

        it('should expire after given timeout', async () => {
          await instance.method(42);
          methodStub.reset();

          await delay(timeout * 2);

          await instance.method(42);

          expect(methodStub.calledOnce).to.be.true;
        });

        it('should not refresh if was call before expire', async () => {
          await instance.method(42);

          await delay(timeout / 2);
          await instance.method(42);
          methodStub.reset();
          await delay(timeout / 2);

          await instance.method(42);

          expect(methodStub.calledOnce).to.be.true;
        });

      });

      describe('sliding', () => {

        const options: CacheOptions = { expiration: 'sliding' };
        let instance: InstanceType<ReturnType<typeof factory>>;

        beforeEach(() => instance = new (factory(timeout, options)));

        it('should return cached value', async () => {
          await instance.method(42);
          methodStub.reset();

          await instance.method(42);

          expect(methodStub.called).to.be.false;
        });

        it('should expire after given timeout', async () => {
          await instance.method(42);
          methodStub.reset();

          await delay(timeout * 2);

          await instance.method(42);
          expect(methodStub.calledOnce).to.be.true;
        });

        it('should refresh if was call before expire', async () => {
          await instance.method(42);

          await delay(timeout / 2);
          await instance.method(42);
          methodStub.reset();
          await delay(timeout / 2);

          await instance.method(42);
          expect(methodStub.called).to.be.false;
        });

      });

    });

    describe('scope', () => {

      describe('class', () => {

        const options: CacheOptions = { scope: 'class' };
        let constructor: ReturnType<typeof factory>;
        let instance: InstanceType<typeof constructor>;

        beforeEach(() => {
          constructor = factory(timeout, options);
          instance = new constructor();
        });

        it('should return cached value for same instance of class', async () => {
          await instance.method(42);
          methodStub.reset();

          await instance.method(42);
          expect(methodStub.called).to.be.false;
        });

        it('should return cached value for every instances of class', async () => {
          await new constructor().method(42);
          methodStub.reset();

          await instance.method(42);
          expect(methodStub.called).to.be.false;
        });

        it('should not use cached value if is another class', async () => {
          const anotherConstructor = factory(timeout, options);
          await new anotherConstructor().method(42);
          methodStub.reset();

          await instance.method(42);
          expect(methodStub.calledOnce).to.be.true;
        });

      });

      describe('instance', () => {

        const options: CacheOptions = { scope: 'instance' };
        let constructor: ReturnType<typeof factory>;
        let instance: InstanceType<typeof constructor>;

        beforeEach(() => {
          constructor = factory(timeout, options);
          instance = new constructor();
        });

        it('should return cached value for same instance of class', async () => {
          await instance.method(42);
          methodStub.reset();

          await instance.method(42);
          expect(methodStub.called).to.be.false;
        });

        it('should not return cached value for differenct instances of class', async () => {
          await new constructor().method(42);
          methodStub.reset();

          await instance.method(42);
          expect(methodStub.calledOnce).to.be.true;
        });

      });

    });

    describe('size', () => {

      const options: CacheOptions = { size: 2 };
      let instance: InstanceType<ReturnType<typeof factory>>;

      beforeEach(() => instance = new (factory(timeout, options)));

      it('should cache value if storage limit is not reached', async () => {
        await instance.method(1);
        await instance.method(2);
        methodStub.reset();

        await instance.method(2);
        expect(methodStub.called).to.be.false;
      });

      it('should cache value if storage is reached', async () => {
        await instance.method(1);
        await instance.method(2);
        await instance.method(3);
        methodStub.reset();

        await instance.method(3);
        expect(methodStub.called).to.be.false;
      });

      it('should remove oldest value if storage limit is reached', async () => {
        await instance.method(1);
        await instance.method(2);
        await instance.method(3);
        methodStub.reset();

        await instance.method(1);
        expect(methodStub.calledOnce).to.be.true;
      });

    });

  });

});
