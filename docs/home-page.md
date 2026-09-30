# Home Page

The home page is the main dashboard overview.

## Header

The header can show:

- User avatar and greeting
- Home status summary
- Weather
- Notifications
- Time and date on desktop
- Settings button

## Sections

The home page can show these sections:

- Areas
- Cameras
- House information
- To-do lists
- Favorites
- Summaries

The order and visibility can be changed in Dashboard settings.

## Cameras

Every available camera in a visible area gets its own preview card. Unavailable cameras are hidden until they reconnect.

Open **Dashboard settings > Home page** to choose which camera previews appear on Home and change their order.

## House Information

House information can show:

- People
- Indoor climate
- Outdoor climate
- House power usage
- Device group cards such as lights, switches and covers

Each house information card can be enabled or disabled in Dashboard settings.

### Indoor and outdoor climate

The climate cards use the temperature and humidity sensors that are linked to each area in Home Assistant. Link them in **Settings > Areas, labels & zones**, open the area and choose its temperature and humidity sensor.

- **Indoor climate** shows the average of all visible areas. Open **Dashboard settings > Home page > House information > Indoor climate** to leave areas out of the average.
- **Outdoor climate** shows the areas you mark as outdoors, such as a garden or roof. Open **Dashboard settings > Home page > House information > Outdoor climate** to choose them. Outdoor areas are always left out of the indoor average, and hidden areas can be used too. The card only appears once an outdoor area with a linked sensor is selected.

## To-do Lists

Available Home Assistant `todo.*` entities appear as editable lists. Items can be added, completed and removed directly from the home page. General lists such as Shopping List do not need to be assigned to an area.

## Favorites

Favorites show pinned or automatically selected useful entities. On mobile, favorites use the same horizontal section behavior as other home sections.

## Summaries

Summaries can show Home Assistant maintenance-style information such as repairs, updates and discovered devices.
