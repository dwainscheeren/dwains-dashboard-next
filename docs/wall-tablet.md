# Wall Tablet Mode

Wall tablet mode turns a browser into a calm, always-on dashboard for a tablet on the wall.

When it is on:

- The Home Assistant header and sidebar are hidden on this dashboard, on every screen size. The Dwains Dashboard bottom navigation stays available for Home, Devices and your pages.
- The dashboard can return to the Home page after a period without input.
- A screensaver can show after a period without input: a large clock on the dimmed dashboard, one image, or a slideshow of your own photos.

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

Choose **Off** (the default), 1, 2, 5, 10 or 30 minutes. After this long without input the screensaver shows. The first tap only wakes the screen and never presses the control below it. Moving the mouse does not wake it: tap, click, press a key or scroll.

**Screensaver shows** sets what you see:

- **Clock** (the default): a large clock on the dimmed dashboard.
- **Image**: one image that fills the screen.
- **Slideshow**: the photos of a folder, one after the other.

Use **Try the screensaver** to see the result right away, without waiting. It also works while wall tablet mode is off.

### Clock

A dimmed, full screen overlay shows:

- a large clock in the 12 or 24 hour format and time zone of your Home Assistant profile;
- the date;
- the outside temperature and condition of the weather entity of the dashboard, when there is one.

The clock moves to a new spot every minute to prevent burn-in. **Screensaver darkness** sets how dark the overlay is: 60, 80 (default) or 95 percent.

### Image

Enter a link, or choose an image from your Home Assistant media:

- A link starts with `/` for a file on your Home Assistant, or with `http://` or `https://`. A file in the `www` folder of your configuration is available as `/local/`, for example `/local/photo.jpg` for `www/photo.jpg`.
- **Choose from media** opens your Home Assistant media, such as **My media** and the images you uploaded in Home Assistant.

When the image cannot be loaded, the screensaver shows the clock instead.

### Slideshow

**Choose folder** opens your Home Assistant media. Open the folder with your photos and choose **Use this folder**. The settings page then shows how many photos it found.

- The folder comes from the Home Assistant media sources: **My media** (the `media` folder of Home Assistant), uploaded images and photo integrations that add a media source. Add photos to **My media** in Home Assistant under **Media > My media**, or copy them to the `media` folder.
- Photos in subfolders are included, up to 3 levels deep. At most 500 photos and 40 folders are read.
- Images that a browser can show are used, such as JPEG, PNG, WebP, GIF and AVIF. Other files, such as videos, are skipped.
- **Change photo every** sets how long a photo stays: 10 or 30 seconds (default 30), or 1, 5 or 15 minutes.
- **Shuffle photos** (on by default) shows them in a random order. Every photo is shown once before the next round starts.
- New photos in the folder are picked up when the screensaver starts, at most once every 30 minutes.

Photos fade into each other. A photo that cannot be loaded is skipped.

### Photo options

These apply to the image and to the slideshow:

- **Photo size**: **Fill screen** (the default) fills the screen and can cut off the edges. The photo then moves very slowly, so it never stands still on the screen. **Whole photo** shows the whole photo with black bars where needed.
- **Clock on photos** (on by default) shows the time, date and weather in the bottom left corner. Turn it off for photos only.
- **Photo darkness** darkens the photos by 0, 20 (default), 40 or 60 percent, for a calmer screen in the evening.

The image, the folder and these options are stored on the device, like the other wall tablet settings. Each tablet can show its own photos.

With reduced motion turned on in the operating system, the screensaver shows without the slow movement and with a short fade.

## Tips

- Keep the screen awake and control its brightness with the kiosk browser or the Home Assistant app you use on the tablet.
- Large photos take longer to load on an older tablet. Photos of around the screen size of the tablet work best.
- For a tablet that everyone in the house uses, combine wall tablet mode with the [user permissions](user-permissions.html) for non-admin users.
