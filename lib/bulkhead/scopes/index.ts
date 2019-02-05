import { InstanceScope } from './InstanceScope';
import { ClassScope } from './ClassScope';
import { Bulkhead } from '../Bulkhead';

type ScopeType = { bulkhead(instance: any): Bulkhead };

export function createScope(scope: string, threshold: number, size: number): ScopeType {
  switch (scope) {
    case 'instance':
      return new InstanceScope(threshold, size);

    case 'class':
      return new ClassScope(threshold, size);

    default:
      throw new Error(`Scope '${scope}' is not supported.`);
  }
}
