# Dwains Dashboard Next

Dwains Dashboard Next is the next generation of Dwains Dashboard for Home Assistant.

It installs as a Home Assistant dashboard through HACS. It does not require a custom integration, Python files, YAML setup, or manual file uploads.

See this as Dwains Dashboard v4: totally rebuilt from scratch, with a completely new design and new features.

## Status

Dwains Dashboard Next is currently in alpha.

Current release: `1.1.0`

## What's New In 1.1.0

- App-style mobile bottom navigation.
- Mobile Home and Devices switchers that open as bottom sheets.
- Reworked mobile room headers with compact controls.
- Quick room controls for lights, switches and covers.
- New devices view for recently added Home Assistant devices.
- Device visibility controls to quickly hide or show devices in DD.
- DD3-style blueprint replacement management for standard area and device cards.
- Blueprint gallery support through a GitHub `blueprints.json` registry.
- Blueprint source tracking and update-check support.
- Cleaner mobile dialog layouts and dashboard settings.
- Improved status cards, room headers, home sections and mobile spacing.
- Discord, Buy Me a Coffee and PayPal links for support and feedback.

## Community And Support

- Chat and feedback: [Dwains Dashboard Discord](https://discord.gg/7yt64uX)
- Support development: [Buy Me a Coffee](https://www.buymeacoffee.com/FAkYvrx)
- Support development: [PayPal](https://www.paypal.me/dwainscheeren)

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

## Development

```bash
npm install
npm run type-check
npm run build
```

The production dashboard file is generated at:

```text
dist/dwains-dashboard-next.js
```

## HACS

This repository is structured as a HACS Dashboard plugin.

The dashboard file is:

```text
dist/dwains-dashboard-next.js
```

## License

Dwains Dashboard Next is proprietary software. The source is published for transparency and project development, but it is not open source. You may install and use official, unmodified releases for your own Home Assistant setup. You may not copy, modify, redistribute, rebrand, sell, publish, or use this software in another project without prior written permission from Dwain Scheeren.

See [LICENSE](LICENSE) for the full license terms.
