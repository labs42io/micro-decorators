export interface Policy {
  registerCall(type: 'success' | 'error'): this;
  deleteCallData(type: 'success' | 'error'): this;
  reset(): this;
  allowExecution(): boolean;
}
