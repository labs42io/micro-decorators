import { expect } from 'chai';
import * as sinon from 'sinon';

import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';
import {
  ArgumentsCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/ArgumentsCircuitStateStorage';
import {
  ClassCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/ClassCircuitStateStorage';
import { CircuitStateStorageFactory } from '../../../lib/circuit/CircuitStateStorage/factory';
import {
  InstanceCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/InstanceCircuitStateStorage';
import { HashService } from '../../../lib/utils/hash';

describe('@circuit CircuitStateStorageFactory', () => {

  let circuitStateFactoryStub: sinon.SinonStubbedInstance<CircuitStateFactory>;
  let hashServiceStub: sinon.SinonStubbedInstance<HashService>;

  let service: CircuitStateStorageFactory;

  beforeEach(() => {
    circuitStateFactoryStub = sinon.createStubInstance(CircuitStateFactory);
    hashServiceStub = sinon.createStubInstance(HashService);

    service =
      new CircuitStateStorageFactory(circuitStateFactoryStub as any, hashServiceStub);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(CircuitStateStorageFactory));

  });

  describe('create', () => {

    it('should create instance of ArgumentsCircuitStateStorage for "args-hash" argument', () => {
      expect(service.create('args-hash')).to.be.instanceOf(ArgumentsCircuitStateStorage);
    });

    it('should create instance of ClassCircuitStateStorage for "class" argument', () => {
      expect(service.create('class')).to.be.instanceOf(ClassCircuitStateStorage);
    });

    it('should create instance of InstanceCircuitStateStorage for "instance" argument', () => {
      expect(service.create('instance')).to.be.instanceOf(InstanceCircuitStateStorage);
    });

  });

});
