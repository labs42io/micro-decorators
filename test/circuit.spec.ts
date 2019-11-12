import { expect } from 'chai';

import { circuit, CircuitOptions } from '../lib';
import { delay, repeat } from './utils';

describe('@circuit', () => {

  function factory(threshold: number, timeout: number, options?: CircuitOptions) {

    class Test {

      @circuit(threshold, timeout, options)
      public sqrt(x: number = 42 * 42) {
        if (x < 0) {
          throw new Error('Can not evaluate sqrt from an negative number');
        }

        return Math.sqrt(x);
      }

      @circuit(threshold, timeout, options)
      public async asyncSqrt(x: number = 42 * 42) {
        if (x < 0) {
          throw new Error('Can not evaluate sqrt from an negative number');
        }

        return Math.sqrt(x);
      }

    }

    return Test;
  }

  describe('defaults', () => {

    const threshold = 1;
    const timeout = 20;

    it('should close method execution after threshold errors', () => {
      const instance = new (factory(threshold, timeout));

      try {
        instance.sqrt(-1);
      } catch { }

      expect(() => instance.sqrt()).to.throw('@circuit: method sqrt is blocked.');
    });

    it('should change state from close to half-open after timeout', async () => {
      const instance = new (factory(threshold, timeout));

      try {
        instance.sqrt(-1);
      } catch { }

      await delay(timeout);

      expect(instance.sqrt()).to.be.equals(42);
    });

    it('should change state from half-open to open if executes with success', async () => {
      const instance = new (factory(threshold, timeout));

      try {
        instance.sqrt(-1);
      } catch { }

      await delay(timeout);

      instance.sqrt();
      expect(instance.sqrt()).to.be.equals(42);
    });

    it('should change state from half-open to close if executes with error', async () => {
      const instance = new (factory(threshold, timeout));

      try {
        instance.sqrt(-1);
      } catch { }

      await delay(timeout);

      try {
        instance.sqrt(-1);
      } catch { }
      expect(() => instance.sqrt(-1)).to.throw('@circuit: method sqrt is blocked.');
    });

  });

  describe('it should not change method behaviour', () => {

    it('should work without parameters', () => {
      const instance = new (factory(100, 100));

      expect(instance.sqrt()).to.equals(42);
    });

    it('should work with parameters', () => {
      const instance = new (factory(100, 100));

      expect(instance.sqrt(100)).to.equals(10);
    });

    it('should throw initial error if method fail', () => {
      const instance = new (factory(100, 100));

      const message = 'Can not evaluate sqrt from an negative number';
      expect(() => instance.sqrt(-1)).to.throw(message);
    });

    it('should reject intial error if method is async', async () => {
      const instance = new (factory(100, 100));

      const message = 'Can not evaluate sqrt from an negative number';
      await expect(instance.asyncSqrt(-1)).to.be.rejectedWith(message);
    });

  });

  describe('options', () => {

    it('should not throw if options was not provided', () => {
      expect(() => new (factory(100, 100))).not.to.throw();
    });

    it('should not throw if has valid options', () => {
      const options: CircuitOptions = {
        interval: 100,
        errorFilter: () => false,
        onError: 'ignore',
        policy: 'rate',
        scope: 'instance',
      };

      expect(() => new (factory(100, 100, options))).not.to.throw();
    });

    it('should throw if onError does not have a valid value', () => {
      const options: CircuitOptions = { onError: 'abc' as any };

      const expectedMessage = 'Option abc is not supported for \'behavior\'.';
      expect(() => new (factory(100, 1000, options))).to.throw(expectedMessage);
    });

    it('should thow if policy does not have a valid value', () => {
      const options: CircuitOptions = { policy: 'def' as any };

      const expectedMessage = '@circuit unsuported policy type: def';
      expect(() => new (factory(100, 1000, options))).to.throw(expectedMessage);
    });

    it('should throw if scope does not have a valid value', () => {
      const options: CircuitOptions = { scope: 'qwe' as any };

      const expectedMessage = '@circuit unsuported scope option: qwe';
      expect(() => new (factory(100, 1000, options))).to.throw(expectedMessage);
    });

  });

  describe('options behaviour', () => {

    describe('interval', () => {

      const timeout = 10;
      const options: CircuitOptions = { interval: 6 };

      it('should block execution after threshold errors in specified interval', () => {
        const threshold = 0.1;
        const instance = new (factory(threshold, timeout, { ...options, policy: 'rate' }));

        instance.sqrt();
        try {
          instance.sqrt(-1);
        } catch { }

        expect(() => instance.sqrt()).to.throw('@circuit: method sqrt is blocked.');
      });

      it('should ignore calls after specified interval', async () => {
        const threshold = 2;
        const instance = new (factory(threshold, timeout, { ...options, policy: 'errors' }));

        try {
          instance.sqrt(-1);
        } catch { }
        await delay(options.interval);
        try {
          instance.sqrt(-1);
        } catch { }

        expect(instance.sqrt()).to.be.equals(42);

      });

    });

    describe('errorFilter', () => {

      it('should count only filtered errors', async () => {
        const threshold = 2;
        const timeout = 100;

        let errorIndex = 0;
        const options: CircuitOptions = {
          errorFilter: () => {
            errorIndex = errorIndex + 1;
            return errorIndex % 2 === 0;
          },
        };

        const instance = new (factory(threshold, timeout, options));

        try {
          instance.sqrt(-1);
        } catch { }
        try {
          instance.sqrt(-1);
        } catch { }

        expect(instance.sqrt()).to.be.equals(42);
      });

    });

    describe('onError', () => {

      const threshold = 4;
      const timeout = 200;

      describe('should throw if onError strategy is \'throw\'', () => {

        it('method error', () => {
          const instance = new (factory(threshold, timeout, { onError: 'throw' }));

          expect(() => instance.sqrt(-1)).to.throw('Can not evaluate sqrt from an negative number');
        });

        it('decorator error', () => {
          const instance = new (factory(threshold, timeout, { onError: 'throw' }));

          repeat(
            () => {
              try { instance.sqrt(-1); } catch { }
            },
            threshold,
          );

          expect(() => instance.sqrt(-1)).to.throw('@circuit: method sqrt is blocked.');
        });

      });

      describe('should reject if onError strategy is \'reject\'', () => {

        it('method error', async () => {
          const instance = new (factory(threshold, timeout, { onError: 'reject' }));

          const message = 'Can not evaluate sqrt from an negative number';
          await expect(instance.asyncSqrt(-1)).to.be.rejectedWith(message);
        });

        it('decorator error', async () => {
          const instance = new (factory(threshold, timeout, { onError: 'reject' }));

          const promises = repeat(
            () => instance.asyncSqrt(-1).catch(() => { }),
            threshold,
          );
          await Promise.all(promises);

          const message = '@circuit: method asyncSqrt is blocked.';
          await expect(instance.asyncSqrt(-1)).to.be.rejectedWith(message);
        });

      });

      describe('should return undefined if onError strategy is \'ignore\'', () => {

        it('method error', () => {
          const instance = new (factory(threshold, timeout, { onError: 'ignore' }));

          expect(instance.sqrt(-1)).to.be.equals(undefined);
        });

        it('decorator error', () => {
          const instance = new (factory(threshold, timeout, { onError: 'ignore' }));

          repeat(() => instance.sqrt(-1), threshold);

          expect(instance.sqrt(-1)).to.be.equals(undefined);
        });

      });

      describe('should return resolved promise if onError strategy is \'ignoreAsync\'', () => {

        it('method error', async () => {
          const instance = new (factory(threshold, timeout, { onError: 'ignoreAsync' }));

          expect(await instance.asyncSqrt(-1)).to.be.equals(undefined);
        });

        it('decorator error', async () => {
          const instance = new (factory(threshold, timeout, { onError: 'ignoreAsync' }));

          const promises = repeat(() => instance.asyncSqrt(-1), threshold);
          await Promise.all(promises);

          expect(await instance.asyncSqrt(-1)).to.be.equals(undefined);
        });

      });

    });

    describe('policy', () => {
      const timeout = 10;

      describe('errors', () => {
        const threshold = 2;
        const options: CircuitOptions = { policy: 'errors' };

        it('should block after threshold exceded', () => {
          const instance = new (factory(threshold, timeout, options));

          repeat(
            () => {
              try { instance.sqrt(-1); } catch { }
            },
            threshold,
          );

          expect(() => instance.sqrt(-1)).to.throw('@circuit: method sqrt is blocked.');
        });

      });

      describe('rate', () => {
        const threshold = 0.5;
        const options: CircuitOptions = { policy: 'rate' };

        it('should block after threshold exceded', () => {
          const instance = new (factory(threshold, timeout, options));

          try { instance.sqrt(); } catch { }
          try { instance.sqrt(); } catch { }
          try { instance.sqrt(-1); } catch { }
          try { instance.sqrt(-1); } catch { }

          expect(() => instance.sqrt()).to.throw('@circuit: method sqrt is blocked.');
        });

      });

    });

    describe('scope', () => {
      const threshold = 1;
      const timeout = 10;

      describe('class', () => {
        const options: CircuitOptions = { scope: 'class' };

        it('should block execution for every instance of class', () => {
          const constructor = factory(threshold, timeout, options);
          const firstInstance = new constructor();
          const secondInstance = new constructor();

          try { firstInstance.sqrt(-1); } catch { }

          expect(() => firstInstance.sqrt()).to.throw('@circuit: method sqrt is blocked.');
          expect(() => secondInstance.sqrt()).to.throw('@circuit: method sqrt is blocked.');
        });

        it('should return to open state for every instance of class', async () => {
          const constructor = factory(0.1, timeout, { ...options, policy: 'rate' });
          const firstInstance = new constructor();
          const secondInstance = new constructor();

          try { firstInstance.sqrt(-1); } catch { }

          await delay(timeout);

          expect(firstInstance.sqrt()).to.be.equals(42);
          expect(secondInstance.sqrt()).to.be.equals(42);
        });

      });

      describe('instance', () => {
        const options: CircuitOptions = { scope: 'instance' };

        it('should block only current instance of class', () => {
          const constructor = factory(threshold, timeout, options);
          const firstInstance = new constructor();
          const secondInstance = new constructor();

          try { firstInstance.sqrt(-1); } catch { }

          expect(() => firstInstance.sqrt()).to.throw('@circuit: method sqrt is blocked.');
          expect(secondInstance.sqrt()).to.be.equals(42);
        });

        it('should return to open for blocked instance of class', async () => {
          const constructor = factory(threshold, timeout, options);
          const firstInstance = new constructor();
          const secondInstance = new constructor();

          try { firstInstance.sqrt(-1); } catch { }

          await delay(timeout);

          try { secondInstance.sqrt(-1); } catch { }

          expect(firstInstance.sqrt()).to.be.equals(42);
          expect(() => secondInstance.sqrt()).to.throw('@circuit: method sqrt is blocked.');
        });

      });

      describe('arguments hash', () => {
        const options: CircuitOptions = { scope: 'args-hash' };

        it('should block call by call arguments', () => {
          const constructor = factory(threshold, timeout, options);
          const firstInstance = new constructor();
          const secondInstance = new constructor();

          try { firstInstance.sqrt(-1); } catch { }

          expect(() => firstInstance.sqrt(-1)).to.throw('@circuit: method sqrt is blocked.');
          expect(secondInstance.sqrt()).to.be.equals(42);
        });

        it('should return to open state for blocked arguemnts', async () => {
          const constructor = factory(threshold, timeout, options);
          const firstInstance = new constructor();
          const secondInstance = new constructor();

          try { firstInstance.sqrt(-1); } catch { }

          await delay(timeout);

          try { secondInstance.sqrt(-2); } catch { }

          expect(() => firstInstance.sqrt(-1))
            .to.throw('Can not evaluate sqrt from an negative number');
          expect(() => secondInstance.sqrt(-2)).to.throw('@circuit: method sqrt is blocked.');
        });

      });

    });

  });

});
