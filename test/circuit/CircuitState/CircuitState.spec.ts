import { expect } from 'chai';
import * as sinon from 'sinon';

import { CircuitState } from '../../../lib/circuit/CircuitState/CircuitState';
import { ErrorsPolicy } from '../../../lib/circuit/Policy/ErrorsPolicy';
import { Policy } from '../../../lib/circuit/Policy/Policy';
import { delay } from '../../utils';

describe('@circuit CircuitState', () => {

  const timeout = 5;
  const interval = undefined;
  let errorFilterStub: sinon.SinonStub<[Error], boolean>;
  let policyStub: sinon.SinonStubbedInstance<Policy>;
  let service: CircuitState;

  beforeEach(() => {
    errorFilterStub = sinon.stub().returns(true) as any;
    policyStub = sinon.createStubInstance(ErrorsPolicy);
    policyStub.allowExecution.returns(true);

    service = new CircuitState(timeout, interval, errorFilterStub, policyStub);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(CircuitState));

    it('should set state to open', () => expect(service['state']).to.be.equals('open'));

    it('should set timers to empty array', () => {
      expect(service['timers']).to.be.an('array').and.have.length(0);
    });

  });

  describe('allow execution', () => {

    it('shuld return true if current state is open', () => {
      service['state'] = 'open';

      expect(service.allowExecution()).to.be.equals(true);
    });

    it('should return true if current state is half-open', () => {
      service['state'] = 'half-open';

      expect(service.allowExecution()).to.be.equals(true);
    });

    it('should return false if current state is close', () => {
      service['state'] = 'close';

      expect(service.allowExecution()).to.be.equals(false);
    });

  });

  describe('register', () => {

    it('should call errorFilter function to check if error should be counted', () => {
      service.register(new Error('42'));

      expect(errorFilterStub.calledOnce).to.be.true;
    });

    describe('if state is half-open', () => {

      it('should became open if was called with success', () => {
        service['state'] = 'half-open';

        service.register();

        expect(service['state']).to.be.equals('open');
      });

      it('should became close if was called with error', () => {
        service['state'] = 'half-open';

        service.register(new Error('42'));

        expect(service['state']).to.be.equals('close');
      });

      it('should became open if was called with error but errorFilter returned false', () => {
        errorFilterStub.returns(false);

        service['state'] = 'half-open';

        service.register(new Error('42'));

        expect(service['state']).to.be.equals('open');
      });

    });

    describe('when state became open', () => {

      it('should call policy.reset', () => {
        service['state'] = 'half-open';

        service.register();

        expect(policyStub.reset.calledOnce).to.be.true;
      });

      it('should clear timeouts', () => {
        service['state'] = 'half-open';
        service['timers'] = [setTimeout(() => { }, timeout) as any];

        service.register();

        expect(service['timers']).to.be.an('array').and.have.length(0);
      });

    });

    describe('when state became close', () => {

      it('should set state to half-open after timeout ms', async () => {
        service['state'] = 'half-open';

        service.register(new Error('42'));
        await delay(timeout);

        expect(service['state']).to.be.equals('half-open');
      });

    });

    describe('should call policy.addExecution', () => {

      it('should call policy.addExecution with "success" if is success execution', () => {
        service.register();

        expect(policyStub.addExecution.calledOnce).to.be.true;
        expect(policyStub.addExecution.calledWith('success')).to.be.true;
      });

      it('should call policy.addExecution with "error" if is error execution', () => {
        service.register(new Error('42'));

        expect(policyStub.addExecution.calledOnce).to.be.true;
        expect(policyStub.addExecution.calledWith('error')).to.be.true;
      });

    });

    describe('remove execution', () => {

      const interval = 3;
      let service: CircuitState;

      beforeEach(() => service = new CircuitState(timeout, interval, errorFilterStub, policyStub));

      it('should add timer data to timers array', () => {
        service.register();

        expect(service['timers']).to.be.an('array').and.have.length(1);
      });

      it('should remove execution after interval ms', async () => {
        service.register();

        await delay(interval);

        expect(policyStub.removeExecution.calledOnce).to.be.true;
      });

      it('should became close if state is open and policy don\'t allow execution', async () => {
        policyStub.allowExecution.returns(true);

        service.register();
        policyStub.allowExecution.returns(false);

        await delay(interval);

        expect(policyStub.allowExecution.calledTwice).to.be.true;
        expect(service['state']).to.be.equals('close');
      });

    });

    it('should call policy.allowExecution after register call', () => {
      service.register();

      expect(policyStub.allowExecution.calledOnce).to.be.true;
    });

    it('should became close after register if policy don\'t allow execution', () => {
      policyStub.allowExecution.returns(false);

      service.register();

      expect(service['state']).to.be.equals('close');
    });

    it('should return self instance', () => expect(service.register()).to.be.equals(service));

  });

});
