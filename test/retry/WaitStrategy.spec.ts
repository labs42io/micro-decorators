import { expect } from 'chai';
import { WaitStrategy } from '../../lib/retry/WaitStrategy';

describe('WaitStrategy class', () => {
  let strategy: WaitStrategy;

  it('should delay expected time when pattern is of type number', async () => {
    strategy = new WaitStrategy(400);
    const delay = await getFunctionDelay(() => strategy.wait(0));
    expect(delay).to.be.approximately(400, 5);
  });

  it('should delay expected time when pattern is of type function', async () => {
    strategy = new WaitStrategy(() => { return 300; });
    const delay = await getFunctionDelay(() => strategy.wait(1));
    expect(delay).to.be.approximately(300, 5);
  });

  it('should delay expected time when pattern is of type array', async () => {
    strategy = new WaitStrategy([100, 300, 200]);

    let delay = await getFunctionDelay(() => strategy.wait(0));
    expect(delay).to.be.approximately(100, 5);

    delay = await getFunctionDelay(() => strategy.wait(1));
    expect(delay).to.be.approximately(300, 5);

    delay = await getFunctionDelay(() => strategy.wait(2));
    expect(delay).to.be.approximately(200, 5);
  });
});

async function getFunctionDelay(method: Function): Promise<number> {
  const time = new Date().getTime();

  await method();

  return new Date().getTime() - time;
}
