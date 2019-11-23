import { expect } from 'chai';
import * as sinon from 'sinon';

import { BulkheadOptions, bulkhead } from '../../lib';
import { delay, repeat } from '../utils';

describe('@bulkhead', () => {

  const threshold = 2;
  const timeout = 10;
  let stub: sinon.SinonStub<[], any>;

  function factory(options?: BulkheadOptions, startStub = stub) {

    class Test {

      @bulkhead(threshold, options)
      async get(): Promise<number> {
        startStub();

        await delay(timeout);

        return 42;
      }

    }

    return Test;
  }

  beforeEach(() => stub = sinon.stub());

  it('should not change method behavoiur', async () => {
    const instance = new (factory())();

    expect(await instance.get()).to.equals(42);
  });

  it('should not change method behaviour if was called from queue', async () => {
    const instance = new (factory())();

    repeat(() => instance.get(), threshold);

    expect(await instance.get()).to.equals(42);
  });

  describe('options', () => {

    it('should not throw without options', async () => {
      const instance = new (factory())();

      await expect(instance.get()).not.be.rejected;
    });

    it('should not throw for given correct options', async () => {
      const instance = new (factory({ size: 3, onError: 'ignoreAsync', scope: 'class' }))();

      await expect(instance.get()).not.be.rejected;
    });

    it('should throw for wrong onError option', () => {
      const onError = 'wrong option' as any;
      const options: BulkheadOptions = { onError };

      const expectedMessage = `Option ${onError} is not supported for 'behavior'.`;
      expect(() => new (factory(options))().get()).to.throw(expectedMessage);
    });

    it('should throw for wrong scope option', () => {
      const scope = 'wrong option' as any;
      const options: BulkheadOptions = { scope };

      const expectedMessage = `@bulkhead unsuported scope type: ${scope}.`;
      expect(() => new (factory(options))().get()).to.throw(expectedMessage);
    });

  });

  describe('options behavoiur', () => {

    describe('threshold', () => {

      let instance: InstanceType<ReturnType<typeof factory>>;

      beforeEach(() => instance = new (factory())());

      it('should execute instantly threshold calls times', () => {
        repeat(() => instance.get(), threshold + 1);

        expect(stub.callCount).to.equals(threshold);
      });

      it('should execute next calls after one of current calls ends its execution', async () => {
        const promises = repeat(() => instance.get(), threshold);
        instance.get();

        stub.reset();
        await Promise.race(promises);

        expect(stub.calledOnce).to.be.true;
      });

      it('should execute calls instantly if nothing is executed now', async () => {
        const promises = repeat(() => instance.get(), threshold);
        await Promise.all(promises);

        stub.reset();

        repeat(() => instance.get(), threshold);
        expect(stub.callCount).to.equals(threshold);
      });

    });

    describe('size', () => {

      const size = 2;
      const options: BulkheadOptions = { size };
      let instance: InstanceType<ReturnType<typeof factory>>;

      beforeEach(() => instance = new (factory(options))());

      it('should store in queue maximum size calls', async () => {
        const promises = repeat(() => instance.get(), threshold);
        repeat(() => instance.get(), size);

        stub.reset();
        await Promise.all(promises);

        expect(stub.callCount).to.equals(size);
      });

      it('should throw if is tring to call more than threshold + size', () => {
        repeat(() => instance.get(), threshold + size);

        expect(instance.get()).to.be.rejectedWith('@bulkhead execution queue limit reached.');
      });

    });

    describe('onError', () => {

      const error = 'an error';

      function factory(options?: BulkheadOptions) {

        class Test {

          @bulkhead(threshold, options)
          async get(): Promise<never> {
            throw new Error(error);
          }

        }

        return Test;
      }

      it('should reject if onError is "reject"', async () => {
        const instance = new (factory({ onError: 'reject' }))();

        await expect(instance.get()).to.be.rejectedWith(error);
      });

      it('should ignore if onError is "ignoreAsync"', async () => {
        const instance = new (factory({ onError: 'ignoreAsync' }))();

        expect(instance.get()).to.be.a('promise').and.not.to.be.rejected;
      });

    });

    describe('scope', () => {

      describe('class', () => {

        const options: BulkheadOptions = { scope: 'class' };
        let constructor: ReturnType<typeof factory>;
        let firstInstance: InstanceType<typeof constructor>;
        let secondInstance: InstanceType<typeof constructor>;

        beforeEach(() => {
          constructor = factory(options);
          [firstInstance, secondInstance] = [new constructor(), new constructor()];
        });

        it('should store in queue calls after threshold for same instances', () => {
          repeat(() => firstInstance.get(), threshold + 1);

          expect(stub.callCount).to.equals(threshold);
        });

        it('should store in queue calls after threshold for different instances', () => {
          repeat(() => firstInstance.get(), threshold);
          repeat(() => secondInstance.get(), threshold);

          expect(stub.callCount).to.equals(threshold);
        });

      });

      describe('instance', () => {

        const options: BulkheadOptions = { scope: 'instance' };
        let constructor: ReturnType<typeof factory>;
        let firstInstance: InstanceType<typeof constructor>;
        let secondInstance: InstanceType<typeof constructor>;

        beforeEach(() => {
          constructor = factory(options);
          [firstInstance, secondInstance] = [new constructor(), new constructor()];
        });

        it('should store in queue calls after threshold for same instances', () => {
          repeat(() => firstInstance.get(), threshold + 1);

          expect(stub.callCount).to.equals(threshold);
        });

        it('should not store in queue calls after threshold for different instances', () => {
          repeat(() => firstInstance.get(), threshold);
          repeat(() => secondInstance.get(), threshold);

          expect(stub.callCount).to.equals(threshold * 2);
        });

      });

    });

  });

});
