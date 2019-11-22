export interface ExecutionMetaData<T = any> {
  args: any[];
  method: (...args: any[]) => Promise<T>;
  resolve: (value: T) => void;
  reject: (error?: Error) => void;
}
