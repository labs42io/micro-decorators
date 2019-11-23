import { expect } from 'chai';

import { ErrorsPolicy } from '../../../lib/circuit/Policy/ErrorsPolicy';
import { PolicyFactory } from '../../../lib/circuit/Policy/factory';
import { RatePolicy } from '../../../lib/circuit/Policy/RatePolicy';

describe('@circuit PolicyFactory', () => {

  const threshold = 42;
  let service: PolicyFactory;

  beforeEach(() => service = new PolicyFactory(threshold));

  it('should create', () => expect(service).to.be.instanceOf(PolicyFactory));

  describe('create', () => {

    it('should return instance of errors policy if policy is errors', () => {
      expect(service.create('errors')).to.be.instanceOf(ErrorsPolicy);
    });

    it('should return instance of rate policy if policy is errors', () => {
      expect(service.create('rate')).to.be.instanceOf(RatePolicy);
    });

    it('should throw if policy is not a valid policy', () => {
      const policy = 'not a valid policy' as any;

      expect(() => service.create(policy)).to.throw(`@circuit unsuported policy type: ${policy}`);
    });

  });

});
