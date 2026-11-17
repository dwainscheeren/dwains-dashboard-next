import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { isEntityActionAvailable } from './entity-availability';

const coverFeatures = {
  open_cover: 1,
  close_cover: 2,
  stop_cover: 8,
} as const;

export type CoverCommand = keyof typeof coverFeatures;
export type DeviceCommand = CoverCommand | 'lock' | 'unlock';

export function roomDeviceCommand(domain: 'cover' | 'lock', active: boolean): DeviceCommand {
  if (domain === 'cover') return active ? 'open_cover' : 'close_cover';
  return active ? 'unlock' : 'lock';
}

export function isDeviceCommand(action: string): action is DeviceCommand {
  return action === 'lock' || action === 'unlock' || Object.prototype.hasOwnProperty.call(coverFeatures, action);
}

/** Older cover entities without feature flags expose open and close only. */
export function coverSupportsCommand(state: HassEntity | undefined, command: CoverCommand): boolean {
  const flags = state?.attributes?.supported_features;
  if (flags === undefined || flags === null) return command !== 'stop_cover';
  return (Number(flags) & coverFeatures[command]) !== 0;
}

export function supportsDeviceCommand(state: HassEntity | undefined, command: DeviceCommand): boolean {
  if (!state || !isEntityActionAvailable(state)) return false;
  if (command === 'lock' || command === 'unlock') {
    return state.entity_id.startsWith('lock.') && ['locked', 'unlocked', 'open'].includes(state.state);
  }
  return state.entity_id.startsWith('cover.') && coverSupportsCommand(state, command);
}

/** Tracks requests while keeping the entity state exactly as Home Assistant reported it. */
export class DeviceCommands {
  private readonly pending = new Map<string, Set<DeviceCommand>>();

  constructor(private readonly onChange: () => void) {}

  isPending(entityId: string): boolean {
    return this.pending.has(entityId);
  }

  canSend(state: HassEntity | undefined, command: DeviceCommand): boolean {
    if (!state || !supportsDeviceCommand(state, command)) return false;
    const active = this.pending.get(state.entity_id);
    // Leave Stop usable even while the directional command is awaiting a reply.
    return !active || (command === 'stop_cover' && !active.has(command));
  }

  async send(hass: Pick<HomeAssistant, 'states' | 'callService'>, command: DeviceCommand, ids: Iterable<string>): Promise<boolean> {
    const targets = [...new Set(ids)].filter(id => this.canSend(hass.states[id], command));
    if (!targets.length) return false;

    for (const id of targets) {
      const active = this.pending.get(id) ?? new Set<DeviceCommand>();
      active.add(command);
      this.pending.set(id, active);
    }
    this.onChange();
    try {
      const domain = command === 'lock' || command === 'unlock' ? 'lock' : 'cover';
      await hass.callService(domain, command, { entity_id: targets });
      return true;
    } finally {
      for (const id of targets) {
        const active = this.pending.get(id);
        active?.delete(command);
        if (!active?.size) this.pending.delete(id);
      }
      this.onChange();
    }
  }
}
