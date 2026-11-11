/**
 * A custom element registry with the same rules as the browser's: a name and
 * a constructor can each be used once. Home Assistant's registry polyfill
 * defines a stand-in in the registry it replaced for every element it gets,
 * which `defineStandIn` stands for.
 */
export class FakeRegistry {
  private readonly definitions = new Map<string, CustomElementConstructor>();
  private readonly waiting = new Map<string, Array<(constructor: CustomElementConstructor) => void>>();

  get(name: string): CustomElementConstructor | undefined {
    return this.definitions.get(name);
  }

  define(name: string, constructor: CustomElementConstructor): void {
    if (this.definitions.has(name)) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': the name "${name}" has already been used with this registry`);
    }
    if ([...this.definitions.values()].includes(constructor)) {
      throw new Error("Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry");
    }
    this.definitions.set(name, constructor);
    for (const resolve of this.waiting.get(name) ?? []) resolve(constructor);
    this.waiting.delete(name);
  }

  whenDefined(name: string): Promise<CustomElementConstructor> {
    const constructor = this.definitions.get(name);
    if (constructor) return Promise.resolve(constructor);
    return new Promise((resolve) => {
      this.waiting.set(name, [...(this.waiting.get(name) ?? []), resolve]);
    });
  }

  names(): string[] {
    return [...this.definitions.keys()];
  }

  defineStandIn(name: string): void {
    this.define(name, class {} as unknown as CustomElementConstructor);
  }
}

export const element = () => class {} as unknown as CustomElementConstructor;

/** Lets pending promise callbacks run. */
export const flush = async (rounds = 5) => {
  for (let i = 0; i < rounds; i += 1) await Promise.resolve();
};

/**
 * What Home Assistant's app script does while it starts: put a new registry on
 * `window` and define its root element in it.
 */
export function startHomeAssistant(host: { customElements: unknown }, options: { bootSignal?: boolean } = {}) {
  const before = host.customElements as FakeRegistry;
  const registry = new FakeRegistry();
  host.customElements = registry;
  if (options.bootSignal !== false) {
    registry.define('home-assistant', element());
    before.defineStandIn('home-assistant');
  }
  return registry;
}
