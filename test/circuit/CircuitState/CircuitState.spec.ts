import * as chai from 'chai';

import { CircuitState } from '../../../lib/circuit/CircuitState/CircuitState';
import { Policy } from '../../../lib/circuit/Policy/Policy';
import { SpyObj, delay } from '../../utils';

const expect = chai.expect;

describe('@circuit CircuitState', () => {

  const timeout = 5;
  const interval = undefined;
  let errorFilter: ChaiSpies.SpyFunc0Proxy<boolean>;
  let policySpy: SpyObj<Policy>;
  let service: CircuitState;

  beforeEach(() => {
    errorFilter = chai.spy('error filter function', () => true);
    policySpy = {
      addExecution: chai.spy('policy spy add execution', () => policySpy),
      removeExecution: chai.spy('policy spy remove execution', () => policySpy),
      reset: chai.spy('policy spy reset', () => policySpy),
      allowExecution: chai.spy('policy spy allow execution', () => true),
    };

    service = new CircuitState(timeout, interval, errorFilter, policySpy);
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

      expect(errorFilter).to.have.been.called.once;
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
        errorFilter = chai.spy.returns(false);
        const service = new CircuitState(timeout, undefined, errorFilter, policySpy);

        service['state'] = 'half-open';

        service.register(new Error('42'));

        expect(service['state']).to.be.equals('open');
      });

    });

    describe('when state became open', () => {

      it('should call policy.reset', () => {
        service['state'] = 'half-open';

        service.register();

        expect(policySpy.reset).to.have.been.called.once;
      });

      it('should clear timeouts', () => {
        service['state'] = 'half-open';
        service['timers'] = [setTimeout(() => { }, timeout) as any];

        service.register();

        expect(service['timers']).to.be.an('array').and.have.property('length', 0);
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

        expect(policySpy.addExecution).to.have.been.called.once;
        expect(policySpy.addExecution).to.have.been.called.with('success');
      });

      it('should call policy.addExecution with "error" if is error execution', () => {
        service.register(new Error('42'));

        expect(policySpy.addExecution).to.have.been.called.once;
        expect(policySpy.addExecution).to.have.been.called.with('error');
      });

    });

    describe('remove execution', () => {

      const interval = 3;
      let service: CircuitState;

      beforeEach(() => service = new CircuitState(timeout, interval, errorFilter, policySpy));

      it('should add timer data to timers array', () => {
        service.register();

        expect(service['timers']).to.be.an('array').and.have.length(1);
      });

      it('should remove execution after interval ms', async () => {
        service.register();

        await delay(interval);

        expect(policySpy.removeExecution).to.have.been.called.once;
      });

      it('should became close if state is open and policy don\'t allow execution', async () => {
        let index = 0;
        policySpy = {
          ...policySpy,
          allowExecution: chai.spy(
            'policy spy allow execution',
            () => { index += 1; return index === 1; },
          ),
        };
        const service = new CircuitState(timeout, interval, errorFilter, policySpy);

        service.register();

        await delay(interval);

        expect(policySpy.allowExecution).to.have.been.called.twice;
        expect(service['state']).to.be.equals('close');
      });

    });

    it('should call policy.allowExecution after register call', () => {
      service.register();

      expect(policySpy.allowExecution).to.have.been.called.once;
    });

    it('should became close after register if policy return allowExecution false', () => {
      policySpy = {
        ...policySpy,
        allowExecution: chai.spy('policy spy allow execution', () => false),
      };
      const service = new CircuitState(timeout, interval, errorFilter, policySpy);

      service.register();

      expect(service['state']).to.be.equals('close');
    });

    it('should return self instance', () => expect(service.register()).to.be.equals(service));

  });

});
