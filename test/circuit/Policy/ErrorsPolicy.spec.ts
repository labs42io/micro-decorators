import { expect } from 'chai';

import { ErrorsPolicy } from '../../../lib/circuit/Policy/ErrorsPolicy';

describe('@circuit ErrorsPolicy', () => {

  const threshold = 3;
  let service: ErrorsPolicy;

  beforeEach(() => service = new ErrorsPolicy(threshold));

  function errors(): number {
    return service['errors'];
  }

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ErrorsPolicy));

    it('should init with number of errors equals to 0', () => expect(errors()).to.be.equals(0));

  });

  describe('registerCall', () => {

    it('should increase number of errors with 1 if is error', () => {
      const initialErrors = errors();

      service.registerCall('error');

      expect(errors()).to.be.equals(initialErrors + 1);
    });

    it('should not increase number of errors if is success execution', () => {
      const initialErrors = errors();

      service.registerCall('success');

      expect(errors()).to.be.equals(initialErrors);
    });

    it('should return self instance', () => {
      expect(service.registerCall('success')).to.be.instanceOf(ErrorsPolicy);
    });

  });

  describe('deleteCallData', () => {

    it('should decrease number of errors with 1 if is error', () => {
      const initialErrors = errors();

      service.deleteCallData('error');

      expect(errors()).to.be.equals(initialErrors - 1);
    });

    it('should not decrease number of errors if is success execution', () => {
      const initialErrors = errors();

      service.deleteCallData('success');

      expect(errors()).to.be.equals(initialErrors);
    });

    it('should return self instance', () => {
      expect(service.deleteCallData('success')).to.be.instanceOf(ErrorsPolicy);
    });

  });

  describe('reset', () => {

    it('should set number of errors to 0', () => {
      service['errors'] = 2;

      service.reset();

      expect(errors()).to.be.equals(0);
    });

    it('should return self instance', () => {
      expect(service.reset()).to.be.instanceOf(ErrorsPolicy);
    });

  });

  describe('allowExecution', () => {

    it('should return true if number of errors is less than threshold', () => {
      service['errors'] = threshold - 1;

      expect(service.allowExecution()).to.be.equals(true);
    });

    it('should return false if number of errors is equals with threshold', () => {
      service['errors'] = threshold;

      expect(service.allowExecution()).to.be.equals(false);
    });

    it('should return false if number of errors is greater than threshold', () => {
      service['errors'] = threshold + 1;

      expect(service.allowExecution()).to.be.equals(false);
    });

  });

});
