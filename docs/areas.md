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
- Quick control tiles for lights, switches, covers (one per cover group), fans and climate
- A thermostat when the area has one climate entity
- A camera button when the area has an available camera
- A button with the number of hidden unavailable entities
- Edit button for admins

On desktop and tablet the header is a card: the name and buttons on the first row, the quick control tiles and the thermostat below. When the area has a picture, the picture fills the header.

On phones the back and other buttons sit at the top, with the area name in large text below them. The quick control tiles scroll sideways and the thermostat uses the full width. Once you scroll down, a slim bar with the area name, the temperature and humidity and the buttons stays at the top of the screen. Scroll up a little to show the quick control tiles in that bar as well.

## Thermostat

When an area has exactly one visible climate entity and it is available, the area header shows a compact thermostat on desktop and mobile:

- The current temperature
- The target temperature with minus and plus buttons
- A chip with what the thermostat is doing, for example Heating, Cooling, Idle or Off

Minus and plus follow the entity's `target_temp_step` (0.5 for °C and 1 for °F when the entity does not set one) and stay between its `min_temp` and `max_temp`. The new target is shown right away. Dwains Dashboard waits until you stop tapping for a moment and then sends one `climate.set_temperature` with the final value. If Home Assistant rejects it, the old target comes back and a message is shown.

In `heat_cool` mode with a low and high target, or when the thermostat has no single target (for example while it is off), the header shows the values without minus and plus. Tap the current temperature, the target range or the chip to open the Home Assistant details dialog.

Areas with several climate entities keep the climate quick control, which opens a list of all climate entities. The thermostat can be turned off in **Dashboard settings > Areas > Show thermostat in the room header**.

## Favorites

The favorites that belong to the area are shown as a **Favorites** group at the top of the page, above the other groups. Tap the heading to fold or unfold it; the choice is remembered on this device. Turn the group off in **Dashboard settings > Areas > Show favorites on room pages**, and pick favorites in **Dashboard settings > Favorites**.

## Entity Names

Entity tiles leave out the area name, so the Living room page shows "Ceiling light" instead of "Living room Ceiling light". The area name is removed at the start or the end of a name, also between brackets, but only as a whole word. Turn this off in **Dashboard settings > Areas > Leave the room name out of entity names**.

## Entity Groups

Most entities are grouped by domain, for example Lights, Switches, Climate, Sensors, Scenes and To-do lists. Covers, binary sensors and alarms are grouped by what they do:

- **Windows & doors**: covers with the `door` or `window` device class and binary sensors with the `door`, `window` or `opening` device class
- **Shading**: all other covers, such as blinds, shades, shutters, curtains, awnings, dampers and covers without a device class
- **Gates**: covers with the `garage` or `gate` device class and binary sensors with the `garage_door` or `gate` device class
- **Motion & presence**: binary sensors with the `motion`, `moving`, `occupancy` or `presence` device class
- **Safety & alarms**: binary sensors with the `smoke`, `gas`, `carbon_monoxide`, `moisture`, `safety`, `tamper`, `problem`, `heat` or `cold` device class, and alarm panels
- **Selectors**: both `select` and `input_select` entities
- Other binary sensors stay in **Binary sensors**

Tap a group title to collapse or expand its cards. This is remembered until the page is reloaded, and groups are always open in edit mode. On phones the button in front of the title still switches between swipe and grid cards.

When a group with a master switch (lights, switches, fans and toggles) has more than one entity, the switch shows how many are on, for example **2 of 5 on**, in place of the item count next to the title. Cover groups have open all and close all buttons instead.

Tap a card to open the Home Assistant details dialog; the switch on a light, switch or fan card turns it on or off. To turn lights, switches and fans on or off with a tap on the whole card and open the details by holding it, choose **Turn on or off** in [Dashboard settings > Controls & confirmations](dashboard-settings.md#tapping-a-tile).

Select and input select cards show the current option on one line. Tap the card to open the Home Assistant details dialog, or tap the round chevron button to pick another option from the list.

To-do entities use Home Assistant's editable to-do list card, so list items can be viewed, completed and added directly from the area page.

Configurations from before these groups keep working: a saved group order or entity order for the old `cover` group applies to all three cover groups, and custom cards placed in the old cover group now show in Shading. Cards placed with input selects or alarm panels move to Selectors and Safety & alarms.

## Quick Controls

Each quick control tile shows the group and its state, for example **Lights, 2 of 5 on** or **Shading, Closed**. Supported group actions include:

- Turn all lights on or off
- Turn all switches on or off
- Turn all fans on or off
- Open or close all covers of one cover group. Shading, Windows & doors and Gates each get their own tile when the area has covers of that kind, so closing the blinds never opens or closes the garage door.
- Open a list of all climate entities (when the area has several)

## Unavailable Entities

Unavailable entities are hidden by default. This can be changed in Dashboard settings, Areas.

## Power And Energy Sensors

Sensors that measure power or energy, such as the Powercalc sensors of every lamp, can make a room page long. Turn on **Hide power and energy sensors on room pages** in Dashboard settings, Areas, to leave them off the room pages. The Energy page, the House power usage popup and the power badge of the room still count the power sensors among them. A single room can show them anyway with **Show power and energy sensors in this room** in its room settings. See [Areas](dashboard-settings.md#areas).

## Custom Cards

Custom cards can be added at the top of an area, inside a domain section, above generated cards, below generated cards, or at the bottom of an area.

In a room with one freely ordered list, a card whose place is no longer on the page, because it comes after the last entity shown or belongs to a type group with no entity shown (for example when power and energy sensors are hidden), is shown at the end of the list instead of disappearing. Moving entities in that list keeps the place of the entities the page does not show. A card's place counts the entities shown on the page, so hiding entities can move a card within the list; the room settings show every entity and count those.
