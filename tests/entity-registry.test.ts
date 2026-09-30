import { beforeEach, describe, expect, it } from 'vitest';
import { getEntityRegistry, setFullEntityRegistry } from '../src/utils/entity-registry';

const hassWith = (entities: Record<string, any>) => ({ entities }) as any;

describe('getEntityRegistry', () => {
  beforeEach(() => setFullEntityRegistry([]));

  it('merges the live display entries over the full registry', () => {
    setFullEntityRegistry([
      { entity_id: 'light.a', area_id: 'kitchen', hidden_by: null, created_at: '2026-01-01' },
      { entity_id: 'light.disabled', disabled_by: 'user' },
    ]);
    const registry = getEntityRegistry(hassWith({ 'light.a': { entity_id: 'light.a', name: 'Lamp', hidden: false } }));
    expect(registry['light.a']).toMatchObject({ area_id: 'kitchen', created_at: '2026-01-01', name: 'Lamp', hidden_by: null });
    // Disabled entities are not in Home Assistant's live list but still known.
    expect(registry['light.disabled']?.disabled_by).toBe('user');
  });

  it('follows the live hidden flag', () => {
    setFullEntityRegistry([{ entity_id: 'light.a', hidden_by: null }]);
    expect(getEntityRegistry(hassWith({ 'light.a': { entity_id: 'light.a', hidden: true } }))['light.a']?.hidden_by).toBe('user');
    setFullEntityRegistry([{ entity_id: 'light.a', hidden_by: 'integration' }]);
    expect(getEntityRegistry(hassWith({ 'light.a': { entity_id: 'light.a', hidden: false } }))['light.a']?.hidden_by).toBeNull();
  });

  it('returns the same object until a source changes', () => {
    const live = { 'light.a': { entity_id: 'light.a', hidden: false } };
    const first = getEntityRegistry(hassWith(live));
    expect(getEntityRegistry(hassWith(live))).toBe(first);
    expect(getEntityRegistry(hassWith({ ...live }))).not.toBe(first);
  });
});
