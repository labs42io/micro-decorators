import { InstanceScope } from './InstanceScope';
import { ClassScope } from './ClassScope';
import { ArgsHashScope } from './ArgsHashScope';
import { Throttler } from '../Throttler';

type ScopeType = { throttler(instance: any, args: any): Throttler };

export function createScope(scope: string, limit: number, interval: number): ScopeType {
  switch (scope) {
    case 'instance':
      return new InstanceScope(limit, interval);
    case 'class':
      return new ClassScope(limit, interval);
    case 'args-hash':
      return new ArgsHashScope(limit, interval);
    default:
      throw new Error(`Scope '${scope}' is not supported.`);
  }
}
