/**
 * A circuit breaker.
 * After the method fails `maxFailures` count it enter the closed state and
 * rejects with `Circuit closed.` error. Once in closed state, the circuit fails
 * for the provided `timeout` milliseconds.
 * @param maxFailures the max number of failures until the circuit gets closed.
 * @param timeout timeout in milliseconds to keep the circuit in closed state.
 */
export function circuit(maxFailures: number, timeout: number) {
  throw new Error('Not implemented.');
}
