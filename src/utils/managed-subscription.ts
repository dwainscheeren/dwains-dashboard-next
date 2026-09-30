export type Unsubscribe = () => unknown;

function callUnsubscribe(unsubscribe: Unsubscribe): void {
  try {
    const result = unsubscribe() as { catch?: (handler: (err: unknown) => void) => unknown } | undefined;
    // Home Assistant rejects an unsubscribe when the connection is already gone.
    if (result && typeof result.catch === 'function') result.catch(() => undefined);
  } catch {
    // Nothing left to clean up.
  }
}

/**
 * One subscription that can be started and stopped any number of times, for
 * example from `connectedCallback` and `disconnectedCallback`.
 *
 * Starting while a subscription is active or still being set up does nothing.
 * Stopping while the subscription is still being set up unsubscribes as soon
 * as it resolves, so a component that disconnects early never leaks one.
 */
export class ManagedSubscription {
  private _unsubscribe?: Unsubscribe;
  private _pending?: Promise<void>;
  private _generation = 0;

  /** True while subscribed or subscribing. */
  get active(): boolean {
    return Boolean(this._unsubscribe || this._pending);
  }

  /**
   * Subscribes unless already subscribed or subscribing. A rejected subscribe
   * is passed on to the caller and leaves the subscription stopped.
   */
  start(subscribe: () => Promise<unknown>): Promise<void> {
    if (this._pending) return this._pending;
    if (this._unsubscribe) return Promise.resolve();

    const generation = ++this._generation;
    const pending: Promise<void> = Promise.resolve()
      .then(subscribe)
      .then(
        (unsubscribe) => {
          if (this._pending === pending) this._pending = undefined;
          if (typeof unsubscribe !== 'function') return;
          if (generation !== this._generation) {
            // Stopped while subscribing.
            callUnsubscribe(unsubscribe as Unsubscribe);
            return;
          }
          this._unsubscribe = unsubscribe as Unsubscribe;
        },
        (err: unknown) => {
          if (this._pending === pending) this._pending = undefined;
          throw err;
        }
      );
    this._pending = pending;
    return pending;
  }

  /** Unsubscribes now, or as soon as a pending subscribe resolves. */
  stop(): void {
    this._generation++;
    this._pending = undefined;
    const unsubscribe = this._unsubscribe;
    this._unsubscribe = undefined;
    if (unsubscribe) callUnsubscribe(unsubscribe);
  }
}
