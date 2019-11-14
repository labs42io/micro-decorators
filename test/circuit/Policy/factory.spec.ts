import { expect } from 'chai';

import { ErrorsPolicy } from '../../../lib/circuit/Policy/ErrorsPolicy';
import { PolicyFactory } from '../../../lib/circuit/Policy/factory';
import { RatePolicy } from '../../../lib/circuit/Policy/RatePolicy';

describe('@circuit PolicyFactory', () => {

  const threshold = 42;

  it('should create', () => {
    expect(new PolicyFactory(threshold, 'rate')).to.be.instanceOf(PolicyFactory);
  });

  describe('create', () => {

    it('should return instance of errors policy if policy is errors', () => {
      const service = new PolicyFactory(threshold, 'errors');

      expect(service.create()).to.be.instanceOf(ErrorsPolicy);
    });

    it('should return instance of rate policy if policy is errors', () => {
      const service = new PolicyFactory(threshold, 'rate');

      expect(service.create()).to.be.instanceOf(RatePolicy);
    });

    it('should throw if policy is not a valid policy', () => {
      const policy = 'not a valid policy' as any;
      const service = new PolicyFactory(threshold, policy);

      expect(() => service.create()).to.throw(`@circuit unsuported policy type: ${policy}`);
    });

  });

});
