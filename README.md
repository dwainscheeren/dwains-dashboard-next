# Dwains Dashboard Next

Dwains Dashboard Next is the next generation of Dwains Dashboard for Home Assistant.

It installs as a Home Assistant dashboard through HACS. It does not require a custom integration, Python files, YAML setup, or manual file uploads.

## Status

This is the first public release of the new dashboard codebase.

## Requirements

- Home Assistant 2026.5.0 or newer
- HACS

## Installation

1. Open HACS in Home Assistant.
2. Add this repository as a custom repository.
3. Select the repository type `Dashboard`.
4. Install `Dwains Dashboard Next`.
5. Reload Home Assistant frontend resources if Home Assistant asks for it.
6. Go to Settings, Dashboards, Add dashboard.
7. Select `Dwains Dashboard Next` from Community dashboards.

## What It Does

- Creates an automatic dashboard based on Home Assistant areas, devices, entities and floors.
- Registers itself in the native Add dashboard dialog.
- Runs fully in the frontend as a JavaScript dashboard resource.
- Does not require installing a Home Assistant integration.

## HACS

This repository is structured as a HACS Dashboard plugin.

The dashboard file is:

```text
dist/dwains-dashboard-next.js
```

## License

Dwains Dashboard Next is proprietary software. You may install and use official, unmodified releases for your own Home Assistant setup. You may not copy, modify, redistribute, rebrand, sell, publish, or use this software in another project without prior written permission from Dwain Scheeren.

See [LICENSE](LICENSE) for the full license terms.
