import { ddLocalize, hasDdTranslation } from './localize';

/** Convert an unknown raw domain name into a readable fallback. */
export function prettifyDomain(domain: string): string {
  return domain
    .split('_')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

/** Localized name for a Home Assistant entity domain. */
export function getDomainName(hass: any, domain: string): string {
  const key = `domain.${domain}`;
  return hasDdTranslation(key) ? ddLocalize(hass, key) : prettifyDomain(domain);
}

/** Localized name for a Home Assistant device class. */
export function getDeviceClassName(hass: any, deviceClass: string): string {
  const key = `device_class.${deviceClass}`;
  return hasDdTranslation(key) ? ddLocalize(hass, key) : prettifyDomain(deviceClass);
}
