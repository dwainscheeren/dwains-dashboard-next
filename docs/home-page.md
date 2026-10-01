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

## Now Playing

When a media player is playing, Home shows a compact **Now playing** bar with the artwork, the title and artist (or the app name) and the room. Play/pause and next track buttons appear when the player supports them. Tap the bar to open the Home Assistant details dialog of the player.

- On desktop and tablet the bar sits below the greeting. On phones it floats just above the bottom navigation, and the page gets extra room at the bottom so the bar never covers a card.
- With several players playing, the most recently started one is shown, with a **+N** button that switches to the next player. A player you switched to or controlled stays in the bar while it is still playing or paused.
- A paused player stays in the bar for 5 minutes after it was paused, so it can be resumed. After that the bar disappears within a minute.
- Players follow the same visibility rules as the rest of the dashboard: hidden or disabled entities, entities of hidden devices, entities in hidden areas and entities hidden in their area are left out. Players without an area, like a Spotify account, are shown with their own name.

Choose where the bar appears in **Dashboard settings > Header & status > Now playing bar**: Off, Home only (default) or All pages (Home and every room page).

## Sections

The home page can show these sections:

- Areas
- Cameras
- House information
- To-do lists
- Favorites
- Scenes & scripts
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

## Scenes & scripts

A row of compact buttons that run the scenes and scripts you pick. Tap a button to activate a scene or start a script; the button shows a short check when Home Assistant accepted it, and a message appears when it failed.

- Scenes show when they were last activated.
- Scripts show when they last ran, and **Running** with a small pulsing dot while they are still running.

Open **Dashboard settings > Home page > Scenes & scripts** to choose them:

- **Add scene or script** searches all scenes and scripts by name, area or entity id.
- Drag an item, or use the up and down arrows on touch screens, to change the order.
- The delete button removes an item from the row. It does not delete the scene or script in Home Assistant.

The row stays hidden until at least one scene or script is picked. Scenes and scripts that were deleted or hidden in Home Assistant are skipped. Unavailable ones follow **Dashboard settings > Areas > Hide unavailable/unknown entities in area views**: hidden when it is on (the default), otherwise shown greyed out and disabled.

On desktop the buttons wrap over as many lines as needed. On mobile they scroll sideways like the other Home sections, and the grid button in the section heading shows all of them at once.

## Summaries

Summaries can show Home Assistant maintenance-style information such as repairs, updates and discovered devices.
