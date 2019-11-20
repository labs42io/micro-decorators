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

      it('should call clearCallback with given key', async () => {
        const spy = sinon.spy();
        const key = 'key';

        service.add('key', spy);

        await delay(timeout);

        expect(spy.calledWith(key)).to.be.true;
      });

    });

    describe('existing key', () => {

      it('should not update expiration', async () => {
        const spy = sinon.spy();
        service.add('key', () => { });

        service.add('key', spy);

        await delay(timeout);

        expect(spy.called).to.be.false;
      });

      it('should call initial callback', async () => {
        const spy = sinon.spy();

        service.add('key', spy);

        await delay(timeout / 2);

        service.add('key', () => { });

        await delay(timeout / 2);

        expect(spy.calledOnce).to.be.true;
      });

      it('should call initial callback with given key', async () => {
        const spy = sinon.spy();
        const key = 'key';

        service.add(key, spy);

        await delay(timeout / 2);

        service.add(key, () => { });

        await delay(timeout / 2);

        expect(spy.calledWith(key)).to.be.true;
      });

    });

  });

});
