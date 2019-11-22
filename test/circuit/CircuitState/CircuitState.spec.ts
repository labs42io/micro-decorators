import { expect } from 'chai';
import * as sinon from 'sinon';

import { CircuitState } from '../../../lib/circuit/CircuitState/CircuitState';
import { ErrorsPolicy } from '../../../lib/circuit/Policy/ErrorsPolicy';
import { Policy } from '../../../lib/circuit/Policy/Policy';
import { delay } from '../../utils';

describe('@circuit CircuitState', () => {

  const timeout = 5;
  const interval = timeout * 2;
  let errorFilterStub: sinon.SinonStub<[Error], boolean>;
  let policyStub: sinon.SinonStubbedInstance<Policy>;
  let clearCallbackStub: sinon.SinonStub<[], unknown>;
  let service: CircuitState;

  beforeEach(() => {
    errorFilterStub = sinon.stub().returns(true) as any;
    clearCallbackStub = sinon.stub();
    policyStub = sinon.createStubInstance(ErrorsPolicy);
    policyStub.allowExecution.returns(true);

    service = new CircuitState(timeout, interval, errorFilterStub, policyStub, clearCallbackStub);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(CircuitState));

  });

  describe('allow execution', () => {

    it('shuld return true if current state is open', () => {
      expect(service.allowExecution()).to.be.true;
    });

    it('should return true if current state is half-open', async () => {
      policyStub.allowExecution.returns(false);
      service.register(new Error('error'));

      await delay(timeout);

      expect(service.allowExecution()).to.be.true;
    });

    it('should return false if current state is close', () => {
      policyStub.allowExecution.returns(false);
      service.register(new Error('error'));

      expect(service.allowExecution()).to.be.false;
    });

  });

  describe('register', () => {

    it('should call errorFilter function to check if error should be counted', () => {
      service.register(new Error('42'));

      expect(errorFilterStub.calledOnce).to.be.true;
    });

    describe('if state is half-open', () => {

      beforeEach(async () => {
        policyStub.allowExecution.returns(false);
        service.register(new Error('error'));

        await delay(timeout);

        policyStub.allowExecution.returns(true);
      });

      it('should became open if was called with success', () => {
        service.register();

        expect(service.allowExecution()).to.be.true;
      });

      it('should became close if was called with error', () => {
        service.register(new Error('42'));

        expect(service.allowExecution()).to.be.false;
      });

      it('should became open if was called with error but errorFilter returned false', () => {
        errorFilterStub.returns(false);

        service.register(new Error('42'));

        expect(service.allowExecution()).to.be.true;
      });

    });

    describe('when state became open', () => {

      beforeEach(async () => {
        policyStub.allowExecution.returns(false);
        service.register(new Error('error'));

        await delay(timeout);

        policyStub.allowExecution.returns(true);
      });

      it('should call policy.reset', () => {
        service.register();

        expect(policyStub.reset.calledOnce).to.be.true;
      });

      it('should clear timeouts', async () => {
        policyStub.deleteCallData.reset();

        service.register();
        await delay(interval);

        expect(policyStub.deleteCallData.calledOnce).to.be.true;
      });

      it('should call clearCallback', () => {
        service.register();

        expect(clearCallbackStub.calledOnce).to.be.true;
      });

    });

    describe('when state became close', () => {

      describe('should set state to half-open after timeout ms', () => {

        beforeEach(async () => {
          policyStub.allowExecution.returns(false);
          service.register(new Error('error'));

          await delay(timeout);

          policyStub.allowExecution.returns(true);
        });

        it('should allow execution after interval', async () => {
          service.register(new Error('42'));
          await delay(timeout);

          expect(service.allowExecution()).to.be.true;
        });

        it('should not allow execution if after interval it register error', async () => {
          service.register(new Error('42'));
          await delay(timeout);

          service.register(new Error('42'));

          expect(service.allowExecution()).to.be.false;
        });

      });

    });

    describe('should call policy.registerCall', () => {

      it('should call policy.registerCall', () => {
        service.register();

        expect(policyStub.registerCall.calledOnce).to.be.true;
      });

      it('should call polu.registerCall with "success" if is success call', () => {
        service.register();

        expect(policyStub.registerCall.calledWith('success')).to.be.true;
      });

      it('should call policy.registerCall with "error" if was error in execution', () => {
        service.register(new Error('42'));

        expect(policyStub.registerCall.calledWith('error')).to.be.true;
      });

    });

    describe('remove execution', () => {

      const interval = 3;
      let service: CircuitState;

      beforeEach(
        () => service = new CircuitState(
          timeout,
          interval,
          errorFilterStub,
          policyStub,
          clearCallbackStub,
        ),
      );

      it('should remove execution after interval ms', async () => {
        service.register();

        await delay(interval);

        expect(policyStub.deleteCallData.calledOnce).to.be.true;
      });

      it('should became close if state is open and policy don\'t allow execution', async () => {
        policyStub.allowExecution.returns(true);

        service.register();
        policyStub.allowExecution.returns(false);

        await delay(interval);

        expect(service.allowExecution()).to.be.false;
      });

      it('should call policy.allowExecution twice', async () => {
        policyStub.allowExecution.returns(true);

        service.register();
        policyStub.allowExecution.returns(false);

        await delay(interval);

        expect(policyStub.allowExecution.calledTwice).to.be.true;
      });

    });

    it('should call policy.allowExecution after register call', () => {
      service.register();

      expect(policyStub.allowExecution.calledOnce).to.be.true;
    });

    it('should became close after register if policy don\'t allow execution', () => {
      policyStub.allowExecution.returns(false);

      service.register();

      expect(service.allowExecution()).to.be.false;
    });

    it('should return self instance', () => expect(service.register()).to.equals(service));

  });

});
