import { describe, expect, it, vi } from 'vitest';
import { ManagedSubscription } from '../src/utils/managed-subscription';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (err: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('ManagedSubscription', () => {
  it('subscribes once while active and unsubscribes on stop', async () => {
    const unsubscribe = vi.fn();
    const subscribe = vi.fn(async () => unsubscribe);
    const subscription = new ManagedSubscription();

    await subscription.start(subscribe);
    await subscription.start(subscribe);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscription.active).toBe(true);

    subscription.stop();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(subscription.active).toBe(false);
  });

  it('subscribes again after a stop, like a card that is connected again', async () => {
    const unsubscribes = [vi.fn(), vi.fn()];
    let call = 0;
    const subscribe = vi.fn(async () => unsubscribes[call++]);
    const subscription = new ManagedSubscription();

    await subscription.start(subscribe);
    subscription.stop();
    await subscription.start(subscribe);

    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(unsubscribes[0]).toHaveBeenCalledTimes(1);
    expect(unsubscribes[1]).not.toHaveBeenCalled();
    expect(subscription.active).toBe(true);
  });

  it('does not subscribe twice while the first subscribe is pending', async () => {
    const pending = deferred<() => void>();
    const subscribe = vi.fn(() => pending.promise);
    const subscription = new ManagedSubscription();

    const first = subscription.start(subscribe);
    const second = subscription.start(subscribe);
    pending.resolve(vi.fn());
    await Promise.all([first, second]);

    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes right away when stopped before the subscribe resolved', async () => {
    const pending = deferred<() => void>();
    const unsubscribe = vi.fn();
    const subscription = new ManagedSubscription();

    const started = subscription.start(() => pending.promise);
    subscription.stop();
    expect(subscription.active).toBe(false);

    pending.resolve(unsubscribe);
    await started;
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(subscription.active).toBe(false);
  });

  it('keeps a newer subscription when an older pending one resolves late', async () => {
    const old = deferred<() => void>();
    const oldUnsubscribe = vi.fn();
    const newUnsubscribe = vi.fn();
    const subscription = new ManagedSubscription();

    const oldStart = subscription.start(() => old.promise);
    subscription.stop();
    await subscription.start(async () => newUnsubscribe);
    old.resolve(oldUnsubscribe);
    await oldStart;

    expect(oldUnsubscribe).toHaveBeenCalledTimes(1);
    expect(newUnsubscribe).not.toHaveBeenCalled();
    expect(subscription.active).toBe(true);
  });

  it('passes on a failed subscribe and can be started again', async () => {
    const subscription = new ManagedSubscription();
    await expect(subscription.start(async () => {
      throw new Error('unknown command');
    })).rejects.toThrow('unknown command');
    expect(subscription.active).toBe(false);

    await expect(subscription.start(() => {
      throw new Error('sync failure');
    })).rejects.toThrow('sync failure');
    expect(subscription.active).toBe(false);

    await subscription.start(async () => vi.fn());
    expect(subscription.active).toBe(true);
  });

  it('ignores an unsubscribe that rejects because the connection is gone', async () => {
    const subscription = new ManagedSubscription();
    await subscription.start(async () => () => Promise.reject(new Error('Connection lost')));
    expect(() => subscription.stop()).not.toThrow();
    await Promise.resolve();
  });
});
