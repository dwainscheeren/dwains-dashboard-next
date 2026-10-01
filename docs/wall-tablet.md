# Wall Tablet Mode

Wall tablet mode turns a browser into a calm, always-on dashboard for a tablet on the wall.

When it is on:

- The Home Assistant header and sidebar are hidden on this dashboard, on every screen size. The Dwains Dashboard bottom navigation stays available for Home, Devices and your pages.
- The dashboard can return to the Home page after a period without input.
- A dimmed screensaver with a large clock can show after a period without input.

## Per Device, Not Per Dashboard

Dashboard settings are shared by every device that opens the dashboard. Wall tablet mode is different: it belongs to one device (one browser). The preferences are stored in the local storage of that browser, separately for each dashboard.

Turning it on for the tablet in the hallway changes nothing on your phone or desktop. Clearing the browser data of the tablet turns it off again.

## Turning It On

There are two ways:

1. Open **Dashboard settings**, then **Wall tablet** in the **This device** group, and turn on **Use this device as a wall tablet**. Changes apply right away. There is nothing to save, and these settings never mark the settings page as changed.
2. Open the dashboard on the tablet with `?dd_kiosk=1` at the end of the address:

   ```
   http://homeassistant.local:8123/dashboard-dwains/home?dd_kiosk=1
   ```

   The choice is stored on that device and the parameter is removed from the address. `?dd_kiosk=0` turns it off again. This also works for users who are not allowed to open the dashboard settings.

## The Way Out

Press and hold the clock or the greeting on the Home page for 3 seconds. The wall tablet menu opens with:

- **Open Home Assistant menu**: shows the Home Assistant sidebar again until the tablet returns to Home or the dashboard is left. Not shown when the Home Assistant menu is restricted for the user (see [User permissions](user-permissions.html)).
- **Dashboard settings**: only for users who may edit the dashboard.
- **Exit wall tablet mode**: turns the mode off for this device only.

On a phone sized screen the Home page shows no clock: press and hold the greeting instead. If nothing else works, open the dashboard with `?dd_kiosk=0`.

## Return to Home

Choose **Off**, 1, 2, 5, 10 or 30 minutes (5 minutes by default). After this long without touch, mouse, keyboard or scroll wheel input:

- Open Home Assistant dialogs, such as the more-info dialog, are closed.
- Edit mode, an area page or the settings page is left.
- The dashboard goes to its Home page and scrolls to the top.

Unsaved dashboard settings are never thrown away: while the settings page has unsaved changes, the tablet stays where it is. The same goes for an open card editor or blueprint dialog.

## Screensaver

Choose **Off** (the default), 1, 2, 5, 10 or 30 minutes. After this long without input a dimmed, full screen overlay shows:

- a large clock in the 12 or 24 hour format and time zone of your Home Assistant profile;
- the date;
- the outside temperature and condition of the weather entity of the dashboard, when there is one.

The clock moves to a new spot every minute to prevent burn-in. The first tap only wakes the screen and never presses the control below it. Moving the mouse does not wake it: tap, click, press a key or scroll.

**Screensaver darkness** sets how dark the overlay is: 60, 80 (default) or 95 percent. With reduced motion turned on in the operating system, the overlay and the clock move without animation.

## Tips

- Keep the screen awake and control its brightness with the kiosk browser or the Home Assistant app you use on the tablet.
- For a tablet that everyone in the house uses, combine wall tablet mode with the [user permissions](user-permissions.html) for non-admin users.
