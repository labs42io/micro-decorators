export interface Policy {
  addExecution(type: 'success' | 'error'): this;
  removeExecution(type: 'success' | 'error'): this;
  reset(): this;
  allowExecution(): boolean;
}
