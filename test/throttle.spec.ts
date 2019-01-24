import { expect } from 'chai';
import { throttle, ThrottleOptions } from '../lib';
import { repeat, delay } from './utils';

describe('@throttle', () => {
  describe('When configured with invalid options', () => {
    it('should throw for invalid `scope`.', () => {
      const factory = () => {
        class Test {
          @throttle(1000, { scope: <any>'test' })
          do() { }
        }
      };

      expect(() => factory()).to.throw(/.*not supported.*/i);
    });

    it('should throw for invalid `behavior`.', () => {
      const factory = () => {
        class Test {
          @throttle(1000, { behavior: <any>'test' })
          do() { }
        }
      };

      expect(() => factory()).to.throw(/.*not supported.*/i);
    });
  });

  describe('When throttle limit is not reached', () => {
    it('should return from a sync method.', () => {
      const target = new (ThrottledClass(1000))();
      expect(target.do()).to.equal(42);
    });

    it('should resolve from async method.', () => {
      const target = new (ThrottledAsyncClass(1000))();
      expect(target.do()).to.eventually.equal(42);
    });

    it('should succeed to the limit.', () => {
      const target = new (ThrottledClass(42))();
      repeat(() => target.do(), 42);
    });
  });

  describe('When throttle limit is reached', () => {
    it('should throw by default.', () => {
      const target = new (ThrottledClass(1000))();
      expect(() => repeat(() => target.do(), 1001)).to.throw('Throttle limit exceeded.');
    });

    it('should reject.', async () => {
      const target = new (ThrottledAsyncClass(1000, { behavior: 'reject' }))();
      return expect(Promise.all(repeat(() => target.do(), 1001))).to.eventually.be.rejectedWith();
    });

    it('should ignore.', () => {
      const target = new (ThrottledClass(1000, { behavior: 'ignore' }))();
      repeat(() => target.do(), 1001);
    });

    it('should ignore async.', () => {
      const target = new (ThrottledClass(1000, { behavior: 'ignoreAsync' }))();
      return expect(Promise.all(repeat(() => target.do(), 1001))).to.eventually.be.fulfilled;
    });

    it('should throw for 0-limit.', () => {
      const target = new (ThrottledClass(0))();
      expect(() => target.do()).to.throw();
    });
  });

  describe('When using `args-hash` scope', () => {
    it('should be ok for different arguments list.', () => {
      const classType = ThrottledClass(1000, { scope: 'args-hash' });
      const target = new classType();

      repeat(() => { target.do(1); target.do(2); }, 1000);
    });

    it('should throw for reached limit on same instance.', () => {
      const classType = ThrottledClass(1000, { scope: 'args-hash' });
      const target = new classType();

      repeat(() => target.do(1), 1000);
      expect(() => target.do(1)).to.throw('Throttle limit exceeded.');
    });

    it('should throw for reached limit on different instances.', () => {
      const classType = ThrottledClass(1000, { scope: 'args-hash' });
      const target1 = new classType();
      const target2 = new classType();

      repeat(() => target1.do(1), 1000);
      expect(() => target2.do(1)).to.throw();
    });

    describe('When first reached limit expired', () => {
      it('should not throw.', async () => {
        const classType = ThrottledClass(1000, { scope: 'args-hash' });
        const target = new classType();

        try {
          repeat(() => target.do({ x: 42 }), 1001);
          throw new Error('Test failed. Expected error to be thrown.');
        }
        catch (err) { }

        await delay(1001);
        await expect(target.do({ x: 42 })).to.be.equal(42);
      });

      it('should throw again for second reached limit.', async () => {
        const classType = ThrottledClass(1000, { scope: 'args-hash' });
        const target = new classType();

        try {
          repeat(() => target.do({ x: 42 }), 1001);
          throw new Error('Test failed. Expected error to be thrown.');
        } catch (err) { }

        await delay(1000);

        const newTarget = new classType();
        expect(() => repeat(() => newTarget.do({ x: 42 }), 1001)).to.throw();
      });
    });
  });

  describe('When using `instance` scope', () => {
    it('should be ok for different instances.', () => {
      const classType = ThrottledClass(1000, { scope: 'instance' });
      const target1 = new classType();
      const target2 = new classType();

      expect(() => repeat(() => { target1.do(); target2.do(); }, 1000)).to.be.ok;
    });

    it('should be ok for different methods.', () => {
      const classType = ThrottledTwoMethodsClass(1000, { scope: 'instance' });
      const target = new classType();

      expect(() => repeat(() => { target.first(); target.second(); }, 1000)).to.be.ok;
    });

    it('should throw for reached limit.', () => {
      const classType = ThrottledClass(1000, { scope: 'instance' });
      const target = new classType();

      expect(() => repeat(() => target.do(), 1001)).to.be.throw('Throttle limit exceeded.');
    });

    describe('When first reached limit expired', () => {
      it('should not throw.', async () => {
        const classType = ThrottledClass(1000, { scope: 'instance' });
        const target = new classType();

        try {
          repeat(() => target.do(), 1001);
          throw new Error('Test failed. Expected error to be thrown.');
        }
        catch (err) { }

        await delay(1001);
        await expect(target.do()).to.be.equal(42);
      });

      it('should throw again for second reached limit.', async () => {
        const classType = ThrottledClass(1000, { scope: 'instance' });
        const target = new classType();

        try {
          repeat(() => target.do(), 1001);
          throw new Error('Test failed. Expected error to be thrown.');
        } catch (err) { }

        await delay(1000);

        expect(() => repeat(() => target.do(), 1001)).to.throw();
      });
    });
  });

  describe('When using `class` scope', () => {
    it('should be ok for different methods.', () => {
      const classType = ThrottledTwoMethodsClass(1000, { scope: 'class' });
      const target = new classType();

      expect(() => repeat(() => { target.first(); target.second(); }, 1000)).to.be.ok;
    });

    it('should throw for same instance.', () => {
      const classType = ThrottledClass(1000, { scope: 'class' });
      const target = new classType();

      expect(() => repeat(() => target.do(), 1001)).to.throw('Throttle limit exceeded.');
    });

    it('should throw for different instances.', () => {
      const classType = ThrottledClass(1000, { scope: 'class' });
      const target1 = new classType();
      const target2 = new classType();

      repeat(() => target1.do(), 500);
      expect(() => repeat(() => target2.do(), 501)).to.throw();
    });

    describe('When first reached limit expired', () => {
      it('should not throw.', async () => {
        const classType = ThrottledClass(1000, { scope: 'class' });
        const target = new classType();

        try {
          repeat(() => target.do(), 1001);
          throw new Error('Test failed. Expected error to be thrown.');
        }
        catch (err) { }

        await delay(1001);
        await expect(target.do()).to.be.equal(42);
      });

      it('should throw again for second reached limit.', async () => {
        const classType = ThrottledClass(1000, { scope: 'class' });
        const target = new classType();

        try {
          repeat(() => target.do(), 1001);
          throw new Error('Test failed. Expected error to be thrown.');
        } catch (err) { }

        await delay(1000);

        const newTarget = new classType();
        expect(() => repeat(() => newTarget.do(), 1001)).to.throw();
      });
    });
  });

});

function ThrottledClass(limit: number, options?: ThrottleOptions) {
  class Test {
    @throttle(limit, options)
    do(arg?: any) {
      return 42;
    }
  }

  return Test;
}

function ThrottledTwoMethodsClass(limit: number, options?: ThrottleOptions) {
  class Test {
    @throttle(limit, options)
    first() {
      return 1;
    }

    @throttle(limit, options)
    second() {
      return 2;
    }
  }

  return Test;
}

function ThrottledAsyncClass(limit: number, options?: ThrottleOptions) {
  class Test {
    @throttle(limit, options)
    async do(arg?: any) {
      return 42;
    }
  }

  return Test;
}
