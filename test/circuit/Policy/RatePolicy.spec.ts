import { expect } from 'chai';

import { RatePolicy } from '../../../lib/circuit/Policy/RatePolicy';

describe('@circuit RatePolicy', () => {

  const threshold = 0.5;
  let service: RatePolicy;

  beforeEach(() => service = new RatePolicy(threshold));

  function errors(): number {
    return service['errors'];
  }

  function totalCalls(): number {
    return service['totalCalls'];
  }

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(RatePolicy));

    it('should init with number of errors equals to 0', () => expect(errors()).to.be.equals(0));

  });

  describe('addExecution', () => {

    it('should increase number of errors with 1 if is error', () => {
      const initialErrors = errors();

      service.addExecution('error');

      expect(errors()).to.be.equals(initialErrors + 1);
    });

    it('should not increase number of errors if is success execution', () => {
      const initialErrors = errors();

      service.addExecution('success');

      expect(errors()).to.be.equals(initialErrors);
    });

    it('should increase total calls with 1 if is error', () => {
      const initialCalls = totalCalls();

      service.addExecution('error');

      expect(totalCalls()).to.be.equals(initialCalls + 1);
    });

    it('should increase total calls with 1 if is success execution', () => {
      const initialCalls = totalCalls();

      service.addExecution('success');

      expect(totalCalls()).to.be.equals(initialCalls + 1);
    });

    it('should return self instance', () => {
      expect(service.addExecution('success')).to.be.instanceOf(RatePolicy);
    });

  });

  describe('removeExecution', () => {

    it('should decrease number of errors with 1 if is error', () => {
      const initialErrors = errors();

      service.removeExecution('error');

      expect(errors()).to.be.equals(initialErrors - 1);
    });

    it('should not decrease number of errors if is success execution', () => {
      const initialErrors = errors();

      service.removeExecution('success');

      expect(errors()).to.be.equals(initialErrors);
    });

    it('should decrease total calls with 1 if is error', () => {
      const initialCalls = totalCalls();

      service.removeExecution('error');

      expect(totalCalls()).to.be.equals(initialCalls - 1);
    });

    it('should decrease total calls with 1 if is success execution', () => {
      const initialCalls = totalCalls();

      service.removeExecution('success');

      expect(totalCalls()).to.be.equals(initialCalls - 1);
    });

    it('should return self instance', () => {
      expect(service.removeExecution('success')).to.be.instanceOf(RatePolicy);
    });

  });

  describe('reset', () => {

    it('should set number of errors to 0', () => {
      service['errors'] = 2;

      service.reset();

      expect(errors()).to.be.equals(0);
    });

    it('should set number of totalCalls to 0', () => {
      service['totalCalls'] = 30;

      service.reset();

      expect(totalCalls()).to.be.equals(0);
    });

    it('should return self instance', () => {
      expect(service.reset()).to.be.instanceOf(RatePolicy);
    });

  });

  describe('allowExecution', () => {

    it('should return true if number of errors / total calls is less than threshold', () => {
      service['errors'] = 1;
      service['totalCalls'] = 4;

      expect(service.allowExecution()).to.be.equals(true);
    });

    it('should return false if number of errors is equals with threshold', () => {
      service['errors'] = 1;
      service['totalCalls'] = 2;

      expect(service.allowExecution()).to.be.equals(false);
    });

    it('should return false if number of errors is greater than threshold', () => {
      service['errors'] = 2;
      service['totalCalls'] = 2;

      expect(service.allowExecution()).to.be.equals(false);
    });

  });

});
