// The device hierarchy of the Home Assistant energy settings for live power.
// In the energy settings a device can name the device it is fed by as
// "Upstream device" (`included_in_stat`), for example the circuits below a
// main meter. These pure helpers turn that into links between power sensors
// and split readings along them, so a main meter and its circuits are not
// added up. Used by the house power usage and the power badge of an area.

/** No device hierarchy. */
export const NO_UPSTREAM_RATES: Readonly<Record<string, string>> = Object.freeze({});

/** One entry of `device_consumption`, reduced to what the power usage needs. */
export interface DeviceConsumptionLink {
  /** Energy statistic of the device; other devices name it in `included_in_stat`. */
  consumption?: string;
  /** Power sensor of the device. */
  rate?: string;
  /** Energy statistic of the device upstream of this one. */
  includedIn?: string;
}

/**
 * The power sensor upstream of `rate` in `EnergyPowerConfig.upstreamRates`.
 * Only own keys count, so a name such as `constructor` never finds a link.
 */
function upstreamOf(upstream: Readonly<Record<string, string>>, rate: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(upstream, rate) ? upstream[rate] : undefined;
}

/**
 * Power sensor of the nearest device above `device` that has one. A device
 * without a power sensor is skipped, so its own upstream device is used.
 */
function nearestUpstreamRate(
  device: DeviceConsumptionLink,
  byConsumption: ReadonlyMap<string, DeviceConsumptionLink>
): string | undefined {
  const visited = new Set<string>();
  if (device.consumption) visited.add(device.consumption);
  let parentId = device.includedIn;
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = byConsumption.get(parentId);
    if (!parent) return undefined;
    if (parent.rate) return parent.rate;
    parentId = parent.includedIn;
  }
  return undefined;
}

/**
 * Turns the device hierarchy of the energy settings into links between power
 * sensors (see `EnergyPowerConfig.upstreamRates`). Links to an unknown
 * device are dropped, and a loop that was stored by hand (A inside B and B
 * inside A) is broken, so every chain of links ends.
 */
export function buildUpstreamRates(devices: readonly DeviceConsumptionLink[]): Record<string, string> {
  const byConsumption = new Map<string, DeviceConsumptionLink>();
  devices.forEach((device) => {
    if (device.consumption && !byConsumption.has(device.consumption)) byConsumption.set(device.consumption, device);
  });

  const upstream: Record<string, string> = {};
  for (const device of devices) {
    if (!device.rate || upstreamOf(upstream, device.rate) !== undefined) continue;
    const parentRate = nearestUpstreamRate(device, byConsumption);
    if (parentRate && parentRate !== device.rate) upstream[device.rate] = parentRate;
  }

  // The first sensor of a loop loses its link; the rest of the loop is then a chain.
  for (const rate of Object.keys(upstream)) {
    const seen = new Set<string>([rate]);
    let parent: string | undefined = upstream[rate];
    while (parent !== undefined) {
      if (seen.has(parent)) {
        if (parent === rate) delete upstream[rate];
        break;
      }
      seen.add(parent);
      parent = upstreamOf(upstream, parent);
    }
  }
  return upstream;
}

/**
 * A share below this is left over from rounding (1005 W + 995 W taken off
 * 2000 W gives about 1e-13 W) and counts as 0 W.
 */
const SHARE_ROUNDING_WATTS = 0.5;

/**
 * Splits readings along the device hierarchy of the energy settings. Every
 * reading is taken off the nearest sensor above it that has a reading too.
 * A sensor above others keeps what they do not measure, but never less than
 * 0 W, so the shares add up to the readings of the sensors at the top unless
 * the sensors below one read more than it does (then they count in full and
 * the sum is theirs). A share left over from rounding counts as 0 W. Returns
 * the share of every sensor in `readings`.
 */
export function splitUpstreamPower(
  readings: ReadonlyMap<string, number>,
  upstream: Readonly<Record<string, string>>
): Map<string, number> {
  const shares = new Map(readings);
  const reduced = new Set<string>();
  for (const [entityId, watts] of readings) {
    const seen = new Set<string>([entityId]);
    let parent = upstreamOf(upstream, entityId);
    while (parent !== undefined && !seen.has(parent)) {
      if (readings.has(parent)) {
        shares.set(parent, (shares.get(parent) ?? 0) - watts);
        reduced.add(parent);
        break;
      }
      seen.add(parent);
      parent = upstreamOf(upstream, parent);
    }
  }
  reduced.forEach((entityId) => {
    const share = shares.get(entityId) ?? 0;
    shares.set(entityId, share < SHARE_ROUNDING_WATTS ? 0 : share);
  });
  return shares;
}
