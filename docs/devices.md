# Devices

The Devices page groups entities by domain and device type.

## Overview

On mobile, opening Devices first shows a device overview. From there you can open a group such as lights, covers, people, maintenance or energy.

Every group has the same page header as the area pages, with a back button to the overview, and uses the same page width. On desktop only the group list and the group itself scroll, so the page never shows a second scrollbar.

## Device Groups

Common groups include:

- New devices
- Maintenance
- Energy
- Lights
- Switches
- Covers
- Climate
- Cameras
- People
- Sensors

The visible groups can be changed in Dashboard settings, Devices page. The same page can hide single entities from the Devices page only, without hiding them in the rooms.

Inside a group the entities are listed per room, with the icon of each room. Lights, switches, fans, covers and locks get an action per room in the room heading:

- Lights, switches and fans: a switch that shows how many are on, for example **2/5**, when the room has more than one. It switches everything in the room off, or on when everything is off.
- Covers: open and close all covers of the room.
- Locks: lock and unlock all locks of the room. Unlocking always asks for confirmation.

The other room actions ask first when the master action confirmations in Dashboard settings are on for that type.

## Hidden And Unavailable Entities

Entities without an area are not shown in Dwains Dashboard. Unavailable entities are hidden by default and can be enabled in Dashboard settings.

## Maintenance

Maintenance focuses on entities that need attention, such as low battery entities and unavailable entities when enabled.

## Energy

The Energy page shows live power usage by area. It uses power entities from Home Assistant and groups them by area.

- **Whole house** shows the total with a graph of the last day. When a grid power sensor is set in the Home Assistant energy settings, the total and the graph come from those sensors (grid, solar and battery). Otherwise the total is the sum of the rooms, plus the devices of the energy settings that are in no room (see below).
- **Top area** is the room that uses the most right now, with its three biggest consumers.
- Every room gets a card with its total, a graph and its power sensors, each with a bar for its share of the room.

### Main meter and circuits

When a device in the Home Assistant energy settings has an **Upstream device**, for example the circuits below a main meter, Dwains Dashboard counts power like the Power dashboard of Home Assistant does.

- Only the power sensors of the devices in the energy settings count: on this page, in the House power usage popup, in the house total on Home and in the power badge of each room. A main meter measures everything behind it, so another power sensor, such as a smart plug or a device that reports its own power, is usually fed by it as well and would be counted twice. Other power sensors stay on the room pages as entities, they only leave the numbers. With a grid power sensor the house total still comes from the grid; only the rooms change.
- To count such a sensor, add its device to the energy settings with the main meter or its circuit as Upstream device. Home Assistant needs an energy sensor (kWh) for every device there; for a device that only reports power, create one first with the Integral sensor helper. Without an Upstream device anywhere, every power sensor in your rooms counts, as before.
- When the total is not based on a grid power sensor, the whole house card and the house total on Home say how many power sensors from the energy settings they count, for example **13 power sensors from the energy settings**.
- The hierarchy needs a power sensor on those devices in the energy settings. A hierarchy of energy sensors (kWh) alone cannot be used for live power, and then every power sensor counts.
- A sensor below another one counts in full. The sensor above it only counts the part the sensors below it do not measure, also when they are in different rooms. Its row shows that part with the full reading below the name, for example **Untracked part of 3.2 kW**.
- A sensor below another one that is hidden is not counted on its own, so its usage stays part of the untracked part of the one above.
- When the sensors below one read more than it does, for example because they report at different moments, they count in full and the one above counts 0 W.
- A device without an area, or in a hidden room, is in no room. When the total is not based on a grid power sensor, it still counts for the whole house, and the whole house card shows how much of the total is measured in the areas. A sensor that is hidden itself (hidden or disabled in Home Assistant, a configuration or diagnostic entity, hidden in its room or part of a hidden device) does not count at all.
- The power badge of an area follows the hierarchy for the sensors in that area. Circuits in another room are not taken off it, so the badge of the room with the main meter can be higher than its card on this page.
- Dwains Dashboard reads the energy settings when it loads and again every 10 minutes. Reload the page to see a change right away.

Graphs only include sensors with long term statistics (a state class). The House power usage popup on Home shows the same overview.
