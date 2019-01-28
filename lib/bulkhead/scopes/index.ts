import { InstanceScope } from './InstanceScope';
import { ClassScope } from './ClassScope';
import { Bulkhead } from '../Bulkhead';

type ScopeType = { bulkhead(instance: any): Bulkhead };

export function createScope(scope: string, size: number): ScopeType {
  switch (scope) {
    case 'instance':
      return new InstanceScope(size);

    case 'class':
      return new ClassScope(size);

    default:
      throw new Error(`Scope '${scope}' is not supported.`);
  }
}
