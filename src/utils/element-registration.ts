/**
 * Home Assistant replaces `window.customElements` while its frontend starts:
 * the first thing its app script does is install a scoped custom element
 * registry polyfill, which puts a new registry on `window`. Elements defined
 * before that live only in the browser's own registry, so Home Assistant no
 * longer finds them ("Timeout waiting for strategy element ... to be
 * registered"). That happens when this file runs before the app script, for
 * example when the service worker serves it from its cache.
 *
 * This keeps track of what the entry defined and defines it again in the new
 * registry. Only imported by the entry, so it stays part of the entry file.
 */

export interface ElementRegistryLike {
  get(name: string): CustomElementConstructor | undefined;
  define(name: string, constructor: CustomElementConstructor): void;
  whenDefined(name: string): Promise<unknown>;
}

export interface ElementRegistrationOptions {
  /** The registry Home Assistant uses right now (`window.customElements`). */
  current: () => ElementRegistryLike;
  /** Home Assistant defines this element right after replacing the registry. */
  bootElement?: string;
  pollIntervalMs?: number;
  pollRounds?: number;
  setTimer?: (callback: () => void, ms: number) => unknown;
  log?: Pick<Console, 'info' | 'warn'>;
}

export interface ElementRegistration {
  /** Defines the element unless another script has the name; true when it is ours. */
  define(name: string, constructor: CustomElementConstructor): boolean;
  /** Defines our elements again when the registry was replaced; returns those names. */
  check(via?: string): string[];
  /**
   * Resolves once Home Assistant has set up its registry, or when watching
   * gives up. Elements defined after this end up in the right registry.
   */
  ready: Promise<void>;
}

export const BOOT_ELEMENT = 'home-assistant';
export const POLL_INTERVAL_MS = 250;
export const POLL_ROUNDS = 120;

export function createElementRegistration(options: ElementRegistrationOptions): ElementRegistration {
  const {
    current,
    bootElement = BOOT_ELEMENT,
    pollIntervalMs = POLL_INTERVAL_MS,
    pollRounds = POLL_ROUNDS,
    setTimer = (callback, ms) => setTimeout(callback, ms),
    log = console,
  } = options;

  const ours = new Map<string, CustomElementConstructor>();
  const registryAtLoad = current();
  let seen = registryAtLoad;
  let settled = false;
  let resolveReady!: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });
  const settle = () => {
    if (settled) return;
    settled = true;
    resolveReady();
  };

  const defineIn = (registry: ElementRegistryLike, name: string, constructor: CustomElementConstructor) => {
    try {
      if (!registry.get(name)) registry.define(name, constructor);
      return registry.get(name) === constructor;
    } catch (error) {
      log.warn(`Dwains Dashboard Next - Could not register ${name}`, error);
      return false;
    }
  };

  const check = (via = 'check'): string[] => {
    const registry = current();
    if (registry === seen) return [];
    seen = registry;
    const restored: string[] = [];
    for (const [name, constructor] of ours) {
      // A name that is taken in the new registry stays with whoever took it.
      if (registry.get(name)) continue;
      if (defineIn(registry, name, constructor)) restored.push(name);
    }
    if (restored.length > 0) {
      log.info(
        `Dwains Dashboard Next - Registered ${restored.join(', ')} again after Home Assistant ` +
        `replaced the custom element registry (${via})`,
      );
    }
    settle();
    return restored;
  };

  // The boot signal also fires through the old registry: the new registry
  // defines a stand-in element there for every element it gets.
  registryAtLoad.whenDefined(bootElement).then(() => {
    check('boot');
    settle();
  }, () => undefined);

  // Fallback for when the boot signal does not come.
  let rounds = 0;
  const poll = () => {
    if (settled) return;
    if (rounds >= pollRounds) {
      settle();
      return;
    }
    rounds += 1;
    setTimer(() => {
      check('poll');
      poll();
    }, pollIntervalMs);
  };
  poll();

  return {
    define(name, constructor) {
      // Always the current registry: after a replacement the old one is no
      // longer looked at by Home Assistant.
      const isOurs = defineIn(current(), name, constructor);
      if (isOurs) ours.set(name, constructor);
      return isOurs;
    },
    check,
    ready,
  };
}
