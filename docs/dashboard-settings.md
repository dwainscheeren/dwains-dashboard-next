# Dashboard Settings

Dashboard settings are opened from the gear button in the dashboard header.

Settings are split into pages so large dashboards remain manageable.

## Dashboard

Change the dashboard name and sidebar icon.

## Home Page

Configure:

- Home section order
- Visible home sections, including **Now playing**
- House information cards
- Favorites behavior
- Notifications visibility
- Weather and alarm display

Drag a section to its new place; the list follows while you drag and the order is kept when you drop it. The move up/down buttons do the same with a keyboard or on touch screens. The **Favorites** row has a **Manage favorites** link to the Favorites page.

## Favorites

Pick the entities you always want at hand and choose whether Home Assistant's suggested favorites are added. Favorites appear on Home and, for the favorites of a room, at the top of that room page. The Home page and Areas settings link here with **Manage favorites**.

## Header And Status

Configure which status information appears in the header:

- Weather
- Notifications
- Alarm entity
- Home summary text

If no alarm entity is selected, no alarm chip is shown. **Show the alarm chip on the home page** hides the chip without removing the selected alarm. Removing the alarm turns the switch off; picking an alarm again turns it back on.

The Now playing bar is a section of the Home page and has its own switch for the room pages, see [Now playing](home-page.html#now-playing).

## Controls And Confirmations

### Tapping a tile

Choose what a tap on the tile of a light, switch, fan or input boolean does:

- **Open details** (default): a tap opens the details of Home Assistant. The switch on the tile turns it on or off.
- **Turn on or off**: a tap turns it on or off. Hold the tile for half a second to open the details. A right click, the menu key or Shift+F10 opens the details too.

This works on the room pages, the favorites on Home, the device popups and the Devices page. Covers, locks and other tiles keep opening the details on a tap. Moving your finger while holding scrolls the page and does not open anything. An entity that is unavailable opens its details instead of turning on or off. Cards replaced by a blueprint keep their own tap and hold actions.

### Master action confirmation

Choose which area-wide master controls, such as all lights in a room, ask for confirmation before they change every matching entity. The controls of a single entity always work right away.

## People

Choose which people are shown in Dwains Dashboard.

## Areas

Configure:

- Visible areas
- Area order mode:
  - **Home Assistant** follows the order configured in Home Assistant
  - **Custom order** stores a separate order for Dwains Dashboard
  - **Alphabetical** sorts areas by their localized name
- Area icons
- Area entity ordering
- Whether unavailable area entities are shown
- **Leave the room name out of entity names** (on by default): room pages, the Devices page and device lists show "Ceiling light" instead of "Living room Ceiling light". Only the whole room name at the start or end of a name is removed, also between brackets, so "Wohnzimmerlampe" stays as it is.
- Whether rooms with one climate entity show a thermostat in the room header (on by default)
- **Show favorites on room pages** (on by default)
- **Show Now playing on room pages**

Custom order supports dragging on desktop and move up/down controls on touch devices. While you drag, the list follows the pointer; the order is saved when you drop. New areas that are added later are appended without changing the order of existing areas. The selected order is used consistently in the desktop sidebar, mobile area menu and area overviews. **Reset area list** shows hidden areas again and goes back to alphabetical order, after a confirmation.

### Room settings

Open an area to change how its page is built:

- Group entities by type, or show them in one freely ordered list.
- Reorder the type groups and the entities in them by dragging or with the move up/down buttons.
- Fold a group to keep the list short.
- Hide single entities, or a whole group with the eye button on the group header. The eye shows when a group is partly hidden. Hiding a group hides the entities it has now, so entities added later are still shown.
- **Use this type order for all rooms** copies the order of the type groups to every room, after you changed it.
- **Reset room layout** goes back to grouping by type in the default order and shows every entity again. Custom cards stay; cards placed between freely ordered entities move to the bottom.

## Devices Page

Configure:

- Whether unavailable entities are visible
- Whether the New devices menu is shown
- What the Devices page shows, in a tree of types, areas, devices and entities:
  - The eye of a type hides that type group.
  - The eye of an area or an entity hides those entities on the Devices page only. Rooms and Home keep showing them.
  - The switch of a device hides the complete device in all of Dwains Dashboard, like **Hide** in the New devices menu.
  - An eye shows when part of a type or area is hidden.

**Show everything again** clears hidden types, entities and devices, after a confirmation.

## Blueprint Replacements

Replace generated entity cards with blueprint cards for specific domains.

## User Permissions

Restrict what non-admin users can see or edit.

## Support

Configure support links and SmartHomeShop links.

## Wall Tablet (This Device)

Turn the current browser into a wall tablet: hide the Home Assistant header and sidebar, return to Home after inactivity and show a screensaver with a clock, an image or a slideshow of your photos. These settings are stored on this device only and are applied right away, without saving. See [Wall tablet mode](wall-tablet.html).
