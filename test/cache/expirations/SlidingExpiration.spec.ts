import { expect } from 'chai';
import * as sinon from 'sinon';

import { SlidingExpiration } from '../../../lib/cache/expirations/SlidingExpiration';
import { delay } from '../../utils';

describe('@cache SlidingExpiration', () => {

  const timeout = 10;
  let service: SlidingExpiration;

  beforeEach(() => service = new SlidingExpiration(timeout));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(SlidingExpiration));

    it('should init expirations storage', () => {
      expect(service['expirations']).to.be.instanceOf(Map);
    });

  });

  describe('add', () => {

    describe('new key', () => {

      it('should add key in expirations', () => {
        const size = service['expirations'].size;

        service.add('key', () => { });

        expect(service['expirations'].size).to.be.equals(size + 1);
        expect(service['expirations'].has('key')).to.be.true;
      });

      it('should remove key from expirations after timeout ms', async () => {
        const size = service['expirations'].size;

        service.add('key', () => { });
        await delay(timeout);

        expect(service['expirations'].size).to.be.equals(size);
        expect(service['expirations'].has('key')).to.be.false;
      });

      it('should call clearCallback after timeout ms', async () => {
        const spy = sinon.spy();

        service.add('key', spy);
        await delay(timeout);

        expect(spy.calledOnce).to.be.true;
      });

    });

    describe('existing key', () => {

      beforeEach(() => service['expirations'].set('key', setTimeout(() => { }, timeout) as any));

      it('should update timer for key in expirations', () => {
        const timer = service['expirations'].get('key');

        service.add('key', () => { });

        expect(service['expirations'].get('key')).not.to.be.equals(timer);
      });

      it('should remove existing expiration', async () => {
        const expirationSpy = sinon.spy();
        service['expirations'].set('key', setTimeout(() => expirationSpy(), timeout) as any);

        service.add('key', () => { });

        await delay(timeout);

        expect(expirationSpy.called).to.be.false;
      });

      it('should clear key in expirations after timeout ms', async () => {
        service.add('key', () => { });

        await delay(timeout);

        expect(service['expirations'].get('key')).to.be.undefined;
      });

      it('should call clearCallback after timeout ms', async () => {
        const spy = sinon.spy();

        service.add('key', spy);
        await delay(timeout);

        expect(spy.calledOnce).to.be.true;
      });

    });

  });

});
