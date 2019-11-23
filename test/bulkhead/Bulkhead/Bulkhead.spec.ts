import { expect } from 'chai';
import * as sinon from 'sinon';

import { Bulkhead } from '../../../lib/bulkhead/Bulkhead/Bulkhead';
import { repeat, delay } from '../../utils';
import { ExecutionQueue } from '../../../lib/bulkhead/ExecutionQueue/ExecutionQueue';

describe('@bulkhead Bulkhead', () => {

  const threshold = 2;
  const args = [1, {}, '123'];
  let method: sinon.SinonStub<any[], Promise<number>>;
  let executionQueueStub: sinon.SinonStubbedInstance<ExecutionQueue>;
  let service: Bulkhead;

  beforeEach(() => {
    executionQueueStub = sinon.createStubInstance(ExecutionQueue);
    executionQueueStub.store.returns(executionQueueStub as any);

    method = sinon.stub<[], Promise<number>>().returns(delay(10).then(() => 42));

    service = new Bulkhead(threshold, executionQueueStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(Bulkhead));

  });

  describe('run', () => {

    describe('if threshold is not reached yet', () => {

      it('should call method instantly', () => {
        service.run(method, args);

        expect(method.calledOnce).to.be.true;
      });

      it('should call method with correct arguments', () => {
        service.run(method, args);

        expect(method.calledWith(...args)).to.be.true;
      });

      it('should increase number of current executions', () => {
        repeat(() => service.run(method, args), threshold);

        method.reset();

        service.run(method, args);

        expect(method.called).to.be.false;
      });

      it('should decrease number of current executions after method resolves', async () => {
        const promises = repeat(() => service.run(method, args), threshold);
        await Promise.race(promises);

        method.reset();
        method.resolves(42);

        service.run(method, args);

        expect(method.calledOnce).to.be.true;
      });

      it('should return same value as method', async () => {
        expect(await service.run(method, args)).to.equals(42);
      });

      it('should check if in queue are another calls', async () => {
        await service.run(method, args);

        expect(executionQueueStub.next.calledOnce).to.be.true;
      });

      it('shoould begin execute next call if exists in queue', async () => {
        const promises = [service.run(method, args), service.run(method, args)];

        const stub = sinon.stub<any[], Promise<number>>().returns(delay(10).then(() => 42));
        let callIndex = 0;
        executionQueueStub.next.callsFake(() => {
          if (callIndex === 0) {
            callIndex += 1;
            return {
              args,
              method: stub,
              reject: () => { },
              resolve: () => { },
            };
          }
          return null;
        });
        service.run(stub, args);

        await Promise.race(promises);

        expect(stub.calledOnce).to.be.true;
      });

      it('should begin execute next call if exists in queue with correct arguments', async () => {
        const promises = [service.run(method, args), service.run(method, args)];

        const stub = sinon.stub<any[], Promise<number>>().returns(delay(10).then(() => 42));
        let callIndex = 0;
        executionQueueStub.next.callsFake(() => {
          if (callIndex === 0) {
            callIndex += 1;
            return {
              args,
              method: stub,
              reject: () => { },
              resolve: () => { },
            };
          }
          return null;
        });
        service.run(stub, args);

        await Promise.race(promises);

        expect(stub.calledWith(...args)).to.be.true;
      });

    });

    describe('if threshold is reached', () => {

      beforeEach(() => {
        repeat(() => service.run(method, args), threshold);

        executionQueueStub.store.callsFake((data) => {
          let shouldCall = true;

          executionQueueStub.next.callsFake(() => {
            if (shouldCall) {
              shouldCall = false;
              return data;
            }
          });

          return executionQueueStub as any;
        });
      });

      it('should call ExecutionQueue.store to store current execution data', () => {
        service.run(method, args);

        expect(executionQueueStub.store.calledOnce).to.be.true;
      });

      it('should call ExecutionQueue.store with correct arguments', () => {
        service.run(method, args);

        const expectedArguments = {
          args,
          method,
          resolve: sinon.match.func as any,
          reject: sinon.match.func as any,
        };
        expect(executionQueueStub.store.calledWithMatch(expectedArguments)).to.be.true;
      });

      it('should return correct result', async () => {
        const stub = sinon.stub().resolves(42);
        expect(await service.run(stub, args)).to.equals(42);
      });

      it('should reject if method will reject', async () => {
        const stub = sinon.stub().rejects(new Error('error'));
        await expect(service.run(stub, args)).to.be.rejectedWith('error');
      });

    });

  });

});
