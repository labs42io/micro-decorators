import { expect } from 'chai';
import { retry } from '../lib';
import { delay } from './utils';

describe.only('@retry', () => {
  describe('When method don\'t have retry options.', () => {
    it('should resolve with expected result.', async () => {
      class TestClass {
        @retry(3)
        async test() {
          return Promise.resolve('Success 42.');
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal('Success 42.');
    });

    it('should throw default error.', async () => {
      class TestClass {
        @retry(3)
        async test() {
          return Promise.reject('Error 42.');
        }
      }

      const target = new TestClass();

      await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
    });
  });

  describe('When method have empty retry options object.', () => {
    it('should resolve with expected result.', async () => {
      class TestClass {
        @retry(3)
        async test() {
          return Promise.resolve('Success 42.');
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal('Success 42.');
    });

    it('should retry until function will resolve with expected result.', async () => {
      class TestClass {
        public retryIndex = 1;
        @retry(3)
        async test() {
          if (this.retryIndex === 1) {
            return Promise.reject('Error 42.');
          }
          return Promise.resolve('Success 42.');
        }
      }

      const target = new TestClass();
      const result = await target.test();

      expect(result).to.equal('Success 42.');
    });

    it('should throw default error.', async () => {
      class TestClass {
        @retry(3)
        async test() {
          return Promise.reject('Error 42.');
        }
      }

      const target = new TestClass();

      await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
    });
  });

  describe('When method is called with retry options.', () => {
    it('should throw with expected \'throw\' error.', async () => {
      class TestClass {
        @retry(3, { onError: 'throw' })
        async test() {
          return Promise.reject('Error 42.');
        }
      }

      const target = new TestClass();

      await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
    });

    it('should throw with expected \'reject\' error.', async () => {
      class TestClass {
        @retry(3, { onError: 'reject' })
        async test() {
          return Promise.reject('Error 42.');
        }
      }

      const target = new TestClass();

      await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
    });

    it('should ignore with \'ignore\' error.', async () => {
      class TestClass {
        @retry(3, { onError: 'ignore' })
        async test() {
          return Promise.reject('Error 42.');
        }
      }

      const target = new TestClass();
      const response = await target.test();

      expect(response).to.equal(undefined);
    });

    it('should ignore with \'ignoreAsync\' error.', async () => {
      class TestClass {
        @retry(3, { onError: 'ignoreAsync' })
        async test() {
          return Promise.reject('Error 42.');
        }
      }

      const target = new TestClass();
      const response = await target.test();

      expect(response).to.equal(undefined);
    });
  });
});
