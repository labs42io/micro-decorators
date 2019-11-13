import { fallback } from '../lib/fallback';
import { expect } from 'chai';

describe('@fallback', () => {

  describe('synchronous method', () => {

    it('should take the real value', () => {
      class TestClass {
        @fallback(42)
        test() {
          return 4242;
        }
      }

      const target = new TestClass();
      const result = target.test();

      expect(result).to.equal(4242);
    });

    it('should take the fallback value', () => {
      class TestClass {
        @fallback(42)
        test() {
          throw new Error('4242');
        }
      }

      const target = new TestClass();
      const result = target.test();

      expect(result).to.equal(42);
    });

    it('should take the fallback provided value', () => {
      class TestClass {
        value = 42;
        @fallback(function () { return this.value; })
        test() {
          throw new Error('4242');
        }
      }

      const target = new TestClass();
      const result = target.test();

      expect(result).to.equal(42);
    });

    it('should return fallback by filtered error', () => {
      class TestClass {
        @fallback(42, { errorFilter: ({ message }: Error) => message === '4242' })
        test() {
          throw new Error('4242');
        }
      }

      const target = new TestClass();
      const result = target.test();

      expect(result).to.equal(42);
    });

    it('should return fallback by filtered error from class method', () => {
      class TestClass {
        filterError(err: Error) {
          return err.message.includes('4242');
        }
        @fallback(42, { errorFilter(err) { return this.filterError(err); } })
        test() {
          throw new Error('4242');
        }
      }

      const target = new TestClass();
      const result = target.test();

      expect(result).to.equal(42);
    });

    it('should throw error', () => {
      class TestClass {
        @fallback(42, { errorFilter: ({ message }: Error) => message === '3131' })
        test() {
          throw new Error('4242');
        }
      }

      const target = new TestClass();
      expect(target.test).to.throw(Error);
    });

  });

  describe('asynchronous method', () => {

    it('should take the real value', async () => {
      class TestClass {
        @fallback(42)
        test() {
          return Promise.resolve(4242);
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal(4242);
    });

    it('should take the fallback value', async () => {
      class TestClass {
        @fallback(42)
        test() {
          return Promise.reject(new Error('4242'));
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal(42);
    });

    it('should take the fallback provided value', async () => {
      class TestClass {
        value = 42;
        @fallback(function () { return this.value; })
        test() {
          return Promise.reject(new Error('4242'));
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal(42);
    });

    it('should return fallback by filtered error', async () => {
      class TestClass {
        filterError(err: Error) {
          return err.message.includes('4242');
        }
        @fallback(42, { errorFilter(err) { return this.filterError(err); } })
        test() {
          return Promise.reject(new Error('4242'));
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal(42);
    });

    it('should return fallback by filtered error', async () => {
      class TestClass {
        @fallback(42, { errorFilter: ({ message }: Error) => message === '4242' })
        test() {
          return Promise.reject(new Error('4242'));
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal(42);
    });

    it('should reject an error', async () => {
      class TestClass {
        @fallback(42, { errorFilter: ({ message }: Error) => message === '3131' })
        test() {
          return Promise.reject(new Error('4242'));
        }
      }

      const target = new TestClass();
      await expect(target.test()).to.be.rejectedWith('4242');
    });

  });

});
