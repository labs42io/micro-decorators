import {
  CircuitOptions,
  DEFAULT_ERROR_FILTER,
  DEFAULT_INTERVAL,
  DEFAULT_POLICY,
} from '../CircuitOptions';
import { CircuitState } from '../CircuitState/CircuitState';
import { policyFactory } from './policyFactory';

export function circuitStateFactory(
  threshold: number,
  timeout: number,
  options: CircuitOptions,
): CircuitState {

  const interval = options.interval || DEFAULT_INTERVAL;
  const errorFilter = options.errorFilter || DEFAULT_ERROR_FILTER;

  const policyType = options.policy || DEFAULT_POLICY;
  const policy = policyFactory(threshold, policyType);

  return new CircuitState(timeout, interval, errorFilter, policy);
}
