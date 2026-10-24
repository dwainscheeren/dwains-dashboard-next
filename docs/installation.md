# Installation

## Requirements

- Home Assistant 2026.5.0 or newer
- HACS

## Install Through HACS

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=dwainscheeren&repository=dwains-dashboard-next&category=dashboard)

1. Open HACS in Home Assistant.
2. Add `dwainscheeren/dwains-dashboard-next` as a custom repository.
3. Select repository type `Dashboard`.
4. Install `Dwains Dashboard Next`.
5. Reload Home Assistant frontend resources when Home Assistant asks for it.
6. Go to Settings, Dashboards, Add dashboard.
7. Select `Dwains Dashboard Next` from Community dashboards.

## YAML-Managed Lovelace Resources

HACS normally adds the JavaScript resource automatically. If your Home Assistant setup uses YAML-managed Lovelace resources, add the resource manually:

```yaml
lovelace:
  resources:
    - url: /hacsfiles/dwains-dashboard-next/dwains-dashboard-next.js
      type: module
```

Do not create a second `lovelace:` section. Merge the resource into the existing section, then restart Home Assistant or reload Lovelace resources and hard-refresh the browser.

## Add The Dashboard

After installation, create the dashboard from the native Home Assistant dashboard dialog:

1. Open Settings.
2. Open Dashboards.
3. Click Add dashboard.
4. Choose Dwains Dashboard Next.
5. Give it a name and save.

## Troubleshooting

### Configuration editor reports a missing export named 'D'

Update to **1.12.2 or newer** in HACS and fully reload Home Assistant. This fixes
an editor dependency that could mix files from different releases after an update.
If the old error remains, clear cached files for the affected Home Assistant
address and reopen it. Different hostnames, such as `homeassistant.local` and a
custom DNS name, can have separate caches. You do not need to recreate the
dashboard or change its configuration.

### "Error loading the dashboard strategy"

Home Assistant shows this when it cannot start the dashboard, for example "Timeout waiting for strategy element ll-strategy-dashboard-dwains-dashboard-next to be registered" or "Dwains Dashboard Next could not load its files".

- Refresh the page. On a wall tablet or in a kiosk browser, clear the browser cache of that device. This helps when the device still uses files from before an update.
- When you installed Dwains Dashboard Next by hand, copy the whole `dist` folder, including the `chunks` folder next to `dwains-dashboard-next.js`.
- Check that the resource `/hacsfiles/dwains-dashboard-next/dwains-dashboard-next.js` (type `module`) exists in **Settings > Dashboards > Resources**, or in your YAML resources.

Older browsers and webviews, for example on some wall displays, get the legacy frontend of Home Assistant, which loads slower. Since 1.12.1 Dwains Dashboard Next registers itself before it loads the rest, so it starts in time on these devices too.
