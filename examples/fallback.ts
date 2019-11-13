import { fallback } from '../lib/fallback';

class Service {

  public fallbackValue = 'fallback value';

  @fallback(function () { return `${this.fallbackValue} provider`; })
  public syncExample() {
    throw new Error('error message');
  }

  @fallback('fallback value')
  public asyncExample() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('error message')), 100);
    });
  }

  @fallback('fallback value', { errorFilter: ({ message }: Error) => message.includes('message') })
  public filterErrorExample() {
    throw new Error('error message');
  }

}

const service = new Service();

(async () => {
  const syncExample = service.syncExample();
  console.log('Sync example:', syncExample);

  const asyncExample = await service.asyncExample();
  console.log('Async example:', asyncExample);

  const filterExample = service.filterErrorExample();
  console.log('Filter error example:', filterExample);
})();
