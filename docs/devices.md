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

- **Whole house** shows the total with a graph of the last day. When a grid power sensor is set in the Home Assistant energy settings, the total and the graph come from those sensors (grid, solar and battery). Otherwise the total is the sum of the rooms, plus the untracked part of a main meter that is in no room (see below).
- **Top area** is the room that uses the most right now, with its three biggest consumers.
- Every room gets a card with its total, a graph and its power sensors, each with a bar for its share of the room.

### Main meter and circuits

When a device in the Home Assistant energy settings has an **Upstream device**, for example a main meter above the circuits it feeds, Dwains Dashboard follows that hierarchy like the energy dashboard does, so the main meter and its circuits are counted once.

- It needs a power sensor on those devices in the energy settings. A hierarchy of energy sensors (kWh) alone cannot be used for live power.
- A sensor below another one counts in full. The sensor above it only counts the part the sensors below it do not measure, also when they are in different rooms. Its row shows that part with the full reading below the name, for example **Untracked part of 3.2 kW**.
- Sensors below it that are hidden, have no area or are in a hidden room are not counted on their own, so their usage stays part of that untracked part.
- When the sensors below one read more than it does, for example because they report at different moments, they count in full and the one above counts 0 W.
- A main meter without an area, or in a hidden room, is in no room. When the total is not based on a grid power sensor, its untracked part still counts for the whole house, and the whole house card shows how much of the total is measured in the areas. A main meter that is hidden itself (hidden or disabled in Home Assistant, a configuration or diagnostic entity, hidden in its room or part of a hidden device) does not count at all.
- A power sensor that is not part of the hierarchy, such as a smart plug, still counts in full, also when it is fed by the main meter. Add it to the energy settings with the main meter or its circuit as Upstream device to count it once.
- The power badge of an area follows the hierarchy for the sensors in that area. Circuits in another room are not taken off it, so the badge of the room with the main meter can be higher than its card on this page.
- Dwains Dashboard reads the energy settings when it loads and again every 10 minutes. Reload the page to see a change right away.

Graphs only include sensors with long term statistics (a state class). The House power usage popup on Home shows the same overview.
