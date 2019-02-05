import { expect } from 'chai';
import { bulkhead, BulkheadOptions } from '../lib/bulkhead';
import { delay, repeat } from './utils';

describe.only('@bulkhead', () => {

  describe('When request should be processed without queue', () => {
    it('should return result', async () => {
      const target = new (BulkheadAsyncClass(10))();
      const result = await target.do();

      expect(result).to.be.eq(42);
    });

    it('should return result using arguments', async () => {
      const target = new (BulkheadAsyncClass(10))();
      const result = await target.do(42);

      expect(result).to.be.eq(42);
    });

    it('should return value for each call', async () => {
      const target = new (BulkheadAsyncClass(10))();
      const result = await Promise.all([target.do(42), target.do(4242)]);

      expect(result).to.include.members([42, 4242]);
    });

    it('should return value from caller scope', async () => {
      class TestClass {
        private x = 42;
        @bulkhead(1)
        async do() {
          return this.x;
        }
      }

      const target = new TestClass();
      const result = await target.do();

      expect(result).to.eq(42);
    });

  });

  describe('When requests should be queued', () => {
    it('should wait until first value is resolved, and call second', async () => {
      class TestClass {
        @bulkhead(1)
        async test(count) {
          await delay(15);
          return count;
        }
      }

      const target = new TestClass();
      const result = await Promise.all([target.test(42), target.test(4242)]);

      expect(result).to.include.members([42, 4242]);
    });
  });

  describe('When queue limit reach', () => {
    it('should throw by default.', () => {
      const target = new (BulkheadClass(1, { size: 1 }))();
      expect(() => repeat(() => target.do(), 3)).to.throw('Limiter queue limit reached.');
    });

    it('should throw.', () => {
      const target = new (BulkheadClass(1, { size: 1, onError: 'throw' }))();
      expect(() => repeat(() => target.do(), 3)).to.throw('Limiter queue limit reached.');
    });

    it('should reject.', async () => {
      const target = new (BulkheadAsyncClass(1, { size: 1, onError: 'reject' }))();
      return expect(Promise.all(repeat(() => target.do(), 3))).to.eventually.be.rejectedWith();
    });

    it('should ignore.', () => {
      const target = new (BulkheadClass(1, { size: 1, onError: 'ignore' }))();
      repeat(() => target.do(), 3);
    });

    it('should ignore async.', () => {
      const target = new (BulkheadClass(1, { size: 1, onError: 'ignoreAsync' }))();
      return expect(Promise.all(repeat(() => target.do(), 3))).to.eventually.be.fulfilled;
    });
  });

});

function BulkheadClass(threshold: number, options?: BulkheadOptions) {
  class Test {
    @bulkhead(threshold, options)
    do(arg?: any) {
      return 42;
    }
  }

  return Test;
}

function BulkheadAsyncClass(threshold: number, options?: BulkheadOptions) {
  class Test {
    @bulkhead(threshold, options)
    async do(arg?: any) {
      return arg || 42;
    }
  }

  return Test;
}
