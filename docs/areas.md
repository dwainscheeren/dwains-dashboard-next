# Areas

Area pages show the entities that belong to one Home Assistant area.

## Area Order

Dashboard settings offers three ordering modes for area lists:

- **Home Assistant** follows the area registry order
- **Custom order** uses a separate Dwains Dashboard order
- **Alphabetical** sorts by area name

The same order is used throughout the dashboard, including the desktop sidebar and mobile area picker.

## Area Header

The area header can show:

- Back button
- Area name
- Device count
- Temperature and humidity when available
- Quick controls for lights, switches and covers
- A thermostat when the area has one climate entity
- Edit button for admins

## Thermostat

When an area has exactly one visible climate entity and it is available, the area header shows a compact thermostat on desktop and mobile:

- The current temperature
- The target temperature with minus and plus buttons
- A chip with what the thermostat is doing, for example Heating, Cooling, Idle or Off

Minus and plus follow the entity's `target_temp_step` (0.5 for °C and 1 for °F when the entity does not set one) and stay between its `min_temp` and `max_temp`. The new target is shown right away. Dwains Dashboard waits until you stop tapping for a moment and then sends one `climate.set_temperature` with the final value. If Home Assistant rejects it, the old target comes back and a message is shown.

In `heat_cool` mode with a low and high target, or when the thermostat has no single target (for example while it is off), the header shows the values without minus and plus. Tap the current temperature, the target range or the chip to open the Home Assistant details dialog.

Areas with several climate entities keep the climate quick control, which opens a list of all climate entities. The thermostat can be turned off in **Dashboard settings > Areas > Show thermostat in the room header**.

## Entity Groups

Entities are grouped by type, for example:

- Lights
- Switches
- Covers
- Climate
- Motion
- Sensors
- Scenes
- Selectors
- To-do lists

To-do entities use Home Assistant's editable to-do list card, so list items can be viewed, completed and added directly from the area page.

## Quick Controls

Supported group actions include:

- Turn all lights on or off
- Turn all switches on or off
- Open or close all covers

## Unavailable Entities

Unavailable entities are hidden by default. This can be changed in Dashboard settings, Areas.

## Custom Cards

Custom cards can be added at the top of an area, inside a domain section, above generated cards, below generated cards, or at the bottom of an area.
