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
