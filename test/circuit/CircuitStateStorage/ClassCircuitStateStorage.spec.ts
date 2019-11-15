import { expect } from 'chai';
import * as sinon from 'sinon';

import {
  ClassCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/ClassCircuitStateStorage';
import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';

describe('@circuit ClassCircuitStateStorage', () => {

  let circuitStateFactoryStub: sinon.SinonStubbedInstance<CircuitStateFactory>;
  let service: ClassCircuitStateStorage;

  beforeEach(() => {
    circuitStateFactoryStub = sinon.createStubInstance(CircuitStateFactory);

    service = new ClassCircuitStateStorage(circuitStateFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ClassCircuitStateStorage));

    it('should init with circuitState property null', () => {
      expect(service['circuitState']).to.be.null;
    });

  });

  describe('get', () => {

    it('should create new instance of circuit state if is first call', () => {
      const expectedResult = {} as any;
      circuitStateFactoryStub.create.returns(expectedResult);
      service['circuitState'] = null;

      expect(service.get()).to.be.equals(expectedResult);
      expect(service['circuitState']).to.be.equals(expectedResult);
      expect(circuitStateFactoryStub.create.calledOnce).to.be.true;
    });

    it('should return existent instance of circuit state if is not first call', () => {
      const instance = service['circuitState'] = {} as any;

      expect(service.get()).to.be.equals(instance);
      expect(circuitStateFactoryStub.create.called).to.be.false;
    });

  });

});
