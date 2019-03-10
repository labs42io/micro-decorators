import { expect } from 'chai';
import { bulkhead, BulkheadOptions } from '../lib/bulkhead';
import { delay, repeat } from './utils';

describe('@bulkhead', () => {

  describe('When configured with invalid options', () => {
    it('should throw for invalid `scope`.', () => {
      const factory = () => {
        class Test {
          @bulkhead(10, { scope: <any>'test' })
          do() { }
        }
      };

      expect(() => new factory()).to.throw(/.*not supported.*/i);
    });

    it('should throw for invalid `behavior`.', () => {
      const factory = () => {
        class Test {
          @bulkhead(10, { onError: <any>'test' })
          do() { }
        }
      };

      expect(() => new factory()).to.throw(/.*not supported.*/i);
    });
  });

  describe('When request should be processed without queue', () => {
    it.skip('should return result for sync method', async () => {
      class TestClass {
        @bulkhead(1)
        do(args?) {
          return args || 42;
        }
      }

      const target = new TestClass();
      const result = target.do();

      expect(result).to.be.eq(42);
    });

    it('should return result', async () => {
      const target = new (BulkheadAsyncClass(10))();
      const result = await target.do();

      expect(result).to.be.eq(42);
    });

    it('should return result using arguments', async () => {
      const target = new (BulkheadAsyncClass(10))();
      const result = await target.do(4242);

      expect(result).to.be.eq(4242);
    });

    it('should return value for each call', async () => {
      const target = new (BulkheadAsyncClass(10))();
      const result = await Promise.all([target.do(42), target.do(4242)]);

      expect(result).to.include.members([42, 4242]);
    });

    it('should return value using scope', async () => {
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

    it.skip('should return original error', async () => {
      class TestClass {
        @bulkhead(1)
        async do() {
          throw new Error('TestClass');
        }
      }

      const target = new TestClass();

      expect(() => target.do()).to.throw('TestClass');
    });

    it('should reject original error', async () => {
      class TestClass {
        @bulkhead(1)
        do() {
          return new Promise((resolve, reject) => reject('42'));
        }
      }

      const target = new TestClass();

      return expect(target.do()).to.eventually.be.rejectedWith('42');
    });

  });

  describe('When requests should be queued', () => {
    it('should wait until first value is resolved, and call second', async () => {
      const target = new (BulkheadAsyncClass(10))();

      const promises = [target.do(42), target.do(4242)];

      const first = await Promise.race(promises);
      const all = await Promise.all(promises);

      expect(first).to.be.eq(42);
      expect(all).to.include.members([42, 4242]);
    });

    it('should call value from queue on fail', async () => {
      class TestClass {
        @bulkhead(1)
        async do(error?: boolean) {
          if (error) {
            throw new Error();
          }

          return 42;
        }
      }

      const target = new TestClass();

      try {
        target.do(true);
        throw new Error('Test failed. Should throw error');
      } catch (e) { }

      const result = await target.do();

      expect(result).to.be.eq(42);
    });

  });

  describe('When queue limit reach', () => {
    it('should throw by default.', () => {
      const target = new (BulkheadAsyncClass(1, { size: 1 }))();
      expect(() => repeat(() => target.do(), 3)).to.throw('Bulkhead queue limit reached.');
    });

    it('should throw.', () => {
      const target = new (BulkheadAsyncClass(1, { size: 1, onError: 'throw' }))();
      expect(() => repeat(() => target.do(), 3)).to.throw('Bulkhead queue limit reached.');
    });

    it('should reject.', async () => {
      const target = new (BulkheadAsyncClass(1, { size: 1, onError: 'reject' }))();
      return expect(Promise.all(repeat(() => target.do(), 3))).to.eventually.be.rejectedWith();
    });

    it('should ignore.', () => {
      const target = new (BulkheadAsyncClass(1, { size: 1, onError: 'ignore' }))();
      repeat(() => target.do(), 3);
    });

  });

  describe('When using `instance` scope', () => {
    it('should be ok for different instances.', () => {
      const classType = BulkheadAsyncClass(1, { size: 1000, scope: 'instance' });
      const target1 = new classType();
      const target2 = new classType();

      expect(() => repeat(() => { target1.do(); target2.do(); }, 1000)).to.be.ok;
    });

    it('should be ok for different methods.', () => {
      class Test {
        @bulkhead(1, { scope: 'instance' })
        async first() {
          return 42;
        }

        @bulkhead(1, { scope: 'instance' })
        async second() {
          return 4242;
        }
      }

      const target = new Test();

      expect(() => repeat(() => { target.first(); target.second(); }, 1000)).to.be.ok;
    });

    it('should throw for reached limit.', () => {
      const target = new (BulkheadAsyncClass(10, { size: 100, scope: 'instance' }))();

      expect(() => repeat(() => target.do(), 111)).to.be.throw('Bulkhead queue limit reached.');
    });

  });

  describe('When using `class` scope', () => {
    it('should be ok for different methods.', () => {
      const target = new (BulkheadTwoMethodClass(10, { scope: 'class' }))();

      expect(() => repeat(() => { target.first(); target.second(); }, 1000)).to.be.ok;
    });

    it('should throw for same instance.', () => {
      const target = new (BulkheadAsyncClass(10, { size: 42, scope: 'class' }))();

      expect(() => repeat(() => target.do(), 53)).to.throw('Bulkhead queue limit reached.');
    });

    it('should throw for different instances.', () => {
      const classType = BulkheadAsyncClass(10, { size: 42, scope: 'class' });
      const target1 = new classType();
      const target2 = new classType();

      repeat(() => target1.do(), 42);
      expect(() => repeat(() => target2.do(), 11)).to.throw();
    });

  });

});

function BulkheadAsyncClass(threshold: number, options?: BulkheadOptions) {
  class Test {
    @bulkhead(threshold, options)
    async do(arg?: any) {
      return arg || 42;
    }
  }

  return Test;
}

function BulkheadTwoMethodClass(threshold: number, options?: BulkheadOptions) {
  class Test {
    @bulkhead(threshold, options)
    async first() {
      return 42;
    }

    @bulkhead(threshold, options)
    async second() {
      return 4242;
    }
  }

  return Test;
}
