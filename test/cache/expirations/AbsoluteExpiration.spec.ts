import { expect } from 'chai';
import * as sinon from 'sinon';

import { AbsoluteExpiration } from '../../../lib/cache/expirations/AbsoluteExpiration';
import { delay } from '../../utils';

describe('@cache AbsoluteExpiration', () => {

  const timeout = 10;
  let service: AbsoluteExpiration;

  beforeEach(() => service = new AbsoluteExpiration(timeout));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(AbsoluteExpiration));

  });

  describe('add', () => {

    describe('new key', () => {

      it('should call clearCallback after timeout ms', async () => {
        const spy = sinon.spy();

        service.add('key', spy);

        await delay(timeout);

        expect(spy.calledOnce).to.be.true;
      });

    });

    describe('existing key', () => {

      it('should not update expiration', async () => {
        const spy = sinon.spy();
        service['expirations'].add('key');

        service.add('key', spy);

        await delay(timeout);

        expect(spy.called).to.be.false;
      });

      it('should call initial callback', async () => {
        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();

        service.add('key', firstSpy);

        await delay(timeout / 2);

        service.add('key', secondSpy);

        await delay(timeout / 2);

        expect(firstSpy.calledOnce).to.be.true;
      });

    });

  });

});
