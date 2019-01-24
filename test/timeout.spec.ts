import { expect } from 'chai';
import { timeout } from '../lib';
import { delay } from './utils';

describe('timeout', () => {
  describe('When method doesn\'t timeout.', () => {
    it('Should resolve with expected result', async () => {
      class TestClass {
        @timeout(100)
        async test() {
          await delay(10);
          return 42;
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal(42);
    });

    it('Should return the result for a sync method.', () => {
      class TestClass {
        @timeout(0)
        test() {
          return 42;
        }
      }

      const target = new TestClass();
      const result = target.test();

      expect(result).to.be.equal(42);
    });

    it('Should resolve for a void method.', async () => {
      class TestClass {
        @timeout(100)
        async test() {
          await delay(10);
        }
      }

      const target = new TestClass();
      await target.test();
    });
  });

  describe('When method times out', () => {
    it('Should reject with a `Timeout.` error.', async () => {
      class TestClass {
        @timeout(10)
        async test() {
          await delay(15);
        }
      }

      const target = new TestClass();
      await expect(target.test()).to.eventually.be.rejectedWith('Timeout.');
    });
  });

  describe('When using default timeout', () => {
    it('Should resolve 100ms method', async () => {
      class TestClass {
        @timeout()
        async test() {
          await delay(100);
          return 42;
        }
      }

      const target = new TestClass();
      await expect(target.test()).to.eventually.be.equal(42);
    });

    it('Should reject 100ms method if default changed to 10ms', async () => {
      class TestClass {
        @timeout()
        async test() {
          await delay(100);
          return 42;
        }
      }

      timeout.current(10);

      const target = new TestClass();
      await expect(target.test()).to.eventually.be.rejected;
    });
  });

  describe('When method fails before timeout', () => {
    it('Should reject with original error', async () => {
      class TestClass {
        @timeout()
        async test() {
          return Promise.reject('Error 42.');
        }
      }

      const target = new TestClass();
      await expect(target.test()).to.eventually.be.rejectedWith('Error 42.');
    });

    it('Should reject with original error on throw', async () => {
      class TestClass {
        @timeout()
        async test() {
          throw new Error('Error 42.');
        }
      }

      const target = new TestClass();
      await expect(target.test()).to.eventually.be.rejectedWith('Error 42.');
    });

    it('Should throw the original error for a sync method', () => {
      class TestClass {
        @timeout()
        test() {
          throw new Error('Error 42.');
        }
      }

      const target = new TestClass();
      expect(() => target.test()).to.throw('Error 42.');
    });
  });

  describe('When method fails after timeout', () => {
    it('Should reject with `Timeout.` error.', async () => {
      class TestClass {
        @timeout(10)
        async test() {
          await delay(15);
          throw new Error('Error 42.');
        }
      }

      const target = new TestClass();
      await expect(target.test()).to.eventually.be.rejectedWith('Timeout.');
    });
  });
});
