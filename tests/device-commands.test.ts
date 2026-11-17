import { describe, expect, it, vi } from 'vitest';
import { DeviceCommands, supportsDeviceCommand } from '../src/utils/device-commands';
import { entityState, hassWithStates } from './helpers';

describe('cover and lock commands', () => {
  it('filters unreachable and unsupported entities without changing reported state', async () => {
    const closeOnly = entityState('cover.close_only', 'open', { supported_features: 2 });
    const openOnly = entityState('cover.open_only', 'open', { supported_features: 1 });
    const offline = entityState('cover.offline', 'unavailable', { supported_features: 3 });
    const noFeatures = entityState('cover.fixed', 'open', { supported_features: 0 });
    const hass = hassWithStates([closeOnly, openOnly, offline, noFeatures]);
    const callService = vi.fn(async () => {});
    const commands = new DeviceCommands(() => {});

    await expect(commands.send({ ...hass, callService }, 'close_cover', Object.keys(hass.states))).resolves.toBe(true);

    expect(callService).toHaveBeenCalledExactlyOnceWith('cover', 'close_cover', { entity_id: [closeOnly.entity_id] });
    expect(hass.states[closeOnly.entity_id]?.state).toBe('open');
    expect(supportsDeviceCommand(entityState('lock.door', 'unlocking'), 'lock')).toBe(false);
  });

  it('rejects an overlapping direction but still allows Stop while an open request is pending', async () => {
    const cover = entityState('cover.shade', 'closed', { supported_features: 11 });
    const hass = hassWithStates([cover]);
    let finishOpening!: () => void;
    const opening = new Promise<void>(resolve => { finishOpening = resolve; });
    const callService = vi.fn(async (_domain: string, action: string) => {
      if (action === 'open_cover') await opening;
    });
    const commands = new DeviceCommands(() => {});
    const connection = { ...hass, callService };

    const first = commands.send(connection, 'open_cover', [cover.entity_id]);
    await expect(commands.send(connection, 'close_cover', [cover.entity_id])).resolves.toBe(false);
    await expect(commands.send(connection, 'stop_cover', [cover.entity_id])).resolves.toBe(true);
    expect(commands.isPending(cover.entity_id)).toBe(true);
    finishOpening();
    await first;
    expect(commands.isPending(cover.entity_id)).toBe(false);
    expect(callService.mock.calls.map(call => call[1])).toEqual(['open_cover', 'stop_cover']);
  });

  it('unblocks a rejected lock request and keeps the reported state', async () => {
    const locked = entityState('lock.door', 'locked');
    const hass = hassWithStates([locked]);
    const callService = vi.fn(async () => { throw new Error('not reachable'); });
    const commands = new DeviceCommands(() => {});

    await expect(commands.send({ ...hass, callService }, 'unlock', [locked.entity_id])).rejects.toThrow('not reachable');
    expect(commands.canSend(locked, 'unlock')).toBe(true);
    expect(hass.states[locked.entity_id]?.state).toBe('locked');
  });
});
