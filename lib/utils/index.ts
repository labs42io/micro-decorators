type RaiseStrategies = 'throw' | 'reject' | 'ignore' | 'ignoreAsync';

type StrategyOptions = {
  onError?: RaiseStrategies;
};

export function raiseStrategy(options: StrategyOptions, defaultStrategy: RaiseStrategies) {
  const value = options && options.onError || defaultStrategy;

  switch (value) {
    case 'reject':
      return err => Promise.reject(err);
    case 'throw':
      return (err) => { throw err; };
    case 'ignore':
      return () => { };
    case 'ignoreAsync':
      return () => Promise.resolve();
    default:
      throw new Error(`Option ${value} is not supported for 'behavior'.`);
  }
}
