const e=["en","nl","de","fr","es","zh-hans","zh-hant"],t={en:{"common.save":"Save","common.back":"Back","common.close":"Close","common.cancel":"Cancel","common.add":"Add","common.next":"Next","common.edit":"Edit","common.manage":"Manage","common.apply":"Apply","common.delete":"Delete","common.loading":"Loading…","common.no_content":"No dashboard content available","common.saving":"Saving…","common.refresh":"Refresh","common.dismiss":"Dismiss","common.dismiss_all":"Dismiss all","common.select_option":"Select option","common.view_all":"View all","common.see_all":"See all","common.show":"Show","common.hide":"Hide","common.enable":"Enable","common.disable":"Disable","common.remove":"Remove","common.on":"On","common.off":"Off","common.open":"Open","common.closed":"Closed","common.unknown":"Unknown","common.unavailable":"Unavailable","common.none":"None","common.entity.one":"{count} entity","common.entity.other":"{count} entities","common.device.one":"{count} device","common.device.other":"{count} devices","common.item.one":"{count} item","common.item.other":"{count} items","common.sensor.one":"{count} sensor","common.sensor.other":"{count} sensors","common.area.one":"{count} area","common.area.other":"{count} areas","common.person.one":"{count} person","common.person.other":"{count} people","common.favorite.one":"{count} favorite","common.favorite.other":"{count} favorites","common.active.one":"{count} active","common.active.other":"{count} active","common.just_now":"just now","sidebar.home":"Home","sidebar.add_blueprint":"Add blueprint","sidebar.dashboard_settings":"Dashboard settings","sidebar.section_title":"Dwains Dashboard","sidebar.areas":"Areas","sidebar.show":"Show area sidebar","sidebar.collapse":"Collapse area sidebar","sidebar.resize":"Resize area sidebar","sidebar.resize_drag":"Drag to resize area sidebar","navigation.menu":"Menu","navigation.pages":"Pages","navigation.profile_settings":"Profile settings","navigation.profile_description":"Open your Home Assistant profile","navigation.back_home":"Back to home","navigation.open_menu":"Open menu","navigation.current_page":"Current page","navigation.open_page":"Open page","navigation.overview":"Overview","navigation.all_device_groups":"All device groups","favorites.title":"Favorites","favorites.empty":"No favorites selected yet.","favorites.swipe":"Swipe favorites","favorites.show_all":"Show all favorites","favorites.switch_swipe":"Switch favorites to swipe cards","person.home":"Home","person.away":"Away","person.nobody_home":"Nobody home","layout.custom_cards":"Custom cards","layout.add_card":"Add card","layout.done_editing":"Done editing","layout.edit_custom_cards":"Edit custom cards","layout.custom_cards_top":"Top of area","layout.custom_cards_after":"Below {section}","layout.custom_cards_bottom":"Bottom of area","layout.drag_card":"Drag card","layout.edit_page":"Edit page","layout.page_settings":"Settings / fill in again","layout.delete_page":"Delete page","layout.delete_page_confirm":'Delete page "{name}"?',"layout.delete_card_confirm":"Delete this card?","layout.save_page_failed":"Could not save the page (see console):\n{error}","layout.save_card_failed":"Could not save the card (see console):\n{error}","layout.swipe_cards":"Swipe cards","layout.show_all_cards":"Show all cards","layout.switch_swipe_cards":"Switch to swipe cards","home.notifications":"Notifications","home.notifications_description":"Persistent notifications from Home Assistant","home.notifications_loading":"Loading notifications…","home.notifications_empty":"No persistent notifications","home.notification":"Notification","home.summaries":"Summaries","home.house_information":"House information","home.cameras":"Cameras","home.areas":"Areas","home.unassigned_spaces":"Unassigned spaces","home.devices_discovered":"Devices discovered","home.repairs":"Repairs","home.updates":"Updates","home.house_power_usage":"House power usage","home.no_live_power_sensors":"No live power sensors","home.no_room_power_usage":"No room power usage right now","home.indoor_climate":"Indoor climate","home.average_temperature":"Average temperature","home.average_humidity":"Average humidity","home.temperature":"Temperature","home.humidity":"Humidity","home.view_sensors":"View sensors","home.people":"People","home.no_people":"No people","home.no_visible_people":"No visible persons configured","home.attention.one":"{count} item needs attention","home.attention.other":"{count} items need attention","home.everything_calm":"Everything looks calm","home.outside_weather":"Outside weather","home.outside":"Outside","home.alarm_armed":"Armed","home.alarm_disarmed":"Disarmed","home.good_morning":"Good morning","home.good_afternoon":"Good afternoon","home.good_evening":"Good evening","home.swipe_house_information":"Swipe house information","home.show_all_house_information":"Show all house information","home.switch_house_information_swipe":"Switch house information to swipe cards","home.swipe_cameras":"Swipe cameras","home.show_all_cameras":"Show all cameras","home.switch_cameras_swipe":"Switch cameras to swipe cards","home.swipe_areas":"Swipe areas","home.show_all_areas":"Show all areas","home.switch_areas_swipe":"Switch areas to swipe cards","status.light_on.one":"{count} light on","status.light_on.other":"{count} lights on","status.switch_on.one":"{count} switch on","status.switch_on.other":"{count} switches on","status.cover_open.one":"{count} cover open","status.cover_open.other":"{count} covers open","status.fan_on.one":"{count} fan on","status.fan_on.other":"{count} fans on","status.lock_unlocked.one":"{count} lock unlocked","status.lock_unlocked.other":"{count} locks unlocked","status.climate_active.one":"{count} climate active","status.climate_active.other":"{count} climate active","status.media_playing.one":"{count} media player playing","status.media_playing.other":"{count} media players playing","status.vacuum_cleaning.one":"{count} vacuum cleaning","status.vacuum_cleaning.other":"{count} vacuums cleaning","status.alarm_armed.one":"{count} alarm armed","status.alarm_armed.other":"{count} alarms armed","status.door_open.one":"{count} door open","status.door_open.other":"{count} doors open","status.window_open.one":"{count} window open","status.window_open.other":"{count} windows open","status.opening_open.one":"{count} opening open","status.opening_open.other":"{count} openings open","status.motion_detected":"{count} motion detected","status.smoke_detected":"{count} smoke detected","status.gas_detected":"{count} gas detected","status.moisture_detected":"{count} moisture detected","status.occupancy_detected":"{count} occupancy detected","status.presence_detected":"{count} presence detected","status.tamper_detected":"{count} tamper detected","status.vibration_detected":"{count} vibration detected","status.safety_active":"{count} safety active","action.turn_on":"Turn on","action.activate":"Activate","action.open_camera":"Open camera","action.turn_off":"Turn off","action.more_info":"More info","action.turn_on_all":"Turn on all","action.turn_off_all":"Turn off all","action.open_all":"Open all","action.close_all":"Close all","action.lock_all":"Lock all","action.unlock_all":"Unlock all","action.all_lights_on":"All lights on","action.all_lights_off":"All lights off","action.all_switches_on":"All switches on","action.all_switches_off":"All switches off","action.toggle_lights":"Toggle lights","action.toggle_switches":"Toggle switches","action.toggle_covers":"Toggle covers","action.confirm_lights":"Are you sure you want to toggle all lights in this area?","action.confirm_switches":"Are you sure you want to toggle all switches in this area?","action.scene_activated":"Scene activated","action.open":"Open","action.close":"Close","action.stop":"Stop","action.lock":"Lock","action.unlock":"Unlock","action.confirm_bulk":"{action} {entities}?","action.lights_on_summary":"Turn all lights on ({total})","action.lights_off_summary":"Turn all lights off ({active}/{total} on)","action.switches_on_summary":"Turn all switches on ({total})","action.switches_off_summary":"Turn all switches off ({active}/{total} on)","action.covers_open_summary":"Open all covers ({total})","action.covers_close_summary":"Close all covers ({active}/{total} open)","entity.not_activated":"Not activated yet","entity.no_events":"No events yet","entity.power_usage":"Power usage","entity.select_value":"Select value","entity.update_failed":"Could not update entity","entity.selector_failed":"Could not update selector","entity.cover_failed":"Could not update cover","entity.brightness":"{value}% brightness","entity.climate_set":"set {value}","entity.lock_failed":"Could not update lock","entity.lights_failed":"Could not update lights","entity.switches_failed":"Could not update switches","entity.covers_failed":"Could not update covers","entity.group_failed":"Could not update group","page.add_title":"Add a blueprint page","page.add_desc":"Import a blueprint to add it as a new tab in the top menu.","blueprint.title_add":"Add blueprint","blueprint.title_setup":"Set up blueprint","blueprint.title_edit":"Edit page","blueprint.tab_paste":"Paste","blueprint.tab_url":"From URL","blueprint.tab_gallery":"Gallery","blueprint.gallery_hint":"Choose a blueprint from the official list.","blueprint.gallery_empty":"No blueprints found.","blueprint.gallery_failed":"Could not load the blueprint list: {error}","blueprint.paste_hint":"Paste the full blueprint YAML (page.yaml) here.","blueprint.url_hint_html":"Paste a GitHub URL to the <code>page.yaml</code> (or its folder). I will fetch the blueprint automatically.","blueprint.loading":"Loading…","blueprint.fetch":"Fetch","blueprint.invalid_url":"Enter a valid URL.","blueprint.fetch_failed":"Fetch failed (HTTP {status}).","blueprint.load_failed":"Could not load the blueprint: {error}. Tip: use the 'raw' URL of the page.yaml file or paste the YAML.","blueprint.fill_failed":"Filling in failed: {error}","blueprint.new_page":"New page","blueprint.page_fallback":"Page","blueprint.missing_cards":"These card(s) do not seem to be installed yet: {cards}. Install them via HACS, otherwise those cards will stay empty.","blueprint.page_name":"Page name","blueprint.sidebar_icon":"Sidebar icon","blueprint.settings":"Settings","blueprint.no_fields":"This blueprint has no configurable fields.","blueprint.edit_yaml":"Edit YAML","blueprint.apply":"Apply","blueprint.check_update":"Check for update","blueprint.checking":"Checking…","blueprint.up_to_date":"Already up to date (v{version}).","blueprint.update_available":"New version available: v{new} (current v{current}).","blueprint.source_missing":"No source URL found and no matching official blueprint was found in the gallery.","blueprint.update":"Update","card_editor.title_add":"Add card","card_editor.title_setup":"Set up card","card_editor.title_edit":"Edit card","card_editor.search":"Search card","card_editor.visual_editor":"Visual editor","card_editor.code_editor":"Code editor","card_editor.loading":"Loading editor…","card_editor.preview":"Preview","card_editor.no_preview":"No preview for this card type.","card_type.tile.label":"Tile","card_type.tile.desc":"Compact card for a single entity with quick controls.","card_type.entities.label":"Entities","card_type.entities.desc":"List of entities with state and controls.","card_type.button.label":"Button","card_type.button.desc":"Large button to toggle an entity.","card_type.gauge.label":"Gauge","card_type.gauge.desc":"Shows a numeric value as a gauge.","card_type.history.label":"Graph","card_type.history.desc":"Historical graph of entities.","card_type.sensor.label":"Sensor","card_type.sensor.desc":"Sensor value with an optional graph.","card_type.thermostat.label":"Thermostat","card_type.thermostat.desc":"Controls for a climate entity.","card_type.weather.label":"Weather","card_type.weather.desc":"Weather forecast.","card_type.markdown.label":"Markdown","card_type.markdown.desc":"Free text with formatting and templates.","card_type.picture.label":"Image","card_type.picture.desc":"Shows an image or camera.","card_type.glance.label":"Glance","card_type.glance.desc":"Compact overview of multiple entities.","card_type.media.label":"Media","card_type.media.desc":"Controls for a media player.","card_type.manual.label":"Manual (YAML)","card_type.manual.desc":"Type or paste the YAML for any card yourself.","strategy.dashboard_desc":"Adjust the name and sidebar icon of this dashboard.","strategy.name":"Name","strategy.sidebar_icon":"Sidebar icon","strategy.back":"Back","strategy.save_name_failed":"Saving name/icon failed (see console):\n{error}","strategy.edit_area_alert":"Open Home Assistant settings > Areas & zones to edit the area.","devices.title":"Devices","devices.empty":"No devices found.","devices.new":"New devices","devices.new.one":"{count} new device","devices.new.other":"{count} new devices","devices.maintenance":"Maintenance","devices.energy":"Energy","devices.invalid_configuration":"Invalid configuration","devices.all_good":"Everything looks good","devices.live_power_usage":"Live power usage by area","devices.live_power_sensor.one":"{count} live power sensor","devices.live_power_sensor.other":"{count} live power sensors","devices.power_entity.one":"{count} power entity","devices.power_entity.other":"{count} power entities","devices.whole_house":"Whole house","devices.whole_house_history":"Whole house power history","devices.top_area":"Top area","devices.total_now":"Total now","devices.no_power_title":"No live power sensors found","devices.no_power_description":"Energy will appear here when power sensors are assigned to visible areas.","devices.maintenance_empty":"No low batteries or unavailable devices right now.","devices.added_just_now":"Added just now","devices.group.one":"{count} device group","devices.group.other":"{count} device groups","devices.low_battery.one":"{count} low battery","devices.low_battery.other":"{count} low batteries","devices.unavailable_device.one":"{count} unavailable device","devices.unavailable_device.other":"{count} unavailable devices","devices.new_description":"Devices added to Home Assistant in the last {hours} hours.","devices.new_empty":"No devices were added to Home Assistant in the last {hours} hours.","devices.save_visibility_failed":"Could not save device visibility:\n{error}","dialog.active_empty":"No active entities found","dialog.problem_empty":"No problematic entities found","dialog.power_sensors":"Power sensors","dialog.motion_sensors":"Motion sensors","dialog.door_sensors":"Door sensors","dialog.window_sensors":"Window sensors","dialog.smoke_sensors":"Smoke detectors","dialog.gas_sensors":"Gas detectors","dialog.moisture_sensors":"Moisture sensors","dialog.occupancy_sensors":"Occupancy sensors","dialog.opening_sensors":"Opening sensors","dialog.presence_sensors":"Presence sensors","dialog.safety_sensors":"Safety sensors","dialog.tamper_sensors":"Tamper sensors","dialog.vibration_sensors":"Vibration sensors","dialog.no_area":"No area","replacement.title":"Blueprint replacements","replacement.domain_replacements":"Domain replacements","replacement.assign":"Assign replacement","replacement.domain":"Domain","replacement.empty":"No replacements configured.","replacement.loading_blueprint":"Loading blueprint…","replacement.entity_hint":"Entity and name are filled automatically for each rendered entity.","replacement.applies_to":"Will be applied to {domain} entities in both views.","replacement.views_title":"Area view + Devices view","replacement.views_description":"Domain replacements are applied to standard entity cards in both views, like DD3.","replacement.target":"Domain · {domain}","replacement.applies_hint":"Applies to matching entities in both area and devices views.","replacement.search":"Search replace-card blueprints","replacement.load_failed":"Could not load {name}: {error}","settings.title":"Dwains Dashboard settings","settings.subtitle":"Choose a section to configure. Changes are saved with the Save button below.","settings.loaded_version":"Loaded version","settings.loading":"Loading","settings.all_settings":"All settings","settings.dashboard_layout":"Dashboard layout","settings.dashboard":"Dashboard","settings.dashboard_description":"Name and sidebar icon.","settings.current_dashboard":"Current dashboard","settings.default_dashboard_locked":"The default Home Assistant dashboard name cannot be edited here.","settings.open_instance":"Open a Dwains Dashboard instance to edit its name and sidebar icon.","settings.home_page":"Home page","settings.home_page_description":"Section order, house information and favorites.","settings.header_status":"Header & status","settings.header_status_description":"Time, weather, notifications and alarm chip.","settings.notifications_shown":"Notifications shown","settings.notifications_hidden":"Notifications hidden","settings.alarm_selected":"Alarm selected","settings.no_alarm_selected":"No alarm selected","settings.people":"People","settings.people_description":"Choose which people are visible in Dwains Dashboard.","settings.areas":"Areas","settings.areas_description":"Visible rooms, room order and unavailable entity behavior.","settings.unavailable_shown":"Unavailable shown","settings.unavailable_hidden":"Unavailable hidden","settings.devices_page":"Devices page","settings.devices_page_description":"Entity visibility and device type groups.","settings.blueprint_replacements":"Blueprint replacements","settings.blueprint_replacements_description":"Replace default cards with blueprint cards.","settings.user_permissions":"User permissions","settings.user_permissions_description":"Restrictions for non-admin users.","settings.restrictions_enabled":"Restrictions enabled","settings.default_access":"Default access","settings.support":"Support","settings.support_description":"Donation links and SmartHomeShop.io.","settings.optional":"Optional","settings.general":"General","settings.advanced":"Advanced","settings.house_cards":"{visible}/{total} house cards","settings.types_visible":"{visible}/{total} types visible","settings.hidden_devices_count":"{count} hidden devices","settings.home_layout":"Home layout","settings.home_layout_description":"Choose the order of the home page sections. Summaries show active Home Assistant repairs, updates and discovered devices.","settings.replace_description":"Replace standard entity cards in area and devices views with replace-card blueprints.","settings.favorites_description":"Choose entities that you always want to see on the home page.","settings.time_date":"Time & date","settings.time_date_description":"Configure the display of time and date in the header.","settings.notifications_description":"Show or hide Dwains Dashboard notification buttons and badges.","settings.weather_description":"Choose which weather entity to display in the header, or disable weather display entirely.","settings.alarm_description":"Choose which alarm entity to show on the home page. If no alarm is selected, the alarm chip will be hidden.","settings.devices_description":"Configure how entities and device type groups are displayed.","settings.permissions_description":"Optional restrictions for Home Assistant users without administrator rights.","settings.people_page_description":"Configure which persons are visible in the person cards and dashboard.","settings.areas_page_description":"Configure which areas are visible, in what order they are shown and how room entities are filtered.","settings.area_order_title":"Area order","settings.area_order_description":"Choose how areas are ordered throughout Dwains Dashboard.","settings.area_order_home_assistant":"Home Assistant","settings.area_order_home_assistant_description":"Follow the area order configured in Home Assistant.","settings.area_order_custom":"Custom order","settings.area_order_custom_description":"Arrange areas in your own Dwains Dashboard order.","settings.area_order_alphabetical":"Alphabetical","settings.area_order_alphabetical_description":"Sort areas alphabetically by name.","settings.area_order_drag_hint":"Drag the areas below into your preferred order. Hidden areas keep their position.","settings.hide_section":"Hide section","settings.show_section":"Show section","settings.hidden_devices":"Hidden devices","settings.no_hidden_devices":"No devices with visible entities were found.","settings.selected_entities":"Selected entities","settings.selected_weather":"Selected weather entity","settings.selected_alarm":"Selected alarm entity","settings.no_weather":"No weather entity selected. Weather is hidden on the home page.","settings.no_alarm":"No alarm entity selected. The alarm chip is hidden on the home page.","settings.no_persons":"No persons found","settings.visible_in_dd":"Visible in DD","settings.hidden_in_dd":"Hidden in DD","settings.discard_confirm":"Discard unsaved dashboard settings?","settings.show_suggested_favorites":"Show suggested favorites from Home Assistant","settings.suggested_favorites_description":"Adds frequently used entities suggested by Home Assistant next to your pinned favorites.","settings.add_entity":"Add entity","settings.show_time":"Show time and date in header","settings.show_notifications":"Show notifications in Dwains Dashboard","settings.show_weather":"Show weather in header","settings.select_weather":"Select weather","settings.select_alarm":"Select alarm","settings.hide_unavailable_devices":"Hide unavailable/unknown entities on Devices page","settings.hide_unavailable_devices_description":"Enabled by default. Entities with 'unavailable' or 'unknown' states are hidden from normal Devices pages, but still appear in Maintenance.","settings.show_new_devices":"Show New devices menu","settings.show_new_devices_description":"Shows devices added to Home Assistant in the last 48 hours, with a quick option to hide complete devices from Dwains Dashboard.","settings.restrict_ha_menu":"Restrict Home Assistant menu for non-admin users","settings.restrict_ha_menu_description":"When enabled, non-admin users will not see the Home Assistant sidebar or menu from this dashboard. The mobile menu only shows their own profile settings.","settings.restrict_editing":"Restrict Dwains Dashboard editing for non-admin users","settings.restrict_editing_description":"When enabled, non-admin users cannot open Dwains Dashboard settings or change dashboard content such as custom area cards and blueprint pages.","settings.hide_unavailable_areas":"Hide unavailable/unknown entities in area views","settings.hide_unavailable_areas_description":"Enabled by default. Entities with 'unavailable' or 'unknown' states are hidden from room cards. When hidden entities exist, Dwains Dashboard shows an attention badge in the room header.","settings.no_weather_fallback":"No weather entity selected. The first available weather entity will be used.","settings.move_up":"Move up","settings.move_down":"Move down","settings.reset_layout":"Reset default layout","settings.home_camera_cards":"Home camera cards","settings.home_camera_cards_description":"Choose which camera previews appear on Home and set their order. Unavailable cameras stay hidden until they reconnect.","settings.home_camera_cards_empty":"No cameras are assigned to visible areas.","settings.reset_camera_cards":"Reset camera order","settings.house_information_cards":"House information cards","settings.house_information_cards_description":"Choose which cards are shown inside House information on Home.","settings.devices_page_types":"Devices page types","settings.devices_page_types_description":"Choose which device type groups are shown in the Devices page sidebar.","settings.visible_count":"{visible}/{total} visible","settings.hidden_devices_description":"Hide complete devices from Dwains Dashboard. Devices are grouped by type and area.","settings.select_weather_title":"Select weather entity","settings.select_alarm_title":"Select alarm entity","settings.select_entity_title":"Select entity","settings.search_weather":"Search weather entities…","settings.search_alarm":"Search alarm entities…","settings.search":"Search…","settings.no_person_entities":"No person entities found in your Home Assistant configuration.","settings.hidden_unavailable_count":"Show {count} hidden unavailable/unknown entities","settings.edit_room":"Edit the room","summary.issue.one":"{count} issue","summary.issue.other":"{count} issues","summary.update_available.one":"{count} update available","summary.update_available.other":"{count} updates available","summary.device_to_add.one":"{count} device to add","summary.device_to_add.other":"{count} devices to add","support.title":"Support Dwains Dashboard","support.description":"I build Dwains Dashboard as a free, open-source project in my spare time alongside my job. My main daily venture is SmartHomeShop.io, where I develop hardware solutions for Home Assistant and ESPHome.","support.donation":"Please consider a donation","support.github":"GitHub Sponsor","support.buy_coffee":"Buy me a coffee","support.shop_prompt":"Or help me by checking out my shop","support.visit_shop":"Visit SmartHomeShop.io","home_section.summaries.label":"Summaries","home_section.summaries.description":"Repairs, updates and newly discovered devices from Home Assistant.","home_section.cameras.label":"Cameras","home_section.cameras.description":"Area cameras on the home page.","home_section.areas.label":"Areas","home_section.areas.description":"Mobile and small-screen room cards; desktop uses the left area menu.","home_section.devices.label":"House information","home_section.devices.description":"People, indoor climate, power usage and device groups.","home_section.todos.label":"To-do lists","home_section.todos.description":"Editable Home Assistant to-do lists on the home page.","home_section.favorites.label":"Favorites","home_section.favorites.description":"Pinned entities selected by you.","home_card.people.label":"People","home_card.people.description":"Presence cards for the people in this home.","home_card.climate.label":"Indoor climate","home_card.climate.description":"Average temperature and humidity from room sensors.","home_card.power.label":"House power usage","home_card.power.description":"Current whole-house power usage and top rooms.","home_card.device_groups.label":"Device groups","home_card.device_groups.description":"Status cards such as lights, switches, covers and motion.","error.notifications_load":"Could not load Home Assistant persistent notifications.","error.settings_save":"Could not save dashboard settings: {error}","error.notification_dismiss":"Could not dismiss this notification.","error.notifications_dismiss_all":"Could not dismiss all notifications.","error.image_load":"Image could not be loaded","error.canvas_unavailable":"Canvas context unavailable","domain.light":"Lights","domain.switch":"Switches","domain.fan":"Fans","domain.cover":"Covers","domain.lock":"Locks","domain.climate":"Climate","domain.media_player":"Media players","domain.camera":"Cameras","domain.person":"People","domain.vacuum":"Vacuums","domain.alarm_control_panel":"Alarm","domain.binary_sensor":"Binary sensors","domain.sensor":"Sensors","domain.energy":"Energy","domain.scene":"Scenes","domain.event":"Events","domain.script":"Scripts","domain.automation":"Automations","domain.button":"Buttons","domain.number":"Numbers","domain.select":"Selectors","domain.input_boolean":"Toggles","domain.input_number":"Numbers","domain.input_select":"Selectors","domain.input_button":"Buttons","domain.input_text":"Text fields","domain.water_heater":"Water heaters","domain.humidifier":"Humidifiers","domain.siren":"Sirens","domain.valve":"Valves","domain.update":"Updates","domain.weather":"Weather","domain.sun":"Sun","domain.device_tracker":"Device trackers","domain.remote":"Remotes","domain.image":"Images","domain.todo":"To-do lists","domain.calendar":"Calendars","domain.lawn_mower":"Lawn mowers","domain.text":"Text fields","domain.date":"Dates","domain.time":"Times","domain.timer":"Timers","device_class.motion":"Motion","device_class.moving":"Motion","device_class.occupancy":"Occupancy","device_class.presence":"Presence","device_class.door":"Doors","device_class.garage_door":"Garage doors","device_class.window":"Windows","device_class.opening":"Openings","device_class.smoke":"Smoke","device_class.gas":"Gas","device_class.carbon_monoxide":"Carbon monoxide","device_class.moisture":"Moisture","device_class.safety":"Safety","device_class.tamper":"Tamper","device_class.vibration":"Vibration","device_class.sound":"Sound","device_class.lock":"Locks","device_class.battery":"Battery","device_class.battery_charging":"Charging","device_class.connectivity":"Connectivity","device_class.power":"Power","device_class.plug":"Plugs","device_class.problem":"Problems","device_class.heat":"Heat","device_class.cold":"Cold","device_class.light":"Light","device_class.running":"Running","device_class.update":"Updates","device_class.door_lock":"Locks"},nl:{"common.save":"Opslaan","common.back":"Terug","common.close":"Sluiten","common.cancel":"Annuleren","common.add":"Toevoegen","common.next":"Volgende","common.edit":"Bewerken","common.manage":"Beheren","common.apply":"Toepassen","common.delete":"Verwijderen","common.loading":"Laden…","common.no_content":"Geen dashboardinhoud beschikbaar","common.saving":"Opslaan…","common.refresh":"Vernieuwen","common.dismiss":"Sluiten","common.dismiss_all":"Alles sluiten","common.select_option":"Optie selecteren","common.view_all":"Bekijk alles","common.see_all":"Bekijk alles","common.show":"Show","common.hide":"Verbergen","common.enable":"Inschakelen","common.disable":"Uitschakelen","common.remove":"Verwijderen","common.on":"Op","common.off":"Uit","common.open":"Open","common.closed":"Gesloten","common.unknown":"Onbekend","common.unavailable":"Niet beschikbaar","common.none":"Geen","common.entity.one":"{count}-entiteit","common.entity.other":"{count}-entiteiten","common.device.one":"{count}-apparaat","common.device.other":"{count}-apparaten","common.item.one":"{count}-artikel","common.item.other":"{count}-artikelen","common.sensor.one":"{count}-sensor","common.sensor.other":"{count}-sensoren","common.area.one":"{count} ruimte","common.area.other":"{count} ruimtes","common.person.one":"{count} persoon","common.person.other":"{count} personen","common.favorite.one":"{count} favoriet","common.favorite.other":"{count} favorieten","common.active.one":"{count} actief","common.active.other":"{count} actief","common.just_now":"zojuist","sidebar.home":"Home","sidebar.add_blueprint":"Blueprint toevoegen","sidebar.dashboard_settings":"Dashboard-instellingen","sidebar.section_title":"Dwains Dashboard","sidebar.areas":"Ruimtes","sidebar.show":"Gebiedzijbalk weergeven","sidebar.collapse":"Zijbalk van het gebied samenvouwen","sidebar.resize":"Breedte van de gebiedzijbalk aanpassen","sidebar.resize_drag":"Sleep om de breedte van de gebiedzijbalk aan te passen","navigation.menu":"Menu","navigation.pages":"Pagina's","navigation.profile_settings":"Profielinstellingen","navigation.profile_description":"Open uw Home Assistant-profiel","navigation.back_home":"Terug naar huis","navigation.open_menu":"Menu openen","navigation.current_page":"Huidige pagina","navigation.open_page":"Pagina openen","navigation.overview":"Overzicht","navigation.all_device_groups":"Alle apparaatgroepen","favorites.title":"Favorieten","favorites.empty":"Nog geen favorieten geselecteerd.","favorites.swipe":"Veeg favorieten","favorites.show_all":"Toon alle favorieten","favorites.switch_swipe":"Wissel van favoriet naar swipe-kaarten","person.home":"Home","person.away":"Away","person.nobody_home":"Niemand thuis","layout.custom_cards":"Eigen kaarten","layout.add_card":"Kaart toevoegen","layout.done_editing":"Klaar met bewerken","layout.edit_custom_cards":"Eigen kaarten bewerken","layout.custom_cards_top":"Bovenaan ruimte","layout.custom_cards_after":"Onder {section}","layout.custom_cards_bottom":"Onderaan ruimte","layout.drag_card":"Kaart verslepen","layout.edit_page":"Pagina bewerken","layout.page_settings":"Instellingen / opnieuw invullen","layout.delete_page":"Pagina verwijderen","layout.delete_page_confirm":'Pagina "{name}" verwijderen?',"layout.delete_card_confirm":"Deze kaart verwijderen?","layout.save_page_failed":"Kon de pagina niet opslaan (zie console):\n{error}","layout.save_card_failed":"Kon de kaart niet opslaan (zie console):\n{error}","layout.swipe_cards":"Veeg kaarten","layout.show_all_cards":"Laat alle kaarten zien","layout.switch_swipe_cards":"Schakel over naar swipe-kaarten","home.notifications":"Meldingen","home.notifications_description":"Aanhoudende meldingen van Home Assistant","home.notifications_loading":"Meldingen laden…","home.notifications_empty":"Geen aanhoudende meldingen","home.notification":"Melding","home.summaries":"Samenvattingen","home.house_information":"Huis informatie","home.cameras":"Camera's","home.areas":"Gebieden","home.unassigned_spaces":"Niet-toegewezen ruimtes","home.devices_discovered":"Apparaten ontdekt","home.repairs":"Reparaties","home.updates":"Updates","home.house_power_usage":"Stroomverbruik in huis","home.no_live_power_sensors":"Geen live-stroomsensoren","home.no_room_power_usage":"Er is momenteel geen stroomverbruik in de kamer","home.indoor_climate":"Binnenklimaat","home.average_temperature":"Gemiddelde temperatuur","home.average_humidity":"Gemiddelde luchtvochtigheid","home.temperature":"Temperatuur","home.humidity":"Luchtvochtigheid","home.view_sensors":"Bekijk sensoren","home.people":"Mensen","home.no_people":"Geen mensen","home.no_visible_people":"Geen zichtbare personen geconfigureerd","home.attention.one":"{count}-item heeft aandacht nodig","home.attention.other":"{count}-items hebben aandacht nodig","home.everything_calm":"Alles ziet er rustig uit","home.outside_weather":"Buiten weer","home.outside":"Buiten","home.alarm_armed":"Ingeschakeld","home.alarm_disarmed":"Uitgeschakeld","home.good_morning":"Goedemorgen","home.good_afternoon":"Goedemiddag","home.good_evening":"Goedeavond","home.swipe_house_information":"Veeg huisinformatie","home.show_all_house_information":"Toon alle huisinformatie","home.switch_house_information_swipe":"Schakel huisinformatie over naar swipe-kaarten","home.swipe_cameras":"Veeg camera's","home.show_all_cameras":"Toon alle camera's","home.switch_cameras_swipe":"Wissel van camera om kaarten te swipen","home.swipe_areas":"Veeg gebieden","home.show_all_areas":"Toon alle gebieden","home.switch_areas_swipe":"Wissel van gebied om kaarten te vegen","status.light_on.one":"{count}-lampje aan","status.light_on.other":"{count}-lampjes branden","status.switch_on.one":"{count} inschakelen","status.switch_on.other":"{count} wordt ingeschakeld","status.cover_open.one":"{count}-deksel open","status.cover_open.other":"{count}-afdekkingen open","status.fan_on.one":"{count}-ventilator aan","status.fan_on.other":"{count}-ventilatoren aan","status.lock_unlocked.one":"{count}-slot ontgrendeld","status.lock_unlocked.other":"{count}-sloten ontgrendeld","status.climate_active.one":"{count} klimaatactief","status.climate_active.other":"{count} klimaatactief","status.media_playing.one":"{count} mediaspeler speelt af","status.media_playing.other":"{count} mediaspelers spelen","status.vacuum_cleaning.one":"{count} stofzuigen","status.vacuum_cleaning.other":"{count} stofzuigt","status.alarm_armed.one":"{count} alarm ingeschakeld","status.alarm_armed.other":"{count}-alarmen ingeschakeld","status.door_open.one":"{count} deur open","status.door_open.other":"{count}-deuren gaan open","status.window_open.one":"{count}-venster geopend","status.window_open.other":"{count}-vensters openen","status.opening_open.one":"{count} opening geopend","status.opening_open.other":"{count}-openingen open","status.motion_detected":"{count} beweging gedetecteerd","status.smoke_detected":"{count} rook gedetecteerd","status.gas_detected":"{count}-gas gedetecteerd","status.moisture_detected":"{count} vocht gedetecteerd","status.occupancy_detected":"{count} bezetting gedetecteerd","status.presence_detected":"{count}-aanwezigheid gedetecteerd","status.tamper_detected":"{count}-sabotage gedetecteerd","status.vibration_detected":"{count}-trilling gedetecteerd","status.safety_active":"{count}-veiligheid actief","action.turn_on":"Schakel in","action.activate":"Activeren","action.open_camera":"Camera openen","action.turn_off":"Schakel uit","action.more_info":"Meer informatie","action.turn_on_all":"Schakel alles in","action.turn_off_all":"Schakel alles uit","action.open_all":"Alles openen","action.close_all":"Sluit alles","action.lock_all":"Vergrendel alles","action.unlock_all":"Ontgrendel alles","action.all_lights_on":"Alle lichten aan","action.all_lights_off":"Alle lichten uit","action.all_switches_on":"Alle schakelaars aan","action.all_switches_off":"Alles schakelt uit","action.toggle_lights":"Schakel de lichten in","action.toggle_switches":"Schakelschakelaars","action.toggle_covers":"Schakel de covers om","action.confirm_lights":"Weet u zeker dat u alle lichten in dit gebied wilt uitschakelen?","action.confirm_switches":"Weet u zeker dat u alle schakelaars in dit gebied wilt omzetten?","action.scene_activated":"Scène geactiveerd","action.open":"Openen","action.close":"Sluiten","action.stop":"Stoppen","action.lock":"Vergrendelen","action.unlock":"Ontgrendelen","action.confirm_bulk":"{action}: {entities}?","action.lights_on_summary":"Alle lampen inschakelen ({total})","action.lights_off_summary":"Alle lampen uitschakelen ({active}/{total} aan)","action.switches_on_summary":"Alle schakelaars inschakelen ({total})","action.switches_off_summary":"Alle schakelaars uitschakelen ({active}/{total} aan)","action.covers_open_summary":"Alle raambekleding openen ({total})","action.covers_close_summary":"Alle raambekleding sluiten ({active}/{total} open)","entity.not_activated":"Nog niet geactiveerd","entity.no_events":"Nog geen evenementen","entity.power_usage":"Stroomverbruik","entity.select_value":"Selecteer waarde","entity.update_failed":"Kan entiteit niet updaten","entity.selector_failed":"Kan de selector niet updaten","entity.cover_failed":"Kan de dekking niet updaten","entity.brightness":"{value}% helderheid","entity.climate_set":"ingesteld op {value}","entity.lock_failed":"Kan het slot niet updaten","entity.lights_failed":"Kan lampen niet updaten","entity.switches_failed":"Kan schakelaars niet updaten","entity.covers_failed":"Kan covers niet updaten","entity.group_failed":"Kan groep niet updaten","page.add_title":"Blueprint-pagina toevoegen","page.add_desc":"Importeer een blueprint om hem als nieuwe tab in het hoofdmenu te zetten.","blueprint.title_add":"Blueprint toevoegen","blueprint.title_setup":"Blueprint instellen","blueprint.title_edit":"Pagina bewerken","blueprint.tab_paste":"Plakken","blueprint.tab_url":"Van URL","blueprint.tab_gallery":"Galerij","blueprint.gallery_hint":"Kies een blueprint uit de officiële lijst.","blueprint.gallery_empty":"Geen blueprints gevonden.","blueprint.gallery_failed":"Kon de blueprint-lijst niet laden: {error}","blueprint.paste_hint":"Plak hier de volledige blueprint-YAML (page.yaml).","blueprint.url_hint_html":"Plak een GitHub-URL naar het <code>page.yaml</code> (of de map ervan). Ik haal de blueprint automatisch op.","blueprint.loading":"Laden…","blueprint.fetch":"Ophalen","blueprint.invalid_url":"Geef een geldige URL op.","blueprint.fetch_failed":"Ophalen mislukt (HTTP {status}).","blueprint.load_failed":"Kon de blueprint niet laden: {error}. Tip: gebruik de 'raw' URL van het page.yaml-bestand of plak de YAML.","blueprint.fill_failed":"Invullen mislukt: {error}","blueprint.new_page":"Nieuwe pagina","blueprint.page_fallback":"Pagina","blueprint.missing_cards":"Deze kaart(en) lijken nog niet geïnstalleerd: {cards}. Installeer ze via HACS, anders blijven die kaarten leeg.","blueprint.page_name":"Paginanaam","blueprint.sidebar_icon":"Icoon in zijbalk","blueprint.settings":"Instellingen","blueprint.no_fields":"Deze blueprint heeft geen instelbare velden.","blueprint.edit_yaml":"YAML bewerken","blueprint.apply":"Toepassen","blueprint.check_update":"Controleer op update","blueprint.checking":"Controleren…","blueprint.up_to_date":"Al up-to-date (v{version}).","blueprint.update_available":"Nieuwe versie beschikbaar: v{new} (huidig v{current}).","blueprint.source_missing":"Geen bron-URL gevonden en geen match met een officiële blueprint in de galerij.","blueprint.update":"Bijwerken","card_editor.title_add":"Kaart toevoegen","card_editor.title_setup":"Kaart instellen","card_editor.title_edit":"Kaart bewerken","card_editor.search":"Zoek kaart","card_editor.visual_editor":"Visuele editor","card_editor.code_editor":"Code-editor","card_editor.loading":"Editor laden…","card_editor.preview":"Voorbeeld","card_editor.no_preview":"Geen voorbeeld voor dit kaarttype.","card_type.tile.label":"Tegel","card_type.tile.desc":"Compacte kaart voor één entiteit met snelle bediening.","card_type.entities.label":"Entiteiten","card_type.entities.desc":"Lijst van entiteiten met status en bediening.","card_type.button.label":"Knop","card_type.button.desc":"Grote knop om een entiteit te schakelen.","card_type.gauge.label":"Meter","card_type.gauge.desc":"Toont een numerieke waarde als meter.","card_type.history.label":"Grafiek","card_type.history.desc":"Historische grafiek van entiteiten.","card_type.sensor.label":"Sensor","card_type.sensor.desc":"Sensorwaarde met optionele grafiek.","card_type.thermostat.label":"Thermostaat","card_type.thermostat.desc":"Bediening voor een klimaat-entiteit.","card_type.weather.label":"Weer","card_type.weather.desc":"Weersvoorspelling.","card_type.markdown.label":"Markdown","card_type.markdown.desc":"Vrije tekst met opmaak en templates.","card_type.picture.label":"Afbeelding","card_type.picture.desc":"Toont een afbeelding of camera.","card_type.glance.label":"Glance","card_type.glance.desc":"Compact overzicht van meerdere entiteiten.","card_type.media.label":"Media","card_type.media.desc":"Bediening voor een mediaspeler.","card_type.manual.label":"Handmatig (YAML)","card_type.manual.desc":"Typ of plak zelf de YAML voor elke kaart.","strategy.dashboard_desc":"Pas de naam en het zijbalk-icoon van dit dashboard aan.","strategy.name":"Naam","strategy.sidebar_icon":"Zijbalk-icoon","strategy.back":"Terug","strategy.save_name_failed":"Naam/icoon opslaan mislukt (zie console):\n{error}","strategy.edit_area_alert":"Open Home Assistant settings > Areas & zones to edit the area.","devices.title":"Apparaten","devices.empty":"Geen apparaten gevonden.","devices.new":"Nieuwe apparaten","devices.new.one":"{count} nieuw apparaat","devices.new.other":"{count} nieuwe apparaten","devices.maintenance":"Onderhoud","devices.energy":"Energie","devices.invalid_configuration":"Ongeldige configuratie","devices.all_good":"Alles ziet er goed uit","devices.live_power_usage":"Live stroomverbruik per gebied","devices.live_power_sensor.one":"{count} live-vermogensensor","devices.live_power_sensor.other":"{count} live-vermogenssensoren","devices.power_entity.one":"{count}-energie-entiteit","devices.power_entity.other":"{count} machtsentiteiten","devices.whole_house":"Hele huis","devices.whole_house_history":"Geschiedenis van de hele huismacht","devices.top_area":"Bovenste gebied","devices.total_now":"Totaal nu","devices.no_power_title":"Geen live-stroomsensoren gevonden","devices.no_power_description":"Energie verschijnt hier wanneer vermogenssensoren worden toegewezen aan zichtbare gebieden.","devices.maintenance_empty":"Geen bijna lege batterijen of niet-beschikbare apparaten op dit moment.","devices.added_just_now":"Zojuist toegevoegd","devices.group.one":"{count} apparaatgroep","devices.group.other":"{count} apparaatgroepen","devices.low_battery.one":"{count} bijna lege batterij","devices.low_battery.other":"{count} bijna lege batterijen","devices.unavailable_device.one":"{count} niet-beschikbaar apparaat","devices.unavailable_device.other":"{count} niet-beschikbare apparaten","devices.new_description":"Apparaten die in de afgelopen {hours} uur aan Home Assistant zijn toegevoegd.","devices.new_empty":"Er zijn in de afgelopen {hours} uur geen apparaten aan Home Assistant toegevoegd.","devices.save_visibility_failed":"De zichtbaarheid van het apparaat kon niet worden opgeslagen:\n{error}","dialog.active_empty":"Geen actieve entiteiten gevonden","dialog.problem_empty":"Geen problematische entiteiten gevonden","dialog.power_sensors":"Vermogenssensoren","dialog.motion_sensors":"Bewegingssensoren","dialog.door_sensors":"Deur sensoren","dialog.window_sensors":"Raamsensoren","dialog.smoke_sensors":"Rookmelders","dialog.gas_sensors":"Gasdetectoren","dialog.moisture_sensors":"Vochtsensoren","dialog.occupancy_sensors":"Aanwezigheidssensoren","dialog.opening_sensors":"Sensoren openen","dialog.presence_sensors":"Aanwezigheidssensoren","dialog.safety_sensors":"Veiligheidssensoren","dialog.tamper_sensors":"Sabotagesensoren","dialog.vibration_sensors":"Trillingssensoren","dialog.no_area":"Geen gebied","replacement.title":"Vervangingen van blauwdrukken","replacement.domain_replacements":"Domeinvervangingen","replacement.assign":"Vervanging toewijzen","replacement.domain":"Domein","replacement.empty":"Geen vervangingen geconfigureerd.","replacement.loading_blueprint":"Blauwdruk laden…","replacement.entity_hint":"Entiteit en naam worden automatisch ingevuld voor elke weergegeven entiteit.","replacement.applies_to":"Wordt in beide weergaven toegepast op {domain}-entiteiten.","replacement.views_title":"Areaweergave + apparatenweergave","replacement.views_description":"Domeinvervangingen worden, net als in DD3, in beide weergaven op standaard entiteitskaarten toegepast.","replacement.target":"Domein · {domain}","replacement.applies_hint":"Geldt voor overeenkomende entiteiten in zowel area- als apparatenweergaven.","replacement.search":"Zoek replace-card-blueprints","replacement.load_failed":"Kan {name} niet laden: {error}","settings.title":"Dwains Dashboard-instellingen","settings.subtitle":"Kies een sectie om te configureren. Wijzigingen worden opgeslagen met de knop Opslaan hieronder.","settings.loaded_version":"Geladen versie","settings.loading":"Laden","settings.all_settings":"Alle instellingen","settings.dashboard_layout":"Dashboard-indeling","settings.dashboard":"Dashboard","settings.dashboard_description":"Naam en zijbalkpictogram.","settings.current_dashboard":"Huidig ​​dashboard","settings.default_dashboard_locked":"De standaard Home Assistant-dashboardnaam kan hier niet worden bewerkt.","settings.open_instance":"Open een Dwains Dashboard-instantie om de naam en het zijbalkpictogram te bewerken.","settings.home_page":"Startpagina","settings.home_page_description":"Sectievolgorde, huisinformatie en favorieten.","settings.header_status":"Kop & status","settings.header_status_description":"Tijd, weer, meldingen en alarmchip.","settings.notifications_shown":"Meldingen getoond","settings.notifications_hidden":"Meldingen verborgen","settings.alarm_selected":"Wekker geselecteerd","settings.no_alarm_selected":"Geen alarm geselecteerd","settings.people":"Mensen","settings.people_description":"Kies welke mensen zichtbaar zijn in Dwains Dashboard.","settings.areas":"Gebieden","settings.areas_description":"Zichtbare kamers, kamervolgorde en niet-beschikbaar entiteitsgedrag.","settings.unavailable_shown":"Niet beschikbaar weergegeven","settings.unavailable_hidden":"Niet beschikbaar verborgen","settings.devices_page":"Pagina Apparaten","settings.devices_page_description":"Zichtbaarheid van entiteiten en apparaattypegroepen.","settings.blueprint_replacements":"Vervangingen van blauwdrukken","settings.blueprint_replacements_description":"Vervang standaardkaarten door blauwdrukkaarten.","settings.user_permissions":"Gebruikersrechten","settings.user_permissions_description":"Beperkingen voor niet-beheerders.","settings.restrictions_enabled":"Beperkingen ingeschakeld","settings.default_access":"Standaardtoegang","settings.support":"Steun","settings.support_description":"Donatielinks en SmartHomeShop.io.","settings.optional":"Optioneel","settings.general":"Algemeen","settings.advanced":"Geavanceerd","settings.house_cards":"{visible}/{total} huiskaarten","settings.types_visible":"{visible}/{total} typen zichtbaar","settings.hidden_devices_count":"{count} verborgen apparaten","settings.home_layout":"Indeling van huis","settings.home_layout_description":"Kies de volgorde van de secties op de startpagina. Samenvattingen tonen actieve Home Assistant-reparaties, updates en ontdekte apparaten.","settings.replace_description":"Vervang standaardentiteitskaarten in gebieds- en apparaatweergaven door blauwdrukken voor vervangingskaarten.","settings.favorites_description":"Kies entiteiten die u altijd op de startpagina wilt zien.","settings.time_date":"Tijd & datum","settings.time_date_description":"Configureer de weergave van tijd en datum in de koptekst.","settings.notifications_description":"Toon of verberg Dwains Dashboard-meldingsknoppen en badges.","settings.weather_description":"Kies welke weerentiteit u in de koptekst wilt weergeven, of schakel de weerweergave volledig uit.","settings.alarm_description":"Kies welke alarmentiteit u op de startpagina wilt weergeven. Als er geen alarm is geselecteerd, wordt de alarmchip verborgen.","settings.devices_description":"Configureer hoe entiteiten en apparaattypegroepen worden weergegeven.","settings.permissions_description":"Optionele beperkingen voor Home Assistant-gebruikers zonder beheerdersrechten.","settings.people_page_description":"Configureer welke personen zichtbaar zijn in de persoonskaarten en het dashboard.","settings.areas_page_description":"Configureer welke gebieden zichtbaar zijn, in welke volgorde ze worden weergegeven en hoe kamerentiteiten worden gefilterd.","settings.area_order_title":"Volgorde van ruimtes","settings.area_order_description":"Kies hoe ruimtes overal in Dwains Dashboard worden gesorteerd.","settings.area_order_home_assistant":"Home Assistant","settings.area_order_home_assistant_description":"Volg de volgorde die in Home Assistant is ingesteld.","settings.area_order_custom":"Eigen volgorde","settings.area_order_custom_description":"Bepaal een aparte volgorde voor Dwains Dashboard.","settings.area_order_alphabetical":"Alfabetisch","settings.area_order_alphabetical_description":"Sorteer ruimtes alfabetisch op naam.","settings.area_order_drag_hint":"Sleep de ruimtes hieronder naar de gewenste volgorde. Verborgen ruimtes behouden hun positie.","settings.hide_section":"Sectie verbergen","settings.show_section":"Sectie weergeven","settings.hidden_devices":"Verborgen apparaten","settings.no_hidden_devices":"Er zijn geen apparaten met zichtbare entiteiten gevonden.","settings.selected_entities":"Geselecteerde entiteiten","settings.selected_weather":"Geselecteerde weerentiteit","settings.selected_alarm":"Geselecteerde alarmentiteit","settings.no_weather":"Geen weerentiteit geselecteerd. Het weer is verborgen op de startpagina.","settings.no_alarm":"Geen alarmentiteit geselecteerd. De alarmchip is verborgen op de startpagina.","settings.no_persons":"Geen personen gevonden","settings.visible_in_dd":"Zichtbaar in DD","settings.hidden_in_dd":"Verborgen in DD","settings.discard_confirm":"Niet-opgeslagen dashboardinstellingen verwijderen?","settings.show_suggested_favorites":"Voorgestelde favorieten van Home Assistant tonen","settings.suggested_favorites_description":"Voegt vaak gebruikte, door Home Assistant voorgestelde entiteiten toe naast uw vastgezette favorieten.","settings.add_entity":"Entiteit toevoegen","settings.show_time":"Tijd en datum in de kop tonen","settings.show_notifications":"Meldingen in Dwains Dashboard tonen","settings.show_weather":"Weer in de kop tonen","settings.select_weather":"Weer selecteren","settings.select_alarm":"Alarm selecteren","settings.hide_unavailable_devices":"Niet-beschikbare/onbekende entiteiten op Apparaten verbergen","settings.hide_unavailable_devices_description":"Standaard ingeschakeld. Entiteiten met de status 'niet beschikbaar' of 'onbekend' worden op normale apparaatpagina's verborgen, maar blijven zichtbaar in Onderhoud.","settings.show_new_devices":"Menu Nieuwe apparaten tonen","settings.show_new_devices_description":"Toont apparaten die in de afgelopen 48 uur aan Home Assistant zijn toegevoegd, met een snelle optie om complete apparaten uit Dwains Dashboard te verbergen.","settings.restrict_ha_menu":"Home Assistant-menu beperken voor niet-beheerders","settings.restrict_ha_menu_description":"Indien ingeschakeld zien niet-beheerders de Home Assistant-zijbalk en het menu niet vanuit dit dashboard. Het mobiele menu toont alleen hun eigen profielinstellingen.","settings.restrict_editing":"Bewerken van Dwains Dashboard beperken voor niet-beheerders","settings.restrict_editing_description":"Indien ingeschakeld kunnen niet-beheerders de instellingen van Dwains Dashboard niet openen en dashboardinhoud zoals aangepaste ruimtekaarten en blueprintpagina's niet wijzigen.","settings.hide_unavailable_areas":"Niet-beschikbare/onbekende entiteiten in ruimtes verbergen","settings.hide_unavailable_areas_description":"Standaard ingeschakeld. Entiteiten met de status 'niet beschikbaar' of 'onbekend' worden in ruimtekaarten verborgen. Als er verborgen entiteiten zijn, toont Dwains Dashboard een attentiemelding in de ruimteheader.","settings.no_weather_fallback":"Geen weerentiteit geselecteerd. De eerste beschikbare weerentiteit wordt gebruikt.","settings.move_up":"Omhoog verplaatsen","settings.move_down":"Omlaag verplaatsen","settings.reset_layout":"Standaardindeling herstellen","settings.home_camera_cards":"Camera's op Home","settings.home_camera_cards_description":"Kies welke cameravoorbeelden op Home staan en bepaal hun volgorde. Niet-beschikbare camera's blijven verborgen totdat ze weer verbonden zijn.","settings.home_camera_cards_empty":"Er zijn geen camera's gekoppeld aan zichtbare ruimtes.","settings.reset_camera_cards":"Cameravolgorde herstellen","settings.house_information_cards":"Woninginformatiekaarten","settings.house_information_cards_description":"Kies welke kaarten in Woninginformatie op Home worden getoond.","settings.devices_page_types":"Apparaattypen","settings.devices_page_types_description":"Kies welke groepen apparaattypen in de zijbalk van Apparaten worden getoond.","settings.visible_count":"{visible}/{total} zichtbaar","settings.hidden_devices_description":"Verberg complete apparaten in Dwains Dashboard. Apparaten zijn gegroepeerd op type en ruimte.","settings.select_weather_title":"Weerentiteit selecteren","settings.select_alarm_title":"Alarmentiteit selecteren","settings.select_entity_title":"Entiteit selecteren","settings.search_weather":"Weerentiteiten zoeken…","settings.search_alarm":"Alarmentiteiten zoeken…","settings.search":"Zoeken…","settings.no_person_entities":"Geen persoonsentiteiten gevonden in uw Home Assistant-configuratie.","settings.hidden_unavailable_count":"{count} verborgen niet-beschikbare/onbekende entiteiten tonen","settings.edit_room":"Ruimte bewerken","summary.issue.one":"{count} probleem","summary.issue.other":"{count} problemen","summary.update_available.one":"{count} update beschikbaar","summary.update_available.other":"{count} updates beschikbaar","summary.device_to_add.one":"{count} apparaat toe te voegen","summary.device_to_add.other":"{count} apparaten toe te voegen","support.title":"Ondersteuning Dwains Dashboard","support.description":"Ik bouw Dwains Dashboard als gratis opensourceproject in mijn vrije tijd naast mijn werk. Mijn dagelijkse onderneming is SmartHomeShop.io, waar ik hardwareoplossingen voor Home Assistant en ESPHome ontwikkel.","support.donation":"Overweeg dan een donatie","support.github":"GitHub-sponsor","support.buy_coffee":"Koop een koffie voor mij","support.shop_prompt":"Of help mij door mijn winkel te bekijken","support.visit_shop":"Bezoek SmartHomeShop.io","home_section.summaries.label":"Samenvattingen","home_section.summaries.description":"Reparaties, updates en nieuw ontdekte apparaten van Home Assistant.","home_section.cameras.label":"Camera's","home_section.cameras.description":"Gebiedscamera's op de startpagina.","home_section.areas.label":"Gebieden","home_section.areas.description":"Kamerkaarten voor mobiel en klein scherm; bureaublad gebruikt het linkergebiedmenu.","home_section.devices.label":"Huis informatie","home_section.devices.description":"Mensen, binnenklimaat, stroomverbruik en apparaatgroepen.","home_section.todos.label":"Takenlijsten","home_section.todos.description":"Bewerkbare Home Assistant-takenlijsten op de startpagina.","home_section.favorites.label":"Favorieten","home_section.favorites.description":"Vastgezette entiteiten die door u zijn geselecteerd.","home_card.people.label":"Mensen","home_card.people.description":"Aanwezigheidskaarten voor de mensen in dit huis.","home_card.climate.label":"Binnenklimaat","home_card.climate.description":"Gemiddelde temperatuur en vochtigheid van kamersensoren.","home_card.power.label":"Stroomverbruik in huis","home_card.power.description":"Huidig ​​stroomverbruik in het hele huis en topkamers.","home_card.device_groups.label":"Apparaatgroepen","home_card.device_groups.description":"Statuskaarten zoals lampen, schakelaars, zonwering en beweging.","error.notifications_load":"Kan permanente Home Assistant-meldingen niet laden.","error.settings_save":"Kan dashboardinstellingen niet opslaan: {error}","error.notification_dismiss":"Kan deze melding niet negeren.","error.notifications_dismiss_all":"Kan niet alle meldingen negeren.","error.image_load":"Afbeelding kon niet worden geladen","error.canvas_unavailable":"Canvascontext niet beschikbaar","domain.light":"Lampen","domain.switch":"Schakelaars","domain.fan":"Ventilatoren","domain.cover":"Zonwering","domain.lock":"Sloten","domain.climate":"Klimaat","domain.media_player":"Mediaspelers","domain.camera":"Camera's","domain.person":"Personen","domain.vacuum":"Stofzuigers","domain.alarm_control_panel":"Alarm","domain.binary_sensor":"Binaire sensoren","domain.sensor":"Sensoren","domain.energy":"Energie","domain.scene":"Scènes","domain.event":"Gebeurtenissen","domain.script":"Scripts","domain.automation":"Automatiseringen","domain.button":"Knoppen","domain.number":"Nummers","domain.select":"Keuzelijsten","domain.input_boolean":"Schakelaars","domain.input_number":"Nummers","domain.input_select":"Keuzelijsten","domain.input_button":"Knoppen","domain.input_text":"Tekstvelden","domain.water_heater":"Waterverwarmers","domain.humidifier":"Luchtbevochtigers","domain.siren":"Sirenes","domain.valve":"Kleppen","domain.update":"Updates","domain.weather":"Weer","domain.sun":"Zon","domain.device_tracker":"Apparaattrackers","domain.remote":"Afstandsbedieningen","domain.image":"Afbeeldingen","domain.todo":"To-do-lijsten","domain.calendar":"Kalenders","domain.lawn_mower":"Grasmaaiers","domain.text":"Tekstvelden","domain.date":"Datums","domain.time":"Tijden","domain.timer":"Timers","device_class.motion":"Beweging","device_class.moving":"Beweging","device_class.occupancy":"Aanwezigheid","device_class.presence":"Aanwezigheid","device_class.door":"Deuren","device_class.garage_door":"Garagedeuren","device_class.window":"Ramen","device_class.opening":"Openingen","device_class.smoke":"Rook","device_class.gas":"Gas","device_class.carbon_monoxide":"Koolmonoxide","device_class.moisture":"Vocht","device_class.safety":"Veiligheid","device_class.tamper":"Sabotage","device_class.vibration":"Trilling","device_class.sound":"Geluid","device_class.lock":"Sloten","device_class.battery":"Batterij","device_class.battery_charging":"Opladen","device_class.connectivity":"Connectiviteit","device_class.power":"Stroom","device_class.plug":"Stekkers","device_class.problem":"Problemen","device_class.heat":"Warmte","device_class.cold":"Koud","device_class.light":"Licht","device_class.running":"Actief","device_class.update":"Updates","device_class.door_lock":"Sloten"},de:{"common.save":"Speichern","common.back":"Zurück","common.close":"Schließen","common.cancel":"Stornieren","common.add":"Hinzufügen","common.next":"Nächste","common.edit":"Bearbeiten","common.manage":"Verwalten","common.apply":"Anwenden","common.delete":"Löschen","common.loading":"Laden…","common.no_content":"Keine Dashboard-Inhalte verfügbar","common.saving":"Wird gespeichert…","common.refresh":"Aktualisieren","common.dismiss":"Verwerfen","common.dismiss_all":"Alle verwerfen","common.select_option":"Option auswählen","common.view_all":"Alle anzeigen","common.see_all":"Alle anzeigen","common.show":"Zeigen","common.hide":"Verstecken","common.enable":"Aktivieren","common.disable":"Deaktivieren","common.remove":"Entfernen","common.on":"An","common.off":"Aus","common.open":"Offen","common.closed":"Geschlossen","common.unknown":"Unbekannt","common.unavailable":"Nicht verfügbar","common.none":"Keiner","common.entity.one":"{count}-Entität","common.entity.other":"{count}-Entitäten","common.device.one":"{count}-Gerät","common.device.other":"{count}-Geräte","common.item.one":"{count} Artikel","common.item.other":"{count} Artikel","common.sensor.one":"{count}-Sensor","common.sensor.other":"{count}-Sensoren","common.area.one":"{count} Bereich","common.area.other":"{count} Bereiche","common.person.one":"{count} Person","common.person.other":"{count} Personen","common.favorite.one":"{count} Favorit","common.favorite.other":"{count} Favoriten","common.active.one":"{count} aktiv","common.active.other":"{count} aktiv","common.just_now":"soeben","sidebar.home":"Heim","sidebar.add_blueprint":"Blaupause hinzufügen","sidebar.dashboard_settings":"Dashboard-Einstellungen","sidebar.section_title":"Dwains Dashboard","sidebar.areas":"Bereiche","sidebar.show":"Bereichsseitenleiste anzeigen","sidebar.collapse":"Seitenleiste des Bereichs einklappen","sidebar.resize":"Breite der Bereichsseitenleiste ändern","sidebar.resize_drag":"Ziehen, um die Breite der Bereichsseitenleiste zu ändern","navigation.menu":"Speisekarte","navigation.pages":"Seiten","navigation.profile_settings":"Profileinstellungen","navigation.profile_description":"Öffnen Sie Ihr Home Assistant-Profil","navigation.back_home":"Zurück nach Hause","navigation.open_menu":"Menü öffnen","navigation.current_page":"Aktuelle Seite","navigation.open_page":"Seite öffnen","navigation.overview":"Überblick","navigation.all_device_groups":"Alle Gerätegruppen","favorites.title":"Favoriten","favorites.empty":"Noch keine Favoriten ausgewählt.","favorites.swipe":"Swipe-Favoriten","favorites.show_all":"Alle Favoriten anzeigen","favorites.switch_swipe":"Wechseln Sie von den Favoriten zu Swipe-Karten","person.home":"Heim","person.away":"Weg","person.nobody_home":"Niemand zu Hause","layout.custom_cards":"Benutzerdefinierte Karten","layout.add_card":"Karte hinzufügen","layout.done_editing":"Bearbeitung abgeschlossen","layout.edit_custom_cards":"Benutzerdefinierte Karten bearbeiten","layout.custom_cards_top":"Oben im Bereich","layout.custom_cards_after":"Unten {section}","layout.custom_cards_bottom":"Unten im Bereich","layout.drag_card":"Karte ziehen","layout.edit_page":"Seite bearbeiten","layout.page_settings":"Einstellungen / erneut ausfüllen","layout.delete_page":"Seite löschen","layout.delete_page_confirm":"Seite „{name}“ löschen?","layout.delete_card_confirm":"Diese Karte löschen?","layout.save_page_failed":"Die Seite konnte nicht gespeichert werden (siehe Konsole):\n{error}","layout.save_card_failed":"Die Karte konnte nicht gespeichert werden (siehe Konsole):\n{error}","layout.swipe_cards":"Karten durchziehen","layout.show_all_cards":"Alle Karten anzeigen","layout.switch_swipe_cards":"Wechseln Sie zu Magnetkarten","home.notifications":"Benachrichtigungen","home.notifications_description":"Ständige Benachrichtigungen von Home Assistant","home.notifications_loading":"Benachrichtigungen werden geladen…","home.notifications_empty":"Keine dauerhaften Benachrichtigungen","home.notification":"Benachrichtigung","home.summaries":"Zusammenfassungen","home.house_information":"Hausinformationen","home.cameras":"Kameras","home.areas":"Bereiche","home.unassigned_spaces":"Nicht zugewiesene Räume","home.devices_discovered":"Geräte entdeckt","home.repairs":"Reparaturen","home.updates":"Aktualisierungen","home.house_power_usage":"Stromverbrauch im Haus","home.no_live_power_sensors":"Keine aktiven Leistungssensoren","home.no_room_power_usage":"Im Moment wird kein Zimmerstrom verbraucht","home.indoor_climate":"Raumklima","home.average_temperature":"Durchschnittstemperatur","home.average_humidity":"Durchschnittliche Luftfeuchtigkeit","home.temperature":"Temperatur","home.humidity":"Luftfeuchtigkeit","home.view_sensors":"Sensoren anzeigen","home.people":"Menschen","home.no_people":"Keine Leute","home.no_visible_people":"Keine sichtbaren Personen konfiguriert","home.attention.one":"{count}-Artikel erfordert Aufmerksamkeit","home.attention.other":"{count}-Artikel erfordern Aufmerksamkeit","home.everything_calm":"Alles sieht ruhig aus","home.outside_weather":"Wetter draußen","home.outside":"Draußen","home.alarm_armed":"Scharf","home.alarm_disarmed":"Unscharf","home.good_morning":"Guten Morgen","home.good_afternoon":"Guten Tag","home.good_evening":"Guten Abend","home.swipe_house_information":"Hausinformationen wischen","home.show_all_house_information":"Alle Hausinformationen anzeigen","home.switch_house_information_swipe":"Stellen Sie die Hausinformationen auf Magnetkarten um","home.swipe_cameras":"Swipe-Kameras","home.show_all_cameras":"Alle Kameras anzeigen","home.switch_cameras_swipe":"Wechseln Sie zwischen Kameras und Magnetkarten","home.swipe_areas":"Wischen Sie über Bereiche","home.show_all_areas":"Alle Bereiche anzeigen","home.switch_areas_swipe":"Wechseln Sie Bereiche, um Karten durchzuziehen","status.light_on.one":"{count} Licht an","status.light_on.other":"{count} leuchtet","status.switch_on.one":"{count} einschalten","status.switch_on.other":"{count} schaltet sich ein","status.cover_open.one":"{count} Abdeckung offen","status.cover_open.other":"{count} Abdeckungen geöffnet","status.fan_on.one":"{count} Lüfter eingeschaltet","status.fan_on.other":"{count}-Fans an","status.lock_unlocked.one":"{count}-Schloss entriegelt","status.lock_unlocked.other":"{count} Schlösser entriegelt","status.climate_active.one":"{count} klimaaktiv","status.climate_active.other":"{count} klimaaktiv","status.media_playing.one":"{count} Mediaplayer läuft","status.media_playing.other":"{count} Mediaplayer spielen","status.vacuum_cleaning.one":"{count} Staubsaugen","status.vacuum_cleaning.other":"{count} Staubsauger reinigen","status.alarm_armed.one":"{count} Alarm aktiviert","status.alarm_armed.other":"{count} Alarme aktiviert","status.door_open.one":"{count} Tür offen","status.door_open.other":"{count} Türen öffnen sich","status.window_open.one":"{count}-Fenster geöffnet","status.window_open.other":"{count}-Fenster werden geöffnet","status.opening_open.one":"{count} Öffnung offen","status.opening_open.other":"{count} offene Stellen","status.motion_detected":"{count} Bewegung erkannt","status.smoke_detected":"{count} Rauch erkannt","status.gas_detected":"{count} Gas erkannt","status.moisture_detected":"{count} Feuchtigkeit erkannt","status.occupancy_detected":"{count} Belegung erkannt","status.presence_detected":"{count}-Präsenz erkannt","status.tamper_detected":"{count} Manipulation erkannt","status.vibration_detected":"{count} Vibration erkannt","status.safety_active":"{count} Sicherheit aktiv","action.turn_on":"Einschalten","action.activate":"Aktivieren","action.open_camera":"Kamera öffnen","action.turn_off":"Ausschalten","action.more_info":"Weitere Informationen","action.turn_on_all":"Alles einschalten","action.turn_off_all":"Schalten Sie alles aus","action.open_all":"Alle öffnen","action.close_all":"Alle schließen","action.lock_all":"Alles sperren","action.unlock_all":"Schalte alle frei","action.all_lights_on":"Alle Lichter an","action.all_lights_off":"Alle Lichter aus","action.all_switches_on":"Alle Schalter eingeschaltet","action.all_switches_off":"Alle Schalter aus","action.toggle_lights":"Lichter umschalten","action.toggle_switches":"Kippschalter","action.toggle_covers":"Abdeckungen umschalten","action.confirm_lights":"Möchten Sie wirklich alle Lichter in diesem Bereich umschalten?","action.confirm_switches":"Sind Sie sicher, dass Sie alle Schalter in diesem Bereich umschalten möchten?","action.scene_activated":"Szene aktiviert","action.open":"Öffnen","action.close":"Schließen","action.stop":"Stoppen","action.lock":"Verriegeln","action.unlock":"Entriegeln","action.confirm_bulk":"{action}: {entities}?","action.lights_on_summary":"Alle Lichter einschalten ({total})","action.lights_off_summary":"Alle Lichter ausschalten ({active}/{total} an)","action.switches_on_summary":"Alle Schalter einschalten ({total})","action.switches_off_summary":"Alle Schalter ausschalten ({active}/{total} an)","action.covers_open_summary":"Alle Abdeckungen öffnen ({total})","action.covers_close_summary":"Alle Abdeckungen schließen ({active}/{total} offen)","entity.not_activated":"Noch nicht aktiviert","entity.no_events":"Noch keine Veranstaltungen","entity.power_usage":"Stromverbrauch","entity.select_value":"Wert auswählen","entity.update_failed":"Entität konnte nicht aktualisiert werden","entity.selector_failed":"Der Selektor konnte nicht aktualisiert werden","entity.cover_failed":"Das Cover konnte nicht aktualisiert werden","entity.brightness":"{value}% Helligkeit","entity.climate_set":"eingestellt auf {value}","entity.lock_failed":"Die Sperre konnte nicht aktualisiert werden","entity.lights_failed":"Lichter konnten nicht aktualisiert werden","entity.switches_failed":"Schalter konnten nicht aktualisiert werden","entity.covers_failed":"Cover konnten nicht aktualisiert werden","entity.group_failed":"Die Gruppe konnte nicht aktualisiert werden","page.add_title":"Fügen Sie eine Blueprint-Seite hinzu","page.add_desc":"Importieren Sie einen Blueprint, um ihn als neue Registerkarte im oberen Menü hinzuzufügen.","blueprint.title_add":"Blaupause hinzufügen","blueprint.title_setup":"Blaupause einrichten","blueprint.title_edit":"Seite bearbeiten","blueprint.tab_paste":"Paste","blueprint.tab_url":"Von URL","blueprint.tab_gallery":"Galerie","blueprint.gallery_hint":"Wählen Sie eine Blaupause aus der offiziellen Liste.","blueprint.gallery_empty":"Keine Blaupausen gefunden.","blueprint.gallery_failed":"Die Blueprint-Liste konnte nicht geladen werden: {error}","blueprint.paste_hint":"Fügen Sie hier den vollständigen Blueprint YAML (page.yaml) ein.","blueprint.url_hint_html":"Fügen Sie eine GitHub-URL in die Datei <code>page.yaml</code> (oder dessen Ordner) ein. Ich werde den Bauplan automatisch abrufen.","blueprint.loading":"Laden…","blueprint.fetch":"Bringen","blueprint.invalid_url":"Geben Sie eine gültige URL ein.","blueprint.fetch_failed":"Der Abruf ist fehlgeschlagen (HTTP {status}).","blueprint.load_failed":"Der Blueprint konnte nicht geladen werden: {error}. Tipp: Verwenden Sie die „rohe“ URL der page.yaml-Datei oder fügen Sie YAML ein.","blueprint.fill_failed":"Ausfüllen fehlgeschlagen: {error}","blueprint.new_page":"Neue Seite","blueprint.page_fallback":"Seite","blueprint.missing_cards":"Diese Karte(n) scheinen noch nicht installiert zu sein: {cards}. Installieren Sie sie über HACS, sonst bleiben diese Karten leer.","blueprint.page_name":"Seitenname","blueprint.sidebar_icon":"Seitenleistensymbol","blueprint.settings":"Einstellungen","blueprint.no_fields":"Dieser Blueprint enthält keine konfigurierbaren Felder.","blueprint.edit_yaml":"Bearbeiten Sie YAML","blueprint.apply":"Anwenden","blueprint.check_update":"Suchen Sie nach Updates","blueprint.checking":"Überprüfung…","blueprint.up_to_date":"Bereits aktuell (v{version}).","blueprint.update_available":"Neue Version verfügbar: v{new} (aktuelle v{current}).","blueprint.source_missing":"In der Galerie wurde keine Quell-URL gefunden und kein passender offizieller Entwurf gefunden.","blueprint.update":"Aktualisieren","card_editor.title_add":"Karte hinzufügen","card_editor.title_setup":"Karte einrichten","card_editor.title_edit":"Karte bearbeiten","card_editor.search":"Suchkarte","card_editor.visual_editor":"Visueller Editor","card_editor.code_editor":"Code-Editor","card_editor.loading":"Editor wird geladen…","card_editor.preview":"Vorschau","card_editor.no_preview":"Keine Vorschau für diesen Kartentyp.","card_type.tile.label":"Fliese","card_type.tile.desc":"Kompakte Karte für eine einzelne Einheit mit Schnellsteuerung.","card_type.entities.label":"Entitäten","card_type.entities.desc":"Liste der Entitäten mit Status und Kontrollen.","card_type.button.label":"Taste","card_type.button.desc":"Große Schaltfläche zum Umschalten einer Entität.","card_type.gauge.label":"Messgerät","card_type.gauge.desc":"Zeigt einen numerischen Wert als Maß an.","card_type.history.label":"Graph","card_type.history.desc":"Historisches Diagramm der Entitäten.","card_type.sensor.label":"Sensor","card_type.sensor.desc":"Sensorwert mit optionaler Grafik.","card_type.thermostat.label":"Thermostat","card_type.thermostat.desc":"Steuerelemente für eine Klimaeinheit.","card_type.weather.label":"Wetter","card_type.weather.desc":"Wettervorhersage.","card_type.markdown.label":"Abschlag","card_type.markdown.desc":"Freitext mit Formatierung und Vorlagen.","card_type.picture.label":"Bild","card_type.picture.desc":"Zeigt ein Bild oder eine Kamera.","card_type.glance.label":"Blick","card_type.glance.desc":"Kompakter Überblick über mehrere Entitäten.","card_type.media.label":"Medien","card_type.media.desc":"Steuerelemente für einen Mediaplayer.","card_type.manual.label":"Handbuch (YAML)","card_type.manual.desc":"Geben oder fügen Sie den YAML für eine beliebige Karte selbst ein.","strategy.dashboard_desc":"Passen Sie den Namen und das Seitenleistensymbol dieses Dashboards an.","strategy.name":"Name","strategy.sidebar_icon":"Seitenleistensymbol","strategy.back":"Zurück","strategy.save_name_failed":"Name/Symbol konnte nicht gespeichert werden (siehe Konsole):\n{error}","strategy.edit_area_alert":"Öffnen Sie die Home Assistant-Einstellungen > Bereiche und Zonen, um den Bereich zu bearbeiten.","devices.title":"Geräte","devices.empty":"Keine Geräte gefunden.","devices.new":"Neue Geräte","devices.new.one":"{count} neues Gerät","devices.new.other":"{count} neue Geräte","devices.maintenance":"Wartung","devices.energy":"Energie","devices.invalid_configuration":"Ungültige Konfiguration","devices.all_good":"Alles sieht gut aus","devices.live_power_usage":"Live-Stromverbrauch nach Region","devices.live_power_sensor.one":"{count} Live-Leistungssensor","devices.live_power_sensor.other":"{count} Live-Leistungssensoren","devices.power_entity.one":"{count} Leistungseinheit","devices.power_entity.other":"{count} Machteinheiten","devices.whole_house":"Ganzes Haus","devices.whole_house_history":"Geschichte der Stromversorgung für das ganze Haus","devices.top_area":"Oberer Bereich","devices.total_now":"Jetzt insgesamt","devices.no_power_title":"Keine aktiven Leistungssensoren gefunden","devices.no_power_description":"Energie wird hier angezeigt, wenn Leistungssensoren sichtbaren Bereichen zugewiesen werden.","devices.maintenance_empty":"Im Moment gibt es keine schwachen Batterien oder nicht verfügbare Geräte.","devices.added_just_now":"Gerade erst hinzugefügt","devices.group.one":"{count}-Gerätegruppe","devices.group.other":"{count} Gerätegruppen","devices.low_battery.one":"{count} niedriger Batteriestand","devices.low_battery.other":"{count} niedrige Batteriestände","devices.unavailable_device.one":"{count} nicht verfügbares Gerät","devices.unavailable_device.other":"{count} nicht verfügbare Geräte","devices.new_description":"Geräte, die in den letzten {hours} Stunden zu Home Assistant hinzugefügt wurden.","devices.new_empty":"In den letzten {hours} Stunden wurden keine Geräte zu Home Assistant hinzugefügt.","devices.save_visibility_failed":"Die Gerätesichtbarkeit konnte nicht gespeichert werden:\n{error}","dialog.active_empty":"Keine aktiven Entitäten gefunden","dialog.problem_empty":"Keine problematischen Entitäten gefunden","dialog.power_sensors":"Leistungssensoren","dialog.motion_sensors":"Bewegungssensoren","dialog.door_sensors":"Türsensoren","dialog.window_sensors":"Fenstersensoren","dialog.smoke_sensors":"Rauchmelder","dialog.gas_sensors":"Gasdetektoren","dialog.moisture_sensors":"Feuchtigkeitssensoren","dialog.occupancy_sensors":"Anwesenheitssensoren","dialog.opening_sensors":"Öffnungssensoren","dialog.presence_sensors":"Präsenzsensoren","dialog.safety_sensors":"Sicherheitssensoren","dialog.tamper_sensors":"Manipulationssensoren","dialog.vibration_sensors":"Vibrationssensoren","dialog.no_area":"Kein Bereich","replacement.title":"Blueprint-Ersetzungen","replacement.domain_replacements":"Domain-Ersetzungen","replacement.assign":"Ersatz zuweisen","replacement.domain":"Domain","replacement.empty":"Keine Ersetzungen konfiguriert.","replacement.loading_blueprint":"Blaupause wird geladen…","replacement.entity_hint":"Entität und Name werden für jede gerenderte Entität automatisch ausgefüllt.","replacement.applies_to":"Wird in beiden Ansichten auf {domain}-Entitäten angewendet.","replacement.views_title":"Bereichsansicht + Geräteansicht","replacement.views_description":"Domain-Ersetzungen werden wie in DD3 in beiden Ansichten auf Standard-Entitätskarten angewendet.","replacement.target":"Domain · {domain}","replacement.applies_hint":"Gilt für passende Entitäten in der Bereichs- und Geräteansicht.","replacement.search":"Replace-Card-Blueprints suchen","replacement.load_failed":"{name} konnte nicht geladen werden: {error}","settings.title":"Dwains Dashboard-Einstellungen","settings.subtitle":"Wählen Sie einen Abschnitt zum Konfigurieren aus. Änderungen werden mit der Schaltfläche Speichern unten gespeichert.","settings.loaded_version":"Geladene Version","settings.loading":"Laden","settings.all_settings":"Alle Einstellungen","settings.dashboard_layout":"Dashboard-Layout","settings.dashboard":"Armaturenbrett","settings.dashboard_description":"Name und Seitenleistensymbol.","settings.current_dashboard":"Aktuelles Dashboard","settings.default_dashboard_locked":"Der Standardname des Home Assistant-Dashboards kann hier nicht bearbeitet werden.","settings.open_instance":"Öffnen Sie eine Dwains Dashboard-Instanz, um ihren Namen und ihr Seitenleistensymbol zu bearbeiten.","settings.home_page":"Startseite","settings.home_page_description":"Abschnittsreihenfolge, Hausinformationen und Favoriten.","settings.header_status":"Kopfzeile und Status","settings.header_status_description":"Uhrzeit, Wetter, Benachrichtigungen und Alarmchip.","settings.notifications_shown":"Benachrichtigungen angezeigt","settings.notifications_hidden":"Benachrichtigungen ausgeblendet","settings.alarm_selected":"Alarm ausgewählt","settings.no_alarm_selected":"Kein Alarm ausgewählt","settings.people":"Menschen","settings.people_description":"Wählen Sie aus, welche Personen in Dwains Dashboard sichtbar sind.","settings.areas":"Bereiche","settings.areas_description":"Sichtbare Räume, Raumreihenfolge und Verhalten nicht verfügbarer Entitäten.","settings.unavailable_shown":"Nicht verfügbar angezeigt","settings.unavailable_hidden":"Nicht verfügbar ausgeblendet","settings.devices_page":"Geräteseite","settings.devices_page_description":"Entitätssichtbarkeit und Gerätetypgruppen.","settings.blueprint_replacements":"Blueprint-Ersetzungen","settings.blueprint_replacements_description":"Ersetzen Sie Standardkarten durch Blaupausenkarten.","settings.user_permissions":"Benutzerberechtigungen","settings.user_permissions_description":"Einschränkungen für Benutzer ohne Administratorrechte.","settings.restrictions_enabled":"Einschränkungen aktiviert","settings.default_access":"Standardzugriff","settings.support":"Unterstützung","settings.support_description":"Spendenlinks und SmartHomeShop.io.","settings.optional":"Optional","settings.general":"Allgemein","settings.advanced":"Erweitert","settings.house_cards":"{visible}/{total} Hauskarten","settings.types_visible":"{visible}/{total} Typen sichtbar","settings.hidden_devices_count":"{count} ausgeblendete Geräte","settings.home_layout":"Grundriss des Hauses","settings.home_layout_description":"Wählen Sie die Reihenfolge der Homepage-Abschnitte. Zusammenfassungen zeigen aktive Home Assistant-Reparaturen, Updates und erkannte Geräte.","settings.replace_description":"Ersetzen Sie Standard-Entitätskarten in Bereichs- und Geräteansichten durch Ersatzkarten-Blaupausen.","settings.favorites_description":"Wählen Sie Entitäten aus, die Sie immer auf der Startseite sehen möchten.","settings.time_date":"Uhrzeit und Datum","settings.time_date_description":"Konfigurieren Sie die Anzeige von Uhrzeit und Datum in der Kopfzeile.","settings.notifications_description":"Dwains Dashboard-Benachrichtigungsschaltflächen und -Abzeichen ein- oder ausblenden.","settings.weather_description":"Wählen Sie aus, welche Wettereinheit in der Kopfzeile angezeigt werden soll, oder deaktivieren Sie die Wetteranzeige vollständig.","settings.alarm_description":"Wählen Sie aus, welche Alarmeinheit auf der Startseite angezeigt werden soll. Wenn kein Alarm ausgewählt ist, wird der Alarmchip ausgeblendet.","settings.devices_description":"Konfigurieren Sie, wie Entitäten und Gerätetypgruppen angezeigt werden.","settings.permissions_description":"Optionale Einschränkungen für Home Assistant-Benutzer ohne Administratorrechte.","settings.people_page_description":"Konfigurieren Sie, welche Personen in den Personenkarten und im Dashboard sichtbar sind.","settings.areas_page_description":"Konfigurieren Sie, welche Bereiche sichtbar sind, in welcher Reihenfolge sie angezeigt werden und wie Raumelemente gefiltert werden.","settings.area_order_title":"Reihenfolge der Bereiche","settings.area_order_description":"Wählen Sie, wie Bereiche im gesamten Dwains Dashboard sortiert werden.","settings.area_order_home_assistant":"Home Assistant","settings.area_order_home_assistant_description":"Übernimmt die in Home Assistant festgelegte Reihenfolge.","settings.area_order_custom":"Eigene Reihenfolge","settings.area_order_custom_description":"Legt eine eigene Reihenfolge für Dwains Dashboard fest.","settings.area_order_alphabetical":"Alphabetisch","settings.area_order_alphabetical_description":"Sortiert Bereiche alphabetisch nach Namen.","settings.area_order_drag_hint":"Ziehen Sie die Bereiche unten in die gewünschte Reihenfolge. Ausgeblendete Bereiche behalten ihre Position.","settings.hide_section":"Abschnitt ausblenden","settings.show_section":"Abschnitt anzeigen","settings.hidden_devices":"Versteckte Geräte","settings.no_hidden_devices":"Es wurden keine Geräte mit sichtbaren Entitäten gefunden.","settings.selected_entities":"Ausgewählte Entitäten","settings.selected_weather":"Ausgewählte Wettereinheit","settings.selected_alarm":"Ausgewählte Alarmeinheit","settings.no_weather":"Keine Wetterentität ausgewählt. Das Wetter ist auf der Startseite ausgeblendet.","settings.no_alarm":"Keine Alarmeinheit ausgewählt. Der Alarmchip ist auf der Startseite versteckt.","settings.no_persons":"Keine Personen gefunden","settings.visible_in_dd":"Sichtbar in DD","settings.hidden_in_dd":"Versteckt in DD","settings.discard_confirm":"Nicht gespeicherte Dashboard-Einstellungen verwerfen?","settings.show_suggested_favorites":"Vorgeschlagene Home-Assistant-Favoriten anzeigen","settings.suggested_favorites_description":"Ergänzt häufig verwendete, von Home Assistant vorgeschlagene Entitäten neben Ihren festen Favoriten.","settings.add_entity":"Entität hinzufügen","settings.show_time":"Uhrzeit und Datum im Kopfbereich anzeigen","settings.show_notifications":"Benachrichtigungen in Dwains Dashboard anzeigen","settings.show_weather":"Wetter im Kopfbereich anzeigen","settings.select_weather":"Wetter auswählen","settings.select_alarm":"Alarm auswählen","settings.hide_unavailable_devices":"Nicht verfügbare/unbekannte Entitäten auf der Geräteseite ausblenden","settings.hide_unavailable_devices_description":"Standardmäßig aktiviert. Entitäten mit dem Status 'nicht verfügbar' oder 'unbekannt' werden auf normalen Geräteseiten ausgeblendet, bleiben aber unter Wartung sichtbar.","settings.show_new_devices":"Menü Neue Geräte anzeigen","settings.show_new_devices_description":"Zeigt Geräte an, die in den letzten 48 Stunden zu Home Assistant hinzugefügt wurden, mit einer schnellen Option, komplette Geräte aus Dwains Dashboard auszublenden.","settings.restrict_ha_menu":"Home-Assistant-Menü für Nicht-Administratoren einschränken","settings.restrict_ha_menu_description":"Wenn aktiviert, sehen Nicht-Administratoren die Home-Assistant-Seitenleiste und das Menü in diesem Dashboard nicht. Das mobile Menü zeigt nur die eigenen Profileinstellungen.","settings.restrict_editing":"Bearbeitung für Nicht-Administratoren einschränken","settings.restrict_editing_description":"Wenn aktiviert, können Nicht-Administratoren die Dwains-Dashboard-Einstellungen nicht öffnen oder Dashboard-Inhalte wie benutzerdefinierte Bereichskarten und Blueprint-Seiten ändern.","settings.hide_unavailable_areas":"Nicht verfügbare/unbekannte Entitäten in Bereichen ausblenden","settings.hide_unavailable_areas_description":"Standardmäßig aktiviert. Entitäten mit dem Status 'nicht verfügbar' oder 'unbekannt' werden in Raumkarten ausgeblendet. Bei ausgeblendeten Entitäten zeigt Dwains Dashboard einen Hinweis in der Raumüberschrift.","settings.no_weather_fallback":"Keine Wetterentität ausgewählt. Die erste verfügbare Wetterentität wird verwendet.","settings.move_up":"Nach oben","settings.move_down":"Nach unten","settings.reset_layout":"Standardlayout wiederherstellen","settings.home_camera_cards":"Kameras auf Home","settings.home_camera_cards_description":"Wähle aus, welche Kameravorschauen auf Home angezeigt werden, und lege ihre Reihenfolge fest. Nicht verfügbare Kameras bleiben ausgeblendet, bis sie wieder verbunden sind.","settings.home_camera_cards_empty":"Den sichtbaren Bereichen sind keine Kameras zugeordnet.","settings.reset_camera_cards":"Kamerareihenfolge zurücksetzen","settings.house_information_cards":"Hausinformationskarten","settings.house_information_cards_description":"Wählen Sie die Karten unter Hausinformationen auf Home.","settings.devices_page_types":"Geräteseitentypen","settings.devices_page_types_description":"Wählen Sie die Gerätetypgruppen in der Seitenleiste der Geräteseite.","settings.visible_count":"{visible}/{total} sichtbar","settings.hidden_devices_description":"Blenden Sie komplette Geräte aus. Geräte sind nach Typ und Bereich gruppiert.","settings.select_weather_title":"Wetterentität auswählen","settings.select_alarm_title":"Alarmentität auswählen","settings.select_entity_title":"Entität auswählen","settings.search_weather":"Wetterentitäten suchen…","settings.search_alarm":"Alarmentitäten suchen…","settings.search":"Suchen…","settings.no_person_entities":"Keine Personenentitäten in Ihrer Home-Assistant-Konfiguration gefunden.","settings.hidden_unavailable_count":"{count} ausgeblendete nicht verfügbare/unbekannte Entitäten anzeigen","settings.edit_room":"Raum bearbeiten","summary.issue.one":"{count} Problem","summary.issue.other":"{count} Probleme","summary.update_available.one":"{count} Update verfügbar","summary.update_available.other":"{count} Updates verfügbar","summary.device_to_add.one":"{count} Gerät hinzuzufügen","summary.device_to_add.other":"{count} Geräte hinzuzufügen","support.title":"Unterstützt Dwains Dashboard","support.description":"Ich entwickle Dwains Dashboard als kostenloses Open-Source-Projekt in meiner Freizeit neben meiner Arbeit. Mein tägliches Unternehmen ist SmartHomeShop.io, wo ich Hardwarelösungen für Home Assistant und ESPHome entwickle.","support.donation":"Bitte denken Sie über eine Spende nach","support.github":"GitHub-Sponsor","support.buy_coffee":"Kauf mir einen Kaffee","support.shop_prompt":"Oder hilf mir mit einem Besuch in meinem Shop","support.visit_shop":"SmartHomeShop.io besuchen","home_section.summaries.label":"Zusammenfassungen","home_section.summaries.description":"Reparaturen, Updates und neu entdeckte Geräte von Home Assistant.","home_section.cameras.label":"Kameras","home_section.cameras.description":"Bereichskameras auf der Startseite.","home_section.areas.label":"Bereiche","home_section.areas.description":"Mobile und kleine Zimmerkarten; Der Desktop verwendet das Menü im linken Bereich.","home_section.devices.label":"Hausinformationen","home_section.devices.description":"Personen, Raumklima, Stromverbrauch und Gerätegruppen.","home_section.todos.label":"Aufgabenlisten","home_section.todos.description":"Bearbeitbare Home Assistant-Aufgabenlisten auf der Startseite.","home_section.favorites.label":"Favoriten","home_section.favorites.description":"Von Ihnen ausgewählte angeheftete Elemente.","home_card.people.label":"Menschen","home_card.people.description":"Anwesenheitskarten für die Menschen in diesem Haus.","home_card.climate.label":"Raumklima","home_card.climate.description":"Durchschnittliche Temperatur und Luftfeuchtigkeit von Raumsensoren.","home_card.power.label":"Stromverbrauch im Haus","home_card.power.description":"Aktueller Stromverbrauch im gesamten Haus und in den obersten Räumen.","home_card.device_groups.label":"Gerätegruppen","home_card.device_groups.description":"Statuskarten wie Lichter, Schalter, Rollläden und Bewegung.","error.notifications_load":"Permanente Home Assistant-Benachrichtigungen konnten nicht geladen werden.","error.settings_save":"Dashboard-Einstellungen konnten nicht gespeichert werden: {error}","error.notification_dismiss":"Diese Benachrichtigung konnte nicht geschlossen werden.","error.notifications_dismiss_all":"Es konnten nicht alle Benachrichtigungen geschlossen werden.","error.image_load":"Bild konnte nicht geladen werden","error.canvas_unavailable":"Canvas-Kontext nicht verfügbar","domain.light":"Lichter","domain.switch":"Schalter","domain.fan":"Ventilatoren","domain.cover":"Rollläden","domain.lock":"Schlösser","domain.climate":"Klima","domain.media_player":"Mediaplayer","domain.camera":"Kameras","domain.person":"Menschen","domain.vacuum":"Staubsauger","domain.alarm_control_panel":"Alarm","domain.binary_sensor":"Binäre Sensoren","domain.sensor":"Sensoren","domain.energy":"Energie","domain.scene":"Szenen","domain.event":"Ereignisse","domain.script":"Skripte","domain.automation":"Automatisierungen","domain.button":"Tasten","domain.number":"Zahlen","domain.select":"Auswahllisten","domain.input_boolean":"Schalter","domain.input_number":"Zahlen","domain.input_select":"Auswahllisten","domain.input_button":"Tasten","domain.input_text":"Textfelder","domain.water_heater":"Warmwasserbereiter","domain.humidifier":"Luftbefeuchter","domain.siren":"Sirenen","domain.valve":"Ventile","domain.update":"Aktualisierungen","domain.weather":"Wetter","domain.sun":"Sonne","domain.device_tracker":"Geräte-Tracker","domain.remote":"Fernbedienungen","domain.image":"Bilder","domain.todo":"To-Do-Listen","domain.calendar":"Kalender","domain.lawn_mower":"Rasenmäher","domain.text":"Textfelder","domain.date":"Daten","domain.time":"Zeiten","domain.timer":"Timer","device_class.motion":"Bewegung","device_class.moving":"Bewegung","device_class.occupancy":"Belegung","device_class.presence":"Anwesenheit","device_class.door":"Türen","device_class.garage_door":"Garagentore","device_class.window":"Fenster","device_class.opening":"Öffnungen","device_class.smoke":"Rauch","device_class.gas":"Gas","device_class.carbon_monoxide":"Kohlenmonoxid","device_class.moisture":"Feuchtigkeit","device_class.safety":"Sicherheit","device_class.tamper":"Manipulation","device_class.vibration":"Vibration","device_class.sound":"Geräusch","device_class.lock":"Schlösser","device_class.battery":"Batterie","device_class.battery_charging":"Aufladen","device_class.connectivity":"Konnektivität","device_class.power":"Leistung","device_class.plug":"Stecker","device_class.problem":"Probleme","device_class.heat":"Hitze","device_class.cold":"Kalt","device_class.light":"Licht","device_class.running":"Läuft","device_class.update":"Aktualisierungen","device_class.door_lock":"Schlösser"},fr:{"common.save":"Sauvegarder","common.back":"Dos","common.close":"Fermer","common.cancel":"Annuler","common.add":"Ajouter","common.next":"Suivant","common.edit":"Modifier","common.manage":"Gérer","common.apply":"Appliquer","common.delete":"Supprimer","common.loading":"Chargement…","common.no_content":"Aucun contenu de tableau de bord disponible","common.saving":"Enregistrement…","common.refresh":"Actualiser","common.dismiss":"Ignorer","common.dismiss_all":"Tout ignorer","common.select_option":"Sélectionner une option","common.view_all":"Voir tout","common.see_all":"Voir tout","common.show":"Montrer","common.hide":"Cacher","common.enable":"Activer","common.disable":"Désactiver","common.remove":"Supprimer","common.on":"Sur","common.off":"Désactivé","common.open":"Ouvrir","common.closed":"Fermé","common.unknown":"Inconnu","common.unavailable":"Indisponible","common.none":"Aucun","common.entity.one":"Entité {count}","common.entity.other":"Entités {count}","common.device.one":"Appareil {count}","common.device.other":"Appareils {count}","common.item.one":"Article {count}","common.item.other":"Articles {count}","common.sensor.one":"Capteur {count}","common.sensor.other":"Capteurs {count}","common.area.one":"{count} pièce","common.area.other":"{count} pièces","common.person.one":"{count} personne","common.person.other":"{count} personnes","common.favorite.one":"{count} favori","common.favorite.other":"{count} favoris","common.active.one":"{count} actif","common.active.other":"{count} actifs","common.just_now":"à l'instant","sidebar.home":"Maison","sidebar.add_blueprint":"Ajouter un plan","sidebar.dashboard_settings":"Paramètres du tableau de bord","sidebar.section_title":"Dwains Dashboard","sidebar.areas":"Domaines","sidebar.show":"Afficher la barre latérale de la zone","sidebar.collapse":"Barre latérale de la zone de réduction","sidebar.resize":"Redimensionner la barre latérale de la zone","sidebar.resize_drag":"Faites glisser pour redimensionner la barre latérale de la zone","navigation.menu":"Menu","navigation.pages":"Pages","navigation.profile_settings":"Paramètres du profil","navigation.profile_description":"Ouvrez votre profil Home Assistant","navigation.back_home":"Retour à la maison","navigation.open_menu":"Ouvrir le menu","navigation.current_page":"Page actuelle","navigation.open_page":"Ouvrir la page","navigation.overview":"Aperçu","navigation.all_device_groups":"Tous les groupes d'appareils","favorites.title":"Favoris","favorites.empty":"Aucun favori sélectionné pour l'instant.","favorites.swipe":"Faites glisser les favoris","favorites.show_all":"Afficher tous les favoris","favorites.switch_swipe":"Basculer les favoris vers les cartes magnétiques","person.home":"Maison","person.away":"Loin","person.nobody_home":"Personne à la maison","layout.custom_cards":"Cartes personnalisées","layout.add_card":"Ajouter une carte","layout.done_editing":"Modification terminée","layout.edit_custom_cards":"Modifier des cartes personnalisées","layout.custom_cards_top":"Haut de la zone","layout.custom_cards_after":"Ci-dessous {section}","layout.custom_cards_bottom":"Fond de zone","layout.drag_card":"Faites glisser la carte","layout.edit_page":"Modifier la page","layout.page_settings":"Paramètres / remplir à nouveau","layout.delete_page":"Supprimer la page","layout.delete_page_confirm":"Supprimer la page « {name} » ?","layout.delete_card_confirm":"Supprimer cette carte ?","layout.save_page_failed":"Impossible de sauvegarder la page (voir console) :\n{error}","layout.save_card_failed":"Impossible de sauvegarder la carte (voir console) :\n{error}","layout.swipe_cards":"Cartes à glisser","layout.show_all_cards":"Afficher toutes les cartes","layout.switch_swipe_cards":"Passer aux cartes magnétiques","home.notifications":"Notifications","home.notifications_description":"Notifications persistantes de Home Assistant","home.notifications_loading":"Chargement des notifications…","home.notifications_empty":"Aucune notification persistante","home.notification":"Notification","home.summaries":"Résumés","home.house_information":"Informations sur la maison","home.cameras":"Caméras","home.areas":"Domaines","home.unassigned_spaces":"Espaces non attribués","home.devices_discovered":"Appareils découverts","home.repairs":"Réparations","home.updates":"Mises à jour","home.house_power_usage":"Consommation électrique de la maison","home.no_live_power_sensors":"Pas de capteurs de puissance sous tension","home.no_room_power_usage":"Aucune consommation d'énergie dans la pièce pour le moment","home.indoor_climate":"Climat intérieur","home.average_temperature":"Température moyenne","home.average_humidity":"Humidité moyenne","home.temperature":"Température","home.humidity":"Humidité","home.view_sensors":"Afficher les capteurs","home.people":"Personnes","home.no_people":"Personne","home.no_visible_people":"Aucune personne visible configurée","home.attention.one":"L'article {count} nécessite une attention particulière","home.attention.other":"Les articles {count} nécessitent une attention particulière","home.everything_calm":"Tout semble calme","home.outside_weather":"Météo extérieure","home.outside":"Dehors","home.alarm_armed":"Armée","home.alarm_disarmed":"Désarmée","home.good_morning":"Bonjour","home.good_afternoon":"Bon après-midi","home.good_evening":"Bonne soirée","home.swipe_house_information":"Faites glisser les informations sur la maison","home.show_all_house_information":"Afficher toutes les informations sur la maison","home.switch_house_information_swipe":"Basculez les informations de la maison vers les cartes magnétiques","home.swipe_cameras":"Faites glisser les caméras","home.show_all_cameras":"Afficher toutes les caméras","home.switch_cameras_swipe":"Basculez les caméras vers les cartes magnétiques","home.swipe_areas":"Zones de balayage","home.show_all_areas":"Afficher toutes les zones","home.switch_areas_swipe":"Changer de zone pour glisser des cartes","status.light_on.one":"Voyant {count} allumé","status.light_on.other":"{count} s’allume","status.switch_on.one":"{count} allumer","status.switch_on.other":"{count} s'allume","status.cover_open.one":"Couvercle {count} ouvert","status.cover_open.other":"Couvercles {count} ouverts","status.fan_on.one":"Ventilateur {count} allumé","status.fan_on.other":"Ventilateurs {count} allumés","status.lock_unlocked.one":"Serrure {count} déverrouillée","status.lock_unlocked.other":"Serrures {count} déverrouillées","status.climate_active.one":"{count} climat actif","status.climate_active.other":"{count} climat actif","status.media_playing.one":"Lecteur multimédia {count} en cours de lecture","status.media_playing.other":"Lecteurs multimédia {count} en cours de lecture","status.vacuum_cleaning.one":"Aspirateur {count}","status.vacuum_cleaning.other":"Nettoyage des aspirateurs {count}","status.alarm_armed.one":"Alarme {count} armée","status.alarm_armed.other":"Alarmes {count} armées","status.door_open.one":"Porte {count} ouverte","status.door_open.other":"Portes {count} ouvertes","status.window_open.one":"Fenêtre {count} ouverte","status.window_open.other":"Fenêtres {count} ouvertes","status.opening_open.one":"{count} ouverture ouverte","status.opening_open.other":"Ouvertures {count} ouvertes","status.motion_detected":"Mouvement {count} détecté","status.smoke_detected":"Fumée {count} détectée","status.gas_detected":"Gaz {count} détecté","status.moisture_detected":"Humidité {count} détectée","status.occupancy_detected":"Occupation {count} détectée","status.presence_detected":"Présence {count} détectée","status.tamper_detected":"Autoprotection {count} détectée","status.vibration_detected":"Vibration {count} détectée","status.safety_active":"{count} sécurité active","action.turn_on":"Allumer","action.activate":"Activer","action.open_camera":"Ouvrir la caméra","action.turn_off":"Éteindre","action.more_info":"Plus d'informations","action.turn_on_all":"Allumez tout","action.turn_off_all":"Éteignez tout","action.open_all":"Tout ouvrir","action.close_all":"Fermer tout","action.lock_all":"Verrouiller tout","action.unlock_all":"Débloquez tout","action.all_lights_on":"Toutes les lumières allumées","action.all_lights_off":"Toutes les lumières éteintes","action.all_switches_on":"Tous les interrupteurs sont allumés","action.all_switches_off":"Tous s'éteignent","action.toggle_lights":"Basculer les lumières","action.toggle_switches":"Interrupteurs à bascule","action.toggle_covers":"Basculer les couvertures","action.confirm_lights":"Êtes-vous sûr de vouloir activer toutes les lumières dans cette zone ?","action.confirm_switches":"Êtes-vous sûr de vouloir activer/désactiver tous les commutateurs dans cette zone ?","action.scene_activated":"Scène activée","action.open":"Ouvrir","action.close":"Fermer","action.stop":"Arrêter","action.lock":"Verrouiller","action.unlock":"Déverrouiller","action.confirm_bulk":"{action} : {entities} ?","action.lights_on_summary":"Allumer toutes les lumières ({total})","action.lights_off_summary":"Éteindre toutes les lumières ({active}/{total} allumées)","action.switches_on_summary":"Activer tous les interrupteurs ({total})","action.switches_off_summary":"Désactiver tous les interrupteurs ({active}/{total} activés)","action.covers_open_summary":"Ouvrir tous les volets ({total})","action.covers_close_summary":"Fermer tous les volets ({active}/{total} ouverts)","entity.not_activated":"Pas encore activé","entity.no_events":"Aucun événement pour l'instant","entity.power_usage":"Consommation d'énergie","entity.select_value":"Sélectionner une valeur","entity.update_failed":"Impossible de mettre à jour l'entité","entity.selector_failed":"Impossible de mettre à jour le sélecteur","entity.cover_failed":"Impossible de mettre à jour la couverture","entity.brightness":"Luminosité {value} %","entity.climate_set":"réglé sur {value}","entity.lock_failed":"Impossible de mettre à jour le verrouillage","entity.lights_failed":"Impossible de mettre à jour les lumières","entity.switches_failed":"Impossible de mettre à jour les commutateurs","entity.covers_failed":"Impossible de mettre à jour les couvertures","entity.group_failed":"Impossible de mettre à jour le groupe","page.add_title":"Ajouter une page de plan","page.add_desc":"Importez un plan pour l'ajouter en tant que nouvel onglet dans le menu supérieur.","blueprint.title_add":"Ajouter un plan","blueprint.title_setup":"Configurer le plan","blueprint.title_edit":"Modifier la page","blueprint.tab_paste":"Coller","blueprint.tab_url":"À partir de l'URL","blueprint.tab_gallery":"Galerie","blueprint.gallery_hint":"Choisissez un plan dans la liste officielle.","blueprint.gallery_empty":"Aucun plan trouvé.","blueprint.gallery_failed":"Impossible de charger la liste des plans : {error}","blueprint.paste_hint":"Collez le plan complet YAML (page.yaml) ici.","blueprint.url_hint_html":"Collez une URL GitHub dans <code>page.yaml</code> (ou son dossier). Je vais récupérer le plan automatiquement.","blueprint.loading":"Chargement…","blueprint.fetch":"Aller chercher","blueprint.invalid_url":"Saisissez une URL valide.","blueprint.fetch_failed":"Échec de la récupération (HTTP {status}).","blueprint.load_failed":"Impossible de charger le plan : {error}. Astuce : utilisez l'URL 'brut' du fichier page.yaml ou collez le YAML.","blueprint.fill_failed":"Échec du remplissage : {error}","blueprint.new_page":"Nouvelle page","blueprint.page_fallback":"Page","blueprint.missing_cards":"Ces cartes ne semblent pas encore installées : {cards}. Installez-les via HACS, sinon ces cartes resteront vides.","blueprint.page_name":"Nom de la page","blueprint.sidebar_icon":"Icône de la barre latérale","blueprint.settings":"Paramètres","blueprint.no_fields":"Ce modèle ne comporte aucun champ configurable.","blueprint.edit_yaml":"Modifier YAML","blueprint.apply":"Appliquer","blueprint.check_update":"Vérifier la mise à jour","blueprint.checking":"Vérification…","blueprint.up_to_date":"Déjà à jour (v{version}).","blueprint.update_available":"Nouvelle version disponible : v{new} (actuel v{current}).","blueprint.source_missing":"Aucune URL source trouvée et aucun plan officiel correspondant n'a été trouvé dans la galerie.","blueprint.update":"Mise à jour","card_editor.title_add":"Ajouter une carte","card_editor.title_setup":"Configurer la carte","card_editor.title_edit":"Modifier la carte","card_editor.search":"Carte de recherche","card_editor.visual_editor":"Éditeur visuel","card_editor.code_editor":"Éditeur de codes","card_editor.loading":"Chargement de l'éditeur…","card_editor.preview":"Aperçu","card_editor.no_preview":"Aucun aperçu pour ce type de carte.","card_type.tile.label":"Tuile","card_type.tile.desc":"Carte compacte pour une seule entité avec des contrôles rapides.","card_type.entities.label":"Entités","card_type.entities.desc":"Liste des entités avec état et contrôles.","card_type.button.label":"Bouton","card_type.button.desc":"Gros bouton pour basculer une entité.","card_type.gauge.label":"Jauge","card_type.gauge.desc":"Affiche une valeur numérique sous forme de jauge.","card_type.history.label":"Graphique","card_type.history.desc":"Graphique historique des entités.","card_type.sensor.label":"Capteur","card_type.sensor.desc":"Valeur du capteur avec un graphique en option.","card_type.thermostat.label":"Thermostat","card_type.thermostat.desc":"Contrôles pour une entité climatique.","card_type.weather.label":"Météo","card_type.weather.desc":"Prévisions météorologiques.","card_type.markdown.label":"Réduction","card_type.markdown.desc":"Texte libre avec mise en forme et modèles.","card_type.picture.label":"Image","card_type.picture.desc":"Affiche une image ou une caméra.","card_type.glance.label":"Coup d'oeil","card_type.glance.desc":"Aperçu compact de plusieurs entités.","card_type.media.label":"Médias","card_type.media.desc":"Commandes pour un lecteur multimédia.","card_type.manual.label":"Manuel (YAML)","card_type.manual.desc":"Tapez ou collez vous-même le YAML pour n’importe quelle carte.","strategy.dashboard_desc":"Ajustez le nom et l'icône de la barre latérale de ce tableau de bord.","strategy.name":"Nom","strategy.sidebar_icon":"Icône de la barre latérale","strategy.back":"Dos","strategy.save_name_failed":"L'enregistrement du nom/icône a échoué (voir console) :\n{error}","strategy.edit_area_alert":"Ouvrez les paramètres Home Assistant > Zones et zones pour modifier la zone.","devices.title":"Appareils","devices.empty":"Aucun appareil trouvé.","devices.new":"Nouveaux appareils","devices.new.one":"Nouvel appareil {count}","devices.new.other":"Nouveaux appareils {count}","devices.maintenance":"Entretien","devices.energy":"Énergie","devices.invalid_configuration":"Configuration invalide","devices.all_good":"Tout a l'air bien","devices.live_power_usage":"Consommation d'énergie en direct par zone","devices.live_power_sensor.one":"Capteur de puissance sous tension {count}","devices.live_power_sensor.other":"Capteurs de puissance sous tension {count}","devices.power_entity.one":"Entité électrique {count}","devices.power_entity.other":"Entités électriques {count}","devices.whole_house":"Maison entière","devices.whole_house_history":"Historique de l'alimentation électrique de toute la maison","devices.top_area":"Zone supérieure","devices.total_now":"Total maintenant","devices.no_power_title":"Aucun capteur de puissance sous tension trouvé","devices.no_power_description":"L'énergie apparaîtra ici lorsque les capteurs de puissance sont attribués aux zones visibles.","devices.maintenance_empty":"Pas de piles faibles ni d'appareils indisponibles pour le moment.","devices.added_just_now":"Ajouté tout à l'heure","devices.group.one":"Groupe de périphériques {count}","devices.group.other":"Groupes de périphériques {count}","devices.low_battery.one":"{count} batterie faible","devices.low_battery.other":"{count} batteries faibles","devices.unavailable_device.one":"{count} appareil indisponible","devices.unavailable_device.other":"{count} appareils indisponibles","devices.new_description":"Appareils ajoutés à Home Assistant au cours des {hours} dernières heures.","devices.new_empty":"Aucun appareil n’a été ajouté à Home Assistant au cours des {hours} dernières heures.","devices.save_visibility_failed":"Impossible d’enregistrer la visibilité de l’appareil :\n{error}","dialog.active_empty":"Aucune entité active trouvée","dialog.problem_empty":"Aucune entité problématique trouvée","dialog.power_sensors":"Capteurs de puissance","dialog.motion_sensors":"Capteurs de mouvement","dialog.door_sensors":"Capteurs de porte","dialog.window_sensors":"Capteurs de fenêtre","dialog.smoke_sensors":"Détecteurs de fumée","dialog.gas_sensors":"Détecteurs de gaz","dialog.moisture_sensors":"Capteurs d'humidité","dialog.occupancy_sensors":"Capteurs de présence","dialog.opening_sensors":"Capteurs d'ouverture","dialog.presence_sensors":"Capteurs de présence","dialog.safety_sensors":"Capteurs de sécurité","dialog.tamper_sensors":"Capteurs d'autoprotection","dialog.vibration_sensors":"Capteurs de vibrations","dialog.no_area":"Aucune zone","replacement.title":"Remplacements de plans","replacement.domain_replacements":"Remplacements de domaines","replacement.assign":"Attribuer un remplacement","replacement.domain":"Domaine","replacement.empty":"Aucun remplacement configuré.","replacement.loading_blueprint":"Chargement du plan…","replacement.entity_hint":"L'entité et le nom sont renseignés automatiquement pour chaque entité rendue.","replacement.applies_to":"Sera appliqué aux entités {domain} dans les deux vues.","replacement.views_title":"Vue des pièces + vue des appareils","replacement.views_description":"Les remplacements de domaines sont appliqués aux cartes d’entité standard dans les deux vues, comme dans DD3.","replacement.target":"Domaine · {domain}","replacement.applies_hint":"S’applique aux entités correspondantes dans les vues des pièces et des appareils.","replacement.search":"Rechercher des blueprints replace-card","replacement.load_failed":"Impossible de charger {name} : {error}","settings.title":"Paramètres Dwains Dashboard","settings.subtitle":"Choisissez une section à configurer. Les modifications sont enregistrées avec le bouton Enregistrer ci-dessous.","settings.loaded_version":"Version chargée","settings.loading":"Chargement","settings.all_settings":"Tous les paramètres","settings.dashboard_layout":"Disposition du tableau de bord","settings.dashboard":"Tableau de bord","settings.dashboard_description":"Nom et icône de la barre latérale.","settings.current_dashboard":"Tableau de bord actuel","settings.default_dashboard_locked":"Le nom du tableau de bord Home Assistant par défaut ne peut pas être modifié ici.","settings.open_instance":"Ouvrez une instance Dwains Dashboard pour modifier son nom et son icône dans la barre latérale.","settings.home_page":"Page d'accueil","settings.home_page_description":"Ordre des sections, informations sur la maison et favoris.","settings.header_status":"En-tête et statut","settings.header_status_description":"Heure, météo, notifications et puce d'alarme.","settings.notifications_shown":"Notifications affichées","settings.notifications_hidden":"Notifications masquées","settings.alarm_selected":"Alarme sélectionnée","settings.no_alarm_selected":"Aucune alarme sélectionnée","settings.people":"Personnes","settings.people_description":"Choisissez quelles personnes sont visibles dans Dwains Dashboard.","settings.areas":"Domaines","settings.areas_description":"Salles visibles, ordre des salles et comportement des entités indisponibles.","settings.unavailable_shown":"Indisponible affiché","settings.unavailable_hidden":"Indisponible masqué","settings.devices_page":"Page Appareils","settings.devices_page_description":"Visibilité des entités et groupes de types d’appareils.","settings.blueprint_replacements":"Remplacements de plans","settings.blueprint_replacements_description":"Remplacez les cartes par défaut par des cartes de modèle.","settings.user_permissions":"Autorisations utilisateur","settings.user_permissions_description":"Restrictions pour les utilisateurs non-administrateurs.","settings.restrictions_enabled":"Restrictions activées","settings.default_access":"Accès par défaut","settings.support":"Soutien","settings.support_description":"Liens de don et SmartHomeShop.io.","settings.optional":"Facultatif","settings.general":"Général","settings.advanced":"Avancé","settings.house_cards":"{visible}/{total} cartes maison","settings.types_visible":"{visible}/{total} types visibles","settings.hidden_devices_count":"{count} appareils masqués","settings.home_layout":"Aménagement de la maison","settings.home_layout_description":"Choisissez l'ordre des sections de la page d'accueil. Les résumés montrent les réparations actives du Home Assistant, les mises à jour et les appareils découverts.","settings.replace_description":"Remplacez les cartes d'entité standard dans les vues de zone et de périphériques par des plans de remplacement de carte.","settings.favorites_description":"Choisissez les entités que vous souhaitez toujours voir sur la page d'accueil.","settings.time_date":"Heure et date","settings.time_date_description":"Configurez l'affichage de l'heure et de la date dans l'en-tête.","settings.notifications_description":"Afficher ou masquer les boutons et badges de notification Dwains Dashboard.","settings.weather_description":"Choisissez quelle entité météo afficher dans l’en-tête ou désactivez complètement l’affichage météo.","settings.alarm_description":"Choisissez quelle entité d'alarme afficher sur la page d'accueil. Si aucune alarme n'est sélectionnée, la puce d'alarme sera masquée.","settings.devices_description":"Configurez la façon dont les entités et les groupes de types d’appareils sont affichés.","settings.permissions_description":"Restrictions facultatives pour les utilisateurs Home Assistant sans droits d'administrateur.","settings.people_page_description":"Configurez les personnes visibles dans les fiches personnelles et le tableau de bord.","settings.areas_page_description":"Configurez les zones visibles, dans quel ordre elles sont affichées et comment les entités de pièce sont filtrées.","settings.area_order_title":"Ordre des zones","settings.area_order_description":"Choisissez comment les zones sont classées dans tout Dwains Dashboard.","settings.area_order_home_assistant":"Home Assistant","settings.area_order_home_assistant_description":"Suit l'ordre des zones configuré dans Home Assistant.","settings.area_order_custom":"Ordre personnalisé","settings.area_order_custom_description":"Définissez un ordre propre à Dwains Dashboard.","settings.area_order_alphabetical":"Alphabétique","settings.area_order_alphabetical_description":"Classe les zones par nom dans l’ordre alphabétique.","settings.area_order_drag_hint":"Faites glisser les zones ci-dessous dans l’ordre souhaité. Les zones masquées conservent leur position.","settings.hide_section":"Masquer la section","settings.show_section":"Afficher la section","settings.hidden_devices":"Appareils cachés","settings.no_hidden_devices":"Aucun appareil avec des entités visibles n'a été trouvé.","settings.selected_entities":"Entités sélectionnées","settings.selected_weather":"Entité météo sélectionnée","settings.selected_alarm":"Entité d'alarme sélectionnée","settings.no_weather":"Aucune entité météo sélectionnée. La météo est masquée sur la page d'accueil.","settings.no_alarm":"Aucune entité d'alarme sélectionnée. La puce d'alarme est cachée sur la page d'accueil.","settings.no_persons":"Aucune personne trouvée","settings.visible_in_dd":"Visible dans DD","settings.hidden_in_dd":"Caché dans DD","settings.discard_confirm":"Supprimer les paramètres du tableau de bord non enregistrés ?","settings.show_suggested_favorites":"Afficher les favoris suggérés par Home Assistant","settings.suggested_favorites_description":"Ajoute les entités souvent utilisées suggérées par Home Assistant à côté de vos favoris épinglés.","settings.add_entity":"Ajouter une entité","settings.show_time":"Afficher l’heure et la date dans l’en-tête","settings.show_notifications":"Afficher les notifications dans Dwains Dashboard","settings.show_weather":"Afficher la météo dans l’en-tête","settings.select_weather":"Sélectionner la météo","settings.select_alarm":"Sélectionner l’alarme","settings.hide_unavailable_devices":"Masquer les entités indisponibles/inconnues sur la page Appareils","settings.hide_unavailable_devices_description":"Activé par défaut. Les entités à l'état 'indisponible' ou 'inconnu' sont masquées des pages Appareils normales, mais restent visibles dans Maintenance.","settings.show_new_devices":"Afficher le menu Nouveaux appareils","settings.show_new_devices_description":"Affiche les appareils ajoutés à Home Assistant au cours des dernières 48 heures, avec une option rapide pour masquer des appareils complets de Dwains Dashboard.","settings.restrict_ha_menu":"Restreindre le menu Home Assistant aux non-administrateurs","settings.restrict_ha_menu_description":"Lorsque cette option est activée, les non-administrateurs ne voient pas la barre latérale ni le menu Home Assistant depuis ce tableau de bord. Le menu mobile affiche uniquement les paramètres de leur propre profil.","settings.restrict_editing":"Restreindre la modification aux non-administrateurs","settings.restrict_editing_description":"Lorsque cette option est activée, les non-administrateurs ne peuvent pas ouvrir les paramètres de Dwains Dashboard ni modifier le contenu, comme les cartes de zone personnalisées et les pages de blueprint.","settings.hide_unavailable_areas":"Masquer les entités indisponibles/inconnues dans les zones","settings.hide_unavailable_areas_description":"Activé par défaut. Les entités à l'état 'indisponible' ou 'inconnu' sont masquées des cartes de pièce. Lorsque des entités sont masquées, Dwains Dashboard affiche un indicateur d'attention dans l'en-tête de la pièce.","settings.no_weather_fallback":"Aucune entité météo sélectionnée. La première entité météo disponible sera utilisée.","settings.move_up":"Déplacer vers le haut","settings.move_down":"Déplacer vers le bas","settings.reset_layout":"Rétablir la disposition par défaut","settings.home_camera_cards":"Caméras sur l'accueil","settings.home_camera_cards_description":"Choisissez les aperçus de caméra affichés sur l'accueil et définissez leur ordre. Les caméras indisponibles restent masquées jusqu'à leur reconnexion.","settings.home_camera_cards_empty":"Aucune caméra n'est associée aux zones visibles.","settings.reset_camera_cards":"Réinitialiser l'ordre des caméras","settings.house_information_cards":"Cartes d’informations de la maison","settings.house_information_cards_description":"Choisissez les cartes affichées dans Informations de la maison sur Accueil.","settings.devices_page_types":"Types de la page Appareils","settings.devices_page_types_description":"Choisissez les groupes de types affichés dans la barre latérale Appareils.","settings.visible_count":"{visible}/{total} visibles","settings.hidden_devices_description":"Masquez des appareils complets. Ils sont regroupés par type et zone.","settings.select_weather_title":"Sélectionner une entité météo","settings.select_alarm_title":"Sélectionner une entité d’alarme","settings.select_entity_title":"Sélectionner une entité","settings.search_weather":"Rechercher des entités météo…","settings.search_alarm":"Rechercher des entités d’alarme…","settings.search":"Rechercher…","settings.no_person_entities":"Aucune entité de personne trouvée dans votre configuration Home Assistant.","settings.hidden_unavailable_count":"Afficher {count} entités indisponibles/inconnues masquées","settings.edit_room":"Modifier la pièce","summary.issue.one":"{count} problème","summary.issue.other":"{count} problèmes","summary.update_available.one":"{count} mise à jour disponible","summary.update_available.other":"{count} mises à jour disponibles","summary.device_to_add.one":"{count} appareil à ajouter","summary.device_to_add.other":"{count} appareils à ajouter","support.title":"Prise en charge de Dwains Dashboard","support.description":"Je développe Dwains Dashboard comme projet libre et gratuit pendant mon temps libre, en parallèle de mon travail. Mon activité principale est SmartHomeShop.io, où je conçois des solutions matérielles pour Home Assistant et ESPHome.","support.donation":"Veuillez envisager un don","support.github":"Commanditaire GitHub","support.buy_coffee":"Achetez-moi un café","support.shop_prompt":"Ou aidez-moi en découvrant ma boutique","support.visit_shop":"Visiter SmartHomeShop.io","home_section.summaries.label":"Résumés","home_section.summaries.description":"Réparations, mises à jour et appareils nouvellement découverts de Home Assistant.","home_section.cameras.label":"Caméras","home_section.cameras.description":"Caméras de zone sur la page d'accueil.","home_section.areas.label":"Domaines","home_section.areas.description":"Cartes de chambres mobiles et sur petit écran ; le bureau utilise le menu de la zone de gauche.","home_section.devices.label":"Informations sur la maison","home_section.devices.description":"Personnes, climat intérieur, consommation d’énergie et groupes d’appareils.","home_section.todos.label":"Listes de tâches","home_section.todos.description":"Listes de tâches Home Assistant modifiables sur la page d’accueil.","home_section.favorites.label":"Favoris","home_section.favorites.description":"Entités épinglées sélectionnées par vous.","home_card.people.label":"Personnes","home_card.people.description":"Cartes de présence pour les personnes de cette maison.","home_card.climate.label":"Climat intérieur","home_card.climate.description":"Température et humidité moyennes des capteurs d'ambiance.","home_card.power.label":"Consommation électrique de la maison","home_card.power.description":"Consommation électrique actuelle de toute la maison et principales pièces.","home_card.device_groups.label":"Groupes d'appareils","home_card.device_groups.description":"Cartes d'état telles que les lumières, les interrupteurs, les volets et les mouvements.","error.notifications_load":"Impossible de charger les notifications persistantes Home Assistant.","error.settings_save":"Impossible d’enregistrer les paramètres du tableau de bord : {error}","error.notification_dismiss":"Impossible de rejeter cette notification.","error.notifications_dismiss_all":"Impossible de rejeter toutes les notifications.","error.image_load":"L'image n'a pas pu être chargée","error.canvas_unavailable":"Contexte du canevas indisponible","domain.light":"Lumières","domain.switch":"Interrupteurs","domain.fan":"Ventilateurs","domain.cover":"Volets","domain.lock":"Serrures","domain.climate":"Climat","domain.media_player":"Lecteurs multimédias","domain.camera":"Caméras","domain.person":"Personnes","domain.vacuum":"Aspirateurs","domain.alarm_control_panel":"Alarme","domain.binary_sensor":"Capteurs binaires","domain.sensor":"Capteurs","domain.energy":"Énergie","domain.scene":"Scènes","domain.event":"Événements","domain.script":"Scripts","domain.automation":"Automatisations","domain.button":"Boutons","domain.number":"Nombres","domain.select":"Sélecteurs","domain.input_boolean":"Interrupteurs","domain.input_number":"Nombres","domain.input_select":"Sélecteurs","domain.input_button":"Boutons","domain.input_text":"Champs de texte","domain.water_heater":"Chauffe-eau","domain.humidifier":"Humidificateurs","domain.siren":"Sirènes","domain.valve":"Vannes","domain.update":"Mises à jour","domain.weather":"Météo","domain.sun":"Soleil","domain.device_tracker":"Traqueurs d'appareils","domain.remote":"Télécommandes","domain.image":"Images","domain.todo":"Listes de tâches","domain.calendar":"Calendriers","domain.lawn_mower":"Tondeuses à gazon","domain.text":"Champs de texte","domain.date":"Dates","domain.time":"Heures","domain.timer":"Minuteries","device_class.motion":"Mouvement","device_class.moving":"Mouvement","device_class.occupancy":"Occupation","device_class.presence":"Présence","device_class.door":"Portes","device_class.garage_door":"Portes de garage","device_class.window":"Fenêtres","device_class.opening":"Ouvertures","device_class.smoke":"Fumée","device_class.gas":"Gaz","device_class.carbon_monoxide":"Monoxyde de carbone","device_class.moisture":"Humidité","device_class.safety":"Sécurité","device_class.tamper":"Sabotage","device_class.vibration":"Vibration","device_class.sound":"Son","device_class.lock":"Serrures","device_class.battery":"Batterie","device_class.battery_charging":"Chargement","device_class.connectivity":"Connectivité","device_class.power":"Puissance","device_class.plug":"Prises","device_class.problem":"Problèmes","device_class.heat":"Chaleur","device_class.cold":"Froid","device_class.light":"Lumière","device_class.running":"Actif","device_class.update":"Mises à jour","device_class.door_lock":"Serrures"},es:{"common.save":"Ahorrar","common.back":"Atrás","common.close":"Cerca","common.cancel":"Cancelar","common.add":"Agregar","common.next":"Próximo","common.edit":"Editar","common.manage":"Gestionar","common.apply":"Aplicar","common.delete":"Borrar","common.loading":"Cargando…","common.no_content":"No hay contenido del panel disponible","common.saving":"Guardando…","common.refresh":"Actualizar","common.dismiss":"Descartar","common.dismiss_all":"Descartar todo","common.select_option":"Seleccionar opción","common.view_all":"Ver todo","common.see_all":"Ver todo","common.show":"Espectáculo","common.hide":"Esconder","common.enable":"Activar","common.disable":"Desactivar","common.remove":"Eliminar","common.on":"En","common.off":"Apagado","common.open":"Abierto","common.closed":"Cerrado","common.unknown":"Desconocido","common.unavailable":"Indisponible","common.none":"Ninguno","common.entity.one":"Entidad {count}","common.entity.other":"Entidades {count}","common.device.one":"Dispositivo {count}","common.device.other":"Dispositivos {count}","common.item.one":"{count} artículo","common.item.other":"Artículos {count}","common.sensor.one":"Sensor {count}","common.sensor.other":"Sensores {count}","common.area.one":"{count} estancia","common.area.other":"{count} estancias","common.person.one":"{count} persona","common.person.other":"{count} personas","common.favorite.one":"{count} favorito","common.favorite.other":"{count} favoritos","common.active.one":"{count} activo","common.active.other":"{count} activos","common.just_now":"ahora mismo","sidebar.home":"Hogar","sidebar.add_blueprint":"Agregar plano","sidebar.dashboard_settings":"Configuración del panel","sidebar.section_title":"Dwains Dashboard","sidebar.areas":"Áreas","sidebar.show":"Mostrar barra lateral del área","sidebar.collapse":"Contraer barra lateral del área","sidebar.resize":"Cambiar el ancho de la barra lateral de áreas","sidebar.resize_drag":"Arrastra para cambiar el ancho de la barra lateral de áreas","navigation.menu":"Menú","navigation.pages":"paginas","navigation.profile_settings":"Configuración de perfil","navigation.profile_description":"Abre tu perfil Home Assistant","navigation.back_home":"De vuelta a casa","navigation.open_menu":"abrir menú","navigation.current_page":"Página actual","navigation.open_page":"Abrir página","navigation.overview":"Descripción general","navigation.all_device_groups":"Todos los grupos de dispositivos","favorites.title":"Favoritos","favorites.empty":"Aún no se han seleccionado favoritos.","favorites.swipe":"Desliza favoritos","favorites.show_all":"Mostrar todos los favoritos","favorites.switch_swipe":"Cambiar favoritos para deslizar tarjetas","person.home":"Hogar","person.away":"Lejos","person.nobody_home":"nadie en casa","layout.custom_cards":"Tarjetas personalizadas","layout.add_card":"Agregar tarjeta","layout.done_editing":"Edición terminada","layout.edit_custom_cards":"Editar tarjetas personalizadas","layout.custom_cards_top":"Parte superior del área","layout.custom_cards_after":"Debajo de {section}","layout.custom_cards_bottom":"Fondo del área","layout.drag_card":"Tarjeta de arrastre","layout.edit_page":"Editar página","layout.page_settings":"Configuración/rellenar de nuevo","layout.delete_page":"Eliminar página","layout.delete_page_confirm":'¿Eliminar la página "{name}"?',"layout.delete_card_confirm":"¿Eliminar esta tarjeta?","layout.save_page_failed":"No se pudo guardar la página (ver consola):\n{error}","layout.save_card_failed":"No se pudo guardar la tarjeta (ver consola):\n{error}","layout.swipe_cards":"Tarjetas magnéticas","layout.show_all_cards":"Mostrar todas las tarjetas","layout.switch_swipe_cards":"Cambiar a tarjetas magnéticas","home.notifications":"Notificaciones","home.notifications_description":"Notificaciones persistentes de Home Assistant","home.notifications_loading":"Cargando notificaciones…","home.notifications_empty":"Sin notificaciones persistentes","home.notification":"Notificación","home.summaries":"Resúmenes","home.house_information":"Información de la casa","home.cameras":"Cámaras","home.areas":"Áreas","home.unassigned_spaces":"Espacios no asignados","home.devices_discovered":"Dispositivos descubiertos","home.repairs":"Refacción","home.updates":"Actualizaciones","home.house_power_usage":"Uso de energía en la casa","home.no_live_power_sensors":"Sin sensores de energía en vivo","home.no_room_power_usage":"No hay uso de energía en la habitación en este momento","home.indoor_climate":"Clima interior","home.average_temperature":"Temperatura media","home.average_humidity":"Humedad media","home.temperature":"Temperatura","home.humidity":"Humedad","home.view_sensors":"Ver sensores","home.people":"Gente","home.no_people":"Ninguna gente","home.no_visible_people":"No hay personas visibles configuradas","home.attention.one":"El artículo {count} necesita atención","home.attention.other":"Los artículos {count} necesitan atención","home.everything_calm":"todo parece tranquilo","home.outside_weather":"Clima exterior","home.outside":"Afuera","home.alarm_armed":"Armada","home.alarm_disarmed":"Desarmada","home.good_morning":"Buen día","home.good_afternoon":"Buenas tardes","home.good_evening":"Buenas noches","home.swipe_house_information":"Desliza la información de la casa","home.show_all_house_information":"Mostrar toda la información de la casa","home.switch_house_information_swipe":"Cambie la información de la casa a tarjetas magnéticas","home.swipe_cameras":"Cámaras deslizantes","home.show_all_cameras":"Mostrar todas las cámaras","home.switch_cameras_swipe":"Cambiar cámaras para deslizar tarjetas","home.swipe_areas":"Áreas de deslizamiento","home.show_all_areas":"Mostrar todas las áreas","home.switch_areas_swipe":"Cambiar áreas para deslizar tarjetas","status.light_on.one":"Luz {count} encendida","status.light_on.other":"Luces {count} encendidas","status.switch_on.one":"{count} enciende","status.switch_on.other":"{count} se enciende","status.cover_open.one":"Cubierta {count} abierta","status.cover_open.other":"Cubiertas {count} abiertas","status.fan_on.one":"Ventilador {count} encendido","status.fan_on.other":"Ventiladores {count} encendidos","status.lock_unlocked.one":"Bloqueo {count} desbloqueado","status.lock_unlocked.other":"Cerraduras {count} desbloqueadas","status.climate_active.one":"{count} climático activo","status.climate_active.other":"{count} climático activo","status.media_playing.one":"Reproductor multimedia {count} reproduciéndose","status.media_playing.other":"Reproductores multimedia {count} reproduciéndose","status.vacuum_cleaning.one":"Aspiradora {count}","status.vacuum_cleaning.other":"Limpieza de aspiradoras {count}","status.alarm_armed.one":"Alarma {count} armada","status.alarm_armed.other":"Alarmas {count} armadas","status.door_open.one":"{count} puerta abierta","status.door_open.other":"{count} puertas abiertas","status.window_open.one":"Ventana {count} abierta","status.window_open.other":"Ventanas {count} abiertas.","status.opening_open.one":"{count} apertura abierta","status.opening_open.other":"Aperturas {count} abiertas","status.motion_detected":"Movimiento {count} detectado","status.smoke_detected":"Humo {count} detectado","status.gas_detected":"{count} gas detectado","status.moisture_detected":"Humedad {count} detectada","status.occupancy_detected":"Ocupación {count} detectada","status.presence_detected":"Presencia detectada {count}","status.tamper_detected":"Se detectó manipulación {count}","status.vibration_detected":"Vibración {count} detectada","status.safety_active":"{count} seguridad activa","action.turn_on":"Encender","action.activate":"Activar","action.open_camera":"Abrir cámara","action.turn_off":"Apagar","action.more_info":"Más información","action.turn_on_all":"encender todo","action.turn_off_all":"Apagar todo","action.open_all":"Abrir todo","action.close_all":"Cerrar todo","action.lock_all":"bloquear todo","action.unlock_all":"Desbloquear todo","action.all_lights_on":"Todas las luces encendidas","action.all_lights_off":"Todas las luces apagadas","action.all_switches_on":"Todo se enciende","action.all_switches_off":"Todo se apaga","action.toggle_lights":"alternar luces","action.toggle_switches":"Interruptores de palanca","action.toggle_covers":"Alternar cubiertas","action.confirm_lights":"¿Está seguro de que desea alternar todas las luces en esta área?","action.confirm_switches":"¿Está seguro de que desea alternar todos los interruptores en esta área?","action.scene_activated":"Escena activada","action.open":"Abrir","action.close":"Cerrar","action.stop":"Detener","action.lock":"Bloquear","action.unlock":"Desbloquear","action.confirm_bulk":"¿{action}: {entities}?","action.lights_on_summary":"Encender todas las luces ({total})","action.lights_off_summary":"Apagar todas las luces ({active}/{total} encendidas)","action.switches_on_summary":"Encender todos los interruptores ({total})","action.switches_off_summary":"Apagar todos los interruptores ({active}/{total} encendidos)","action.covers_open_summary":"Abrir todas las cubiertas ({total})","action.covers_close_summary":"Cerrar todas las cubiertas ({active}/{total} abiertas)","entity.not_activated":"Aún no activado","entity.no_events":"Aún no hay eventos","entity.power_usage":"Uso de energía","entity.select_value":"Seleccionar valor","entity.update_failed":"No se pudo actualizar la entidad","entity.selector_failed":"No se pudo actualizar el selector","entity.cover_failed":"No se pudo actualizar la portada","entity.brightness":"{value}% de brillo","entity.climate_set":"ajustado a {value}","entity.lock_failed":"No se pudo actualizar el bloqueo","entity.lights_failed":"No se pudieron actualizar las luces","entity.switches_failed":"No se pudieron actualizar los interruptores","entity.covers_failed":"No se pudieron actualizar las portadas","entity.group_failed":"No se pudo actualizar el grupo","page.add_title":"Agregar una página de plano","page.add_desc":"Importe un plano para agregarlo como una nueva pestaña en el menú superior.","blueprint.title_add":"Agregar plano","blueprint.title_setup":"Configurar plano","blueprint.title_edit":"Editar página","blueprint.tab_paste":"Pasta","blueprint.tab_url":"Desde URL","blueprint.tab_gallery":"Galería","blueprint.gallery_hint":"Elija un plano de la lista oficial.","blueprint.gallery_empty":"No se encontraron planos.","blueprint.gallery_failed":"No se pudo cargar la lista de planos: {error}","blueprint.paste_hint":"Pegue el plano completo YAML (page.yaml) aquí.","blueprint.url_hint_html":"Pegue una URL de GitHub en <code>page.yaml</code> (o su carpeta). Buscaré el plano automáticamente.","blueprint.loading":"Cargando…","blueprint.fetch":"Buscar","blueprint.invalid_url":"Introduzca una URL válida.","blueprint.fetch_failed":"La recuperación falló (HTTP {status}).","blueprint.load_failed":'No se pudo cargar el plano: {error}. Consejo: utilice la URL "sin formato" del archivo page.yaml o pegue el archivo YAML.',"blueprint.fill_failed":"Error al completar: {error}","blueprint.new_page":"Nueva pagina","blueprint.page_fallback":"Página","blueprint.missing_cards":"Estas tarjetas no parecen estar instaladas todavía: {cards}. Instálelas a través de HACS; de lo contrario, esas tarjetas permanecerán vacías.","blueprint.page_name":"Nombre de la página","blueprint.sidebar_icon":"Icono de la barra lateral","blueprint.settings":"Ajustes","blueprint.no_fields":"Este plano no tiene campos configurables.","blueprint.edit_yaml":"Editar YAML","blueprint.apply":"Aplicar","blueprint.check_update":"Buscar actualizaciones","blueprint.checking":"De cheques…","blueprint.up_to_date":"Ya actualizado (v{version}).","blueprint.update_available":"Nueva versión disponible: v{new} (actual v{current}).","blueprint.source_missing":"No se encontró ninguna URL de origen ni ningún plano oficial coincidente en la galería.","blueprint.update":"Actualizar","card_editor.title_add":"Agregar tarjeta","card_editor.title_setup":"Configurar tarjeta","card_editor.title_edit":"Editar tarjeta","card_editor.search":"Tarjeta de búsqueda","card_editor.visual_editor":"editor visual","card_editor.code_editor":"editor de código","card_editor.loading":"Cargando editor…","card_editor.preview":"Avance","card_editor.no_preview":"No hay vista previa para este tipo de tarjeta.","card_type.tile.label":"Teja","card_type.tile.desc":"Tarjeta compacta para una sola entidad con controles rápidos.","card_type.entities.label":"Entidades","card_type.entities.desc":"Listado de entidades con estado y controles.","card_type.button.label":"Botón","card_type.button.desc":"Botón grande para alternar una entidad.","card_type.gauge.label":"Indicador","card_type.gauge.desc":"Muestra un valor numérico como indicador.","card_type.history.label":"Gráfico","card_type.history.desc":"Gráfico histórico de entidades.","card_type.sensor.label":"Sensor","card_type.sensor.desc":"Valor del sensor con gráfico opcional.","card_type.thermostat.label":"Termostato","card_type.thermostat.desc":"Controles para una entidad climática.","card_type.weather.label":"Clima","card_type.weather.desc":"Pronóstico del tiempo.","card_type.markdown.label":"Reducción","card_type.markdown.desc":"Texto libre con formato y plantillas.","card_type.picture.label":"Imagen","card_type.picture.desc":"Muestra una imagen o cámara.","card_type.glance.label":"Mirada","card_type.glance.desc":"Descripción general compacta de múltiples entidades.","card_type.media.label":"Medios de comunicación","card_type.media.desc":"Controles para un reproductor multimedia.","card_type.manual.label":"Manual (YAML)","card_type.manual.desc":"Escriba o pegue usted mismo el YAML para cualquier tarjeta.","strategy.dashboard_desc":"Ajuste el nombre y el icono de la barra lateral de este panel.","strategy.name":"Nombre","strategy.sidebar_icon":"Icono de la barra lateral","strategy.back":"Atrás","strategy.save_name_failed":"Error al guardar el nombre/icono (ver consola):\n{error}","strategy.edit_area_alert":"Abra Configuración de Home Assistant > Áreas y zonas para editar el área.","devices.title":"Dispositivos","devices.empty":"No se encontraron dispositivos.","devices.new":"Nuevos dispositivos","devices.new.one":"{count} nuevo dispositivo","devices.new.other":"{count} nuevos dispositivos","devices.maintenance":"Mantenimiento","devices.energy":"Energía","devices.invalid_configuration":"Configuración no válida","devices.all_good":"todo se ve bien","devices.live_power_usage":"Uso de energía en vivo por área","devices.live_power_sensor.one":"Sensor de potencia viva {count}","devices.live_power_sensor.other":"Sensores de potencia viva {count}","devices.power_entity.one":"Entidad de poder {count}","devices.power_entity.other":"{count} entidades de poder","devices.whole_house":"Toda la casa","devices.whole_house_history":"Historial de energía en toda la casa","devices.top_area":"zona superior","devices.total_now":"Total ahora","devices.no_power_title":"No se encontraron sensores de energía en vivo","devices.no_power_description":"La energía aparecerá aquí cuando los sensores de potencia se asignen a áreas visibles.","devices.maintenance_empty":"No hay baterías bajas ni dispositivos no disponibles en este momento.","devices.added_just_now":"Agregado hace un momento","devices.group.one":"Grupo de dispositivos {count}","devices.group.other":"Grupos de dispositivos {count}","devices.low_battery.one":"{count} batería baja","devices.low_battery.other":"{count} baterías bajas","devices.unavailable_device.one":"{count} dispositivo no disponible","devices.unavailable_device.other":"{count} dispositivos no disponibles","devices.new_description":"Dispositivos añadidos a Home Assistant durante las últimas {hours} horas.","devices.new_empty":"No se añadieron dispositivos a Home Assistant durante las últimas {hours} horas.","devices.save_visibility_failed":"No se pudo guardar la visibilidad del dispositivo:\n{error}","dialog.active_empty":"No se encontraron entidades activas","dialog.problem_empty":"No se encontraron entidades problemáticas","dialog.power_sensors":"Sensores de potencia","dialog.motion_sensors":"Sensores de movimiento","dialog.door_sensors":"Sensores de puerta","dialog.window_sensors":"Sensores de ventana","dialog.smoke_sensors":"detectores de humo","dialog.gas_sensors":"detectores de gas","dialog.moisture_sensors":"Sensores de humedad","dialog.occupancy_sensors":"Sensores de ocupación","dialog.opening_sensors":"Sensores de apertura","dialog.presence_sensors":"Sensores de presencia","dialog.safety_sensors":"Sensores de seguridad","dialog.tamper_sensors":"Sensores de manipulación","dialog.vibration_sensors":"Sensores de vibración","dialog.no_area":"Sin área","replacement.title":"Reemplazos de planos","replacement.domain_replacements":"Reemplazos de dominio","replacement.assign":"Asignar reemplazo","replacement.domain":"Dominio","replacement.empty":"No se han configurado reemplazos.","replacement.loading_blueprint":"Cargando plano…","replacement.entity_hint":"La entidad y el nombre se completan automáticamente para cada entidad representada.","replacement.applies_to":"Se aplicará a las entidades {domain} en ambas vistas.","replacement.views_title":"Vista de áreas + vista de dispositivos","replacement.views_description":"Los reemplazos de dominio se aplican a las tarjetas de entidad estándar en ambas vistas, como en DD3.","replacement.target":"Dominio · {domain}","replacement.applies_hint":"Se aplica a entidades coincidentes en las vistas de áreas y dispositivos.","replacement.search":"Buscar blueprints replace-card","replacement.load_failed":"No se pudo cargar {name}: {error}","settings.title":"Configuración de Dwains Dashboard","settings.subtitle":"Elija una sección para configurar. Los cambios se guardan con el botón Guardar a continuación.","settings.loaded_version":"Versión cargada","settings.loading":"Cargando","settings.all_settings":"Todas las configuraciones","settings.dashboard_layout":"Diseño del tablero","settings.dashboard":"Panel","settings.dashboard_description":"Nombre e icono de la barra lateral.","settings.current_dashboard":"Panel actual","settings.default_dashboard_locked":"El nombre del panel Home Assistant predeterminado no se puede editar aquí.","settings.open_instance":"Abra una instancia de Dwains Dashboard para editar su nombre y su icono de la barra lateral.","settings.home_page":"pagina de inicio","settings.home_page_description":"Orden de secciones, información de la casa y favoritos.","settings.header_status":"Encabezado y estado","settings.header_status_description":"Hora, clima, notificaciones y chip de alarma.","settings.notifications_shown":"Notificaciones mostradas","settings.notifications_hidden":"Notificaciones ocultas","settings.alarm_selected":"Alarma seleccionada","settings.no_alarm_selected":"Ninguna alarma seleccionada","settings.people":"Gente","settings.people_description":"Elige qué personas son visibles en Dwains Dashboard.","settings.areas":"Áreas","settings.areas_description":"Salas visibles, orden de las salas y comportamiento de entidades no disponibles.","settings.unavailable_shown":"No disponible mostrado","settings.unavailable_hidden":"No disponible oculto","settings.devices_page":"Página de dispositivos","settings.devices_page_description":"Visibilidad de entidades y grupos de tipos de dispositivos.","settings.blueprint_replacements":"Reemplazos de planos","settings.blueprint_replacements_description":"Reemplace las tarjetas predeterminadas con tarjetas de planos.","settings.user_permissions":"Permisos de usuario","settings.user_permissions_description":"Restricciones para usuarios no administradores.","settings.restrictions_enabled":"Restricciones habilitadas","settings.default_access":"Acceso predeterminado","settings.support":"Apoyo","settings.support_description":"Enlaces de donación y SmartHomeShop.io.","settings.optional":"Opcional","settings.general":"General","settings.advanced":"Avanzado","settings.house_cards":"{visible}/{total} tarjetas de la casa","settings.types_visible":"{visible}/{total} tipos visibles","settings.hidden_devices_count":"{count} dispositivos ocultos","settings.home_layout":"Diseño de la casa","settings.home_layout_description":"Elija el orden de las secciones de la página de inicio. Los resúmenes muestran reparaciones activas de Home Assistant, actualizaciones y dispositivos descubiertos.","settings.replace_description":"Reemplace las tarjetas de entidad estándar en las vistas de áreas y dispositivos con planos de tarjetas de reemplazo.","settings.favorites_description":"Elija las entidades que siempre desee ver en la página de inicio.","settings.time_date":"Hora y fecha","settings.time_date_description":"Configure la visualización de hora y fecha en el encabezado.","settings.notifications_description":"Muestra u oculta los botones e insignias de notificación Dwains Dashboard.","settings.weather_description":"Elija qué entidad meteorológica mostrar en el encabezado o deshabilite la visualización del tiempo por completo.","settings.alarm_description":"Elija qué entidad de alarma mostrar en la página de inicio. Si no se selecciona ninguna alarma, el chip de alarma quedará oculto.","settings.devices_description":"Configure cómo se muestran las entidades y los grupos de tipos de dispositivos.","settings.permissions_description":"Restricciones opcionales para usuarios de Home Assistant sin derechos de administrador.","settings.people_page_description":"Configure qué personas son visibles en las tarjetas de persona y en el tablero.","settings.areas_page_description":"Configure qué áreas son visibles, en qué orden se muestran y cómo se filtran las entidades de la sala.","settings.area_order_title":"Orden de las áreas","settings.area_order_description":"Elija cómo se ordenan las áreas en todo Dwains Dashboard.","settings.area_order_home_assistant":"Home Assistant","settings.area_order_home_assistant_description":"Sigue el orden de áreas configurado en Home Assistant.","settings.area_order_custom":"Orden personalizado","settings.area_order_custom_description":"Define un orden propio para Dwains Dashboard.","settings.area_order_alphabetical":"Alfabético","settings.area_order_alphabetical_description":"Ordena las áreas alfabéticamente por nombre.","settings.area_order_drag_hint":"Arrastre las áreas de abajo al orden que prefiera. Las áreas ocultas conservan su posición.","settings.hide_section":"Ocultar sección","settings.show_section":"Mostrar sección","settings.hidden_devices":"Dispositivos ocultos","settings.no_hidden_devices":"No se encontraron dispositivos con entidades visibles.","settings.selected_entities":"Entidades seleccionadas","settings.selected_weather":"Entidad meteorológica seleccionada","settings.selected_alarm":"Entidad de alarma seleccionada","settings.no_weather":"No se seleccionó ninguna entidad meteorológica. El tiempo está oculto en la página de inicio.","settings.no_alarm":"No se seleccionó ninguna entidad de alarma. El chip de alarma está oculto en la página de inicio.","settings.no_persons":"No se encontraron personas","settings.visible_in_dd":"Visible en DD","settings.hidden_in_dd":"Oculto en DD","settings.discard_confirm":"¿Descartar la configuración del panel no guardada?","settings.show_suggested_favorites":"Mostrar favoritos sugeridos por Home Assistant","settings.suggested_favorites_description":"Añade junto a tus favoritos fijados las entidades de uso frecuente sugeridas por Home Assistant.","settings.add_entity":"Añadir entidad","settings.show_time":"Mostrar hora y fecha en el encabezado","settings.show_notifications":"Mostrar notificaciones en Dwains Dashboard","settings.show_weather":"Mostrar el tiempo en el encabezado","settings.select_weather":"Seleccionar tiempo","settings.select_alarm":"Seleccionar alarma","settings.hide_unavailable_devices":"Ocultar entidades no disponibles/desconocidas en Dispositivos","settings.hide_unavailable_devices_description":"Activado de forma predeterminada. Las entidades con estado 'no disponible' o 'desconocido' se ocultan de las páginas normales de Dispositivos, pero siguen apareciendo en Mantenimiento.","settings.show_new_devices":"Mostrar menú Nuevos dispositivos","settings.show_new_devices_description":"Muestra los dispositivos añadidos a Home Assistant en las últimas 48 horas, con una opción rápida para ocultar dispositivos completos de Dwains Dashboard.","settings.restrict_ha_menu":"Restringir el menú de Home Assistant a usuarios no administradores","settings.restrict_ha_menu_description":"Cuando está activado, los usuarios no administradores no ven la barra lateral ni el menú de Home Assistant desde este panel. El menú móvil solo muestra la configuración de su propio perfil.","settings.restrict_editing":"Restringir la edición a usuarios no administradores","settings.restrict_editing_description":"Cuando está activado, los usuarios no administradores no pueden abrir la configuración de Dwains Dashboard ni cambiar contenido como tarjetas de área personalizadas y páginas de blueprint.","settings.hide_unavailable_areas":"Ocultar entidades no disponibles/desconocidas en áreas","settings.hide_unavailable_areas_description":"Activado de forma predeterminada. Las entidades con estado 'no disponible' o 'desconocido' se ocultan de las tarjetas de habitación. Cuando hay entidades ocultas, Dwains Dashboard muestra un indicador de atención en el encabezado de la habitación.","settings.no_weather_fallback":"No se seleccionó ninguna entidad meteorológica. Se utilizará la primera entidad meteorológica disponible.","settings.move_up":"Mover arriba","settings.move_down":"Mover abajo","settings.reset_layout":"Restablecer diseño predeterminado","settings.home_camera_cards":"Cámaras en Inicio","settings.home_camera_cards_description":"Elige qué vistas previas de cámara aparecen en Inicio y define su orden. Las cámaras no disponibles permanecen ocultas hasta que vuelvan a conectarse.","settings.home_camera_cards_empty":"No hay cámaras asignadas a áreas visibles.","settings.reset_camera_cards":"Restablecer el orden de las cámaras","settings.house_information_cards":"Tarjetas de información de la casa","settings.house_information_cards_description":"Elige qué tarjetas aparecen en Información de la casa en Inicio.","settings.devices_page_types":"Tipos de la página Dispositivos","settings.devices_page_types_description":"Elige qué grupos de tipos se muestran en la barra lateral de Dispositivos.","settings.visible_count":"{visible}/{total} visibles","settings.hidden_devices_description":"Oculta dispositivos completos. Se agrupan por tipo y área.","settings.select_weather_title":"Seleccionar entidad meteorológica","settings.select_alarm_title":"Seleccionar entidad de alarma","settings.select_entity_title":"Seleccionar entidad","settings.search_weather":"Buscar entidades meteorológicas…","settings.search_alarm":"Buscar entidades de alarma…","settings.search":"Buscar…","settings.no_person_entities":"No se encontraron entidades de persona en tu configuración de Home Assistant.","settings.hidden_unavailable_count":"Mostrar {count} entidades no disponibles/desconocidas ocultas","settings.edit_room":"Editar habitación","summary.issue.one":"{count} problema","summary.issue.other":"{count} problemas","summary.update_available.one":"{count} actualización disponible","summary.update_available.other":"{count} actualizaciones disponibles","summary.device_to_add.one":"{count} dispositivo por añadir","summary.device_to_add.other":"{count} dispositivos por añadir","support.title":"Soporte Dwains Dashboard","support.description":"Desarrollo Dwains Dashboard como un proyecto gratuito y de código abierto en mi tiempo libre junto a mi trabajo. Mi actividad diaria principal es SmartHomeShop.io, donde desarrollo soluciones de hardware para Home Assistant y ESPHome.","support.donation":"Por favor considere una donación","support.github":"Patrocinador GitHub","support.buy_coffee":"Cómprame un café","support.shop_prompt":"O ayúdame visitando mi tienda","support.visit_shop":"Visitar SmartHomeShop.io","home_section.summaries.label":"Resúmenes","home_section.summaries.description":"Reparaciones, actualizaciones y dispositivos recién descubiertos de Home Assistant.","home_section.cameras.label":"Cámaras","home_section.cameras.description":"Cámaras de zona en la página de inicio.","home_section.areas.label":"Áreas","home_section.areas.description":"Tarjetas de sala móviles y de pantalla pequeña; El escritorio utiliza el menú del área izquierda.","home_section.devices.label":"Información de la casa","home_section.devices.description":"Personas, clima interior, uso de energía y grupos de dispositivos.","home_section.todos.label":"Listas de tareas","home_section.todos.description":"Listas de tareas editables de Home Assistant en la página de inicio.","home_section.favorites.label":"Favoritos","home_section.favorites.description":"Entidades fijadas seleccionadas por usted.","home_card.people.label":"Gente","home_card.people.description":"Tarjetas de presencia para las personas de este hogar.","home_card.climate.label":"Clima interior","home_card.climate.description":"Temperatura y humedad promedio de los sensores de la habitación.","home_card.power.label":"Uso de energía en la casa","home_card.power.description":"Uso actual de energía en toda la casa y habitaciones superiores.","home_card.device_groups.label":"Grupos de dispositivos","home_card.device_groups.description":"Tarjetas de estado como luces, interruptores, persianas y movimiento.","error.notifications_load":"No se pudieron cargar las notificaciones persistentes de Home Assistant.","error.settings_save":"No se pudo guardar la configuración del panel: {error}","error.notification_dismiss":"No se pudo descartar esta notificación.","error.notifications_dismiss_all":"No se pudieron descartar todas las notificaciones.","error.image_load":"No se pudo cargar la imagen","error.canvas_unavailable":"Contexto del lienzo no disponible","domain.light":"Luces","domain.switch":"Interruptores","domain.fan":"Ventiladores","domain.cover":"Persianas","domain.lock":"Cerraduras","domain.climate":"Clima","domain.media_player":"Reproductores multimedia","domain.camera":"Cámaras","domain.person":"Personas","domain.vacuum":"Aspiradoras","domain.alarm_control_panel":"Alarma","domain.binary_sensor":"Sensores binarios","domain.sensor":"Sensores","domain.energy":"Energía","domain.scene":"Escenas","domain.event":"Eventos","domain.script":"Scripts","domain.automation":"Automatizaciones","domain.button":"Botones","domain.number":"Números","domain.select":"Selectores","domain.input_boolean":"Interruptores","domain.input_number":"Números","domain.input_select":"Selectores","domain.input_button":"Botones","domain.input_text":"Campos de texto","domain.water_heater":"Calentadores de agua","domain.humidifier":"Humidificadores","domain.siren":"Sirenas","domain.valve":"Válvulas","domain.update":"Actualizaciones","domain.weather":"Clima","domain.sun":"Sol","domain.device_tracker":"Rastreadores de dispositivos","domain.remote":"Mandos a distancia","domain.image":"Imágenes","domain.todo":"Listas de tareas pendientes","domain.calendar":"Calendarios","domain.lawn_mower":"Cortacéspedes","domain.text":"Campos de texto","domain.date":"Fechas","domain.time":"Horas","domain.timer":"Temporizadores","device_class.motion":"Movimiento","device_class.moving":"Movimiento","device_class.occupancy":"Ocupación","device_class.presence":"Presencia","device_class.door":"Puertas","device_class.garage_door":"Puertas de garaje","device_class.window":"Ventanas","device_class.opening":"Aperturas","device_class.smoke":"Humo","device_class.gas":"Gas","device_class.carbon_monoxide":"Monóxido de carbono","device_class.moisture":"Humedad","device_class.safety":"Seguridad","device_class.tamper":"Manipulación","device_class.vibration":"Vibración","device_class.sound":"Sonido","device_class.lock":"Cerraduras","device_class.battery":"Batería","device_class.battery_charging":"Cargando","device_class.connectivity":"Conectividad","device_class.power":"Potencia","device_class.plug":"Enchufes","device_class.problem":"Problemas","device_class.heat":"Calor","device_class.cold":"Frío","device_class.light":"Luz","device_class.running":"Activo","device_class.update":"Actualizaciones","device_class.door_lock":"Cabellos"},"zh-hans":{"common.save":"保存","common.back":"返回","common.close":"关闭","common.cancel":"取消","common.add":"添加","common.next":"下一步","common.edit":"编辑","common.manage":"管理","common.apply":"套用","common.delete":"删除","common.loading":"加载中…","common.no_content":"没有可显示的仪表板内容","common.saving":"保存…","common.refresh":"刷新","common.dismiss":"清除","common.dismiss_all":"全部清除","common.select_option":"选择选项","common.view_all":"查看全部","common.see_all":"查看全部","common.show":"显示","common.hide":"隐藏","common.enable":"激活","common.disable":"停用","common.remove":"移除","common.on":"在","common.off":"离开","common.open":"打开","common.closed":"已关闭","common.unknown":"未知","common.unavailable":"无法使用","common.none":"无","common.entity.one":"{count} 个实体","common.entity.other":"{count} 个实体","common.device.one":"{count} 台设备","common.device.other":"{count} 个设备","common.item.one":"{count} 件","common.item.other":"{count} 件商品","common.sensor.one":"{count} 个传感器","common.sensor.other":"{count} 个传感器","common.area.one":"{count} 区域","common.area.other":"{count} 个区域","common.person.one":"{count} 人","common.person.other":"{count} 位成员","common.favorite.one":"最喜欢 {count} 个","common.favorite.other":"{count} 个收藏夹","common.active.one":"{count} 个激活中","common.active.other":"{count} 个激活中","common.just_now":"现在","sidebar.home":"首页","sidebar.add_blueprint":"添加蓝图","sidebar.dashboard_settings":"仪表板设置","sidebar.section_title":"Dwains Dashboard","sidebar.areas":"区域","sidebar.show":"显示区域侧边栏","sidebar.collapse":"收合区域侧边栏","sidebar.resize":"调整区域侧边栏宽度","sidebar.resize_drag":"拖曳以调整区域侧边栏宽度","navigation.menu":"菜单","navigation.pages":"页面","navigation.profile_settings":"个人设置","navigation.profile_description":"打开你的 Home Assistant 个人数据","navigation.back_home":"返回首页","navigation.open_menu":"打开菜单","navigation.current_page":"目前页面","navigation.open_page":"打开页面","navigation.overview":"总览","navigation.all_device_groups":"所有设备群组","favorites.title":"我的最爱","favorites.empty":"尚未选择任何最爱。","favorites.swipe":"滑动收藏夹","favorites.show_all":"显示所有收藏夹","favorites.switch_swipe":"切换收藏夹至刷卡","person.home":"在家","person.away":"外出","person.nobody_home":"没人在家","layout.custom_cards":"自订卡片","layout.add_card":"添加卡片","layout.done_editing":"完成编辑","layout.edit_custom_cards":"编辑自订卡片","layout.custom_cards_top":"区域顶端","layout.custom_cards_after":"{section} 下方","layout.custom_cards_bottom":"区域底部","layout.drag_card":"拖曳卡片","layout.edit_page":"编辑页面","layout.page_settings":"设置 / 重新填写","layout.delete_page":"删除页面","layout.delete_page_confirm":"删除页面「{name}」?","layout.delete_card_confirm":"删除这张卡片?","layout.save_page_failed":"无法保存页面(请见主控台):\n{error}","layout.save_card_failed":"无法保存卡片(请见主控台):\n{error}","layout.swipe_cards":"滑动卡片","layout.show_all_cards":"显示所有卡片","layout.switch_swipe_cards":"切换为滑动卡片","home.notifications":"通知","home.notifications_description":"来自 Home Assistant 的常驻通知","home.notifications_loading":"正在加载通知...","home.notifications_empty":"没有常驻通知","home.notification":"通知","home.summaries":"摘要","home.house_information":"住家信息","home.cameras":"摄影机","home.areas":"区域","home.unassigned_spaces":"未指派空间","home.devices_discovered":"发现新设备","home.repairs":"维修","home.updates":"更新","home.house_power_usage":"住家用电","home.no_live_power_sensors":"没有即时用电传感器","home.no_room_power_usage":"目前没有房间用电量","home.indoor_climate":"室内气候","home.average_temperature":"平均气温","home.average_humidity":"平均湿度","home.temperature":"温度","home.humidity":"湿度","home.view_sensors":"查看传感器","home.people":"成员","home.no_people":"没有成员","home.no_visible_people":"尚未设置要显示的成员","home.attention.one":"{count} 项需要注意","home.attention.other":"有 {count} 项需要注意","home.everything_calm":"一切正常","home.outside_weather":"户外天气","home.outside":"户外","home.alarm_armed":"已设防","home.alarm_disarmed":"已解除","home.good_morning":"早安","home.good_afternoon":"午安","home.good_evening":"晚安","home.swipe_house_information":"扫一扫房屋信息","home.show_all_house_information":"显示所有房屋信息","home.switch_house_information_swipe":"将房屋信息切换为刷卡","home.swipe_cameras":"滑动相机","home.show_all_cameras":"显示所有摄像头","home.switch_cameras_swipe":"切换摄像头刷卡","home.swipe_areas":"滑动区域","home.show_all_areas":"显示所有区域","home.switch_areas_swipe":"切换区域刷卡","status.light_on.one":"{count} 灯亮","status.light_on.other":"{count} 灯亮","status.switch_on.one":"{count} 次开启","status.switch_on.other":"{count} 开启","status.cover_open.one":"{count} 个盖子打开","status.cover_open.other":"{count} 个盖子打开","status.fan_on.one":"{count} 扇动","status.fan_on.other":"{count} 名粉丝","status.lock_unlocked.one":"{count} 个锁已解锁","status.lock_unlocked.other":"{count} 个锁已解锁","status.climate_active.one":"{count} 气候活跃","status.climate_active.other":"{count} 气候活跃","status.media_playing.one":"{count} 个媒体播放器正在播放","status.media_playing.other":"{count} 个媒体播放器正在播放","status.vacuum_cleaning.one":"{count} 真空清洁","status.vacuum_cleaning.other":"{count} 吸尘器清洁","status.alarm_armed.one":"{count} 个警报已布防","status.alarm_armed.other":"{count} 个警报已开启","status.door_open.one":"{count} 扇门打开","status.door_open.other":"{count} 扇门打开","status.window_open.one":"{count} 个窗口打开","status.window_open.other":"打开了 {count} 个窗口","status.opening_open.one":"{count} 个开放","status.opening_open.other":"已开放 {count} 个空缺职位","status.motion_detected":"检测到 {count} 个动作","status.smoke_detected":"检测到 {count} 烟雾","status.gas_detected":"检测到 {count} 种气体","status.moisture_detected":"检测到 {count} 个水分","status.occupancy_detected":"检测到 {count} 个占用","status.presence_detected":"检测到 {count} 个存在","status.tamper_detected":"检测到 {count} 个篡改","status.vibration_detected":"检测到 {count} 个振动","status.safety_active":"{count} 安全已激活","action.turn_on":"打开","action.activate":"激活","action.open_camera":"打开摄影机","action.turn_off":"关闭","action.more_info":"更多信息","action.turn_on_all":"全部打开","action.turn_off_all":"全部关闭","action.open_all":"全部打开","action.close_all":"全部关上","action.lock_all":"全部上锁","action.unlock_all":"全部解锁","action.all_lights_on":"所有灯光打开","action.all_lights_off":"所有灯光关闭","action.all_switches_on":"所有开关打开","action.all_switches_off":"所有开关关闭","action.toggle_lights":"切换灯","action.toggle_switches":"拨动开关","action.toggle_covers":"切换盖","action.confirm_lights":"确定要切换此区域内的所有灯光吗?","action.confirm_switches":"确定要切换此区域内的所有开关吗?","action.scene_activated":"情境已激活","action.open":"打开","action.close":"关闭","action.stop":"停止","action.lock":"上锁","action.unlock":"解锁","action.confirm_bulk":"{action} {entities}？","action.lights_on_summary":"打开所有灯光({total})","action.lights_off_summary":"关闭所有灯光({active}/{total} 已打开)","action.switches_on_summary":"打开所有开关({total})","action.switches_off_summary":"关闭所有开关({active}/{total} 已打开)","action.covers_open_summary":"打开所有窗帘({total})","action.covers_close_summary":"关闭所有遮盖（{active}/{total} 个打开）","entity.not_activated":"尚未激活","entity.no_events":"尚无事件","entity.power_usage":"用电量","entity.select_value":"选择值","entity.update_failed":"无法更新实体","entity.selector_failed":"无法更新选择器","entity.cover_failed":"无法更新窗帘","entity.brightness":"{value}% 亮度","entity.climate_set":"设置为 {value}","entity.lock_failed":"无法更新锁","entity.lights_failed":"无法更新灯光","entity.switches_failed":"无法更新开关","entity.covers_failed":"无法更新窗帘","entity.group_failed":"无法更新群组","page.add_title":"添加蓝图页面","page.add_desc":"导入蓝图,将其加为顶部菜单的新分页。","blueprint.title_add":"添加蓝图","blueprint.title_setup":"设置蓝图","blueprint.title_edit":"编辑页面","blueprint.tab_paste":"粘贴","blueprint.tab_url":"从网址","blueprint.tab_gallery":"范例库","blueprint.gallery_hint":"从官方清单选择一个蓝图。","blueprint.gallery_empty":"找不到蓝图。","blueprint.gallery_failed":"无法加载蓝图清单:{error}","blueprint.paste_hint":"在此粘贴完整的蓝图 YAML(page.yaml)。","blueprint.url_hint_html":"粘贴指向 <code>page.yaml</code>(或其文件夹)的 GitHub 网址,我会自动抓取蓝图。","blueprint.loading":"加载中…","blueprint.fetch":"抓取","blueprint.invalid_url":"请输入有效的网址。","blueprint.fetch_failed":"抓取失败(HTTP {status})。","blueprint.load_failed":"无法加载蓝图:{error}。提示:请使用 page.yaml 文件的『raw』网址,或直接粘贴 YAML。","blueprint.fill_failed":"填入失败:{error}","blueprint.new_page":"新页面","blueprint.page_fallback":"页面","blueprint.missing_cards":"这些卡片似乎尚未安装:{cards}。请通过 HACS 安装,否则那些卡片会是空的。","blueprint.page_name":"页面名称","blueprint.sidebar_icon":"侧边栏图标","blueprint.settings":"设置","blueprint.no_fields":"此蓝图没有可设置的字段。","blueprint.edit_yaml":"编辑 YAML","blueprint.apply":"套用","blueprint.check_update":"检查更新","blueprint.checking":"检查中…","blueprint.up_to_date":"已是最新版本(v{version})。","blueprint.update_available":"有新版本:v{new}(目前 v{current})。","blueprint.source_missing":"找不到来源网址,范例库中也没有相符的官方蓝图。","blueprint.update":"更新","card_editor.title_add":"添加卡片","card_editor.title_setup":"设置卡片","card_editor.title_edit":"编辑卡片","card_editor.search":"搜索卡片","card_editor.visual_editor":"可视化编辑器","card_editor.code_editor":"代码编辑器","card_editor.loading":"加载编辑器…","card_editor.preview":"预览","card_editor.no_preview":"此卡片类型没有预览。","card_type.tile.label":"图砖","card_type.tile.desc":"单一实体的精简卡片,附快速控制。","card_type.entities.label":"实体","card_type.entities.desc":"实体清单,含状态与控制。","card_type.button.label":"按钮","card_type.button.desc":"切换实体的大按钮。","card_type.gauge.label":"量表","card_type.gauge.desc":"以量表显示数值。","card_type.history.label":"图表","card_type.history.desc":"实体的历史图表。","card_type.sensor.label":"传感器","card_type.sensor.desc":"传感器数值,可另附图表。","card_type.thermostat.label":"温控器","card_type.thermostat.desc":"空调(climate)实体的控制。","card_type.weather.label":"天气","card_type.weather.desc":"天气预报。","card_type.markdown.label":"Markdown","card_type.markdown.desc":"可格式化与套用范本的自由文本。","card_type.picture.label":"图片","card_type.picture.desc":"显示图片或摄影机。","card_type.glance.label":"概览","card_type.glance.desc":"多个实体的精简总览。","card_type.media.label":"媒体","card_type.media.desc":"媒体播放器的控制。","card_type.manual.label":"手动(YAML)","card_type.manual.desc":"自行输入或粘贴任何卡片的 YAML。","strategy.dashboard_desc":"调整此仪表板的名称与侧边栏图标。","strategy.name":"名称","strategy.sidebar_icon":"侧边栏图标","strategy.back":"返回","strategy.save_name_failed":"保存名称/图标失败(请见主控台):\n{error}","strategy.edit_area_alert":"请至 Home Assistant 设置 > 区域与区块来编辑区域。","devices.title":"设备","devices.empty":"找不到设备。","devices.new":"新设备","devices.new.one":"{count} 个新设备","devices.new.other":"{count} 个新设备","devices.maintenance":"维护","devices.energy":"能源","devices.invalid_configuration":"配置无效","devices.all_good":"一切正常","devices.live_power_usage":"各区域即时用电量","devices.live_power_sensor.one":"{count} 个实时功率传感器","devices.live_power_sensor.other":"{count} 个即时用电传感器","devices.power_entity.one":"{count} 个权力实体","devices.power_entity.other":"{count} 个电力实体","devices.whole_house":"整个住家","devices.whole_house_history":"整个住家用电历史","devices.top_area":"用电最高区域","devices.total_now":"目前总计","devices.no_power_title":"找不到即时电力传感器","devices.no_power_description":"当功率传感器分配到可见区域时，能量将出现在此处。","devices.maintenance_empty":"目前没有低电量或无法使用的设备。","devices.added_just_now":"刚刚加入","devices.group.one":"{count} 个设备组","devices.group.other":"{count} 个设备群组","devices.low_battery.one":"{count} 个低电量","devices.low_battery.other":"{count} 个低电量","devices.unavailable_device.one":"{count} 个无法使用的设备","devices.unavailable_device.other":"{count} 个无法使用的设备","devices.new_description":"最近 {hours} 小时内加入 Home Assistant 的设备。","devices.new_empty":"最近 {hours} 小时内没有设备加入 Home Assistant。","devices.save_visibility_failed":"无法保存设备可见性:\n{error}","dialog.active_empty":"找不到激活中的实体","dialog.problem_empty":"找不到有问题的实体","dialog.power_sensors":"功率传感器","dialog.motion_sensors":"运动传感器","dialog.door_sensors":"门磁传感器","dialog.window_sensors":"窗户传感器","dialog.smoke_sensors":"烟雾探测器","dialog.gas_sensors":"气体探测器","dialog.moisture_sensors":"湿度传感器","dialog.occupancy_sensors":"占用传感器","dialog.opening_sensors":"打开传感器","dialog.presence_sensors":"存在传感器","dialog.safety_sensors":"安全传感器","dialog.tamper_sensors":"篡改传感器","dialog.vibration_sensors":"振动传感器","dialog.no_area":"无区域","replacement.title":"蓝图取代卡片","replacement.domain_replacements":"网域取代","replacement.assign":"指派取代","replacement.domain":"网域","replacement.empty":"尚未设置任何取代。","replacement.loading_blueprint":"正在加载蓝图…","replacement.entity_hint":"为每个呈现的实体自动填充实体和名称。","replacement.applies_to":"将套用到两个查看中的 {domain} 实体。","replacement.views_title":"区域查看 + 设备查看","replacement.views_description":"网域取代会套用到两个查看中的标准实体卡片,如同 DD3。","replacement.target":"域 · {domain}","replacement.applies_hint":"套用到区域与设备查看中符合的实体。","replacement.search":"搜索取代卡片蓝图","replacement.load_failed":"无法加载 {name}:{error}","settings.title":"Dwains Dashboard 设置","settings.subtitle":"选择要配置的部分。使用下面的“保存”按钮保存更改。","settings.loaded_version":"已加载版本","settings.loading":"加载中","settings.all_settings":"所有设置","settings.dashboard_layout":"仪表板版面","settings.dashboard":"仪表板","settings.dashboard_description":"名称与侧边栏图标。","settings.current_dashboard":"目前的仪表板","settings.default_dashboard_locked":"无法在此编辑缺省的 Home Assistant 仪表板名称。","settings.open_instance":"请打开某个 Dwains Dashboard 运行个体,才能编辑其名称与侧边栏图标。","settings.home_page":"首页","settings.home_page_description":"区段排序、住家信息与最爱。","settings.header_status":"标头与状态","settings.header_status_description":"时间、天气、通知与警报标签。","settings.notifications_shown":"显示通知","settings.notifications_hidden":"已隐藏通知","settings.alarm_selected":"已选择警报","settings.no_alarm_selected":"未选择警报","settings.people":"成员","settings.people_description":"选择要在 Dwains Dashboard 中显示哪些成员。","settings.areas":"区域","settings.areas_description":"显示的房间、房间排序与无法使用实体的行为。","settings.unavailable_shown":"显示无法使用","settings.unavailable_hidden":"隐藏无法使用","settings.devices_page":"设备页面","settings.devices_page_description":"实体显示与设备类型群组。","settings.blueprint_replacements":"蓝图取代卡片","settings.blueprint_replacements_description":"以蓝图卡片取代缺省卡片。","settings.user_permissions":"用户权限","settings.user_permissions_description":"针对非管理员用户的限制。","settings.restrictions_enabled":"已激活限制","settings.default_access":"缺省访问权","settings.support":"支持","settings.support_description":"捐款链接与 SmartHomeShop.io。","settings.optional":"选用","settings.general":"一般","settings.advanced":"高端","settings.house_cards":"{visible}/{total} 房牌","settings.types_visible":"{visible}/{total} 种可见类型","settings.hidden_devices_count":"{count} 个隐藏设备","settings.home_layout":"首页版面","settings.home_layout_description":"选择首页区段的排序。摘要会显示 Home Assistant 中进行中的修复、更新与发现的设备。","settings.replace_description":"在区域与设备查看中,以 replace-card 蓝图取代标准的实体卡片。","settings.favorites_description":"选择你希望永远显示在首页的实体。","settings.time_date":"时间和日期","settings.time_date_description":"设置标头中时间与日期的显示。","settings.notifications_description":"显示或隐藏 Dwains Dashboard 的通知按钮与标记。","settings.weather_description":"选择要在标头显示哪个天气实体,或完全停用天气显示。","settings.alarm_description":"选择要在首页显示哪个警报实体。若未选择警报,警报标签将会隐藏。","settings.devices_description":"设置实体与设备类型群组的显示方式。","settings.permissions_description":"针对没有管理员权限的 Home Assistant 用户的选用限制。","settings.people_page_description":"设置哪些个人会显示在个人卡片与仪表板中。","settings.areas_page_description":"设置哪些区域会显示、以何种顺序显示,以及如何筛选房间实体。","settings.area_order_title":"区域顺序","settings.area_order_description":"选择如何在 Dwains Dashboard 中对区域进行排序。","settings.area_order_home_assistant":"家庭助理","settings.area_order_home_assistant_description":"遵循 Home Assistant 中配置的区域顺序。","settings.area_order_custom":"定制订单","settings.area_order_custom_description":"按照您自己的 Dwains 仪表板顺序排列区域。","settings.area_order_alphabetical":"按字母顺序","settings.area_order_alphabetical_description":"按名称字母顺序对区域进行排序。","settings.area_order_drag_hint":"将下面的区域拖动到您的首选顺序中。隐藏区域保持其位置。","settings.hide_section":"隐藏区段","settings.show_section":"显示区段","settings.hidden_devices":"已隐藏的设备","settings.no_hidden_devices":"找不到具有显示中实体的设备。","settings.selected_entities":"选定的实体","settings.selected_weather":"选定的天气实体","settings.selected_alarm":"选定的报警实体","settings.no_weather":"未选择天气实体。天气隐藏在主页上。","settings.no_alarm":"尚未选择警报实体。警报标签会在首页隐藏。","settings.no_persons":"找不到任何成员","settings.visible_in_dd":"在 DD 显示","settings.hidden_in_dd":"在 DD 隐藏","settings.discard_confirm":"要舍弃未保存的仪表板设置吗?","settings.show_suggested_favorites":"显示 Home Assistant 的建议最爱","settings.suggested_favorites_description":"在您固定的收藏夹旁边添加家庭助理建议的常用实体。","settings.add_entity":"添加实体","settings.show_time":"在标头显示时间与日期","settings.show_notifications":"在 Dwains Dashboard 显示通知","settings.show_weather":"在标头显示天气","settings.select_weather":"选择天气","settings.select_alarm":"选择闹钟","settings.hide_unavailable_devices":"在设备页面隐藏无法使用/未知的实体","settings.hide_unavailable_devices_description":"缺省为激活。状态为「unavailable」或「unknown」的实体会从一般设备页面隐藏,但仍会显示在维护页面中。","settings.show_new_devices":"显示「新设备」菜单","settings.show_new_devices_description":"显示过去 48 小时内加入 Home Assistant 的设备,并提供快速选项将整个设备从 Dwains Dashboard 隐藏。","settings.restrict_ha_menu":"对非管理员用户限制 Home Assistant 菜单","settings.restrict_ha_menu_description":"启用后，非管理员用户将不会从此仪表板看到 Home Assistant 侧边栏或菜单。移动菜单仅显示自己的个人资料设置。","settings.restrict_editing":"对非管理员用户限制 Dwains Dashboard 编辑","settings.restrict_editing_description":"激活后,非管理员用户无法打开 Dwains Dashboard 设置,也无法变更仪表板内容,例如自订区域卡片与蓝图页面。","settings.hide_unavailable_areas":"在区域查看中隐藏无法使用/未知的实体","settings.hide_unavailable_areas_description":"缺省为激活。状态为「unavailable」或「unknown」的实体会从房间卡片隐藏。当存在已隐藏的实体时,Dwains Dashboard 会在房间标头显示提醒标记。","settings.no_weather_fallback":"未选择天气实体。将使用第一个可用的天气实体。","settings.move_up":"上移","settings.move_down":"下移","settings.reset_layout":"重设为缺省版面","settings.home_camera_cards":"家用相机卡","settings.home_camera_cards_description":"选择主页上显示的相机预览并设置它们的顺序。不可用的摄像机将保持隐藏状态，直到重新连接为止。","settings.home_camera_cards_empty":"没有摄像机分配给可见区域。","settings.reset_camera_cards":"重置相机顺序","settings.house_information_cards":"住家信息卡片","settings.house_information_cards_description":"选择在主页的房屋信息中显示哪些卡片。","settings.devices_page_types":"设备页面类型","settings.devices_page_types_description":"选择设备页面侧边栏中要显示哪些设备类型群组。","settings.visible_count":"{visible}/{total} 显示中","settings.hidden_devices_description":"从 Dwains 仪表板隐藏完整设备。设备按类型和区域分组。","settings.select_weather_title":"选择天气实体","settings.select_alarm_title":"选择报警实体","settings.select_entity_title":"选择实体","settings.search_weather":"搜索天气实体...","settings.search_alarm":"搜索报警实体...","settings.search":"搜索...","settings.no_person_entities":"在你的 Home Assistant 设置中找不到任何个人实体。","settings.hidden_unavailable_count":"显示 {count} 个隐藏的无法使用/未知实体","settings.edit_room":"编辑房间","summary.issue.one":"{count} 个问题","summary.issue.other":"{count} 个问题","summary.update_available.one":"有 {count} 个更新","summary.update_available.other":"有 {count} 个更新可用","summary.device_to_add.one":"要添加 {count} 台设备","summary.device_to_add.other":"有 {count} 个设备可添加","support.title":"支持 Dwains Dashboard","support.description":"我在工作之余利用业余时间将 Dwains Dashboard 构建为一个免费的开源项目。我的日常主要业务是 SmartHomeShop.io，在那里我为 Home Assistant 和 ESPHome 开发硬件解决方案。","support.donation":"欢迎考虑捐款","support.github":"GitHub 赞助","support.buy_coffee":"请我喝杯咖啡","support.shop_prompt":"或到我的商店逛逛来支持我","support.visit_shop":"造访 SmartHomeShop.io","home_section.summaries.label":"摘要","home_section.summaries.description":"来自 Home Assistant 的维修、更新与新发现的设备。","home_section.cameras.label":"摄影机","home_section.cameras.description":"首页上的区域摄影机。","home_section.areas.label":"区域","home_section.areas.description":"行动设备与小屏幕的房间卡片;桌面版使用左侧区域菜单。","home_section.devices.label":"住家信息","home_section.devices.description":"成员、室内气候、用电量与设备群组。","home_section.todos.label":"待办事项列表","home_section.todos.description":"主页上可编辑的 Home Assistant 待办事项列表。","home_section.favorites.label":"我的最爱","home_section.favorites.description":"你钉选的实体。","home_card.people.label":"成员","home_card.people.description":"这个家庭成员的在家状态卡片。","home_card.climate.label":"室内气候","home_card.climate.description":"房间传感器的平均温度与湿度。","home_card.power.label":"住家用电","home_card.power.description":"目前全屋用电量与用电最多的房间。","home_card.device_groups.label":"设备群组","home_card.device_groups.description":"灯光、开关、窗帘、动作等状态卡片。","error.notifications_load":"无法加载 Home Assistant 的常驻通知。","error.settings_save":"无法保存仪表板设置:{error}","error.notification_dismiss":"无法清除此通知。","error.notifications_dismiss_all":"无法清除所有通知。","error.image_load":"图片无法加载","error.canvas_unavailable":"画布上下文不可用","domain.light":"灯光","domain.switch":"开关","domain.fan":"风扇","domain.cover":"门窗遮罩","domain.lock":"锁","domain.climate":"空调","domain.media_player":"媒体播放器","domain.camera":"摄影机","domain.person":"成员","domain.vacuum":"扫地机","domain.alarm_control_panel":"警报","domain.binary_sensor":"二元传感器","domain.sensor":"传感器","domain.energy":"能源","domain.scene":"场景","domain.event":"事件","domain.script":"脚本","domain.automation":"自动化","domain.button":"按钮","domain.number":"数值输入器","domain.select":"选择","domain.input_boolean":"输入布尔值","domain.input_number":"数值输入器","domain.input_select":"输入选择表","domain.input_button":"按钮","domain.input_text":"文本","domain.water_heater":"热水器","domain.humidifier":"加湿器","domain.siren":"警报器","domain.valve":"阀门","domain.update":"更新","domain.weather":"天气","domain.sun":"日出日落","domain.device_tracker":"设备跟踪器","domain.remote":"遥控","domain.image":"图像","domain.todo":"待办清单","domain.calendar":"行事历","domain.lawn_mower":"割草机","domain.text":"文本","domain.date":"日期","domain.time":"时间","domain.timer":"计时器","device_class.motion":"动作","device_class.moving":"动作","device_class.occupancy":"此处有人","device_class.presence":"人体存在","device_class.door":"门","device_class.garage_door":"车库门","device_class.window":"窗户","device_class.opening":"打开","device_class.smoke":"烟雾","device_class.gas":"燃气","device_class.carbon_monoxide":"一氧化碳","device_class.moisture":"潮度","device_class.safety":"安全性","device_class.tamper":"篡改","device_class.vibration":"振动","device_class.sound":"声音","device_class.lock":"锁","device_class.battery":"电池","device_class.battery_charging":"充电中","device_class.connectivity":"连通性","device_class.power":"电源","device_class.plug":"插头","device_class.problem":"问题","device_class.heat":"过热","device_class.cold":"过冷","device_class.light":"光线","device_class.running":"运行","device_class.update":"更新","device_class.door_lock":"锁"},"zh-hant":{"common.save":"儲存","common.back":"返回","common.close":"關閉","common.cancel":"取消","common.add":"新增","common.next":"下一步","common.edit":"編輯","common.manage":"管理","common.apply":"套用","common.delete":"刪除","common.loading":"載入中…","common.no_content":"沒有可顯示的儀表板內容","common.saving":"保存…","common.refresh":"重新整理","common.dismiss":"清除","common.dismiss_all":"全部清除","common.select_option":"選擇選項","common.view_all":"查看全部","common.see_all":"查看全部","common.show":"顯示","common.hide":"隱藏","common.enable":"啟用","common.disable":"停用","common.remove":"移除","common.on":"在","common.off":"離開","common.open":"開啟","common.closed":"關閉","common.unknown":"未知","common.unavailable":"無法使用","common.none":"沒有任何","common.entity.one":"{count} 個實體","common.entity.other":"{count} 個實體","common.device.one":"{count} 台設備","common.device.other":"{count} 個裝置","common.item.one":"{count} 件","common.item.other":"{count} 件商品","common.sensor.one":"{count} 個感測器","common.sensor.other":"{count} 個感測器","common.area.one":"{count} 區域","common.area.other":"{count} 個區域","common.person.one":"{count} 人","common.person.other":"{count} 位成員","common.favorite.one":"最喜歡 {count} 個","common.favorite.other":"{count} 個收藏夾","common.active.one":"{count} 個啟用中","common.active.other":"{count} 個啟用中","common.just_now":"現在","sidebar.home":"首頁","sidebar.add_blueprint":"新增藍圖","sidebar.dashboard_settings":"儀表板設定","sidebar.section_title":"Dwains Dashboard","sidebar.areas":"區域","sidebar.show":"顯示區域側邊欄","sidebar.collapse":"收合區域側邊欄","sidebar.resize":"調整區域側邊欄寬度","sidebar.resize_drag":"拖曳以調整區域側邊欄寬度","navigation.menu":"選單","navigation.pages":"頁面","navigation.profile_settings":"個人設定","navigation.profile_description":"開啟你的 Home Assistant 個人資料","navigation.back_home":"返回首頁","navigation.open_menu":"開啟選單","navigation.current_page":"目前頁面","navigation.open_page":"開啟頁面","navigation.overview":"總覽","navigation.all_device_groups":"所有裝置群組","favorites.title":"我的最愛","favorites.empty":"尚未選擇任何最愛。","favorites.swipe":"滑動收藏夾","favorites.show_all":"顯示所有收藏夾","favorites.switch_swipe":"切換收藏夾至刷卡","person.home":"在家","person.away":"外出","person.nobody_home":"沒人在家","layout.custom_cards":"自訂卡片","layout.add_card":"新增卡片","layout.done_editing":"完成編輯","layout.edit_custom_cards":"編輯自訂卡片","layout.custom_cards_top":"區域頂端","layout.custom_cards_after":"{section} 下方","layout.custom_cards_bottom":"區域底部","layout.drag_card":"拖曳卡片","layout.edit_page":"編輯頁面","layout.page_settings":"設定 / 重新填寫","layout.delete_page":"刪除頁面","layout.delete_page_confirm":"刪除頁面「{name}」?","layout.delete_card_confirm":"刪除這張卡片?","layout.save_page_failed":"無法儲存頁面(請見主控台):\n{error}","layout.save_card_failed":"無法儲存卡片(請見主控台):\n{error}","layout.swipe_cards":"滑動卡片","layout.show_all_cards":"顯示所有卡片","layout.switch_swipe_cards":"切換為滑動卡片","home.notifications":"通知","home.notifications_description":"來自 Home Assistant 的常駐通知","home.notifications_loading":"正在載入通知...","home.notifications_empty":"沒有常駐通知","home.notification":"通知","home.summaries":"摘要","home.house_information":"住家資訊","home.cameras":"攝影機","home.areas":"區域","home.unassigned_spaces":"未指派空間","home.devices_discovered":"發現新裝置","home.repairs":"維修","home.updates":"更新","home.house_power_usage":"住家用電","home.no_live_power_sensors":"沒有即時用電感測器","home.no_room_power_usage":"目前沒有房間用電量","home.indoor_climate":"室內氣候","home.average_temperature":"平均氣溫","home.average_humidity":"平均濕度","home.temperature":"溫度","home.humidity":"濕度","home.view_sensors":"查看感測器","home.people":"成員","home.no_people":"沒有成員","home.no_visible_people":"尚未設定要顯示的成員","home.attention.one":"{count} 項需要注意","home.attention.other":"有 {count} 項需要注意","home.everything_calm":"一切正常","home.outside_weather":"戶外天氣","home.outside":"戶外","home.alarm_armed":"已設防","home.alarm_disarmed":"已解除","home.good_morning":"早安","home.good_afternoon":"午安","home.good_evening":"晚安","home.swipe_house_information":"掃一掃房屋資訊","home.show_all_house_information":"顯示所有房屋資訊","home.switch_house_information_swipe":"將房屋資訊切換為刷卡","home.swipe_cameras":"滑動相機","home.show_all_cameras":"顯示所有攝影機","home.switch_cameras_swipe":"切換攝影機刷卡","home.swipe_areas":"滑動區域","home.show_all_areas":"顯示所有區域","home.switch_areas_swipe":"切換區域刷卡","status.light_on.one":"{count} 燈亮","status.light_on.other":"{count} 燈亮","status.switch_on.one":"{count} 次開啟","status.switch_on.other":"{count} 開啟","status.cover_open.one":"{count} 個蓋子打開","status.cover_open.other":"{count} 個蓋子打開","status.fan_on.one":"{count} 扇動","status.fan_on.other":"{count} 名粉絲","status.lock_unlocked.one":"{count} 個鎖已解鎖","status.lock_unlocked.other":"{count} 個鎖已解鎖","status.climate_active.one":"{count} 氣候活躍","status.climate_active.other":"{count} 氣候活躍","status.media_playing.one":"{count} 個媒體播放器正在播放","status.media_playing.other":"{count} 個媒體播放器正在播放","status.vacuum_cleaning.one":"{count} 真空清潔","status.vacuum_cleaning.other":"{count} 吸塵器清潔","status.alarm_armed.one":"{count} 個警報已布防","status.alarm_armed.other":"{count} 個警報已開啟","status.door_open.one":"{count} 扇門打開","status.door_open.other":"{count} 扇門打開","status.window_open.one":"{count} 個視窗打開","status.window_open.other":"打開了 {count} 個視窗","status.opening_open.one":"{count} 個開放","status.opening_open.other":"已開放 {count} 個空缺職位","status.motion_detected":"偵測到 {count} 個動作","status.smoke_detected":"偵測到 {count} 煙霧","status.gas_detected":"偵測到 {count} 種氣體","status.moisture_detected":"偵測到 {count} 個水分","status.occupancy_detected":"偵測到 {count} 個佔用","status.presence_detected":"偵測到 {count} 個存在","status.tamper_detected":"偵測到 {count} 個竄改","status.vibration_detected":"偵測到 {count} 個振動","status.safety_active":"{count} 安全已啟動","action.turn_on":"開啟","action.activate":"啟用","action.open_camera":"開啟攝影機","action.turn_off":"關閉","action.more_info":"更多資訊","action.turn_on_all":"全部開啟","action.turn_off_all":"全部關閉","action.open_all":"全部打開","action.close_all":"全部關上","action.lock_all":"全部上鎖","action.unlock_all":"全部解鎖","action.all_lights_on":"所有燈光開啟","action.all_lights_off":"所有燈光關閉","action.all_switches_on":"所有開關開啟","action.all_switches_off":"所有開關關閉","action.toggle_lights":"切換燈","action.toggle_switches":"撥動開關","action.toggle_covers":"切換蓋","action.confirm_lights":"確定要切換此區域內的所有燈光嗎?","action.confirm_switches":"確定要切換此區域內的所有開關嗎?","action.scene_activated":"情境已啟用","action.open":"開啟","action.close":"關閉","action.stop":"停止","action.lock":"上鎖","action.unlock":"解鎖","action.confirm_bulk":"{action} {entities}？","action.lights_on_summary":"開啟所有燈光({total})","action.lights_off_summary":"關閉所有燈光({active}/{total} 已開啟)","action.switches_on_summary":"開啟所有開關({total})","action.switches_off_summary":"關閉所有開關({active}/{total} 已開啟)","action.covers_open_summary":"開啟所有窗簾({total})","action.covers_close_summary":"關閉所有遮蓋（{active}/{total} 個開啟）","entity.not_activated":"尚未啟用","entity.no_events":"尚無事件","entity.power_usage":"用電量","entity.select_value":"選擇值","entity.update_failed":"無法更新實體","entity.selector_failed":"無法更新選擇器","entity.cover_failed":"無法更新窗簾","entity.brightness":"{value}% 亮度","entity.climate_set":"設定為 {value}","entity.lock_failed":"無法更新鎖","entity.lights_failed":"無法更新燈光","entity.switches_failed":"無法更新開關","entity.covers_failed":"無法更新窗簾","entity.group_failed":"無法更新群組","page.add_title":"新增藍圖頁面","page.add_desc":"匯入藍圖,將其加為頂部選單的新分頁。","blueprint.title_add":"新增藍圖","blueprint.title_setup":"設定藍圖","blueprint.title_edit":"編輯頁面","blueprint.tab_paste":"貼上","blueprint.tab_url":"從網址","blueprint.tab_gallery":"範例庫","blueprint.gallery_hint":"從官方清單選擇一個藍圖。","blueprint.gallery_empty":"找不到藍圖。","blueprint.gallery_failed":"無法載入藍圖清單:{error}","blueprint.paste_hint":"在此貼上完整的藍圖 YAML(page.yaml)。","blueprint.url_hint_html":"貼上指向 <code>page.yaml</code>(或其資料夾)的 GitHub 網址,我會自動抓取藍圖。","blueprint.loading":"載入中…","blueprint.fetch":"抓取","blueprint.invalid_url":"請輸入有效的網址。","blueprint.fetch_failed":"抓取失敗(HTTP {status})。","blueprint.load_failed":"無法載入藍圖:{error}。提示:請使用 page.yaml 檔案的『raw』網址,或直接貼上 YAML。","blueprint.fill_failed":"填入失敗:{error}","blueprint.new_page":"新頁面","blueprint.page_fallback":"頁面","blueprint.missing_cards":"這些卡片似乎尚未安裝:{cards}。請透過 HACS 安裝,否則那些卡片會是空的。","blueprint.page_name":"頁面名稱","blueprint.sidebar_icon":"側邊欄圖示","blueprint.settings":"設定","blueprint.no_fields":"此藍圖沒有可設定的欄位。","blueprint.edit_yaml":"編輯 YAML","blueprint.apply":"套用","blueprint.check_update":"檢查更新","blueprint.checking":"檢查中…","blueprint.up_to_date":"已是最新版本(v{version})。","blueprint.update_available":"有新版本:v{new}(目前 v{current})。","blueprint.source_missing":"找不到來源網址,範例庫中也沒有相符的官方藍圖。","blueprint.update":"更新","card_editor.title_add":"新增卡片","card_editor.title_setup":"設定卡片","card_editor.title_edit":"編輯卡片","card_editor.search":"搜尋卡片","card_editor.visual_editor":"視覺化編輯器","card_editor.code_editor":"程式碼編輯器","card_editor.loading":"載入編輯器…","card_editor.preview":"預覽","card_editor.no_preview":"此卡片類型沒有預覽。","card_type.tile.label":"圖磚","card_type.tile.desc":"單一實體的精簡卡片,附快速控制。","card_type.entities.label":"實體","card_type.entities.desc":"實體清單,含狀態與控制。","card_type.button.label":"按鈕","card_type.button.desc":"切換實體的大按鈕。","card_type.gauge.label":"量表","card_type.gauge.desc":"以量表顯示數值。","card_type.history.label":"圖表","card_type.history.desc":"實體的歷史圖表。","card_type.sensor.label":"感測器","card_type.sensor.desc":"感測器數值,可另附圖表。","card_type.thermostat.label":"溫控器","card_type.thermostat.desc":"空調(climate)實體的控制。","card_type.weather.label":"天氣","card_type.weather.desc":"天氣預報。","card_type.markdown.label":"Markdown","card_type.markdown.desc":"可格式化與套用範本的自由文字。","card_type.picture.label":"圖片","card_type.picture.desc":"顯示圖片或攝影機。","card_type.glance.label":"概覽","card_type.glance.desc":"多個實體的精簡總覽。","card_type.media.label":"媒體","card_type.media.desc":"媒體播放器的控制。","card_type.manual.label":"手動(YAML)","card_type.manual.desc":"自行輸入或貼上任何卡片的 YAML。","strategy.dashboard_desc":"調整此儀表板的名稱與側邊欄圖示。","strategy.name":"名稱","strategy.sidebar_icon":"側邊欄圖示","strategy.back":"返回","strategy.save_name_failed":"儲存名稱/圖示失敗(請見主控台):\n{error}","strategy.edit_area_alert":"請至 Home Assistant 設定 > 區域與區塊來編輯區域。","devices.title":"裝置","devices.empty":"找不到裝置。","devices.new":"新裝置","devices.new.one":"{count} 個新設備","devices.new.other":"{count} 個新裝置","devices.maintenance":"維護","devices.energy":"能源","devices.invalid_configuration":"配置無效","devices.all_good":"一切正常","devices.live_power_usage":"各區域即時用電量","devices.live_power_sensor.one":"{count} 個即時功率感測器","devices.live_power_sensor.other":"{count} 個即時用電感測器","devices.power_entity.one":"{count} 個權力實體","devices.power_entity.other":"{count} 個電力實體","devices.whole_house":"整個住家","devices.whole_house_history":"整個住家用電歷史","devices.top_area":"用電最高區域","devices.total_now":"目前總計","devices.no_power_title":"找不到即時電力感測器","devices.no_power_description":"當功率感測器分配到可見區域時，能量將出現在此。","devices.maintenance_empty":"目前沒有低電量或無法使用的裝置。","devices.added_just_now":"剛剛加入","devices.group.one":"{count} 個設備組","devices.group.other":"{count} 個裝置群組","devices.low_battery.one":"{count} 個低電量","devices.low_battery.other":"{count} 個低電量","devices.unavailable_device.one":"{count} 個無法使用的裝置","devices.unavailable_device.other":"{count} 個無法使用的裝置","devices.new_description":"最近 {hours} 小時內加入 Home Assistant 的裝置。","devices.new_empty":"最近 {hours} 小時內沒有裝置加入 Home Assistant。","devices.save_visibility_failed":"無法儲存裝置可見性:\n{error}","dialog.active_empty":"找不到啟用中的實體","dialog.problem_empty":"找不到有問題的實體","dialog.power_sensors":"功率感測器","dialog.motion_sensors":"運動感應器","dialog.door_sensors":"門磁感測器","dialog.window_sensors":"窗戶感應器","dialog.smoke_sensors":"煙霧偵測器","dialog.gas_sensors":"氣體探測器","dialog.moisture_sensors":"濕度感測器","dialog.occupancy_sensors":"佔用感應器","dialog.opening_sensors":"打開感應器","dialog.presence_sensors":"存在感測器","dialog.safety_sensors":"安全感應器","dialog.tamper_sensors":"篡改感測器","dialog.vibration_sensors":"振動感測器","dialog.no_area":"無區域","replacement.title":"藍圖取代卡片","replacement.domain_replacements":"網域取代","replacement.assign":"指派取代","replacement.domain":"網域","replacement.empty":"尚未設定任何取代。","replacement.loading_blueprint":"正在載入藍圖…","replacement.entity_hint":"為每個呈現的實體自動填入實體和名稱。","replacement.applies_to":"將套用到兩個檢視中的 {domain} 實體。","replacement.views_title":"區域檢視 + 裝置檢視","replacement.views_description":"網域取代會套用到兩個檢視中的標準實體卡片,如同 DD3。","replacement.target":"網域 · {domain}","replacement.applies_hint":"套用到區域與裝置檢視中符合的實體。","replacement.search":"搜尋取代卡片藍圖","replacement.load_failed":"無法載入 {name}:{error}","settings.title":"Dwains Dashboard 設定","settings.subtitle":"選擇要配置的部分。使用下面的“儲存”按鈕儲存變更。","settings.loaded_version":"已載入版本","settings.loading":"載入中","settings.all_settings":"所有設定","settings.dashboard_layout":"儀表板版面","settings.dashboard":"儀表板","settings.dashboard_description":"名稱與側邊欄圖示。","settings.current_dashboard":"目前的儀表板","settings.default_dashboard_locked":"無法在此編輯預設的 Home Assistant 儀表板名稱。","settings.open_instance":"請開啟某個 Dwains Dashboard 執行個體,才能編輯其名稱與側邊欄圖示。","settings.home_page":"首頁","settings.home_page_description":"區段排序、住家資訊與最愛。","settings.header_status":"標頭與狀態","settings.header_status_description":"時間、天氣、通知與警報標籤。","settings.notifications_shown":"顯示通知","settings.notifications_hidden":"已隱藏通知","settings.alarm_selected":"已選擇警報","settings.no_alarm_selected":"未選擇警報","settings.people":"成員","settings.people_description":"選擇要在 Dwains Dashboard 中顯示哪些成員。","settings.areas":"區域","settings.areas_description":"顯示的房間、房間排序與無法使用實體的行為。","settings.unavailable_shown":"顯示無法使用","settings.unavailable_hidden":"隱藏無法使用","settings.devices_page":"裝置頁面","settings.devices_page_description":"實體顯示與裝置類型群組。","settings.blueprint_replacements":"藍圖取代卡片","settings.blueprint_replacements_description":"以藍圖卡片取代預設卡片。","settings.user_permissions":"使用者權限","settings.user_permissions_description":"針對非管理員使用者的限制。","settings.restrictions_enabled":"已啟用限制","settings.default_access":"預設存取權","settings.support":"支援","settings.support_description":"捐款連結與 SmartHomeShop.io。","settings.optional":"選用","settings.general":"一般","settings.advanced":"進階","settings.house_cards":"{visible}/{total} 房牌","settings.types_visible":"{visible}/{total} 種可見類型","settings.hidden_devices_count":"{count} 個隱藏設備","settings.home_layout":"首頁版面","settings.home_layout_description":"選擇首頁區段的排序。摘要會顯示 Home Assistant 中進行中的修復、更新與發現的裝置。","settings.replace_description":"在區域與裝置檢視中,以 replace-card 藍圖取代標準的實體卡片。","settings.favorites_description":"選擇你希望永遠顯示在首頁的實體。","settings.time_date":"時間和日期","settings.time_date_description":"設定標頭中時間與日期的顯示。","settings.notifications_description":"顯示或隱藏 Dwains Dashboard 的通知按鈕與標記。","settings.weather_description":"選擇要在標頭顯示哪個天氣實體,或完全停用天氣顯示。","settings.alarm_description":"選擇要在首頁顯示哪個警報實體。若未選擇警報,警報標籤將會隱藏。","settings.devices_description":"設定實體與裝置類型群組的顯示方式。","settings.permissions_description":"針對沒有管理員權限的 Home Assistant 使用者的選用限制。","settings.people_page_description":"設定哪些個人會顯示在個人卡片與儀表板中。","settings.areas_page_description":"設定哪些區域會顯示、以何種順序顯示,以及如何篩選房間實體。","settings.area_order_title":"區域順序","settings.area_order_description":"選擇如何在 Dwains Dashboard 中對區域進行排序。","settings.area_order_home_assistant":"家庭助理","settings.area_order_home_assistant_description":"遵循 Home Assistant 中配置的區域順序。","settings.area_order_custom":"客製訂單","settings.area_order_custom_description":"按照您自己的 Dwains 儀表板順序排列區域。","settings.area_order_alphabetical":"按字母順序","settings.area_order_alphabetical_description":"按名稱字母順序對區域進行排序。","settings.area_order_drag_hint":"將下面的區域拖曳到您的首選順序中。隱藏區域保持其位置。","settings.hide_section":"隱藏區段","settings.show_section":"顯示區段","settings.hidden_devices":"已隱藏的裝置","settings.no_hidden_devices":"找不到具有顯示中實體的裝置。","settings.selected_entities":"選定的實體","settings.selected_weather":"選定的天氣實體","settings.selected_alarm":"選定的警報實體","settings.no_weather":"未選擇天氣實體。天氣隱藏在主頁上。","settings.no_alarm":"尚未選擇警報實體。警報標籤會在首頁隱藏。","settings.no_persons":"找不到任何成員","settings.visible_in_dd":"在 DD 顯示","settings.hidden_in_dd":"在 DD 隱藏","settings.discard_confirm":"要捨棄未儲存的儀表板設定嗎?","settings.show_suggested_favorites":"顯示 Home Assistant 的建議最愛","settings.suggested_favorites_description":"在您固定的收藏夾旁邊新增家庭助理建議的常用實體。","settings.add_entity":"新增實體","settings.show_time":"在標頭顯示時間與日期","settings.show_notifications":"在 Dwains Dashboard 顯示通知","settings.show_weather":"在標頭顯示天氣","settings.select_weather":"選擇天氣","settings.select_alarm":"選擇鬧鐘","settings.hide_unavailable_devices":"在裝置頁面隱藏無法使用/未知的實體","settings.hide_unavailable_devices_description":"預設為啟用。狀態為「unavailable」或「unknown」的實體會從一般裝置頁面隱藏,但仍會顯示在維護頁面中。","settings.show_new_devices":"顯示「新裝置」選單","settings.show_new_devices_description":"顯示過去 48 小時內加入 Home Assistant 的裝置,並提供快速選項將整個裝置從 Dwains Dashboard 隱藏。","settings.restrict_ha_menu":"對非管理員使用者限制 Home Assistant 選單","settings.restrict_ha_menu_description":"啟用後，非管理員使用者將不會從此儀表板看到 Home Assistant 側邊欄或選單。行動選單僅顯示自己的個人資料設定。","settings.restrict_editing":"對非管理員使用者限制 Dwains Dashboard 編輯","settings.restrict_editing_description":"啟用後,非管理員使用者無法開啟 Dwains Dashboard 設定,也無法變更儀表板內容,例如自訂區域卡片與藍圖頁面。","settings.hide_unavailable_areas":"在區域檢視中隱藏無法使用/未知的實體","settings.hide_unavailable_areas_description":"預設為啟用。狀態為「unavailable」或「unknown」的實體會從房間卡片隱藏。當存在已隱藏的實體時,Dwains Dashboard 會在房間標頭顯示提醒標記。","settings.no_weather_fallback":"未選擇天氣實體。將使用第一個可用的天氣實體。","settings.move_up":"上移","settings.move_down":"下移","settings.reset_layout":"重設為預設版面","settings.home_camera_cards":"家用相機卡","settings.home_camera_cards_description":"選擇主頁上顯示的相機預覽並設定它們的順序。不可用的攝影機將保持隱藏狀態，直到重新連接為止。","settings.home_camera_cards_empty":"沒有攝影機分配給可見區域。","settings.reset_camera_cards":"重置相機順序","settings.house_information_cards":"住家資訊卡片","settings.house_information_cards_description":"選擇在主頁的房屋資訊中顯示哪些卡片。","settings.devices_page_types":"裝置頁面類型","settings.devices_page_types_description":"選擇裝置頁面側邊欄中要顯示哪些裝置類型群組。","settings.visible_count":"{visible}/{total} 顯示中","settings.hidden_devices_description":"從 Dwains 儀表板隱藏完整設備。設備按類型和區域分組。","settings.select_weather_title":"選擇天氣實體","settings.select_alarm_title":"選擇警報實體","settings.select_entity_title":"選擇實體","settings.search_weather":"搜尋天氣實體...","settings.search_alarm":"搜尋警報實體...","settings.search":"搜尋…","settings.no_person_entities":"在你的 Home Assistant 設定中找不到任何個人實體。","settings.hidden_unavailable_count":"顯示 {count} 個隱藏的無法使用/未知實體","settings.edit_room":"編輯房間","summary.issue.one":"{count} 個問題","summary.issue.other":"{count} 個問題","summary.update_available.one":"有 {count} 個更新","summary.update_available.other":"有 {count} 個更新可用","summary.device_to_add.one":"要新增 {count} 台設備","summary.device_to_add.other":"有 {count} 個裝置可新增","support.title":"支援 Dwains Dashboard","support.description":"我在工作之餘利用業餘時間將 Dwains Dashboard 建構成一個免費的開源專案。我的日常主要業務是 SmartHomeShop.io，在那裡我為 Home Assistant 和 ESPHome 開發硬體解決方案。","support.donation":"歡迎考慮捐款","support.github":"GitHub 贊助","support.buy_coffee":"請我喝杯咖啡","support.shop_prompt":"或到我的商店逛逛來支持我","support.visit_shop":"造訪 SmartHomeShop.io","home_section.summaries.label":"摘要","home_section.summaries.description":"來自 Home Assistant 的維修、更新與新發現的裝置。","home_section.cameras.label":"攝影機","home_section.cameras.description":"首頁上的區域攝影機。","home_section.areas.label":"區域","home_section.areas.description":"行動裝置與小螢幕的房間卡片;桌面版使用左側區域選單。","home_section.devices.label":"住家資訊","home_section.devices.description":"成員、室內氣候、用電量與裝置群組。","home_section.todos.label":"待辦事項列表","home_section.todos.description":"主頁上可編輯的 Home Assistant 待辦事項清單。","home_section.favorites.label":"我的最愛","home_section.favorites.description":"你釘選的實體。","home_card.people.label":"成員","home_card.people.description":"這個家庭成員的在家狀態卡片。","home_card.climate.label":"室內氣候","home_card.climate.description":"房間感測器的平均溫度與濕度。","home_card.power.label":"住家用電","home_card.power.description":"目前全屋用電量與用電最多的房間。","home_card.device_groups.label":"裝置群組","home_card.device_groups.description":"燈光、開關、窗簾、動作等狀態卡片。","error.notifications_load":"無法載入 Home Assistant 的常駐通知。","error.settings_save":"無法儲存儀表板設定:{error}","error.notification_dismiss":"無法清除此通知。","error.notifications_dismiss_all":"無法清除所有通知。","error.image_load":"圖片無法載入","error.canvas_unavailable":"畫布上下文不可用","domain.light":"燈光","domain.switch":"開關","domain.fan":"風扇","domain.cover":"門窗遮罩","domain.lock":"門鎖","domain.climate":"空調","domain.media_player":"媒體播放器","domain.camera":"攝影機","domain.person":"成員","domain.vacuum":"掃地機器人","domain.alarm_control_panel":"警報","domain.binary_sensor":"二進位感測器","domain.sensor":"感測器","domain.energy":"能源","domain.scene":"場景","domain.event":"事件","domain.script":"腳本","domain.automation":"自動化","domain.button":"按鈕","domain.number":"數字","domain.select":"選擇","domain.input_boolean":"開關框","domain.input_number":"數字","domain.input_select":"選擇框","domain.input_button":"按鈕","domain.input_text":"文字","domain.water_heater":"熱水器","domain.humidifier":"加濕器","domain.siren":"警報","domain.valve":"閥門","domain.update":"更新","domain.weather":"天氣","domain.sun":"太陽","domain.device_tracker":"裝置追蹤器","domain.remote":"遙控器","domain.image":"影像","domain.todo":"待辦清單","domain.calendar":"行事曆","domain.lawn_mower":"割草機","domain.text":"文字","domain.date":"日期","domain.time":"時間","domain.timer":"計時器","device_class.motion":"動作","device_class.moving":"動作","device_class.occupancy":"佔空","device_class.presence":"在場","device_class.door":"門","device_class.garage_door":"車庫門","device_class.window":"窗戶","device_class.opening":"開啟中","device_class.smoke":"煙霧","device_class.gas":"瓦斯","device_class.carbon_monoxide":"一氧化碳","device_class.moisture":"水氣","device_class.safety":"安全","device_class.tamper":"篡改","device_class.vibration":"震動","device_class.sound":"聲響","device_class.lock":"門鎖","device_class.battery":"電量","device_class.battery_charging":"充電中","device_class.connectivity":"連線","device_class.power":"電力","device_class.plug":"插座","device_class.problem":"異常","device_class.heat":"熱","device_class.cold":"冷","device_class.light":"光線","device_class.running":"執行中","device_class.update":"更新","device_class.door_lock":"門鎖"}};function i(t){const i=String(t?.locale?.language||t?.language||"en").trim().toLowerCase().replace(/_/g,"-");if(/^zh-(hant|tw|hk|mo)(-|$)/.test(i)||"zh"===i)return"zh-hant";if(/^zh-(hans|cn|sg)(-|$)/.test(i))return"zh-hans";const a=i.split("-");for(;a.length;){const t=a.join("-");if(e.includes(t))return t;a.pop()}return"en"}function a(e){return String(e?.locale?.language||e?.language||"").trim()||i(e)}function o(e,a,o){const r=i(e),n=t.en;let s=(t[r]||t.en)[a]??n[a]??a;if(o)for(const e of Object.keys(o))s=s.split(`{${e}}`).join(String(o[e]));return s}function r(e,t,i,r){return o(e,`${t}.${"one"===new Intl.PluralRules(a(e)).select(i)?"one":"other"}`,{count:i,...r})}function n(e){return Object.prototype.hasOwnProperty.call(t.en,e)}function s(e){return!1===e?.user?.is_admin}function c(e,t){return!0===t?.restrict_non_admin_ha_sidebar&&s(e)}function d(e,t){return!0===t?.restrict_non_admin_dashboard_settings&&s(e)}class l{async generate(e,t){console.log("Dwains Dashboard Next Strategy"),console.log("Config received:",e);const[i,a,r,n]=await Promise.all([t.callWS({type:"config/area_registry/list"}),t.callWS({type:"config/device_registry/list"}),t.callWS({type:"config/entity_registry/list"}),t.callWS({type:"config/floor_registry/list"}).catch(()=>[])]);console.log(`Found ${i.length} areas, ${a.length} devices, ${r.length} entities, ${n.length} floors`),console.log("Devices met area_id:",a.filter(e=>e.area_id).map(e=>({name:e.name,id:e.id,area_id:e.area_id}))),console.log("Devices zonder area_id count:",a.filter(e=>!e.area_id).length);const s=r.map(e=>{const t=e.area_id,i=e.device_id?a.find(t=>t.id===e.device_id)?.area_id:null,o=t||i;return{entity_id:e.entity_id,direct_area_id:t,device_id:e.device_id,device_area_id:i,resolved_area_id:o}});console.log("Entities met resolved area_id:",s.filter(e=>e.resolved_area_id).slice(0,10)),console.log("Entities zonder resolved area_id count:",s.filter(e=>!e.resolved_area_id).length),n.length>0&&(t.floors=n.reduce((e,t)=>(e[t.floor_id]=t,e),{})),t.areas=i.reduce((e,t)=>(e[t.area_id]=t,e),{}),t.entities=r.reduce((e,t)=>(e[t.entity_id]=t,e),{}),t.devices=a.reduce((e,t)=>(e[t.id]=t,e),{});const c={areas:i.map(e=>({area_id:e.area_id,name:e.name,picture:e.picture,icon:e.icon,floor_id:e.floor_id,temperature_entity_id:e.temperature_entity_id,humidity_entity_id:e.humidity_entity_id})),devices:a.map(e=>({device_id:e.id,name:e.name_by_user||e.name,area_id:e.area_id,created_at:e.created_at})),entities:r.map(e=>({entity_id:e.entity_id,area_id:e.area_id,device_id:e.device_id,created_at:e.created_at})),floors:n.map(e=>({floor_id:e.floor_id,name:e.name})),settings:e.settings||{},areas_display:e.areas_display,floors_display:e.floors_display,areas_options:e.areas_options,favorites:e.favorites||[],pages:e.pages||[],blueprint_replacements:e.blueprint_replacements||{},device_admission:e.device_admission||{}},l={...c,type:"custom:dwains-dashboard-next-view"},p=e.pages||[],h=!d(t,c.settings),m=[{strategy:l,title:o(t,"sidebar.home"),icon:"mdi:home",path:"home"}];m.push({title:o(t,"devices.title"),path:"devices",icon:"mdi:format-list-bulleted-type",panel:!0,cards:[{type:"custom:dwains-dashboard-next-devices-card",...c}]});for(const e of p)m.push({title:e.name,path:e.id,icon:e.icon||"mdi:puzzle",cards:[{type:"custom:dwains-dashboard-next-page-card",page:e,settings:c.settings||{}}]});return h&&m.push({icon:"mdi:plus",path:"add-blueprint",cards:[{type:"custom:dwains-dashboard-next-page-card",add:!0,settings:c.settings||{}}]}),{title:e.title||"Dwains Dashboard",views:m}}static async getConfigElement(){return await Promise.resolve().then(function(){return li}),document.createElement("dwains-dashboard-next-strategy-editor")}}class p{async generate(e,t){return console.log("Dwains View Strategy generate called",e),e.floors&&(t.floors=e.floors.reduce((e,t)=>(e[t.floor_id]=t,e),{})),{panel:!0,cards:[{type:"custom:dwains-dashboard-next-layout-card",areas:e.areas||[],devices:e.devices||[],entities:e.entities||[],floors:e.floors||[],settings:e.settings||{},areas_display:e.areas_display,floors_display:e.floors_display,areas_options:e.areas_options,favorites:e.favorites||[],pages:e.pages||[],blueprint_replacements:e.blueprint_replacements||{},device_admission:e.device_admission||{}}]}}}const h="1.6.2";console.log("Dwains Dashboard Next - Loading..."),console.log(`%cDwains Dashboard Next ${h}`,"background:#3a7;color:#fff;padding:2px 8px;border-radius:6px;font-weight:bold");const m="dwains-dashboard-next",u=`ll-strategy-dashboard-${m}`,g="dwains-dashboard-next-card";let _=Promise.resolve().then(()=>async function(){try{const[{DwainsDashboardCard:e},{DwainsDashboardCardEditor:t},{DwainsFlexboxCard:i},{DwainsHeadingCard:a}]=await Promise.all([Promise.resolve().then(function(){return Va}),Promise.resolve().then(function(){return Fa}),Promise.resolve().then(function(){return Wa}),Promise.resolve().then(function(){return Ga}),Promise.resolve().then(function(){return Oa}),Promise.resolve().then(function(){return Ya}),Promise.resolve().then(function(){return li}),Promise.resolve().then(function(){return Ja}),Promise.resolve().then(function(){return co}),Promise.resolve().then(function(){return Aa}),Promise.resolve().then(function(){return Pt})]);b(g,e),b("dwains-dashboard-next-card-editor",t),b("dwains-flexbox-card",class extends i{}),b("dwains-heading-card",a),b("dwains-dashboard-card",class extends e{}),b("dwains-dashboard-card-editor",class extends t{}),console.log("✓ Registered custom card: dwains-dashboard-next-card"),console.log("Dwains Dashboard Next - Loaded successfully!")}catch(e){console.error("Dwains Dashboard Next - Failed to load UI elements",e)}}());const b=(e,t)=>{customElements.get(e)||(customElements.define(e,t),console.log(`✓ Registered: ${e}`))},v=()=>class extends HTMLElement{static async generate(e,t){await _;return(new l).generate(e,t)}static async getConfigElement(){return l.getConfigElement()}},f=()=>class extends HTMLElement{static async generate(e,t){await _;return(new p).generate(e,t)}};function x(){const e=document.querySelector("home-assistant"),t=document.querySelector("home-assistant-main");return e?.hass||e?.__hass||t?.hass||window.hass}function y(e,t,i,a){var o,r=arguments.length,n=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,a);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(r<3?o(n):r>3?o(t,i,n):o(t,i))||n);return r>3&&n&&Object.defineProperty(t,i,n),n}b(u,v()),b("ll-strategy-view-dwains-dashboard-next-view",f()),b("ll-strategy-dashboard-dwains",v()),b("ll-strategy-view-dwains-view",f()),function(){if(window.__dwainsDashboardNextDefaultRedirectInstalled)return;window.__dwainsDashboardNextDefaultRedirectInstalled=!0;let e=!1;const t=async()=>{if(function(e){return"/"===e||"/home"===e||"/home/"===e||"/home/overview"===e||e.startsWith("/home/overview/")}(window.location.pathname||"/")&&!e){e=!0;try{const e=await async function(e=30){for(let t=0;t<e;t+=1){const e=x();if(e?.callWS)return e;await new Promise(e=>window.setTimeout(e,t<5?100:250))}}(),t=String(e?.userData?.default_panel||"").trim();if(!e||!t||"home"===t)return;if(!await async function(e,t){try{const i=await e.callWS({type:"lovelace/dashboards/list"});if(!(Array.isArray(i)?i.find(e=>e?.url_path===t):void 0))return!1;const a=await e.callWS({type:"lovelace/config",url_path:t});return a?.strategy?.type===`custom:${m}`||"custom:dwains"===a?.strategy?.type}catch{return!1}}(e,t))return;const i=`/${t}/home${window.location.search||""}${window.location.hash||""}`;if(window.location.pathname===`/${t}/home`)return;window.history.replaceState(window.history.state||null,"",i),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!0}}))}finally{e=!1}}};t(),window.addEventListener("location-changed",t),window.addEventListener("popstate",t),window.setTimeout(t,750),window.setTimeout(t,1600)}(),null==window.customStrategies&&(window.customStrategies=[]),Array.isArray(window.customStrategies)?window.customStrategies.some(e=>e?.type===m&&"dashboard"===e?.strategyType)||(window.customStrategies.push({type:m,strategyType:"dashboard",name:"Dwains Dashboard Next",description:"Automatic dashboard based on your areas, devices and entities.",documentationURL:"https://github.com/dwainscheeren/dwains-dashboard-next"}),console.log("Registered Dwains Dashboard Next in the Add dashboard dialog")):console.warn("Dwains Dashboard Next - Skipped Add dashboard registration because window.customStrategies is not an array.",window.customStrategies),null==window.customCards&&(window.customCards=[]),Array.isArray(window.customCards)?window.customCards.some(e=>e?.type===g)||window.customCards.push({type:g,name:"Dwains Dashboard Next",preview:!1,description:"A complete automatic building dashboard solution based on your HA Areas, Devices, Entities and Floors",documentationURL:"https://github.com/dwainscheeren/dwains-dashboard-next"}):console.warn("Dwains Dashboard Next - Skipped card picker registration because window.customCards is not an array.",window.customCards),"function"==typeof SuppressedError&&SuppressedError;var w="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",k="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",$="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",S="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",C="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",A="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z",E="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",z="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z",D="M5,9.5L7.5,14H2.5L5,9.5M3,4H7V8H3V4M5,20A2,2 0 0,0 7,18A2,2 0 0,0 5,16A2,2 0 0,0 3,18A2,2 0 0,0 5,20M9,5V7H21V5H9M9,19H21V17H9V19M9,13H21V11H9V13Z";const H=globalThis,M=H.ShadowRoot&&(void 0===H.ShadyCSS||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,L=Symbol(),I=new WeakMap;let P=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==L)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(M&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=I.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&I.set(t,e))}return e}toString(){return this.cssText}};const j=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new P(i,e,L)},T=M?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new P("string"==typeof e?e:e+"",void 0,L))(t)})(e):e,{is:N,defineProperty:O,getOwnPropertyDescriptor:R,getOwnPropertyNames:V,getOwnPropertySymbols:B,getPrototypeOf:F}=Object,q=globalThis,W=q.trustedTypes,U=W?W.emptyScript:"",G=q.reactiveElementPolyfillSupport,K=(e,t)=>e,Y={toAttribute(e,t){switch(t){case Boolean:e=e?U:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},Z=(e,t)=>!N(e,t),X={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:Z};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;let Q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=X){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&O(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:o}=R(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const r=a?.call(this);o?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??X}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;const e=F(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){const e=this.properties,t=[...V(e),...B(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(T(e))}else void 0!==e&&t.push(T(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(M)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),a=H.litNonce;void 0!==a&&t.setAttribute("nonce",a),t.textContent=i.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:Y).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:Y;this._$Em=a;const r=o.fromAttribute(t,e.type);this[a]=r??this._$Ej?.get(a)??r,this._$Em=null}}requestUpdate(e,t,i,a=!1,o){if(void 0!==e){const r=this.constructor;if(!1===a&&(o=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??Z)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:o},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==o||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[K("elementProperties")]=new Map,Q[K("finalized")]=new Map,G?.({ReactiveElement:Q}),(q.reactiveElementVersions??=[]).push("2.1.2");const J=globalThis,ee=e=>e,te=J.trustedTypes,ie=te?te.createPolicy("lit-html",{createHTML:e=>e}):void 0,ae="$lit$",oe=`lit$${Math.random().toFixed(9).slice(2)}$`,re="?"+oe,ne=`<${re}>`,se=document,ce=()=>se.createComment(""),de=e=>null===e||"object"!=typeof e&&"function"!=typeof e,le=Array.isArray,pe="[ \t\n\f\r]",he=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,me=/-->/g,ue=/>/g,ge=RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),_e=/'/g,be=/"/g,ve=/^(?:script|style|textarea|title)$/i,fe=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),xe=Symbol.for("lit-noChange"),ye=Symbol.for("lit-nothing"),we=new WeakMap,ke=se.createTreeWalker(se,129);function $e(e,t){if(!le(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==ie?ie.createHTML(t):t}class Se{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let o=0,r=0;const n=e.length-1,s=this.parts,[c,d]=((e,t)=>{const i=e.length-1,a=[];let o,r=2===t?"<svg>":3===t?"<math>":"",n=he;for(let t=0;t<i;t++){const i=e[t];let s,c,d=-1,l=0;for(;l<i.length&&(n.lastIndex=l,c=n.exec(i),null!==c);)l=n.lastIndex,n===he?"!--"===c[1]?n=me:void 0!==c[1]?n=ue:void 0!==c[2]?(ve.test(c[2])&&(o=RegExp("</"+c[2],"g")),n=ge):void 0!==c[3]&&(n=ge):n===ge?">"===c[0]?(n=o??he,d=-1):void 0===c[1]?d=-2:(d=n.lastIndex-c[2].length,s=c[1],n=void 0===c[3]?ge:'"'===c[3]?be:_e):n===be||n===_e?n=ge:n===me||n===ue?n=he:(n=ge,o=void 0);const p=n===ge&&e[t+1].startsWith("/>")?" ":"";r+=n===he?i+ne:d>=0?(a.push(s),i.slice(0,d)+ae+i.slice(d)+oe+p):i+oe+(-2===d?t:p)}return[$e(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]})(e,t);if(this.el=Se.createElement(c,i),ke.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=ke.nextNode())&&s.length<n;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(ae)){const t=d[r++],i=a.getAttribute(e).split(oe),n=/([.?@])?(.*)/.exec(t);s.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?De:"?"===n[1]?He:"@"===n[1]?Me:ze}),a.removeAttribute(e)}else e.startsWith(oe)&&(s.push({type:6,index:o}),a.removeAttribute(e));if(ve.test(a.tagName)){const e=a.textContent.split(oe),t=e.length-1;if(t>0){a.textContent=te?te.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],ce()),ke.nextNode(),s.push({type:2,index:++o});a.append(e[t],ce())}}}else if(8===a.nodeType)if(a.data===re)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=a.data.indexOf(oe,e+1));)s.push({type:7,index:o}),e+=oe.length-1}o++}}static createElement(e,t){const i=se.createElement("template");return i.innerHTML=e,i}}function Ce(e,t,i=e,a){if(t===xe)return t;let o=void 0!==a?i._$Co?.[a]:i._$Cl;const r=de(t)?void 0:t._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(e),o._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=o:i._$Cl=o),void 0!==o&&(t=Ce(e,o._$AS(e,t.values),o,a)),t}class Ae{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??se).importNode(t,!0);ke.currentNode=a;let o=ke.nextNode(),r=0,n=0,s=i[0];for(;void 0!==s;){if(r===s.index){let t;2===s.type?t=new Ee(o,o.nextSibling,this,e):1===s.type?t=new s.ctor(o,s.name,s.strings,this,e):6===s.type&&(t=new Le(o,this,e)),this._$AV.push(t),s=i[++n]}r!==s?.index&&(o=ke.nextNode(),r++)}return ke.currentNode=se,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Ee{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=ye,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Ce(this,e,t),de(e)?e===ye||null==e||""===e?(this._$AH!==ye&&this._$AR(),this._$AH=ye):e!==this._$AH&&e!==xe&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>le(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==ye&&de(this._$AH)?this._$AA.nextSibling.data=e:this.T(se.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Se.createElement($e(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new Ae(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=we.get(e.strings);return void 0===t&&we.set(e.strings,t=new Se(e)),t}k(e){le(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const o of e)a===t.length?t.push(i=new Ee(this.O(ce()),this.O(ce()),this,this.options)):i=t[a],i._$AI(o),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=ee(e).nextSibling;ee(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ze{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,o){this.type=1,this._$AH=ye,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=ye}_$AI(e,t=this,i,a){const o=this.strings;let r=!1;if(void 0===o)e=Ce(this,e,t,0),r=!de(e)||e!==this._$AH&&e!==xe,r&&(this._$AH=e);else{const a=e;let n,s;for(e=o[0],n=0;n<o.length-1;n++)s=Ce(this,a[i+n],t,n),s===xe&&(s=this._$AH[n]),r||=!de(s)||s!==this._$AH[n],s===ye?e=ye:e!==ye&&(e+=(s??"")+o[n+1]),this._$AH[n]=s}r&&!a&&this.j(e)}j(e){e===ye?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class De extends ze{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===ye?void 0:e}}class He extends ze{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==ye)}}class Me extends ze{constructor(e,t,i,a,o){super(e,t,i,a,o),this.type=5}_$AI(e,t=this){if((e=Ce(this,e,t,0)??ye)===xe)return;const i=this._$AH,a=e===ye&&i!==ye||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==ye&&(i===ye||a);a&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Le{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Ce(this,e)}}const Ie={I:Ee},Pe=J.litHtmlPolyfillSupport;Pe?.(Se,Ee),(J.litHtmlVersions??=[]).push("3.3.3");const je=globalThis;let Te=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let o=a._$litPart$;if(void 0===o){const e=i?.renderBefore??null;a._$litPart$=o=new Ee(t.insertBefore(ce(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return xe}};Te._$litElement$=!0,Te.finalized=!0,je.litElementHydrateSupport?.({LitElement:Te});const Ne=je.litElementPolyfillSupport;Ne?.({LitElement:Te}),(je.litElementVersions??=[]).push("4.2.2");const Oe=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},Re={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:Z},Ve=(e=Re,t,i)=>{const{kind:a,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,o,e,!0,i)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const o=this[a];t.call(this,i),this.requestUpdate(a,o,e,!0,i)}}throw Error("Unsupported decorator location: "+a)};function Be(e){return(t,i)=>"object"==typeof i?Ve(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function Fe(e){return Be({...e,state:!0,attribute:!1})}const qe=1,We=2,Ue=e=>(...t)=>({_$litDirective$:e,values:t});let Ge=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const{I:Ke}=Ie,Ye=e=>e,Ze=()=>document.createComment(""),Xe=(e,t,i)=>{const a=e._$AA.parentNode,o=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=a.insertBefore(Ze(),o),r=a.insertBefore(Ze(),o);i=new Ke(t,r,e,e.options)}else{const t=i._$AB.nextSibling,r=i._$AM,n=r!==e;if(n){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==r._$AU&&i._$AP(t)}if(t!==o||n){let e=i._$AA;for(;e!==t;){const t=Ye(e).nextSibling;Ye(a).insertBefore(e,o),e=t}}}return i},Qe=(e,t,i=e)=>(e._$AI(t,i),e),Je={},et=(e,t=Je)=>e._$AH=t,tt=e=>{e._$AR(),e._$AA.remove()},it=(e,t,i)=>{const a=new Map;for(let o=t;o<=i;o++)a.set(e[o],o);return a},at=Ue(class extends Ge{constructor(e){if(super(e),e.type!==We)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let a;void 0===i?i=t:void 0!==t&&(a=t);const o=[],r=[];let n=0;for(const t of e)o[n]=a?a(t,n):n,r[n]=i(t,n),n++;return{values:r,keys:o}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,a]){const o=(e=>e._$AH)(e),{values:r,keys:n}=this.dt(t,i,a);if(!Array.isArray(o))return this.ut=n,r;const s=this.ut??=[],c=[];let d,l,p=0,h=o.length-1,m=0,u=r.length-1;for(;p<=h&&m<=u;)if(null===o[p])p++;else if(null===o[h])h--;else if(s[p]===n[m])c[m]=Qe(o[p],r[m]),p++,m++;else if(s[h]===n[u])c[u]=Qe(o[h],r[u]),h--,u--;else if(s[p]===n[u])c[u]=Qe(o[p],r[u]),Xe(e,c[u+1],o[p]),p++,u--;else if(s[h]===n[m])c[m]=Qe(o[h],r[m]),Xe(e,o[p],o[h]),h--,m++;else if(void 0===d&&(d=it(n,m,u),l=it(s,p,h)),d.has(s[p]))if(d.has(s[h])){const t=l.get(n[m]),i=void 0!==t?o[t]:null;if(null===i){const t=Xe(e,o[p]);Qe(t,r[m]),c[m]=t}else c[m]=Qe(i,r[m]),Xe(e,o[p],i),o[t]=null;m++}else tt(o[h]),h--;else tt(o[p]),p++;for(;m<=u;){const t=Xe(e,c[u+1]);Qe(t,r[m]),c[m++]=t}for(;p<=h;){const e=o[p++];null!==e&&tt(e)}return this.ut=n,et(e,c),xe}});function ot(e){return"---"===e||"..."===e?"":function(e){let t=!1,i=!1;for(let a=0;a<e.length;a++){const o=e[a];if("'"!==o||i)if('"'!==o||t){if("#"===o&&!t&&!i&&(0===a||/\s/.test(e[a-1])))return e.slice(0,a)}else i=!i;else t=!t}return e}(e).replace(/\s+$/,"")}function rt(e){return""===e.content.trim()}function nt(e){for(;e.i<e.lines.length&&rt(e.lines[e.i]);)e.i++}function st(e,t){if(nt(e),e.i>=e.lines.length)return null;const i=e.lines[e.i];return i.indent<t?null:i.content.startsWith("- ")||"-"===i.content?function(e,t){const i=[];for(;e.i<e.lines.length&&(nt(e),!(e.i>=e.lines.length));){const a=e.lines[e.i];if(a.indent<t||"-"!==a.content&&!a.content.startsWith("- "))break;if(a.indent>t)break;const o="-"===a.content?"":a.content.slice(2);if(""===o.trim()){e.i++,i.push(st(e,t+1));continue}const r=t+2;lt(o)?(e.lines[e.i]={indent:r,content:o,raw:a.raw},i.push(ct(e,r))):(e.i++,i.push(ht(e,o,r)))}return i}(e,i.indent):ct(e,i.indent)}function ct(e,t){const i={};for(;e.i<e.lines.length&&(nt(e),!(e.i>=e.lines.length));){const a=e.lines[e.i];if(a.indent<t)break;if(a.indent>t)break;if("-"===a.content||a.content.startsWith("- "))break;const{key:o,rest:r}=pt(a.content);if(null===o)break;if(e.i++,""===r){nt(e);const a=e.lines[e.i];a&&(a.indent>t||a.indent===t&&dt(a))?i[o]=st(e,a.indent):i[o]=null}else i[o]=ht(e,r,t+1)}return i}function dt(e){return"-"===e.content||e.content.startsWith("- ")}function lt(e){return null!==pt(e).key}function pt(e){let t=!1,i=!1;for(let a=0;a<e.length;a++){const o=e[a];if("'"!==o||i)if('"'!==o||t){if(":"===o&&!t&&!i){const t=e[a+1];if(void 0===t||" "===t||"\t"===t){let t=e.slice(0,a).trim();return t=ut(t),{key:t,rest:e.slice(a+1).trim()}}}}else i=!i;else t=!t}return{key:null,rest:""}}function ht(e,t,i){const a=t.match(/^([|>])([+-]?)(\d*)\s*$/);return a?function(e,t,i,a){const o=[];let r=-1;for(;e.i<e.lines.length;){const t=e.lines[e.i];if(""===t.raw.trim()){o.push({text:"",indent:0,blank:!0}),e.i++;continue}const i=t.raw.length-t.raw.replace(/^\s+/,"").length;if(i<a)break;if(-1===r&&(r=i),i<r)break;o.push({text:t.raw.slice(r),indent:i,blank:!1}),e.i++}let n,s=0;for(;o.length&&o[o.length-1].blank;)s++,o.pop();if("|"===t)n=o.map(e=>e.text).join("\n");else{n="";for(let e=0;e<o.length;e++){const t=o[e];if(0===e)n=t.text;else{const i=o[e-1];t.blank||i.blank?n+="\n"+t.text:n+=" "+t.text}}}if("-"===i)return n;if("+"===i)return n+"\n".repeat(s+1);return n.length?n+"\n":n}(e,a[1],a[2]??"",i):mt(t)}function mt(e){const t=e.trim();if(""===t)return null;if(t.startsWith("[")&&t.endsWith("]")||t.startsWith("{")&&t.endsWith("}")){const e=function(e){try{return JSON.parse(e)}catch{}if(e.startsWith("[")){const t=e.slice(1,-1).trim();return""===t?[]:gt(t,",").map(e=>mt(e.trim()))}if(e.startsWith("{")){const t=e.slice(1,-1).trim();if(""===t)return{};const i={};for(const e of gt(t,",")){const t=e.indexOf(":");if(-1===t)continue;i[ut(e.slice(0,t).trim())]=mt(e.slice(t+1).trim())}return i}return}(t);if(void 0!==e)return e}return'"'===t[0]||"'"===t[0]?ut(t):"null"===t||"~"===t||"Null"===t||"NULL"===t?null:"true"===t||"True"===t||"TRUE"===t||"false"!==t&&"False"!==t&&"FALSE"!==t&&(/^[-+]?\d+$/.test(t)?parseInt(t,10):/^[-+]?(\d+\.\d*|\.\d+|\d+)([eE][-+]?\d+)?$/.test(t)?parseFloat(t):t)}function ut(e){return e.length>=2&&'"'===e[0]&&'"'===e[e.length-1]?e.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,"\n").replace(/\\t/g,"\t").replace(/\\\\/g,"\\"):e.length>=2&&"'"===e[0]&&"'"===e[e.length-1]?e.slice(1,-1).replace(/''/g,"'"):e}function gt(e,t){const i=[];let a=0,o=!1,r=!1,n="";for(let s=0;s<e.length;s++){const c=e[s];if("'"!==c||r)if('"'!==c||o){if(!o&&!r)if("["===c||"{"===c)a++;else if("]"===c||"}"===c)a--;else if(c===t&&0===a){i.push(n),n="";continue}}else r=!r;else o=!o;n+=c}return""!==n.trim()&&i.push(n),i}function _t(e){let t;try{t=function(e){const t=e.replace(/\r\n?/g,"\n").split("\n"),i=[];for(const e of t){const t=e.length-e.replace(/^\s+/,"").length,a=e.slice(t);i.push({indent:t,content:ot(a),raw:e})}const a={lines:i,i:0};return nt(a),a.i>=i.length?null:st(a,i[a.i].indent)}(e)}catch(e){throw new Error("Could not read YAML: "+(e?.message||e))}if(!t||"object"!=typeof t)throw new Error("Empty or invalid blueprint.");if(!t.blueprint||"object"!=typeof t.blueprint)throw new Error('Blueprint is missing the "blueprint:" section.');if(void 0===t.card||null===t.card)throw new Error('Blueprint is missing the "card:" section.');const i=t.blueprint;return{meta:{name:String(i.name??"Untitled blueprint"),description:null!=i.description?String(i.description):void 0,version:null!=i.version?String(i.version):void 0,type:null!=i.type?String(i.type):"page",author:null!=i.author?String(i.author):void 0,custom_cards:Array.isArray(i.custom_cards)?i.custom_cards.map(String):[],input:bt(i.input)},card:t.card,raw:e}}function bt(e){const t={};if(!e||"object"!=typeof e)return t;for(const i of Object.keys(e)){const a=e[i]||{};t[i]={name:null!=a.name?String(a.name):i,description:null!=a.description?String(a.description):void 0,type:null!=a.type?String(a.type):"text-field",default:a.default}}return t}function vt(e){const t={},i=e.input||{};for(const e of Object.keys(i)){const a=i[e];void 0!==a.default?t[e]=a.default:"boolean"===a.type?t[e]=!1:t[e]=""}return t}function ft(e,t,i){const a=Array.from(new Set([...Object.keys(t.input||{}),...Object.keys(i||{})])).sort((e,t)=>t.length-e.length);return function e(t){if("string"==typeof t)return function(e){for(const t of a)if(e===`$${t}$`)return xt(i[t]);let t=e;for(const e of a)if(t.includes(`$${e}$`)){const a=i[e];t=t.split(`$${e}$`).join(null==a?"":String(a))}return t}(t);if(Array.isArray(t))return t.map(e);if(t&&"object"==typeof t){const i={};for(const a of Object.keys(t))i[a]=e(t[a]);return i}return t}(e)}function xt(e){if(null==e)return"";if("string"!=typeof e)return e;const t=e.trim();return""===t?"":"true"===t||"false"!==t&&(/^[-+]?\d+$/.test(t)?parseInt(t,10):/^[-+]?(\d+\.\d*|\.\d+)$/.test(t)?parseFloat(t):e)}function yt(e){const t=new Set;return function e(i){Array.isArray(i)?i.forEach(e):i&&"object"==typeof i&&("string"==typeof i.type&&i.type.startsWith("custom:")&&t.add(i.type.slice(7)),Object.values(i).forEach(e))}(e),Array.from(t)}function wt(e){return e.split("_").map(e=>e?e.charAt(0).toUpperCase()+e.slice(1):e).join(" ")}function kt(e,t){const i=`domain.${t}`;return n(i)?o(e,i):wt(t)}function $t(e,t){const i=`device_class.${t}`;return n(i)?o(e,i):wt(t)}const St=["area_cards","devices_cards"],Ct=[["alarm_control_panel",["alarm-control-panel","alarm card","alarm_control_panel","alarm"]],["media_player",["media-player","media player","mediaplayer"]],["binary_sensor",["binary_sensor","binary sensor","motion sensor","window sensor","door sensor","motion/window/door"]],["cover",["mushroom-cover","slider-button-cover","replace_slider_button_cover","cover card","cover"]],["climate",["mushroom-climate","climate card","climate"]],["switch",["slider-button-switch","replace_slider_button_switch","switch card","switch"]],["light",["mushroom-light","slider-button-light","replace_slider_button_light","light card","light"]],["fan",["mushroom-fan","slider-button-fan","replace_slider_button_fan","fan card","fan"]],["lock",["mushroom-lock","lock card","lock"]],["person",["mushroom-person","person card","person"]],["update",["mushroom-update","update card","update"]],["vacuum",["mushroom-vacuum","vacuum card","vacuum"]],["sensor",["sensor card","sensor"]]],At=new Set(["replace_with_input_entity","replace_with_input_entity_id","replace_with_input_name","replace_with_input_domain","replace_with_input_device_class","replace_with_input_area"]);let Et=class extends Te{constructor(){super(...arguments),this._open=!1,this._replacements={},this._domain="light",this._gallery=[],this._galleryLoading=!1,this._galleryError="",this._search="",this._inputs={},this._loadingBlueprint=!1,this._error="",this._applyAssignment=()=>{if(!this._selected||!this._parsed||!this._canApply())return;const e=this._domain,t={id:this._slug(`${this._selected.name}-${e}`),name:this._selected.name,source:this._selected.url,version:this._parsed.meta.version,blueprint:this._parsed.raw,inputs:this._stripSyntheticInputs(this._inputs),custom_cards:this._parsed.meta.custom_cards||this._selected.custom_cards||[],enabled:!0};let i=zt(this._replacements);for(const a of St)i=this._setDomainAssignment(i,a,e,t);this._commit(i)}}_t(e,t){return o(this.hass,e,t)}showDialog(e){this._params=e,this._config=e.config,this._replacements=zt(e.config.blueprint_replacements||{}),this._domain=this._domainOptions()[0]?.value||"light",this._selected=void 0,this._parsed=void 0,this._inputs={},this._error="",this._open=!0,this._loadGallery()}closeDialog(){this._open=!1,this._params=void 0,this.remove()}render(){return this._open&&this._config?fe`
      <ha-dialog open @closed=${this.closeDialog} .heading=${this._t("settings.blueprint_replacements")} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${C}
            .label=${this._t("common.close")}
            @click=${this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${this._t("settings.blueprint_replacements")}</span>
        </ha-dialog-header>

        <div class="content">
          <section class="overview">
            ${this._renderSummary()}
          </section>

          ${this._renderAssignments()}
          ${this._renderBuilder()}
        </div>
      </ha-dialog>
    `:ye}_renderSummary(){const e=this._assignmentEntries().length;return fe`
      <div class="surface-summary">
        <div>
          <div class="surface-title">${this._t("replacement.views_title")}</div>
          <div class="surface-desc">
            ${this._t("replacement.views_description")}
          </div>
        </div>
        <span class="count">${e}</span>
      </div>
    `}_renderAssignments(){const e=this._assignmentEntries();return fe`
      <section class="assignment-section">
        <div class="section-header">
          <ha-icon icon="mdi:shape-outline"></ha-icon>
          <h3>${this._t("replacement.domain_replacements")}</h3>
        </div>
        ${e.length?fe`
              <div class="assignment-list">
                ${at(e,e=>e.target,e=>this._renderAssignment(e.target,e.assignment))}
              </div>
            `:fe`<div class="empty">${this._t("replacement.empty")}</div>`}
      </section>
    `}_renderAssignment(e,t){return fe`
      <div class="assignment ${!1===t.enabled?"disabled":""}">
        <div class="assignment-main">
          <div class="target-pill">${this._t("replacement.target",{domain:kt(this.hass,e)})}</div>
          <div class="assignment-name">${t.name}</div>
          <div class="assignment-meta">
            ${t.version?fe`<span>v${t.version}</span>`:ye}
            ${(t.custom_cards||[]).map(e=>fe`<span>${e}</span>`)}
          </div>
        </div>
        <div class="assignment-actions">
          <button
            class="icon-button"
            title=${!1===t.enabled?this._t("common.enable"):this._t("common.disable")}
            @click=${()=>this._toggleAssignment(e)}
          >
            <ha-icon icon=${!1===t.enabled?"mdi:eye-off":"mdi:eye"}></ha-icon>
          </button>
          <button
            class="icon-button danger"
            title=${this._t("common.remove")}
            @click=${()=>this._removeAssignment(e)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderBuilder(){return fe`
      <section class="builder">
        <div class="section-header">
          <ha-icon icon="mdi:puzzle-edit-outline"></ha-icon>
          <h3>${this._t("replacement.assign")}</h3>
        </div>
        ${this._error?fe`<div class="error">${this._error}</div>`:ye}
        <div class="builder-grid">
          <div class="control-block domain-control">
            <label>${this._t("replacement.domain")}</label>
            ${this._renderDomainControl()}
            <div class="hint">${this._t("replacement.applies_hint")}</div>
          </div>
        </div>

        <div class="gallery-toolbar">
          <input
            class="search"
            type="search"
            placeholder=${this._t("replacement.search")}
            .value=${this._search}
            @input=${e=>this._search=e.target.value}
          />
          ${this._galleryLoading?fe`<span class="loading">${this._t("common.loading")}</span>`:ye}
        </div>
        ${this._galleryError?fe`<div class="error">${this._galleryError}</div>`:ye}

        <div class="gallery">
          ${at(this._filteredGallery(),e=>e.url,e=>fe`
              <button
                class="blueprint-choice ${this._selected?.url===e.url?"selected":""}"
                @click=${()=>this._selectBlueprint(e)}
              >
                <span class="choice-name">${e.name}</span>
                ${e.description?fe`<span class="choice-desc">${e.description}</span>`:ye}
                <span class="choice-tags">
                  ${e.version?fe`<span>v${e.version}</span>`:ye}
                  ${(e.custom_cards||[]).slice(0,3).map(e=>fe`<span>${e}</span>`)}
                </span>
              </button>
            `)}
        </div>

        ${this._selected?this._renderSelectedBlueprint():ye}
      </section>
    `}_renderDomainControl(){const e=this._domainOptions();return fe`
      <select
        .value=${this._domain}
        @change=${e=>{this._domain=e.target.value}}
      >
        ${e.map(e=>fe`<option value=${e.value}>${e.label}</option>`)}
      </select>
    `}_renderSelectedBlueprint(){const e=this._editableInputKeys();return fe`
      <div class="selected-blueprint">
        <div class="selected-header">
          <div>
            <div class="selected-name">${this._selected.name}</div>
            ${this._parsed?.meta.version?fe`<div class="selected-version">v${this._parsed.meta.version}</div>`:ye}
          </div>
          <ha-button
            appearance="accent"
            ?disabled=${this._loadingBlueprint||!this._canApply()}
            @click=${this._applyAssignment}
          >
            <ha-icon icon="mdi:check"></ha-icon>
            ${this._t("common.apply")}
          </ha-button>
        </div>

        ${this._loadingBlueprint?fe`<div class="loading">${this._t("replacement.loading_blueprint")}</div>`:ye}
        <div class="hint">${this._t("replacement.applies_to",{domain:kt(this.hass,this._domain)})}</div>
        ${e.length?fe`
              <div class="input-grid">
                ${e.map(e=>this._renderInputField(e))}
              </div>
            `:fe`<div class="hint">${this._t("replacement.entity_hint")}</div>`}
      </div>
    `}_renderInputField(e){const t=this._parsed?.meta.input?.[e];return fe`
      <label class="input-field">
        <span>${t?.name||e}</span>
        ${t?.description?fe`<small>${t.description}</small>`:ye}
        <input
          type=${"number"===t?.type?"number":"text"}
          .value=${this._inputs[e]??""}
          @input=${t=>this._inputs={...this._inputs,[e]:t.target.value}}
        />
      </label>
    `}async _loadGallery(){if(!this._gallery.length&&!this._galleryLoading){this._galleryLoading=!0,this._galleryError="";try{const e=await fetch("https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json",{redirect:"follow"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json(),i=Array.isArray(t)?t:t?.blueprints||[];this._gallery=i.filter(e=>e?.url&&e?.name&&"replace-card"===e?.type&&!function(e){const t=`${e?.name||""} ${e?.description||""} ${e?.url||""}`.toLowerCase();return t.includes("popup")}(e)).map(e=>({name:String(e.name),description:e.description?String(e.description):void 0,type:e.type?String(e.type):void 0,version:null!=e.version?String(e.version):void 0,url:String(e.url),custom_cards:Array.isArray(e.custom_cards)?e.custom_cards.map(String):void 0}))}catch(e){this._galleryError=String(e?.message||e)}finally{this._galleryLoading=!1}}}async _selectBlueprint(e){this._selected=e,this._parsed=void 0,this._inputs={},this._error="",this._loadingBlueprint=!0;try{const t=await fetch(e.url,{redirect:"follow"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=_t(await t.text());this._parsed=i,this._inputs=vt(i.meta);const a=Mt(e,i);a&&this._domainOptions().some(e=>e.value===a)&&(this._domain=a)}catch(t){this._error=this._t("replacement.load_failed",{name:e.name,error:String(t?.message||t)})}finally{this._loadingBlueprint=!1}}_toggleAssignment(e){const t=this._domainAssignment(e);if(!t)return;const i={...t,enabled:!1===t.enabled};let a=zt(this._replacements);for(const t of St)a=this._setDomainAssignment(a,t,e,i);this._commit(a)}_removeAssignment(e){const t=zt(this._replacements);for(const i of St){const a=t[i]?.by_domain;a&&delete a[e]}this._commit(t)}_commit(e){this._replacements=e;const t={...this._config,blueprint_replacements:e};this._config=t,this._params?.onSave(t)}_setDomainAssignment(e,t,i,a){const o=e[t]||{};return e[t]={...o,by_domain:{...o.by_domain||{},[i]:a}},e}_assignmentEntries(){const e=new Set;return St.forEach(t=>{Object.keys(this._replacements[t]?.by_domain||{}).forEach(t=>e.add(t))}),Array.from(e).sort((e,t)=>kt(this.hass,e).localeCompare(kt(this.hass,t))).map(e=>({target:e,assignment:this._domainAssignment(e)})).filter(e=>!!e.assignment)}_domainAssignment(e){return this._replacements.area_cards?.by_domain?.[e]||this._replacements.devices_cards?.by_domain?.[e]}_domainOptions(){const e=new Set;return Object.keys(this.hass?.states||{}).forEach(t=>e.add(t.split(".")[0]||"")),["light","switch","climate","cover","fan","media_player","person","sensor","binary_sensor"].forEach(t=>e.add(t)),Array.from(e).filter(Boolean).sort().map(e=>({value:e,label:kt(this.hass,e)}))}_canApply(){return!!this._parsed&&!!this._selected&&!!this._domain}_filteredGallery(){const e=this._search.trim().toLowerCase(),t=this._domain.toLowerCase();return this._gallery.filter(t=>{if(!e)return!0;return`${t.name} ${t.description||""} ${(t.custom_cards||[]).join(" ")}`.toLowerCase().includes(e)}).sort((e,i)=>Ht(i,t)-Ht(e,t)||e.name.localeCompare(i.name))}_editableInputKeys(){return Object.keys(this._parsed?.meta.input||{}).filter(e=>!At.has(e))}_stripSyntheticInputs(e){const t={};return Object.entries(e).forEach(([e,i])=>{At.has(e)||""===i||(t[e]=i)}),t}_slug(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}};function zt(e){return{area_cards:Dt(e.area_cards),devices_cards:Dt(e.devices_cards)}}function Dt(e){return{by_domain:{...e?.by_domain||{}},by_device_class:{...e?.by_device_class||{}},by_entity:{...e?.by_entity||{}}}}function Ht(e,t){if(!t)return 0;const i=`${e.name} ${e.description||""} ${(e.custom_cards||[]).join(" ")}`.toLowerCase();if(Mt(e)===t)return 8;const a=t.split(":")[0]||t;return i.includes(t)?4:i.includes(a)?3:0}function Mt(e,t){const i=[e.name,e.description,e.url,...e.custom_cards||[],t?.meta.name,t?.meta.description,...t?.meta.custom_cards||[],Lt(t?.card)].filter(Boolean).join(" ").toLowerCase();return Ct.find(([,e])=>e.some(e=>i.includes(e)))?.[0]||""}function Lt(e){if(!e)return"";if("string"==typeof e?.type)return e.type;try{return JSON.stringify(e)}catch{return""}}function It(e,t,i){let a=document.querySelector("dwains-dashboard-next-replacement-manager-dialog");a||(a=document.createElement("dwains-dashboard-next-replacement-manager-dialog"),document.body.appendChild(a)),a.hass=e,a.showDialog({config:t,onSave:i})}Et.styles=j`
    :host {
      --mdc-dialog-min-width: min(960px, 92vw);
      --mdc-dialog-max-width: min(1040px, 96vw);
    }
    ha-dialog {
      --dialog-content-padding: 0;
    }
    .content {
      padding: 0 18px 20px;
      color: var(--primary-text-color);
    }
    .overview {
      margin-bottom: 14px;
    }
    .surface-summary,
    .assignment,
    .selected-blueprint {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
    }
    .surface-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
    }
    .surface-title,
    .assignment-name,
    .selected-name {
      font-weight: 600;
    }
    .surface-desc,
    .choice-desc,
    .selected-version,
    .hint,
    .empty,
    small {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .count,
    .target-pill,
    .choice-tags span,
    .assignment-meta span {
      border-radius: 999px;
      padding: 2px 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 12px;
      white-space: nowrap;
    }
    .count {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      font-weight: 700;
    }
    .assignment-section,
    .builder {
      margin-top: 18px;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .section-header h3 {
      margin: 0;
      font-size: 15px;
    }
    .section-header ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .assignment-list {
      display: grid;
      gap: 8px;
    }
    .assignment {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px;
    }
    .assignment.disabled {
      opacity: 0.58;
    }
    .assignment-main {
      min-width: 0;
    }
    .assignment-meta,
    .choice-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 6px;
    }
    .assignment-actions {
      display: flex;
      gap: 6px;
    }
    .icon-button {
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
    }
    .icon-button:hover {
      color: var(--primary-color);
    }
    .icon-button.danger:hover {
      color: var(--error-color);
    }
    .builder {
      border-top: 1px solid var(--divider-color);
      padding-top: 16px;
    }
    .builder-grid {
      display: grid;
      grid-template-columns: minmax(220px, 360px);
      gap: 12px;
    }
    .control-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    select,
    .search,
    .input-field input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 10px 11px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .gallery-toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 14px 0 8px;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      max-height: 280px;
      overflow: auto;
      padding-right: 2px;
    }
    .blueprint-choice {
      text-align: left;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      padding: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .blueprint-choice:hover,
    .blueprint-choice.selected {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color) inset;
    }
    .choice-name {
      font-weight: 600;
    }
    .selected-blueprint {
      margin-top: 12px;
      padding: 12px;
    }
    .selected-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .selected-header ha-icon {
      --mdc-icon-size: 18px;
      margin-right: 5px;
    }
    .input-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .input-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .error {
      padding: 10px 12px;
      border-radius: 8px;
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.12);
      color: var(--error-color);
      margin-bottom: 10px;
    }
    .empty {
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      padding: 12px;
    }
    @media (max-width: 760px) {
      :host {
        --mdc-dialog-min-width: 96vw;
      }
      .overview,
      .builder-grid,
      .gallery,
      .input-grid {
        grid-template-columns: 1fr;
      }
      .assignment,
      .selected-header {
        align-items: stretch;
        flex-direction: column;
      }
      .assignment-actions {
        justify-content: flex-end;
      }
    }
  `,y([Be({attribute:!1})],Et.prototype,"hass",void 0),y([Fe()],Et.prototype,"_open",void 0),y([Fe()],Et.prototype,"_params",void 0),y([Fe()],Et.prototype,"_config",void 0),y([Fe()],Et.prototype,"_replacements",void 0),y([Fe()],Et.prototype,"_domain",void 0),y([Fe()],Et.prototype,"_gallery",void 0),y([Fe()],Et.prototype,"_galleryLoading",void 0),y([Fe()],Et.prototype,"_galleryError",void 0),y([Fe()],Et.prototype,"_search",void 0),y([Fe()],Et.prototype,"_selected",void 0),y([Fe()],Et.prototype,"_parsed",void 0),y([Fe()],Et.prototype,"_inputs",void 0),y([Fe()],Et.prototype,"_loadingBlueprint",void 0),y([Fe()],Et.prototype,"_error",void 0),Et=y([Oe("dwains-dashboard-next-replacement-manager-dialog")],Et);var Pt=Object.freeze({__proto__:null,get DwainsReplacementManagerDialog(){return Et},openReplacementManager:It});const jt=["lights","climate","covers","media_players","security","motion","actions","others"],Tt={lights:"mdi:lamps",climate:"mdi:home-thermometer",covers:"mdi:blinds-horizontal",media_players:"mdi:multimedia",security:"mdi:security",motion:"mdi:motion-sensor",actions:"mdi:robot",others:"mdi:shape"};function Nt(e){return e?.sort_mode?e.sort_mode:e?.order?.length?"custom":"alphabetical"}function Ot(e,t,i){let a=[...e];if(t?.hidden){const e=new Set(t.hidden);a=a.filter(t=>!e.has(t.area_id))}const o=Nt(t);if("home_assistant"===o)return a;if("custom"===o&&t?.order?.length){const e=t.order.map(e=>a.find(t=>t.area_id===e)).filter(e=>void 0!==e),i=new Set(t.order);return[...e,...a.filter(e=>!i.has(e.area_id))]}const r=new Intl.Collator(i,{numeric:!0,sensitivity:"base"});return a.sort((e,t)=>r.compare(e.name,t.name))}const Rt=new WeakMap;function Vt(e,t){const i=e.split(".")[0]||"";return"climate"===i?{type:"thermostat",entity:e}:"camera"===i?{type:"picture-entity",entity:e,camera_view:"live"}:"media_player"===i?{type:"media-control",entity:e}:"light"===i?function(e,t){const i=t?.states?.[e],a=i?.attributes||{},o=new Set((a.supported_color_modes||[]).map(String)),r=String(a.color_mode||""),n=["brightness","color_temp","hs","xy","rgb","rgbw","rgbww","white"],s="number"==typeof a.brightness||n.some(e=>o.has(e)||r===e),c=o.has("color_temp")||"color_temp"===r||void 0!==a.color_temp_kelvin||void 0!==a.min_color_temp_kelvin,d=[];s&&d.push({type:"light-brightness"});c&&d.push({type:"light-color-temp"});return{type:"tile",entity:e,state_content:s?["state","brightness"]:"state",tap_action:{action:"toggle"},hold_action:{action:"more-info"},...d.length?{features_position:"bottom",features:d}:{}}}(e,t):"cover"===i?function(e,t){const i=t?.states?.[e],a=Number(i?.attributes?.supported_features),o="number"==typeof i?.attributes?.current_position||Number.isFinite(a)&&!!(4&a),r=[{type:"cover-open-close"}];o&&r.push({type:"cover-position"});return{type:"tile",entity:e,state_content:o?["state","current_position"]:"state",features_position:"bottom",features:r}}(e,t):"sensor"===i?function(e,t){const i=t?.states?.[e];return i?.attributes?.unit_of_measurement!==undefined?{type:"sensor",entity:e,graph:"line",hours_to_show:24,detail:1}:{type:"tile",entity:e}}(e,t):"binary_sensor"===i?function(e,t){const i=t?.states?.[e],a=String(i?.attributes?.device_class||"");if("motion"!==a&&"occupancy"!==a&&"presence"!==a)return{type:"tile",entity:e};return{type:"tile",entity:e,state_content:["state","last_changed"]}}(e,t):{type:"tile",entity:e}}function Bt(e){const t="string"==typeof e.entity?e.entity:e.entity.entity_id,i=Ft(e);if(!i||!1===i.enabled)return Vt(t,e.hass);try{const a=function(e){const t=Rt.get(e);if(t)return t;const i=_t(e.blueprint);return Rt.set(e,i),i}(i),o={...vt(a.meta),...i.inputs||{},...Gt(e.hass,e.config,t)};return ft(a.card,a.meta,o)}catch(a){return console.warn("Dwains replacement blueprint failed; using default card.",i.name,a),Vt(t,e.hass)}}function Ft(e){const t="string"==typeof e.entity?e.entity:e.entity.entity_id,i=e.config?.blueprint_replacements?.[e.surface],a=e.config?.blueprint_replacements?.["area_cards"===e.surface?"devices_cards":"area_cards"],o=t.split(".")[0]||"",r=Ut(e.hass,t),n=r?`${o}:${r}`:"";return qt(i,t,o,n)||qt(a,t,o,n)}function qt(e,t,i,a){if(e)return e.by_entity?.[t]||(a?e.by_device_class?.[a]:void 0)||e.by_domain?.[i]}function Wt(e,t){const i=e.states?.[t];return i?.attributes?.friendly_name||t}function Ut(e,t){const i=e.states?.[t];return String(i?.attributes?.device_class||"")}function Gt(e,t,i){const a=i.split(".")[0]||"",o=Ut(e,i),r=function(e,t,i){const a=t?.entities?.find(e=>e.entity_id===i),o=a?.device_id?t?.devices?.find(e=>e.device_id===a.device_id):void 0,r=a?.area_id||o?.area_id||e.entities?.[i]?.area_id||"";return t?.areas?.find(e=>e.area_id===r)?.name||r||""}(e,t,i);return{replace_with_input_entity:i,replace_with_input_entity_id:i,replace_with_input_name:Wt(e,i),replace_with_input_domain:a,replace_with_input_device_class:o,replace_with_input_area:r}}const Kt=e=>({light:"mdi:lightbulb",switch:"mdi:flash",sensor:"mdi:eye",energy:"mdi:flash",binary_sensor:"mdi:radiobox-blank",cover:"mdi:window-shutter",climate:"mdi:thermostat",fan:"mdi:fan",lock:"mdi:lock",media_player:"mdi:play-circle",camera:"mdi:camera",vacuum:"mdi:robot-vacuum",person:"mdi:account",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",event:"mdi:gesture-tap-button",alarm_control_panel:"mdi:security",button:"mdi:gesture-tap-button",number:"mdi:numeric",select:"mdi:form-dropdown",input_boolean:"mdi:toggle-switch",input_button:"mdi:gesture-tap-button",input_number:"mdi:numeric",input_select:"mdi:form-dropdown",input_text:"mdi:form-textbox",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",siren:"mdi:bullhorn",valve:"mdi:valve",update:"mdi:update",sun:"mdi:white-balance-sunny",weather:"mdi:weather-cloudy",device_tracker:"mdi:map-marker-radius",remote:"mdi:remote",image:"mdi:image",todo:"mdi:clipboard-list",calendar:"mdi:calendar",lawn_mower:"mdi:robot-mower",text:"mdi:form-textbox",date:"mdi:calendar",time:"mdi:clock-outline",timer:"mdi:timer-outline",counter:"mdi:counter"}[e]||"mdi:shape-outline"),Yt=(e,t)=>{if("binary_sensor"===e&&["motion","occupancy","presence"].includes(t||""))return"#df5b63";return{light:"#e1a129",switch:"#2f6fd6",cover:"#1494aa",camera:"#0ea5c6",climate:"#34a6d8",fan:"#2b8fcb",lock:"#2f6fd6",media_player:"#7c67c7",person:"#6d7891",binary_sensor:"#6d7891",sensor:"#4f79a7",wattage:"#d88e20",energy:"#d88e20",temperature:"#7c67c7",humidity:"#34a6d8",vacuum:"#7c67c7",alarm_control_panel:"#df5b63",button:"#7c67c7",event:"#7c67c7",select:"#6d7891"}[e]||"#7c67c7"},Zt=(e,t)=>{if(!t)return Kt(e);return{binary_sensor:{door:"mdi:door",window:"mdi:window-closed",motion:"mdi:motion-sensor",occupancy:"mdi:home-account",moisture:"mdi:water",smoke:"mdi:smoke-detector",heat:"mdi:thermometer-alert",cold:"mdi:snowflake",gas:"mdi:gas-cylinder",vibration:"mdi:vibrate",battery:"mdi:battery",battery_charging:"mdi:battery-charging",plug:"mdi:power-plug",power:"mdi:flash",presence:"mdi:account-check",problem:"mdi:alert-circle",safety:"mdi:shield-check",lock:"mdi:lock",opening:"mdi:door",sound:"mdi:volume-high",update:"mdi:update",light:"mdi:lightbulb"},sensor:{temperature:"mdi:thermometer",humidity:"mdi:water-percent",illuminance:"mdi:brightness-7",pressure:"mdi:gauge",battery:"mdi:battery",power:"mdi:flash",energy:"mdi:lightning-bolt",current:"mdi:current-ac",voltage:"mdi:flash-triangle",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co"},cover:{garage:"mdi:garage",gate:"mdi:gate",blind:"mdi:blinds",curtain:"mdi:curtains",damper:"mdi:air-filter",door:"mdi:door-closed",shade:"mdi:roller-shade",shutter:"mdi:window-shutter",window:"mdi:window-closed"}}[e]?.[t]||Kt(e)},Xt=e=>{if(e.icon)return e.icon;const t={"living room":"mdi:sofa",bedroom:"mdi:bed",kitchen:"mdi:silverware-fork-knife",bathroom:"mdi:shower",garage:"mdi:garage",garden:"mdi:flower",office:"mdi:desk",hallway:"mdi:door",basement:"mdi:home-floor-b",attic:"mdi:home-roof"},i=e.name.toLowerCase();for(const[e,a]of Object.entries(t))if(i.includes(e))return a;return"mdi:home"},Qt=["cameras","areas","devices","todos","favorites","summaries"],Jt={summaries:{labelKey:"home_section.summaries.label",icon:"mdi:clipboard-list-outline",descriptionKey:"home_section.summaries.description"},cameras:{labelKey:"home_section.cameras.label",icon:"mdi:cctv",descriptionKey:"home_section.cameras.description"},areas:{labelKey:"home_section.areas.label",icon:"mdi:floor-plan",descriptionKey:"home_section.areas.description"},devices:{labelKey:"home_section.devices.label",icon:"mdi:view-dashboard-outline",descriptionKey:"home_section.devices.description"},todos:{labelKey:"home_section.todos.label",icon:"mdi:format-list-checks",descriptionKey:"home_section.todos.description"},favorites:{labelKey:"home_section.favorites.label",icon:"mdi:star",descriptionKey:"home_section.favorites.description"}},ei=["people","climate","power","device_groups"],ti={people:{labelKey:"home_card.people.label",icon:"mdi:account-group",descriptionKey:"home_card.people.description"},climate:{labelKey:"home_card.climate.label",icon:"mdi:home-thermometer-outline",descriptionKey:"home_card.climate.description"},power:{labelKey:"home_card.power.label",icon:"mdi:flash",descriptionKey:"home_card.power.description"},device_groups:{labelKey:"home_card.device_groups.label",icon:"mdi:view-grid-outline",descriptionKey:"home_card.device_groups.description"}};function ii(e){const t=new Set(Qt),i=(e||[]).filter(e=>"string"==typeof e&&t.has(e)).filter((e,t,i)=>i.indexOf(e)===t),a=Qt.filter(e=>!i.includes(e)),o=[...i];return a.forEach(e=>{const t=Qt.indexOf(e),i=o.findIndex(e=>Qt.indexOf(e)>t);-1===i?o.push(e):o.splice(i,0,e)}),o}function ai(e){const t=new Set(Qt);return(e||[]).filter(e=>"string"==typeof e&&t.has(e)).filter((e,t,i)=>i.indexOf(e)===t)}function oi(e){const t=new Set(ei);return(e||[]).filter(e=>"string"==typeof e&&t.has(e)).filter((e,t,i)=>i.indexOf(e)===t)}let ri="overview",ni=0;function si(e){ri=e,ni=Date.now()}const ci={"mdi:card-account-details-star-outline":"M20 22.09L22.45 23.58L21.8 20.77L24 18.89L21.11 18.64L20 16L18.87 18.64L16 18.89L18.18 20.77L17.5 23.58L20 22.09M14.08 21H2C.91 20.96 .04 20.09 0 19V5C.04 3.91 .91 3.04 2 3H22C23.09 3.04 23.96 3.91 24 5V15.53C23.42 15 22.75 14.61 22 14.34V5H2V19H14.08C14.03 19.33 14 19.66 14 20C14 20.34 14.03 20.68 14.08 21M14 17H4V15.75C4 14.09 7.34 13.25 9 13.25C10.66 13.25 14 14.09 14 15.75V17M14 11H18V12H14V11M9 7C7.63 7 6.5 8.13 6.5 9.5C6.5 10.87 7.63 12 9 12C10.37 12 11.5 10.87 11.5 9.5C11.5 8.13 10.37 7 9 7M14 9H20V10H14V9M14 7H20V8H14V7Z","mdi:chevron-right":S,"mdi:floor-plan":"M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z","mdi:format-list-bulleted-type":D,"mdi:heart-outline":"M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z","mdi:home-edit-outline":"M 21.0413,11.14C 21.1827,11.14 21.3173,11.1973 21.4213,11.3027L 22.6973,12.5787C 22.912,12.792 22.912,13.14 22.6973,13.3493L 21.6973,14.3493L 19.6507,12.3027L 20.6507,11.3027C 20.76,11.1973 20.9013,11.14 21.0413,11.14 Z M 19.0627,12.88L 21.1093,14.932L 15.0627,21L 13,21L 13,18.9373L 19.0627,12.88 Z M 12,5.688L 7,10.188L 7,18L 11,18L 11,20L 5,20L 5,12L 2,12L 12,3L 19.4587,9.71285L 17,12.1716L 17,10.188L 12,5.688 Z","mdi:package-variant-closed-check":"M12 2C11.8 2 11.6 2.1 11.4 2.2L3.5 6.6C3.2 6.8 3 7.1 3 7.5V16.5C3 16.9 3.2 17.2 3.5 17.4L11.4 21.8C11.6 21.9 11.8 22 12 22S12.4 21.9 12.6 21.8L13.5 21.3C13.2 20.7 13.1 20 13 19.3V12.6L19 9.2V13C19.7 13 20.4 13.1 21 13.3V7.5C21 7.1 20.8 6.8 20.5 6.6L12.6 2.2C12.4 2.1 12.2 2 12 2M12 4.2L18 7.5L16 8.6L10.1 5.2L12 4.2M8.1 6.3L14 9.8L12 10.9L6 7.5L8.1 6.3M5 9.2L11 12.6V19.3L5 15.9V9.2M21.3 15.8L17.7 19.4L16.1 17.8L15 19L17.8 22L22.6 17.2L21.3 15.8Z","mdi:puzzle-edit-outline":"M21.04 12.13C20.9 12.13 20.76 12.19 20.65 12.3L19.65 13.3L21.7 15.35L22.7 14.35C22.92 14.14 22.92 13.79 22.7 13.58L21.42 12.3C21.31 12.19 21.18 12.13 21.04 12.13M19.07 13.88L13 19.94V22H15.06L21.12 15.93L19.07 13.88M11.05 19.06C10.87 19 10.69 19 10.5 19C9 19 7.8 20.21 7.8 21.7V22H4C2.9 22 2 21.11 2 20V16.2H2.3C3.79 16.2 5 15 5 13.5S3.79 10.8 2.3 10.8H2V7C2 5.9 2.9 5 4 5H7.04C7.28 3.3 8.74 2 10.5 2S13.72 3.3 13.96 5H17C18.11 5 19 5.9 19 7V10.04C19.36 10.09 19.69 10.21 20 10.36C19.73 10.5 19.46 10.66 19.24 10.89L18.12 12H17V7H12V5.5C12 4.67 11.33 4 10.5 4S9 4.67 9 5.5V7H4V9.12C5.76 9.8 7 11.5 7 13.5S5.75 17.2 4 17.88V20H6.12C6.8 18.25 8.5 17 10.5 17C11.26 17 12 17.18 12.61 17.5L11.05 19.06Z","mdi:shield-account":"M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z","mdi:tune-variant":"M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z","mdi:view-dashboard-edit":"M21 13.1C20.9 13.1 20.7 13.2 20.6 13.3L19.6 14.3L21.7 16.4L22.7 15.4C22.9 15.2 22.9 14.8 22.7 14.6L21.4 13.3C21.3 13.2 21.2 13.1 21 13.1M19.1 14.9L13 20.9V23H15.1L21.2 16.9L19.1 14.9M21 9H13V3H21V9M13 18.06V11H21V11.1C20.24 11.1 19.57 11.5 19.19 11.89L13 18.06M11 13H3V3H11V13M11 21H3V15H11V21Z"};let di=class extends Te{constructor(){super(...arguments),this._t=(e,t)=>o(this._hass,e,t),this._tp=(e,t)=>r(this._hass,e,t),this._loading=!0,this._showEntityPicker=!1,this._entitySearchFilter="",this._showWeatherPicker=!1,this._weatherSearchFilter="",this._showAlarmPicker=!1,this._alarmSearchFilter="",this._settingsPage=Date.now()-ni<8e3?ri:"overview",this._dashboardTitle="",this._dashboardIcon="",this._backToSettingsOverview=()=>{this._settingsPage="overview",si("overview"),this._closeInlinePickers()},this._resetHomeCameraSettings=()=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_camera_order:[],home_cameras_hidden:[]}})},this._resetHomeSectionsOrder=()=>{if(!this._config)return;const e={...this._config,settings:{...this._config.settings,home_sections_order:ii(),home_sections_hidden:[]}};this._fireConfigChanged(e)},this._handleHomeSectionDragEnd=()=>{this._draggedHomeSection=void 0,this._dragOverHomeSectionIndex=void 0},this._handleHomeSectionDragLeave=e=>{const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverHomeSectionIndex=void 0)},this._handleHomeCameraDragEnd=()=>{this._draggedHomeCamera=void 0,this._dragOverHomeCameraIndex=void 0},this._handleHomeCameraDragLeave=e=>{const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverHomeCameraIndex=void 0)}}set hass(e){const t=this._hass;this._hass=e,e&&!t&&(this._fetchData(),this._fetchDashboardInfo())}get hass(){return this._hass}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}async _fetchDashboardInfo(){if(this._hass)try{const e=this._getDashboardUrlPath();if(!e)return;const t=(await this._hass.callWS({type:"lovelace/dashboards/list"})||[]).find(t=>t.url_path===e);t&&(this._dashboardId=t.id,this._dashboardTitle=t.title||"",this._dashboardIcon=t.icon||"")}catch(e){console.warn("Dashboard-info ophalen mislukt:",e)}}async _saveDashboardInfo(){if(this._hass&&this._dashboardId)try{await this._hass.callWS({type:"lovelace/dashboards/update",dashboard_id:this._dashboardId,title:this._dashboardTitle||"Dashboard",icon:this._dashboardIcon||void 0}),console.log("✅ Dashboard-naam/icoon opgeslagen")}catch(e){console.error("❌ Dashboard bijwerken mislukt:",e),alert(this._t("strategy.save_name_failed",{error:String(e)}))}}_onDashboardTitleChanged(e){this._dashboardTitle=e.target.value}_onDashboardTitleCommit(){this._saveDashboardInfo()}_onDashboardIconChanged(e){this._dashboardIcon=e.detail?.value??e.target?.value??"",this._saveDashboardInfo()}async setConfig(e){this._config={type:e?.type||"custom:dwains-dashboard-next",areas_display:e?.areas_display||{},areas_options:e?.areas_options||{},blueprint_replacements:e?.blueprint_replacements||{},device_admission:e?.device_admission||{},favorites:e?.favorites||[],settings:e?.settings||{},areas:[],devices:[],entities:[],floors:[]},this.hass?(this._loading=!this._registryData,this._fetchData()):this._loading=!0}connectedCallback(){super.connectedCallback(),this.hass&&this._fetchData()}async _fetchData(){if(this.hass){if(this._registryData)return this._applyRegistryData(this._registryData.areas,this._registryData.devices,this._registryData.entities),void(this._loading=!1);if(this._fetchDataPromise)return this._fetchDataPromise;this._loading=!0,this._fetchDataPromise=this._loadRegistryData();try{await this._fetchDataPromise}finally{this._fetchDataPromise=void 0}}}async _loadRegistryData(){const e=this.hass;if(e)try{const[t,i,a]=await Promise.all([e.callWS({type:"config/area_registry/list"}),e.callWS({type:"config/device_registry/list"}),e.callWS({type:"config/entity_registry/list"})]);this._registryData={areas:t,devices:i,entities:a},this._applyRegistryData(t,i,a),this._loading=!1,this.requestUpdate()}catch(e){console.error("Failed to fetch data:",e),this._loading=!1}}_applyRegistryData(e,t,i){this.hass&&(this.hass.areas=e.reduce((e,t)=>(e[t.area_id]=t,e),{}),this.hass.entities=i.reduce((e,t)=>(e[t.entity_id]=t,e),{}),this.hass.devices=t.reduce((e,t)=>(e[t.id]=t,e),{}),this._config={...this._config||{type:"custom:dwains-dashboard-next"},areas:e.map(e=>({area_id:e.area_id,name:e.name,picture:e.picture,icon:e.icon})),devices:t.map(e=>({device_id:e.id,name:e.name_by_user||e.name,area_id:e.area_id,created_at:e.created_at})),entities:i.map(e=>({entity_id:e.entity_id,area_id:e.area_id,device_id:e.device_id,created_at:e.created_at}))})}render(){return this._config?!this.hass||this._loading?this._renderLoadingShell():this._area?this._renderAreaEditor():this._renderAreasEditor():this._renderLoadingShell()}_renderLoadingShell(){return fe`
      <div class="editor-container settings-loading-shell" aria-busy="true">
        <div class="settings-overview-hero settings-overview-hero-skeleton">
          <div>
            <h2>${this._t("settings.title")}</h2>
            <p>${this._t("settings.loading")}</p>
            <div class="settings-version-chip">
              ${this._renderSettingsIcon("mdi:package-variant-closed-check")}
              <span>${this._t("settings.loaded_version")}</span>
              <strong>v${h}</strong>
            </div>
          </div>
          ${this._renderSettingsIcon("mdi:tune-variant","settings-hero-icon")}
        </div>
        <section class="settings-nav-section">
          <h3>${this._t("settings.loading")}</h3>
          <div class="settings-nav-list">
            ${[0,1,2,3].map(()=>fe`
              <div class="settings-nav-item settings-nav-item-skeleton">
                <span class="settings-nav-icon skeleton-block"></span>
                <span class="settings-skeleton-copy">
                  <span></span>
                  <small></small>
                </span>
              </div>
            `)}
          </div>
        </section>
      </div>
    `}_renderAreasEditor(){return this.hass&&this._config?"overview"===this._settingsPage?this._renderSettingsOverview():this._renderSettingsDetailPage(this._settingsPage):ye}_renderSettingsOverview(){const e=[{key:"general",title:this._t("settings.general")},{key:"layout",title:this._t("settings.dashboard_layout")},{key:"advanced",title:this._t("settings.advanced")}],t=this._settingsOverviewItems();return fe`
      <div class="editor-container">
        <div class="settings-overview-hero">
          <div>
            <h2>${this._t("settings.title")}</h2>
            <p>${this._t("settings.subtitle")}</p>
            <div class="settings-version-chip">
              ${this._renderSettingsIcon("mdi:package-variant-closed-check")}
              <span>${this._t("settings.loaded_version")}</span>
              <strong>v${h}</strong>
            </div>
          </div>
          ${this._renderSettingsIcon("mdi:tune-variant","settings-hero-icon")}
        </div>

        ${e.map(e=>{const i=t.filter(t=>t.group===e.key);return i.length?fe`
            <section class="settings-nav-section">
              <h3>${e.title}</h3>
              <div class="settings-nav-list">
                ${i.map(e=>this._renderSettingsNavItem(e))}
              </div>
            </section>
          `:ye})}
      </div>
    `}_settingsOverviewItems(){const e=Object.keys(this.hass?.areas||{}).length,t=this._getHomeSectionsOrder().filter(e=>!this._getHiddenHomeSections().has(e)).length,i=ei.filter(e=>!this._getHiddenHomeInformationCards().has(e)).length,a=this._getDeviceTypeOptions().length,o=this._getHiddenDeviceTypes().size,r=Object.values(this.hass?.states||{}).filter(e=>e.entity_id?.startsWith("person.")).length,n=this._config?.favorites?.length||0,s=this._replacementCount(),c=this._getHiddenDeviceIds().size,d=!1===this._config?.settings?.hide_unavailable_entities_on_devices?this._t("settings.unavailable_shown"):this._t("settings.unavailable_hidden"),l=!1===this._config?.settings?.hide_unavailable_entities?this._t("settings.unavailable_shown"):this._t("settings.unavailable_hidden"),p=Nt(this._config?.areas_display);return[{page:"dashboard",group:"general",icon:"mdi:view-dashboard-edit",color:"var(--primary-color)",title:this._t("settings.dashboard"),description:this._t("settings.dashboard_description"),summary:this._dashboardTitle||this._t("settings.current_dashboard")},{page:"home",group:"general",icon:"mdi:home-edit-outline",color:"#0ea5e9",title:this._t("settings.home_page"),description:this._t("settings.home_page_description"),summary:`${t} · ${this._t("settings.house_cards",{visible:i,total:ei.length})} · ${this._tp("common.favorite",n)}`},{page:"header",group:"general",icon:"mdi:card-account-details-star-outline",color:"#22a06b",title:this._t("settings.header_status"),description:this._t("settings.header_status_description"),summary:`${!1===this._config?.settings?.show_notifications?this._t("settings.notifications_hidden"):this._t("settings.notifications_shown")} · ${this._config?.settings?.alarm_entity_id?this._t("settings.alarm_selected"):this._t("settings.no_alarm_selected")}`},{page:"people",group:"layout",icon:"mdi:account-group-outline",color:"#8b5cf6",title:this._t("settings.people"),description:this._t("settings.people_description"),summary:this._tp("common.person",r)},{page:"areas",group:"layout",icon:"mdi:floor-plan",color:"#14b8a6",title:this._t("settings.areas"),description:this._t("settings.areas_description"),summary:`${this._tp("common.area",e)} · ${this._t(`settings.area_order_${p}`)} · ${l}`},{page:"devices",group:"layout",icon:"mdi:format-list-bulleted-type",color:"#0891b2",title:this._t("settings.devices_page"),description:this._t("settings.devices_page_description"),summary:`${this._t("settings.types_visible",{visible:a-o,total:a})} · ${this._t("settings.hidden_devices_count",{count:c})} · ${d}`},{page:"replacements",group:"layout",icon:"mdi:puzzle-edit-outline",color:"#7c3aed",title:this._t("settings.blueprint_replacements"),description:this._t("settings.blueprint_replacements_description"),summary:this._tp("common.active",s)},{page:"permissions",group:"advanced",icon:"mdi:shield-account",color:"#ef4444",title:this._t("settings.user_permissions"),description:this._t("settings.user_permissions_description"),summary:this._config?.settings?.restrict_non_admin_ha_sidebar||this._config?.settings?.restrict_non_admin_dashboard_settings?this._t("settings.restrictions_enabled"):this._t("settings.default_access")},{page:"support",group:"advanced",icon:"mdi:heart-outline",color:"#f59e0b",title:this._t("settings.support"),description:this._t("settings.support_description"),summary:this._t("settings.optional")}]}_renderSettingsNavItem(e){return fe`
      <button
        class="settings-nav-item"
        type="button"
        style=${`--settings-item-color: ${e.color};`}
        @click=${()=>this._openSettingsPage(e.page)}
      >
        <div class="settings-nav-icon">
          ${this._renderSettingsIcon(e.icon)}
        </div>
        <div class="settings-nav-copy">
          <div class="settings-nav-title">${e.title}</div>
          <div class="settings-nav-description">${e.description}</div>
        </div>
        ${e.summary?fe`<span class="settings-nav-summary">${e.summary}</span>`:ye}
        ${this._renderSettingsIcon("mdi:chevron-right","settings-nav-chevron")}
      </button>
    `}_renderSettingsIcon(e,t=""){const i=ci[e];return i?fe`
      <svg class=${t} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${i}></path>
      </svg>
    `:fe`<ha-icon class=${t} icon=${e}></ha-icon>`}_openSettingsPage(e){this._settingsPage=e,si(e),this._closeInlinePickers()}_closeInlinePickers(){this._showEntityPicker=!1,this._showWeatherPicker=!1,this._showAlarmPicker=!1}_renderSettingsDetailPage(e){const t=this._settingsOverviewItems().find(t=>t.page===e);return t?fe`
      <div class="editor-container">
        <div class="settings-detail-toolbar">
          <button class="settings-back-button" type="button" @click=${this._backToSettingsOverview}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            <span>${this._t("settings.all_settings")}</span>
          </button>
          <div class="settings-detail-title">
            <span>${t.title}</span>
            <small>${t.description}</small>
          </div>
        </div>
        <div class="settings-detail-content">
          ${this._renderSettingsPageContent(e)}
        </div>
      </div>
    `:this._renderSettingsOverview()}_renderSettingsPageContent(e){switch(e){case"dashboard":return this._renderDashboardSettingsPanel();case"home":return fe`
          ${this._renderHomeLayoutSettingsPanel()}
          ${this._renderFavoritesSettingsPanel()}
        `;case"header":return fe`
          ${this._renderTimeSettingsPanel()}
          ${this._renderNotificationSettingsPanel()}
          ${this._renderWeatherSettingsPanel()}
          ${this._renderAlarmSettingsPanel()}
        `;case"devices":return this._renderEntityDisplaySettingsPanel();case"people":return this._renderPersonsSettingsPanel();case"areas":return this._renderAreasSettingsPanel();case"replacements":return this._renderReplacementsSettingsPanel();case"permissions":return this._renderPermissionsSettingsPanel();case"support":return this._renderSupportSection();default:return ye}}_renderSettingsPanel(e,t,i,a){return fe`
      <ha-expansion-panel expanded outlined>
        <div slot="header">
          <ha-icon icon=${e}></ha-icon>
          ${t}
        </div>
        <p class="description">${i}</p>
        ${a}
      </ha-expansion-panel>
    `}_renderSupportSection(){return fe`
      <div class="sponsoring-section">
        <div class="sponsoring-header">
          <ha-icon icon="mdi:heart"></ha-icon>
          <h3>${this._t("support.title")}</h3>
        </div>
        <p class="sponsoring-text">${this._t("support.description")}</p>

        <div class="sponsor-label">${this._t("support.donation")}</div>
        <div class="sponsor-chips">
          <a class="sponsor-chip" href="https://github.com/sponsors/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:github"></ha-icon><span>${this._t("support.github")}</span>
          </a>
          <a class="sponsor-chip" href="https://www.paypal.me/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:cash"></ha-icon><span>PayPal</span>
          </a>
          <a class="sponsor-chip" href="https://www.buymeacoffee.com/FAkYvrx" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:coffee"></ha-icon><span>${this._t("support.buy_coffee")}</span>
          </a>
        </div>

        <div class="sponsor-divider"></div>

        <div class="sponsor-label">${this._t("support.shop_prompt")}</div>
        <a class="sponsor-chip primary" href="https://smarthomeshop.io/en" target="_blank" rel="noopener noreferrer">
          <ha-icon icon="mdi:shopping"></ha-icon><span>${this._t("support.visit_shop")}</span>
        </a>
      </div>
    `}_renderDashboardSettingsPanel(){return this._dashboardId?this._renderSettingsPanel("mdi:view-dashboard",this._t("settings.dashboard"),this._t("strategy.dashboard_desc"),fe`
        <div class="dashboard-settings">
          <div class="dd-field">
            <label>${this._t("strategy.name")}</label>
            <input
              class="dd-input"
              type="text"
              .value=${this._dashboardTitle}
              @input=${this._onDashboardTitleChanged}
              @change=${this._onDashboardTitleCommit}
            />
          </div>
          <ha-icon-picker
            .label=${this._t("strategy.sidebar_icon")}
            .value=${this._dashboardIcon}
            @value-changed=${this._onDashboardIconChanged}
          ></ha-icon-picker>
        </div>
      `):this._renderSettingsPanel("mdi:view-dashboard",this._t("settings.dashboard"),this._t("settings.default_dashboard_locked"),fe`<div class="empty-settings-card">${this._t("settings.open_instance")}</div>`)}_renderHomeLayoutSettingsPanel(){return this._renderSettingsPanel("mdi:home-edit-outline",this._t("settings.home_layout"),this._t("settings.home_layout_description"),fe`
        ${this._renderHomeSectionOrder()}
        ${this._renderHomeCameraSettings()}
        ${this._renderHomeInformationCardSettings()}
      `)}_renderReplacementsSettingsPanel(){return this._renderSettingsPanel("mdi:puzzle-edit-outline",this._t("settings.blueprint_replacements"),this._t("settings.replace_description"),fe`
        <div class="replacement-section">
          <div class="replacement-summary">
            <div>
              <div class="replacement-count">${this._tp("common.active",this._replacementCount())}</div>
              <div class="replacement-help">${this._t("replacement.views_description")}</div>
            </div>
            <ha-button appearance="accent" @click=${this._openReplacementManager}>
              <ha-icon icon="mdi:puzzle-edit-outline"></ha-icon>
              ${this._t("common.manage")}
            </ha-button>
          </div>
        </div>
      `)}_renderFavoritesSettingsPanel(){return this._renderSettingsPanel("mdi:star",this._t("home_section.favorites.label"),this._t("settings.favorites_description"),fe`
        <div class="favorites-section">
          <div class="favorite-suggestions-toggle">
            <ha-formfield .label=${this._t("settings.show_suggested_favorites")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_suggested_favorites}
                @change=${this._toggleSuggestedFavorites}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              ${this._t("settings.suggested_favorites_description")}
            </p>
          </div>
          <div class="entity-picker">
            <div class="entity-picker-header">
              <h4>${this._t("settings.selected_entities")}</h4>
              <mwc-button @click=${this._addFavoriteEntity} outlined>
                <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                ${this._t("settings.add_entity")}
              </mwc-button>
            </div>

            ${this._renderSelectedEntities()}

            ${this._showEntityPicker?this._renderEntityPicker():""}
          </div>
        </div>
      `)}_renderTimeSettingsPanel(){return this._renderSettingsPanel("mdi:clock-outline",this._t("settings.time_date"),this._t("settings.time_date_description"),fe`
        <div class="time-section">
          <div class="time-toggle">
            <ha-formfield .label=${this._t("settings.show_time")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_time}
                @change=${this._toggleTimeDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      `)}_renderNotificationSettingsPanel(){return this._renderSettingsPanel("mdi:bell-outline",this._t("home.notifications"),this._t("settings.notifications_description"),fe`
        <div class="notifications-section">
          <div class="notifications-toggle">
            <ha-formfield .label=${this._t("settings.show_notifications")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_notifications}
                @change=${this._toggleNotificationsDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      `)}_renderWeatherSettingsPanel(){return this._renderSettingsPanel("mdi:weather-cloudy",this._t("domain.weather"),this._t("settings.weather_description"),fe`
        <div class="weather-section">
          <div class="weather-toggle">
            <ha-formfield .label=${this._t("settings.show_weather")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_weather}
                @change=${this._toggleWeatherDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${!1!==this._config?.settings?.show_weather?fe`
            <div class="weather-picker">
              <div class="weather-picker-header">
                <h4>${this._t("settings.selected_weather")}</h4>
                <mwc-button @click=${this._addWeatherEntity} outlined>
                  <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  ${this._t("settings.select_weather")}
                </mwc-button>
              </div>

              ${this._renderSelectedWeatherEntity()}

              ${this._showWeatherPicker?this._renderWeatherPicker():""}
            </div>
          `:""}
        </div>
      `)}_renderAlarmSettingsPanel(){return this._renderSettingsPanel("mdi:shield-home-outline",this._t("domain.alarm_control_panel"),this._t("settings.alarm_description"),fe`
        <div class="alarm-section">
          <div class="alarm-picker">
            <div class="alarm-picker-header">
              <h4>${this._t("settings.selected_alarm")}</h4>
              <mwc-button @click=${this._addAlarmEntity} outlined>
                <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                ${this._t("settings.select_alarm")}
              </mwc-button>
            </div>

            ${this._renderSelectedAlarmEntity()}

            ${this._showAlarmPicker?this._renderAlarmPicker():""}
          </div>
        </div>
      `)}_renderEntityDisplaySettingsPanel(){return this._renderSettingsPanel("mdi:eye-off",this._t("settings.devices_page"),this._t("settings.devices_description"),fe`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.hide_unavailable_devices")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.hide_unavailable_entities_on_devices}
                @change=${this._toggleHideUnavailableEntities}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.hide_unavailable_devices_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.show_new_devices")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_recent_devices_panel}
                @change=${this._toggleRecentDevicesPanel}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.show_new_devices_description")}</p>
          </div>
          ${this._renderDeviceTypeVisibilitySettings()}
          ${this._renderHiddenDeviceVisibility()}
        </div>
      `)}_renderPermissionsSettingsPanel(){return this._renderSettingsPanel("mdi:shield-account",this._t("settings.user_permissions"),this._t("settings.permissions_description"),fe`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.restrict_ha_menu")}>
              <ha-switch
                .checked=${!0===this._config?.settings?.restrict_non_admin_ha_sidebar}
                @change=${this._toggleRestrictNonAdminHaSidebar}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.restrict_ha_menu_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.restrict_editing")}>
              <ha-switch
                .checked=${!0===this._config?.settings?.restrict_non_admin_dashboard_settings}
                @change=${this._toggleRestrictNonAdminDashboardSettings}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.restrict_editing_description")}</p>
          </div>
        </div>
      `)}_renderPersonsSettingsPanel(){return this._renderSettingsPanel("mdi:account-multiple",this._t("settings.people"),this._t("settings.people_page_description"),fe`
        <div class="persons-section">
          ${this._renderPersonsConfiguration()}
        </div>
      `)}_renderAreasSettingsPanel(){return this._renderSettingsPanel("mdi:floor-plan",this._t("settings.areas"),this._t("settings.areas_page_description"),fe`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.hide_unavailable_areas")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.hide_unavailable_entities}
                @change=${this._toggleHideUnavailableAreaEntities}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.hide_unavailable_areas_description")}</p>
          </div>
          ${this._renderAreasConfiguration()}
        </div>
      `)}_renderAreasConfiguration(){if(!this.hass||!this._config)return ye;const e=Object.values(this.hass.areas||{}),t=new Set(this._config.areas_display?.hidden||[]),i=Nt(this._config.areas_display),o=Ot(e,{...this._config.areas_display,hidden:[]},a(this.hass));return fe`
      <section class="area-order-settings" aria-labelledby="area-order-title">
        <div class="area-order-heading">
          <strong id="area-order-title">${this._t("settings.area_order_title")}</strong>
          <span>${this._t("settings.area_order_description")}</span>
        </div>
        <div class="area-order-modes" role="radiogroup" aria-label=${this._t("settings.area_order_title")}>
          ${[{mode:"home_assistant",icon:"mdi:home-assistant"},{mode:"custom",icon:"mdi:drag-vertical"},{mode:"alphabetical",icon:"mdi:sort-alphabetical-ascending"}].map(({mode:e,icon:t})=>fe`
            <button
              type="button"
              class="area-order-mode ${i===e?"selected":""}"
              role="radio"
              aria-checked=${i===e?"true":"false"}
              @click=${()=>this._setAreaSortMode(e)}
            >
              <ha-icon .icon=${t}></ha-icon>
              <span>
                <strong>${this._t(`settings.area_order_${e}`)}</strong>
                <small>${this._t(`settings.area_order_${e}_description`)}</small>
              </span>
            </button>
          `)}
        </div>
        ${"custom"===i?fe`
          <p class="area-order-hint">${this._t("settings.area_order_drag_hint")}</p>
        `:ye}
      </section>

      <div class="sortable-container ${"custom"===i?"is-custom-order":""} ${this._draggedAreaId?"dragging":""}">
        ${at(o,e=>e.area_id,(e,a)=>{const r=t.has(e.area_id),n=this._draggedAreaId===e.area_id,s=this._dragOverIndex===a&&this._draggedAreaId&&this._draggedAreaId!==e.area_id;return fe`
              <div
                class="sortable-item ${r?"hidden":""} ${n?"dragging":""} ${s?"drag-over":""}"
                data-area-id="${e.area_id}"
                data-index="${a}"
                .draggable=${"custom"===i}
                @dragstart=${t=>"custom"===i&&this._handleAreaDragStart(t,e.area_id)}
                @dragend=${this._handleAreaDragEnd}
                @dragover=${e=>"custom"===i&&this._handleAreaDragOver(e,a)}
                @dragleave=${this._handleAreaDragLeave}
                @drop=${e=>"custom"===i&&this._handleAreaDrop(e,a)}
              >
                <div class="area-item">
                  <div class="handle ${"custom"!==i?"disabled":""}" aria-hidden="true">
                    <ha-svg-icon .path=${A}></ha-svg-icon>
                  </div>
                  ${e.icon?fe`
                    <ha-icon
                      .icon=${e.icon}
                      class="area-icon"
                    ></ha-icon>
                  `:ye}
                  <span class="area-name clickable" @click=${()=>this._editArea(e.area_id)}>
                    ${e.name}
                    <ha-icon icon="mdi:chevron-right" class="chevron"></ha-icon>
                  </span>
                  <div class="area-actions">
                    ${"custom"===i?fe`
                      <ha-icon-button
                        .label=${this._t("settings.move_up")}
                        .path=${$}
                        .disabled=${0===a}
                        @click=${()=>this._moveArea(e.area_id,-1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t("settings.move_down")}
                        .path=${w}
                        .disabled=${a===o.length-1}
                        @click=${()=>this._moveArea(e.area_id,1)}
                      ></ha-icon-button>
                    `:ye}
                    <ha-icon-button
                      .label=${this._t(r?"common.show":"common.hide")}
                      .path=${r?E:z}
                      @click=${()=>this._toggleAreaVisibility(e.area_id)}
                    ></ha-icon-button>
                  </div>
                </div>
              </div>
            `})}
      </div>
    `}_renderAreaEditor(){if(!this.hass||!this._config||!this._area)return ye;const e=this.hass.areas[this._area];if(!e)return ye;const t=[],i=new Set;if(this._config.entities){const e=new Set;this._config.devices&&this._config.devices.forEach(t=>{t.area_id===this._area&&e.add(t.device_id)}),this._config.entities.forEach(a=>{(a.area_id===this._area||a.device_id&&e.has(a.device_id))&&(t.push({entity_id:a.entity_id}),i.add(a.entity_id))})}this.hass?.states&&Object.values(this.hass.states).forEach(e=>{if(!i.has(e.entity_id)){const i=this.hass?.entities?.[e.entity_id];i?.area_id===this._area&&t.push({entity_id:e.entity_id})}});const a=this._getAreaGroupedEntitiesWithoutFiltering(t,this.hass);return fe`
      <div class="editor-container">
        <div class="toolbar">
          <ha-icon-button
            .path=${k}
            .label=${this._t("strategy.back")}
            @click=${()=>{this._area=void 0}}
          ></ha-icon-button>
          <h2>${e.name}</h2>
        </div>

        <div class="area-help">
          <ha-svg-icon .path=${"M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z"} class="area-help-icon"></ha-svg-icon>
          <div class="area-help-text">
            <p>
              To show temperature and humidity sensors in the overview, link a sensor to this room in Home Assistant via
              <button class="link" @click=${this._editAreaRegistry}>${this._t("settings.edit_room")}</button>.
            </p>
            <p>
              The wattage badge automatically sums all power sensors (unit 'W') in this room that are visible (not hidden in the UI).
            </p>
          </div>
        </div>

        ${jt.map(e=>{const t=a[e]||[],i=this._config.areas_options?.[this._area]?.groups_options?.[e],o=new Set(i?.hidden||[]),r=i?.order||[],n=[...t].sort((e,t)=>{const i=r.indexOf(e),a=r.indexOf(t);if(-1!==i&&-1!==a)return i-a;if(-1!==i)return-1;if(-1!==a)return 1;const o=this.hass.states[e]?.attributes?.friendly_name||e,n=this.hass.states[t]?.attributes?.friendly_name||t;return o.localeCompare(n)});return 0===t.length?ye:fe`
            <ha-expansion-panel expanded outlined>
              <div slot="header">
                <ha-icon icon=${Tt[e]}></ha-icon>
                ${this._getGroupTitle(e)}
              </div>
              <div class="sortable-container ${this._draggedEntityGroup===e?"dragging":""}">
                ${at(n,e=>e,(t,i)=>{const a=this.hass.states[t],r=o.has(t),n=this._draggedEntityId===t&&this._draggedEntityGroup===e,s=this._dragOverEntityIndex===i&&this._draggedEntityGroup===e&&this._draggedEntityId&&this._draggedEntityId!==t;return fe`
                      <div
                        class="sortable-item ${r?"hidden":""} ${n?"dragging":""} ${s?"drag-over":""}"
                        data-entity-id="${t}"
                        data-index="${i}"
                        draggable="true"
                        @dragstart=${i=>this._handleEntityDragStart(i,t,e)}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${t=>this._handleEntityDragOver(t,e,i)}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${t=>this._handleEntityDrop(t,e,i)}
                      >
                        <div class="entity-item">
                          <div class="handle">
                            <ha-svg-icon .path=${A}></ha-svg-icon>
                          </div>
                          <ha-state-icon
                            .stateObj=${a}
                            class="entity-icon"
                          ></ha-state-icon>
                          <span class="entity-name">
                            ${a?.attributes?.friendly_name||t}
                          </span>
                          <ha-icon-button
                            .label=${r?"Show":"Hide"}
                            .path=${r?E:z}
                            @click=${()=>this._toggleEntityVisibility(t,e)}
                          ></ha-icon-button>
                        </div>
                      </div>
                    `})}
              </div>
            </ha-expansion-panel>
          `})}
      </div>
    `}_getHomeSectionsOrder(){return ii(this._config?.settings?.home_sections_order)}_getHiddenHomeSections(){return new Set(ai(this._config?.settings?.home_sections_hidden))}_getHiddenHomeInformationCards(){return new Set(oi(this._config?.settings?.home_information_cards_hidden))}_getHomeCameraSettings(){if(!this._config||!this.hass)return[];const e=Ot(this._config.areas||[],this._config.areas_display,a(this.hass)),t=new Map(e.map(e=>[e.area_id,e])),i=new Map(e.map((e,t)=>[e.area_id,t])),o=new Map((this._config.devices||[]).map(e=>[e.device_id,e.area_id||""])),r=new Map((this._config.entities||[]).map(e=>[e.entity_id,e])),n=[...new Set([...(this._config.entities||[]).map(e=>e.entity_id),...Object.keys(this.hass.states||{})].filter(e=>e.startsWith("camera.")))].flatMap(e=>{const i=this.hass.states[e],a=this.hass.entities?.[e],n=r.get(e);if(!i||a?.hidden_by||"diagnostic"===a?.entity_category||"config"===a?.entity_category)return[];const s=n?.device_id||a?.device_id||"",c=n?.area_id||a?.area_id||o.get(s)||"",d=t.get(c);return d?[{entityId:e,name:i.attributes?.friendly_name||a?.name||e,areaId:c,areaName:d.name,state:this.hass.formatEntityState(i)}]:[]});n.sort((e,t)=>(i.get(e.areaId)??Number.MAX_SAFE_INTEGER)-(i.get(t.areaId)??Number.MAX_SAFE_INTEGER)||e.name.localeCompare(t.name));const s=this._config.settings?.home_camera_order||[],c=new Map(s.map((e,t)=>[e,t]));return n.sort((e,t)=>{const i=c.get(e.entityId),a=c.get(t.entityId);return void 0!==i||void 0!==a?(i??Number.MAX_SAFE_INTEGER)-(a??Number.MAX_SAFE_INTEGER):0})}_setHomeCameraOrder(e){this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_camera_order:e}})}_moveHomeCamera(e,t){const i=this._getHomeCameraSettings().map(e=>e.entityId),a=i.indexOf(e),o=a+t;a<0||o<0||o>=i.length||([i[a],i[o]]=[i[o],i[a]],this._setHomeCameraOrder(i))}_toggleHomeCamera(e){if(!this._config)return;const t=new Set(this._config.settings?.home_cameras_hidden||[]);t.has(e)?t.delete(e):t.add(e),this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_cameras_hidden:[...t]}})}_setHomeSectionsOrder(e){if(!this._config)return;const t={...this._config,settings:{...this._config.settings,home_sections_order:ii(e)}};this._fireConfigChanged(t)}_toggleHomeSectionEnabled(e){if(!this._config)return;const t=new Set(this._getHiddenHomeSections());t.has(e)?t.delete(e):t.add(e);const i={...this._config,settings:{...this._config.settings,home_sections_hidden:ai([...t])}};this._fireConfigChanged(i)}_moveHomeSection(e,t){const i=this._getHomeSectionsOrder(),a=i.indexOf(e),o=a+t;if(a<0||o<0||o>=i.length)return;const r=[...i];[r[a],r[o]]=[r[o],r[a]],this._setHomeSectionsOrder(r)}_toggleHomeInformationCardEnabled(e){if(!this._config)return;const t=new Set(this._getHiddenHomeInformationCards());t.has(e)?t.delete(e):t.add(e);const i={...this._config,settings:{...this._config.settings,home_information_cards_hidden:oi([...t])}};this._fireConfigChanged(i)}_renderHomeSectionOrder(){const e=this._getHomeSectionsOrder(),t=this._getHiddenHomeSections();return fe`
      <div class="home-layout-section">
        <div class="home-section-list ${this._draggedHomeSection?"dragging":""}">
          ${at(e,e=>e,(i,a)=>{const o=Jt[i],r=!t.has(i),n=this._draggedHomeSection===i,s=this._dragOverHomeSectionIndex===a&&this._draggedHomeSection&&this._draggedHomeSection!==i;return fe`
                <div
                  class="home-section-item ${r?"":"disabled"} ${n?"dragging":""} ${s?"drag-over":""}"
                  draggable="true"
                  data-section=${i}
                  data-index=${a}
                  @dragstart=${e=>this._handleHomeSectionDragStart(e,i)}
                  @dragend=${this._handleHomeSectionDragEnd}
                  @dragover=${e=>this._handleHomeSectionDragOver(e,a)}
                  @dragleave=${this._handleHomeSectionDragLeave}
                  @drop=${e=>this._handleHomeSectionDrop(e,a)}
                >
                  <div class="home-section-handle">
                    <ha-svg-icon .path=${A}></ha-svg-icon>
                  </div>
                  <div class="home-section-icon">
                    <ha-icon icon=${o.icon}></ha-icon>
                  </div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._t(o.labelKey)}</div>
                    <div class="home-section-description">${this._t(o.descriptionKey)}</div>
                  </div>
                  <div class="home-section-actions">
                    <button
                      class="home-section-toggle ${r?"enabled":""}"
                      type="button"
                      title=${r?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-label=${r?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-pressed=${r?"true":"false"}
                      @click=${()=>this._toggleHomeSectionEnabled(i)}
                    >
                      <ha-icon icon=${r?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                    </button>
                    <ha-icon-button
                      .label=${this._t("settings.move_up")}
                      .path=${$}
                      .disabled=${0===a}
                      @click=${()=>this._moveHomeSection(i,-1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t("settings.move_down")}
                      .path=${w}
                      .disabled=${a===e.length-1}
                      @click=${()=>this._moveHomeSection(i,1)}
                    ></ha-icon-button>
                  </div>
                </div>
              `})}
        </div>
        <button class="home-layout-reset" type="button" @click=${this._resetHomeSectionsOrder}>
          ${this._t("settings.reset_layout")}
        </button>
      </div>
    `}_renderHomeInformationCardSettings(){const e=this._getHiddenHomeInformationCards(),t=ei.filter(t=>!e.has(t)).length;return fe`
      <div class="home-info-card-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t("settings.house_information_cards")}</h4>
            <p>${this._t("settings.house_information_cards_description")}</p>
          </div>
          <span>${this._t("settings.visible_count",{visible:t,total:ei.length})}</span>
        </div>
        <div class="home-info-card-list">
          ${ei.map(t=>{const i=ti[t],a=!e.has(t);return fe`
              <div class="home-info-card-item ${a?"enabled":"disabled"}">
                <div class="home-section-icon">
                  <ha-icon icon=${i.icon}></ha-icon>
                </div>
                <div class="home-section-copy">
                  <div class="home-section-title">${this._t(i.labelKey)}</div>
                  <div class="home-section-description">${this._t(i.descriptionKey)}</div>
                </div>
                <ha-switch
                  .checked=${a}
                  @change=${()=>this._toggleHomeInformationCardEnabled(t)}
                ></ha-switch>
              </div>
            `})}
        </div>
      </div>
    `}_renderHomeCameraSettings(){const e=this._getHomeCameraSettings(),t=new Set(this._config?.settings?.home_cameras_hidden||[]),i=e.filter(e=>!t.has(e.entityId)).length;return fe`
      <div class="home-info-card-section home-camera-settings-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t("settings.home_camera_cards")}</h4>
            <p>${this._t("settings.home_camera_cards_description")}</p>
          </div>
          ${e.length?fe`<span>${this._t("settings.visible_count",{visible:i,total:e.length})}</span>`:ye}
        </div>
        ${e.length?fe`
          <div class="home-camera-settings-list ${this._draggedHomeCamera?"dragging":""}">
            ${at(e,e=>e.entityId,(i,a)=>{const o=!t.has(i.entityId),r=["unavailable","unknown"].includes(String(this.hass?.states[i.entityId]?.state||"").toLowerCase()),n=this._draggedHomeCamera===i.entityId,s=this._dragOverHomeCameraIndex===a&&!1===n&&Boolean(this._draggedHomeCamera);return fe`
                  <div
                    class="home-section-item home-camera-settings-item ${o?"":"disabled"} ${n?"dragging":""} ${s?"drag-over":""}"
                    draggable="true"
                    @dragstart=${e=>this._handleHomeCameraDragStart(e,i.entityId)}
                    @dragend=${this._handleHomeCameraDragEnd}
                    @dragover=${e=>this._handleHomeCameraDragOver(e,a)}
                    @dragleave=${this._handleHomeCameraDragLeave}
                    @drop=${e=>this._handleHomeCameraDrop(e,a)}
                  >
                    <div class="home-section-handle"><ha-svg-icon .path=${A}></ha-svg-icon></div>
                    <div class="home-section-icon"><ha-icon icon="mdi:cctv"></ha-icon></div>
                    <div class="home-section-copy">
                      <div class="home-section-title">${i.name}</div>
                      <div class="home-section-description">
                        ${i.areaName} · ${r?this._t("common.unavailable"):i.state}
                      </div>
                    </div>
                    <div class="home-section-actions">
                      <button
                        class="home-section-toggle ${o?"enabled":""}"
                        type="button"
                        title=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                        aria-label=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                        aria-pressed=${o?"true":"false"}
                        @click=${()=>this._toggleHomeCamera(i.entityId)}
                      >
                        <ha-icon icon=${o?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                      </button>
                      <ha-icon-button
                        .label=${this._t("settings.move_up")}
                        .path=${$}
                        .disabled=${0===a}
                        @click=${()=>this._moveHomeCamera(i.entityId,-1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t("settings.move_down")}
                        .path=${w}
                        .disabled=${a===e.length-1}
                        @click=${()=>this._moveHomeCamera(i.entityId,1)}
                      ></ha-icon-button>
                    </div>
                  </div>
                `})}
          </div>
          <button class="home-layout-reset" type="button" @click=${this._resetHomeCameraSettings}>
            ${this._t("settings.reset_camera_cards")}
          </button>
        `:fe`<div class="home-camera-settings-empty">${this._t("settings.home_camera_cards_empty")}</div>`}
      </div>
    `}_renderDeviceTypeVisibilitySettings(){const e=this._getDeviceTypeOptions();if(!e.length)return ye;const t=this._getHiddenDeviceTypes(),i=e.filter(e=>!t.has(e.key)).length;return fe`
      <div class="device-types-visibility">
        <div class="device-types-header">
          <div>
            <h4>${this._t("settings.devices_page_types")}</h4>
            <p>${this._t("settings.devices_page_types_description")}</p>
          </div>
          <span>${this._t("settings.visible_count",{visible:i,total:e.length})}</span>
        </div>
        <div class="device-types-grid">
          ${e.map(e=>{const i=!t.has(e.key);return fe`
              <div
                class="device-type-option ${i?"enabled":"disabled"}"
                style=${`--device-type-color: ${e.color};`}
              >
                <div class="device-type-icon">
                  <ha-icon icon=${e.icon}></ha-icon>
                </div>
                <div class="device-type-copy">
                  <div class="device-type-name">${e.label}</div>
                  <div class="device-type-count">${this._tp("common.entity",e.count)}</div>
                </div>
                <ha-switch
                  .checked=${i}
                  @change=${t=>this._setDeviceTypeVisible(e.key,t.target.checked)}
                ></ha-switch>
              </div>
            `})}
        </div>
      </div>
    `}_renderHiddenDeviceVisibility(){const e=this._getDeviceVisibilityGroups(),t=this._getHiddenDeviceIds(),i=this._uniqueDeviceIdsFromGroups(e),a=i.filter(e=>t.has(e)).length;return 0===e.length?fe`
        <div class="device-admission-section">
          <div class="device-types-header">
            <div>
              <h4>${this._t("settings.hidden_devices")}</h4>
              <p>${this._t("settings.no_hidden_devices")}</p>
            </div>
          </div>
        </div>
      `:fe`
      <div class="device-admission-section">
        <div class="device-types-header">
          <div>
            <h4>${this._t("settings.hidden_devices")}</h4>
            <p>${this._t("settings.hidden_devices_description")}</p>
          </div>
          <span>${a}/${i.length} hidden</span>
        </div>

        <div class="device-admission-global-actions">
          <button
            type="button"
            ?disabled=${0===a}
            @click=${()=>this._setDevicesHidden(i,!1)}
          >
            <ha-icon icon="mdi:eye-outline"></ha-icon>
            Show all devices
          </button>
          <button
            type="button"
            ?disabled=${0===i.length||a>=i.length}
            @click=${()=>this._setDevicesHidden(i,!0)}
          >
            <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            Hide all devices
          </button>
        </div>

        <div class="device-admission-groups">
          ${at(e,e=>e.key,(e,i)=>{const a=this._uniqueDeviceIds(e.devices),o=a.filter(e=>t.has(e)).length;return fe`
                <ha-expansion-panel outlined ?expanded=${0===i}>
                  <div slot="header" class="device-admission-panel-header" style=${`--device-type-color: ${e.color};`}>
                    <span class="device-type-icon small">
                      <ha-icon icon=${e.icon}></ha-icon>
                    </span>
                    <span>${e.label}</span>
                    <small>${a.length-o}/${a.length} visible</small>
                  </div>

                  <div class="device-admission-panel">
                    <div class="device-admission-group-actions">
                      <button
                        type="button"
                        ?disabled=${0===o}
                        @click=${()=>this._setDevicesHidden(a,!1)}
                      >
                        Show type
                      </button>
                      <button
                        type="button"
                        ?disabled=${o===a.length}
                        @click=${()=>this._setDevicesHidden(a,!0)}
                      >
                        Hide type
                      </button>
                    </div>

                    ${at(e.areas,t=>`${e.key}-${t.areaId}`,i=>{const a=this._uniqueDeviceIds(i.devices),o=a.filter(e=>t.has(e)).length;return fe`
                          <section class="device-admission-area">
                            <div class="device-admission-area-header">
                              <div>
                                <strong>${i.areaName}</strong>
                                <span>${a.length-o}/${a.length} visible</span>
                              </div>
                              <div class="device-admission-area-actions">
                                <button
                                  type="button"
                                  ?disabled=${0===o}
                                  @click=${()=>this._setDevicesHidden(a,!1)}
                                >
                                  Show area
                                </button>
                                <button
                                  type="button"
                                  ?disabled=${o===a.length}
                                  @click=${()=>this._setDevicesHidden(a,!0)}
                                >
                                  Hide area
                                </button>
                              </div>
                            </div>
                            <div class="device-admission-device-list">
                              ${at(i.devices,t=>`${e.key}-${t.deviceId}`,t=>this._renderDeviceVisibilityRow(t,e))}
                            </div>
                          </section>
                        `})}
                  </div>
                </ha-expansion-panel>
              `})}
        </div>
      </div>
    `}_renderDeviceVisibilityRow(e,t){const i=!e.hidden;return fe`
      <div
        class="device-admission-device ${i?"visible":"hidden"}"
        style=${`--device-type-color: ${t.color};`}
      >
        <div class="device-type-icon">
          <ha-icon icon=${t.icon}></ha-icon>
        </div>
        <div class="device-admission-copy">
          <div class="device-type-name">${e.name}</div>
          <div class="device-type-count">
            ${1===e.entityCount?"1 entity":`${e.entityCount} entities`} · ${i?"Visible in DD":"Hidden in DD"}
          </div>
        </div>
        <ha-switch
          .checked=${i}
          @change=${t=>this._setDeviceHidden(e.deviceId,!t.target.checked)}
        ></ha-switch>
      </div>
    `}_getDeviceVisibilityGroups(){if(!this.hass||!this._config)return[];const e=this._getAllDevicesById(),t=this._getHiddenDeviceIds(),i=new Intl.Collator(a(this.hass),{numeric:!0,sensitivity:"base"}),o=Ot(this._config.areas||[],{...this._config.areas_display,hidden:[]},a(this.hass)),r=new Map(o.map((e,t)=>[e.area_id,t])),n=(e,t)=>(r.get(e.areaId)??Number.MAX_SAFE_INTEGER)-(r.get(t.areaId)??Number.MAX_SAFE_INTEGER)||i.compare(e.areaName,t.areaName),s=new Map;(this._config.entities||[]).forEach(e=>{s.set(e.entity_id,{entityId:e.entity_id,deviceId:e.device_id,areaId:e.area_id})}),Object.values(this.hass.entities||{}).forEach(e=>{s.set(e.entity_id,{entityId:e.entity_id,deviceId:e.device_id,areaId:e.area_id})});const c=new Map;return s.forEach(t=>{const i=t.deviceId;if(!i||!e.has(i))return;if(!this._isDeviceManagedEntity(t.entityId))return;const a=this._deviceTypeKeyForEntityId(t.entityId);if(!a||"person"===a)return;let o=c.get(a);o||(o=new Map,c.set(a,o));let r=o.get(i);r||(r=new Set,o.set(i,r)),r.add(t.entityId)}),[...c.entries()].map(([a,o])=>{const r=[...o.entries()].map(([i,a])=>{const o=e.get(i),r=this._deviceVisibilityArea(o,[...a]);if(r)return{deviceId:i,name:o.name||i,areaId:r.areaId,areaName:r.areaName,entityCount:a.size,hidden:t.has(i)}}).filter(e=>Boolean(e)).sort((e,t)=>n(e,t)||i.compare(e.name,t.name)),s=new Map;r.forEach(e=>{let t=s.get(e.areaId);t||(t={areaId:e.areaId,areaName:e.areaName,devices:[]},s.set(e.areaId,t)),t.devices.push(e)});const c=[...s.values()].sort(n);return{key:a,label:this._deviceTypeName(a),icon:this._deviceTypeIcon(a),color:this._deviceTypeColor(a),devices:r,areas:c}}).filter(e=>e.devices.length>0).sort((e,t)=>i.compare(e.label,t.label))}_getAllDevicesById(){const e=new Map;return(this._config?.devices||[]).forEach(t=>{e.set(t.device_id,t)}),Object.values(this.hass?.devices||{}).forEach(t=>{t?.id&&!e.has(t.id)&&e.set(t.id,{device_id:t.id,name:t.name_by_user||t.name||t.id,area_id:t.area_id,created_at:t.created_at})}),e}_isDeviceManagedEntity(e){const t=this.hass?.entities?.[e];return!t?.hidden_by&&"diagnostic"!==t?.entity_category&&"config"!==t?.entity_category&&!!e.includes(".")}_deviceVisibilityArea(e,t){const i=this.hass?.devices?.[e.device_id],a=new Set(this._config?.areas_display?.hidden||[]),o=e=>{if(!e||a.has(e))return;const t=this._config?.areas?.find(t=>t.area_id===e);return t?{areaId:t.area_id,areaName:t.name}:void 0},r=o(e.area_id||i?.area_id);if(r)return r;for(const e of t){const t=this._config?.entities?.find(t=>t.entity_id===e),i=o(t?.area_id||this.hass?.entities?.[e]?.area_id);if(i)return i}}_getHiddenDeviceIds(){return new Set((this._config?.device_admission?.hidden_devices||[]).filter(e=>"string"==typeof e&&e.length>0))}_setDeviceHidden(e,t){this._setDevicesHidden([e],t)}_setDevicesHidden(e,t){if(!this._config)return;const i=this._getHiddenDeviceIds();e.forEach(e=>{e&&(t?i.add(e):i.delete(e))});const a={...this._config,device_admission:{...this._config.device_admission,hidden_devices:[...i].sort()}};this._fireConfigChanged(a)}_uniqueDeviceIds(e){return[...new Set(e.map(e=>e.deviceId))]}_uniqueDeviceIdsFromGroups(e){return[...new Set(e.flatMap(e=>e.devices.map(e=>e.deviceId)))]}_getDeviceTypeOptions(){if(!this.hass||!this._config)return[];const e=new Map,t=new Set,i=new Set(this._config.areas_display?.hidden||[]),a=new Map((this._config.devices||[]).map(e=>[e.device_id,e.area_id])),o=(o,r,n)=>{if(!o||t.has(o))return;const s=this.hass?.entities?.[o];if(s?.hidden_by||"diagnostic"===s?.entity_category||"config"===s?.entity_category)return;const c=r||(n?a.get(n):void 0)||s?.area_id;if(!c||i.has(c))return;if(this._isEntityHiddenInAreaOptions(c,o))return;const d=this.hass?.states?.[o];if(!1!==this._config?.settings?.hide_unavailable_entities_on_devices&&(!d||"unavailable"===d.state||"unknown"===d.state))return;const l=this._deviceTypeKeyForEntityId(o);l&&(t.add(o),e.set(l,(e.get(l)||0)+1))};(this._config.entities||[]).forEach(e=>o(e.entity_id,e.area_id,e.device_id)),Object.values(this.hass.states||{}).forEach(e=>{o(e.entity_id,e.attributes?.area_id,this.hass?.entities?.[e.entity_id]?.device_id)});const r=new Set(this._config.settings?.hidden_persons||[]);return Object.values(this.hass.states||{}).forEach(i=>{const a=i.entity_id;!a?.startsWith("person.")||t.has(a)||r.has(a)||this.hass?.entities?.[a]?.hidden_by||(t.add(a),e.set("person",(e.get("person")||0)+1))}),[...e.entries()].map(([e,t])=>({key:e,label:this._deviceTypeName(e),icon:this._deviceTypeIcon(e),color:this._deviceTypeColor(e),count:t})).sort((e,t)=>e.label.localeCompare(t.label))}_isEntityHiddenInAreaOptions(e,t){const i=this._config?.areas_options?.[e];return!!i?.groups_options&&Object.values(i.groups_options).some(e=>e.hidden?.includes(t))}_deviceTypeKeyForEntityId(e){const t=e.split(".")[0];if(t){if("binary_sensor"===t){const t=this.hass?.states?.[e]?.attributes?.device_class;return t?`binary_sensor.${t}`:"binary_sensor"}return t}}_deviceTypeName(e){return e.startsWith("binary_sensor.")?$t(this.hass,e.slice(14)):kt(this.hass,e)}_deviceTypeIcon(e){return"person"===e?"mdi:account-group":e.startsWith("binary_sensor.")?Zt("binary_sensor",e.slice(14)):Kt(e)}_deviceTypeColor(e){return e.startsWith("binary_sensor.")?Yt("binary_sensor",e.slice(14)):Yt(e)}_getHiddenDeviceTypes(){return new Set((this._config?.settings?.hidden_device_types||[]).filter(e=>"string"==typeof e&&e.length>0))}_setDeviceTypeVisible(e,t){if(!this._config)return;const i=this._getHiddenDeviceTypes();t?i.delete(e):i.add(e);const a={...this._config,settings:{...this._config.settings,hidden_device_types:[...i].sort()}};this._fireConfigChanged(a)}_getGroupTitle(e){return{lights:"Lighting",climate:"Climate",media_players:"Media Players",covers:"Covers",security:"Security",motion:"Motion",actions:"Actions",others:"Sensors"}[e]||e}_getAreaGroupedEntitiesWithoutFiltering(e,t){const i={lights:[],climate:[],covers:[],media_players:[],security:[],motion:[],actions:[],others:[]};return e.forEach(e=>{const a=e.entity_id,o=a.split(".")[0],r=t.states[a];if(!r)return;const n=t.entities?.[a];n?.hidden_by||"diagnostic"===n?.entity_category||"config"===n?.entity_category||("light"===o?i.lights.push(a):"climate"===o||"humidifier"===o||"water_heater"===o||"fan"===o?i.climate.push(a):"cover"===o||"binary_sensor"===o&&r?.attributes?.device_class&&["door","garage_door","window"].includes(r.attributes.device_class)?i.covers.push(a):"media_player"===o?i.media_players.push(a):"alarm_control_panel"===o||"lock"===o||"camera"===o?i.security.push(a):"binary_sensor"===o&&r?.attributes?.device_class&&["motion","occupancy","presence"].includes(r.attributes.device_class)?i.motion.push(a):"script"===o||"scene"===o||"automation"===o||"todo"===o?i.actions.push(a):"switch"!==o&&"button"!==o&&"input_boolean"!==o&&"vacuum"!==o&&"lawn_mower"!==o&&"valve"!==o&&"select"!==o&&"number"!==o&&"input_select"!==o&&"input_number"!==o&&"counter"!==o&&"timer"!==o&&"sensor"!==o||i.others.push(a))}),i}_handleHomeSectionDragStart(e,t){this._draggedHomeSection=t,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleHomeSectionDragOver(e,t){e.preventDefault(),this._dragOverHomeSectionIndex=t,e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_handleHomeSectionDrop(e,t){e.preventDefault();const i=this._draggedHomeSection;if(!i)return;const a=this._getHomeSectionsOrder(),o=a.indexOf(i);if(-1===o||o===t)return void this._handleHomeSectionDragEnd();const r=[...a],[n]=r.splice(o,1);r.splice(t,0,n),this._setHomeSectionsOrder(r),this._handleHomeSectionDragEnd()}_handleHomeCameraDragStart(e,t){this._draggedHomeCamera=t,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleHomeCameraDragOver(e,t){e.preventDefault(),this._dragOverHomeCameraIndex=t,e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_handleHomeCameraDrop(e,t){e.preventDefault();const i=this._draggedHomeCamera;if(!i)return;const a=this._getHomeCameraSettings().map(e=>e.entityId),o=a.indexOf(i);if(-1===o||o===t)return void this._handleHomeCameraDragEnd();const[r]=a.splice(o,1);a.splice(t,0,r),this._setHomeCameraOrder(a),this._handleHomeCameraDragEnd()}_setAreaSortMode(e){if(!this._config||!this.hass)return;const t=this._config.areas_display?.order||[],i=Object.values(this.hass.areas||{}).map(e=>e.area_id),a="custom"===e&&0===t.length?i:t;this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,sort_mode:e,order:a}})}_handleAreaDragStart(e,t){this._draggedAreaId=t,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleAreaDragEnd(){this._draggedAreaId=void 0,this._dragOverIndex=void 0}_handleAreaDragOver(e,t){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOverIndex=t}_handleAreaDragLeave(e){e.target.classList.contains("sortable-item")&&(this._dragOverIndex=void 0)}_handleAreaDrop(e,t){if(e.preventDefault(),!this._draggedAreaId||!this._config||"custom"!==Nt(this._config.areas_display))return;const i=Ot(Object.values(this.hass.areas||{}),{...this._config.areas_display,hidden:[]},a(this.hass)),o=i.findIndex(e=>e.area_id===this._draggedAreaId);if(-1===o||o===t)return this._draggedAreaId=void 0,void(this._dragOverIndex=void 0);const r=[...i],[n]=r.splice(o,1);if(!n)return;r.splice(t,0,n);const s=r.map(e=>e.area_id),c={...this._config,areas_display:{...this._config.areas_display,order:s}};this._fireConfigChanged(c),this._draggedAreaId=void 0,this._dragOverIndex=void 0}_moveArea(e,t){if(!this._config||!this.hass||"custom"!==Nt(this._config.areas_display))return;const i=Ot(Object.values(this.hass.areas||{}),{...this._config.areas_display,hidden:[]},a(this.hass)),o=i.findIndex(t=>t.area_id===e),r=o+t;if(o<0||r<0||r>=i.length)return;const n=[...i],[s]=n.splice(o,1);s&&(n.splice(r,0,s),this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,order:n.map(e=>e.area_id)}}))}_handleEntityDragStart(e,t,i){this._draggedEntityId=t,this._draggedEntityGroup=i,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleEntityDragEnd(){this._draggedEntityId=void 0,this._draggedEntityGroup=void 0,this._dragOverEntityIndex=void 0}_handleEntityDragOver(e,t,i){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._draggedEntityGroup===t&&(this._dragOverEntityIndex=i)}_handleEntityDragLeave(e){e.target.classList.contains("sortable-item")&&(this._dragOverEntityIndex=void 0)}_handleEntityDrop(e,t,i){if(e.preventDefault(),!this._draggedEntityId||!this._config||!this._area||this._draggedEntityGroup!==t)return;const a=[],o=new Set;if(this._config.entities){const e=new Set;this._config.devices&&this._config.devices.forEach(t=>{t.area_id===this._area&&e.add(t.device_id)}),this._config.entities.forEach(t=>{(t.area_id===this._area||t.device_id&&e.has(t.device_id))&&(a.push({entity_id:t.entity_id}),o.add(t.entity_id))})}const r=this._getAreaGroupedEntitiesWithoutFiltering(a,this.hass)[t]||[],n=this._config.areas_options?.[this._area]?.groups_options?.[t],s=n?.order||[],c=[...r].sort((e,t)=>{const i=s.indexOf(e),a=s.indexOf(t);if(-1!==i&&-1!==a)return i-a;if(-1!==i)return-1;if(-1!==a)return 1;const o=this.hass.states[e]?.attributes?.friendly_name||e,r=this.hass.states[t]?.attributes?.friendly_name||t;return o.localeCompare(r)}),d=c.findIndex(e=>e===this._draggedEntityId);if(-1===d||d===i)return this._draggedEntityId=void 0,this._draggedEntityGroup=void 0,void(this._dragOverEntityIndex=void 0);const l=[...c],[p]=l.splice(d,1);if(!p)return;l.splice(i,0,p);const h=l,m={...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],groups_options:{...this._config.areas_options?.[this._area]?.groups_options,[t]:{...this._config.areas_options?.[this._area]?.groups_options?.[t],order:h}}}}};this._fireConfigChanged(m),this._draggedEntityId=void 0,this._draggedEntityGroup=void 0,this._dragOverEntityIndex=void 0}_toggleAreaVisibility(e){const t=[...this._config.areas_display?.hidden||[]],i=t.indexOf(e);-1===i?t.push(e):t.splice(i,1);const a={...this._config,areas_display:{...this._config.areas_display,hidden:t}};this._fireConfigChanged(a)}_toggleEntityVisibility(e,t){const i=[...this._config.areas_options?.[this._area]?.groups_options?.[t]?.hidden||[]],a=i.indexOf(e);-1===a?i.push(e):i.splice(a,1);const o={...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],groups_options:{...this._config.areas_options?.[this._area]?.groups_options,[t]:{...this._config.areas_options?.[this._area]?.groups_options?.[t],hidden:i}}}}};this._fireConfigChanged(o)}_editArea(e){this._area=e}_addFavoriteEntity(){this._showEntityPicker=!0,this._entitySearchFilter=""}_addWeatherEntity(){this._showWeatherPicker=!0,this._weatherSearchFilter=""}_addAlarmEntity(){this._showAlarmPicker=!0,this._alarmSearchFilter=""}_renderSelectedWeatherEntity(){const e=this._config?.settings?.weather_entity_id;if(!e)return fe`
        <div class="no-weather">
          <p>${this._t("settings.no_weather_fallback")}</p>
        </div>
      `;const t=this.hass?.states[e];return fe`
      <div class="selected-weather-entity" data-entity-id="${e}">
        <ha-state-icon
          .stateObj=${t}
          class="entity-icon"
        ></ha-state-icon>
        <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
        <button
          class="remove-button"
          title=${this._t("common.remove")}
          @click=${()=>this._removeWeatherEntity()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    `}_renderSelectedAlarmEntity(){const e=this._config?.settings?.alarm_entity_id;if(!e)return fe`
        <div class="no-alarm">
          <p>${this._t("settings.no_alarm")}</p>
        </div>
      `;const t=this.hass?.states[e];return fe`
      <div class="selected-alarm-entity" data-entity-id="${e}">
        <ha-state-icon
          .stateObj=${t}
          class="entity-icon"
        ></ha-state-icon>
        <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
        <button
          class="remove-button"
          title=${this._t("common.remove")}
          @click=${()=>this._removeAlarmEntity()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    `}_renderSelectedEntities(){const e=this._config?.favorites||[];return 0===e.length?fe`
        <div class="no-favorites">
          <p>${this._t("favorites.empty")}</p>
        </div>
      `:fe`
      <div class="selected-entities">
        ${at(e,e=>e,e=>{const t=this.hass?.states[e];return fe`
              <div class="selected-entity" data-entity-id="${e}">
                <ha-state-icon
                  .stateObj=${t}
                  class="entity-icon"
                ></ha-state-icon>
                <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                <button
                  class="remove-button"
                  title=${this._t("common.remove")}
                  @click=${()=>this._removeFavoriteEntity(e)}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>
            `})}
      </div>
    `}_renderWeatherPicker(){const e=Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("weather.")&&"unavailable"!==this.hass?.states[e]?.state).filter(e=>{if(!this._weatherSearchFilter)return!0;const t=this.hass?.states[e];return(t?.attributes?.friendly_name||e).toLowerCase().includes(this._weatherSearchFilter.toLowerCase())||e.toLowerCase().includes(this._weatherSearchFilter.toLowerCase())});return fe`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_weather_title")}</h4>
            <button
              class="close-button"
              title=${this._t("common.close")}
              @click=${()=>this._showWeatherPicker=!1}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <ha-textfield
              .label=${this._t("settings.search_weather")}
              .value=${this._weatherSearchFilter}
              @input=${e=>this._weatherSearchFilter=e.target.value}
            ></ha-textfield>
          </div>

          <div class="entity-list">
            ${at(e.slice(0,20),e=>e,e=>{const t=this.hass?.states[e];return fe`
                  <div class="entity-option" @click=${()=>this._selectWeatherEntity(e)}>
                    <ha-state-icon
                      .stateObj=${t}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                    <span class="entity-id">${e}</span>
                  </div>
                `})}
          </div>
        </div>
      </div>
    `}_renderAlarmPicker(){const e=Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("alarm_control_panel.")&&!this.hass?.entities?.[e]?.hidden_by).filter(e=>{if(!this._alarmSearchFilter)return!0;const t=this.hass?.states[e];return(t?.attributes?.friendly_name||e).toLowerCase().includes(this._alarmSearchFilter.toLowerCase())||e.toLowerCase().includes(this._alarmSearchFilter.toLowerCase())});return fe`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_alarm_title")}</h4>
            <button
              class="close-button"
              title=${this._t("common.close")}
              @click=${()=>this._showAlarmPicker=!1}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <ha-textfield
              .label=${this._t("settings.search_alarm")}
              .value=${this._alarmSearchFilter}
              @input=${e=>this._alarmSearchFilter=e.target.value}
            ></ha-textfield>
          </div>

          <div class="entity-list">
            ${at(e.slice(0,20),e=>e,e=>{const t=this.hass?.states[e];return fe`
                  <div class="entity-option" @click=${()=>this._selectAlarmEntity(e)}>
                    <ha-state-icon
                      .stateObj=${t}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                    <span class="entity-id">${e}</span>
                  </div>
                `})}
          </div>
        </div>
      </div>
    `}_renderEntityPicker(){const e=Object.keys(this.hass?.states||{}).filter(e=>{if(!this._entitySearchFilter)return!0;const t=this.hass?.states[e];return(t?.attributes?.friendly_name||e).toLowerCase().includes(this._entitySearchFilter.toLowerCase())||e.toLowerCase().includes(this._entitySearchFilter.toLowerCase())}),t=this._config?.favorites||[],i=e.filter(e=>!t.includes(e));return fe`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_entity_title")}</h4>
            <button
              class="close-button"
              title=${this._t("common.close")}
              @click=${()=>this._showEntityPicker=!1}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <ha-textfield
              .label=${this._t("settings.search")}
              .value=${this._entitySearchFilter}
              @input=${e=>this._entitySearchFilter=e.target.value}
            ></ha-textfield>
          </div>

          <div class="entity-list">
            ${at(i.slice(0,50),e=>e,e=>{const t=this.hass?.states[e];return fe`
                  <div class="entity-option" @click=${()=>this._selectEntity(e)}>
                    <ha-state-icon
                      .stateObj=${t}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                    <span class="entity-id">${e}</span>
                  </div>
                `})}
          </div>
        </div>
      </div>
    `}_selectWeatherEntity(e){const t={...this._config,settings:{...this._config.settings,weather_entity_id:e}};this._fireConfigChanged(t),this._showWeatherPicker=!1}_selectAlarmEntity(e){const t={...this._config,settings:{...this._config.settings,alarm_entity_id:e}};this._fireConfigChanged(t),this._showAlarmPicker=!1}_removeWeatherEntity(){const e={...this._config,settings:{...this._config.settings,weather_entity_id:void 0}};this._fireConfigChanged(e)}_removeAlarmEntity(){const e={...this._config,settings:{...this._config.settings,alarm_entity_id:void 0}};this._fireConfigChanged(e)}_toggleTimeDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_time:t}};this._fireConfigChanged(i)}_toggleWeatherDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_weather:t}};this._fireConfigChanged(i)}_toggleNotificationsDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_notifications:t}};this._fireConfigChanged(i)}_toggleSuggestedFavorites(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_suggested_favorites:t}};this._fireConfigChanged(i)}_toggleHideUnavailableEntities(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,hide_unavailable_entities_on_devices:t}};this._fireConfigChanged(i)}_toggleHideUnavailableAreaEntities(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,hide_unavailable_entities:t}};this._fireConfigChanged(i)}_toggleRecentDevicesPanel(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_recent_devices_panel:t}};this._fireConfigChanged(i)}_toggleRestrictNonAdminHaSidebar(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,restrict_non_admin_ha_sidebar:t}};this._fireConfigChanged(i)}_toggleRestrictNonAdminDashboardSettings(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,restrict_non_admin_dashboard_settings:t}};this._fireConfigChanged(i)}_selectEntity(e){const t=[...this._config?.favorites||[]];if(!t.includes(e)){t.push(e);const i={...this._config,favorites:t};this._fireConfigChanged(i)}this._showEntityPicker=!1}_removeFavoriteEntity(e){const t=[...this._config?.favorites||[]],i=t.indexOf(e);if(i>-1){t.splice(i,1);const e={...this._config,favorites:t};this._fireConfigChanged(e)}}_renderPersonsConfiguration(){if(!this.hass?.states)return fe`<p>${this._t("settings.no_persons")}</p>`;const e=Object.keys(this.hass.states).filter(e=>e.startsWith("person.")).map(e=>{const t=this.hass.states[e];return{entity_id:e,state:t,friendly_name:t?.attributes?.friendly_name||e}}).sort((e,t)=>e.friendly_name.localeCompare(t.friendly_name));if(0===e.length)return fe`
        <div class="no-persons">
          <p>${this._t("settings.no_person_entities")}</p>
          <p style="font-size: 12px; color: var(--secondary-text-color);">
            Add person entities to see them here.
          </p>
        </div>
      `;const t=new Set(this._config?.settings?.hidden_persons||[]);return fe`
      <div class="persons-list">
        ${at(e,e=>e.entity_id,e=>{const i=t.has(e.entity_id);return fe`
              <div class="person-item ${i?"hidden":""}">
                <ha-state-icon
                  .stateObj=${e.state}
                  class="person-icon"
                ></ha-state-icon>
                <span class="person-name">${e.friendly_name}</span>
                <span class="person-state ${"home"===e.state?.state?"home":"away"}">
                  ${"home"===e.state?.state?this._t("person.home"):this._t("person.away")}
                </span>
                <ha-icon-button
                  .label=${i?"Show":"Hide"}
                  .path=${i?E:z}
                  @click=${()=>this._togglePersonVisibility(e.entity_id)}
                ></ha-icon-button>
              </div>
            `})}
      </div>
    `}_togglePersonVisibility(e){const t=[...this._config?.settings?.hidden_persons||[]],i=t.indexOf(e);-1===i?t.push(e):t.splice(i,1);const a={...this._config,settings:{...this._config.settings,hidden_persons:t}};this._fireConfigChanged(a)}_editAreaRegistry(e){e.stopPropagation(),alert(this._t("strategy.edit_area_alert"))}_openReplacementManager(){this.hass&&this._config&&It(this.hass,this._config,e=>{this._fireConfigChanged(e),this.requestUpdate()})}_replacementCount(){return function(e){if(!e)return 0;const t=new Set,i=e=>{["by_domain","by_device_class","by_entity"].forEach(i=>{Object.keys(e?.[i]||{}).forEach(e=>t.add(`${i}:${e}`))})};return i(e.area_cards),i(e.devices_cards),t.size}(this._config?.blueprint_replacements)}_fireConfigChanged(e){si(this._settingsPage),this._config={...this._config,...e};const t={type:"custom:dwains-dashboard-next",areas_display:e.areas_display||{},areas_options:e.areas_options||{},blueprint_replacements:e.blueprint_replacements||{},device_admission:e.device_admission||{},favorites:e.favorites||[],settings:e.settings||{}},i=new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0});this.dispatchEvent(i)}static get styles(){return j`
      :host {
        display: block;
      }

      .editor-container {
        padding: 16px;
      }

      .settings-overview-hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        max-width: 720px;
        margin: 0 auto 18px;
        padding: 22px 24px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background:
          radial-gradient(circle at top right, color-mix(in srgb, var(--primary-color) 12%, transparent), transparent 42%),
          var(--card-background-color);
        box-shadow: 0 8px 26px rgba(15, 23, 42, 0.06);
      }

      .settings-overview-hero h2 {
        margin: 0;
        color: var(--primary-text-color);
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0;
      }

      .settings-overview-hero p {
        margin: 6px 0 0;
        color: var(--secondary-text-color);
        font-size: 13px;
        line-height: 1.45;
      }

      .settings-version-chip {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        padding: 7px 10px;
        border-radius: 999px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
      }

      .settings-version-chip ha-icon,
      .settings-version-chip svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
        --mdc-icon-size: 16px;
      }

      .settings-version-chip strong {
        color: var(--primary-text-color);
        font-weight: 800;
      }

      .settings-overview-hero > ha-icon,
      .settings-overview-hero > svg {
        flex: 0 0 auto;
        width: 48px;
        height: 48px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        fill: currentColor;
        --mdc-icon-size: 26px;
      }

      .settings-overview-hero > svg {
        padding: 11px;
        box-sizing: border-box;
      }

      .settings-nav-section {
        max-width: 720px;
        margin: 0 auto 16px;
      }

      .settings-nav-section h3 {
        margin: 0 0 8px;
        padding: 0 14px;
        color: var(--secondary-text-color);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0;
      }

      .settings-nav-list {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .settings-nav-item {
        width: 100%;
        min-height: 76px;
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto 24px;
        align-items: center;
        gap: 14px;
        padding: 12px 16px;
        border: 0;
        border-bottom: 1px solid var(--divider-color);
        color: var(--primary-text-color);
        background: transparent;
        text-align: left;
        cursor: pointer;
        font: inherit;
      }

      .settings-nav-item:last-child {
        border-bottom: 0;
      }

      .settings-nav-item:hover {
        background: color-mix(in srgb, var(--settings-item-color) 5%, transparent);
      }

      .settings-nav-icon {
        width: 44px;
        height: 44px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: var(--settings-item-color);
      }

      .settings-nav-icon ha-icon,
      .settings-nav-icon svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
        --mdc-icon-size: 24px;
      }

      .settings-nav-copy {
        min-width: 0;
      }

      .settings-nav-title {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 700;
        line-height: 1.2;
      }

      .settings-nav-description {
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.35;
      }

      .settings-nav-summary {
        justify-self: end;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 6px 10px;
        border-radius: 999px;
        color: var(--settings-item-color);
        background: color-mix(in srgb, var(--settings-item-color) 10%, transparent);
        font-size: 12px;
        font-weight: 700;
      }

      .settings-nav-chevron {
        color: var(--secondary-text-color);
        width: 22px;
        height: 22px;
        fill: currentColor;
        --mdc-icon-size: 22px;
      }

      .settings-loading-shell {
        min-height: 420px;
      }

      .settings-overview-hero-skeleton {
        opacity: 0.92;
      }

      .settings-nav-item-skeleton {
        pointer-events: none;
        cursor: default;
      }

      .skeleton-block,
      .settings-skeleton-copy span,
      .settings-skeleton-copy small {
        position: relative;
        overflow: hidden;
        background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
      }

      .skeleton-block::after,
      .settings-skeleton-copy span::after,
      .settings-skeleton-copy small::after {
        content: "";
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--card-background-color) 70%, transparent), transparent);
        animation: settings-skeleton-shimmer 1.2s ease-in-out infinite;
      }

      .settings-skeleton-copy {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .settings-skeleton-copy span,
      .settings-skeleton-copy small {
        display: block;
        border-radius: 999px;
      }

      .settings-skeleton-copy span {
        width: 180px;
        height: 14px;
      }

      .settings-skeleton-copy small {
        width: 260px;
        max-width: 100%;
        height: 10px;
      }

      @keyframes settings-skeleton-shimmer {
        to {
          transform: translateX(100%);
        }
      }

      .settings-detail-toolbar {
        max-width: 940px;
        margin: 0 auto 14px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 16px;
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color));
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
      }

      .settings-back-button {
        width: auto;
        min-width: 0;
        height: 36px;
        padding: 0 12px 0 10px;
        border: 0;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        justify-content: center;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 9%, transparent);
        box-shadow: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
      }

      .settings-back-button ha-icon {
        --mdc-icon-size: 18px;
      }

      .settings-back-button span {
        white-space: nowrap;
      }

      .settings-detail-title {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .settings-detail-title span {
        color: var(--primary-text-color);
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
      }

      .settings-detail-title small {
        margin-top: 2px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.35;
      }

      .settings-detail-content {
        max-width: 940px;
        margin: 0 auto;
      }

      .empty-settings-card {
        margin: 0 16px 16px;
        padding: 18px;
        border: 1px dashed var(--divider-color);
        border-radius: 10px;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        text-align: center;
      }

      .dashboard-settings {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 4px 0 8px;
      }
      .dashboard-settings ha-icon-picker {
        width: 100%;
      }

      @media (max-width: 700px) {
        .settings-overview-hero,
        .settings-nav-section,
        .settings-detail-content,
        .settings-detail-toolbar {
          max-width: none;
        }

        .settings-overview-hero {
          align-items: flex-start;
          padding: 18px;
        }

        .settings-overview-hero > ha-icon,
        .settings-overview-hero > svg {
          width: 40px;
          height: 40px;
          --mdc-icon-size: 22px;
        }

        .settings-overview-hero > svg {
          padding: 9px;
        }

        .settings-nav-item {
          grid-template-columns: 40px minmax(0, 1fr) 22px;
          gap: 12px;
          min-height: 72px;
          padding: 12px;
        }

        .settings-nav-icon {
          width: 40px;
          height: 40px;
        }

        .settings-nav-summary {
          grid-column: 2 / -1;
          justify-self: start;
          max-width: 100%;
          margin-top: -4px;
        }

        .settings-nav-chevron {
          grid-column: 3;
          grid-row: 1;
        }

        .settings-detail-toolbar {
          margin: 0 0 12px;
          padding: 10px 12px;
          border-radius: 14px;
        }

        .settings-detail-title span {
          font-size: 17px;
        }

        .settings-detail-title small {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .home-layout-section {
        display: grid;
        gap: 18px;
        padding: 0 16px 16px;
      }

      .home-section-list,
      .home-info-card-list {
        display: grid;
        gap: 8px;
      }

      .home-section-item,
      .home-info-card-item {
        display: grid;
        grid-template-columns: 32px 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        transition: border-color 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease, transform 0.16s ease;
      }

      .home-info-card-item {
        grid-template-columns: 42px minmax(0, 1fr) auto;
      }

      .home-info-card-section {
        display: grid;
        gap: 10px;
      }

      .home-camera-settings-section {
        padding: 0 16px 16px;
      }

      .home-camera-settings-list {
        display: grid;
        gap: 8px;
      }

      .home-camera-settings-empty {
        padding: 18px;
        border: 1px dashed var(--divider-color);
        border-radius: 10px;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        text-align: center;
      }

      .home-info-card-header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 16px;
        padding: 0 2px;
      }

      .home-info-card-header h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 800;
        color: var(--primary-text-color);
      }

      .home-info-card-header p {
        margin: 4px 0 0;
        font-size: 13px;
        line-height: 1.35;
        color: var(--secondary-text-color);
      }

      .home-info-card-header span {
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 800;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        border-radius: 999px;
        padding: 6px 10px;
      }

      .home-section-item.dragging {
        opacity: 0.5;
        transform: scale(0.99);
      }

      .home-section-item.drag-over {
        border-color: var(--primary-color);
        box-shadow:
          inset 0 0 0 1px var(--primary-color),
          0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .home-section-item.disabled,
      .home-info-card-item.disabled {
        opacity: 0.58;
        background: color-mix(in srgb, var(--card-background-color) 78%, var(--secondary-background-color));
      }

      .home-section-handle {
        display: flex;
        color: var(--secondary-text-color);
        cursor: grab;
      }

      .home-section-handle:active {
        cursor: grabbing;
      }

      .home-section-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }

      .home-section-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .home-section-item.disabled .home-section-icon,
      .home-info-card-item.disabled .home-section-icon {
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
      }

      .home-section-copy {
        min-width: 0;
      }

      .home-section-title {
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .home-section-description {
        margin-top: 2px;
        font-size: 12px;
        line-height: 1.35;
        color: var(--secondary-text-color);
      }

      .home-section-actions {
        display: inline-flex;
        gap: 2px;
      }

      .home-section-toggle {
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        background: transparent;
        cursor: pointer;
      }

      .home-section-toggle.enabled {
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }

      .home-section-toggle ha-icon {
        --mdc-icon-size: 20px;
      }

      .home-layout-reset {
        justify-self: start;
        border: 0;
        border-radius: 999px;
        padding: 8px 12px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      @media (max-width: 600px) {
        .home-section-item {
          grid-template-columns: 28px 36px minmax(0, 1fr);
        }

        .home-info-card-item {
          grid-template-columns: 36px minmax(0, 1fr) auto;
        }

        .home-section-icon {
          width: 36px;
          height: 36px;
        }

        .home-section-actions {
          grid-column: 2 / -1;
          justify-self: start;
        }

        .home-info-card-header {
          align-items: start;
          flex-direction: column;
          gap: 8px;
        }

        .home-camera-settings-section {
          padding-inline: 10px;
        }
      }

      .dd-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .dd-field label {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .dd-input {
        width: 100%;
        box-sizing: border-box;
        padding: 12px 14px;
        font-size: 1rem;
        color: var(--primary-text-color);
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        outline: none;
        transition: border-color .2s ease;
      }
      .dd-input:focus {
        border-color: var(--primary-color);
      }

      /* Sponsoring Section Styles */
      .sponsoring-section {
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color, var(--primary-color)));
        color: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
      }

      .sponsoring-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        pointer-events: none;
      }

      .sponsoring-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
      }

      .sponsoring-header ha-icon {
        --mdc-icon-size: 28px;
        color: #ffeb3b;
        animation: heartbeat 2s infinite;
      }

      @keyframes heartbeat {
        0%, 50%, 100% { transform: scale(1); }
        25% { transform: scale(1.1); }
      }

      .sponsoring-header h3 {
        margin: 0;
        font-size: 21px;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      .sponsoring-text {
        position: relative;
        z-index: 1;
        margin: 0 0 16px 0;
        line-height: 1.6;
        font-size: 13px;
        opacity: 0.95;
      }
      .sponsoring-text strong { font-weight: 700; }

      .sponsor-label {
        position: relative;
        z-index: 1;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 10px;
        opacity: 0.95;
      }

      .sponsor-chips {
        position: relative;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .sponsor-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 16px;
        border-radius: 999px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.35);
        transition: transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease;
      }
      .sponsor-chip ha-icon { --mdc-icon-size: 18px; }
      .sponsor-chip:hover {
        background: rgba(255, 255, 255, 0.28);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      }
      .sponsor-chip.primary {
        background: #fff;
        color: var(--primary-color);
        border-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      }
      .sponsor-chip.primary:hover { filter: brightness(0.97); }

      .sponsor-divider {
        position: relative;
        z-index: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.25);
        margin: 18px 0;
      }

      @media (max-width: 600px) {
        .sponsoring-section { padding: 20px; margin-bottom: 20px; }
        .sponsoring-header h3 { font-size: 20px; }
        .sponsor-chips { flex-direction: column; }
        .sponsor-chip { justify-content: center; }
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: -16px -16px 16px -16px;
        padding: 8px;
        background: var(--primary-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .toolbar ha-icon-button {
        color: var(--primary-text-color);
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 24px;
        flex: 0 0 auto;
      }

      .toolbar h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        flex: 1;
        padding: 0 4px;
      }

      ha-expansion-panel {
        margin-bottom: 8px;
        --expansion-panel-summary-padding: 0 16px;
      }

      ha-expansion-panel [slot="header"] {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .description {
        margin: 16px;
        color: var(--secondary-text-color);
      }

      .area-help {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin: 0 0px 16px 0px;
        padding: 12px;
        background: var(--secondary-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
      }
      .area-help-icon {
        --mdc-icon-size: 24px;
      }
      .area-help-text p {
        margin: 0 0 6px 0;
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .area-order-settings {
        margin: 0 16px 16px;
        padding: 16px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .area-order-heading {
        display: grid;
        gap: 4px;
        margin-bottom: 12px;
      }

      .area-order-heading strong {
        font-size: 15px;
      }

      .area-order-heading span,
      .area-order-mode small,
      .area-order-hint {
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .area-order-modes {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      .area-order-mode {
        min-width: 0;
        min-height: 72px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }

      .area-order-mode:hover {
        border-color: var(--primary-color);
      }

      .area-order-mode.selected {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 3px 0 0 var(--primary-color);
      }

      .area-order-mode ha-icon {
        flex: 0 0 auto;
        color: var(--primary-color);
      }

      .area-order-mode span {
        min-width: 0;
        display: grid;
        gap: 3px;
      }

      .area-order-mode strong {
        font-size: 13px;
      }

      .area-order-hint {
        margin: 12px 0 0;
      }

      @media (max-width: 700px) {
        .area-order-modes {
          grid-template-columns: 1fr;
        }

        .area-order-mode {
          min-height: 0;
        }
      }

      .sortable-container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 16px 16px 16px;
      }

      .sortable-item {
        position: relative;
        background: var(--card-background-color);
        border-radius: 4px;
        box-shadow: var(--card-box-shadow, none);
        transition: all 0.2s ease;
        user-select: none;
        cursor: default;
      }

      .sortable-container.is-custom-order .sortable-item {
        cursor: grab;
      }

      .sortable-container.is-custom-order .sortable-item:active {
        cursor: grabbing;
      }

      .handle.disabled {
        opacity: 0.25;
      }

      .sortable-item.hidden {
        opacity: 0.5;
      }

      .sortable-item:hover {
        background: var(--secondary-background-color);
      }

      .sortable-item.dragging {
        opacity: 0.4;
        transform: scale(0.95);
        transition: none;
      }

      .sortable-container.dragging .sortable-item {
        transition: transform 0.2s ease;
      }

      .sortable-container.dragging .sortable-item:not(.dragging):hover {
        transform: translateY(2px);
      }

      .sortable-item.drag-over {
        position: relative;
      }

      .sortable-item.drag-over::before {
        content: '';
        position: absolute;
        top: -2px;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--primary-color);
        border-radius: 2px;
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }

      .area-item,
      .entity-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 12px 16px;
        min-height: 48px;
      }

      .sortable-item:hover {
        background: var(--secondary-background-color);
      }

      .handle {
        cursor: grab;
        margin-right: 8px;
        display: flex;
        align-items: center;
        padding: 8px 4px;
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
      }

      .handle:hover {
        background: var(--primary-background-color);
        border-radius: 4px;
        color: var(--primary-color);
      }

      .handle:active {
        cursor: grabbing;
      }

      .handle ha-svg-icon {
        --mdc-icon-size: 20px;
      }

      .area-icon,
      .entity-icon {
        margin-right: 16px;
      }

      .area-name,
      .entity-name {
        flex: 1;
      }

      .area-name.clickable {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .area-name.clickable:hover {
        color: var(--primary-color);
      }

      .area-name .chevron {
        --mdc-icon-size: 20px;
        opacity: 0.6;
      }

      .area-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      button.link {
        color: var(--primary-color);
        text-decoration: none;
        background: none;
        border: none;
        cursor: pointer;
        font-size: inherit;
        padding: 0;
      }

      ha-icon-button[disabled] {
        opacity: 0.5;
        pointer-events: none;
      }

      ha-icon-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 20px;
      }

      .favorites-section,
      .time-section,
      .weather-section,
      .alarm-section,
      .entity-display-section,
      .replacement-section {
        padding: 0 16px 16px 16px;
      }

      .replacement-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .replacement-count {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .replacement-help {
        margin-top: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
        line-height: 1.4;
      }

      .replacement-summary ha-button ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 6px;
      }

      @media (max-width: 600px) {
        .replacement-summary {
          align-items: stretch;
          flex-direction: column;
        }
      }

      .time-toggle,
      .weather-toggle,
      .favorite-suggestions-toggle,
      .hide-unavailable-toggle {
        margin-bottom: 16px;
      }

      .time-toggle ha-formfield,
      .weather-toggle ha-formfield,
      .favorite-suggestions-toggle ha-formfield,
      .hide-unavailable-toggle ha-formfield {
        --mdc-typography-body2-font-size: 14px;
      }

      .toggle-description {
        margin: 8px 0 0 0;
        font-size: 12px;
        color: var(--secondary-text-color);
        line-height: 1.4;
        padding-left: 16px;
        border-left: 3px solid var(--divider-color);
      }

      .device-types-visibility {
        margin-top: 20px;
        display: grid;
        gap: 12px;
      }

      .device-admission-section {
        margin-top: 24px;
        display: grid;
        gap: 12px;
      }

      .device-types-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
      }

      .device-types-header h4 {
        margin: 0;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 700;
      }

      .device-types-header p {
        margin: 4px 0 0;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.35;
      }

      .device-types-header > span {
        flex: 0 0 auto;
        padding: 6px 10px;
        border-radius: 999px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font-size: 12px;
        font-weight: 800;
      }

      .device-types-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 8px;
      }

      .device-type-option {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
        transition: opacity 0.16s ease, border-color 0.16s ease, background 0.16s ease;
      }

      .device-type-option.enabled {
        border-color: color-mix(in srgb, var(--device-type-color) 24%, var(--divider-color));
      }

      .device-type-option.disabled {
        opacity: 0.58;
        background: color-mix(in srgb, var(--card-background-color) 78%, var(--secondary-background-color));
      }

      .device-type-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--device-type-color);
        background: color-mix(in srgb, var(--device-type-color) 13%, transparent);
      }

      .device-type-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .device-type-copy {
        min-width: 0;
      }

      .device-type-name {
        color: var(--primary-text-color);
        font-size: 14px;
        font-weight: 700;
        line-height: 1.15;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .device-type-count {
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1;
      }

      .device-admission-global-actions,
      .device-admission-group-actions,
      .device-admission-area-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .device-admission-global-actions button,
      .device-admission-group-actions button,
      .device-admission-area-actions button {
        min-height: 34px;
        border: 0;
        border-radius: 999px;
        padding: 0 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .device-admission-global-actions button[disabled],
      .device-admission-group-actions button[disabled],
      .device-admission-area-actions button[disabled] {
        opacity: 0.42;
        cursor: not-allowed;
      }

      .device-admission-global-actions ha-icon {
        --mdc-icon-size: 16px;
      }

      .device-admission-groups {
        display: grid;
        gap: 8px;
      }

      .device-admission-groups ha-expansion-panel,
      .device-admission-area,
      .device-admission-device {
        content-visibility: auto;
      }

      .device-admission-groups ha-expansion-panel {
        contain-intrinsic-size: auto 86px;
      }

      .device-admission-panel-header {
        width: 100%;
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
      }

      .device-type-icon.small {
        width: 34px;
        height: 34px;
        border-radius: 9px;
      }

      .device-type-icon.small ha-icon {
        --mdc-icon-size: 19px;
      }

      .device-admission-panel-header > span:not(.device-type-icon) {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--primary-text-color);
        font-weight: 800;
      }

      .device-admission-panel-header small {
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 700;
      }

      .device-admission-panel {
        display: grid;
        gap: 12px;
        padding: 0 16px 16px;
      }

      .device-admission-group-actions {
        justify-content: flex-end;
      }

      .device-admission-area {
        display: grid;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: color-mix(in srgb, var(--card-background-color) 82%, var(--secondary-background-color));
        contain-intrinsic-size: auto 180px;
      }

      .device-admission-area-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .device-admission-area-header strong {
        display: block;
        color: var(--primary-text-color);
        font-size: 14px;
        line-height: 1.2;
      }

      .device-admission-area-header span {
        display: block;
        margin-top: 2px;
        color: var(--secondary-text-color);
        font-size: 12px;
      }

      .device-admission-device-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 8px;
      }

      .device-admission-device {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid color-mix(in srgb, var(--device-type-color) 22%, var(--divider-color));
        border-radius: 10px;
        background: var(--card-background-color);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        contain-intrinsic-size: auto 64px;
      }

      .device-admission-device.hidden {
        opacity: 0.58;
        background: color-mix(in srgb, var(--card-background-color) 74%, var(--secondary-background-color));
      }

      .device-admission-copy {
        min-width: 0;
      }

      @media (max-width: 600px) {
        .device-types-header {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }

        .device-types-grid {
          grid-template-columns: 1fr;
        }

        .device-admission-panel {
          padding: 0 10px 12px;
        }

        .device-admission-area-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .device-admission-device-list {
          grid-template-columns: 1fr;
        }
      }

      .entity-picker,
      .weather-picker,
      .alarm-picker {
        width: 100%;
      }

      .weather-picker-header,
      .alarm-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .weather-picker-header h4,
      .alarm-picker-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .no-weather,
      .no-alarm {
        text-align: center;
        padding: 24px;
        color: var(--secondary-text-color);
      }

      .selected-weather-entity,
      .selected-alarm-entity {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
      }

      .selected-weather-entity .entity-icon,
      .selected-alarm-entity .entity-icon {
        --mdc-icon-size: 24px;
      }

      .selected-weather-entity .entity-name,
      .selected-alarm-entity .entity-name {
        flex: 1;
        font-size: 14px;
      }

      .entity-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .entity-picker-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .no-favorites {
        text-align: center;
        padding: 24px;
        color: var(--secondary-text-color);
      }

      .selected-entities {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .selected-entity {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
      }

      .selected-entity .entity-icon {
        --mdc-icon-size: 24px;
      }

      .selected-entity .entity-name {
        flex: 1;
        font-size: 14px;
      }

      .remove-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--error-color, #f44336);
        transition: all 0.2s ease;
        width: 36px;
        height: 36px;
      }

      .remove-button:hover {
        background: var(--error-color, #f44336);
        color: white;
        transform: scale(1.1);
      }

      .close-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
        width: 36px;
        height: 36px;
      }

      .close-button:hover {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        transform: scale(1.1);
      }

      .entity-picker-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .entity-picker-content {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 24px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
      }

      .entity-picker-content .entity-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .entity-search {
        margin-bottom: 16px;
      }

      .entity-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
      }

      .entity-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--primary-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .entity-option:hover {
        background: var(--secondary-background-color);
      }

      .entity-option .entity-icon {
        --mdc-icon-size: 24px;
      }

      .entity-option .entity-name {
        flex: 1;
        font-size: 14px;
      }

      .entity-option .entity-id {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-family: var(--font-family-code);
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
      }

      .persons-section {
        padding: 0 16px 16px 16px;
      }

      .persons-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .person-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        transition: all 0.2s ease;
      }

      .person-item:hover {
        background: var(--secondary-background-color);
      }

      .person-item.hidden {
        opacity: 0.5;
        background: var(--disabled-background-color, var(--secondary-background-color));
      }

      .person-icon {
        --mdc-icon-size: 32px;
        flex-shrink: 0;
      }

      .person-name {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
      }

      .person-state {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .person-state.home {
        background: var(--success-color, #4caf50);
        color: white;
      }

      .person-state.away {
        background: var(--warning-color, #ff9800);
        color: white;
      }

      .no-persons {
        text-align: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }
    `}};y([Be({attribute:!1})],di.prototype,"hass",null),y([Fe()],di.prototype,"_config",void 0),y([Fe()],di.prototype,"_area",void 0),y([Fe()],di.prototype,"_loading",void 0),y([Fe()],di.prototype,"_draggedAreaId",void 0),y([Fe()],di.prototype,"_dragOverIndex",void 0),y([Fe()],di.prototype,"_draggedHomeSection",void 0),y([Fe()],di.prototype,"_dragOverHomeSectionIndex",void 0),y([Fe()],di.prototype,"_draggedHomeCamera",void 0),y([Fe()],di.prototype,"_dragOverHomeCameraIndex",void 0),y([Fe()],di.prototype,"_draggedEntityId",void 0),y([Fe()],di.prototype,"_draggedEntityGroup",void 0),y([Fe()],di.prototype,"_dragOverEntityIndex",void 0),y([Fe()],di.prototype,"_showEntityPicker",void 0),y([Fe()],di.prototype,"_entitySearchFilter",void 0),y([Fe()],di.prototype,"_showWeatherPicker",void 0),y([Fe()],di.prototype,"_weatherSearchFilter",void 0),y([Fe()],di.prototype,"_showAlarmPicker",void 0),y([Fe()],di.prototype,"_alarmSearchFilter",void 0),y([Fe()],di.prototype,"_settingsPage",void 0),y([Fe()],di.prototype,"_dashboardId",void 0),y([Fe()],di.prototype,"_dashboardTitle",void 0),y([Fe()],di.prototype,"_dashboardIcon",void 0),di=y([Oe("dwains-dashboard-next-strategy-editor")],di);var li=Object.freeze({__proto__:null,get DwainsDashboardStrategyEditor(){return di}});const pi=Ue(class extends Ge{constructor(e){if(super(e),e.type!==qe||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const a=!!t[e];a===this.st.has(e)||this.nt?.has(e)||(a?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return xe}}),hi="important",mi=" !"+hi,ui=Ue(class extends Ge{constructor(e){if(super(e),e.type!==qe||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const a=e[i];return null==a?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${a};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const a=t[e];if(null!=a){this.ft.add(e);const t="string"==typeof a&&a.endsWith(mi);e.includes("-")||t?i.setProperty(e,t?a.slice(0,-11):a,t?hi:""):i[e]=a}}return xe}}),gi=new Map,_i=(e,t,i,a)=>!!a?.areas_options?.[i]?.groups_options?.[t]?.hidden&&a.areas_options[i].groups_options[t].hidden.includes(e),bi=e=>{const[t]=e.split(".");return t||"unknown"};function vi(e){return new Set(e?.device_admission?.hidden_devices||[])}function fi(e){return e?.device_admission||{}}function xi(e,t){const i="string"==typeof t?t:t.entity_id;return("string"==typeof t?"":t.device_id||"")||e?.entities?.[i]?.device_id||""}function yi(e,t,i){const a=xi(e,i);return!!a&&vi(t).has(a)}function wi(e,t,i){const a=vi(t);return a.size?i.filter(t=>{const i=xi(e,t);return!i||!a.has(i)}):i}function ki(e){return!1!==e?.settings?.show_recent_devices_panel}function $i(e,t){const i=new Map;for(const a of t.entities||[]){const t=xi(e,a);if(!t)continue;const o=Ci(a.created_at||e?.entities?.[a.entity_id]?.created_at);if(!o)continue;const r=i.get(t);(!r||o<r)&&i.set(t,o)}return i}function Si(e,t){return Ci(t.created_at||e?.devices?.[t.device_id]?.created_at)}function Ci(e){if(!e)return null;const t=Date.parse(e);return Number.isFinite(t)?t:null}const Ai={mW:.001,W:1,kW:1e3,MW:1e6};function Ei(e,t){const i=function(e,t){if(!e?.states)return[];const i=new Map((t?.entities||[]).map(e=>[e.entity_id,e])),a=new Map((t?.areas||[]).map(e=>[e.area_id,e]));return Object.values(e.states).map(o=>{const r=o.entity_id,n=i.get(r),s=function(e){if(!e?.entity_id?.startsWith("sensor."))return null;if("unavailable"===e.state||"unknown"===e.state)return null;const t=Hi(e.attributes?.unit_of_measurement),i=String(e.attributes?.device_class||"").toLowerCase();if(!t&&"power"!==i)return null;const a=Number.parseFloat(e.state);if(!Number.isFinite(a))return null;const o=t?Ai[t]??1:1;return Math.max(0,a*o)}(o);if(null===s)return;if(!function(e,t,i,a){const o=e.entities?.[i];if(o?.hidden_by||"diagnostic"===o?.entity_category||"config"===o?.entity_category)return!1;if(yi(e,t,a||i))return!1;const r=Di(e,t,i,a);if(!r)return!1;const n=t?.areas_display?.hidden||[];if(n.includes(r))return!1;if(!t?.areas?.some(e=>e.area_id===r))return!1;const s=t?.areas_options?.[r];if(s?.groups_options)for(const e of Object.values(s.groups_options))if(e.hidden?.includes(i))return!1;return!0}(e,t,r,n))return;const c=Di(e,t,r,n);if(!c)return;const d=a.get(c);if(!d)return;const l=function(e){const t=String(e||"").trim().toLowerCase();return["measurement","total","total_increasing"].includes(t)?t:void 0}(o.attributes?.state_class),p={entityId:r,name:o.attributes?.friendly_name||r,areaId:c,areaName:d.name,icon:o.attributes?.icon||"mdi:flash",watts:s,formatted:zi(s),unit:Hi(o.attributes?.unit_of_measurement)||"W"};return l&&(p.stateClass=l),p}).filter(e=>Boolean(e))}(e,t),a=new Map,o=new Map((t?.areas||[]).map(e=>[e.area_id,e]));i.forEach(e=>{let t=a.get(e.areaId);const i=o.get(e.areaId);t||(t={areaId:e.areaId,name:e.areaName,icon:i?Xt(i):"mdi:home",totalWatts:0,formattedTotal:"0 W",entities:[],percentage:0},a.set(e.areaId,t)),t.totalWatts+=e.watts,t.entities.push(e)});const r=[...a.values()].map(e=>{const t=[...e.entities].sort((e,t)=>t.watts-e.watts);return{...e,formattedTotal:zi(e.totalWatts),entities:t}}).filter(e=>e.totalWatts>0).sort((e,t)=>t.totalWatts-e.totalWatts),n=r.reduce((e,t)=>e+t.totalWatts,0),s=Math.max(...r.map(e=>e.totalWatts),0),c=r.map(e=>({...e,percentage:s>0?Math.max(6,Math.min(100,Math.round(e.totalWatts/s*100))):0}));return{totalWatts:n,formattedTotal:i.length?zi(n):"",sensorCount:i.length,areas:c}}function zi(e){return Number.isFinite(e)?e>=1e4?`${(e/1e3).toFixed(0)} kW`:e>=1e3?`${(e/1e3).toFixed(1)} kW`:`${Math.round(e)} W`:""}function Di(e,t,i,a){if(a?.area_id)return a.area_id;const o=e.entities?.[i];if(o?.area_id)return o.area_id;const r=a?.device_id||o?.device_id;if(r){const i=t?.devices?.find(e=>e.device_id===r);if(i?.area_id)return i.area_id;const a=e.devices?.[r];if(a?.area_id)return a.area_id}const n=e.states?.[i]?.attributes?.area_id;return"string"==typeof n&&n?n:null}function Hi(e){const t=String(e||"").trim();if(t in Ai)return t;const i=t.toLowerCase();return"w"===i?"W":"kw"===i?"kW":"mw"===i?"MW":void 0}const Mi=["closed","locked","off","false","not_home","idle"],Li=["unavailable","unknown"],Ii=["playing","buffering"],Pi=["cleaning","returning"],ji=["arming","pending","triggered"],Ti={light:{icon:Kt("light")},switch:{icon:Kt("switch")},fan:{icon:Kt("fan")},cover:{icon:Kt("cover")},lock:{icon:Kt("lock")},climate:{icon:Kt("climate")},media_player:{icon:Kt("media_player")},camera:{icon:Kt("camera")},person:{icon:Kt("person")},vacuum:{icon:Kt("vacuum")},alarm_control_panel:{icon:Kt("alarm_control_panel")}},Ni={window:{icon:Zt("binary_sensor","window")},door:{icon:Zt("binary_sensor","door")},motion:{icon:Zt("binary_sensor","motion")},smoke:{icon:Zt("binary_sensor","smoke")},gas:{icon:Zt("binary_sensor","gas")},moisture:{icon:Zt("binary_sensor","moisture")},occupancy:{icon:Zt("binary_sensor","occupancy")},opening:{icon:Zt("binary_sensor","opening")},presence:{icon:Zt("binary_sensor","presence")},safety:{icon:Zt("binary_sensor","safety")},tamper:{icon:"mdi:lock-alert"},vibration:{icon:Zt("binary_sensor","vibration")}};function Oi(e,t=!1){const i=e.startsWith("/")?e:`/${e}`;t?window.history.replaceState(null,"",i):window.history.pushState(null,"",i),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:t}}))}function Ri(e){const t=e.trim();if(!t)return null;const i=t.match(/^rgba?\(\s*([.\d]+)[,\s]+([.\d]+)[,\s]+([.\d]+)/i);if(i)return[Number(i[1]),Number(i[2]),Number(i[3])];const a=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),o=a?.[1];if(o){const e=3===o.length?o.split("").map(e=>e+e).join(""):o;return[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)]}return null}function Vi([e,t,i]){return.2126*e+.7152*t+.0722*i}function Bi(e,t){const i=[e?.themes?.dark,e?.themes?.darkMode,e?.selectedTheme?.dark,e?.selected_theme?.dark];for(const e of i)if(!0===e)return!0;const a=[t,document.documentElement,document.body].filter(Boolean),o=["--primary-background-color","--secondary-background-color","--card-background-color","--ha-card-background"];for(const e of a){const t=getComputedStyle(e);for(const e of o){const i=Ri(t.getPropertyValue(e));if(i)return Vi(i)<150}const i=Ri(t.backgroundColor);if(i)return Vi(i)<150}return!i.some(e=>!1===e)&&(window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1)}const Fi=(e,t,i,a)=>{const o=new CustomEvent(t,{bubbles:!0,cancelable:!1,composed:!0,detail:i});e.dispatchEvent(o)},qi=()=>Promise.resolve().then(function(){return Ya});let Wi=!1;const Ui=(e,t)=>{if(Wi)return void console.warn("Domain entities dialog is already open");Wi=!0;const i=t=>{"dwains-dashboard-next-domain-entities-dialog"===t.detail?.dialog&&(Wi=!1,e.removeEventListener("dialog-closed",i))};e.addEventListener("dialog-closed",i),Fi(e,"show-dialog",{dialogTag:"dwains-dashboard-next-domain-entities-dialog",dialogImport:qi,dialogParams:t}),setTimeout(()=>{Wi&&(Wi=!1,e.removeEventListener("dialog-closed",i))},2e3)},Gi=()=>Promise.resolve().then(function(){return mo}),Ki=(e,t)=>{Fi(e,"show-dialog",{dialogTag:"dwains-dashboard-next-card-editor-dialog",dialogImport:Gi,dialogParams:t})},Yi="(max-width: 768px)",Zi="dd-next-mobile-nav-active",Xi="dd-hide-header",Qi="data-dd-next-native-header-hidden",Ji="data-dd-next-native-header-old-style",ea={"mdi:account-circle":"M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z","mdi:account-cog":"M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M17 12C16.87 12 16.76 12.09 16.74 12.21L16.55 13.53C16.25 13.66 15.96 13.82 15.7 14L14.46 13.5C14.35 13.5 14.22 13.5 14.15 13.63L13.15 15.36C13.09 15.47 13.11 15.6 13.21 15.68L14.27 16.5C14.25 16.67 14.24 16.83 14.24 17C14.24 17.17 14.25 17.33 14.27 17.5L13.21 18.32C13.12 18.4 13.09 18.53 13.15 18.64L14.15 20.37C14.21 20.5 14.34 20.5 14.46 20.5L15.7 20C15.96 20.18 16.24 20.35 16.55 20.47L16.74 21.79C16.76 21.91 16.86 22 17 22H19C19.11 22 19.22 21.91 19.24 21.79L19.43 20.47C19.73 20.34 20 20.18 20.27 20L21.5 20.5C21.63 20.5 21.76 20.5 21.83 20.37L22.83 18.64C22.89 18.53 22.86 18.4 22.77 18.32L21.7 17.5C21.72 17.33 21.74 17.17 21.74 17C21.74 16.83 21.73 16.67 21.7 16.5L22.76 15.68C22.85 15.6 22.88 15.47 22.82 15.36L21.82 13.63C21.76 13.5 21.63 13.5 21.5 13.5L20.27 14C20 13.82 19.73 13.65 19.42 13.53L19.23 12.21C19.22 12.09 19.11 12 19 12H17M10 14C5.58 14 2 15.79 2 18V20H11.68A7 7 0 0 1 11 17A7 7 0 0 1 11.64 14.09C11.11 14.03 10.56 14 10 14M18 15.5C18.83 15.5 19.5 16.17 19.5 17C19.5 17.83 18.83 18.5 18 18.5C17.16 18.5 16.5 17.83 16.5 17C16.5 16.17 17.17 15.5 18 15.5Z","mdi:arrow-left":k,"mdi:check":"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z","mdi:chevron-right":S,"mdi:format-list-bulleted-type":D,"mdi:home":"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z","mdi:menu":"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z","mdi:puzzle":"M20.5,11H19V7C19,5.89 18.1,5 17,5H13V3.5A2.5,2.5 0 0,0 10.5,1A2.5,2.5 0 0,0 8,3.5V5H4A2,2 0 0,0 2,7V10.8H3.5C5,10.8 6.2,12 6.2,13.5C6.2,15 5,16.2 3.5,16.2H2V20A2,2 0 0,0 4,22H7.8V20.5C7.8,19 9,17.8 10.5,17.8C12,17.8 13.2,19 13.2,20.5V22H17A2,2 0 0,0 19,20V16H20.5A2.5,2.5 0 0,0 23,13.5A2.5,2.5 0 0,0 20.5,11Z"};let ta,ia,aa,oa,ra=class extends Te{constructor(){super(...arguments),this.dashSegment="",this._items=[],this._active="",this._visible=!0,this._areaContext={areaId:null,view:"home"},this._deviceContext={domain:null},this._pages=[],this._pagesOpen=!1,this._restrictedMenuOpen=!1,this._sync=()=>{this._syncThemeAttribute(),this._active=this._normalizeActivePath(this._currentPath()),this._visible=!this.dashSegment||this._segment()===this.dashSegment,ka(this._hass,this._settings,this.dashSegment),va(this.dashSegment),$a(this._hass,this._settings,this.dashSegment),this._visible||(this._pagesOpen=!1,this._restrictedMenuOpen=!1),this._isHaMenuRestricted()||(this._restrictedMenuOpen=!1)},this._handleAreaContext=e=>{this._areaContext=e.detail||{areaId:null,view:"home"},this._isHomeRoute(this._currentPath())&&(this._active="home")},this._handleDeviceContext=e=>{this._deviceContext=e.detail||{domain:null},"devices"===this._currentPath()&&(this._active="devices")},this._closePages=()=>{this._pagesOpen=!1},this._closeRestrictedMenu=()=>{this._restrictedMenuOpen=!1},this._openProfileSettings=()=>{this._restrictedMenuOpen=!1,Oi("/profile/general")},this._goHomeFromArea=()=>{this._pagesOpen=!1,this._restrictedMenuOpen=!1,this._active="home",window.dispatchEvent(new CustomEvent("dwains-dashboard-next-open-home"))}}set hass(e){const t=!this._hass;this._hass=e,this._syncThemeAttribute(),ka(this._hass,this._settings,this.dashSegment),va(this.dashSegment),$a(this._hass,this._settings,this.dashSegment),t&&this._loadItems()}get hass(){return this._hass}set dashboardSettings(e){this._settings=e,this._isHaMenuRestricted()||(this._restrictedMenuOpen=!1),ka(this._hass,this._settings,this.dashSegment),va(this.dashSegment),$a(this._hass,this._settings,this.dashSegment),this.requestUpdate()}connectedCallback(){super.connectedCallback(),this._syncThemeAttribute(),this._sync(),window.addEventListener("location-changed",this._sync),window.addEventListener("popstate",this._sync),window.addEventListener("dwains-dashboard-next-area-context-changed",this._handleAreaContext),window.addEventListener("dwains-dashboard-next-device-context-changed",this._handleDeviceContext)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("location-changed",this._sync),window.removeEventListener("popstate",this._sync),window.removeEventListener("dwains-dashboard-next-area-context-changed",this._handleAreaContext),window.removeEventListener("dwains-dashboard-next-device-context-changed",this._handleDeviceContext)}_syncThemeAttribute(){this.toggleAttribute("data-theme-dark",Bi(this._hass,this))}_segment(){const e=window.location.pathname.split("/")[1];return e&&"lovelace"!==e?e:"lovelace"}_currentPath(){return window.location.pathname.split("/")[2]||"home"}async _loadItems(){let e=[];try{const t=this._segment(),i="lovelace"!==t?{url_path:t}:{},a=await this._hass.callWS({type:"lovelace/config",...i});e=Array.isArray(a?.strategy?.pages)?a.strategy.pages:[]}catch{}this._pages=e.map(e=>({path:String(e.id),icon:e.icon||"mdi:puzzle",label:String(e.name||e.id||"")}));const t=this._pages.length>1?[{path:"__dd_pages__",icon:"mdi:puzzle",label:o(this._hass,"navigation.pages"),action:"pages"}]:this._pages.map(e=>({...e}));this._items=[{path:"home",icon:"mdi:home",label:o(this._hass,"sidebar.home"),action:"home"},{path:"devices",icon:"mdi:format-list-bulleted-type",label:o(this._hass,"devices.title"),action:"devices"},...t],this._sync()}_onItem(e){"home"!==e.action?"devices"!==e.action?"pages"!==e.action?this._go(e.path):this._openPages():this._openDeviceTypes():this._openHomeAreas()}_openHomeAreas(){if(this._pagesOpen=!1,"settings"===this._areaContext.view)return this._active="home",void window.dispatchEvent(new CustomEvent("dwains-dashboard-next-open-home"));"home"===this._currentPath()?(()=>{this._active="home",window.dispatchEvent(new CustomEvent("dwains-dashboard-next-toggle-area-nav"))})():this._go("home")}_openDeviceTypes(){this._pagesOpen=!1;"devices"===this._currentPath()?(()=>{this._active="devices",window.dispatchEvent(new CustomEvent("dwains-dashboard-next-toggle-devices-nav"))})():this._go("devices")}_openPages(){const e=this._pages[0];1===this._pages.length&&e?this._go(e.path):this._pagesOpen=!this._pagesOpen}_isHaMenuRestricted(){return c(this._hass,this._settings)}_openRestrictedMenu(){this._pagesOpen=!1,this._restrictedMenuOpen=!this._restrictedMenuOpen}_toggleHaMenu(){if(this._isHaMenuRestricted())return void this._openRestrictedMenu();pa("start");const e=()=>new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}),t=Sa("home-assistant-main");t?t.dispatchEvent(e()):document.querySelector("home-assistant")?.dispatchEvent(e())}_go(e){this._pagesOpen=!1;const t=`/${this._segment()}/${e}`;window.history.pushState(null,"",t);const i=new Event("location-changed",{bubbles:!0,composed:!0});i.detail={replace:!1},window.dispatchEvent(i),this._active=e}render(){return this._visible&&this._items.length?fe`
      ${this._renderPagesSheet()}
      ${this._renderRestrictedMenuSheet()}
      ${this._renderStandaloneMenuButton()}
      <nav class="bar">
        ${this._items.map(e=>{const t=this._displayItem(e),i=this._isItemActive(e);return fe`
            <button
              class="item ${i?"active":""} ${"home"===e.action||"devices"===e.action||"pages"===e.action?"switcher":""}"
              @click=${()=>this._onItem(e)}
              title=${t.label}
              aria-label=${t.label}
              aria-current=${i?"page":ye}
            >
              ${this._renderIcon(t.icon)}
              <span>${t.label}</span>
            </button>
          `})}
      </nav>
    `:ye}_renderStandaloneMenuButton(){const e="area"===this._areaContext.view&&Boolean(this._areaContext.areaId),t=o(this._hass,e?"navigation.back_home":"navigation.open_menu");return fe`
      <button
        class="standalone-menu ${e?"is-back":""}"
        type="button"
        title=${t}
        aria-label=${t}
        @click=${()=>{e?this._goHomeFromArea():this._toggleHaMenu()}}
      >
        ${this._renderIcon(e?"mdi:arrow-left":"mdi:menu")}
      </button>
    `}_renderRestrictedMenuSheet(){return this._isHaMenuRestricted()?fe`
      <button
        class="pages-backdrop ${this._restrictedMenuOpen?"open":""}"
        aria-label=${o(this._hass,"common.close")}
        @click=${this._closeRestrictedMenu}
      ></button>
      <section class="pages-sheet ${this._restrictedMenuOpen?"open":""}" aria-hidden=${this._restrictedMenuOpen?"false":"true"}>
        <div class="pages-handle"></div>
        <div class="pages-heading">
          ${this._renderIcon("mdi:account-circle")}
          <span>${o(this._hass,"navigation.menu")}</span>
        </div>
        <div class="pages-list">
          <button class="page-row" @click=${this._openProfileSettings}>
            <span class="page-icon">${this._renderIcon("mdi:account-cog")}</span>
            <span class="page-copy">
              <span class="page-name">${o(this._hass,"navigation.profile_settings")}</span>
              <span class="page-subtitle">${o(this._hass,"navigation.profile_description")}</span>
            </span>
            <span class="page-chevron">${this._renderIcon("mdi:chevron-right")}</span>
          </button>
        </div>
      </section>
    `:ye}_renderPagesSheet(){return this._pages.length<=1?ye:fe`
      <button
        class="pages-backdrop ${this._pagesOpen?"open":""}"
        aria-label=${o(this._hass,"common.close")}
        @click=${this._closePages}
      ></button>
      <section class="pages-sheet ${this._pagesOpen?"open":""}" aria-hidden=${this._pagesOpen?"false":"true"}>
        <div class="pages-handle"></div>
        <div class="pages-heading">
          ${this._renderIcon("mdi:puzzle")}
          <span>${o(this._hass,"navigation.pages")}</span>
        </div>
        <div class="pages-list">
          ${this._pages.map(e=>{const t=this._active===e.path;return fe`
              <button
                class="page-row ${t?"active":""}"
                @click=${()=>this._go(e.path)}
                aria-current=${t?"page":ye}
              >
                <span class="page-icon">${this._renderIcon(e.icon)}</span>
                <span class="page-copy">
                  <span class="page-name">${e.label}</span>
                  <span class="page-subtitle">${o(this._hass,t?"navigation.current_page":"navigation.open_page")}</span>
                </span>
                <span class="page-chevron">${this._renderIcon(t?"mdi:check":"mdi:chevron-right")}</span>
              </button>
            `})}
        </div>
      </section>
    `}_isItemActive(e){return"pages"===e.action?this._pages.some(e=>e.path===this._active):this._active===e.path}_isHomeRoute(e){return!e||"home"===e||"0"===e||"overview"===e}_normalizeActivePath(e){return this._isHomeRoute(e)?"home":e}_activePage(){return this._pages.find(e=>e.path===this._active)}_displayItem(e){if("home"===e.action&&this._active===e.path&&"settings"===this._areaContext.view)return{icon:this._areaContext.icon||"mdi:cog-outline",label:this._areaContext.name||o(this._hass,"settings.title")};if("home"===e.action&&this._active===e.path&&"area"===this._areaContext.view&&this._areaContext.areaId)return{icon:this._areaContext.icon||"mdi:home",label:this._areaContext.name||o(this._hass,"sidebar.home")};if("devices"===e.action&&this._active===e.path&&this._deviceContext.domain)return{icon:this._deviceContext.icon||e.icon,label:this._deviceContext.label||e.label};if("pages"===e.action){const e=this._activePage();if(e)return{icon:e.icon,label:e.label}}return{icon:e.icon,label:e.label}}_renderIcon(e){const t=ea[e];return t?fe`
      <svg class="dd-static-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${t}></path>
      </svg>
    `:fe`<ha-icon icon=${e}></ha-icon>`}};function na(e,t){if(!e)return;let i=document.querySelector("dwains-dashboard-next-bottom-nav");i||(i=document.createElement("dwains-dashboard-next-bottom-nav"),document.body.appendChild(i));const a=window.location.pathname.split("/")[1];i.dashSegment=a&&"lovelace"!==a?a:"lovelace",va(i.dashSegment),i.dashboardSettings=t,i.hass=e,$a(e,t,i.dashSegment)}function sa(e=0){const t=ca();if(!(document.documentElement.classList.contains(Zi)||Boolean(document.body?.classList.contains(Zi))))return void la(!1);const i=Zi,a=da().split(",").map(e=>e.trim()).filter(Boolean),o=a.flatMap(e=>[`html.${i} ${e}`,`body.${i} ${e}`]).join(",\n      "),r=a.map(e=>`:host-context(.${i}) ${e}`).join(",\n      "),n=["home-assistant","home-assistant-main","app-drawer-layout","app-header-layout","partial-panel-resolver","ha-panel-lovelace","ha-app-layout","hui-root","#view",".view","hui-view","hui-sections-view","hui-masonry-view"],s=n.flatMap(e=>[`html.${i} ${e}`,`body.${i} ${e}`]).join(",\n      "),c=n.map(e=>`:host-context(.${i}) ${e}`).join(",\n      "),d=`\n    @media (max-width: 768px) {\n      html.${i},\n      body.${i} {\n        overflow-x: hidden !important;\n      }\n\n      html.${i} dwains-dashboard-next-bottom-nav,\n      body.${i} dwains-dashboard-next-bottom-nav {\n        display: block !important;\n        position: static !important;\n        inset: auto !important;\n        width: 0 !important;\n        height: 0 !important;\n        min-width: 0 !important;\n        min-height: 0 !important;\n        max-width: 0 !important;\n        max-height: 0 !important;\n        overflow: visible !important;\n        pointer-events: none !important;\n        z-index: auto !important;\n      }\n\n      ${o} {\n        display: none !important;\n        visibility: hidden !important;\n        height: 0 !important;\n        min-height: 0 !important;\n        max-height: 0 !important;\n        overflow: hidden !important;\n        padding: 0 !important;\n        margin: 0 !important;\n        border: 0 !important;\n      }\n\n      ${r} {\n        display: none !important;\n        visibility: hidden !important;\n        height: 0 !important;\n        min-height: 0 !important;\n        max-height: 0 !important;\n        overflow: hidden !important;\n        padding: 0 !important;\n        margin: 0 !important;\n        border: 0 !important;\n      }\n\n      ${s} {\n        --app-header-height: 0px !important;\n        --header-height: 0px !important;\n        --mdc-top-app-bar-row-height: 0px !important;\n        padding-top: 0 !important;\n        margin-top: 0 !important;\n      }\n\n      ${c} {\n        --app-header-height: 0px !important;\n        --header-height: 0px !important;\n        --mdc-top-app-bar-row-height: 0px !important;\n        padding-top: 0 !important;\n        margin-top: 0 !important;\n      }\n    }\n  `;t.forEach(e=>{const t=e instanceof Document?e.head||e.documentElement:e;let i=e.querySelector(`#${Xi}`);i||(i=document.createElement("style"),i.id=Xi,t.appendChild(i)),i.textContent=d}),la(!0),e<14&&setTimeout(()=>sa(e+1),e<4?80:250)}function ca(){const e=new Set([document]);return["home-assistant","home-assistant-main","app-drawer-layout","app-header-layout","partial-panel-resolver","ha-panel-lovelace","hui-root","ha-app-layout"].forEach(t=>{Ca(t).forEach(t=>{t.shadowRoot&&e.add(t.shadowRoot)})}),Array.from(e)}function da(){return["app-header","app-toolbar","mwc-top-app-bar","ha-top-app-bar","ha-menu-button","ha-tabs","ha-tab-group",'[role="tablist"]',".header",".toolbar",".app-toolbar",".top-app-bar",".main-toolbar",".header-toolbar",".view-header",".toolbar-items",".action-items","#toolbar","#tabs"].join(",")}function la(e){const t=da();ca().forEach(i=>{i.querySelectorAll(t).forEach(t=>{const i=t;if(e)return i.hasAttribute(Qi)||(i.setAttribute(Ji,i.getAttribute("style")||""),i.setAttribute(Qi,"true")),i.style.setProperty("display","none","important"),i.style.setProperty("visibility","hidden","important"),i.style.setProperty("height","0","important"),i.style.setProperty("min-height","0","important"),i.style.setProperty("max-height","0","important"),i.style.setProperty("padding","0","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("border","0","important"),void i.style.setProperty("overflow","hidden","important");if(!i.hasAttribute(Qi))return;const a=i.getAttribute(Ji)||"";a?i.setAttribute("style",a):i.removeAttribute("style"),i.removeAttribute(Qi),i.removeAttribute(Ji)})})}function pa(e){Ca("wa-drawer").forEach(t=>{t.getAttribute("placement")!==e&&t.setAttribute("placement",e)})}ra.styles=j`
    :host {
      display: none;
      width: 0;
      height: 0;
      overflow: visible;
      pointer-events: none;
      -webkit-tap-highlight-color: transparent;
    }
    @media (max-width: 768px) {
      :host {
        display: block;
        position: static !important;
        width: 0 !important;
        height: 0 !important;
        pointer-events: none;
        overflow: visible;
        contain: none;
      }
    }
    .bar {
      position: fixed;
      left: 50%;
      right: auto;
      bottom: calc(4px + env(safe-area-inset-bottom, 0px));
      z-index: 142;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: max-content;
      max-width: calc(100vw - 32px);
      margin: 0 auto;
      padding: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      transform: translate3d(-50%, 0, 0);
      will-change: transform;
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.68), rgba(255, 255, 255, 0.44)),
        rgba(255, 255, 255, 0.58);
      border: 1px solid rgba(255, 255, 255, 0.72);
      box-shadow:
        0 22px 50px rgba(15, 23, 42, 0.15),
        0 8px 20px rgba(255, 255, 255, 0.42),
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        inset 0 -1px 0 rgba(15, 23, 42, 0.04);
      backdrop-filter: blur(26px) saturate(180%);
      -webkit-backdrop-filter: blur(26px) saturate(180%);
      pointer-events: auto;
      transition:
        transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        background-color 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .standalone-menu {
      position: fixed;
      left: max(14px, env(safe-area-inset-left, 0px));
      bottom: calc(8px + env(safe-area-inset-bottom, 0px));
      z-index: 143;
      width: 52px;
      height: 52px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.72);
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.5)),
        rgba(255, 255, 255, 0.62);
      color: rgba(15, 23, 42, 0.92);
      box-shadow:
        0 18px 42px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.92),
        inset 0 -1px 0 rgba(15, 23, 42, 0.04);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      pointer-events: auto;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition:
        transform 0.18s ease,
        background-color 0.18s ease,
        color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .standalone-menu:hover {
      transform: translateY(-1px);
      box-shadow:
        0 22px 48px rgba(15, 23, 42, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.92),
        inset 0 -1px 0 rgba(15, 23, 42, 0.04);
    }

    .standalone-menu:active {
      transform: scale(0.96);
    }

    .standalone-menu.is-back {
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.1);
      box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.56),
        inset 0 1px 0 rgba(255, 255, 255, 0.075);
    }

    .standalone-menu ha-icon,
    .standalone-menu .dd-static-icon {
      --mdc-icon-size: 24px;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
    .bar::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      pointer-events: none;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.92),
          rgba(255, 255, 255, 0.38) 24%,
          rgba(255, 255, 255, 0.12) 100%);
      opacity: 0.92;
    }
    .bar::after {
      content: "";
      position: absolute;
      inset: auto 18% 4px;
      height: 1px;
      border-radius: 999px;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.82);
      opacity: 0.72;
    }
    .bar::-webkit-scrollbar {
      display: none;
    }
    .item {
      position: relative;
      z-index: 1;
      flex: 0 0 auto;
      min-width: 44px;
      height: 44px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 12px;
      border: none;
      border-radius: 999px;
      background: transparent;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      color: rgba(15, 23, 42, 0.66);
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }
    .item ha-icon,
    .item .dd-static-icon {
      --mdc-icon-size: 21px;
      width: 21px;
      height: 21px;
      flex: 0 0 auto;
      fill: currentColor;
    }
    .item span {
      display: none;
      max-width: 92px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
    }
    .item:hover {
      transform: translateY(-1px);
      color: rgba(15, 23, 42, 0.9);
    }
    .item.active {
      min-width: 118px;
      justify-content: space-between;
      padding: 0 13px;
      background:
        linear-gradient(180deg,
          rgba(15, 23, 42, 0.14),
          rgba(15, 23, 42, 0.08) 52%,
          rgba(15, 23, 42, 0.12) 100%);
      color: rgba(15, 23, 42, 0.96);
      box-shadow:
        0 12px 24px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.48),
        inset 0 0 0 1px rgba(15, 23, 42, 0.06);
    }
    .item.active span {
      display: inline;
    }
    .item.active.switcher::after {
      content: "";
      width: 7px;
      height: 7px;
      border-right: 2px solid currentColor;
      border-top: 2px solid currentColor;
      transform: rotate(-45deg) translateY(2px);
      opacity: 0.72;
      flex: 0 0 auto;
    }

    .pages-backdrop {
      position: fixed;
      inset: 0;
      z-index: 140;
      width: 100vw;
      height: 100vh;
      padding: 0;
      border: 0;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      background: rgba(8, 13, 24, 0.18);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      transition:
        opacity 0.22s ease,
        visibility 0.22s ease;
    }

    .pages-backdrop.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .pages-sheet {
      position: fixed;
      left: 18px;
      right: 18px;
      bottom: calc(94px + env(safe-area-inset-bottom, 0px));
      z-index: 141;
      max-height: min(54vh, 460px);
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px 10px 12px;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.72);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.82)),
        rgba(255, 255, 255, 0.86);
      box-shadow:
        0 24px 58px rgba(15, 23, 42, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(28px) saturate(170%);
      -webkit-backdrop-filter: blur(28px) saturate(170%);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(18px) scale(0.98);
      transform-origin: bottom center;
      transition:
        opacity 0.24s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0.24s ease;
    }

    .pages-sheet.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }

    .pages-handle {
      width: 42px;
      height: 4px;
      margin: 0 auto 1px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.14);
    }

    .pages-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 4px;
      color: rgba(15, 23, 42, 0.86);
      font-size: 15px;
      font-weight: 900;
      line-height: 1;
    }

    .pages-heading ha-icon,
    .pages-heading .dd-static-icon {
      --mdc-icon-size: 20px;
      width: 20px;
      height: 20px;
      color: rgba(15, 23, 42, 0.78);
      fill: currentColor;
    }

    .pages-list {
      display: grid;
      gap: 8px;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: none;
    }

    .pages-list::-webkit-scrollbar {
      display: none;
    }

    .page-row {
      min-height: 60px;
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) 26px;
      align-items: center;
      gap: 11px;
      padding: 8px 10px;
      border: 0;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.68);
      color: rgba(15, 23, 42, 0.9);
      text-align: left;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.06),
        0 8px 18px rgba(15, 23, 42, 0.06);
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .page-row.active {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 11%, rgba(255, 255, 255, 0.86));
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--primary-color, #03a9f4) 28%, transparent),
        0 10px 22px rgba(15, 23, 42, 0.08);
    }

    .page-icon {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      color: var(--primary-color, #03a9f4);
    }

    .page-icon ha-icon,
    .page-icon .dd-static-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    .page-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .page-name,
    .page-subtitle {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .page-name {
      font-size: 14px;
      font-weight: 900;
      line-height: 1.05;
    }

    .page-subtitle {
      color: rgba(15, 23, 42, 0.48);
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
    }

    .page-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      --mdc-icon-size: 21px;
      color: rgba(15, 23, 42, 0.48);
    }
    .page-chevron .dd-static-icon {
      width: 21px;
      height: 21px;
      fill: currentColor;
    }

    @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
      .bar {
        background: rgba(255, 255, 255, 0.94);
      }
      .standalone-menu {
        left: max(10px, env(safe-area-inset-left, 0px));
        bottom: calc(6px + env(safe-area-inset-bottom, 0px));
        width: 48px;
        height: 48px;
      }
      .pages-sheet {
        background: rgba(255, 255, 255, 0.96);
      }
    }

    @media (max-width: 380px) {
      .bar {
        gap: 6px;
        max-width: calc(100vw - 16px);
        padding: 6px;
      }
      .item {
        min-width: 42px;
        height: 42px;
        padding: 0 11px;
      }
      .item.active {
        min-width: 112px;
      }
      .item span {
        max-width: 78px;
        font-size: 13px;
      }
    }

    :host([data-theme-dark]) .bar {
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.82), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 20px 44px rgba(0, 0, 0, 0.62),
        0 0 0 1px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.075),
        inset 0 -1px 0 rgba(0, 0, 0, 0.34);
      backdrop-filter: blur(30px) saturate(160%);
      -webkit-backdrop-filter: blur(30px) saturate(160%);
    }
    :host([data-theme-dark]) .bar::before {
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.075),
          rgba(255, 255, 255, 0.025) 30%,
          rgba(255, 255, 255, 0) 100%);
      opacity: 0.7;
    }
    :host([data-theme-dark]) .bar::after {
      background: rgba(255, 255, 255, 0.08);
      opacity: 0.28;
    }
    :host([data-theme-dark]) .item {
      color: rgba(226, 232, 240, 0.72);
    }
    :host([data-theme-dark]) .item:hover {
      color: rgba(248, 250, 252, 0.96);
      background: rgba(255, 255, 255, 0.055);
    }
    :host([data-theme-dark]) .item.active {
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.13),
          rgba(255, 255, 255, 0.075) 48%,
          rgba(255, 255, 255, 0.045) 100%);
      color: #f8fafc;
      box-shadow:
        0 10px 22px rgba(0, 0, 0, 0.36),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 0 0 1px rgba(255, 255, 255, 0.09);
    }
    :host([data-theme-dark]) .item.active ha-icon {
      color: #ffffff;
    }

    :host([data-theme-dark]) .standalone-menu {
      border-color: rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: rgba(248, 250, 252, 0.94);
      box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.56),
        inset 0 1px 0 rgba(255, 255, 255, 0.075);
    }

    :host([data-theme-dark]) .standalone-menu.is-back {
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.1);
    }

    :host([data-theme-dark]) .pages-backdrop {
      background: rgba(0, 0, 0, 0.36);
    }

    :host([data-theme-dark]) .pages-sheet {
      border-color: rgba(255, 255, 255, 0.12);
      background:
        linear-gradient(180deg, rgba(38, 42, 52, 0.94), rgba(18, 20, 28, 0.9)),
        rgba(16, 18, 24, 0.92);
      box-shadow:
        0 28px 68px rgba(0, 0, 0, 0.62),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    :host([data-theme-dark]) .pages-handle {
      background: rgba(255, 255, 255, 0.18);
    }

    :host([data-theme-dark]) .pages-heading,
    :host([data-theme-dark]) .pages-heading ha-icon {
      color: rgba(248, 250, 252, 0.92);
    }

    :host([data-theme-dark]) .page-row {
      background: rgba(255, 255, 255, 0.07);
      color: rgba(248, 250, 252, 0.94);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.08),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }

    :host([data-theme-dark]) .page-row.active {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 18%, rgba(255, 255, 255, 0.08));
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--primary-color, #03a9f4) 42%, transparent),
        0 12px 28px rgba(0, 0, 0, 0.24);
    }

    :host([data-theme-dark]) .page-icon {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 20%, transparent);
    }

    :host([data-theme-dark]) .page-subtitle,
    :host([data-theme-dark]) .page-chevron {
      color: rgba(226, 232, 240, 0.54);
    }

    @media (prefers-reduced-motion: reduce) {
      .bar,
      .item,
      .standalone-menu,
      .pages-backdrop,
      .pages-sheet {
        transition-duration: 0.01ms !important;
      }
    }
  `,y([Fe()],ra.prototype,"_items",void 0),y([Fe()],ra.prototype,"_active",void 0),y([Fe()],ra.prototype,"_visible",void 0),y([Fe()],ra.prototype,"_areaContext",void 0),y([Fe()],ra.prototype,"_deviceContext",void 0),y([Fe()],ra.prototype,"_pages",void 0),y([Fe()],ra.prototype,"_pagesOpen",void 0),y([Fe()],ra.prototype,"_restrictedMenuOpen",void 0),ra=y([Oe("dwains-dashboard-next-bottom-nav")],ra);let ha=!1;function ma(e){const t=window.location.pathname.split("/")[1]||"lovelace";window.history.pushState(null,"",`/${t}/${e}`);const i=new Event("location-changed",{bubbles:!0,composed:!0});i.detail={replace:!1},window.dispatchEvent(i)}function ua(){Oi("/profile/general")}function ga(){const e=new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0});(Sa("home-assistant-main")||document.querySelector("home-assistant"))?.dispatchEvent(e)}function _a(e){return Boolean(e&&function(){const e=window.location.pathname.split("/")[1];return e&&"lovelace"!==e?e:"lovelace"}()===e)}function ba(e){return _a(e)&&window.matchMedia(Yi).matches}function va(e){const t=ba(e);document.documentElement.classList.toggle(Zi,t),document.body?.classList.toggle(Zi,t),t?sa():la(!1),pa("start"),t||fa()}function fa(){const e=Sa("ha-sidebar");e?.shadowRoot?.querySelector("#dd-sidebar-section")?.remove()}function xa(e){const t=(e.getAttribute("href")||"").toLowerCase(),i=(e.textContent||"").trim().toLowerCase();return t.includes("/config")||t.includes("/profile")||t.includes("/notifications")||"settings"===i||"instellingen"===i||"notifications"===i||"meldingen"===i}function ya(e,t){const i=function(e){return Array.from(e.querySelectorAll(["a[href]","ha-sidebar-item","ha-md-list-item","mwc-list-item","paper-item","paper-icon-item",'[role="listitem"]','[role="option"]'].join(","))).find(e=>!e.closest("#dd-sidebar-section")&&xa(e))||null}(e);if(i?.parentElement){const e=i.parentElement;return function(e){const t=Array.from(e.children).filter(e=>"dd-sidebar-section"!==e.id),i=t.filter(e=>xa(e)).length,a="string"==typeof e.className?e.className.toLowerCase():"";return i>0&&(t.length<=6||a.includes("footer")||a.includes("bottom")||a.includes("profile"))}(e)&&e.parentElement?void e.parentElement.insertBefore(t,e):void i.parentElement.insertBefore(t,i)}const a=function(e){return e.querySelector(".menu")||e.querySelector(".items")||e.querySelector("ha-md-list")||e.querySelector("mwc-list")||e.querySelector("paper-listbox")||e.querySelector("nav")||e}(e);a.appendChild(t)}function wa(e,t,i,a){const r=e.shadowRoot;if(!r)return;const n=r.querySelector("#dd-sidebar-section");if(!ba(a))return void n?.remove();n?.remove();const s=e=>o(t,e),l=c(t,i),p=d(t,i),h=document.createElement("div");h.id="dd-sidebar-section";const m=document.createElement("style");m.textContent="\n    #dd-sidebar-section {\n      margin: 10px 8px;\n      padding: 10px;\n      border-radius: 16px;\n      border: 1px solid rgba(var(--rgb-primary-color, 3, 169, 244), .16);\n      background: rgba(var(--rgb-primary-color, 3, 169, 244), .07);\n      box-sizing: border-box;\n    }\n    #dd-sidebar-section .dd-h {\n      font-size: 11px;\n      text-transform: uppercase;\n      letter-spacing: .06em;\n      color: var(--secondary-text-color);\n      padding: 2px 4px 8px;\n    }\n    #dd-sidebar-section .dd-item {\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      min-height: 44px;\n      padding: 8px 10px;\n      border-radius: 12px;\n      cursor: pointer;\n      color: var(--sidebar-text-color, var(--primary-text-color));\n      background: var(--card-background-color, white);\n      box-sizing: border-box;\n    }\n    #dd-sidebar-section .dd-item + .dd-item {\n      margin-top: 6px;\n    }\n    #dd-sidebar-section .dd-item:hover {\n      background: rgba(var(--rgb-primary-color, 3, 169, 244), .14);\n    }\n    #dd-sidebar-section .dd-item ha-icon {\n      color: var(--primary-color);\n      --mdc-icon-size: 22px;\n    }\n    #dd-sidebar-section .dd-item span {\n      font-size: 14px;\n      font-weight: 500;\n    }\n  ",h.appendChild(m);const u=document.createElement("div");u.className="dd-h",u.textContent=s("sidebar.section_title"),h.appendChild(u);const g=(e,t,i)=>{const a=document.createElement("div");a.className="dd-item",a.setAttribute("role","button");const o=document.createElement("ha-icon");o.setAttribute("icon",e),a.appendChild(o);const r=document.createElement("span");return r.textContent=t,a.appendChild(r),a.addEventListener("click",i),a};if(l)return h.appendChild(g("mdi:account-cog","Profile settings",()=>{ga(),ua()})),void ya(r,h);p?h.appendChild(g("mdi:account-cog","Profile settings",()=>{ga(),ua()})):(h.appendChild(g("mdi:cog",s("sidebar.dashboard_settings"),()=>{ga(),function(){"home"!==window.location.pathname.split("/")[2]&&ma("home");const e=()=>window.dispatchEvent(new CustomEvent("dwains-dashboard-next-open-settings"));e(),window.setTimeout(e,90),window.setTimeout(e,240)}()})),h.appendChild(g("mdi:puzzle-plus-outline",s("sidebar.add_blueprint"),()=>{ga(),ma("add-blueprint")}))),ya(r,h)}function ka(e,t,i){const a=window.location.pathname.split("/")[1]||"lovelace",o=(!i||a===i)&&c(e,t),r="\n    --app-drawer-width: 0px !important;\n    --mdc-drawer-width: 0px !important;\n    --drawer-width: 0px !important;\n    --ha-sidebar-width: 0px !important;\n    --sidebar-width: 0px !important;\n  ",n=`\n    html.dd-ha-sidebar-restricted,\n    body.dd-ha-sidebar-restricted,\n    body.dd-ha-sidebar-restricted home-assistant,\n    body.dd-ha-sidebar-restricted home-assistant-main {\n      ${r}\n    }\n\n    body.dd-ha-sidebar-restricted ha-sidebar,\n    body.dd-ha-sidebar-restricted app-drawer,\n    body.dd-ha-sidebar-restricted #drawer,\n    body.dd-ha-sidebar-restricted .drawer {\n      display: none !important;\n      visibility: hidden !important;\n      width: 0 !important;\n      min-width: 0 !important;\n      max-width: 0 !important;\n      flex: 0 0 0 !important;\n    }\n\n    body.dd-ha-sidebar-restricted app-drawer-layout,\n    body.dd-ha-sidebar-restricted home-assistant-main {\n      margin-left: 0 !important;\n      padding-left: 0 !important;\n      left: 0 !important;\n      width: 100vw !important;\n      max-width: none !important;\n    }\n  `,s=`\n    :host {\n      ${r}\n    }\n\n    ha-sidebar,\n    app-drawer,\n    #drawer,\n    .drawer {\n      display: none !important;\n      visibility: hidden !important;\n      width: 0 !important;\n      min-width: 0 !important;\n      max-width: 0 !important;\n      flex: 0 0 0 !important;\n    }\n\n    app-drawer-layout,\n    #layout,\n    #main,\n    main,\n    .content,\n    .main,\n    .panel,\n    [main],\n    [slot="main"],\n    partial-panel-resolver,\n    ha-panel-lovelace {\n      ${r}\n      margin-left: 0 !important;\n      padding-left: 0 !important;\n      left: 0 !important;\n      width: 100% !important;\n      max-width: none !important;\n    }\n  `;document.documentElement.classList.toggle("dd-ha-sidebar-restricted",o),document.body?.classList.toggle("dd-ha-sidebar-restricted",o);const d=(e,t)=>{let i=e.querySelector("#dd-restrict-ha-sidebar");const a=e instanceof Document?e.head||e.documentElement:e;o?(i||(i=document.createElement("style"),i.id="dd-restrict-ha-sidebar",a.appendChild(i)),i.textContent=t):i?.remove()};d(document,n);const l=document.querySelector("home-assistant"),p=Sa("home-assistant-main"),h=Sa("app-drawer-layout"),m=new Set;[l?.shadowRoot,p?.shadowRoot,h?.shadowRoot].forEach(e=>{e&&m.add(e)}),m.forEach(e=>d(e,s))}function $a(e,t,i,a=0){if(aa=e,ia=t,oa=i,!ba(i))return void fa();const o=Sa("ha-sidebar");o&&o.shadowRoot?(wa(o,e,t,i),ta||(ta=new MutationObserver(()=>{const e=Sa("ha-sidebar");e?.shadowRoot&&!e.shadowRoot.querySelector("#dd-sidebar-section")&&wa(e,aa,ia,oa)}),ta.observe(o.shadowRoot,{childList:!0,subtree:!0})),ha||(ha=!0,window.matchMedia(Yi).addEventListener("change",()=>{va(oa);const e=Sa("ha-sidebar");e&&wa(e,aa,ia,oa)}))):a<25&&setTimeout(()=>$a(e,t,i,a+1),300)}function Sa(e){const t=new Set,i=[document];for(;i.length;){const a=i.shift(),o=a.querySelector(e);if(o)return o;a.querySelectorAll("*").forEach(e=>{const a=e.shadowRoot;a&&!t.has(e)&&(t.add(e),i.push(a))})}return null}function Ca(e){const t=[],i=new Set,a=[document];for(;a.length;){const o=a.shift();o.querySelectorAll(e).forEach(e=>t.push(e)),o.querySelectorAll("*").forEach(e=>{const t=e.shadowRoot;t&&!i.has(e)&&(i.add(e),a.push(t))})}return t}var Aa=Object.freeze({__proto__:null,get DwainsBottomNav(){return ra},ensureBottomNav:na});const Ea=new Map;let za,Da=!1;const Ha=e=>{if(Da)return;Da=!0;const t=()=>{za=window.setInterval(()=>{Ea.size>0?Ea.forEach(t=>{t&&"hass"in t&&(t.hass=e.hass)}):za&&(clearInterval(za),za=void 0)},100)};e.addEventListener("show-dialog",async i=>{const a=i;a.stopPropagation(),a.stopImmediatePropagation();const{dialogTag:o,dialogImport:r,dialogParams:n}=a.detail;if(Ea.has(o))return void console.warn(`Dialog ${o} is already open`);await r();const s=document.querySelector(o);s&&s.remove();const c=document.createElement(o);c.hass=e.hass,Ea.set(o,c),document.body.appendChild(c),requestAnimationFrame(()=>{c.showDialog(n)});c.addEventListener("dialog-closed",()=>{Ea.delete(o),document.body.contains(c)&&c.remove(),0===Ea.size&&za&&(clearInterval(za),za=void 0)},{once:!0}),1!==Ea.size||za||t()},{capture:!0})};class Ma extends HTMLElement{constructor(){super(...arguments),this._child=null,this._hasRendered=!1}set hass(e){this._hass=e,this._child&&(this._child.hass=e)}get hass(){return this._hass}set config(e){this._config=e,this._renderWhenVisible()}get config(){return this._config}connectedCallback(){this.style.display="block",this.style.setProperty("content-visibility","auto"),this.style.setProperty("contain-intrinsic-size","120px"),this._renderWhenVisible()}disconnectedCallback(){this._observer?.disconnect(),this._observer=void 0,this._hasRendered=!1,this._child=null,this.innerHTML=""}_renderWhenVisible(){if(this.isConnected&&this._config)return this._child||this._hasRendered||this.hasAttribute("eager")||!("IntersectionObserver"in window)?(this._hasRendered=!0,this._observer?.disconnect(),this._observer=void 0,void this._render()):void(this._observer||(this._observer=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&(this._observer?.disconnect(),this._observer=void 0,this._hasRendered=!0,this._render())},{rootMargin:"700px 0px"}),this._observer.observe(this)))}_render(){if(this.isConnected&&this._config){this._child&&this.contains(this._child)||(this._child=document.createElement("hui-card"),this.innerHTML="",this.appendChild(this._child));try{this._hass&&(this._child.hass=this._hass),this._child.config=this._config}catch(e){console.warn("dwains-dashboard-next-card-host: kaart configureren mislukt",e)}}}}customElements.get("dwains-dashboard-next-card-host")||customElements.define("dwains-dashboard-next-card-host",Ma);class La extends HTMLElement{constructor(){super(...arguments),this._child=null}static get observedAttributes(){return["entity","name"]}set hass(e){this._hass=e,this._child&&(this._child.hass=e)}get hass(){return this._hass}attributeChangedCallback(e,t,i){"entity"===e&&(this._entityId=i??void 0),"name"===e&&(this._name=i??void 0),this._ensureChild()}connectedCallback(){this.style.display="block",this._ensureChild()}disconnectedCallback(){this._child=null,this.innerHTML=""}async _ensureChild(){if(this.isConnected&&this._entityId)if(this._child&&this.contains(this._child)&&this._child.getAttribute("data-entity")===this._entityId)this._hass&&(this._child.hass=this._hass);else{if(!customElements.get("hui-tile-card"))try{await customElements.whenDefined("hui-tile-card")}catch{return}this._child&&this.contains(this._child)||(this._child=document.createElement("hui-tile-card"),this._child.classList.add("favorite-tile"),this._child.setAttribute("data-entity",this._entityId),this.innerHTML="",this.appendChild(this._child));try{if("setConfig"in this._child){const e={entity:this._entityId};this._name&&(e.name=this._name),this._child.setConfig(e)}this._hass&&this.contains(this._child)&&(this._child.hass=this._hass)}catch(e){console.warn("dwains-dashboard-next-tile-host: failed to configure tile",e)}}}}customElements.get("dwains-dashboard-next-tile-host")||customElements.define("dwains-dashboard-next-tile-host",La);const Ia="dd-next-area-sidebar-width",Pa="dd-next-area-sidebar-collapsed",ja=240,Ta="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z";let Na=class extends Te{constructor(){super(...arguments),this._t=(e,t)=>o(this.hass,e,t),this._tp=(e,t)=>r(this.hass,e,t),this._selectedArea=null,this._selectedView=null,this._isMobile=!1,this._headerExpanded=!1,this._headerCompact=!1,this._favoritesRenderVersion=0,this._currentTime="",this._currentDate="",this._mobileNavOpen=!1,this._hasRelevantStateChanges=!1,this._editMode=!1,this._notificationsOpen=!1,this._persistentNotifications=[],this._notificationsLoading=!1,this._notificationsError="",this._mobileDomainMenu=null,this._areaHeaderStuck=!1,this._areaHeaderRevealed=!1,this._mobileEntityLayout="rail",this._mobileHomeAreasLayout="rail",this._mobileHomeDevicesLayout="rail",this._mobileHomeFavoritesLayout="rail",this._mobileHomeCamerasLayout="rail",this._areaSidebarWidth=250,this._areaSidebarCollapsed=!1,this._isResizingSidebar=!1,this._repairsIssueCount=0,this._discoveredDeviceCount=0,this._suggestedFavoriteEntities=[],this._customCardDrag=null,this._customCardDragOver=null,this._optimisticEntityStates={},this._renderAllMobileHomeAreas=!1,this._renderAllMobileAreaEntities=!1,this._settingsDirty=!1,this._settingsSavePending=!1,this._settingsSaveError="",this._areaEntitiesCache=new Map,this._areaDataCache=new Map,this._domainCountsCache=new Map,this._CACHE_DURATION=5e3,this._persistentNotificationsLoaded=!1,this._homeSummariesLoaded=!1,this._favoriteSuggestionsLoaded=!1,this._favoriteSuggestionsLoading=!1,this._pendingAreaScrollTop=0,this._lastAreaScrollTop=0,this._areaScrollUpDistance=0,this._pictureContrastCache=new Map,this._areaSidebarScrollTop=0,this._settingsEditorInitialized=!1,this._handleResize=()=>{if(this._closeMobileDomainMenu(),this._checkMobile(),!this._isMobile){const e=this._clampAreaSidebarWidth(this._areaSidebarWidth);e!==this._areaSidebarWidth&&(this._areaSidebarWidth=e)}this._updateAreaHeaderScrollState()},this._handleSidebarScroll=e=>{if(this._isMobile)return;const t=e.currentTarget;t&&(this._areaSidebarScrollTop=t.scrollTop)},this._handleContentScroll=e=>{if(!this._isMobile||"area"!==this._selectedView)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));const t=e.currentTarget,i=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||t?.scrollTop||0;this._pendingAreaScrollTop=i,this._areaHeaderScrollRaf||(this._areaHeaderScrollRaf=requestAnimationFrame(()=>{this._areaHeaderScrollRaf=void 0,this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop,!0)}))},this._handleWindowScroll=()=>{this._isMobile&&"area"===this._selectedView&&(this._pendingAreaScrollTop=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,this._areaHeaderScrollRaf||(this._areaHeaderScrollRaf=requestAnimationFrame(()=>{this._areaHeaderScrollRaf=void 0,this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop,!0)})))},this._handleShowMoreInfo=e=>{Fi(this,"hass-more-info",{entityId:e.detail.entityId})},this._startSidebarResize=e=>{this._isMobile||0!==e.button||(e.preventDefault(),this._sidebarResizePointerId=e.pointerId,this._isResizingSidebar=!0,e.currentTarget?.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._handleSidebarResizeMove),window.addEventListener("pointerup",this._handleSidebarResizeEnd),window.addEventListener("pointercancel",this._handleSidebarResizeEnd))},this._handleSidebarResizeMove=e=>{if(!this._isResizingSidebar||this._isMobile)return;if(void 0!==this._sidebarResizePointerId&&e.pointerId!==this._sidebarResizePointerId)return;const t=this.renderRoot?.querySelector(".layout-container"),i=t?.getBoundingClientRect().left??0,a=e.clientX-i;a<=96?this._areaSidebarCollapsed=!0:(this._areaSidebarCollapsed&&(this._areaSidebarCollapsed=!1),this._areaSidebarWidth=this._clampAreaSidebarWidth(a))},this._handleSidebarResizeEnd=e=>{this._isResizingSidebar&&(e&&void 0!==this._sidebarResizePointerId&&e.pointerId!==this._sidebarResizePointerId||(this._isResizingSidebar=!1,this._sidebarResizePointerId=void 0,this._saveAreaSidebarWidthPreference(this._areaSidebarWidth),this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed),window.removeEventListener("pointermove",this._handleSidebarResizeMove),window.removeEventListener("pointerup",this._handleSidebarResizeEnd),window.removeEventListener("pointercancel",this._handleSidebarResizeEnd)))},this._toggleAreaSidebarCollapsed=e=>{e?.stopPropagation(),this._isMobile||(this._areaSidebarCollapsed=!this._areaSidebarCollapsed,this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed),this._areaSidebarCollapsed||(this._areaSidebarWidth=this._clampAreaSidebarWidth(this._areaSidebarWidth||250),this._saveAreaSidebarWidthPreference(this._areaSidebarWidth)))},this._handleSidebarResizeKeydown=e=>{if(this._isMobile)return;let t=this._areaSidebarWidth;if("ArrowLeft"===e.key)t-=e.shiftKey?40:20;else if("ArrowRight"===e.key)t+=e.shiftKey?40:20;else if("Home"===e.key)t=ja;else{if("End"!==e.key)return;t=660}e.preventDefault(),this._areaSidebarWidth=this._clampAreaSidebarWidth(t),this._saveAreaSidebarWidthPreference(this._areaSidebarWidth)},this._toggleMobileEntityLayout=e=>{e?.stopPropagation(),this._mobileEntityLayout="rail"===this._mobileEntityLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-entity-layout",this._mobileEntityLayout)}catch{}},this._toggleMobileHomeAreasLayout=e=>{e?.stopPropagation(),this._mobileHomeAreasLayout="rail"===this._mobileHomeAreasLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-areas-layout",this._mobileHomeAreasLayout)}catch{}},this._toggleMobileHomeDevicesLayout=e=>{e?.stopPropagation(),this._mobileHomeDevicesLayout="rail"===this._mobileHomeDevicesLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-devices-layout",this._mobileHomeDevicesLayout)}catch{}},this._toggleMobileHomeFavoritesLayout=e=>{e?.stopPropagation(),this._mobileHomeFavoritesLayout="rail"===this._mobileHomeFavoritesLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-favorites-layout",this._mobileHomeFavoritesLayout)}catch{}},this._toggleMobileHomeCamerasLayout=e=>{e?.stopPropagation(),this._mobileHomeCamerasLayout="rail"===this._mobileHomeCamerasLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-cameras-layout",this._mobileHomeCamerasLayout)}catch{}},this._debouncedUpdate=()=>{this._updateDebounceTimer&&clearTimeout(this._updateDebounceTimer),this._updateDebounceTimer=window.setTimeout(()=>{this.requestUpdate()},100)},this._handleHousePowerKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDeviceDomain("energy"))},this._handleHouseClimateKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showHouseClimateEntities())},this._toggleEditMode=()=>{if(!this._canManageDashboard())return this._editMode=!1,void this._rememberAreaEditMode(null);this._editMode=!this._editMode,this._rememberAreaEditMode(this._editMode&&"area"===this._selectedView?this._selectedArea:null)},this._clearCustomCardDragState=()=>{this._customCardDrag=null,this._customCardDragOver=null},this._handleHomeNavigationKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._selectView("home"))},this._handleAreaNavToggle=()=>{this._isMobile&&this._toggleMobileNav()},this._handleOpenSettingsEvent=()=>{this._openDashboardSettings()},this._handleOpenHomeEvent=()=>{this._selectView("home")},this._openMobileAreaSwitcher=()=>{this._isMobile&&this._confirmDiscardSettings()&&(this._selectedView="home",this._selectedArea=null,this._resetAreaHeaderScrollState(!1),this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._clearSettingsEditState(),this._mobileNavOpen=!0)},this._openMobileDeviceSwitcher=()=>{this._isMobile&&(this._navigateToDeviceDomain(null),[160,360,700].forEach(e=>{window.setTimeout(()=>{window.dispatchEvent(new CustomEvent("dwains-dashboard-next-toggle-devices-nav",{detail:{open:!0}}))},e)}))},this._handleSettingsConfigChanged=e=>{e.stopPropagation();const t=e.detail;this._pendingSettingsConfig=t?.config,this._settingsDirty=Boolean(this._pendingSettingsConfig),this._settingsSaveError=""},this._closeSettingsPage=()=>{this._confirmDiscardSettings()&&(this._clearSettingsEditState(),this._selectView("home"))},this._openDashboardSettings=()=>{this._canManageDashboard()&&(this._closeMobileDomainMenu(),this._resetAreaHeaderScrollState(!0),this._selectedArea=null,this._selectedView="settings",this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1,this._closeMobileNav(),this._syncBottomNavAreaContext(),this.updateComplete.then(()=>this._scrollContentAreaToTop()))},this._openProfileSettings=()=>{Oi("/profile/general")},this._openNotificationsFromHomeShortcut=e=>{e.preventDefault(),e.stopPropagation(),this._closeMobileNav(),this._openNotifications()},this._openNotifications=()=>{this._showNotificationsUi()&&(this._notificationsOpen=!0,this._persistentNotificationsLoaded=!0,this._loadPersistentNotifications(!0),this._ensurePersistentNotificationsSubscription())},this._closeNotifications=()=>{this._notificationsOpen=!1},this._dismissPersistentNotification=async e=>{const t=this._persistentNotifications;this._persistentNotifications=t.filter(t=>t.notification_id!==e);try{await this.hass.callService("persistent_notification","dismiss",{notification_id:e}),this._notificationsError=""}catch(e){console.error("Failed to dismiss persistent notification:",e),this._persistentNotifications=t,this._notificationsError=this._t("error.notification_dismiss")}},this._dismissAllPersistentNotifications=async()=>{const e=this._persistentNotifications;this._persistentNotifications=[];try{await this.hass.callService("persistent_notification","dismiss_all"),this._notificationsError=""}catch(t){console.error("Failed to dismiss all persistent notifications:",t),this._persistentNotifications=e,this._notificationsError=this._t("error.notifications_dismiss_all")}}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(this.config=e,!this._selectedView){const t=this._getUrlArea();t&&e.areas?.some(e=>e.area_id===t)?(this._selectedArea=t,this._selectedView="area"):this._selectedView="home"}this._restoreAreaEditMode()}_getUrlArea(){try{return new URL(window.location.href).searchParams.get("dd_area")}catch{return null}}_updateUrlArea(e){try{const t=new URL(window.location.href);e?t.searchParams.set("dd_area",e):t.searchParams.delete("dd_area"),window.history.replaceState(window.history.state,"",t.toString())}catch{}}_syncBottomNavAreaContext(){const e=this.config?.areas?.find(e=>e.area_id===this._selectedArea),t="settings"===this._selectedView;window.dispatchEvent(new CustomEvent("dwains-dashboard-next-area-context-changed",{detail:{areaId:"area"===this._selectedView?this._selectedArea:null,icon:t?"mdi:cog-outline":e?Xt(e):"mdi:home",name:t?"Settings":e?.name||"Home",view:this._selectedView||"home"}}))}_canManageDashboard(){return!d(this.hass,this.config?.settings)}_areaEditModeStorageKey(){return`dd-next-area-edit-mode:${this._getDashboardUrlPath()||"default"}`}_rememberAreaEditMode(e){try{const t=this._areaEditModeStorageKey();if(!e)return void window.sessionStorage.removeItem(t);window.sessionStorage.setItem(t,JSON.stringify({areaId:e,updatedAt:Date.now()}))}catch{}}_restoreAreaEditMode(){if(!this._canManageDashboard())return this._editMode=!1,void this._rememberAreaEditMode(null);try{const e=window.sessionStorage.getItem(this._areaEditModeStorageKey());if(!e)return;const t=JSON.parse(e),i="number"==typeof t.updatedAt&&Date.now()-t.updatedAt<=3e4;if(!t.areaId||!i)return void this._rememberAreaEditMode(null);"area"===this._selectedView&&this._selectedArea===t.areaId&&(this._editMode=!0)}catch{this._rememberAreaEditMode(null)}}_showNotificationsUi(){return!1!==this.config?.settings?.show_notifications}_showSuggestedFavoritesUi(){return!1!==this.config?.settings?.show_suggested_favorites}_hasUsagePredictionComponent(){return Boolean(this.hass?.config?.components?.includes("usage_prediction"))}_isFavoriteEntityVisible(e){const t=this.hass?.states?.[e],i=this.hass?.entities?.[e];return Boolean(t&&"unavailable"!==t.state&&"unknown"!==t.state&&!i?.hidden_by&&!i?.hidden)}_getManualFavoriteEntities(){const e=new Set;return(this.config?.favorites||[]).filter(t=>!e.has(t)&&(e.add(t),this._isFavoriteEntityVisible(t)))}_getEffectiveFavoriteEntities(){const e=this._getManualFavoriteEntities();if(!this._showSuggestedFavoritesUi())return e;const t=Math.max(8,e.length);if(e.length>=t)return e.slice(0,t);const i=new Set(e),a=this._suggestedFavoriteEntities.filter(e=>!i.has(e)&&(!!this._isFavoriteEntityVisible(e)&&(i.add(e),!0)));return[...e,...a].slice(0,t)}_ensureFavoriteSuggestionsFeature(){if(this.hass&&this._showSuggestedFavoritesUi()&&!this._favoriteSuggestionsLoaded&&!this._favoriteSuggestionsLoading)return this._hasUsagePredictionComponent()?void(this._getManualFavoriteEntities().length>=8||this._loadFavoriteSuggestions()):(this._favoriteSuggestionsLoaded=!0,void(this._suggestedFavoriteEntities=[]))}async _loadFavoriteSuggestions(){if(this.hass&&!this._favoriteSuggestionsLoading){this._favoriteSuggestionsLoading=!0;try{const e=await this.hass.callWS({type:"usage_prediction/common_control"});this._suggestedFavoriteEntities=Array.isArray(e?.entities)?e.entities.filter(e=>"string"==typeof e):[]}catch(e){console.debug("Dwains Dashboard: favorite suggestions are not available.",e),this._suggestedFavoriteEntities=[]}finally{this._favoriteSuggestionsLoading=!1,this._favoriteSuggestionsLoaded=!0}}}_ensurePersistentNotificationsFeature(){this._showNotificationsUi()&&this.hass&&!this._persistentNotificationsLoaded&&(this._persistentNotificationsLoaded=!0,this._loadPersistentNotifications(!1),this._ensurePersistentNotificationsSubscription())}static getStubConfig(){return{type:"custom:dwains-dashboard-next-layout-card",areas:[],devices:[],entities:[],floors:[],settings:{},favorites:[]}}connectedCallback(){super.connectedCallback(),this._syncThemeAttribute(),this._loadMobileEntityLayoutPreference(),this._loadAreaSidebarWidthPreference(),this._loadAreaSidebarCollapsedPreference(),this._checkMobile(),this._setupEventListeners(),window.addEventListener("dwains-dashboard-next-toggle-area-nav",this._handleAreaNavToggle),window.addEventListener("dwains-dashboard-next-open-settings",this._handleOpenSettingsEvent),window.addEventListener("dwains-dashboard-next-open-home",this._handleOpenHomeEvent),this._startTimeUpdate(),this._initializeObservers(),Ha(this)}willUpdate(e){if(super.willUpdate(e),e.has("config")&&this.hass&&(this._clearEntityCardsCache(),na(this.hass,this.config?.settings),!this._canManageDashboard()&&this._editMode&&(this._editMode=!1,this._rememberAreaEditMode(null))),e.has("hass")&&this.hass){this._syncThemeAttribute(),na(this.hass,this.config?.settings),this._syncBottomNavAreaContext(),this._reconcileOptimisticEntityStates(),!this._canManageDashboard()&&this._editMode&&(this._editMode=!1,this._rememberAreaEditMode(null));const t=e.get("hass");t&&this._shouldUpdateEntities(t,this.hass)&&(this._invalidateChangedAreaCaches(t,this.hass),this._hasRelevantStateChanges=!0)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("dwains-dashboard-next-toggle-area-nav",this._handleAreaNavToggle),window.removeEventListener("dwains-dashboard-next-open-settings",this._handleOpenSettingsEvent),window.removeEventListener("dwains-dashboard-next-open-home",this._handleOpenHomeEvent),window.removeEventListener("pointermove",this._handleSidebarResizeMove),window.removeEventListener("pointerup",this._handleSidebarResizeEnd),window.removeEventListener("pointercancel",this._handleSidebarResizeEnd),this._persistentNotificationsUnsub?.(),this._persistentNotificationsUnsub=void 0,this._removeMobileDomainMenuPortal(),this._cleanupEventListeners(),this._cleanupObservers(),this._timeInterval&&clearInterval(this._timeInterval),this._homeSummariesRefreshInterval&&(clearInterval(this._homeSummariesRefreshInterval),this._homeSummariesRefreshInterval=void 0),this._areaHeaderScrollRaf&&(cancelAnimationFrame(this._areaHeaderScrollRaf),this._areaHeaderScrollRaf=void 0),void 0!==this._areaSidebarRestoreRaf&&(cancelAnimationFrame(this._areaSidebarRestoreRaf),this._areaSidebarRestoreRaf=void 0),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0),this._progressiveRenderCancel&&(this._progressiveRenderCancel(),this._progressiveRenderCancel=void 0)}_setupEventListeners(){window.addEventListener("resize",this._handleResize),window.addEventListener("scroll",this._handleWindowScroll,{passive:!0}),this.addEventListener("show-more-info",this._handleShowMoreInfo)}_cleanupEventListeners(){window.removeEventListener("resize",this._handleResize),window.removeEventListener("scroll",this._handleWindowScroll),this.removeEventListener("show-more-info",this._handleShowMoreInfo)}_isDesktopAreaSidebarCollapsed(){return this._areaSidebarCollapsed&&!this._isMobile}_restoreAreaSidebarScroll(){this._isMobile||this._isDesktopAreaSidebarCollapsed()||(void 0!==this._areaSidebarRestoreRaf&&cancelAnimationFrame(this._areaSidebarRestoreRaf),this._areaSidebarRestoreRaf=requestAnimationFrame(()=>{this._areaSidebarRestoreRaf=void 0;const e=this.shadowRoot?.querySelector(".sidebar");if(!e)return;const t=Math.max(0,e.scrollHeight-e.clientHeight),i=Math.min(this._areaSidebarScrollTop,t);Math.abs(e.scrollTop-i)>1&&(e.scrollTop=i)}))}_scrollContentAreaToTop(){const e=this.shadowRoot?.querySelector(".content-area"),t=new Set;e&&t.add(e);(e=>{let i=e;for(;i;){if(i instanceof HTMLElement&&t.add(i),i.parentNode){i=i.parentNode;continue}const e=i.getRootNode();i=e instanceof ShadowRoot?e.host:null}})(e||this);for(const e of t)e.scrollTop=0,e.scrollLeft=0;const i=document.scrollingElement;i&&(i.scrollTop=0,i.scrollLeft=0),document.documentElement.scrollTop=0,document.documentElement.scrollLeft=0,document.body.scrollTop=0,document.body.scrollLeft=0,window.scrollTo(0,0)}_resetAreaHeaderScrollState(e=!1){this._areaHeaderScrollRaf&&(cancelAnimationFrame(this._areaHeaderScrollRaf),this._areaHeaderScrollRaf=void 0),e&&this._scrollContentAreaToTop(),this._pendingAreaScrollTop=0,this._areaHeaderStuck&&(this._areaHeaderStuck=!1),this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1),this._lastAreaScrollTop=0,this._areaScrollUpDistance=0}_resetAreaHeaderAfterNavigation(){this._resetAreaHeaderScrollState(!0),requestAnimationFrame(()=>this._resetAreaHeaderScrollState(!0)),requestAnimationFrame(()=>requestAnimationFrame(()=>this._resetAreaHeaderScrollState(!0))),window.setTimeout(()=>this._resetAreaHeaderScrollState(!0),80),window.setTimeout(()=>this._resetAreaHeaderScrollState(!0),220)}_resetProgressiveMobileRender(){this._renderAllMobileHomeAreas=!this._isMobile,this._renderAllMobileAreaEntities=!this._isMobile,this._progressiveRenderCancel&&(this._progressiveRenderCancel(),this._progressiveRenderCancel=void 0)}_scheduleProgressiveMobileRender(){if(!this._isMobile)return this._renderAllMobileHomeAreas=!0,void(this._renderAllMobileAreaEntities=!0);if(this._renderAllMobileHomeAreas&&this._renderAllMobileAreaEntities)return;if(this._progressiveRenderCancel)return;const e=()=>{this._progressiveRenderCancel=void 0,this._renderAllMobileHomeAreas=!0,this._renderAllMobileAreaEntities=!0},t=window.requestIdleCallback,i=window.cancelIdleCallback;if(t&&i){const a=t(e,{timeout:450});this._progressiveRenderCancel=()=>i(a)}else{const t=window.setTimeout(e,90);this._progressiveRenderCancel=()=>window.clearTimeout(t)}}_updateAreaHeaderScrollState(){const e=this.shadowRoot?.querySelector(".content-area");if(!this._isMobile||"area"!==this._selectedView||!e)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));const t=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||e.scrollTop||0;this._setAreaHeaderStuckForScroll(t,!1)}_setAreaHeaderStuckForScroll(e,t){if(!this._isMobile||"area"!==this._selectedView)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1),this._lastAreaScrollTop=0,void(this._areaScrollUpDistance=0);if(!t){this._lastAreaScrollTop=e,this._areaScrollUpDistance=0;const t=e>76;return this._areaHeaderStuck!==t&&(this._areaHeaderStuck=t),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1))}const i=e-this._lastAreaScrollTop;if(this._lastAreaScrollTop=e,e<=2)return this._areaScrollUpDistance=0,this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));i<-1?this._areaScrollUpDistance+=Math.abs(i):i>1&&(this._areaScrollUpDistance=0);let a=this._areaHeaderStuck,o=this._areaHeaderRevealed;i>1&&e>76&&(a=!0,o=!1),this._areaHeaderStuck&&this._areaScrollUpDistance>=18&&e>88&&(o=!0),e<=38&&(a=!1,o=!1),this._areaHeaderStuck!==a&&(this._areaHeaderStuck=a),this._areaHeaderRevealed!==o&&(this._areaHeaderRevealed=o)}_checkMobile(){const e=this._isMobile;this._isMobile=window.innerWidth<=768,e!==this._isMobile&&(this._mobileNavOpen=!1)}_startTimeUpdate(){this._updateTime(),this._timeInterval=window.setInterval(()=>this._updateTime(),6e4)}_updateTime(){const e=new Date;this._currentTime=e.toLocaleTimeString(this.hass?.language||"en",{hour:"2-digit",minute:"2-digit",hour12:!1}),this._currentDate=e.toLocaleDateString(this.hass?.language||"en",{weekday:"short",day:"numeric",month:"short"})}_loadMobileEntityLayoutPreference(){try{const e=window.localStorage.getItem("dd-next-mobile-entity-layout"),t=window.localStorage.getItem("dd-next-mobile-home-areas-layout"),i=window.localStorage.getItem("dd-next-mobile-home-devices-layout"),a=window.localStorage.getItem("dd-next-mobile-home-favorites-layout"),o=window.localStorage.getItem("dd-next-mobile-home-cameras-layout");"rail"!==e&&"grid"!==e||(this._mobileEntityLayout=e),"rail"!==t&&"grid"!==t||(this._mobileHomeAreasLayout=t),"rail"!==i&&"grid"!==i||(this._mobileHomeDevicesLayout=i),"rail"!==a&&"grid"!==a||(this._mobileHomeFavoritesLayout=a),"rail"!==o&&"grid"!==o||(this._mobileHomeCamerasLayout=o)}catch{}}_loadAreaSidebarWidthPreference(){try{const e=window.localStorage.getItem(Ia);if(!e)return;const t=Number(e);Number.isFinite(t)&&(this._areaSidebarWidth=this._clampAreaSidebarWidth(t))}catch{}}_saveAreaSidebarWidthPreference(e){try{window.localStorage.setItem(Ia,String(Math.round(e)))}catch{}}_loadAreaSidebarCollapsedPreference(){try{this._areaSidebarCollapsed="true"===window.localStorage.getItem(Pa)}catch{}}_saveAreaSidebarCollapsedPreference(e){try{window.localStorage.setItem(Pa,e?"true":"false")}catch{}}_clampAreaSidebarWidth(e){const t=Math.max(ja,Math.min(660,Math.floor(.46*window.innerWidth)));return Math.round(Math.max(ja,Math.min(t,e)))}_initializeObservers(){this._resizeObserver=new ResizeObserver(()=>{this._debouncedUpdate()}),this.shadowRoot&&this._resizeObserver.observe(this.shadowRoot.host)}_cleanupObservers(){this._resizeObserver&&this._resizeObserver.disconnect()}shouldUpdate(e){if(!this.config||!this.hass)return!1;if(e.has("config")||e.has("_selectedView")||e.has("_selectedArea")||e.has("_headerExpanded")||e.has("_currentTime"))return!0;if(e.has("hass")){const t=e.get("hass");if(!t)return!0;if(this._hasUpdateEntityChanges(t,this.hass))return!0;return this._getRelevantEntities().some(e=>t.states[e]!==this.hass.states[e])}return!0}updated(e){if(super.updated(e),e.has("hass")&&this.hass){const t=e.get("hass");t&&this._updateEntityCards(t,this.hass),this._headerExpanded&&this._renderFavoriteTileCards(),this._ensurePersistentNotificationsFeature(),this._homeSummariesLoaded||(this._homeSummariesLoaded=!0,this._loadHomeAssistantSummaries(),this._homeSummariesRefreshInterval=window.setInterval(()=>{this._loadHomeAssistantSummaries()},3e5)),this._ensureFavoriteSuggestionsFeature()}e.has("config")&&(this._showNotificationsUi()?this._ensurePersistentNotificationsFeature():(this._notificationsOpen=!1,this._persistentNotificationsLoaded=!1,this._persistentNotifications=[]),this._showSuggestedFavoritesUi()?this._ensureFavoriteSuggestionsFeature():(this._favoriteSuggestionsLoaded=!1,this._favoriteSuggestionsLoading=!1,this._suggestedFavoriteEntities=[])),(e.has("_selectedView")||e.has("_selectedArea")||e.has("config"))&&(this._syncBottomNavAreaContext(),this._restoreAreaSidebarScroll()),e.has("_isMobile")&&this._restoreAreaSidebarScroll(),this._hasRelevantStateChanges&&(this._hasRelevantStateChanges=!1),e.has("_headerExpanded")&&this._headerExpanded&&this.hass&&setTimeout(()=>{this._renderFavoriteTileCards()},0),(e.has("_selectedView")||e.has("_selectedArea"))&&(this._resetProgressiveMobileRender(),"area"===this._selectedView?this._resetAreaHeaderAfterNavigation():this._resetAreaHeaderScrollState(!1)),(e.has("_selectedView")||e.has("_selectedArea")||e.has("_isMobile")||this._isMobile&&(!this._renderAllMobileHomeAreas||!this._renderAllMobileAreaEntities))&&this._scheduleProgressiveMobileRender(),"settings"===this._selectedView&&this._syncSettingsEditor()}_syncThemeAttribute(){this.toggleAttribute("data-theme-dark",Bi(this.hass,this))}_getRelevantEntities(){if(!this.config)return[];if("settings"===this._selectedView)return[];if("area"===this._selectedView&&this._selectedArea){return this._getAreaEntities(this._selectedArea).map(e=>e.entity_id)}return this.config.entities?.map(e=>e.entity_id)||[]}render(){if(!this.hass||!this.config)return fe`<div class="loading">${this._t("common.loading")}</div>`;const e={"layout-container":!0,"sidebar-resizing":this._isResizingSidebar,"sidebar-collapsed":this._isDesktopAreaSidebarCollapsed()};return fe`
      <div
        class=${pi(e)}
        style=${`--area-sidebar-width: ${this._areaSidebarWidth}px;`}
      >
        ${this._renderMobileOverlay()}
        ${this._renderSidebar()}
        ${this._isMobile?ye:this._renderSidebarResizeHandle()}
        <div class="main-content">
          ${"area"!==this._selectedView||this._isMobile?ye:this._renderGlobalHeader()}
          <div
            class="content-area ${"home"===this._selectedView?"home-content-area":""} ${"area"===this._selectedView?"area-content-area":""} ${"settings"===this._selectedView?"settings-content-area":""}"
            @scroll=${this._handleContentScroll}
          >
            ${"home"===this._selectedView?this._renderHomeView():"area"===this._selectedView&&this._selectedArea?this._renderAreaView():"settings"===this._selectedView?this._renderSettingsView():ye}
          </div>
        </div>
      </div>
      ${this._renderToast()}
      ${this._renderConfirmationDialog()}
      ${this._renderNotificationsPanel()}
    `}_renderSidebarResizeHandle(){const e=this._isDesktopAreaSidebarCollapsed();return fe`
      <button
        class="sidebar-collapse-toggle ${e?"is-collapsed":""}"
        type="button"
        title=${e?this._t("sidebar.show"):this._t("sidebar.collapse")}
        aria-label=${e?this._t("sidebar.show"):this._t("sidebar.collapse")}
        @click=${this._toggleAreaSidebarCollapsed}
      >
        <ha-icon icon=${e?"mdi:chevron-right":"mdi:chevron-left"}></ha-icon>
      </button>
      ${e?ye:fe`
      <button
        class="sidebar-resize-handle"
        type="button"
        role="separator"
        aria-label=${this._t("sidebar.resize")}
        aria-orientation="vertical"
        aria-valuemin=${ja}
        aria-valuemax=${660}
        aria-valuenow=${this._areaSidebarWidth}
        title=${this._t("sidebar.resize_drag")}
        @pointerdown=${this._startSidebarResize}
        @keydown=${this._handleSidebarResizeKeydown}
      ></button>
      `}
    `}_renderMobileOverlay(){return this._isMobile?fe`
      <div
        class="mobile-nav-overlay ${this._mobileNavOpen?"open":""}"
        @click=${this._closeMobileNav}
      ></div>
    `:ye}_renderNotificationsPanel(){if(!this._showNotificationsUi())return ye;const e=this._persistentNotifications.length,t=e>0;return fe`
      <div
        class="notifications-overlay ${this._notificationsOpen?"open":""}"
        @click=${this._closeNotifications}
      ></div>
      <section
        class="notifications-panel ${this._notificationsOpen?"open":""}"
        aria-hidden=${this._notificationsOpen?"false":"true"}
      >
        <div class="notifications-head">
          <div class="notifications-title">
            <div class="notifications-title-row">
              <ha-icon icon="mdi:bell-outline"></ha-icon>
              <span>${this._t("home.notifications")}</span>
            </div>
            <div class="notifications-subtitle">
              ${t?`${e} persistent ${1===e?"notification":"notifications"}`:"Persistent notifications from Home Assistant"}
            </div>
          </div>
          <div class="notifications-actions">
            ${t?fe`
              <button
                class="notifications-icon-button"
                type="button"
                title=${this._t("common.dismiss_all")}
                @click=${this._dismissAllPersistentNotifications}
              >
                <ha-icon icon="mdi:delete-sweep-outline"></ha-icon>
              </button>
            `:ye}
            <button
              class="notifications-icon-button"
              type="button"
              title=${this._t("common.refresh")}
              @click=${()=>this._loadPersistentNotifications(!0)}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
            <button
              class="notifications-icon-button"
              type="button"
              title=${this._t("common.close")}
              @click=${this._closeNotifications}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        </div>

        <div class="notifications-list">
          ${this._notificationsLoading&&!t?fe`
                <div class="notifications-loading">
                  <ha-icon icon="mdi:loading"></ha-icon>
                  <span>${this._t("home.notifications_loading")}</span>
                </div>
              `:this._notificationsError?fe`
                  <div class="notifications-error">
                    <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                    <span>${this._notificationsError}</span>
                  </div>
                `:t?this._persistentNotifications.map(e=>this._renderPersistentNotification(e)):fe`
                    <div class="notifications-empty">
                      <ha-icon icon="mdi:bell-check-outline"></ha-icon>
                      <span>${this._t("home.notifications_empty")}</span>
                    </div>
                  `}
        </div>
      </section>
    `}_renderPersistentNotification(e){return fe`
      <article class="notification-row">
        <div class="notification-icon">
          <ha-icon icon="mdi:bell-badge-outline"></ha-icon>
        </div>
        <div class="notification-copy">
          <div class="notification-title">${e.title||this._t("home.notification")}</div>
          <div class="notification-message">${e.message}</div>
          ${e.created_at?fe`
            <div class="notification-date">${this._formatNotificationDate(e.created_at)}</div>
          `:ye}
        </div>
        <button
          class="notification-dismiss"
          type="button"
          title=${this._t("common.dismiss")}
          @click=${()=>this._dismissPersistentNotification(e.notification_id)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </article>
    `}_renderSidebar(){const e={sidebar:!0,open:this._isMobile&&this._mobileNavOpen},t=this._showNotificationsUi()&&this._persistentNotifications.length>0;return fe`
      <nav class=${pi(e)} @scroll=${this._handleSidebarScroll}>
        <div class="area-list">
          <div
            class="area-button home-button ${"home"===this._selectedView?"selected":""} ${t?"has-notifications":""}"
            role="button"
            tabindex="0"
            @click=${()=>this._selectView("home")}
            @keydown=${this._handleHomeNavigationKeydown}
          >
            <div class="area-icon">
              <ha-icon icon="mdi:home"></ha-icon>
            </div>
            <div class="area-info">
              <div class="area-name">${this._t("sidebar.home")}</div>
            </div>
            ${this._renderHomeNotificationShortcut()}
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </div>

          ${this._renderAreaButtons()}
        </div>
      </nav>
    `}_renderHomeNotificationShortcut(){if(!this._showNotificationsUi())return ye;const e=this._persistentNotifications.length;if(!e)return ye;const t=`${e} persistent ${1===e?"notification":"notifications"}`,i=e>99?"99+":String(e);return fe`
      <button
        class="home-notification-shortcut"
        type="button"
        title=${t}
        aria-label=${t}
        @click=${this._openNotificationsFromHomeShortcut}
      >
        <ha-icon icon="mdi:bell-outline"></ha-icon>
        <span class="home-notification-count">${i}</span>
      </button>
    `}_groupAreasByFloor(e){const t={};return e.forEach(e=>{let i="no_floor";if(e.floor_id&&this.config?.floors){const t=this.config.floors.find(t=>t.floor_id===e.floor_id);t?.name&&(i=t.name)}t[i]||(t[i]=[]),t[i].push(e)}),t}_getVisibleSortedAreas(){return this.config?.areas?Ot(this.config.areas,this.config.areas_display,a(this.hass)):[]}_renderAreaButtons(){if(!this.config?.areas)return ye;const e=this._getVisibleSortedAreas(),t=this._groupAreasByFloor(e),i=[...this.config.floors||[]],o=this.config.floors_display?.order||[];if(o.length){const e=new Map(o.map((e,t)=>[e,t]));i.sort((t,i)=>(e.get(t.floor_id)??Number.MAX_SAFE_INTEGER)-(e.get(i.floor_id)??Number.MAX_SAFE_INTEGER))}const r=new Map(i.map((e,t)=>[e.name,t])),n=new Intl.Collator(a(this.hass),{numeric:!0,sensitivity:"base"}),s=Object.entries(t).sort(([e],[t])=>{if("no_floor"===e)return 1;if("no_floor"===t)return-1;const i=r.get(e),a=r.get(t);return void 0!==i||void 0!==a?(i??Number.MAX_SAFE_INTEGER)-(a??Number.MAX_SAFE_INTEGER):n.compare(e,t)});return s.map(([e,t])=>{const i="no_floor"===e?this.hass.localize("ui.components.area-picker.no_floor")||"Unassigned spaces":e;return fe`
        <div class="floor-section">
          <div class="floor-header">
            <h3>${i}</h3>
          </div>
          <div class="floor-areas">
            ${at(t,e=>e.area_id,e=>this._renderAreaButton(e))}
          </div>
        </div>
      `})}_renderAreaButton(e){const t=this._getCachedAreaData(e),i=this._selectedArea===e.area_id,a=!!e.picture,o=a?this._getPictureContrastClass(e.picture):"";return fe`
          <button
            class="area-button ${i?"selected":""} ${a?"has-picture":""} ${o}"
            @click=${()=>this._selectArea(e.area_id)}
          >
            ${a?fe`
              <div class="area-background" style="background-image: url('${e.picture}');"></div>
            `:ye}

            <div class="area-content">
              <!-- Top section: Name and sensors -->
              <div class="area-top-section">
              <div class="area-name">${e.name}</div>
              ${t.temperature||t.humidity||t.wattage?fe`
                <div class="area-sensors">
                  ${[t.temperature,t.humidity,t.wattage].filter(Boolean).join(" • ")}
                </div>
              `:ye}
            </div>

              <!-- Bottom section: Icon and badges -->
              <div class="area-bottom-section">
                <!-- Left: Main area icon -->
                <div class="area-main-icon">
                  <ha-icon icon=${Xt(e)}></ha-icon>
                </div>

                <!-- Right: Info badges -->
                <div class="area-info-badges">
                  ${t.domains.light&&t.domains.light.on>0?fe`
                    <span class="info-badge light clickable"
                          style=${this._domainBadgeStyle("light")}
                          @click=${t=>this._handleLightToggle(t,e.area_id)}>
                      <ha-icon icon=${Kt("light")}></ha-icon>
                      <span class="badge-count">${t.domains.light.on}</span>
                    </span>
                  `:ye}

                  ${t.domains.switch&&t.domains.switch.on>0?fe`
                    <span class="info-badge switch" style=${this._domainBadgeStyle("switch")}>
                      <ha-icon icon=${Kt("switch")}></ha-icon>
                      <span class="badge-count">${t.domains.switch.on}</span>
                    </span>
                  `:ye}

                  ${t.domains.climate&&t.domains.climate.on>0?fe`
                    <span class="info-badge climate" style=${this._domainBadgeStyle("climate")}>
                      <ha-icon icon=${Kt("climate")}></ha-icon>
                      <span class="badge-count">${t.domains.climate.on}</span>
                    </span>
                  `:ye}

                  ${t.domains.media_player&&t.domains.media_player.on>0?fe`
                    <span class="info-badge media_player" style=${this._domainBadgeStyle("media_player")}>
                      <ha-icon icon=${Kt("media_player")}></ha-icon>
                      <span class="badge-count">${t.domains.media_player.on}</span>
                    </span>
                  `:ye}

                  ${t.domains.cover&&t.domains.cover.on>0?fe`
                    <span class="info-badge cover" style=${this._domainBadgeStyle("cover")}>
                      <ha-icon icon=${Kt("cover")}></ha-icon>
                      <span class="badge-count">${t.domains.cover.on}</span>
                    </span>
                  `:ye}

                  ${t.domains.fan&&t.domains.fan.on>0?fe`
                    <span class="info-badge fan" style=${this._domainBadgeStyle("fan")}>
                      <ha-icon icon=${Kt("fan")}></ha-icon>
                      <span class="badge-count">${t.domains.fan.on}</span>
                    </span>
                  `:ye}

                  ${t.domains.motion&&t.domains.motion.on>0?fe`
                    <span class="info-badge motion" style=${this._domainBadgeStyle("binary_sensor","motion")}>
                      <ha-icon icon=${Zt("binary_sensor","motion")}></ha-icon>
                      <span class="badge-count">${t.domains.motion.on}</span>
                    </span>
                  `:ye}

            ${t.alerts.length>0?fe`
                    <span class="info-badge alerts">
                      <ha-icon icon="mdi:alert-circle"></ha-icon>
                      <span class="badge-count">${t.alerts.length}</span>
                    </span>
            `:ye}
                </div>
              </div>
            </div>
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
        `}_renderGlobalHeader(){const e={"global-header":!0,compact:this._headerCompact,expanded:this._headerExpanded,mobile:this._isMobile};return fe`
      <header class=${pi(e)}>
        <div class="header-content">
          ${this._renderHeaderStatusCards()}

          ${this._isMobile?ye:fe`
            <div class="header-time-weather">
              ${!1!==this.config?.settings?.show_time?fe`
                <div class="header-time-section">
              <div class="header-time">${this._currentTime}</div>
              <div class="header-date">${this._currentDate}</div>
            </div>
          `:ye}
          ${this._renderWeatherDisplay()}
            </div>
          `}
        </div>

        <!-- Expanded content section (always in DOM to avoid Lit marker invalidation) -->
        <div class="header-expanded-content" style=${this._headerExpanded?"":"display:none"}>
          <div class="header-favorites">
            ${this._renderFavoritesSection()}
          </div>
        </div>

        ${"home"!==this._selectedView?this._renderHeaderExpandButton():ye}
      </header>
    `}_renderWeatherDisplay(){if(!this._weatherDisplayEnabled())return ye;const e=this._getWeatherEntity();if(!e)return ye;const t=this._formatWeatherTemperature(e);return t?fe`
      <div
        class="weather-compact"
        title=${this._weatherTitle(e)}
        aria-label=${this._weatherTitle(e)}
        @click=${()=>this._showMoreInfo(e.entity_id)}
      >
        <div class="weather-icon-compact">
          <ha-icon icon=${e.attributes.icon||"mdi:weather-cloudy"}></ha-icon>
        </div>
        <div class="weather-temp-compact">
          ${t}
        </div>
      </div>
    `:ye}_renderHeaderStatusCards(){const e=this._getStatusDomains();return fe`
      <div class="header-status-section">
        <div class="header-status-scroll">
          ${at(e,e=>`${e.domain}-${e.deviceClass||e.name}`,e=>fe`
              <div
                class="status-card-compact ${e.domain} ${e.value?"has-value":""} header-card"
                style=${this._domainStatusStyle(e.domain,e.deviceClass)}
                @click=${()=>this._handleStatusCardClick(e)}
                data-domain=${e.domain}
                title=${this._statusCardTitle(e)}
                aria-label=${this._statusCardTitle(e)}
              >
                <div class="status-card-icon-compact">
                  <ha-icon icon=${e.icon}></ha-icon>
                  ${e.count>0?fe`
                    <div class="status-card-badge-compact">${e.count}</div>
                  `:ye}
                </div>
                <div class="status-card-title-compact">${e.value||this._statusCardTitle(e)}</div>
                ${e.value?fe`<div class="status-card-subtitle-compact">${e.name}</div>`:ye}
              </div>
            `)}
        </div>
      </div>
    `}_renderHeaderExpandButton(){const e=this._getHiddenStatusCount();return fe`
      <button
        class="header-expand-button"
        @click=${this._toggleHeader}
        data-extra-count=${(e=>e??ye)(e||void 0)}
      >
        <ha-icon icon=${this._headerExpanded?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>
    `}_domainStatusStyle(e,t){return`--status-color: ${Yt(e,t)};`}_domainBadgeStyle(e,t){const i=Yt(e,t);return`--badge-color: ${i}; --area-badge-color: ${i};`}_statusCardTitle(e){const t=this._statusCardActiveLabel(e);if(t){if(1===e.count&&1===e.entities?.length){const i=this._entityAreaName(e.entities[0]);return i?`${t.singular} in ${i}`:t.singular}return t.plural}if("person"!==e.domain&&1===e.count&&1===e.entities?.length){const t=this._entityAreaName(e.entities[0]);if(t)return`${e.name} in ${t}`}return e.name}_statusCardActiveLabel(e){if("person"!==e.domain){if("light"===e.domain)return{singular:"Light on",plural:"Lights on"};if("switch"===e.domain)return{singular:"Switch on",plural:"Switches on"};if("cover"===e.domain)return{singular:"Cover open",plural:"Covers open"};if("fan"===e.domain)return{singular:"Fan on",plural:"Fans on"};if("lock"===e.domain)return{singular:"Lock unlocked",plural:"Locks unlocked"};if("climate"===e.domain)return{singular:"Climate active",plural:"Climate active"};if("media_player"===e.domain)return{singular:"Media player playing",plural:"Media players playing"};if("vacuum"===e.domain)return{singular:"Vacuum cleaning",plural:"Vacuums cleaning"};if("alarm_control_panel"===e.domain)return{singular:"Alarm armed",plural:"Alarms armed"};if("binary_sensor"===e.domain)switch(e.deviceClass){case"door":return{singular:"Door open",plural:"Doors open"};case"window":return{singular:"Window open",plural:"Windows open"};case"opening":return{singular:"Opening open",plural:"Openings open"};case"motion":return{singular:"Motion detected",plural:"Motion detected"};case"smoke":return{singular:"Smoke detected",plural:"Smoke detected"};case"gas":return{singular:"Gas detected",plural:"Gas detected"};case"moisture":return{singular:"Moisture detected",plural:"Moisture detected"};case"occupancy":return{singular:"Occupancy detected",plural:"Occupancy detected"};case"presence":return{singular:"Presence detected",plural:"Presence detected"};case"tamper":return{singular:"Tamper detected",plural:"Tamper detected"};case"vibration":return{singular:"Vibration detected",plural:"Vibration detected"};case"safety":return{singular:"Safety active",plural:"Safety active"};default:return{singular:`${e.name} active`,plural:`${e.name} active`}}}}_entityAreaName(e){const t=this.config?.entities?.find(t=>t.entity_id===e),i=t?.device_id?this.config?.devices?.find(e=>e.device_id===t.device_id):null,a=t?.area_id||i?.area_id||this.hass?.entities?.[e]?.area_id;return this.config?.areas?.find(e=>e.area_id===a)?.name}_renderHomeView(){const e=this._getVisibleHomeSections();return fe`
      <div class="home-view">
        ${this._renderHomeWelcome()}
        ${e.map(e=>this._renderHomeSection(e))}
      </div>
    `}_getHomeSectionsOrder(){return ii(this.config?.settings?.home_sections_order)}_getVisibleHomeSections(){const e=new Set(ai(this.config?.settings?.home_sections_hidden)),t=this._isDesktopAreaSidebarCollapsed();return this._getHomeSectionsOrder().filter(i=>!e.has(i)||t&&"areas"===i)}_homeInformationCardVisible(e){return!new Set(oi(this.config?.settings?.home_information_cards_hidden)).has(e)}_renderHomeSection(e){switch(e){case"summaries":return this._renderHomeSummaries();case"cameras":return this._renderHomeCameras();case"areas":return this._renderMobileHomeAreas();case"devices":return this._renderHomeStatusCards();case"todos":return this._renderHomeTodos();case"favorites":return this._renderFavorites();default:return ye}}_renderHomeSummaries(){const e=this._getHomeSummaryCards();return e.length?fe`
      <section class="home-summaries-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:clipboard-list-outline"></ha-icon>
          <span>${this._t("home.summaries")}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle active static"
              type="button"
              title=${this._t("home.summaries")}
              aria-label=${this._t("home.summaries")}
            >
              <ha-icon icon="mdi:clipboard-list-outline"></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t("home.summaries")}</span>
          </div>
        </div>
        <div class="home-summary-list">
          ${at(e,e=>e.key,e=>fe`
              <button
                class="home-summary-card ${e.key}"
                type="button"
                style=${`--summary-color: ${e.color};`}
                @click=${()=>this._openHomeAssistantPage(e.path)}
              >
                <span class="home-summary-icon">
                  <ha-icon icon=${e.icon}></ha-icon>
                </span>
                <span class="home-summary-copy">
                  <span class="home-summary-title">${e.label}</span>
                  <span class="home-summary-subtitle">${e.subtitle}</span>
                </span>
                <span class="home-summary-chevron">
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </span>
              </button>
            `)}
        </div>
      </section>
    `:ye}_renderHomeTodos(){const e=this._getHomeTodoEntities();if(!e.length)return ye;const t=this._t("home_section.todos.label");return fe`
      <section class="home-todos-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${t}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle active"
              type="button"
              title=${t}
              aria-label=${t}
            >
              <ha-icon icon="mdi:format-list-checks"></ha-icon>
            </button>
            <span class="mobile-section-title-label">${t}</span>
          </div>
        </div>
        <div class="home-todos-grid">
          ${at(e,e=>e,e=>fe`
              <div class="home-todo-card" data-entity=${e}>
                <dwains-dashboard-next-card-host
                  eager
                  .hass=${this.hass}
                  .config=${{type:"todo-list",entity:e,title:this.hass.states[e]?.attributes?.friendly_name||this.hass.entities?.[e]?.name||e}}
                ></dwains-dashboard-next-card-host>
              </div>
            `)}
        </div>
      </section>
    `}_getHomeTodoEntities(){return Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("todo.")).filter(e=>{const t=this.hass.states[e],i=this.hass.entities?.[e];return!!t&&(!["unavailable","unknown"].includes(String(t.state).toLowerCase())&&!i?.hidden_by&&!i?.disabled_by&&"diagnostic"!==i?.entity_category&&"config"!==i?.entity_category)}).sort((e,t)=>{const i=this.hass.states[e]?.attributes?.friendly_name||this.hass.entities?.[e]?.name||e,a=this.hass.states[t]?.attributes?.friendly_name||this.hass.entities?.[t]?.name||t;return String(i).localeCompare(String(a),this.hass.language)})}_getHomeSummaryCards(){const e=[],t=this._getUpdateEntityCount();return this._repairsIssueCount>0&&e.push({key:"repairs",label:this._t("home.repairs"),subtitle:this._tp("summary.issue",this._repairsIssueCount),icon:"mdi:wrench",color:"#f59e0b",count:this._repairsIssueCount,path:"/config/repairs"}),t>0&&e.push({key:"updates",label:this._t("home.updates"),subtitle:this._tp("summary.update_available",t),icon:"mdi:package-up",color:"#0ea5e9",count:t,path:"/config/updates"}),this._discoveredDeviceCount>0&&e.push({key:"discovered",label:this._t("home.devices_discovered"),subtitle:this._tp("summary.device_to_add",this._discoveredDeviceCount),icon:"mdi:devices",color:"#1494aa",count:this._discoveredDeviceCount,path:"/config/integrations"}),e}_openHomeAssistantPage(e){this._closeMobileNav(),Oi(e)}_renderHomeWelcome(){const e=this.hass?.user?.name||"User",t=this._getGreeting(),i=this._weatherDisplayEnabled()?this._getWeatherEntity():void 0,a=this._formatWeatherTemperature(i),o=this._getWelcomeUserPicture(e),r=this._renderHomeAlarm();return fe`
      <div class="home-welcome">
        <div class="welcome-content">
          <div class="welcome-header">
            <div class="welcome-user">
              <button
                class="welcome-avatar"
                type="button"
                title=${this._t("navigation.profile_settings")}
                aria-label=${this._t("navigation.profile_settings")}
                @click=${this._openProfileSettings}
              >
                ${o?fe`<img src=${o} alt=${e} />`:fe`<ha-icon icon="mdi:account"></ha-icon>`}
              </button>
              <div class="welcome-copy">
                <div class="welcome-text">
                  <span class="welcome-greeting">${t}</span>
                  <span class="welcome-name">, ${e}!</span>
                  <span class="welcome-title">${t}, ${e}</span>
                </div>
                <div class="welcome-return">${this._getHomeSnapshotText(i)}</div>
              </div>
            </div>
            <div class="welcome-actions">
              ${this._canManageDashboard()?fe`
                <button
                  class="welcome-action"
                  type="button"
                  title=${this._t("sidebar.dashboard_settings")}
                  @click=${this._openDashboardSettings}
                >
                  <ha-icon icon="mdi:cog-outline"></ha-icon>
                </button>
              `:ye}
              ${this._showNotificationsUi()?fe`
                <button
                  class="welcome-action"
                  type="button"
                  title=${this._t("home.notifications")}
                  @click=${this._openNotifications}
                >
                  <ha-icon icon="mdi:bell-outline"></ha-icon>
                  ${this._persistentNotifications.length?fe`<span class="welcome-action-badge">${this._persistentNotifications.length}</span>`:ye}
                </button>
              `:ye}
            </div>
            <div class="welcome-time-section">
              <div class="welcome-time">${this._currentTime}</div>
              <div class="welcome-date">${this._currentDate}</div>
            </div>
          </div>
          ${r!==ye||a?fe`
            <div class="welcome-subheader">
              ${r}
              ${i&&a?fe`
                <div
                  class="welcome-weather"
                  title=${this._weatherTitle(i)}
                  aria-label=${this._weatherTitle(i)}
                  @click=${()=>this._showMoreInfo(i.entity_id)}
                >
                  <ha-icon icon=${i.attributes.icon||"mdi:weather-cloudy"}></ha-icon>
                  <span class="weather-temp">${a}</span>
                  <span class="weather-label">${this._t("home.outside")}</span>
                </div>
              `:ye}
            </div>
          `:ye}
        </div>
      </div>
    `}_renderHomeStatusCards(){const e=this._getStatusDomains(),t=this._homeInformationCardVisible("device_groups")?e.filter(e=>"person"!==e.domain&&"wattage"!==e.domain&&"camera"!==e.domain):[],i="grid"===this._mobileHomeDevicesLayout,a=[this._homeInformationCardVisible("people")?this._renderHousePersonsStatusCard():ye,this._homeInformationCardVisible("climate")?this._renderHouseClimateStatusCard():ye,this._homeInformationCardVisible("power")?this._renderHousePowerStatusCard():ye,...t.map(e=>fe`
        <div
          class="home-status-card ${e.domain} ${e.value?"has-value":""}"
          style=${this._domainStatusStyle(e.domain,e.deviceClass)}
          @click=${()=>this._handleStatusCardClick(e)}
          data-domain=${e.domain}
          title=${this._statusCardTitle(e)}
          aria-label=${this._statusCardTitle(e)}
        >
          <div class="status-card-icon">
            <ha-icon icon=${e.icon}></ha-icon>
            ${e.count>0?fe`
              <div class="status-card-badge">${e.count}</div>
            `:ye}
          </div>
          ${e.value?fe`<div class="status-card-value">${e.value}</div>`:ye}
          <div class="status-card-title">${this._statusCardTitle(e)}</div>
        </div>
      `)].filter(e=>e!==ye);return a.length?fe`
      <div class="home-status-section layout-${this._mobileHomeDevicesLayout}">
        <div class="home-status-heading">
          <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
          <span>${this._t("home.house_information")}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${i?"active":""}"
              type="button"
              title=${i?this._t("home.swipe_house_information"):this._t("home.show_all_house_information")}
              aria-label=${i?this._t("home.switch_house_information_swipe"):this._t("home.show_all_house_information")}
              @click=${this._toggleMobileHomeDevicesLayout}
            >
              <ha-icon icon=${i?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t("home.house_information")}</span>
          </div>
          <button
            class="mobile-section-action"
            type="button"
            @click=${this._openMobileDeviceSwitcher}
          >
            <span>${this._t("common.see_all")}</span>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>
        <div class="home-status-grid">
          ${a}
        </div>
      </div>
    `:ye}_renderHomeCameras(){const e=this._getHomeAreaCameras();if(!e.length)return ye;const t="grid"===this._mobileHomeCamerasLayout;return fe`
      <section class="home-camera-section layout-${this._mobileHomeCamerasLayout}">
        <div class="home-status-heading">
          <ha-icon icon="mdi:cctv"></ha-icon>
          <span>${this._t("home.cameras")}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${t?"active":""}"
              type="button"
              title=${t?this._t("home.swipe_cameras"):this._t("home.show_all_cameras")}
              aria-label=${t?this._t("home.switch_cameras_swipe"):this._t("home.show_all_cameras")}
              @click=${this._toggleMobileHomeCamerasLayout}
            >
              <ha-icon icon=${t?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t("home.cameras")}</span>
          </div>
        </div>
        <div class="home-camera-grid">
          ${at(e,e=>`${e.areaId}-${e.entityId}`,e=>this._renderHomeCameraCard(e))}
        </div>
      </section>
    `}_renderHomeCameraCard(e){return fe`
      <button
        class="home-camera-card"
        type="button"
        title=${e.name}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        ${e.imageUrl?fe`<div class="home-camera-image" style=${`background-image: url('${e.imageUrl}');`}></div>`:fe`
              <div class="home-camera-placeholder">
                <ha-icon icon="mdi:cctv"></ha-icon>
              </div>
            `}
        <div class="home-camera-content">
          <div class="home-camera-top">
            <div class="home-camera-area-icon">
              <ha-icon icon=${e.areaIcon}></ha-icon>
            </div>
          </div>
          <div class="home-camera-copy">
            <div class="home-camera-name">${e.name}</div>
            <div class="home-camera-meta">${e.areaName} · ${e.state}</div>
          </div>
        </div>
      </button>
    `}_getHomeAreaCameras(){const e=[],t=new Set(this.config?.settings?.home_cameras_hidden||[]),i=this.config?.settings?.home_camera_order||[],a=new Map(i.map((e,t)=>[e,t]));return this._getVisibleSortedAreas().forEach(i=>{this._getFilteredAreaEntities(i.area_id).filter(e=>e.entity_id.startsWith("camera.")).filter(e=>!t.has(e.entity_id)).filter(e=>{const t=this.hass?.states?.[e.entity_id]?.state;return Boolean(t&&"unavailable"!==t&&"unknown"!==t)}).forEach(t=>{const a=this.hass.states[t.entity_id],o=a?.attributes?.friendly_name||t.entity_id,r=a?this.hass.formatEntityState(a):this._t("common.unknown"),n=this._getCameraImageUrl(t.entity_id),s={areaId:i.area_id,areaName:i.name,areaIcon:Xt(i),entityId:t.entity_id,name:o,state:r};n&&(s.imageUrl=n),e.push(s)})}),e.sort((e,t)=>{const i=a.get(e.entityId),o=a.get(t.entityId);return void 0!==i||void 0!==o?(i??Number.MAX_SAFE_INTEGER)-(o??Number.MAX_SAFE_INTEGER):0})}_getCameraImageUrl(e){const t=this.hass?.states?.[e];if(!t)return;const i=t.attributes?.entity_picture,a=t.attributes?.access_token,o="string"==typeof i&&i?i:a?`/api/camera_proxy/${e}?token=${encodeURIComponent(a)}`:"";if(!o)return;const r=o.includes("?")?"&":"?";return`${o}${r}dd_cache=${encodeURIComponent(t.last_updated||t.last_changed||"")}`}_renderHousePowerStatusCard(){const e=this._getHousePowerUsage();if(!e.sensorCount)return ye;const t=e.sensorCount?this._tp("devices.live_power_sensor",e.sensorCount):this._t("home.no_live_power_sensors");return fe`
      <div
        class="home-status-card house-power-card wattage ${e.sensorCount?"has-power":"is-empty"}"
        @click=${()=>this._openDeviceDomain("energy")}
        @keydown=${this._handleHousePowerKeydown}
        data-domain="wattage"
        role="button"
        tabindex="0"
        aria-label=${`${this._t("home.house_power_usage")}: ${e.formattedTotal}`}
      >
        <div class="house-power-head">
          <div class="status-card-icon house-power-icon">
            <ha-icon icon="mdi:flash"></ha-icon>
          </div>
          <div class="house-power-copy">
            <div class="house-power-title">${this._t("home.house_power_usage")}</div>
            <div class="house-power-subtitle">${t}</div>
          </div>
          <div class="house-power-total">${e.formattedTotal}</div>
        </div>
        ${e.rooms.length?fe`
          <div class="house-power-list" aria-label=${this._t("home.house_power_usage")}>
            ${at(e.rooms,e=>e.areaId,e=>this._renderHousePowerRoom(e))}
          </div>
        `:fe`
          <div class="house-power-empty">${this._t("home.no_room_power_usage")}</div>
        `}
      </div>
    `}_renderHouseClimateStatusCard(){const e=this._getHouseClimateSummary();return e.metrics.length?fe`
      <div
        class="home-status-card house-climate-card sensor"
        @click=${()=>this._showHouseClimateEntities()}
        @keydown=${this._handleHouseClimateKeydown}
        data-domain="sensor"
        role="button"
        tabindex="0"
        aria-label=${this._t("home.indoor_climate")}
      >
        <div class="house-climate-head">
          <div class="status-card-icon house-climate-icon">
            <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>
          </div>
          <div class="house-climate-copy">
            <div class="house-climate-title">${this._t("home.indoor_climate")}</div>
            <div class="house-climate-subtitle">
              ${this._tp("common.sensor",e.sensorCount)}
            </div>
          </div>
        </div>
        <div class="house-climate-grid">
          ${e.metrics.map(e=>fe`
            <button
              class="house-climate-metric ${e.kind}"
              style=${`--metric-color: ${e.color};`}
              type="button"
              @click=${t=>{t.stopPropagation(),this._showHouseClimateEntities(e.kind)}}
            >
              <span class="house-climate-metric-icon">
                <ha-icon icon=${e.icon}></ha-icon>
              </span>
              <span class="house-climate-metric-copy">
                <span class="house-climate-metric-value">${e.value}</span>
                <span class="house-climate-metric-label">${e.label}</span>
              </span>
            </button>
          `)}
        </div>
      </div>
    `:ye}_renderHousePowerRoom(e){return fe`
      <div class="house-power-room">
        <span class="house-power-room-icon">
          <ha-icon icon=${e.icon}></ha-icon>
        </span>
        <span class="house-power-room-name">${e.name}</span>
        <span class="house-power-room-value">${e.formatted}</span>
        <span
          class="house-power-bar"
          aria-hidden="true"
          style=${`--power-width: ${e.percentage}%`}
        >
          <span class="house-power-bar-fill"></span>
        </span>
      </div>
    `}_showHouseClimateEntities(e){const t=this._getHouseClimateSummary(),i=e?t.metrics.filter(t=>t.kind===e):t.metrics,a=i.flatMap(e=>e.entityIds);if(!a.length)return void this._openDeviceDomain("sensor");const o=e&&i[0]?.label||this._t("home.indoor_climate");Ui(this,{domain:"sensor",config:this.config,entityIds:a,customTitle:o,viewAllLabel:this._t("home.view_sensors"),onViewAll:()=>this._openDeviceDomain("sensor")})}_renderHousePersonsStatusCard(){const e=this._getVisiblePersonEntities(),t=e.filter(e=>"home"===e.state).length,i=e.length?`${t}/${e.length} ${this._t("person.home").toLocaleLowerCase()}`:this._t("home.no_people");return fe`
      <div
        class="home-status-card house-persons-card person"
        @click=${()=>this._openDeviceDomain("person")}
        data-domain="person"
      >
        <div class="house-persons-head">
          <div class="status-card-icon house-persons-icon">
            <ha-icon icon="mdi:account-group"></ha-icon>
          </div>
          <div class="house-persons-copy">
            <div class="house-persons-title">${this._t("home.people")}</div>
            <div class="house-persons-subtitle">${i}</div>
          </div>
        </div>
        ${e.length?fe`
          <div class="house-persons-grid">
            ${at(e.slice(0,4),e=>e.entity_id,e=>this._renderHousePersonMini(e))}
          </div>
        `:fe`
          <div class="house-persons-empty">${this._t("home.no_visible_people")}</div>
        `}
      </div>
    `}_renderHousePersonMini(e){const t=e.attributes?.friendly_name||e.entity_id.split(".")[1],i=e.attributes?.entity_picture,a=this._formatPersonState(e),o="home"===e.state?"is-home":"not_home"===e.state?"is-away":"is-zone";return fe`
      <button
        class="house-person-mini ${o}"
        type="button"
        aria-label=${`${t}: ${a}`}
        @click=${t=>this._handleHousePersonClick(t,e.entity_id)}
      >
        <span class="house-person-avatar">
          ${i?fe`
            <img src=${i} alt=${t}>
          `:fe`
            <ha-icon icon="mdi:account"></ha-icon>
          `}
        </span>
        <span class="house-person-mini-copy">
          <span class="house-person-mini-name">${t}</span>
          <span class="house-person-mini-state">${a}</span>
        </span>
      </button>
    `}_handleHousePersonClick(e,t){e.stopPropagation(),this._showMoreInfo(t)}_getVisiblePersonEntities(){if(!this.hass||!this.config)return[];const e=new Set(this.config.settings?.hidden_persons||[]);return Object.values(this.hass.states).filter(t=>t.entity_id.startsWith("person.")&&!e.has(t.entity_id)&&!this.hass.entities?.[t.entity_id]?.hidden_by)}_formatPersonState(e){return"home"===e.state?this._t("person.home"):"not_home"===e.state?this._t("person.away"):e.state&&"unknown"!==e.state?"unavailable"===e.state?this._t("common.unavailable"):String(e.state).replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase()):this._t("common.unknown")}_getHomeSnapshotText(e){const t=[],i=this._getVisiblePersonEntities();if(i.length){const e=i.filter(e=>"home"===e.state).length;t.push(`${e}/${i.length} home`)}if(this._showNotificationsUi()&&this._persistentNotifications.length){const e=this._persistentNotifications.length;t.push(`${e} ${1===e?"notification":"notifications"}`)}const a=this._getHomeSummaryCards().reduce((e,t)=>e+t.count,0);a&&t.push(this._tp("home.attention",a));const o=this._formatWeatherSnapshot(e);return o&&t.length<3&&t.push(o),t.slice(0,3).join(" · ")||this._t("home.everything_calm")}_formatWeatherSnapshot(e){const t=this._formatWeatherTemperature(e);return t?`${t} ${this._t("home.outside").toLocaleLowerCase(a(this.hass))}`:""}_weatherDisplayEnabled(){return!1!==this.config?.settings?.show_weather&&!1!==this.config?.global_options?.show_weather}_formatWeatherTemperature(e){if(!e)return"";const t=e.attributes||{},i=t.temperature??t.current_temperature??t.apparent_temperature??t.native_temperature;if(null==i||""===i)return"";return`${i}${t.temperature_unit||t.native_temperature_unit||this.hass?.config?.unit_system?.temperature||""}`}_weatherTitle(e){const t=this._formatWeatherTemperature(e),i=this._formatWeatherCondition(e?.state),o=this._t("home.outside").toLocaleLowerCase(a(this.hass));return t&&i?`${t} ${o}, ${i}`:t?`${t} ${o}`:i||this._t("home.outside_weather")}_formatWeatherCondition(e){return e&&"unknown"!==e&&"unavailable"!==e?e.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase()):""}_getHousePowerUsage(){const e=Ei(this.hass,this.config),t=e.areas.slice(0,4).map(e=>({areaId:e.areaId,name:e.name,icon:e.icon,watts:e.totalWatts,formatted:e.formattedTotal,percentage:e.percentage}));return{totalWatts:e.totalWatts,formattedTotal:e.formattedTotal,sensorCount:e.sensorCount,rooms:t}}_getHouseClimateSummary(){const e={temperature:[],humidity:[]};this._getVisibleSortedAreas().forEach(t=>{this._getFilteredAreaEntities(t.area_id).forEach(t=>{const i=this.hass?.states?.[t.entity_id];if(!i||!i.entity_id?.startsWith("sensor."))return;const a=String(i.attributes?.device_class||"").toLowerCase();if("temperature"!==a&&"humidity"!==a)return;const o=Number.parseFloat(i.state);Number.isFinite(o)&&e[a].push({value:o,unit:String(i.attributes?.unit_of_measurement||("temperature"===a?this.hass?.config?.unit_system?.temperature||"°C":"%")),entityId:t.entity_id})})});const t=[],i=this._houseClimateMetric("temperature",e.temperature),a=this._houseClimateMetric("humidity",e.humidity);return i&&t.push(i),a&&t.push(a),{sensorCount:e.temperature.length+e.humidity.length,metrics:t}}_houseClimateMetric(e,t){if(!t.length)return;const i=t.reduce((e,t)=>e+t.value,0)/t.length,a=t[0]?.unit||("temperature"===e?"°C":"%"),o="temperature"===e?`${i.toFixed(1)} ${a}`:`${Math.round(i)}${a}`;return{kind:e,label:"temperature"===e?this._t("home.average_temperature"):this._t("home.average_humidity"),value:o,count:t.length,icon:Zt("sensor","temperature"===e?"temperature":"humidity"),color:Yt("sensor","temperature"===e?"temperature":"humidity"),entityIds:t.map(e=>e.entityId)}}_renderMobileHomeAreas(){const e=this._getVisibleSortedAreas();if(!e.length)return ye;const t=this._isDesktopAreaSidebarCollapsed(),i=t?"grid":this._mobileHomeAreasLayout,a="grid"===i,o=this._isMobile&&!this._renderAllMobileHomeAreas&&e.length>12?e.slice(0,12):e;return fe`
      <section class="mobile-home-section mobile-home-areas layout-${i}">
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            ${t?fe`
              <span class="mobile-layout-toggle active" aria-hidden="true">
                <ha-icon icon="mdi:view-grid-outline"></ha-icon>
              </span>
            `:fe`
              <button
                class="mobile-layout-toggle ${a?"active":""}"
                type="button"
                title=${a?this._t("home.swipe_areas"):this._t("home.show_all_areas")}
                aria-label=${a?this._t("home.switch_areas_swipe"):this._t("home.show_all_areas")}
                @click=${this._toggleMobileHomeAreasLayout}
              >
                <ha-icon icon=${a?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
              </button>
            `}
            <span class="mobile-section-title-label">${this._t("home.areas")}</span>
          </div>
          ${t?ye:fe`
            <button
              class="mobile-section-action"
              type="button"
              @click=${this._openMobileAreaSwitcher}
            >
              <span>${this._t("common.see_all")}</span>
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          `}
        </div>
        <div class="mobile-area-rail">
          ${at(o,e=>e.area_id,e=>this._renderMobileHomeAreaCard(e))}
        </div>
      </section>
    `}_renderMobileHomeAreaCard(e){const t=this._getFilteredAreaEntities(e.area_id),i=this._getCachedAreaData(e),a=this._getAreaDeviceCount(e.area_id,t),o=Boolean(e.picture),r=[i.temperature,i.humidity,i.wattage].filter(Boolean).join(" • ")||(1===a?"1 device":`${a} devices`),n=[],s=o?this._getPictureContrastClass(e.picture):"";return i.domains.cover?.on&&n.push({className:"cover",icon:Kt("cover"),count:i.domains.cover.on,color:Yt("cover")}),i.domains.light?.on&&n.push({className:"light",icon:Kt("light"),count:i.domains.light.on,color:Yt("light")}),i.domains.motion?.on&&n.push({className:"motion",icon:Zt("binary_sensor","motion"),count:i.domains.motion.on,color:Yt("binary_sensor","motion")}),fe`
      <button
        class="mobile-area-card ${o?"has-picture":""} ${s}"
        type="button"
        @click=${()=>this._selectArea(e.area_id)}
      >
        ${o?fe`
          <div class="mobile-area-picture" style=${`background-image: url('${e.picture}');`}></div>
        `:ye}
        <div class="mobile-area-top">
          <div class="mobile-area-icon">
            <ha-icon icon=${Xt(e)}></ha-icon>
          </div>
          <div class="mobile-area-badges">
            ${n.slice(0,2).map(e=>fe`
              <span
                class="mobile-area-badge ${e.className}"
                style=${`--area-badge-color: ${e.color};`}
              >
                <ha-icon icon=${e.icon}></ha-icon>
                <span>${e.count}</span>
              </span>
            `)}
          </div>
        </div>
        <div class="mobile-area-copy">
          <div class="mobile-area-name">${e.name}</div>
          <div class="mobile-area-meta">${r}</div>
        </div>
      </button>
    `}_getGreeting(){const e=(new Date).getHours();return e<12?this._t("home.good_morning"):e<18?this._t("home.good_afternoon"):this._t("home.good_evening")}_renderHomeAlarm(){const e=this._getAlarmEntity();if(!e)return ye;const t=e?.state||"",i=["armed_away","armed_home","armed_night","armed_vacation"].includes(t),a="disarmed"===t;return fe`
      <div class="welcome-alarm ${i?"alarm-armed":a?"alarm-disarmed":"alarm-triggered"}" @click=${()=>this._showMoreInfo(e?.entity_id||"")}>
        <ha-icon icon=${i?"mdi:shield-check":a?"mdi:shield-off":"mdi:shield-alert"}></ha-icon>
        <span class="alarm-text">${(()=>i?this._t("home.alarm_armed"):a?this._t("home.alarm_disarmed"):this._t("domain.alarm_control_panel"))()}</span>
          </div>
    `}_renderFavorites(){const e=this._getEffectiveFavoriteEntities();if(0===e.length)return ye;const t="grid"===this._mobileHomeFavoritesLayout;return fe`
      <div class="favorites-section home-favorites-section layout-${this._mobileHomeFavoritesLayout}">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <span>${this._t("favorites.title")}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${t?"active":""}"
              type="button"
              title=${t?this._t("favorites.swipe"):this._t("favorites.show_all")}
              aria-label=${t?this._t("favorites.switch_swipe"):this._t("favorites.show_all")}
              @click=${this._toggleMobileHomeFavoritesLayout}
            >
              <ha-icon icon=${t?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t("favorites.title")}</span>
          </div>
        </div>
        <div class="favorites-grid">
          ${at(e,e=>e,e=>this._renderFavoriteCard(e))}
        </div>
      </div>
    `}_renderFavoriteCard(e){const t=this.hass.states[e],i=this.hass.entities?.[e];if(!t||i?.hidden_by)return ye;const a=this._getEffectiveEntityState(t),o=e.split(".")[0]||"unknown",r=a.attributes?.device_class,n=a.attributes?.friendly_name||i?.name||e,s=this._formatFavoriteState(a),c=this._entityAreaName(e),d=i?.icon||a.attributes?.icon||Zt(o,r)||Kt(o),l=this._favoriteActiveState(a,o),p=this._favoriteSupportsQuickToggle(o),h=["favorite-card-wrapper",`favorite-${o}`,r?`favorite-${r}`:"",l,p?"can-toggle":"info-only"].filter(Boolean).join(" ");return fe`
      <article
        class=${h}
        data-entity=${e}
        role="button"
        tabindex="0"
        @click=${()=>this._showMoreInfo(e)}
        @keydown=${t=>this._handleFavoriteKeydown(t,e)}
      >
        <div class="favorite-top">
          <div class="favorite-icon">
            <ha-icon icon=${d}></ha-icon>
          </div>
          <button
            class="favorite-quick-action"
            type="button"
            title=${this._favoriteQuickTitle(a,o)}
            @click=${e=>this._handleFavoriteQuickAction(e,a,o)}
          >
            <ha-icon icon=${this._favoriteQuickIcon(a,o)}></ha-icon>
          </button>
        </div>
        <div class="favorite-body">
          <div class="favorite-name">${n}</div>
          <div class="favorite-state">${s}</div>
          ${c?fe`<div class="favorite-area">${c}</div>`:ye}
        </div>
      </article>
    `}_handleFavoriteKeydown(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showMoreInfo(t))}_formatFavoriteState(e){const t=this._getEffectiveEntityState(e);try{return this.hass.formatEntityState(t)}catch{return String(t?.state||"")}}_getEffectiveEntityState(e){const t=e?.entity_id;if(!t)return e;const i=this._optimisticEntityStates[t];if(!i||i.expiresAt<=Date.now())return e;return String(e?.state||"").toLowerCase()===i.state.toLowerCase()?e:{...e,state:i.state}}_setOptimisticEntityState(e,t){this._setOptimisticEntityStates([e],t)}_setOptimisticEntityStates(e,t){const i=[...new Set(e.filter(Boolean))];if(!i.length)return;const a=Date.now()+5e3,o={...this._optimisticEntityStates};i.forEach(e=>{o[e]={state:t,expiresAt:a}}),this._optimisticEntityStates=o,this._scheduleOptimisticCleanup()}_clearOptimisticEntityStates(e){const t=[...new Set(e.filter(Boolean))];if(!t.length)return;const i={...this._optimisticEntityStates};let a=!1;t.forEach(e=>{i[e]&&(delete i[e],a=!0)}),a&&(this._optimisticEntityStates=i)}_reconcileOptimisticEntityStates(){const e=Object.entries(this._optimisticEntityStates);if(!e.length)return;const t=Date.now(),i={...this._optimisticEntityStates};let a=!1;e.forEach(([e,o])=>{const r=this.hass?.states?.[e]?.state;(!r||o.expiresAt<=t||String(r).toLowerCase()===o.state.toLowerCase())&&(delete i[e],a=!0)}),a&&(this._optimisticEntityStates=i)}_scheduleOptimisticCleanup(){if(void 0!==this._optimisticCleanupTimer)return;const e=Object.values(this._optimisticEntityStates).map(e=>e.expiresAt);if(!e.length)return;const t=Math.min(...e);if(!Number.isFinite(t))return;const i=Math.max(80,t-Date.now()+50);this._optimisticCleanupTimer=window.setTimeout(()=>{this._optimisticCleanupTimer=void 0,this._reconcileOptimisticEntityStates(),Object.keys(this._optimisticEntityStates).length&&this._scheduleOptimisticCleanup()},i)}_favoriteActiveState(e,t){const i=String(e?.state||"").toLowerCase();if(["unavailable","unknown"].includes(i))return"is-idle";if("cover"===t)return["open","opening"].includes(i)?"is-active":"is-off";if("lock"===t)return"unlocked"===i?"is-active":"is-off";if("climate"===t){const t=e?.attributes?.hvac_action;return t&&"idle"!==t&&"off"!==t?"is-active":"is-idle"}return["off","closed","locked","not_home","idle"].includes(i)?"is-off":"is-active"}_favoriteSupportsQuickToggle(e){return["light","switch","fan","input_boolean","cover","lock"].includes(e)}_renderStaticIcon(e){return fe`
      <svg class="dd-static-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${e}></path>
      </svg>
    `}_favoriteQuickIcon(e,t){const i=String(e?.state||"").toLowerCase();return"cover"===t?["open","opening"].includes(i)?"mdi:arrow-down":"mdi:arrow-up":"lock"===t?"unlocked"===i?"mdi:lock-open-variant-outline":"mdi:lock-outline":["light","switch","fan","input_boolean"].includes(t)?"mdi:power":"mdi:chevron-right"}_favoriteQuickTitle(e,t){const i=String(e?.state||"").toLowerCase();return"cover"===t?this._t(["open","opening"].includes(i)?"action.close":"action.open"):"lock"===t?this._t("unlocked"===i?"action.lock":"action.unlock"):["light","switch","fan","input_boolean"].includes(t)?this._t("off"===i?"action.turn_on":"action.turn_off"):this._t("action.more_info")}async _handleFavoriteQuickAction(e,t,i){e.stopPropagation();const a=t?.entity_id;if(!a)return;const o=[a];try{if(["light","switch","fan","input_boolean"].includes(i)){const e=!this._isEntityActiveForUi(t,i);return this._setOptimisticEntityState(a,e?"on":"off"),void await this.hass.callService(i,e?"turn_on":"turn_off",{entity_id:a})}if("cover"===i){const e=["open","opening"].includes(String(t.state).toLowerCase());return this._setOptimisticEntityState(a,e?"closed":"open"),void await this.hass.callService("cover",e?"close_cover":"open_cover",{entity_id:a})}if("lock"===i){const e="unlocked"===String(t.state).toLowerCase();return this._setOptimisticEntityState(a,e?"locked":"unlocked"),void await this.hass.callService("lock",e?"lock":"unlock",{entity_id:a})}}catch(e){return this._clearOptimisticEntityStates(o),console.warn(`Failed to run favorite quick action for ${a}:`,e),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(a)}_renderAreaView(){if(!this._selectedArea)return ye;const e=this.config?.areas?.find(e=>e.area_id===this._selectedArea);if(!e)return ye;const t=this._getFilteredAreaEntities(this._selectedArea),i=this._getCachedAreaData(e),a=!!e.picture,o=a?this._getPictureContrastClass(e.picture):"",r=this._getAreaDeviceCount(e.area_id,t),n=Boolean(i.temperature||i.humidity),s=t.some(e=>e.entity_id.startsWith("light.")||e.entity_id.startsWith("switch.")||e.entity_id.startsWith("cover.")),c=this._tp("common.device",r),d=[i.temperature,i.humidity].filter(Boolean).join(" · "),l=this._areaHeaderStuck&&!this._areaHeaderRevealed&&d?d:c;return fe`
      <div class="area-view">
        <div class="area-header ${a?"has-picture":""} ${o} ${n?"has-metrics":""} ${s?"has-quick-controls":""} ${this._areaHeaderStuck?"is-stuck":""} ${this._areaHeaderRevealed?"is-revealed":""}">
          ${a?fe`
            <div class="area-header-background" style="background-image: url('${e.picture}');"></div>
          `:ye}
          <div class="area-mobile-toolbar">
            <button
              class="area-mobile-round area-mobile-home"
              title=${this._t("sidebar.home")}
              aria-label=${this._t("navigation.back_home")}
              @click=${()=>this._selectView("home")}
            >
              ${this._renderStaticIcon(Ta)}
            </button>
            ${this._renderAreaMobileQuickControls(e.area_id,t)}
            <div class="area-mobile-actions">
              ${this._renderAreaMobileCameraAction(t)}
              ${this._renderUnavailableEntitiesIcon(e.area_id)}
              ${this._canManageDashboard()?fe`
                <button
                  class="area-mobile-round area-mobile-edit ${this._editMode?"active":""}"
                  title=${this._editMode?this._t("layout.done_editing"):this._t("layout.edit_custom_cards")}
                  @click=${this._toggleEditMode}
                >
                  <ha-icon icon=${this._editMode?"mdi:check":"mdi:pencil"}></ha-icon>
                </button>
              `:ye}
            </div>
          </div>
          <div class="area-header-content">
            ${this._isDesktopAreaSidebarCollapsed()?fe`
              <button
                class="area-desktop-back"
                type="button"
                title=${this._t("navigation.back_home")}
                aria-label=${this._t("navigation.back_home")}
                @click=${()=>this._selectView("home")}
              >
                ${this._renderStaticIcon(Ta)}
              </button>
            `:ye}
            <div class="area-title-group">
              <div class="area-header-icon">
                <ha-icon icon=${Xt(e)}></ha-icon>
              </div>
              <div class="area-title-copy">
                <h1 class="area-title">${e.name}</h1>
                <div class="area-subtitle">${l}</div>
              </div>
            </div>
            <div class="area-header-actions">
              ${this._renderUnavailableEntitiesIcon(e.area_id)}
              ${this._canManageDashboard()?fe`
                <button
                  class="dd-edit-toggle ${this._editMode?"active":""}"
                  title=${this._editMode?this._t("layout.done_editing"):this._t("layout.edit_custom_cards")}
                  @click=${this._toggleEditMode}
                >
                  <ha-icon icon=${this._editMode?"mdi:check":"mdi:pencil"}></ha-icon>
                </button>
              `:ye}
            </div>
          </div>
          ${this._renderAreaHeaderMetrics(i)}
          ${this._renderAreaBadges(e,t,i)}
        </div>

        ${this._renderCustomCardSlot(e.area_id,"top",this._t("layout.custom_cards_top"))}
        ${this._renderMobileEntitiesSection(e,t)}
        ${this._renderCustomCardSlot(e.area_id,"bottom",this._t("layout.custom_cards_bottom"))}
      </div>
    `}_renderCustomCardSlot(e,t,i,a=!1){const o=this._canManageDashboard();!o&&this._editMode&&(this._editMode=!1);const r=this._getAreaCustomCards(e).filter(e=>e.placement===t);if(0===r.length&&!this._editMode)return ye;const n=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===t&&this._customCardDragOver.index===r.length,s={"dd-custom-section":!0,"after-domain":a,editing:this._editMode&&o,"drag-over":Boolean(n)};return fe`
      <div
        class=${pi(s)}
        @dragover=${i=>this._handleCustomSlotDragOver(i,e,t,r.length)}
        @drop=${i=>this._handleCustomCardDrop(i,e,t,r.length)}
      >
        ${this._editMode&&o||r.length?fe`
              <div class="dd-custom-slot-head">
                <div class="dd-custom-slot-title">
                  <ha-icon icon="mdi:cards-outline"></ha-icon>
                  <span>${this._editMode&&o?i:this._t("layout.custom_cards")}</span>
                </div>
                ${this._editMode&&o?fe`
                  <button class="dd-add-card-inline" @click=${()=>this._addCard(e,t,r.length)}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    <span>${this._t("layout.add_card")}</span>
                  </button>
                `:ye}
              </div>
            `:ye}
        <div class="dd-custom-grid">
          ${at(r,e=>e.id,(t,i)=>this._renderCustomCard(e,t,i))}
          ${this._editMode&&o&&0===r.length?fe`
                <button class="dd-add-card" @click=${()=>this._addCard(e,t,0)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                  <span>${this._t("layout.add_card")}</span>
                </button>
              `:ye}
        </div>
      </div>
    `}_renderCustomCard(e,t,i){const a=this._customCardDrag?.areaId===e&&this._customCardDrag.cardId===t.id,o=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===t.placement&&this._customCardDragOver.index===i,r={"dd-custom-card-wrap":!0,"dd-grid-full":"full"===t.card?.grid_options?.columns,editing:this._editMode,dragging:a,"drag-over":o};return fe`
      <div
        class=${pi(r)}
        style=${ui(this._customCardGridStyle(t.card))}
        .draggable=${this._editMode}
        @dragstart=${i=>this._handleCustomCardDragStart(i,e,t.id)}
        @dragover=${a=>this._handleCustomSlotDragOver(a,e,t.placement,i)}
        @drop=${a=>this._handleCustomCardDrop(a,e,t.placement,i)}
        @dragend=${this._clearCustomCardDragState}
      >
        <div class="dd-card-toolbar">
          <button class="drag" title=${this._t("layout.drag_card")} aria-label=${this._t("layout.drag_card")}>
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <button title=${this._t("common.edit")} @click=${()=>this._editCard(e,t.id)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button class="del" title=${this._t("common.delete")} @click=${()=>this._deleteCard(e,t.id)}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <dwains-dashboard-next-card-host .hass=${this.hass} .config=${t.card}></dwains-dashboard-next-card-host>
      </div>
    `}_customCardGridStyle(e){const t=e?.grid_options;if(!t||"object"!=typeof t)return{};const i={};if("full"===t.columns)i["--dd-card-grid-column"]="1 / -1";else if("number"==typeof t.columns&&Number.isFinite(t.columns)){const e=Math.max(1,Math.min(12,Math.round(t.columns)));i["--dd-card-grid-column"]=`span ${e}`}if("number"==typeof t.rows&&Number.isFinite(t.rows)){const e=Math.max(1,Math.min(12,Math.round(t.rows)));i["--dd-card-grid-min-height"]=56*e+8*(e-1)+"px"}return i}_getDomainSlotCustomCards(e,t,i,a){const o=this._customCardPlacementInDomain(t,i),r=this._customCardPlacementAfter(t);return this._getAreaCustomCards(e).filter(e=>{if(e.placement===o)return!0;const n=this._domainCustomCardPlacementIndex(e.placement,t);return i===a&&void 0!==n&&n>a||i===a&&e.placement===r})}_domainCustomCardPlacementIndex(e,t){const i=`domain:${t}:`;if(!e.startsWith(i))return;const a=Number(e.slice(i.length));return Number.isFinite(a)&&a>=0?a:void 0}_placementIndexForCard(e,t){const i=t.get(e.placement)||0;return t.set(e.placement,i+1),i}_renderDomainCustomCardSlot(e,t,i,a){const o=this._canManageDashboard();!o&&this._editMode&&(this._editMode=!1);const r=this._customCardPlacementInDomain(t,i),n=this._getDomainSlotCustomCards(e,t,i,a),s=n.filter(e=>e.placement===r).length,c=new Map,d=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===r&&this._customCardDragOver.index===s;return 0!==n.length||this._editMode?fe`
      ${n.map(t=>this._renderCustomCard(e,t,this._placementIndexForCard(t,c)))}
      ${this._editMode&&o?fe`
        <button
          class="dd-add-card dd-domain-add-card ${d?"drag-over":""}"
          @click=${()=>this._addCard(e,r,s)}
          @dragover=${t=>this._handleCustomSlotDragOver(t,e,r,s)}
          @drop=${t=>this._handleCustomCardDrop(t,e,r,s)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("layout.add_card")}</span>
        </button>
      `:ye}
    `:ye}_fireNativeDialog(e,t){this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:e,dialogImport:()=>Promise.resolve(),dialogParams:t}}))}_customCardPlacementAfter(e){return`after:${e}`}_customCardPlacementInDomain(e,t){return`domain:${e}:${Math.max(0,t)}`}_customCardId(){return`area-card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getAreaCustomCards(e){const t=this.config?.areas_options?.[e]||{};return Array.isArray(t.custom_cards)?t.custom_cards.map((e,t)=>({id:String(e?.id||`generated-${t}`),placement:String(e?.placement||"bottom"),card:e?.card})).filter(e=>e.card&&"object"==typeof e.card):[]}_getPersistableAreaCustomCards(e){return this._getAreaCustomCards(e).map(e=>({id:e.id,placement:e.placement||"bottom",card:e.card}))}_normalizeAreaCustomCardsForSave(e){return e.map(e=>({id:e.id.startsWith("generated-")?this._customCardId():e.id,placement:e.placement||"bottom",card:e.card}))}_insertIndexForPlacement(e,t,i){let a=0,o=-1;for(let r=0;r<e.length;r+=1){const n=e[r];if(n&&n.placement===t){if(a>=i)return r;a+=1,o=r}}return o>=0?o+1:e.length}_insertAreaCustomCard(e,t,i,a){const o=this._getPersistableAreaCustomCards(e),r=this._insertIndexForPlacement(o,i,a);o.splice(r,0,{id:this._customCardId(),placement:i,card:t}),this._saveAreaCustomCards(e,o)}_replaceAreaCustomCard(e,t,i){const a=this._getPersistableAreaCustomCards(e),o=a.findIndex(e=>e.id===t);if(o<0)return;const r=a[o];r&&(a[o]={...r,card:i},this._saveAreaCustomCards(e,a))}_addCard(e,t="bottom",i=Number.POSITIVE_INFINITY){if(this._canManageDashboard())if(customElements.get("hui-dialog-create-card")){const a=this.config?.areas?.find(t=>t.area_id===e)?.name||"Dwains",o={views:[{title:a,type:"sections",sections:[{type:"grid",cards:[]}]}]};this._fireNativeDialog("hui-dialog-create-card",{lovelaceConfig:o,path:[0,0],saveConfig:a=>{const o=a?.views?.[0]?.sections?.[0]?.cards||[],r=o[o.length-1];r&&this._insertAreaCustomCard(e,r,t,i)}})}else this._addCardYaml(e,t,i)}_editCard(e,t){if(!this._canManageDashboard())return;const i=this._getAreaCustomCards(e).find(e=>e.id===t)?.card;if(i)if(customElements.get("hui-dialog-edit-card")){const a={type:"grid",cards:[i]},o={views:[{title:"Dwains",type:"sections",sections:[a]}]};this._fireNativeDialog("hui-dialog-edit-card",{lovelaceConfig:o,cardConfig:i,sectionConfig:a,saveCardConfig:i=>{i?.type&&this._replaceAreaCustomCard(e,t,i)}})}else this._editCardYaml(e,t)}_addCardYaml(e,t="bottom",i=Number.POSITIVE_INFINITY){this._canManageDashboard()&&Ki(this,{areaName:this.config?.areas?.find(t=>t.area_id===e)?.name,onSave:a=>{this._insertAreaCustomCard(e,a,t,i)}})}_editCardYaml(e,t){if(!this._canManageDashboard())return;const i=this._getAreaCustomCards(e).find(e=>e.id===t)?.card;i&&Ki(this,{card:i,areaName:this.config?.areas?.find(t=>t.area_id===e)?.name,onSave:i=>{this._replaceAreaCustomCard(e,t,i)}})}_deleteCard(e,t){if(!this._canManageDashboard())return;if(!confirm(this._t("layout.delete_card_confirm")))return;const i=this._getPersistableAreaCustomCards(e).filter(e=>e.id!==t);this._saveAreaCustomCards(e,i)}_handleCustomCardDragStart(e,t,i){this._editMode&&this._canManageDashboard()?(this._customCardDrag={areaId:t,cardId:i},this._customCardDragOver=null,e.dataTransfer?.setData("text/plain",i),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")):e.preventDefault()}_handleCustomSlotDragOver(e,t,i,a){this._editMode&&this._customCardDrag&&this._customCardDrag.areaId===t&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._customCardDragOver={areaId:t,placement:i,index:a})}_handleCustomCardDrop(e,t,i,a){this._customCardDrag&&this._customCardDrag.areaId===t&&(e.preventDefault(),e.stopPropagation(),this._moveAreaCustomCard(t,this._customCardDrag.cardId,i,a),this._clearCustomCardDragState())}_moveAreaCustomCard(e,t,i,a){const o=this._getPersistableAreaCustomCards(e),r=o.findIndex(e=>e.id===t);if(r<0)return;const n=o[r];if(!n)return;const s=n.placement||"bottom",c=o.slice(0,r).filter(e=>e.placement===s).length,[d]=o.splice(r,1);if(!d)return;let l=a;s===i&&c<a&&(l=Math.max(0,a-1)),d.placement=i;const p=this._insertIndexForPlacement(o,i,l);o.splice(p,0,d),this._saveAreaCustomCards(e,o)}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}async _saveAreaCustomCards(e,t){if(!this._canManageDashboard())return;const i=this._editMode&&"area"===this._selectedView&&this._selectedArea===e;i&&this._rememberAreaEditMode(e);const a=this._normalizeAreaCustomCardsForSave(t),o=this.config.areas_options||{};this.config={...this.config,areas_options:{...o,[e]:{...o[e]||{},custom_cards:a}}},i&&(this._editMode=!0),this.requestUpdate();try{const t=this._getDashboardUrlPath(),i=t?{url_path:t}:{},o=await this.hass.callWS({type:"lovelace/config",...i});if(o&&o.strategy){const t=o.strategy,r=t.areas_options||{},n={...o,strategy:{...t,areas_options:{...r,[e]:{...r[e]||{},custom_cards:a}}}};await this.hass.callWS({type:"lovelace/config/save",...i,config:n}),console.log("✅ Eigen kaarten opgeslagen voor",e)}else console.warn("⚠️ Geen strategy in lovelace config — opslaan overgeslagen",o)}catch(e){console.error("❌ Opslaan eigen kaarten mislukt:",e),alert(this._t("layout.save_card_failed",{error:String(e)}))}}_renderAreaBadges(e,t,i){const a=[];i.domains.light&&i.domains.light.on>0&&a.push(fe`
        <div class="area-badge light" style=${this._domainBadgeStyle("light")}>
          <ha-icon icon=${Kt("light")}></ha-icon>
          <span>${i.domains.light.on} on</span>
        </div>
      `),i.domains.switch&&i.domains.switch.on>0&&a.push(fe`
        <div class="area-badge switch" style=${this._domainBadgeStyle("switch")}>
          <ha-icon icon=${Kt("switch")}></ha-icon>
          <span>${i.domains.switch.on} on</span>
        </div>
      `),i.domains.climate&&i.domains.climate.on>0&&a.push(fe`
        <div class="area-badge climate" style=${this._domainBadgeStyle("climate")}>
          <ha-icon icon=${Kt("climate")}></ha-icon>
                            <span>${i.domains.climate.on} active</span>
        </div>
      `);const o=t.filter(e=>e.entity_id.startsWith("binary_sensor.")&&"motion"===this.hass?.states[e.entity_id]?.attributes?.device_class&&"on"===this.hass?.states[e.entity_id]?.state);o.length>0&&a.push(fe`
        <div class="area-badge motion active" style=${this._domainBadgeStyle("binary_sensor","motion")}>
          <ha-icon icon=${Zt("binary_sensor","motion")}></ha-icon>
                            <span>${o.length} active</span>
        </div>
      `),i.domains.cover&&i.domains.cover.on>0&&a.push(fe`
        <div class="area-badge cover" style=${this._domainBadgeStyle("cover")}>
          <ha-icon icon=${Kt("cover")}></ha-icon>
          <span>${i.domains.cover.on} open</span>
        </div>
      `),i.domains.media_player&&i.domains.media_player.on>0&&a.push(fe`
        <div class="area-badge media_player" style=${this._domainBadgeStyle("media_player")}>
          <ha-icon icon=${Kt("media_player")}></ha-icon>
                            <span>${i.domains.media_player.on} active</span>
        </div>
      `);const r=t.filter(e=>e.entity_id.startsWith("light."));if(r.length>0){const t=this._areAllEntitiesOff(r,"light");a.push(fe`
        <button
          class="area-badge light-toggle"
          @click=${()=>this._toggleAreaLights(e.area_id)}
        >
          <ha-icon icon=${t?"mdi:lightbulb-on":"mdi:lightbulb-off"}></ha-icon>
                            <span>${t?this._t("action.all_lights_on"):this._t("action.all_lights_off")}</span>
        </button>
      `)}const n=t.filter(e=>e.entity_id.startsWith("switch."));if(n.length>0){const t=this._areAllEntitiesOff(n,"switch");a.push(fe`
        <button
          class="area-badge switch-toggle"
          @click=${()=>this._toggleAreaSwitches(e.area_id)}
        >
          <ha-icon icon=${t?"mdi:toggle-switch":"mdi:toggle-switch-off"}></ha-icon>
          <span>${t?this._t("action.all_switches_on"):this._t("action.all_switches_off")}</span>
        </button>
      `)}return i.wattage&&a.push(fe`
        <div class="area-badge wattage">
          <ha-icon icon="mdi:flash"></ha-icon>
          <span>${i.wattage}</span>
        </div>
      `),i.totalEnergy&&a.push(fe`
        <div class="area-badge energy">
          <ha-icon icon="mdi:lightning-bolt"></ha-icon>
          <span>${i.totalEnergy}</span>
        </div>
      `),i.temperature&&a.push(fe`
        <div class="area-badge temperature">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${i.temperature}</span>
        </div>
      `),i.humidity&&a.push(fe`
        <div class="area-badge humidity">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${i.humidity}</span>
        </div>
      `),a.length>0?fe`
      <div class="area-badges">
        ${a}
      </div>
    `:ye}_renderAreaMobileQuickControls(e,t){const i=t.filter(e=>e.entity_id.startsWith("light.")),a=t.filter(e=>e.entity_id.startsWith("switch.")),o=t.filter(e=>e.entity_id.startsWith("cover."));if(!i.length&&!a.length&&!o.length)return fe`<div class="area-mobile-quick-controls empty"></div>`;const r=this._countActiveEntities(i,"light"),n=this._countActiveEntities(a,"switch"),s=this._countActiveEntities(o,"cover"),c=r>0,d=n>0,l=s>0,p=[i.length,a.length,o.length].filter(Boolean).length;return fe`
      <div class="area-mobile-quick-controls count-${p}">
        ${i.length?fe`
          <button
            class="area-quick-control light ${c?"active":""}"
            title=${this._t(c?"action.lights_off_summary":"action.lights_on_summary",{active:r,total:i.length})}
            aria-label=${this._t(c?"action.lights_off_summary":"action.lights_on_summary",{active:r,total:i.length})}
            @click=${()=>this._toggleAreaLights(e)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${c?"mdi:lightbulb":"mdi:lightbulb-outline"}></ha-icon>
              <span class="area-quick-count">${r}/${i.length}</span>
            </span>
            <span class="area-quick-switch" aria-hidden="true"></span>
          </button>
        `:ye}
        ${a.length?fe`
          <button
            class="area-quick-control switch ${d?"active":""}"
            title=${this._t(d?"action.switches_off_summary":"action.switches_on_summary",{active:n,total:a.length})}
            aria-label=${this._t(d?"action.switches_off_summary":"action.switches_on_summary",{active:n,total:a.length})}
            @click=${()=>this._toggleAreaSwitches(e)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${d?"mdi:power-plug":"mdi:power-plug-off-outline"}></ha-icon>
              <span class="area-quick-count">${n}/${a.length}</span>
            </span>
            <span class="area-quick-switch" aria-hidden="true"></span>
          </button>
        `:ye}
        ${o.length?fe`
          <button
            class="area-quick-control cover ${l?"active":""}"
            title=${this._t(l?"action.covers_close_summary":"action.covers_open_summary",{active:s,total:o.length})}
            aria-label=${this._t(l?"action.covers_close_summary":"action.covers_open_summary",{active:s,total:o.length})}
            @click=${()=>this._toggleAreaCovers(e,!0)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${l?"mdi:window-shutter-open":"mdi:window-shutter"}></ha-icon>
              <span class="area-quick-count">${s}/${o.length}</span>
            </span>
            <span class="area-quick-direction" aria-hidden="true">
              <ha-icon icon=${l?"mdi:arrow-down":"mdi:arrow-up"}></ha-icon>
            </span>
          </button>
        `:ye}
      </div>
    `}_renderAreaMobileCameraAction(e){const t=e.find(e=>{if(!e.entity_id.startsWith("camera."))return!1;const t=this.hass?.states?.[e.entity_id]?.state;return Boolean(t&&"unavailable"!==t&&"unknown"!==t)});return t?fe`
      <button
        class="area-mobile-round area-mobile-camera"
        title=${this._t("domain.camera")}
        aria-label=${this._t("action.open_camera")}
        @click=${()=>this._showMoreInfo(t.entity_id)}
      >
        <ha-icon icon="mdi:video-outline"></ha-icon>
      </button>
    `:ye}_renderAreaHeaderMetrics(e){const t=[e.temperature?this._renderMobileAreaMetric("temperature",this._t("home.temperature"),e.temperature,0,30,"area-header-metric"):ye,e.humidity?this._renderMobileAreaMetric("humidity",this._t("home.humidity"),e.humidity,20,90,"area-header-metric"):ye].filter(e=>e!==ye);return t.length?fe`
      <div class="area-header-metrics">
        ${t}
      </div>
    `:ye}_renderMobileAreaMetric(e,t,i,a,o,r="mobile-area-metric"){const n="number"==typeof a&&"number"==typeof o,s=this._numericValue(i),c=n&&null!==s?Math.max(0,Math.min(1,(s-a)/(o-a))):.65,d=Math.round(270*c),l=r.includes("area-header-metric");return fe`
      <div class="${r} ${e}">
        <div class="metric-ring ${!n||l?"metric-icon":""}" style=${`--metric-angle: ${d}deg;`}>
          ${n&&!l?fe`<span class="metric-value">${i}</span>`:fe`<ha-icon icon=${"temperature"===e?"mdi:thermometer":"humidity"===e?"mdi:water-percent":"power"===e?"mdi:flash":"energy"===e?"mdi:lightning-bolt":"mdi:gauge"}></ha-icon>`}
        </div>
        <div class="metric-copy">
          <div class="metric-label">${t}</div>
          ${n&&!l?fe`<div class="metric-range">${a} - ${o}</div>`:fe`<div class="metric-reading">${i}</div>`}
        </div>
      </div>
    `}_renderMobileEntitiesSection(e,t){const i=this._mobileEntityGroups(t);if(!i.length)return ye;const a=this._isMobile&&!this._renderAllMobileAreaEntities&&i.length>4?i.slice(0,4):i;return fe`
      <section class="mobile-entities-section layout-${this._mobileEntityLayout}">
        ${a.map(t=>{const i=this._mobileControllableEntities(t.entities).length>0,a="grid"===this._mobileEntityLayout,o=this._isMobile&&!this._renderAllMobileAreaEntities&&t.entities.length>12?t.entities.slice(0,12):t.entities;return fe`
            <div class="mobile-domain-group ${this._isMobileDomainMenuOpen(e.area_id,t.key)?"menu-open":""}">
              <div class="mobile-domain-header">
                <div class="mobile-domain-title">
                  ${"todo"===t.key?fe`<span class="mobile-layout-toggle static"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`:fe`
                        <button
                          class="mobile-layout-toggle ${a?"active":""}"
                          type="button"
                          title=${a?this._t("layout.swipe_cards"):this._t("layout.show_all_cards")}
                          aria-label=${a?this._t("layout.switch_swipe_cards"):this._t("layout.show_all_cards")}
                          @click=${this._toggleMobileEntityLayout}
                        >
                          <ha-icon icon=${a?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
                        </button>
                      `}
                  <span class="mobile-domain-title-copy">
                    <span class="mobile-domain-title-label">${t.name}</span>
                    <span class="mobile-domain-count">(${t.entities.length} ${1===t.entities.length?"item":"items"})</span>
                  </span>
                </div>
                ${i?fe`
                  <button
                    class="mobile-domain-more ${this._isMobileDomainMenuOpen(e.area_id,t.key)?"active":""}"
                    type="button"
                    title=${t.name}
                    @click=${i=>this._toggleMobileDomainMenu(i,e.area_id,t)}
                  >
                    <ha-icon icon="mdi:dots-horizontal"></ha-icon>
                  </button>
                `:ye}
	              </div>
	              <div class="mobile-entity-rail">
	                ${this._renderDomainCustomCardSlot(e.area_id,t.key,0,o.length)}
	                ${at(o,e=>e.entity_id,(i,a)=>fe`
                      ${this._renderMobileEntityCard(e,i)}
                      ${this._renderDomainCustomCardSlot(e.area_id,t.key,a+1,o.length)}
                    `)}
	              </div>
	            </div>
	          `})}
      </section>
    `}_isMobileDomainMenuOpen(e,t){return this._mobileDomainMenu?.areaId===e&&this._mobileDomainMenu.groupKey===t}_toggleMobileDomainMenu(e,t,i){e.stopPropagation();const a=e.currentTarget instanceof HTMLElement?e.currentTarget:null;this._isMobileDomainMenuOpen(t,i.key)?this._closeMobileDomainMenu():(this._mobileDomainMenu={areaId:t,groupKey:i.key},a&&this._openMobileDomainMenuPortal(a,i))}_closeMobileDomainMenu(){this._mobileDomainMenu=null,this._removeMobileDomainMenuPortal()}_removeMobileDomainMenuPortal(){this._mobileDomainMenuPortal?.remove(),this._mobileDomainMenuPortal=void 0}_openMobileDomainMenuPortal(e,t){if(this._removeMobileDomainMenuPortal(),!this._mobileControllableEntities(t.entities).length)return;const i=this._mobileGroupActionLabels(t.key),a=document.createElement("div");a.setAttribute("data-dd-mobile-domain-menu",""),Object.assign(a.style,{position:"static",pointerEvents:"none"});const o=document.createElement("button");o.type="button",o.setAttribute("aria-label",this._t("common.close")),Object.assign(o.style,{position:"fixed",inset:"0",zIndex:"2147483646",padding:"0",border:"0",background:"rgba(0, 0, 0, 0.52)",cursor:"default",pointerEvents:"auto",WebkitTapHighlightColor:"transparent"}),o.addEventListener("click",()=>this._closeMobileDomainMenu());const r=document.createElement("div");r.setAttribute("role","menu");const n=e.getBoundingClientRect(),s=Math.max(10,Math.min(window.innerWidth-178-10,n.right-178)),c=n.bottom+8,d=c+94>window.innerHeight-10?Math.max(10,n.top-94-8):c;Object.assign(r.style,{position:"fixed",left:`${s}px`,top:`${d}px`,zIndex:"2147483647",width:"178px",overflow:"hidden",borderRadius:"10px",background:"var(--card-background-color, #fff)",color:"var(--primary-text-color, #111827)",boxShadow:"0 18px 42px rgba(15, 23, 42, 0.26), inset 0 0 0 1px rgba(255, 255, 255, 0.56)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",pointerEvents:"auto"}),r.addEventListener("click",e=>e.stopPropagation()),r.appendChild(this._createMobileDomainMenuButton(i.offLabel,i.offIcon,()=>{this._setMobileGroupState(t.entities,!1)},!0)),r.appendChild(this._createMobileDomainMenuButton(i.onLabel,i.onIcon,()=>{this._setMobileGroupState(t.entities,!0)},!1)),a.append(o,r),document.body.appendChild(a),this._mobileDomainMenuPortal=a}_createMobileDomainMenuButton(e,t,i,a){const o=document.createElement("button");o.type="button",o.setAttribute("role","menuitem"),Object.assign(o.style,{width:"100%",minHeight:"46px",padding:"0 12px 0 14px",border:"0",borderBottom:a?"1px solid rgba(15, 23, 42, 0.12)":"0",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",background:"transparent",color:"inherit",font:"inherit",fontSize:"15px",fontWeight:"700",textAlign:"left",cursor:"pointer",WebkitTapHighlightColor:"transparent"});const r=document.createElement("span");r.textContent=e;const n=document.createElement("ha-icon");return n.setAttribute("icon",t),n.style.setProperty("--mdc-icon-size","22px"),n.style.flex="0 0 auto",o.append(r,n),o.addEventListener("click",e=>{e.stopPropagation(),i()}),o}_mobileGroupActionLabels(e){return"cover"===e?{offLabel:"Close All",onLabel:"Open All",offIcon:"mdi:window-shutter",onIcon:"mdi:window-shutter-open"}:"lock"===e?{offLabel:"Lock All",onLabel:"Unlock All",offIcon:"mdi:lock-outline",onIcon:"mdi:lock-open-variant-outline"}:"light"===e?{offLabel:"Turn Off All",onLabel:"Turn On All",offIcon:"mdi:lightbulb-off",onIcon:"mdi:lightbulb"}:"fan"===e?{offLabel:"Turn Off All",onLabel:"Turn On All",offIcon:"mdi:fan-off",onIcon:"mdi:fan"}:{offLabel:"Turn Off All",onLabel:"Turn On All",offIcon:"mdi:toggle-switch-off",onIcon:"mdi:toggle-switch"}}_mobileEntityGroups(e){const t=e.reduce((e,t)=>{const i=this._mobileEntityTypeKey(t.entity_id);return i?(e[i]||(e[i]=[]),e[i].push(t),e):e},{}),i=["light","switch","cover","climate","todo","scene","event","motion","binary_sensor","sensor","media_player","fan","lock","camera","vacuum"];return Object.entries(t).sort(([e],[t])=>{const a=i.indexOf(e),o=i.indexOf(t);return-1!==a||-1!==o?(-1===a?999:a)-(-1===o?999:o):this._mobileGroupName(e).localeCompare(this._mobileGroupName(t))}).map(([e,t])=>({key:e,name:this._mobileGroupName(e),icon:this._mobileGroupIcon(e),entities:t}))}_mobileEntityTypeKey(e){const t=e.split(".")[0];if(t){if("binary_sensor"===t){const t=this.hass.states[e]?.attributes?.device_class;return"motion"===t?"motion":"binary_sensor"}return t}}_mobileGroupName(e){return kt(this.hass,e)}_mobileGroupIcon(e){return"motion"===e?"mdi:motion-sensor":Kt(e)}_areaReplacementCardConfig(e){const t=Ft({hass:this.hass,config:this.config,entity:e,surface:"area_cards"});return t&&!1!==t.enabled?Bt({hass:this.hass,config:this.config,entity:e,surface:"area_cards"}):null}_renderAreaReplacementCard(e,t){return fe`
      <div class="mobile-entity-replacement-card" data-entity=${e}>
        <dwains-dashboard-next-card-host
          .hass=${this.hass}
          .config=${t}
        ></dwains-dashboard-next-card-host>
      </div>
    `}_renderMobileEntityCard(e,t){const i=this.hass.states[t.entity_id];if(!i)return ye;const a=this._getEffectiveEntityState(i),o=t.entity_id.split(".")[0]||"unknown";if("todo"===o)return this._renderTodoListCard(t);const r=a.attributes?.device_class,n=this._areaReplacementCardConfig(t.entity_id);if(n)return this._renderAreaReplacementCard(t.entity_id,n);const s=this.hass.entities?.[t.entity_id]?.icon||a.attributes?.icon||Zt(o,r)||Kt(o),c=a.attributes?.friendly_name||this.hass.entities?.[t.entity_id]?.name||t.entity_id,d=this._isEntityActiveForUi(a,o),l=this._mobileEntityActionKind(o),p=["unavailable","unknown"].includes(String(a.state).toLowerCase()),h="scene"===o||"event"===o,m=this._mobileEntityHasInlineSelect(o,a),u=["mobile-entity-card",`mobile-entity-${o}`,`action-${l}`,d?"is-active":"is-off",m?"has-inline-select":"",p&&!h?"is-unavailable":""].join(" ");return fe`
      <article
        class=${u}
        style=${`--entity-color: ${this._mobileEntityColor(o,r)};`}
        role="button"
        tabindex="0"
        aria-label=${c}
        @click=${()=>this._showMoreInfo(t.entity_id)}
        @keydown=${e=>this._handleMobileEntityKeydown(e,t.entity_id)}
      >
        <div class="mobile-entity-top">
          <div class="mobile-entity-icon">
            <ha-icon icon=${s}></ha-icon>
          </div>
          ${this._renderMobileEntityActions(a,o,d)}
        </div>
        <div class="mobile-entity-content">
          <div class="mobile-entity-meta">${e.name}</div>
          <div class="mobile-entity-name">${c}</div>
          <div class="mobile-entity-status">${this._mobileEntityStatusText(a,o)}</div>
        </div>
        ${m?this._renderMobileEntitySelect(a,o):ye}
      </article>
    `}_renderTodoListCard(e){return fe`
      <div class="mobile-todo-list-card" data-entity=${e.entity_id}>
        <dwains-dashboard-next-card-host
          eager
          .hass=${this.hass}
          .config=${{type:"todo-list",entity:e.entity_id}}
        ></dwains-dashboard-next-card-host>
      </div>
    `}_handleMobileEntityKeydown(e,t){const i=e.target;i?.closest?.("button, select, input, textarea, a")||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showMoreInfo(t))}_mobileEntityHasInlineSelect(e,t){return["select","input_select"].includes(e)&&Array.isArray(t?.attributes?.options)}_renderMobileEntitySelect(e,t){const i=this._mobileEntitySelectOptions(e),a=String(e?.state||""),o=["unavailable","unknown"].includes(a.toLowerCase())||0===i.length;return fe`
      <label
        class="mobile-entity-select"
        @click=${e=>e.stopPropagation()}
        @keydown=${e=>e.stopPropagation()}
      >
        <select
          aria-label=${this._t("common.select_option")}
          ?disabled=${o}
          @change=${i=>this._handleMobileSelectChange(i,e,t)}
        >
          ${i.map(e=>fe`
            <option value=${e} ?selected=${e===a}>${e}</option>
          `)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </label>
    `}_mobileEntitySelectOptions(e){const t=String(e?.state||""),i=Array.isArray(e?.attributes?.options)?e.attributes.options.map(e=>String(e)):[];return!t||["unknown","unavailable"].includes(t.toLowerCase())||i.includes(t)?i:[t,...i]}_renderMobileEntityActions(e,t,i){const a=e?.entity_id,o=this._mobileEntityActionKind(t),r=["unavailable","unknown"].includes(String(e?.state||"").toLowerCase());if("toggle"===o)return fe`
        <button
          class="mobile-entity-action mobile-entity-toggle"
          type="button"
          title=${i?this._t("action.turn_off"):this._t("action.turn_on")}
          aria-label=${i?this._t("action.turn_off"):this._t("action.turn_on")}
          ?disabled=${r}
          @click=${i=>this._handleMobileEntityToggle(i,e,t)}
        ></button>
      `;if("cover"===o)return this._renderMobileCoverActions(e);if("lock"===o){const i=this._isEntityActiveForUi(e,t);return fe`
        <button
          class="mobile-entity-action mobile-lock-action ${i?"is-unlocked":""}"
          type="button"
          title=${i?this._t("action.lock"):this._t("action.unlock")}
          aria-label=${i?this._t("action.lock"):this._t("action.unlock")}
          ?disabled=${r}
          @click=${t=>this._handleMobileLockAction(t,e)}
        >
          <ha-icon icon=${i?"mdi:lock-open-variant-outline":"mdi:lock-outline"}></ha-icon>
        </button>
      `}return"scene"===o?fe`
        <button
          class="mobile-entity-action mobile-scene-action"
          type="button"
          title=${this._t("action.activate")}
          aria-label=${this._t("action.activate")}
          @click=${t=>this._handleMobileSceneAction(t,e)}
        >
          <ha-icon icon="mdi:play"></ha-icon>
        </button>
      `:fe`
      <button
        class="mobile-entity-action mobile-entity-more"
        type="button"
        title=${this._t("action.more_info")}
        aria-label=${this._t("action.more_info")}
        @click=${e=>this._handleMobileMoreInfo(e,a)}
      >
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `}_renderMobileCoverActions(e){const t=String(e?.state||"").toLowerCase(),i=["unavailable","unknown"].includes(t),a=this._coverSupportsFeature(e,1),o=this._coverSupportsFeature(e,2),r=this._coverSupportsFeature(e,8);return fe`
      <div class="mobile-cover-actions" @click=${e=>e.stopPropagation()}>
        ${a?fe`
          <button
            class="mobile-entity-action mobile-cover-action ${"opening"===t?"active":""}"
            type="button"
            title=${this._t("action.open")}
            aria-label=${this._t("action.open")}
            ?disabled=${i}
            @click=${t=>this._handleMobileCoverAction(t,e,"open")}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        `:ye}
        ${r?fe`
          <button
            class="mobile-entity-action mobile-cover-action ${"opening"===t||"closing"===t?"active":""}"
            type="button"
            title=${this._t("action.stop")}
            aria-label=${this._t("action.stop")}
            ?disabled=${i}
            @click=${t=>this._handleMobileCoverAction(t,e,"stop")}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        `:ye}
        ${o?fe`
          <button
            class="mobile-entity-action mobile-cover-action ${"closing"===t?"active":""}"
            type="button"
            title=${this._t("action.close")}
            aria-label=${this._t("action.close")}
            ?disabled=${i}
            @click=${t=>this._handleMobileCoverAction(t,e,"close")}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        `:ye}
      </div>
    `}async _handleMobileEntityToggle(e,t,i){e.stopPropagation();const a=t?.entity_id;if(a){try{if(["light","switch","fan","input_boolean"].includes(i)){const e=!this._isEntityActiveForUi(t,i);return this._setOptimisticEntityState(a,e?"on":"off"),void await this.hass.callService(i,e?"turn_on":"turn_off",{entity_id:a})}}catch(e){return this._clearOptimisticEntityStates([a]),console.warn(`Failed to toggle mobile entity ${a}:`,e),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(a)}}async _handleMobileSelectChange(e,t,i){e.stopPropagation();const a=e.currentTarget,o=t?.entity_id,r=a?.value;if(o&&void 0!==r){this._setOptimisticEntityState(o,r);try{await this.hass.callService("input_select"===i?"input_select":"select","select_option",{entity_id:o,option:r})}catch(e){this._clearOptimisticEntityStates([o]),console.warn(`Failed to select option for ${o}:`,e),this._showToast(this._t("entity.selector_failed"))}}}async _handleMobileCoverAction(e,t,i){e.stopPropagation();const a=t?.entity_id;if(!a)return;const o="open"===i?"open_cover":"close"===i?"close_cover":"stop_cover",r="open"===i?"open":"close"===i?"closed":void 0;r&&this._setOptimisticEntityState(a,r);try{await this.hass.callService("cover",o,{entity_id:a})}catch(e){this._clearOptimisticEntityStates([a]),console.warn(`Failed to ${i} cover ${a}:`,e),this._showToast(this._t("entity.cover_failed"))}}async _handleMobileLockAction(e,t){e.stopPropagation();const i=t?.entity_id;if(i)try{const e=this._isEntityActiveForUi(t,"lock");this._setOptimisticEntityState(i,e?"locked":"unlocked"),await this.hass.callService("lock",e?"lock":"unlock",{entity_id:i})}catch(e){this._clearOptimisticEntityStates([i]),console.warn(`Failed to toggle lock ${i}:`,e),this._showToast(this._t("entity.lock_failed"))}}async _handleMobileSceneAction(e,t){e.stopPropagation();const i=t?.entity_id;if(i)try{await this.hass.callService("scene","turn_on",{entity_id:i}),this._showToast(this._t("action.scene_activated"))}catch(e){console.warn(`Failed to activate scene ${i}:`,e),this._showMoreInfo(i)}}_handleMobileMoreInfo(e,t){e.stopPropagation(),t&&this._showMoreInfo(t)}_mobileControllableEntities(e){return e.filter(e=>{const t=e.entity_id.split(".")[0]||"";return Boolean(this.hass.states[e.entity_id])&&this._mobileEntitySupportsToggle(t)})}async _setMobileGroupState(e,t){const i=this._mobileControllableEntities(e).reduce((e,t)=>{const i=t.entity_id.split(".")[0]||"";return e[i]||(e[i]=[]),e[i].push(t.entity_id),e},{});this._closeMobileDomainMenu();const a=[];try{await Promise.all(Object.entries(i).map(([e,i])=>i.length?["light","switch","fan","input_boolean"].includes(e)?(a.push(...i),this._setOptimisticEntityStates(i,t?"on":"off"),this.hass.callService(e,t?"turn_on":"turn_off",{entity_id:i})):"cover"===e?(a.push(...i),this._setOptimisticEntityStates(i,t?"open":"closed"),this.hass.callService("cover",t?"open_cover":"close_cover",{entity_id:i})):"lock"===e?(a.push(...i),this._setOptimisticEntityStates(i,t?"unlocked":"locked"),this.hass.callService("lock",t?"unlock":"lock",{entity_id:i})):Promise.resolve():Promise.resolve()));const e=Object.values(i).reduce((e,t)=>e+t.length,0);e&&this._showToast(`${e} ${1===e?"entity":"entities"} turned ${t?"on":"off"}`)}catch(e){this._clearOptimisticEntityStates(a),console.warn("Failed to run mobile group action:",e),this._showToast(this._t("entity.group_failed"))}}_mobileEntitySupportsToggle(e){return["light","switch","fan","input_boolean","cover","lock"].includes(e)}_mobileEntityActionKind(e){return["light","switch","fan","input_boolean"].includes(e)?"toggle":"cover"===e?"cover":"lock"===e?"lock":"scene"===e?"scene":"more"}_coverSupportsFeature(e,t){const i=Number(e?.attributes?.supported_features);return!Number.isFinite(i)||i<=0?1===t||2===t:0!==(i&t)}_mobileEntityStatusText(e,t){if(!e)return"";const i=this._formatFavoriteState(e);if("scene"===t)return this._sceneLastActivatedText(e);if("event"===t)return this._eventLastTriggeredText(e);if("light"===t&&"on"===e.state&&"number"==typeof e.attributes?.brightness)return this._t("entity.brightness",{value:Math.round(e.attributes.brightness/255*100)});if("cover"===t&&"number"==typeof e.attributes?.current_position)return`${i} · ${e.attributes.current_position}%`;if("climate"===t){const t=e.attributes?.current_temperature,i=e.attributes?.temperature,a=this.hass?.config?.unit_system?.temperature||"°C";if(void 0!==t&&void 0!==i)return`${t}${a} · ${this._t("entity.climate_set",{value:`${i}${a}`})}`;if(void 0!==t)return`${t}${a}`}return"media_player"===t&&e.attributes?.media_title?`${i} · ${e.attributes.media_title}`:i}_sceneLastActivatedText(e){const t=String(e?.state||"").toLowerCase(),i=t&&!["unknown","unavailable"].includes(t)?e.state:e?.last_changed||e?.last_updated,a=Date.parse(i);return Number.isFinite(a)?this._formatRelativeTime(a):this._t("entity.not_activated")}_eventLastTriggeredText(e){const t=String(e?.state||"").toLowerCase();if("unavailable"===t)return this._t("common.unavailable");const i=Date.parse(e?.last_changed||e?.last_updated||"");return Number.isFinite(i)?t&&"unknown"!==t?`${this._formatFavoriteState(e)} · ${this._formatRelativeTime(i)}`:this._formatRelativeTime(i):this._t("entity.no_events")}_formatRelativeTime(e){const t=Math.round((e-Date.now())/1e3),i=Math.abs(t),[a,o]=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60],["second",1]].find(([,e])=>i>=e)||["second",1],r=Math.round(t/o);try{const e=this.hass?.locale?.language||navigator.language||void 0;return new Intl.RelativeTimeFormat(e,{numeric:"auto"}).format(r,a)}catch{if(i<60)return"just now";const e=Math.abs(r);return`${e} ${a}${1===e?"":"s"} ${r<0?"ago":"from now"}`}}_isEntityActiveForUi(e,t){if(!e||["unavailable","unknown"].includes(String(e.state)))return!1;const i=String(e.state).toLowerCase();if("cover"===t)return["open","opening"].includes(i);if("lock"===t)return"unlocked"===i;if("climate"===t){const t=e.attributes?.hvac_action;return t&&"idle"!==t&&"off"!==t}return"media_player"===t?["playing","buffering"].includes(i):"vacuum"===t?["cleaning","returning"].includes(i):"alarm_control_panel"===t?i.startsWith("armed")||["arming","pending","triggered"].includes(i):"camera"!==t&&!["off","closed","locked","not_home","idle"].includes(i)}_mobileEntityColor(e,t){return Yt(e,t)}_numericValue(e){const t=String(e).replace(",",".").match(/-?\d+(\.\d+)?/);if(!t)return null;const i=Number(t[0]);return Number.isFinite(i)?i:null}_renderToast(){return ye}_renderConfirmationDialog(){return ye}_getWeatherEntity(){if(this.config?.settings?.weather_entity_id){const e=this.hass.states[this.config.settings.weather_entity_id];if(e&&!this.hass.entities?.[e.entity_id]?.hidden_by)return e}return Object.values(this.hass.states).find(e=>e.entity_id.startsWith("weather.")&&!this.hass.entities?.[e.entity_id]?.hidden_by)}_getAlarmEntity(){const e=this.config?.settings?.alarm_entity_id;if(!e)return;const t=this.hass.states[e];return t&&!this.hass.entities?.[t.entity_id]?.hidden_by?t:void 0}_getStatusDomains(){const e="status_domains",t=this._domainCountsCache.get(e);if(t&&t.length>0&&t[0].timestamp&&Date.now()-t[0].timestamp<this._CACHE_DURATION)return t;const i=function(e,t){if(!e?.states)return[];const i=new Set((t?.areas||[]).map(e=>e.area_id).filter(Boolean)),a=Object.values(e.states).filter(a=>{if(!t?.entities||!t?.devices)return!1;const o=a.entity_id,r=e.entities?.[o];if(r?.hidden_by)return!1;if(!a||"unavailable"===a.state)return!1;const n=t.entities?.find(e=>e.entity_id===o);if(yi(e,t,n||o))return!1;const s=n&&n.device_id?t.devices?.find(e=>e.device_id===n.device_id):null,c=n?.area_id||s?.area_id||e?.entities?.[o]?.area_id;if(!c)return!1;if(!i.has(c))return!1;if((t.areas_display?.hidden||[]).includes(c))return!1;const d=t.areas_options?.[c];if(d?.groups_options)for(const e of Object.values(d.groups_options))if(e.hidden?.includes(o))return!1;return"person"!==o.split(".")[0]||!(t.settings?.hidden_persons||[]).includes(o)}),r={};Object.keys(Ti).forEach(e=>{r[e]={total:0,on:0,entities:[]}});const n={};Object.keys(Ni).forEach(e=>{n[e]={total:0,on:0,entities:[]}});const s=(e,t)=>{e.on++,e.entities.push(t)};a.forEach(e=>{const t=e.entity_id,i=t?.split(".")[0];if(i&&!Li.includes(e.state)){if(i in r){const a=r[i];a&&a.total++;const o=String(e.state||"").toLowerCase(),n=!Mi.includes(o)&&!Li.includes(o);"climate"===i?e.attributes?.hvac_action&&"idle"!==String(e.attributes.hvac_action).toLowerCase()&&"off"!==String(e.attributes.hvac_action).toLowerCase()?a&&s(a,t):e.attributes?.hvac_action||"off"===o||a&&s(a,t):"person"===i?"home"===o&&a&&s(a,t):"media_player"===i?Ii.includes(o)&&a&&s(a,t):"cover"===i?"open"!==o&&"opening"!==o||a&&s(a,t):"lock"===i?"unlocked"===o&&a&&s(a,t):"vacuum"===i?Pi.includes(o)&&a&&s(a,t):"alarm_control_panel"===i?(o.startsWith("armed")||ji.includes(o))&&a&&s(a,t):"camera"===i||n&&a&&s(a,t)}if("binary_sensor"===i&&e.attributes?.device_class){const i=e.attributes.device_class;if(i in n){const a=n[i];a&&(a.total++,"on"===e.state&&s(a,t))}}}});const c=[],d=r.person;if(d&&d.total>0){const t=Ti.person;t&&(d.total<=2?c.push({domain:"person",count:d.on,name:0===d.on?o(e,"person.nobody_home"):`${d.on} ${o(e,"person.home").toLowerCase()}`,icon:t.icon}):c.push({domain:"person",count:d.on,name:`${d.on}/${d.total} ${o(e,"person.home").toLowerCase()}`,icon:t.icon}))}return Object.entries(r).forEach(([t,i])=>{if("person"!==t&&i.total>0&&i.on>0){const a=Ti[t];a&&c.push({domain:t,count:i.on,name:kt(e,t),icon:a.icon,entities:i.entities})}}),Object.entries(n).forEach(([t,i])=>{if(i.total>0&&i.on>0){const a=Ni[t];a&&c.push({domain:"binary_sensor",deviceClass:t,count:i.on,name:$t(e,t),icon:a.icon,entities:i.entities})}}),c}(this.hass,this.config),a=function(e,t){const i=Ei(e,t);return i.sensorCount?i.formattedTotal:void 0}(this.hass,this.config);a&&i.unshift({domain:"wattage",count:0,name:"Power usage",value:a,icon:"mdi:flash"});const r=Date.now();return i.forEach(e=>e.timestamp=r),i.length>0&&this._domainCountsCache.set(e,i),i}_getHiddenStatusCount(){return""}_getAreaDeviceCount(e,t=[]){const i=new Set;return this.config?.devices?.forEach(t=>{t.area_id===e&&i.add(t.device_id)}),t.forEach(e=>{e.device_id&&i.add(e.device_id)}),i.size}_getAreaEntities(e){const t=this._areaEntitiesCache.get(e);if(t&&Date.now()-t.timestamp<this._CACHE_DURATION)return t.entities;const i=[],a=new Set;if(this.config?.entities){const t=new Set;this.config.devices&&this.config.devices.forEach(i=>{i.area_id===e&&t.add(i.device_id)}),this.config.entities.forEach(o=>{if(o.area_id===e||o.device_id&&t.has(o.device_id)){const e=this.hass.entities?.[o.entity_id];if(!this.hass.states[o.entity_id]||e?.hidden_by||e?.disabled_by||"diagnostic"===e?.entity_category||"config"===e?.entity_category)return;i.push(o),a.add(o.entity_id)}})}return Object.values(this.hass.states).forEach(t=>{if(!a.has(t.entity_id)&&t.attributes?.area_id===e){const a=this.hass.entities?.[t.entity_id];if(a?.hidden_by||a?.disabled_by||"diagnostic"===a?.entity_category||"config"===a?.entity_category)return;i.push({entity_id:t.entity_id,area_id:e,hidden:!1})}}),this._areaEntitiesCache.set(e,{entities:i,timestamp:Date.now()}),i}_getFilteredAreaEntities(e){let t=this._getAreaEntities(e);if(t=t.filter(e=>{const t=this.hass.entities?.[e.entity_id];return Boolean(this.hass.states[e.entity_id])&&!(t?.hidden_by||t?.disabled_by||"diagnostic"===t?.entity_category||"config"===t?.entity_category)}),this.config?.areas_options){const i=this.config.areas_options[e];if(i?.groups_options){const e=new Set;for(const t of Object.values(i.groups_options))t.hidden&&t.hidden.forEach(t=>e.add(t));t=t.filter(t=>!e.has(t.entity_id))}}return!1!==this.config?.settings?.hide_unavailable_entities&&(t=t.filter(e=>{const t=this.hass.states[e.entity_id];return t&&"unavailable"!==t.state&&"unknown"!==t.state})),t=wi(this.hass,this.config,t),t}_getUnavailableAreaEntities(e){let t=this._getAreaEntities(e);const i=[],a=[];t=t.filter(e=>{const t=this.hass.entities?.[e.entity_id];return!(t?.hidden_by||"diagnostic"===t?.entity_category||"config"===t?.entity_category)});const o=this.config?.areas_options?.[e];if(o?.groups_options){const e=new Set;for(const t of Object.values(o.groups_options))t.hidden?.forEach(t=>e.add(t));t=t.filter(t=>!e.has(t.entity_id))}return t=wi(this.hass,this.config,t),t.forEach(e=>{const t=this.hass.states[e.entity_id];t&&("unavailable"===t.state?i.push(e.entity_id):"unknown"===t.state&&a.push(e.entity_id))}),{unavailable:i,unknown:a}}_renderUnavailableEntitiesIcon(e){if(!1===this.config?.settings?.hide_unavailable_entities)return ye;const t=this._getUnavailableAreaEntities(e),i=t.unavailable.length+t.unknown.length;return 0===i?ye:fe`
      <button
        class="unavailable-entities-icon"
        @click=${()=>this._showUnavailableEntitiesModal(e)}
        title=${this._t("settings.hidden_unavailable_count",{count:i})}
      >
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span class="unavailable-count">${i}</span>
      </button>
    `}_getCachedAreaData(e){const t=this._areaDataCache.get(e.area_id);if(t&&Date.now()-t.timestamp<this._CACHE_DURATION)return t.data;const i=this._getFilteredAreaEntities(e.area_id),a=((e,t,i,a)=>{const o=i.map(e=>`${e.entity_id}:${t.states[e.entity_id]?.state}`).join("|"),r=`${e.area_id}-${i.length}-${o.substring(0,50)}`,n=gi.get(r);if(n&&Date.now()-n.timestamp<5e3)return n.data;let s,c,d,l;const p=t.areas[e.area_id];if(p){if("temperature_entity_id"in p){const e=p.temperature_entity_id;if(e&&t.states[e]){const i=t.states[e];"unavailable"!==i.state&&"unknown"!==i.state&&(s=t.formatEntityState(i))}}if("humidity_entity_id"in p){const e=p.humidity_entity_id;if(e&&t.states[e]){const i=t.states[e];"unavailable"!==i.state&&"unknown"!==i.state&&(c=t.formatEntityState(i))}}}let h=0,m=!1;i.forEach(i=>{const o=t.states[i.entity_id];if(!o)return;const r=bi(i.entity_id);if(!_i(i.entity_id,r,e.area_id,a)&&i.entity_id.startsWith("sensor.")&&"W"===o.attributes.unit_of_measurement&&"unavailable"!==o.state&&"unknown"!==o.state){const e=parseFloat(o.state);isNaN(e)||(h+=e,m=!0)}}),m&&(d=h>=1e3?`${(h/1e3).toFixed(1)} kW`:`${Math.round(h)} W`);let u=0,g=!1;i.forEach(i=>{const o=t.states[i.entity_id];if(!o)return;const r=bi(i.entity_id);if(!_i(i.entity_id,r,e.area_id,a)&&i.entity_id.startsWith("sensor.")&&"kWh"===o.attributes.unit_of_measurement&&"unavailable"!==o.state&&"unknown"!==o.state){const e=parseFloat(o.state);isNaN(e)||(u+=e,g=!0)}}),g&&(l=u>=1e3?`${(u/1e3).toFixed(1)} MWh`:`${u.toFixed(1)} kWh`);const _=[],b={light:{total:0,on:0},switch:{total:0,on:0},fan:{total:0,on:0},cover:{total:0,on:0},climate:{total:0,on:0},media_player:{total:0,on:0},lock:{total:0,on:0},motion:{total:0,on:0}};i.forEach(i=>{const o=t.states[i.entity_id];if(!o)return;const r=bi(i.entity_id);if(!_i(i.entity_id,r,e.area_id,a)){if(r in b){const e=b[r];if(!e)return;e.total++;const t="off"!==o.state&&"unavailable"!==o.state&&"unknown"!==o.state&&"closed"!==o.state&&"locked"!==o.state;"climate"===r?o.attributes.hvac_action&&"idle"!==o.attributes.hvac_action&&"off"!==o.attributes.hvac_action?e.on++:o.attributes.hvac_action||"off"===o.state||e.on++:t&&e.on++}if(i.entity_id.startsWith("binary_sensor.")&&"motion"===o.attributes.device_class){const e=b.motion;e&&(e.total++,"on"===o.state&&e.on++)}i.entity_id.startsWith("binary_sensor.")&&"on"===o.state&&o.attributes.device_class&&["door","window","moisture","smoke"].includes(o.attributes.device_class)&&_.push({entity_id:i.entity_id,deviceClass:o.attributes.device_class})}});const v={area_id:e.area_id,name:e.name,icon:e.icon||void 0,picture:e.picture||void 0,temperature:s,humidity:c,wattage:d,totalEnergy:l,alerts:_,domains:b};return gi.set(r,{data:v,timestamp:Date.now()}),v})(e,this.hass,i,this.config);return this._areaDataCache.set(e.area_id,{data:a,timestamp:Date.now()}),a}_getPictureContrastClass(e){if(!e)return"";const t=this._pictureContrastCache.get(e);return t?"dark"===t?"text-dark":"text-light":(this._pictureContrastCache.set(e,"pending"),this._analyzePictureContrast(e),"text-light")}async _analyzePictureContrast(e){try{const t=await this._calculatePictureTextTone(e);this._pictureContrastCache.set(e,t)}catch{this._pictureContrastCache.set(e,"light")}this.requestUpdate()}_calculatePictureTextTone(e){return new Promise((t,i)=>{const a=new Image;a.decoding="async",a.onload=()=>{try{const e=28,o=document.createElement("canvas");o.width=e,o.height=e;const r=o.getContext("2d",{willReadFrequently:!0});if(!r)return void i(new Error("Canvas context unavailable"));r.drawImage(a,0,0,e,e);const n=r.getImageData(0,0,e,e).data,s=[{x0:.1,x1:.7,y0:.2,y1:.75},{x0:.08,x1:.72,y0:.56,y1:.96},{x0:.18,x1:.82,y0:.18,y1:.82}].map(t=>{const i=Math.floor(t.x0*e),a=Math.ceil(t.x1*e),o=Math.floor(t.y0*e),r=Math.ceil(t.y1*e);let s=0,c=0;for(let t=o;t<r;t++)for(let o=i;o<a;o++){const i=4*(t*e+o),a=(n[i+3]??255)/255;s+=.2126*((n[i]??255)*a+255*(1-a))+.7152*((n[i+1]??255)*a+255*(1-a))+.0722*((n[i+2]??255)*a+255*(1-a)),c++}return c?s/c:0}),c=Math.min(...s);t(c>170?"dark":"light")}catch(e){i(e)}},a.onerror=()=>i(new Error("Image could not be loaded")),a.src=e})}_countActiveEntities(e,t){return e.filter(e=>{const i=this._getEffectiveEntityState(this.hass.states[e.entity_id]);return this._isEntityActiveForUi(i,t)}).length}_areAllEntitiesOff(e,t){return 0===this._countActiveEntities(e,t)}_confirmDiscardSettings(){return"settings"!==this._selectedView||!this._settingsDirty||window.confirm("Discard unsaved dashboard settings?")}_clearSettingsEditState(){this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsSavePending=!1,this._settingsEditorInitialized=!1}_selectView(e){("settings"===e||this._confirmDiscardSettings())&&(this._closeMobileDomainMenu(),this._resetAreaHeaderScrollState("area"===e),this._selectedView=e,"home"===e?(this._selectedArea=null,this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._clearSettingsEditState()):"settings"===e&&(this._selectedArea=null,this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1),this._syncBottomNavAreaContext(),this._closeMobileNav())}_selectArea(e){this._confirmDiscardSettings()&&(this._closeMobileDomainMenu(),this._resetAreaHeaderScrollState(!0),this._selectedArea=e,this._selectedView="area",this._editMode=!1,this._rememberAreaEditMode(null),this._clearSettingsEditState(),this._closeMobileNav(),this._updateUrlArea(e),this._syncBottomNavAreaContext())}_toggleHeader(){this._headerExpanded=!this._headerExpanded}_toggleMobileNav(){this._mobileNavOpen=!this._mobileNavOpen}_openDeviceDomain(e){this._navigateToDeviceDomain(e);const t=e.startsWith("binary_sensor.")?e.slice(14):void 0,i={domain:e,icon:"person"===e?"mdi:account-group":t?Zt("binary_sensor",t):Kt(e),label:t?$t(this.hass,t):kt(this.hass,e)},a=()=>{new URL(window.location.href).searchParams.get("dd_device")===e&&(window.dispatchEvent(new CustomEvent("dwains-dashboard-next-select-device-domain",{detail:i})),window.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-context-changed",{detail:i})))};a(),[120,360].forEach(e=>window.setTimeout(a,e))}_navigateToDeviceDomain(e){const t=window.location.pathname.split("/")[1]||"lovelace",i=new URL(window.location.href);i.pathname=`/${t}/devices`,i.search="",e&&i.searchParams.set("dd_device",e),window.history.pushState(null,"",`${i.pathname}${i.search}`);const a=new Event("location-changed",{bubbles:!0,composed:!0});a.detail={replace:!1},window.dispatchEvent(a)}_renderFavoritesSection(){const e=this._getEffectiveFavoriteEntities();return 0===e.length?ye:fe`
      <div class="favorites-section">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <h3>${this._t("favorites.title")}</h3>
        </div>
        <div class="favorites-grid">
          ${at(e,e=>e,e=>this._renderFavoriteTile(e))}
        </div>
      </div>
    `}_renderFavoriteTile(e){const t=this.hass?.states[e];return t?fe`
      <dwains-dashboard-next-tile-host class="favorite-tile-wrapper" .hass=${this.hass} entity="${e}"></dwains-dashboard-next-tile-host>
    `:ye}async _renderFavoriteTileCards(){if(!this.shadowRoot||!this.hass)return;if(!this._headerExpanded)return;const e=++this._favoritesRenderVersion,t=this.shadowRoot?.querySelectorAll("dwains-dashboard-next-tile-host.favorite-tile-wrapper");t&&t.forEach(t=>{if(!t||!t.isConnected)return;t.getAttribute("entity")&&e===this._favoritesRenderVersion&&this._headerExpanded&&(t.hass=this.hass)})}async _loadHomeAssistantSummaries(){if(!this.hass)return;const[e,t]=await Promise.all([this._fetchRepairsIssueCount(),this._fetchDiscoveredDeviceCount()]);this._repairsIssueCount!==e&&(this._repairsIssueCount=e),this._discoveredDeviceCount!==t&&(this._discoveredDeviceCount=t)}async _fetchRepairsIssueCount(){try{const e=await this.hass.callWS({type:"repairs/list_issues"});return this._extractCollection(e?.issues??e).filter(e=>!this._isSummaryItemDismissed(e)).length}catch(e){return 0}}async _fetchDiscoveredDeviceCount(){const e=["config_entries/flow/progress","config_entries/discovery_info","config_entries/discovery_info/list","config_entries/get_discovery_info"];for(const t of e)try{const e=await this.hass.callWS({type:t}),i=this._countDiscoveryItems(e);if(i>0)return i}catch(e){}return 0}_getUpdateEntityCount(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id?.startsWith("update.")&&"on"===e.state).length}_hasUpdateEntityChanges(e,t){const i=new Set([...Object.keys(e.states||{}).filter(e=>e.startsWith("update.")),...Object.keys(t.states||{}).filter(e=>e.startsWith("update."))]);for(const a of i){const i=e.states[a],o=t.states[a];if(i?.state!==o?.state)return!0}return!1}_extractCollection(e){return e?Array.isArray(e)?e:"object"==typeof e?Object.values(e):[]:[]}_isSummaryItemDismissed(e){return Boolean(e?.dismissed||e?.ignored||e?.is_ignored||"ignored"===e?.status||"dismissed"===e?.status)}_countDiscoveryItems(e){if(!e)return 0;if(Array.isArray(e))return e.filter(e=>!this._isSummaryItemDismissed(e)).length;if("object"!=typeof e)return 0;if(this._looksLikeDiscoveryItem(e))return this._isSummaryItemDismissed(e)?0:1;const t=e.discovered??e.discovery??e.flows??e.entries??e.items;return t?this._countDiscoveryItems(t):Object.values(e).reduce((e,t)=>e+this._countDiscoveryItems(t),0)}_looksLikeDiscoveryItem(e){return!(!e||"object"!=typeof e||Array.isArray(e))&&Boolean(e.flow_id||e.handler||e.source||e.context||e.integration||e.domain)}_closeMobileNav(){this._mobileNavOpen=!1}_showMoreInfo(e){Fi(this,"hass-more-info",{entityId:e})}_syncSettingsEditor(){const e=this.renderRoot?.querySelector("dwains-dashboard-next-strategy-editor");e&&this.hass&&this.config&&(e.hass=this.hass,this._settingsEditorInitialized||(this._settingsEditorInitialized=!0,e.setConfig(this.config)))}async _saveSettingsPage(){if(this._pendingSettingsConfig&&!this._settingsSavePending&&this.hass&&this._canManageDashboard()){this._settingsSavePending=!0,this._settingsSaveError="";try{const e=this._getDashboardUrlPath(),t=e?{url_path:e}:{},i=await this.hass.callWS({type:"lovelace/config",...t}),a={...i?.strategy||{},...this._pendingSettingsConfig},o={...i,strategy:a};await this.hass.callWS({type:"lovelace/config/save",...t,config:o}),this.config={...this.config,...this._pendingSettingsConfig},this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1,this.requestUpdate()}catch(e){console.error("Failed to save Dwains Dashboard settings:",e),this._settingsSaveError=this._t("error.settings_save",{error:String(e)})}finally{this._settingsSavePending=!1}}}_renderSettingsView(){const e=this._settingsDirty&&!this._settingsSavePending;return fe`
      <section class="settings-page-view">
        <header class="settings-page-header">
          <button
            class="settings-page-back"
            type="button"
            title=${this._t("common.close")}
            aria-label=${this._t("common.close")}
            @click=${this._closeSettingsPage}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="settings-page-title">
            <h1>${this._t("sidebar.dashboard_settings")}</h1>
            <p>${this._t("settings.subtitle")}</p>
          </div>
          <div class="settings-page-actions">
            <button type="button" class="settings-secondary" @click=${this._closeSettingsPage}>
              ${this._t("common.back")}
            </button>
            <button
              type="button"
              class="settings-primary"
              ?disabled=${!e}
              @click=${this._saveSettingsPage}
            >
              ${this._settingsSavePending?this._t("common.saving"):this._t("common.save")}
            </button>
          </div>
        </header>
        ${this._settingsSaveError?fe`<div class="settings-save-error">${this._settingsSaveError}</div>`:ye}
        <div class="settings-page-editor" @config-changed=${this._handleSettingsConfigChanged}>
          <dwains-dashboard-next-strategy-editor></dwains-dashboard-next-strategy-editor>
        </div>
        <div class="settings-page-bottom-actions">
          <button type="button" class="settings-secondary" @click=${this._closeSettingsPage}>
            Back
          </button>
          <button
            type="button"
            class="settings-primary"
            ?disabled=${!e}
            @click=${this._saveSettingsPage}
          >
            ${this._settingsSavePending?this._t("common.saving"):this._t("common.save")}
          </button>
        </div>
      </section>
    `}_getWelcomeUserPicture(e){const t=e.trim().toLowerCase(),i=Object.values(this.hass?.states||{}).filter(e=>e.entity_id?.startsWith("person.")),a=i.find(e=>String(e.attributes?.friendly_name||"").trim().toLowerCase()===t),o=i.find(e=>e.attributes?.entity_picture);return(a||o)?.attributes?.entity_picture}async _loadPersistentNotifications(e=!0){if(this.hass&&this._showNotificationsUi()){this._notificationsLoading=!0,e&&(this._notificationsError="");try{const e=await this.hass.callWS({type:"persistent_notification/get"});this._persistentNotifications=this._sortPersistentNotifications(this._normalizePersistentNotifications(e)),this._notificationsError=""}catch(t){(e||this._notificationsOpen)&&(console.error("Failed to load persistent notifications:",t),this._notificationsError=this._t("error.notifications_load"))}finally{this._notificationsLoading=!1}}}async _ensurePersistentNotificationsSubscription(){if(!this._showNotificationsUi()||this._persistentNotificationsUnsub||!this.hass)return;const e=this.hass.connection;if(e?.subscribeMessage)try{const t=await e.subscribeMessage(e=>this._handlePersistentNotificationEvent(e),{type:"persistent_notification/subscribe"});"function"==typeof t&&(this._persistentNotificationsUnsub=()=>{t()})}catch(e){console.warn("Persistent notification subscription unavailable:",e)}}_handlePersistentNotificationEvent(e){if(!this._showNotificationsUi())return;const t=e?.type,i=this._normalizePersistentNotifications(e?.notifications);if("current"===t)return this._persistentNotifications=this._sortPersistentNotifications(i),void(this._notificationsError="");if("removed"===t){const e=new Set(i.map(e=>e.notification_id));return void(this._persistentNotifications=this._persistentNotifications.filter(t=>!e.has(t.notification_id)))}if("added"===t||"updated"===t){const e=new Map(this._persistentNotifications.map(e=>[e.notification_id,e]));i.forEach(t=>e.set(t.notification_id,t)),this._persistentNotifications=this._sortPersistentNotifications([...e.values()])}}_normalizePersistentNotifications(e){return(Array.isArray(e)?e:Object.values(e||{})).map(e=>({notification_id:String(e?.notification_id||""),title:e?.title||null,message:String(e?.message||""),created_at:e?.created_at?String(e.created_at):void 0})).filter(e=>e.notification_id)}_sortPersistentNotifications(e){return[...e].sort((e,t)=>(t.created_at?Date.parse(t.created_at):0)-(e.created_at?Date.parse(e.created_at):0))}_formatNotificationDate(e){const t=Date.parse(e);return Number.isFinite(t)?new Date(t).toLocaleString(this.hass?.language||void 0,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):e}_handleStatusCardClick(e){"person"===e.domain?this._showPersonEntities():"wattage"===e.domain?this._showWattageEntities():this._showHouseStatusEntities(e)}_showHouseStatusEntities(e){const t=e.entities||[];t.length?Ui(this,{domain:e.domain,config:this.config,deviceClass:e.deviceClass,entityIds:t,customTitle:e.name,viewAllLabel:"View all",onViewAll:()=>this._openDeviceDomain(this._statusDeviceDomainKey(e))}):this._openDeviceDomain(this._statusDeviceDomainKey(e))}_statusDeviceDomainKey(e){return e.deviceClass?`${e.domain}.${e.deviceClass}`:e.domain}_showPersonEntities(){Ui(this,{domain:"person",config:this.config})}_showWattageEntities(){Ui(this,{domain:"sensor",config:this.config,filterByUnitOfMeasurement:"W"})}_handleLightToggle(e,t){e.stopPropagation(),this._toggleAreaLights(t)}_shouldUpdateEntities(e,t){const i=["light","switch","climate","media_player","camera","cover","lock","binary_sensor","person","sensor","fan"];return Object.keys(t.states).some(a=>{const o=a.split(".")[0];if(!o||!i.includes(o))return!1;const r=e.states[a],n=t.states[a];return r?.state!==n?.state||r?.attributes!==n?.attributes})}_updateEntityCards(e,t){this.shadowRoot&&this.shadowRoot.querySelectorAll("dwains-dashboard-next-card-host, dwains-dashboard-next-tile-host, hui-card, hui-tile-card, hui-entity-card, hui-thermostat-card, hui-picture-entity-card, hui-media-control-card").forEach(e=>{e.hass!==t&&(e.hass=t)})}_clearEntityCardsCache(){this._areaDataCache.clear(),this._domainCountsCache.clear(),gi.clear()}_invalidateChangedAreaCaches(e,t){const i=new Set;let a=!1;for(const o of this.config?.entities||[]){const r=o.entity_id,n=e.states[r],s=t.states[r];n!==s&&(n?.state===s?.state&&n?.attributes===s?.attributes||(a=!0,o.area_id&&i.add(o.area_id)))}a&&this._domainCountsCache.clear(),i.forEach(e=>{this._areaDataCache.delete(e),(e=>{const t=`${e}-`;for(const e of gi.keys())e.startsWith(t)&&gi.delete(e)})(e)})}_showUnavailableEntitiesModal(e){const t=this._getUnavailableAreaEntities(e),i=this.config?.areas?.find(t=>t.area_id===e),a=i?.name||e,o=[...t.unavailable,...t.unknown];Ui(this,{domain:"unavailable",areaId:e,config:this.config,customTitle:`Hidden Unavailable Entities - ${a}`,customEntities:o,customDescription:"These entities are currently hidden because they have 'unavailable' or 'unknown' states. You can disable this filtering in the dashboard configuration."})}async _toggleAreaLights(e,t=!0){const i=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("light."));if(0===i.length)return;if(t){if(!await this._showConfirmation(this._t("action.toggle_lights"),this._t("action.confirm_lights")))return}const a=this._areAllEntitiesOff(i,"light"),o=a?"turn_on":"turn_off",r=i.map(e=>e.entity_id);this._setOptimisticEntityStates(r,a?"on":"off");try{await this.hass.callService("light",o,{entity_id:r}),this._showToast(this._t(a?"action.all_lights_on":"action.all_lights_off"))}catch(t){this._clearOptimisticEntityStates(r),console.warn(`Failed to toggle lights in area ${e}:`,t),this._showToast(this._t("entity.lights_failed"))}}async _toggleAreaSwitches(e,t=!0){const i=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("switch."));if(0===i.length)return;if(t){if(!await this._showConfirmation(this._t("action.toggle_switches"),this._t("action.confirm_switches")))return}const a=this._areAllEntitiesOff(i,"switch"),o=a?"turn_on":"turn_off",r=i.map(e=>e.entity_id);this._setOptimisticEntityStates(r,a?"on":"off");try{await this.hass.callService("switch",o,{entity_id:r}),this._showToast(this._t(a?"action.all_switches_on":"action.all_switches_off"))}catch(t){this._clearOptimisticEntityStates(r),console.warn(`Failed to toggle switches in area ${e}:`,t),this._showToast(this._t("entity.switches_failed"))}}_hasOpenCovers(e){return e.some(e=>{const t=this._getEffectiveEntityState(this.hass.states[e.entity_id]),i=String(t?.state||"").toLowerCase();return"open"===i||"opening"===i})}async _toggleAreaCovers(e,t=!1){const i=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("cover."));if(0===i.length)return;const o=this._hasOpenCovers(i);if(t){if(!await this._showConfirmation(this._t("action.toggle_covers"),this._t("action.confirm_bulk",{action:this._t(o?"action.close":"action.open"),entities:kt(this.hass,"cover").toLocaleLowerCase(a(this.hass))})))return}const r=o?"close_cover":"open_cover",n=i.map(e=>e.entity_id);this._setOptimisticEntityStates(n,o?"closed":"open");try{await this.hass.callService("cover",r,{entity_id:n}),this._showToast(this._t(o?"action.close_all":"action.open_all"))}catch(t){this._clearOptimisticEntityStates(n),console.warn(`Failed to toggle covers in area ${e}:`,t),this._showToast(this._t("entity.covers_failed"))}}async _showConfirmation(e,t){return confirm(`${e}\n\n${t}`)}_showToast(e){console.log("Toast:",e)}};Na.styles=j`
    :host {
      display: block;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      /*background: var(--primary-background-color);*/
      color: var(--primary-text-color);
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    button,
    .area-button,
    .home-status-card,
    .status-card-compact,
    .mobile-area-card,
    .house-person-mini,
    .person-card,
    .favorite-card-wrapper,
    .favorite-quick-action,
    .mobile-domain-more,
    .mobile-layout-toggle,
    .mobile-entity-card,
    .mobile-entity-action,
    .mobile-cover-action,
    .mobile-entity-toggle,
    .area-badge,
    .area-quick-control,
    .dd-edit-toggle,
    .unavailable-entities-icon,
    .dd-add-card,
    .dd-custom-card-wrap.editing {
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .dd-static-icon {
      width: 20px;
      height: 20px;
      display: block;
      flex: 0 0 auto;
      fill: currentColor;
      pointer-events: none;
    }

    .mobile-area-card,
    .home-camera-card,
    .home-summary-card,
    .home-status-card,
    .favorite-card-wrapper {
      contain: layout style paint;
    }

    .mobile-home-section,
    .home-camera-section,
    .home-status-section,
    .home-todos-section,
    .home-favorites-section,
    .home-summaries-section,
    .mobile-domain-group {
      content-visibility: auto;
      contain-intrinsic-size: 1px 360px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      content-visibility: auto;
      contain-intrinsic-size: 164px 150px;
    }

    :host {
      display: block;
      height: calc(100dvh - var(--header-height, 56px));
      min-height: 0;
      overflow: hidden;
    }

    /* Layout Container */
    .layout-container {
      --area-sidebar-width: 250px;
      display: flex;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    .layout-container.sidebar-resizing,
    .layout-container.sidebar-resizing * {
      cursor: col-resize !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .layout-container.sidebar-collapsed .sidebar {
      width: 0;
      flex-basis: 0;
      border-right: 0;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-16px);
    }

    .layout-container.sidebar-collapsed .main-content {
      min-width: 0;
    }

    /* Sidebar Styles */
    .sidebar {
      width: var(--area-sidebar-width);
      flex: 0 0 var(--area-sidebar-width);
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, width 0.16s ease, flex-basis 0.16s ease;
      z-index: 1;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      -webkit-overflow-scrolling: touch;
    }

    .layout-container.sidebar-resizing .sidebar {
      transition: none;
    }

    .sidebar-resize-handle {
      flex: 0 0 10px;
      width: 10px;
      align-self: stretch;
      margin-left: -5px;
      margin-right: -5px;
      position: relative;
      z-index: 4;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: col-resize;
      touch-action: none;
    }

    .sidebar-resize-handle::before {
      content: '';
      position: absolute;
      top: 14px;
      bottom: 14px;
      left: 4px;
      width: 2px;
      border-radius: 999px;
      background: transparent;
      transition: background 0.16s ease, box-shadow 0.16s ease;
    }

    .sidebar-resize-handle:hover::before,
    .sidebar-resize-handle:focus-visible::before,
    .layout-container.sidebar-resizing .sidebar-resize-handle::before {
      background: var(--primary-color);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .sidebar-resize-handle:focus-visible {
      outline: none;
    }

    .sidebar-collapse-toggle {
      position: absolute;
      top: 50%;
      left: calc(var(--area-sidebar-width) - 17px);
      z-index: 6;
      width: 34px;
      height: 54px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 96%, transparent);
      color: var(--primary-text-color);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
      cursor: pointer;
      transform: translateY(-50%);
      transition:
        top 0.16s ease,
        left 0.16s ease,
        transform 0.16s ease,
        background-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .sidebar-collapse-toggle:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .sidebar-collapse-toggle:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .sidebar-collapse-toggle ha-icon {
      --mdc-icon-size: 18px;
    }

    .sidebar-collapse-toggle.is-collapsed {
      left: 0;
      top: 50%;
      width: 34px;
      min-width: 34px;
      height: 54px;
      padding: 0;
      border-left: 0;
      border-radius: 0 999px 999px 0;
      background: color-mix(in srgb, var(--card-background-color) 98%, transparent);
      transform: translateY(-50%);
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
    }

    .sidebar-collapse-label {
      display: none;
      font-size: 13px;
      font-weight: 850;
      line-height: 1;
    }

    .sidebar-collapse-toggle.is-collapsed .sidebar-collapse-label {
      display: inline;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Global Header */
    .global-header {
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .global-header.compact {
      padding: 8px 16px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Time and Weather Section (right side) */
    .header-time-weather {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      min-width: 120px;
    }

    .header-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      line-height: 0.8;
    }

    .header-time {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
      line-height: 1.2;
    }

    .header-date {
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    /* Weather Display */
    .weather-compact {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      background: var(--secondary-background-color);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .weather-compact:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateY(-1px);
    }

    .weather-icon-compact ha-icon {
      --mdc-icon-size: 24px;
    }

    .weather-temp-compact {
      font-size: 14px;
      font-weight: 500;
    }

    /* Status Cards Section */
    .header-status-section {
      flex: 1;
      overflow: hidden;
    }

    .header-status-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .header-status-scroll::-webkit-scrollbar {
      display: none;
    }

    /* Status Card Compact */
    .status-card-compact {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 60px;
      position: relative;
    }

    .status-card-compact:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .status-card-icon-compact {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .status-card-badge-compact {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    .status-card-title-compact {
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.8;
    }

    /* Domain-specific status card colors */
    .status-card-compact.light .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #e1a129) 15%, transparent);
    }

    .status-card-compact.light ha-icon {
      color: var(--status-color, #e1a129);
    }

    .status-card-compact.switch .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #2f6fd6) 15%, transparent);
    }

    .status-card-compact.switch ha-icon {
      color: var(--status-color, #2f6fd6);
    }

    .status-card-compact.binary_sensor .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #df5b63) 15%, transparent);
    }

    .status-card-compact.binary_sensor ha-icon {
      color: var(--status-color, #df5b63);
    }

    .status-card-compact.person .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #6d7891) 15%, transparent);
    }

    .status-card-compact.person ha-icon {
      color: var(--status-color, #6d7891);
    }

    .status-card-compact.wattage .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #d88e20) 15%, transparent);
    }

    .status-card-compact.wattage ha-icon {
      color: var(--status-color, #d88e20);
    }

    /* Header Expand Button */
    .header-expand-button {
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 5;
    }

    .header-expand-button:hover {
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header-expand-button[data-extra-count]::after {
      content: attr(data-extra-count);
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    /* Area List */
    .area-list {
      padding: 8px;
    }

    /* Floor Sections */
    .floor-section {
      margin-bottom: 16px;
    }

    .floor-header {
      padding: 8px 16px;
      margin-bottom: 8px;
    }

    .floor-header h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .floor-areas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(178px, 1fr));
      gap: 8px;
    }

    .area-button {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      height: 125px;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      min-width: 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    /* Home button specific styling */
    .area-button.home-button {
      height: 60px;
    }

    /* Background image styles */
    .area-button.has-picture {
      position: relative;
      background: var(--secondary-background-color);
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-button.has-picture.text-dark {
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .area-button.has-picture:hover .area-background {
      opacity: 0.8;
    }

    /* Area content structure */
    .area-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      height: 100%;
      justify-content: space-between;
    }

    .area-top-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .area-bottom-section {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 4px;
    }

    /* Enhanced text styling for picture backgrounds */
    .area-button.has-picture .area-name,
    .area-button.has-picture .area-sensors {
      text-shadow: var(--area-picture-text-shadow);
      color: var(--area-picture-text-color);
    }

    /* Area main icon in sidebar - override home view styling */
    .sidebar .area-main-icon {
      position: absolute;
      left: -25px;
      bottom: -25px;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-color) 60%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-main-icon {
      background: rgba(255,255,255,0.2);
    }

    .sidebar .area-main-icon ha-icon {
      --mdc-icon-size: 40px;
      color: var(--primary-color);
    }

    /* Info badges container */
    .area-info-badges {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      align-items: center;
    }

    /* Legacy area-icon styles (still used for simple buttons) */
    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon {
      background: rgba(255,255,255,0.2);
    }

    /* Legacy area-info styles (still used for simple buttons) */
    .area-info {
      flex: 1;
    }

    .area-menu-chevron {
      display: none;
    }

    .home-notification-shortcut {
      box-sizing: border-box;
      position: relative;
      z-index: 2;
      min-width: 42px;
      height: 28px;
      margin-left: auto;
      padding: 0 7px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex-shrink: 0;
      cursor: pointer;
      color: #dc2626;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        inset 0 0 0 1px rgba(220, 38, 38, 0.08),
        0 6px 14px rgba(220, 38, 38, 0.1);
    }

    .home-notification-shortcut ha-icon {
      --mdc-icon-size: 15px;
    }

    .home-notification-count {
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #e13f3f;
      color: #ffffff;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
    }

    .area-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .area-sensors {
      font-size: 13px;
      opacity: 0.8;
      font-weight: 500;
    }

    /* Legacy area-alerts styles (still used for simple buttons without badges) */
    .area-alerts {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--error-color);
      color: var(--text-primary-color);
      font-size: 11px;
      font-weight: bold;
      flex-shrink: 0;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overflow-anchor: none;
      overscroll-behavior: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
    }

    .content-area.settings-content-area {
      padding: 0;
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--primary-color) 4%, transparent) 0,
          transparent 220px),
        var(--primary-background-color);
    }

    .settings-page-view {
      width: min(1180px, calc(100% - 32px));
      min-height: 100%;
      margin: 0 auto;
      padding: 18px 0 104px;
      box-sizing: border-box;
    }

    .settings-page-header {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      margin: 0 0 16px;
      padding: 16px 18px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 18px;
      background:
        linear-gradient(135deg,
          color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
          color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color)) 100%);
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
    }

    .settings-page-back,
    .settings-secondary,
    .settings-primary {
      appearance: none;
      border: 0;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .settings-page-back {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      color: var(--primary-text-color);
    }

    .settings-page-back ha-icon {
      --mdc-icon-size: 22px;
    }

    .settings-page-title {
      min-width: 0;
    }

    .settings-page-title h1 {
      margin: 0;
      font-size: clamp(22px, 2vw, 30px);
      line-height: 1.08;
      font-weight: 850;
      color: var(--primary-text-color);
      letter-spacing: 0;
    }

    .settings-page-title p {
      margin: 5px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.35;
    }

    .settings-page-actions,
    .settings-page-bottom-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }

    .settings-secondary,
    .settings-primary {
      min-height: 40px;
      padding: 0 18px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
    }

    .settings-secondary {
      background: transparent;
      color: var(--primary-color);
    }

    .settings-primary {
      background: var(--primary-color);
      color: var(--text-primary-color);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--primary-color) 24%, transparent);
    }

    .settings-primary:disabled {
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }

    .settings-save-error {
      margin: 0 0 14px;
      padding: 12px 14px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--error-color) 12%, var(--card-background-color));
      color: var(--error-color);
      font-weight: 750;
      font-size: 13px;
    }

    .settings-page-editor {
      overflow: hidden;
      border-radius: 18px;
      background: var(--card-background-color);
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      box-shadow: 0 16px 46px rgba(15, 23, 42, 0.08);
    }

    .settings-page-editor dwains-dashboard-next-strategy-editor {
      display: block;
    }

    .settings-page-bottom-actions {
      display: none;
    }

    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .content-area {
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }
    }

    /* Home View */
    .home-view {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0px; /*24px;*/
    }

    /* Home Welcome */
    .home-welcome {
      text-align: left;
      margin-bottom: 28px;
      padding: 0;
      background: color-mix(in srgb, var(--card-background-color) 97%, var(--primary-background-color));
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
    }

    .welcome-content {
      margin: 0 auto;
      padding: 18px 22px;
    }

    .welcome-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 18px;
      margin-bottom: 0;
    }

    .welcome-user {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .welcome-avatar {
      border: 0;
      padding: 0;
      display: inline-flex;
      width: 52px;
      height: 52px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      appearance: none;
      -webkit-appearance: none;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border-radius: 999px;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.1),
        0 0 0 3px rgba(255, 255, 255, 0.72);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .welcome-avatar:hover {
      transform: translateY(-1px);
    }

    .welcome-avatar:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .welcome-avatar ha-icon {
      --mdc-icon-size: 26px;
    }

    .welcome-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .welcome-copy {
      min-width: 0;
    }

    .welcome-text {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .welcome-greeting {
      font-size: 22px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    .welcome-name {
      font-size: 28px;
      font-weight: 750;
      color: var(--primary-text-color);
    }

    .welcome-title {
      display: none;
    }

    .welcome-return {
      display: block;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 650;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .welcome-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .welcome-action {
      position: relative;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .welcome-action:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .welcome-action ha-icon {
      --mdc-icon-size: 22px;
    }

    .welcome-action:active {
      transform: scale(0.96);
    }

    .welcome-action-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--error-color);
      color: #fff;
      font-size: 10px;
      font-weight: 850;
      line-height: 1;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .welcome-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      min-width: 112px;
      line-height: 1.1;
    }

    .welcome-time {
      font-size: 34px;
      font-weight: 800;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
    }

    .welcome-date {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 650;
    }

    .welcome-subheader {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
    }

    .welcome-alarm {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-alarm.alarm-armed {
      background: var(--error-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-disarmed {
      background: var(--success-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-triggered {
      background: var(--error-color);
      color: var(--text-primary-color);
      animation: pulse 2s infinite;
    }

    .welcome-alarm:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-alarm ha-icon {
      --mdc-icon-size: 18px;
    }

    .alarm-text {
      font-size: 14px;
      font-weight: 600;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .welcome-weather {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-weather:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-weather ha-icon {
      --mdc-icon-size: 20px;
    }

    .weather-temp {
      font-size: 16px;
      font-weight: 600;
    }

    .weather-label {
      font-size: 12px;
      font-weight: 750;
      line-height: 1;
      opacity: 0.82;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .home-welcome {
        text-align: left;
        margin: -10px -10px 16px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 20px 16px;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
            color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
      }

      .welcome-content {
        padding: 0;
      }

      .welcome-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 0;
      }

      .welcome-user {
        gap: 10px;
        flex: 1 1 auto;
      }

      .welcome-avatar {
        display: inline-flex;
        width: 38px;
        height: 38px;
        border-radius: 999px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          0 0 0 3px rgba(255, 255, 255, 0.72);
      }

      .welcome-avatar ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-text {
        display: block;
      }

      .welcome-greeting,
      .welcome-name {
        display: none;
      }

      .welcome-title {
        display: block;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .welcome-return {
        display: block;
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1;
      }

      .welcome-time-section {
        display: none;
      }

      .welcome-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
      }

      .welcome-action {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 86%, var(--primary-background-color));
        box-shadow:
          0 8px 20px color-mix(in srgb, var(--primary-text-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .welcome-action ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-subheader {
        justify-content: flex-start;
        gap: 8px;
        margin-top: 16px;
        overflow-x: auto;
        padding-bottom: 2px;
        scrollbar-width: none;
      }

      .welcome-subheader::-webkit-scrollbar {
        display: none;
      }

      .welcome-alarm,
      .welcome-weather {
        min-width: auto;
        height: 42px;
        padding: 0 14px;
        justify-content: center;
        border-radius: 999px;
        flex: 0 0 auto;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .alarm-text,
      .weather-temp {
        font-size: 15px;
      }

      .weather-label {
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      .home-welcome {
        padding: calc(16px + env(safe-area-inset-top, 0px)) 18px 14px;
        margin-bottom: 14px;
      }

      .welcome-header {
        gap: 10px;
      }

      .welcome-avatar {
        width: 36px;
        height: 36px;
      }

      .welcome-title {
        font-size: 14px;
      }

      .welcome-return {
        font-size: 11px;
      }

      .welcome-action {
        width: 40px;
        height: 40px;
      }

      .welcome-alarm,
      .welcome-weather {
        height: 40px;
        padding: 0 13px;
        font-size: 14px;
      }

      .alarm-text,
      .weather-temp {
        font-size: 14px;
      }

      .weather-label {
        font-size: 10px;
      }
    }

    /* Home Status Cards */
    .home-status-section {
      margin-bottom: 48px;
    }

    .home-status-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 14px;
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 850;
      line-height: 1.1;
    }

    .home-status-heading ha-icon {
      --mdc-icon-size: 20px;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .home-camera-section {
      margin-bottom: 36px;
    }

    .home-camera-section .home-status-heading ha-icon {
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-camera-section .mobile-layout-toggle {
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-summaries-section {
      margin-bottom: 36px;
    }

    .home-summaries-section .home-status-heading ha-icon {
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-summaries-section .mobile-layout-toggle.active {
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-todos-section {
      margin-bottom: 36px;
    }

    .home-todos-section .home-status-heading ha-icon {
      color: #7c3aed;
      background: color-mix(in srgb, #7c3aed 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #7c3aed 8%, transparent);
    }

    .home-todos-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-todo-card,
    .home-todo-card dwains-dashboard-next-card-host {
      display: block;
      min-width: 0;
    }

    .home-summary-list {
      width: min(100%, 980px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .home-summary-card {
      appearance: none;
      width: 100%;
      min-height: 68px;
      padding: 12px 14px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 13px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      border-radius: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .home-summary-card:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--summary-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--summary-color) 13%, transparent);
    }

    .home-summary-card:active {
      transform: scale(0.992);
    }

    .home-summary-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--summary-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-summary-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      color: var(--summary-color);
      background: color-mix(in srgb, var(--summary-color) 14%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .home-summary-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-summary-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-subtitle {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-chevron {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 48%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-chevron ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .home-camera-card {
      position: relative;
      min-height: 168px;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      display: flex;
      align-items: stretch;
      padding: 0;
      background: color-mix(in srgb, var(--primary-text-color) 12%, var(--card-background-color));
      color: #ffffff;
      cursor: pointer;
      text-align: left;
      box-shadow:
        0 16px 32px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .home-camera-card:hover {
      transform: translateY(-2px);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.16);
    }

    .home-camera-card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .home-camera-image,
    .home-camera-placeholder {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .home-camera-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(var(--rgb-primary-color, 3, 169, 244), 0.28), transparent 34%),
        linear-gradient(135deg, #192133, #0f172a);
    }

    .home-camera-placeholder ha-icon {
      --mdc-icon-size: 44px;
      color: rgba(255, 255, 255, 0.58);
    }

    .home-camera-card::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 52%;
      background:
        linear-gradient(180deg,
          rgba(7, 11, 18, 0) 0%,
          rgba(7, 11, 18, 0.34) 42%,
          rgba(7, 11, 18, 0.84) 100%);
      pointer-events: none;
    }

    .home-camera-content {
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 168px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .home-camera-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .home-camera-area-icon,
    .home-camera-count {
      min-width: 36px;
      height: 36px;
      border-radius: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      backdrop-filter: blur(12px);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    }

    .home-camera-area-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-count {
      min-width: 44px;
      padding: 0 10px;
      gap: 5px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 850;
    }

    .home-camera-count ha-icon {
      --mdc-icon-size: 14px;
    }

    .home-camera-copy {
      min-width: 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.62);
    }

    .home-camera-name {
      font-size: 18px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-camera-meta {
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.76);
      font-size: 12px;
      font-weight: 720;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-home-section,
    .mobile-section-heading {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-home-section.mobile-home-areas {
      display: block;
      margin: 0 0 36px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 0;
      margin-bottom: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-action {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-rail {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-card {
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 156px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 14px 30px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .layout-container.sidebar-collapsed .mobile-area-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--primary-color) 22%, transparent);
      box-shadow: 0 18px 38px color-mix(in srgb, var(--primary-text-color) 11%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture {
      min-height: 176px;
      color: var(--mobile-area-picture-text-color, #ffffff);
      border-color: rgba(255, 255, 255, 0.16);
      background: #182044;
      --mobile-area-picture-text-color: #ffffff;
      --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --mobile-area-picture-overlay:
        linear-gradient(180deg, rgba(12, 18, 32, 0.02) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.84) 100%),
        linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
    }

    .layout-container.sidebar-collapsed .mobile-area-picture {
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: var(--mobile-area-picture-overlay);
      pointer-events: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-top,
    .layout-container.sidebar-collapsed .mobile-area-copy {
      position: relative;
      z-index: 2;
    }

    .layout-container.sidebar-collapsed .mobile-area-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .layout-container.sidebar-collapsed .mobile-area-icon {
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 13%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-icon ha-icon {
      --mdc-icon-size: 23px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-icon {
      color: var(--mobile-area-picture-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(12px);
    }

    .layout-container.sidebar-collapsed .mobile-area-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      min-width: 0;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge {
      min-width: 25px;
      height: 25px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 999px;
      color: var(--area-badge-color, var(--primary-color));
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
      font-size: 11px;
      font-weight: 850;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-badge {
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
    }

    .layout-container.sidebar-collapsed .mobile-area-name {
      font-size: 16px;
      font-weight: 850;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-meta {
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 56%, transparent);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-name,
    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-text-color, #ffffff);
      text-shadow: var(--mobile-area-picture-text-shadow);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
    }

    /* Person Cards Section */
    .person-cards-section {
      margin-bottom: 32px;
    }

    .person-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin: 0 auto;
    }

    .person-card {
      --person-color: #8a94a6;
      --person-bg: color-mix(in srgb, var(--person-color) 8%, var(--card-background-color));
      position: relative;
      min-height: 98px;
      padding: 16px 18px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.07);
      border-radius: 18px;
      background:
        radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--person-color) 15%, transparent), transparent 42%),
        var(--person-bg);
      cursor: pointer;
      box-shadow:
        0 16px 34px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px rgba(255, 255, 255, 0.34);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        border-color 0.18s ease;
    }

    .person-card::after {
      content: "";
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: var(--person-color);
      opacity: 0.34;
    }

    .person-card.home {
      --person-color: #2f9b62;
      --person-bg: color-mix(in srgb, #2f9b62 10%, var(--card-background-color));
    }

    .person-card.away {
      --person-color: #d88e20;
      --person-bg: color-mix(in srgb, #d88e20 9%, var(--card-background-color));
    }

    .person-card.unknown {
      --person-color: #7c67c7;
      --person-bg: color-mix(in srgb, #7c67c7 8%, var(--card-background-color));
    }

    .person-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--person-color) 24%, transparent);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-card:active {
      transform: scale(0.988);
    }

    .person-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--person-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .person-avatar-wrapper {
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .person-avatar {
      width: 64px;
      height: 64px;
      border-radius: 22px;
      overflow: hidden;
      background: color-mix(in srgb, var(--person-color) 14%, var(--secondary-background-color));
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid color-mix(in srgb, var(--person-color) 26%, rgba(255, 255, 255, 0.84));
      box-shadow: 0 12px 24px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .person-avatar ha-icon {
      --mdc-icon-size: 34px;
      color: var(--person-color);
    }

    .person-home-indicator {
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 26px;
      height: 26px;
      background: var(--person-color);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--card-background-color);
      box-shadow: 0 8px 18px color-mix(in srgb, var(--person-color) 26%, transparent);
    }

    .person-home-indicator ha-icon {
      --mdc-icon-size: 14px;
      color: var(--text-primary-color);
    }

    .person-info {
      position: relative;
      z-index: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .person-name {
      font-size: 18px;
      font-weight: 850;
      color: var(--primary-text-color);
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status {
      display: inline-flex;
      width: max-content;
      max-width: 100%;
      align-items: center;
      gap: 6px;
      min-height: 27px;
      padding: 0 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--person-color) 12%, transparent);
      color: var(--person-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status ha-icon {
      --mdc-icon-size: 15px;
    }

    .person-details {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 7px;
      align-items: flex-end;
      justify-content: flex-end;
      flex-shrink: 0;
      margin-left: auto;
      max-width: 170px;
    }

    .person-battery,
    .person-distance {
      display: flex;
      align-items: center;
      gap: 5px;
      min-height: 28px;
      font-size: 12px;
      font-weight: 800;
      color: color-mix(in srgb, var(--primary-text-color) 72%, transparent);
      background: rgba(255, 255, 255, 0.62);
      padding: 0 9px;
      border-radius: 999px;
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .person-battery ha-icon,
    .person-distance ha-icon {
      --mdc-icon-size: 14px;
    }

    .person-battery ha-icon {
      color: var(--success-color);
    }

    .person-battery ha-icon[icon*="alert"] {
      color: var(--error-color);
    }

    .person-distance ha-icon {
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .person-cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 12px;
      }

      .person-card {
        padding: 16px;
      }

      .person-avatar {
        width: 64px;
        height: 64px;
      }

      .person-avatar ha-icon {
        --mdc-icon-size: 36px;
      }

      .person-name {
        font-size: 16px;
      }

      .person-status {
        font-size: 13px;
      }

      .person-details {
        gap: 8px;
      }

      .person-battery,
      .person-distance {
        font-size: 12px;
        padding: 3px 6px;
      }
    }

    .home-status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
      margin: 0 auto;
    }

    .home-status-card {
      background: var(--card-background-color);
      border-radius: 20px;
      padding: 24px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid var(--divider-color);
      position: relative;
      overflow: hidden;
    }

    .home-status-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .home-status-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .home-status-card:hover::before {
      opacity: 1;
    }

    .home-status-card .status-card-icon {
      position: relative;
      margin-bottom: 16px;
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 36px;
      color: var(--primary-color);
      transition: transform 0.3s ease;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: scale(1.1);
    }

    .home-status-card .status-card-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--accent-color);
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .home-status-card .status-card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-top: 8px;
    }



    /* Area Info Badges */
    .area-info-badges {
      position: absolute;
      top: 5px;
      right: 0px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: calc(59% - 24px);
      justify-content: flex-end;
      align-items: flex-start;
      z-index: 2;
    }

    .info-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      font-size: 12px;
      flex-shrink: 0;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .info-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .info-badge.light {
      background: color-mix(in srgb, var(--badge-color, #e1a129) 10%, var(--card-background-color));
      color: var(--badge-color, #e1a129);
    }

    .info-badge.switch {
      background: color-mix(in srgb, var(--badge-color, #2f6fd6) 10%, var(--card-background-color));
      color: var(--badge-color, #2f6fd6);
    }

    .info-badge.climate {
      background: color-mix(in srgb, var(--badge-color, #34a6d8) 10%, var(--card-background-color));
      color: var(--badge-color, #34a6d8);
    }

    .info-badge.media_player {
      background: color-mix(in srgb, var(--badge-color, #7c67c7) 10%, var(--card-background-color));
      color: var(--badge-color, #7c67c7);
    }

    .info-badge.cover {
      background: color-mix(in srgb, var(--badge-color, #1494aa) 10%, var(--card-background-color));
      color: var(--badge-color, #1494aa);
    }

    .info-badge.fan {
      background: color-mix(in srgb, var(--badge-color, #2b8fcb) 10%, var(--card-background-color));
      color: var(--badge-color, #2b8fcb);
    }

    .info-badge.motion {
      background: color-mix(in srgb, var(--badge-color, #df5b63) 10%, var(--card-background-color));
      color: var(--badge-color, #df5b63);
    }

    .info-badge.alerts {
      background: color-mix(in srgb, var(--error-color) 10%, var(--card-background-color));
      color: var(--error-color);
    }

    /* Sidebar info badges (smaller) */
    .sidebar .info-badge {
      padding: 2px 6px;
      font-size: 11px;
      border-radius: 12px;
    }

    .sidebar .info-badge ha-icon {
      --mdc-icon-size: 12px;
    }

    .sidebar .badge-count {
      min-width: 14px;
      text-align: center;
    }

    /* Clickable badges */
    .info-badge.clickable {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .info-badge.clickable:hover {
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    /* Color fallbacks for themes without custom colors */
    :host {
      --purple-color: #9c27b0;
      --blue-color: #2196f3;
    }

    /* Area View */
    .area-view {
      max-width: 1400px;
      margin: 0 auto;
    }

    .area-header {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .area-title {
      font-size: 28px;
      font-weight: 400;
      margin: 0 0 16px 0;
      flex: 1;
    }

    .unavailable-entities-icon {
      background: var(--warning-color);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      margin-bottom: 16px;
    }

    .unavailable-entities-icon:hover {
      background: var(--error-color);
      transform: scale(1.1);
    }

    .unavailable-entities-icon ha-icon {
      --mdc-icon-size: 18px;
      color: white;
    }

    .unavailable-count {
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--error-color);
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 600;
      min-width: 16px;
      text-align: center;
      line-height: 1.2;
    }

    /* Area Badges */
    .area-badges {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .area-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 24px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .area-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .area-badge ha-icon {
      --mdc-icon-size: 20px;
    }

    .area-badge.light-toggle {
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.light-toggle ha-icon {
      color: var(--warning-color);
    }

    .area-badge.switch-toggle {
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.switch-toggle ha-icon {
      color: var(--info-color);
    }

    .area-badge.wattage {
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.wattage ha-icon {
      color: var(--warning-color);
    }

    .area-badge.energy {
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.energy ha-icon {
      color: var(--info-color);
    }

    /* Entities Section */
    .entities-section {
      display: grid;
      gap: 16px;
    }

    .domain-group {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
    }

    .domain-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header ha-icon {
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entities-grid.cover-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card,
    .light-entity-card,
    .motion-entity-card {
      min-height: 72px;
    }

    .sensor-entity-card {
      min-height: 150px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
    .light-entity-card dwains-dashboard-next-card-host,
    .sensor-entity-card dwains-dashboard-next-card-host,
    .motion-entity-card dwains-dashboard-next-card-host {
      display: block;
    }

    .mobile-area-overview,
    .mobile-entities-section {
      display: none;
    }

    .area-view .mobile-entities-section {
      display: grid;
      position: relative;
      z-index: 2;
    }

    .area-header-metrics {
      display: none;
    }

    .mobile-area-metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }

    .mobile-area-metric,
    .area-header-metric {
      min-height: 64px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
      border-radius: 10px;
      background: color-mix(in srgb, var(--metric-color) 10%, var(--card-background-color));
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 12%, transparent);
    }

    .mobile-area-metric.temperature,
    .area-header-metric.temperature {
      --metric-color: #7c67c7;
    }

    .mobile-area-metric.humidity,
    .area-header-metric.humidity {
      --metric-color: #34a6d8;
    }

    .mobile-area-metric.power,
    .area-header-metric.power {
      --metric-color: #d88e20;
    }

    .mobile-area-metric.energy,
    .area-header-metric.energy {
      --metric-color: #7c67c7;
    }

    .metric-ring {
      width: 44px;
      height: 44px;
      position: relative;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background:
        conic-gradient(var(--metric-color) 0deg var(--metric-angle), rgba(15, 23, 42, 0.08) var(--metric-angle) 270deg, transparent 270deg 360deg);
    }

    .metric-ring::after {
      content: "";
      position: absolute;
      inset: 5px;
      border-radius: inherit;
      background: color-mix(in srgb, var(--card-background-color) 92%, #ffffff);
    }

    .metric-ring.metric-icon {
      background: color-mix(in srgb, var(--metric-color) 15%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
    }

    .metric-ring.metric-icon::after {
      display: none;
    }

    .metric-ring.metric-icon ha-icon {
      --mdc-icon-size: 22px;
      color: var(--metric-color);
    }

    .metric-value {
      position: relative;
      z-index: 1;
      color: color-mix(in srgb, var(--primary-text-color) 74%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1;
    }

    .metric-copy {
      min-width: 0;
    }

    .metric-label {
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
    }

    .metric-range {
      margin-top: 4px;
      color: color-mix(in srgb, var(--primary-text-color) 38%, transparent);
      font-size: 10px;
      font-weight: 800;
      line-height: 1;
    }

    .metric-reading {
      margin-top: 3px;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
      white-space: nowrap;
    }

    .mobile-entities-section {
      gap: 22px;
    }

    .mobile-domain-group {
      min-width: 0;
      position: relative;
    }

    .mobile-domain-group:not(.menu-open) {
      contain: layout style paint;
    }

    .mobile-domain-group.menu-open {
      z-index: 1200;
    }

    .mobile-domain-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 2px;
      margin-bottom: 10px;
    }

    .mobile-domain-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mobile-layout-toggle {
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 72%, #ffffff);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-layout-toggle.active {
      background: #182044;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.14);
    }

    .mobile-layout-toggle:active {
      transform: scale(0.94);
    }

    .mobile-layout-toggle ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-layout-toggle.static {
      cursor: default;
      pointer-events: none;
    }

    .mobile-domain-title-copy {
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 7px;
    }

    .mobile-domain-title-label {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 900;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-domain-count {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.1;
      white-space: nowrap;
    }

    .mobile-domain-more {
      width: 32px;
      height: 32px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
      z-index: 1202;
    }

    .mobile-domain-more.active {
      background: rgba(255, 255, 255, 0.78);
      color: var(--primary-text-color);
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.16);
    }

    .mobile-domain-more:active {
      transform: scale(0.94);
    }

    .mobile-domain-more ha-icon {
      --mdc-icon-size: 20px;
    }

    .mobile-entity-rail {
      display: flex;
      gap: 10px;
      margin: 0 -10px;
      padding: 0 10px 2px;
      overflow-x: auto;
      scroll-padding: 10px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .mobile-entity-rail::-webkit-scrollbar {
      display: none;
    }

    .mobile-entities-section.layout-grid {
      gap: 26px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
      align-items: stretch;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none;
      scroll-snap-align: none;
    }

    @media (max-width: 380px) {
      .mobile-entities-section.layout-grid .mobile-entity-rail {
        grid-template-columns: 1fr;
      }
    }

    .mobile-entity-card {
      --entity-color: var(--primary-color);
      position: relative;
      box-sizing: border-box;
      contain: layout style;
      flex: 0 0 164px;
      min-width: 0;
      min-height: 128px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 10px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      scroll-snap-align: start;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .mobile-entity-replacement-card {
      box-sizing: border-box;
      flex: 0 0 260px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-replacement-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .mobile-todo-list-card {
      box-sizing: border-box;
      flex: 0 0 min(100%, 520px);
      width: min(100%, 520px);
      min-width: min(100%, 320px);
      scroll-snap-align: start;
    }

    .mobile-todo-list-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .mobile-entities-section.layout-grid .mobile-entity-replacement-card {
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-todo-list-card {
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entity-card:active {
      transform: scale(0.985);
      }

      .mobile-entity-card.is-active {
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 18%, transparent);
      }

      .mobile-entity-card.is-unavailable {
        opacity: 0.62;
      }

    .mobile-entity-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .mobile-entity-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 11px;
      color: var(--entity-color);
      background: color-mix(in srgb, var(--entity-color) 13%, transparent);
    }

      .mobile-entity-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .mobile-entity-action {
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border: 0;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          color 0.18s ease,
          transform 0.18s ease,
          opacity 0.18s ease;
      }

      .mobile-entity-action:active {
        transform: scale(0.94);
      }

      .mobile-entity-action:disabled {
        opacity: 0.36;
        cursor: not-allowed;
      }

      .mobile-entity-toggle {
        width: 38px;
        height: 22px;
        justify-content: flex-start;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.07),
          0 4px 10px rgba(15, 23, 42, 0.08);
      }

    .mobile-entity-toggle::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition: transform 0.18s ease;
      }

      .mobile-entity-card.is-active .mobile-entity-toggle {
        background: var(--entity-color);
      }

    .mobile-entity-card.is-active .mobile-entity-toggle::before {
      transform: translateX(16px);
    }

      .mobile-entity-more,
      .mobile-scene-action,
      .mobile-lock-action {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .mobile-lock-action.is-unlocked {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 8px 16px color-mix(in srgb, var(--entity-color) 24%, transparent);
      }

      .mobile-entity-more ha-icon,
      .mobile-scene-action ha-icon,
      .mobile-lock-action ha-icon {
        --mdc-icon-size: 17px;
      }

      .mobile-cover-actions {
        min-height: 32px;
        padding: 3px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.055),
          0 6px 14px rgba(15, 23, 42, 0.08);
      }

      .mobile-cover-action {
        width: 26px;
        height: 26px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        background: transparent;
      }

      .mobile-cover-action.active {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 6px 12px color-mix(in srgb, var(--entity-color) 22%, transparent);
      }

      .mobile-cover-action ha-icon {
        --mdc-icon-size: 16px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-actions {
        min-height: 30px;
        padding: 3px;
        gap: 2px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action {
        width: 24px;
        height: 24px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
        --mdc-icon-size: 15px;
      }

      @media (max-width: 430px) {
        .mobile-entities-section.layout-grid .mobile-entity-card {
          min-height: 138px;
          padding: 12px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-top {
          gap: 6px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-icon {
          width: 34px;
          height: 34px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-actions {
          min-height: 28px;
          padding: 2px;
          gap: 1px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action {
          width: 23px;
          height: 23px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
          --mdc-icon-size: 14px;
        }
      }

    .mobile-entity-meta {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

      .mobile-entity-name {
        margin-top: 3px;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 900;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .mobile-entity-status {
        margin-top: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
        font-size: 11px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-entity-content {
        min-width: 0;
      }

      .mobile-entity-card.has-inline-select {
        min-height: 170px;
        justify-content: flex-start;
        gap: 10px;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-content {
        margin-top: auto;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-status {
        display: none;
      }

      .mobile-entity-select {
        position: relative;
        display: block;
        width: 100%;
      }

      .mobile-entity-select select {
        width: 100%;
        height: 34px;
        padding: 0 34px 0 12px;
        border: 0;
        border-radius: 999px;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--entity-color) 10%, var(--secondary-background-color));
        font: inherit;
        font-size: 12px;
        font-weight: 850;
        line-height: 34px;
        cursor: pointer;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 16%, transparent),
          0 8px 18px rgba(15, 23, 42, 0.06);
      }

      .mobile-entity-select select:focus {
        box-shadow:
          inset 0 0 0 2px color-mix(in srgb, var(--entity-color) 72%, transparent),
          0 10px 22px color-mix(in srgb, var(--entity-color) 14%, transparent);
      }

      .mobile-entity-select select:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .mobile-entity-select ha-icon {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: color-mix(in srgb, var(--entity-color) 72%, var(--primary-text-color));
        pointer-events: none;
        --mdc-icon-size: 18px;
      }

    @media (min-width: 769px) {
      .area-view .mobile-entities-section {
        gap: 28px;
        margin-top: 20px;
      }

      .area-view .mobile-domain-group {
        min-width: 0;
      }

      .area-view .mobile-domain-header {
        padding: 0;
        margin-bottom: 12px;
      }

      .area-view .mobile-layout-toggle {
        display: none;
      }

      .area-view .mobile-domain-title {
        gap: 0;
      }

      .area-view .mobile-domain-title-label {
        font-size: 20px;
      }

      .area-view .mobile-domain-count {
        font-size: 12px;
      }

      .area-view .mobile-domain-more {
        background: transparent;
      }

      .area-view .mobile-entity-rail,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
        gap: 14px;
        margin: 0;
        padding: 0;
        overflow: visible;
        scroll-padding: 0;
        scroll-snap-type: none;
        align-items: stretch;
      }

      .area-view .mobile-entity-card,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-card {
        width: 100%;
        min-width: 0;
        min-height: 152px;
        flex: none;
        padding: 16px;
        border-radius: 12px;
        scroll-snap-align: none;
      }

      .area-view .mobile-entity-card:hover {
        transform: translateY(-1px);
        box-shadow:
          0 16px 32px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px rgba(15, 23, 42, 0.045);
      }

      .area-view .mobile-entity-card.has-inline-select {
        min-height: 178px;
      }

      .area-view .mobile-entity-icon,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-icon {
        width: 38px;
        height: 38px;
        border-radius: 11px;
      }

      .area-view .mobile-entity-icon ha-icon {
        --mdc-icon-size: 21px;
      }

      .area-view .mobile-entity-name {
        font-size: 15px;
      }

      .area-view .mobile-entity-status {
        font-size: 11px;
      }

      .area-view .mobile-cover-actions,
      .area-view .mobile-entities-section.layout-grid .mobile-cover-actions {
        min-height: 32px;
        padding: 3px;
        gap: 3px;
      }

      .area-view .mobile-cover-action,
      .area-view .mobile-entities-section.layout-grid .mobile-cover-action {
        width: 26px;
        height: 26px;
      }

      .area-view .mobile-cover-action ha-icon,
      .area-view .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
        --mdc-icon-size: 16px;
      }

      .area-view .mobile-entity-rail .dd-custom-card-wrap,
      .area-view .mobile-entity-rail .dd-domain-add-card,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
        width: 100%;
        min-width: 0;
        flex: none;
        scroll-snap-align: none;
      }

      .area-view .mobile-todo-list-card,
      .area-view .mobile-entities-section.layout-grid .mobile-todo-list-card {
        grid-column: 1 / -1;
        width: 100%;
        max-width: 760px;
        min-width: 0;
        flex: none;
        scroll-snap-align: none;
      }
    }

    @media (min-width: 1200px) {
      .area-view .mobile-entity-rail,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail {
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      }
    }

    /* Bewerk-toggle in de area-header */
    .area-header { display: flex; align-items: center; gap: 8px; }
    .dd-edit-toggle {
      margin-left: auto;
      display: inline-flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 50%;
      border: none; cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      transition: background-color .2s ease, color .2s ease;
    }
    .dd-edit-toggle:hover { background: rgba(var(--rgb-primary-color, 3,169,244), .14); }
    .dd-edit-toggle.active { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .dd-edit-toggle.danger:hover { background: rgba(var(--rgb-error-color, 244,67,54), .16); color: var(--error-color, #f44336); }
    .dd-edit-toggle ha-icon { --mdc-icon-size: 20px; }

    /* Sidebar: blueprint-pagina's + toevoegknop */
    .sidebar-divider {
      height: 1px;
      background: var(--divider-color);
      margin: 8px 12px;
    }
    .dd-add-page {
      width: 100%;
      box-sizing: border-box;
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 14px;
      transition: background-color .2s ease, color .2s ease, border-color .2s ease;
    }
    .dd-add-page:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .08);
    }
    .dd-add-page ha-icon { --mdc-icon-size: 20px; }

    /* Blueprint-paginakaart */
    .dd-page-card { margin-top: 8px; }
    .dd-page-card dwains-dashboard-next-card-host { display: block; }

    /* Area custom card slots */
    .dd-custom-section {
      margin: 12px 0;
      min-width: 0;
    }

    .dd-custom-section.after-domain {
      margin: 12px 0 2px;
    }

    .dd-custom-section.editing {
      padding: 10px;
      border: 1px dashed color-mix(in srgb, var(--primary-color) 28%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    .dd-custom-section.drag-over {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
    }

    .dd-custom-slot-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.2;
    }

    .dd-custom-slot-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .dd-custom-slot-title ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color);
    }

    .dd-custom-slot-title span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dd-custom-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 8px;
      container-type: inline-size;
    }

    .dd-custom-grid > .dd-custom-card-wrap,
    .dd-custom-grid > .dd-add-card {
      --dd-card-default-column: span 4;
      grid-column: var(--dd-card-grid-column, var(--dd-card-default-column));
      min-height: var(--dd-card-grid-min-height, 0);
    }

    .dd-custom-card-wrap {
      position: relative;
      min-width: 0;
      border-radius: 12px;
    }

    .dd-custom-card-wrap.editing {
      outline: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
      outline-offset: 2px;
      cursor: grab;
    }

    .dd-custom-card-wrap.dragging {
      opacity: 0.48;
      cursor: grabbing;
    }

    .dd-custom-card-wrap.drag-over {
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-card-toolbar {
      position: absolute; top: 6px; right: 6px; z-index: 4;
      display: none; gap: 4px;
    }
    .dd-custom-card-wrap.editing .dd-card-toolbar { display: flex; }
    .dd-card-toolbar button {
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
      background: var(--card-background-color);
      box-shadow: 0 1px 4px rgba(0,0,0,.2);
      color: var(--primary-text-color);
    }
    .dd-card-toolbar button.del:hover { color: var(--error-color, #f44336); }
    .dd-card-toolbar ha-icon { --mdc-icon-size: 18px; }

    .dd-card-toolbar button.drag {
      cursor: grab;
      color: var(--primary-color);
    }

    .dd-card-toolbar button.drag:active {
      cursor: grabbing;
    }

    .dd-add-card-inline,
    .dd-add-card {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 72px; width: 100%;
      border: 2px dashed var(--divider-color); border-radius: 12px;
      background: transparent; cursor: pointer;
      color: var(--secondary-text-color); font-weight: 600; font-size: .9rem;
      transition: border-color .2s ease, color .2s ease, background-color .2s ease;
    }
    .dd-add-card:hover {
      border-color: var(--primary-color); color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .06);
    }

    .dd-add-card-inline {
      min-height: 32px;
      width: auto;
      padding: 0 12px;
      border-radius: 999px;
      border-width: 1px;
      font-size: 12px;
      white-space: nowrap;
    }

    .dd-add-card-inline ha-icon {
      --mdc-icon-size: 16px;
    }

    .dd-add-card ha-icon { --mdc-icon-size: 22px; }

    .dd-domain-add-card {
      min-height: 72px;
      border-width: 1px;
      background: color-mix(in srgb, var(--secondary-background-color) 54%, transparent);
      opacity: 0.82;
    }

    .dd-domain-add-card:hover,
    .dd-domain-add-card.drag-over {
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .entities-grid .dd-custom-card-wrap,
    .entities-grid .dd-domain-add-card {
      min-width: 0;
    }

    .entities-grid > .dd-custom-card-wrap.dd-grid-full,
    .mobile-entities-section.layout-grid .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full {
      grid-column: 1 / -1;
      width: 100%;
    }

    .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entity-rail .dd-domain-add-card {
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full {
      flex-basis: calc(100% - 20px);
    }

    .mobile-entity-rail .dd-domain-add-card {
      min-height: 128px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      min-height: 138px;
    }

    @container (max-width: 899px) {
      .dd-custom-grid > .dd-custom-card-wrap,
      .dd-custom-grid > .dd-add-card {
        --dd-card-default-column: span 6;
      }
    }

    @container (max-width: 559px) {
      .dd-custom-grid > .dd-custom-card-wrap,
      .dd-custom-grid > .dd-add-card {
        --dd-card-default-column: span 12;
      }
    }

    .entity-card-wrapper.loading {
      background: var(--secondary-background-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(90deg,
        var(--secondary-background-color) 25%,
        var(--primary-background-color) 50%,
        var(--secondary-background-color) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        right: 0;
        top: 0;
        width: 280px;
        flex-basis: auto;
        height: 100%;
        transform: translateX(100%);
        z-index: 121;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
      }

      .sidebar-resize-handle {
        display: none;
      }

      .sidebar-collapse-toggle {
        display: none;
      }

      .floor-areas {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .area-button {
        margin-bottom: 8px;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .global-header {
        padding: 12px;
      }

      .header-time {
        font-size: 20px;
      }



      .entities-grid {
        grid-template-columns: 1fr;
      }

      .global-header.mobile .header-expand-button[data-extra-count]::after {
        right: -8px;
      }

      .mobile-home-section,
      .home-camera-section,
      .home-status-section,
      .home-todos-section,
      .home-favorites-section,
      .home-summaries-section,
      .mobile-domain-group,
      .mobile-entities-section.layout-grid .mobile-entity-card {
        content-visibility: visible;
        contain-intrinsic-size: auto;
      }
    }

    /* Favorites Section */
    .favorites-section {
      margin-bottom: 24px;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }

    .favorite-card-wrapper {
      --favorite-color: var(--primary-color);
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 116px;
      padding: 14px 14px 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 9px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper:hover {
      transform: translateY(-2px);
      box-shadow:
        0 16px 30px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 20%, transparent);
    }

    .favorite-card-wrapper:active {
      transform: scale(0.985);
    }

    .favorite-card-wrapper:focus-visible,
    .favorite-quick-action:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--favorite-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .favorite-card-wrapper.is-off,
    .favorite-card-wrapper.is-idle {
      --favorite-color: color-mix(in srgb, var(--secondary-text-color) 56%, var(--primary-color));
    }

    .favorite-card-wrapper.favorite-light {
      --favorite-color: #e1a129;
    }

    .favorite-card-wrapper.favorite-switch {
      --favorite-color: #2f6fd6;
    }

    .favorite-card-wrapper.favorite-cover {
      --favorite-color: #1494aa;
    }

    .favorite-card-wrapper.favorite-binary_sensor,
    .favorite-card-wrapper.favorite-motion {
      --favorite-color: #df5b63;
    }

    .favorite-card-wrapper.favorite-climate,
    .favorite-card-wrapper.favorite-weather {
      --favorite-color: #34a6d8;
    }

    .favorite-card-wrapper.favorite-media_player {
      --favorite-color: #7c67c7;
    }

    .favorite-card-wrapper.favorite-person {
      --favorite-color: #6d7891;
    }

    .favorite-card-wrapper.favorite-sun {
      --favorite-color: #2d7eea;
    }

    .favorite-top,
    .favorite-body {
      position: relative;
      z-index: 1;
    }

    .favorite-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .favorite-icon {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 10px;
      color: var(--favorite-color);
      background: color-mix(in srgb, var(--favorite-color) 13%, transparent);
    }

    .favorite-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .favorite-quick-action {
      --toggle-track: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      width: 38px;
      height: 22px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      color: transparent;
      background: var(--toggle-track);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
      font: inherit;
      cursor: pointer;
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-quick-action::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper.is-active .favorite-quick-action {
      background: var(--favorite-color);
    }

    .favorite-card-wrapper.is-active .favorite-quick-action::before {
      transform: translateX(16px);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action {
      width: 30px;
      height: 30px;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action::before {
      display: none;
    }

    .favorite-card-wrapper.info-only .favorite-quick-action ha-icon {
      display: block;
      --mdc-icon-size: 17px;
    }

    .favorite-quick-action ha-icon {
      display: none;
    }

    .favorite-quick-action:active {
      transform: scale(0.94);
    }

    .favorite-name {
      color: inherit;
      margin-top: 2px;
      font-size: 14px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .favorite-state {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .favorite-area {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([data-theme-dark]) {
      .favorite-card-wrapper {
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 90%, #ffffff 4%),
            color-mix(in srgb, var(--card-background-color) 98%, #000000 3%));
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 1px 0 rgba(255, 255, 255, 0.045),
          inset 0 0 0 1px rgba(255, 255, 255, 0.045);
      }

      .favorite-card-wrapper:hover {
        box-shadow:
          0 18px 34px rgba(0, 0, 0, 0.36),
          inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 30%, transparent);
      }

      .favorite-quick-action {
        --toggle-track: rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.08),
          0 5px 12px rgba(0, 0, 0, 0.28);
      }

      .favorite-card-wrapper.info-only .favorite-quick-action {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(248, 250, 252, 0.82);
      }
    }


    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      padding: 12px 24px;
      border-radius: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .toast.show {
      opacity: 1;
    }

    /* Confirmation Dialog */
    .confirmation-dialog {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .confirmation-dialog.show {
      opacity: 1;
      pointer-events: auto;
    }

    .confirmation-content {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }

    .confirmation-dialog.show .confirmation-content {
      transform: scale(1);
    }

    .confirmation-title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 12px;
    }

    .confirmation-message {
      margin-bottom: 24px;
      opacity: 0.8;
    }

    .confirmation-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .notifications-overlay {
      position: fixed;
      inset: 0;
      z-index: 1040;
      opacity: 0;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(2px);
      transition: opacity 0.22s ease;
    }

    .notifications-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .notifications-panel {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 1041;
      width: min(520px, calc(100vw - 48px));
      max-height: min(78vh, 620px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: color-mix(in srgb, var(--card-background-color) 96%, transparent);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
      backdrop-filter: blur(22px);
      transform: translate3d(-50%, -46%, 0) scale(0.96);
      opacity: 0;
      pointer-events: none;
      transition:
        transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.2s ease;
    }

    .notifications-panel.open {
      transform: translate3d(-50%, -50%, 0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .notifications-panel::before {
      content: "";
      width: 42px;
      height: 4px;
      margin: 10px auto 2px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.14);
    }

    .notifications-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 12px 14px 10px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    }

    .notifications-title {
      min-width: 0;
    }

    .notifications-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 850;
      line-height: 1.15;
    }

    .notifications-title-row ha-icon {
      color: var(--primary-color);
      --mdc-icon-size: 20px;
    }

    .notifications-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.2;
    }

    .notifications-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }

    .notifications-icon-button,
    .notification-dismiss {
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      -webkit-tap-highlight-color: transparent;
    }

    .notifications-icon-button {
      width: 34px;
      height: 34px;
    }

    .notifications-icon-button ha-icon {
      --mdc-icon-size: 18px;
    }

    .notifications-list {
      overflow-y: auto;
      padding: 10px;
    }

    .notification-row {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      gap: 10px;
      align-items: start;
      padding: 11px 10px;
      margin-bottom: 8px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    }

    .notification-row:last-child {
      margin-bottom: 0;
    }

    .notification-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.11);
      color: var(--primary-color);
    }

    .notification-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .notification-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .notification-message {
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.35;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .notification-date {
      margin-top: 7px;
      color: color-mix(in srgb, var(--secondary-text-color) 74%, transparent);
      font-size: 11px;
      font-weight: 650;
    }

    .notification-dismiss {
      width: 32px;
      height: 32px;
      color: var(--secondary-text-color);
      background: rgba(0, 0, 0, 0.05);
    }

    .notification-dismiss ha-icon {
      --mdc-icon-size: 17px;
    }

    .notifications-empty,
    .notifications-error,
    .notifications-loading {
      min-height: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px 18px;
      color: var(--secondary-text-color);
      text-align: center;
      font-size: 13px;
      font-weight: 600;
    }

    .notifications-empty ha-icon,
    .notifications-error ha-icon,
    .notifications-loading ha-icon {
      --mdc-icon-size: 28px;
      color: var(--primary-color);
    }

    @media (max-width: 1024px) {
      .notifications-panel {
        top: auto;
        bottom: calc(18px + env(safe-area-inset-bottom, 0px));
        width: min(460px, calc(100vw - 28px));
        max-height: min(70vh, 620px);
        transform: translate3d(-50%, calc(100% + 48px), 0);
      }

      .notifications-panel.open {
        transform: translate3d(-50%, 0, 0);
      }
    }

    .confirmation-button {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .confirmation-button.cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .confirmation-button.confirm {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .confirmation-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Area Badges Styling */
    .area-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0px; /* 16px;*/
    }

    .area-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: default;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }

    .area-badge ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Domain-specific badge colors */
    .area-badge.light {
      background: color-mix(in srgb, var(--area-badge-color, #e1a129) 10%, var(--card-background-color));
      color: var(--area-badge-color, #e1a129);
      border-color: color-mix(in srgb, var(--area-badge-color, #e1a129) 20%, transparent);
    }

    .area-badge.switch {
      background: color-mix(in srgb, var(--area-badge-color, #2f6fd6) 10%, var(--card-background-color));
      color: var(--area-badge-color, #2f6fd6);
      border-color: color-mix(in srgb, var(--area-badge-color, #2f6fd6) 20%, transparent);
    }

    .area-badge.climate {
      background: color-mix(in srgb, var(--area-badge-color, #34a6d8) 10%, var(--card-background-color));
      color: var(--area-badge-color, #34a6d8);
      border-color: color-mix(in srgb, var(--area-badge-color, #34a6d8) 20%, transparent);
    }

    .area-badge.motion.active {
      background: color-mix(in srgb, var(--area-badge-color, #df5b63) 10%, var(--card-background-color));
      color: var(--area-badge-color, #df5b63);
      border-color: color-mix(in srgb, var(--area-badge-color, #df5b63) 20%, transparent);
    }

    .area-badge.cover {
      background: color-mix(in srgb, var(--area-badge-color, #1494aa) 10%, var(--card-background-color));
      color: var(--area-badge-color, #1494aa);
      border-color: color-mix(in srgb, var(--area-badge-color, #1494aa) 20%, transparent);
    }

    .area-badge.media_player {
      background: color-mix(in srgb, var(--area-badge-color, #7c67c7) 10%, var(--card-background-color));
      color: var(--area-badge-color, #7c67c7);
      border-color: color-mix(in srgb, var(--area-badge-color, #7c67c7) 20%, transparent);
    }

    .area-badge.temperature {
      background: color-mix(in srgb, var(--cyan-color) 10%, var(--card-background-color));
      color: var(--cyan-color);
      border-color: color-mix(in srgb, var(--cyan-color) 20%, transparent);
    }

    .area-badge.humidity {
      background: color-mix(in srgb, var(--blue-color) 10%, var(--card-background-color));
      color: var(--blue-color);
      border-color: color-mix(in srgb, var(--blue-color) 20%, transparent);
    }

    .area-badge.wattage {
      background: color-mix(in srgb, var(--yellow-color) 10%, var(--card-background-color));
      color: var(--yellow-color);
      border-color: color-mix(in srgb, var(--yellow-color) 20%, transparent);
    }

    .area-badge.energy {
      background: color-mix(in srgb, var(--indigo-color) 10%, var(--card-background-color));
      color: var(--indigo-color);
      border-color: color-mix(in srgb, var(--indigo-color) 20%, transparent);
    }

    /* Toggle button badges */
    .area-badge.light-toggle,
    .area-badge.switch-toggle {
      cursor: pointer;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }

    .area-badge.light-toggle:hover,
    .area-badge.switch-toggle:hover {
      background: color-mix(in srgb, var(--primary-color) 90%, black);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .area-badges {
        padding: 12px;
        gap: 6px;
      }

      .area-badge {
        padding: 6px 10px;
        font-size: 13px;
      }

      .area-badge ha-icon {
        --mdc-icon-size: 16px;
      }
    }

    /* Header Expanded Content Styling */
    .global-header.expanded {
      border-bottom: 2px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header-expanded-content {
      background: var(--card-background-color);
      padding: 16px;
      border-top: 1px solid var(--divider-color);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-expanded-content .header-favorites {
      max-width: 100%;
    }

    /* Favorites Section Styling */
    .favorites-section {
      width: 100%;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .favorites-header ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .favorites-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      width: 100%;
    }

    .favorite-tile-wrapper {
      width: 100%;
      min-height: 60px;
    }

    .favorite-tile {
      width: 100% !important;
      height: auto !important;
    }

    .no-favorites {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      border: 1px dashed var(--divider-color);
    }

    .no-favorites ha-icon {
      --mdc-icon-size: 32px;
      margin-bottom: 8px;
      opacity: 0.6;
    }

    .no-favorites p {
      margin: 0;
      font-size: 14px;
    }

    /* Header Expand Button Enhanced Styling */
    .header-expand-button {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--primary-color);
      background: var(--card-background-color);
      color: var(--primary-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-expand-button:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .header-expand-button ha-icon {
      --mdc-icon-size: 20px;
      transition: transform 0.3s ease;
    }

    .global-header.expanded .header-expand-button {
      bottom: -20px;
    }

    /* Mobile specific adjustments for expanded header */
    @media (max-width: 768px) {
      .header-expanded-content {
        padding: 12px;
      }

      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .header-expand-button {
        width: 36px;
        height: 36px;
        bottom: -18px;
      }

      .header-expand-button ha-icon {
        --mdc-icon-size: 18px;
      }
    }

    /* Home and header status cards */
    .home-status-card,
    .status-card-compact {
      --status-color: var(--primary-color);
      --status-bg: color-mix(in srgb, var(--status-color) 16%, transparent);
    }

    .home-status-card.cover,
    .status-card-compact.cover {
      --status-color: #1494aa;
    }

    .home-status-card.binary_sensor,
    .home-status-card.motion,
    .status-card-compact.binary_sensor,
    .status-card-compact.motion {
      --status-color: #df5b63;
    }

    .home-status-card.light,
    .status-card-compact.light {
      --status-color: #e1a129;
    }

    .home-status-card.switch,
    .status-card-compact.switch {
      --status-color: #2f6fd6;
    }

    .home-status-card.climate,
    .home-status-card.house-climate-card,
    .status-card-compact.climate {
      --status-color: #34a6d8;
    }

    .home-status-card.person,
    .status-card-compact.person {
      --status-color: #6d7891;
    }

    .home-status-card.media_player,
    .status-card-compact.media_player {
      --status-color: #7c67c7;
    }

    .home-status-card.fan,
    .status-card-compact.fan {
      --status-color: #2b8fcb;
    }

    .home-status-card.wattage,
    .home-status-card.house-power-card,
    .home-status-card.energy,
    .status-card-compact.wattage,
    .status-card-compact.energy {
      --status-color: #d88e20;
    }

    .home-status-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 170px));
      justify-content: start;
      gap: 12px;
    }

    .home-status-card {
      min-height: 134px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      text-align: left;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .home-status-card::before {
      top: auto;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--status-color);
      opacity: 0.55;
    }

    .home-status-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--status-color) 40%, transparent);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
    }

    .home-status-card:hover::before {
      opacity: 0.85;
    }

    .home-status-card .status-card-icon {
      width: 48px;
      height: 48px;
      margin: 0 0 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 25px;
      color: var(--status-color);
      transform: none;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: none;
    }

    .home-status-card .status-card-badge {
      top: -8px;
      right: -8px;
      width: auto;
      min-width: 24px;
      height: 24px;
      padding: 0 7px;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 5px 12px color-mix(in srgb, var(--status-color) 28%, transparent);
    }

    .home-status-card .status-card-title {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
    }

    .home-status-card.has-value .status-card-title {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
    }

    .home-status-card .status-card-value {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .home-status-card.house-persons-card {
      --status-color: #182044;
      grid-column: span 2;
      min-width: 240px;
      gap: 12px;
    }

    .home-status-card.house-power-card {
      --status-color: #d88e20;
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .home-status-card.house-climate-card {
      --status-color: #34a6d8;
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .house-persons-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .home-status-card.house-persons-card .house-persons-icon,
    .home-status-card.house-climate-card .house-climate-icon,
    .home-status-card.house-power-card .house-power-icon {
      width: 42px;
      height: 42px;
      margin: 0;
      flex: 0 0 auto;
      border-radius: 13px;
    }

    .house-persons-copy,
    .house-climate-copy,
    .house-power-copy {
      min-width: 0;
      text-align: left;
    }

    .house-persons-title,
    .house-climate-title,
    .house-power-title {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-persons-subtitle,
    .house-persons-empty,
    .house-climate-subtitle,
    .house-power-subtitle,
    .house-power-empty {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .house-climate-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .house-climate-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .house-climate-metric {
      min-width: 0;
      min-height: 48px;
      padding: 8px 9px;
      border: 0;
      border-radius: 12px;
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);
      align-items: center;
      column-gap: 8px;
      background: color-mix(in srgb, var(--metric-color) 12%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 14%, transparent);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .house-climate-metric:active {
      transform: scale(0.97);
    }

    .house-climate-metric-icon {
      width: 26px;
      height: 26px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--metric-color) 18%, transparent);
      color: var(--metric-color);
    }

    .house-climate-metric-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-climate-metric-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-climate-metric-value,
    .house-climate-metric-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-climate-metric-value {
      font-size: 14px;
      font-weight: 900;
      color: var(--primary-text-color);
    }

    .house-climate-metric-label {
      font-size: 10px;
      font-weight: 750;
      color: var(--secondary-text-color);
    }

    .house-power-head {
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .house-power-total {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .house-power-list {
      width: 100%;
      display: grid;
      gap: 7px;
    }

    .house-power-room {
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 8px;
      row-gap: 4px;
    }

    .house-power-room-icon {
      width: 26px;
      height: 26px;
      grid-row: span 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-power-room-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-power-room-name,
    .house-power-room-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-power-room-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .house-power-room-value {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
    }

    .house-power-bar {
      position: relative;
      height: 5px;
      grid-column: 2 / -1;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--secondary-background-color));
    }

    .house-power-bar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, #d88e20, #f4c34d);
    }

    .house-persons-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .house-person-mini {
      appearance: none;
      min-width: 0;
      min-height: 42px;
      padding: 6px;
      display: flex;
      align-items: center;
      gap: 7px;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-background-color) 78%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        transform 0.18s ease;
    }

    .house-person-mini:active {
      transform: scale(0.97);
    }

    .house-person-mini.is-home {
      background: color-mix(in srgb, #2f9b62 13%, var(--card-background-color));
    }

    .house-person-mini.is-away {
      background: color-mix(in srgb, #df5b63 10%, var(--card-background-color));
    }

    .house-person-avatar {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .house-person-avatar ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-person-mini-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-person-mini-name,
    .house-person-mini-state {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .house-person-mini-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-person-mini-state {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 700;
      line-height: 1.1;
    }

    .header-status-scroll {
      gap: 10px;
      padding: 2px 2px 4px;
    }

    .status-card-compact {
      flex: 0 0 auto;
      min-width: 92px;
      max-width: 150px;
      min-height: 70px;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 7px 12px 9px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    }

    .status-card-compact:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--status-color) 36%, transparent);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
    }

    .status-card-compact .status-card-icon-compact {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .status-card-compact .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--status-color);
    }

    .status-card-compact .status-card-badge-compact {
      top: -7px;
      right: -8px;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 10px color-mix(in srgb, var(--status-color) 26%, transparent);
    }

    .status-card-compact .status-card-title-compact {
      width: 100%;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
      opacity: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .status-card-compact.has-value .status-card-title-compact {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      display: block;
    }

    .status-card-subtitle-compact {
      width: 100%;
      margin-top: 1px;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .home-status-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        margin: 0;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-section {
        margin: 0 -10px 18px;
      }

      .home-camera-section .home-status-heading {
        display: none;
      }

      .home-summaries-section {
        margin: 0 -10px 18px;
      }

      .home-summaries-section .home-status-heading {
        display: none;
      }

      .home-todos-section {
        margin: 0 -10px 18px;
      }

      .home-todos-section .home-status-heading {
        display: none;
      }

      .home-todos-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-summary-list {
        width: auto;
        display: flex;
        flex-direction: column;
        padding: 2px 18px 16px;
        gap: 8px;
      }

      .home-summary-card {
        min-height: 64px;
        padding: 11px 12px;
        border-radius: 14px;
      }

      .home-summary-icon {
        width: 36px;
        height: 36px;
      }

      .home-camera-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-grid::-webkit-scrollbar {
        display: none;
      }

      .home-camera-section.layout-grid .home-camera-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-camera-card {
        flex: 0 0 226px;
        min-height: 146px;
        border-radius: 18px;
        scroll-snap-align: start;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.11);
      }

      .home-camera-section.layout-grid .home-camera-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      .home-camera-content {
        min-height: 146px;
        padding: 13px;
      }

      .home-camera-name {
        font-size: 16px;
      }

      .home-status-grid::-webkit-scrollbar {
        display: none;
      }

      .home-status-card {
        flex: 0 0 126px;
        min-height: 114px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .home-status-card.house-persons-card {
        flex: 0 0 230px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-power-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-climate-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card .status-card-title {
        font-size: 15px;
      }

      .status-card-compact {
        min-width: 88px;
      }

      .home-view {
        max-width: none;
      }

      .person-cards-section {
        display: none;
      }

      .home-status-heading {
        display: none;
      }

      .mobile-home-section {
        display: block;
        margin: 0 -10px 18px;
      }

      .mobile-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 18px;
        margin-bottom: 10px;
      }

      .mobile-section-title {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .mobile-section-title-label {
        color: var(--primary-text-color);
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-section-action {
        appearance: none;
        min-width: 66px;
        height: 28px;
        padding: 0 10px 0 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        color: var(--primary-color);
        font-size: 12px;
        font-weight: 850;
        font: inherit;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          transform 0.18s ease;
      }

      .mobile-section-action ha-icon {
        --mdc-icon-size: 15px;
      }

      .mobile-section-action:active {
        transform: scale(0.96);
        background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      }

      .mobile-area-rail {
        display: flex;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .mobile-area-rail::-webkit-scrollbar {
        display: none;
      }

      .mobile-home-section.layout-grid .mobile-area-rail {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .mobile-area-card {
        appearance: none;
        position: relative;
        box-sizing: border-box;
        flex: 0 0 152px;
        min-width: 0;
        min-height: 130px;
        padding: 13px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        border-radius: 18px;
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        color: var(--primary-text-color);
        font: inherit;
        box-shadow: 0 12px 28px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        text-align: left;
        scroll-snap-align: start;
        cursor: pointer;
        transition:
          transform 0.18s ease,
          border-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .mobile-home-section.layout-grid .mobile-area-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .mobile-home-section.layout-grid .mobile-area-rail {
          grid-template-columns: 1fr;
        }
      }

      .mobile-area-card:active {
        transform: scale(0.98);
      }

      .mobile-area-card.has-picture {
        min-height: 146px;
        color: var(--mobile-area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.16);
        background: #182044;
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-card.has-picture.text-dark {
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-picture {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
      }

      .mobile-area-card.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background: var(--mobile-area-picture-overlay);
      }

      .mobile-area-top,
      .mobile-area-copy {
        position: relative;
        z-index: 2;
      }

      .mobile-area-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
      }

      .mobile-area-icon {
        width: 42px;
        height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 13px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 13%, transparent);
      }

      .mobile-area-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .mobile-area-card.has-picture .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(12px);
      }

      .mobile-area-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 5px;
        min-width: 0;
      }

      .mobile-area-badge {
        min-width: 24px;
        height: 24px;
        padding: 0 7px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 999px;
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
        font-size: 11px;
        font-weight: 850;
      }

      .mobile-area-card.has-picture .mobile-area-badge {
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .mobile-area-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .mobile-area-badge.light {
        --area-badge-color: #e1a129;
      }

      .mobile-area-badge.cover {
        --area-badge-color: #1494aa;
      }

      .mobile-area-badge.motion {
        --area-badge-color: #df5b63;
      }

      .mobile-area-name {
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-meta {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-card.has-picture .mobile-area-meta {
        color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .mobile-area-card.has-picture .mobile-area-name,
      .mobile-area-card.has-picture .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-name,
      .mobile-area-card.has-picture.text-dark .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .home-status-section {
        margin: 0 -10px 18px;
      }

      .home-status-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-status-section.layout-grid .home-status-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-status-section.layout-grid .home-status-card {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        flex: none;
        scroll-snap-align: none;
      }

      .home-status-section.layout-grid .house-persons-card,
      .home-status-section.layout-grid .house-climate-card,
      .home-status-section.layout-grid .house-power-card {
        grid-column: 1 / -1;
      }

      @media (max-width: 380px) {
        .home-status-section.layout-grid .home-status-grid {
          grid-template-columns: 1fr;
        }
      }

      .home-status-card::before {
        left: 14px;
        right: 14px;
      }

      .home-status-card .status-card-icon {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        margin-bottom: 16px;
      }

      .home-status-card .status-card-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .home-status-card .status-card-badge {
        min-width: 23px;
        height: 23px;
        top: -8px;
        right: -9px;
      }

      :host([data-theme-dark]) {
        .home-welcome {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 7%) 0%,
              color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
          box-shadow:
            0 14px 36px rgba(0, 0, 0, 0.34),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
        }

        .welcome-avatar {
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.34),
            0 0 0 3px rgba(255, 255, 255, 0.08);
        }

        .welcome-action {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 84%, #ffffff 8%),
              color-mix(in srgb, var(--card-background-color) 94%, #000000 6%));
          box-shadow:
            0 10px 24px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .mobile-area-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .mobile-area-card:not(.has-picture) .mobile-area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
        }

        .mobile-area-badge {
          background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 20%, transparent);
        }

        .home-status-card.house-persons-card {
          --status-color: #8ea8ff;
        }

        .home-status-card.house-power-card {
          --status-color: #f2b447;
        }

        .home-status-card.house-climate-card {
          --status-color: #64c8e8;
        }

        .house-person-mini {
          background: color-mix(in srgb, var(--card-background-color) 78%, #ffffff 5%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .house-climate-metric {
          background: color-mix(in srgb, var(--metric-color) 18%, var(--card-background-color));
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        }

        .house-power-room-icon {
          background: color-mix(in srgb, var(--status-color) 20%, transparent);
        }

        .house-power-bar {
          background: color-mix(in srgb, var(--status-color) 13%, var(--card-background-color));
        }

        .house-person-mini.is-home {
          background: color-mix(in srgb, #2f9b62 20%, var(--card-background-color));
        }

        .house-person-mini.is-away {
          background: color-mix(in srgb, #df5b63 16%, var(--card-background-color));
        }

        .home-summary-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 26px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .home-summary-icon {
          background: color-mix(in srgb, var(--summary-color) 20%, transparent);
        }
      }

      .home-favorites-section {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        margin: 0 -10px 44px;
        padding: 0;
        overflow-x: clip;
      }

      .home-favorites-section .favorites-header {
        display: none;
      }

      .home-favorites-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-favorites-section .favorites-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 0;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-favorites-section .favorites-grid::-webkit-scrollbar {
        display: none;
      }

      .home-favorites-section.layout-grid .favorites-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-favorites-section .favorite-card-wrapper {
        flex: 0 0 186px;
        width: auto;
        min-width: 0;
        box-sizing: border-box;
        min-height: 116px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
      }

      .home-favorites-section.layout-grid .favorite-card-wrapper {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .home-favorites-section.layout-grid .favorites-grid {
          grid-template-columns: 1fr;
        }
      }
    }

    /* Area status/action pills */
    .area-badges {
      gap: 8px;
      align-items: center;
      margin-bottom: 18px;
    }

    .area-badge {
      min-height: 38px;
      padding: 9px 15px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      box-shadow: none;
    }

    .area-badge ha-icon {
      --mdc-icon-size: 17px;
    }

    .area-badge.cover {
      background: color-mix(in srgb, var(--area-badge-color, #1494aa) 12%, var(--card-background-color));
      border-color: color-mix(in srgb, var(--area-badge-color, #1494aa) 22%, transparent);
      color: var(--area-badge-color, #1494aa);
    }

    .area-badge.cover ha-icon {
      color: var(--area-badge-color, #1494aa);
    }

    .area-badge.light-toggle,
    .area-badge.switch-toggle {
      min-width: 132px;
      justify-content: center;
      cursor: pointer;
      background: #089987;
      border-color: #089987;
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(8, 153, 135, 0.18);
    }

    .area-badge.light-toggle ha-icon {
      color: #ffc400;
    }

    .area-badge.switch-toggle ha-icon {
      color: #1f86d9;
    }

    .area-badge.light-toggle:hover,
    .area-badge.switch-toggle:hover {
      background: #078b7b;
      border-color: #078b7b;
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(8, 153, 135, 0.24);
    }

    .area-badge.light-toggle:active,
    .area-badge.switch-toggle:active {
      transform: translateY(0);
      box-shadow: 0 5px 14px rgba(8, 153, 135, 0.18);
    }

    /* Room header */
    .area-header {
      position: relative;
      isolation: isolate;
      z-index: 0;
      min-height: 138px;
      margin-bottom: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 12%, rgba(0, 0, 0, 0.06));
      background:
        linear-gradient(135deg,
          var(--card-background-color) 0%,
          color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
    }

    .area-header::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(0, 0, 0, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
      background-size: 56px 56px;
      opacity: 0.38;
    }

    .area-header-background {
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      filter: saturate(1.05) contrast(1.02);
    }

    .area-header.has-picture {
      border-color: rgba(255, 255, 255, 0.16);
      background: #172321;
      color: var(--area-header-picture-text-color, #ffffff);
      --area-header-picture-text-color: #ffffff;
      --area-header-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-header-picture-control-bg: rgba(255, 255, 255, 0.18);
      --area-header-picture-control-border: rgba(255, 255, 255, 0.16);
      --area-header-picture-overlay:
        linear-gradient(135deg, rgba(13, 24, 23, 0.84), rgba(13, 24, 23, 0.46)),
        linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
    }

    .area-header.has-picture.text-dark {
      --area-header-picture-text-color: #0f172a;
      --area-header-picture-muted-text-color: rgba(15, 23, 42, 0.72);
      --area-header-picture-control-bg: rgba(255, 255, 255, 0.72);
      --area-header-picture-control-border: rgba(15, 23, 42, 0.08);
      --area-header-picture-overlay:
        linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.48)),
        linear-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
    }

    .area-header.has-picture::before {
      z-index: 1;
      background: var(--area-header-picture-overlay);
      background-size: auto, 56px 56px, 56px 56px;
      opacity: 1;
    }

    .area-header-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      min-width: 0;
    }

    .area-title-group {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .area-mobile-toolbar {
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: auto minmax(0, max-content) auto;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .area-mobile-round {
      width: 42px;
      height: 42px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 88%, #ffffff);
      color: #182044;
      cursor: pointer;
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(15, 23, 42, 0.06);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease,
        color 0.18s ease;
    }

    .area-mobile-round:hover {
      transform: translateY(-1px);
      box-shadow:
        0 14px 28px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(15, 23, 42, 0.08);
    }

    .area-mobile-round ha-icon,
    .area-mobile-round .dd-static-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .area-mobile-home {
      display: none;
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .layout-container.sidebar-collapsed .area-mobile-home {
      display: inline-flex;
    }

    .area-mobile-quick-controls {
      grid-column: 2;
      justify-self: start;
      max-width: 100%;
      min-height: 40px;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .area-mobile-quick-controls.empty {
      visibility: hidden;
    }

    .area-quick-control {
      min-width: 60px;
      height: 34px;
      padding: 0 7px 0 9px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .area-quick-control:active {
      transform: scale(0.96);
    }

    .area-quick-main {
      min-width: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .area-quick-control ha-icon {
      --mdc-icon-size: 17px;
      flex: 0 0 auto;
    }

    .area-quick-count {
      color: currentColor;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
      white-space: nowrap;
    }

    .area-quick-switch {
      position: relative;
      width: 26px;
      height: 16px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.12);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.05),
        inset 0 1px 3px rgba(15, 23, 42, 0.12);
      transition:
        background-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .area-quick-switch::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
      transition: transform 0.18s ease;
    }

    .area-quick-control.active {
      background: #182044;
      color: #ffffff;
    }

    .area-quick-control.light.active {
      color: #ffd047;
    }

    .area-quick-control.switch.active {
      color: #58a9ff;
    }

    .area-quick-control.cover.active {
      color: #b984ff;
    }

    .area-quick-control.active .area-quick-switch {
      background: currentColor;
    }

    .area-quick-control.active .area-quick-switch::after {
      transform: translateX(10px);
    }

    .area-quick-direction {
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.08);
      color: currentColor;
    }

    .area-quick-direction ha-icon {
      --mdc-icon-size: 16px;
    }

    .area-mobile-actions {
      grid-column: 3;
      justify-self: end;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .area-mobile-edit {
      position: relative;
    }

    .area-mobile-edit.active {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-mobile-actions .unavailable-entities-icon {
      width: 42px;
      height: 42px;
      margin: 0;
      border-radius: 999px;
    }

    .area-desktop-back {
      display: none;
      width: 42px;
      height: 42px;
      padding: 0;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.34),
        inset 0 1px 0 rgba(255, 255, 255, 0.075);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .area-desktop-back:hover {
      transform: translateY(-1px);
      box-shadow:
        0 14px 30px rgba(15, 23, 42, 0.24),
        inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    }

    .area-desktop-back:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .area-desktop-back ha-icon,
    .area-desktop-back .dd-static-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .layout-container.sidebar-collapsed .area-desktop-back {
      display: none;
    }

    .area-title-copy {
      min-width: 0;
    }

    .area-subtitle {
      display: block;
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 55%, transparent);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
    }

    .area-header-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--primary-color) 13%, var(--card-background-color));
      color: var(--primary-color);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
    }

    .area-header-icon ha-icon {
      --mdc-icon-size: 26px;
    }

    .area-header.has-picture .area-header-icon {
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow: inset 0 0 0 1px var(--area-header-picture-control-border);
    }

    .area-title {
      margin: 0;
      color: var(--primary-text-color);
      font-size: clamp(30px, 3.1vw, 44px);
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1;
      overflow-wrap: anywhere;
    }

    .area-header.has-picture .area-subtitle {
      color: var(--area-header-picture-muted-text-color, rgba(255, 255, 255, 0.76));
    }

    .area-header.has-picture .area-title {
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header-actions {
      display: none;
      align-items: center;
      gap: 10px;
      flex: 0 0 auto;
    }

    .area-header .dd-edit-toggle {
      margin-left: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.06);
      color: var(--primary-text-color);
    }

    .area-header .dd-edit-toggle:hover,
    .area-header .dd-edit-toggle.active {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-header.has-picture .dd-edit-toggle {
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header .unavailable-entities-icon {
      margin-bottom: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(255, 152, 0, 0.14);
      color: var(--warning-color);
    }

    .area-header .unavailable-entities-icon ha-icon {
      color: var(--warning-color);
    }

    .area-header.has-picture .unavailable-entities-icon {
      background: var(--area-header-picture-control-bg);
    }

    .area-header.has-picture .unavailable-entities-icon ha-icon {
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header.has-picture .area-mobile-round,
    .area-header.has-picture .area-mobile-quick-controls,
    .area-header.has-picture .area-mobile-actions .unavailable-entities-icon {
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.18),
        inset 0 0 0 1px var(--area-header-picture-control-border);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .area-header .area-badges {
      display: none;
    }

    .area-header.has-picture .area-badge:not(.light-toggle):not(.switch-toggle) {
      background: var(--area-header-picture-control-bg);
      border-color: var(--area-header-picture-control-border);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    @media (min-width: 769px) {
      .area-header {
        min-height: 166px;
        padding: 20px 22px 22px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          "nav actions"
          "title metrics"
          "controls metrics";
        align-items: start;
        column-gap: 24px;
        row-gap: 8px;
        border-color: color-mix(in srgb, var(--divider-color) 70%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
      }

      .area-header::before {
        opacity: 0;
      }

      .area-header-content {
        grid-area: title;
        align-self: start;
        margin-top: 2px;
      }

      .area-mobile-toolbar {
        display: contents;
      }

      .area-mobile-home {
        grid-area: nav;
        display: inline-flex;
        align-self: start;
        justify-self: start;
        width: 44px;
        height: 44px;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 18px 40px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.075);
      }

      .area-mobile-quick-controls {
        grid-area: controls;
        min-height: 42px;
        width: min(520px, 100%);
        max-width: 100%;
        margin-top: 4px;
        margin-left: 0;
        align-self: start;
        justify-self: start;
      }

      .area-mobile-quick-controls.count-1 {
        width: min(420px, 100%);
      }

      .area-mobile-quick-controls.count-1 .area-quick-control {
        flex: 1 1 auto;
        justify-content: space-between;
      }

      .area-mobile-quick-controls.empty {
        min-height: 0;
        margin: 0;
      }

      .area-mobile-actions {
        grid-area: actions;
        position: relative;
        top: auto;
        right: auto;
        z-index: 5;
        align-self: start;
        justify-self: end;
      }

      .area-header-metrics {
        grid-area: metrics;
        position: relative;
        z-index: 3;
        min-width: 0;
        max-width: min(34vw, 360px);
        margin: 2px 56px 0 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
      }

      .area-header-metric {
        min-width: 132px;
        min-height: 44px;
        padding: 8px 12px;
        gap: 8px;
        border-radius: 999px;
      }

      .area-header-metric .metric-ring {
        width: 30px;
        height: 30px;
      }

      .area-header-metric .metric-ring::after {
        inset: 4px;
      }

      .area-header-metric .metric-ring.metric-icon ha-icon {
        --mdc-icon-size: 17px;
      }

      .area-header-metric .metric-label {
        font-size: 10px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .area-header-metric .metric-reading {
        margin-top: 2px;
        font-size: 13px;
      }

      .area-title-group {
        gap: 0;
      }

      .area-header-icon {
        display: none;
      }

      .area-title {
        font-size: clamp(24px, 2.4vw, 34px);
        line-height: 1.04;
      }

      .area-subtitle {
        margin-top: 3px;
      }

      .layout-container.sidebar-collapsed .area-mobile-home {
        position: relative;
        top: auto;
        left: auto;
      }

      .layout-container.sidebar-collapsed .area-header-content {
        padding-left: 0;
      }

      .layout-container.sidebar-collapsed .area-mobile-quick-controls {
        margin-left: 0;
      }
    }

    @media (max-width: 768px) {
      :host {
        height: auto;
        max-height: none;
        min-height: 100%;
        overflow: visible;
      }

      .layout-container {
        display: block;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
      }

      .main-content {
        display: block;
        min-height: 100dvh;
        overflow: visible;
      }

      .content-area {
        padding: 0;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
        overscroll-behavior: auto;
        -webkit-overflow-scrolling: auto;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 5%, var(--primary-background-color)) 0%,
            var(--primary-background-color) 150px);
      }

      .content-area.home-content-area {
        padding-bottom: 0;
      }

      .content-area.area-content-area {
        padding: 0 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .content-area.settings-content-area {
        padding: 0;
      }

      .home-view {
        padding: 10px 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-view {
        width: 100%;
        margin: 0;
        padding: 8px 10px calc(152px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-header {
        grid-template-columns: auto minmax(0, 1fr);
        gap: 12px;
        margin: 0 0 12px;
        padding: 12px 14px;
        border-radius: 18px;
        border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.07);
      }

      .settings-page-back {
        width: 42px;
        height: 42px;
      }

      .settings-page-title h1 {
        font-size: 21px;
      }

      .settings-page-title p {
        margin-top: 3px;
        font-size: 13px;
      }

      .settings-page-actions {
        display: none;
      }

      .settings-page-editor {
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }

      .settings-page-bottom-actions {
        position: sticky;
        bottom: calc(88px + env(safe-area-inset-bottom, 0px));
        z-index: 5;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        margin: 12px 0 0;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--divider-color) 62%, transparent);
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
        backdrop-filter: blur(18px) saturate(170%);
        -webkit-backdrop-filter: blur(18px) saturate(170%);
      }

      .settings-page-bottom-actions .settings-secondary,
      .settings-page-bottom-actions .settings-primary {
        width: 100%;
      }

      .global-header.mobile {
        margin: -10px -10px 0;
        padding: 12px 14px 22px;
        border-bottom: 0;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .header-content {
        display: block;
      }

      .global-header.mobile .header-status-section {
        width: 100%;
      }

      .global-header.mobile .header-status-scroll {
        gap: 10px;
        padding: 2px 2px 4px;
        scroll-padding: 14px;
      }

      .global-header.mobile .status-card-compact {
        min-width: 112px;
        min-height: 82px;
        padding: 10px 12px 11px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .status-card-compact .status-card-icon-compact {
        width: 40px;
        height: 40px;
        border-radius: 8px;
      }

      .global-header.mobile .status-card-compact .status-card-title-compact {
        margin-top: 7px;
        color: color-mix(in srgb, var(--primary-text-color) 76%, transparent);
        font-size: 12px;
        line-height: 1.15;
      }

      .global-header.mobile .header-expand-button {
        bottom: -18px;
        width: 36px;
        height: 36px;
        border-width: 2px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 8px 20px rgba(3, 169, 244, 0.18);
      }

      .area-header {
        position: relative;
        top: auto;
        z-index: 3;
        min-height: 146px;
        margin: 0 -10px 20px;
        padding: calc(14px + env(safe-area-inset-top, 0px)) 22px 24px;
        align-items: center;
        gap: 10px;
        overflow: visible;
        border-radius: 0 0 8px 8px;
        border: 0;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 88%, transparent) 76%,
            color-mix(in srgb, var(--card-background-color) 58%, transparent) 100%);
        backdrop-filter: blur(22px);
        box-shadow: none;
        transition:
          min-height 0.2s ease,
          padding 0.2s ease,
          box-shadow 0.2s ease,
          background-color 0.2s ease;
      }

      .area-header.has-metrics {
        min-height: 248px;
      }

      .area-header.is-stuck {
        position: sticky;
        top: 0;
        z-index: 90;
        min-height: 122px;
        margin-top: 0;
        margin-bottom: 20px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 18px 10px;
        gap: 7px;
        border-radius: 0;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
      }

      .area-header::before {
        opacity: 0;
      }

      .area-header::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -34px;
        height: 58px;
        z-index: 1;
        pointer-events: none;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 66%, transparent) 0%,
            transparent 100%);
        filter: blur(10px);
        opacity: 0;
        transition: opacity 0.18s ease;
      }

      .area-header.is-stuck::after {
        opacity: 1;
      }

      .area-mobile-toolbar {
        position: relative;
        z-index: 3;
        width: 100%;
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
      }

      .area-mobile-round {
        width: 38px;
        height: 38px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 94%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .area-mobile-round ha-icon,
      .area-mobile-round .dd-static-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-mobile-round {
        width: 34px;
        height: 34px;
      }

      .area-header.is-stuck .area-mobile-round ha-icon {
        --mdc-icon-size: 18px;
      }

      .area-mobile-home {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 6;
        justify-self: start;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 18px 40px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.075);
      }

      .area-header.has-picture .area-mobile-home {
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.72), rgba(8, 10, 15, 0.76)),
          rgba(10, 12, 18, 0.72);
        color: #ffffff;
        backdrop-filter: blur(14px);
        box-shadow:
          0 14px 32px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }

      .area-mobile-quick-controls {
        grid-column: 2;
        justify-self: center;
        max-width: 100%;
        min-height: 40px;
        padding: 4px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        box-shadow:
          0 9px 22px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .area-mobile-quick-controls.empty {
        visibility: hidden;
      }

      .area-header.is-stuck .area-mobile-quick-controls {
        min-height: 36px;
        padding: 3px;
      }

      .area-quick-control {
        min-width: 58px;
        height: 34px;
        padding: 0 6px 0 8px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        transition:
          background-color 0.18s ease,
          color 0.18s ease,
          transform 0.18s ease;
      }

      .area-quick-main {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .area-quick-control ha-icon {
        --mdc-icon-size: 17px;
        flex: 0 0 auto;
      }

      .area-quick-count {
        color: currentColor;
        font-size: 11px;
        font-weight: 850;
        line-height: 1;
        white-space: nowrap;
      }

      .area-quick-switch {
        position: relative;
        width: 26px;
        height: 16px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.12);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.05),
          inset 0 1px 3px rgba(15, 23, 42, 0.12);
        transition:
          background-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .area-quick-switch::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
        transition: transform 0.18s ease;
      }

      .area-quick-control.active .area-quick-switch {
        background: currentColor;
      }

      .area-quick-control.active .area-quick-switch::after {
        transform: translateX(10px);
      }

      .area-quick-direction {
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.08);
        color: currentColor;
      }

      .area-quick-direction ha-icon {
        --mdc-icon-size: 16px;
      }

      .area-header.is-stuck .area-quick-control {
        min-width: 50px;
        height: 30px;
        padding: 0 5px 0 7px;
        gap: 4px;
      }

      .area-header.is-stuck .area-quick-control ha-icon {
        --mdc-icon-size: 15px;
      }

      .area-header.is-stuck .area-quick-count {
        font-size: 10px;
      }

      .area-header.is-stuck .area-quick-switch {
        width: 22px;
        height: 14px;
      }

      .area-header.is-stuck .area-quick-switch::after {
        top: 3px;
        left: 3px;
        width: 8px;
        height: 8px;
      }

      .area-header.is-stuck .area-quick-control.active .area-quick-switch::after {
        transform: translateX(8px);
      }

      .area-header.is-stuck .area-quick-direction {
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-quick-direction ha-icon {
        --mdc-icon-size: 14px;
      }

      .area-quick-control:active {
        transform: scale(0.94);
      }

      .area-quick-control.active {
        background: #182044;
        color: #ffffff;
      }

      .area-quick-control.light.active {
        color: #ffd047;
      }

      .area-quick-control.switch.active {
        color: #58a9ff;
      }

      .area-quick-control.cover.active {
        color: #b984ff;
      }

      .area-mobile-edit {
        position: relative;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-mobile-actions {
        grid-column: 3;
        justify-self: end;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .area-mobile-actions .unavailable-entities-icon {
        width: 38px;
        height: 38px;
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        background: #f44336;
        color: #ffffff;
        box-shadow:
          0 12px 26px rgba(244, 67, 54, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.2);
      }

      .area-mobile-actions .unavailable-entities-icon ha-icon {
        color: #ffffff;
        --mdc-icon-size: 19px;
      }

      .area-mobile-actions .unavailable-count {
        top: -6px;
        right: -6px;
        background: #ff9800;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--card-background-color) 92%, transparent);
      }

      .area-mobile-edit.active {
        background: var(--primary-color);
      }

      .area-header-content {
        position: relative;
        z-index: 3;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .area-header.is-stuck .area-header-content {
        gap: 6px;
      }

      .area-header-icon {
        display: none;
      }

      .area-title-group {
        width: 100%;
        justify-content: center;
        gap: 0;
        min-width: 0;
        text-align: center;
      }

      .area-title {
        max-width: min(260px, calc(100vw - 122px));
        margin: 0 auto;
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .area-header.is-stuck .area-title {
        font-size: 14px;
      }

      .area-subtitle {
        display: block;
        margin-top: 2px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 750;
        line-height: 1.1;
      }

      .area-header.is-stuck .area-subtitle {
        margin-top: 1px;
        font-size: 11px;
      }

      .area-header-metrics {
        position: relative;
        z-index: 3;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 4px;
        transition:
          gap 0.2s ease,
          margin 0.2s ease;
      }

      .area-header-metric {
        min-height: 72px;
        padding: 12px;
        border-radius: 10px;
        background:
          linear-gradient(135deg,
            color-mix(in srgb, var(--metric-color) 13%, var(--card-background-color)) 0%,
            color-mix(in srgb, var(--metric-color) 6%, var(--card-background-color)) 100%);
        box-shadow:
          0 12px 24px rgba(15, 23, 42, 0.06),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        transition:
          min-height 0.2s ease,
          padding 0.2s ease,
          border-radius 0.2s ease;
      }

      .area-header-metric .metric-ring {
        width: 46px;
        height: 46px;
        transition:
          width 0.2s ease,
          height 0.2s ease;
      }

      .area-header-metric .metric-ring::after {
        transition: inset 0.2s ease;
      }

      .area-header-metric .metric-value,
      .area-header-metric .metric-label,
      .area-header-metric .metric-range,
      .area-header-metric .metric-reading {
        transition:
          font-size 0.2s ease,
          opacity 0.2s ease;
      }

      .area-header.is-stuck .area-header-metrics {
        gap: 8px;
        margin-top: 0;
      }

      .area-header.is-stuck .area-header-metric {
        min-height: 40px;
        padding: 6px 9px;
        gap: 8px;
        border-radius: 8px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.05),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
      }

      .area-header.is-stuck .area-header-metric .metric-ring {
        width: 30px;
        height: 30px;
      }

      .area-header.is-stuck .area-header-metric .metric-ring::after {
        inset: 4px;
      }

      .area-header.is-stuck .area-header-metric .metric-value {
        font-size: 9px;
      }

      .area-header.is-stuck .area-header-metric .metric-label {
        font-size: 11px;
      }

      .area-header.is-stuck .area-header-metric .metric-reading {
        font-size: 10px;
      }

      .area-header.is-stuck .area-header-metric .metric-range {
        opacity: 0;
        height: 0;
        margin-top: 0;
        overflow: hidden;
      }

      .area-header-actions {
        display: none;
      }

      .area-header .area-badges {
        position: relative;
        z-index: 3;
        width: 100%;
        display: none;
      }

      .area-header .area-badge {
        min-height: 34px;
        flex: 0 0 auto;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 850;
        box-shadow: none;
      }

      .area-header .area-badge.light-toggle,
      .area-header .area-badge.switch-toggle {
        min-width: 128px;
        justify-content: center;
      }

      .area-header.has-picture {
        background:
          linear-gradient(180deg,
            rgba(23, 35, 33, 0.74) 0%,
            rgba(23, 35, 33, 0.58) 72%,
            rgba(23, 35, 33, 0.22) 100%);
      }

      .area-header.has-picture .area-subtitle {
        color: rgba(255, 255, 255, 0.72);
      }

      .area-content-area .area-header {
        min-height: 252px;
        margin: 0 -10px 18px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 18px 18px;
        justify-content: flex-start;
        overflow: hidden;
        border-radius: 0 0 22px 22px;
        color: #ffffff;
        background:
          radial-gradient(circle at 18% 8%, rgba(255, 255, 255, 0.22), transparent 24%),
          linear-gradient(145deg, #182044 0%, #26374d 48%, #586c82 100%);
        box-shadow:
          0 16px 34px rgba(15, 23, 42, 0.14),
          inset 0 -1px 0 rgba(255, 255, 255, 0.24);
      }

      .area-content-area .area-header.has-metrics {
        min-height: 312px;
      }

      .area-content-area .area-header.has-picture {
        background: #0f172a;
      }

      .area-content-area .area-header-background {
        inset: 0;
        background-position: center;
        background-size: cover;
        transform: scale(1.015);
        filter: saturate(1.08) contrast(1.02);
      }

      .area-content-area .area-header::before {
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(4, 9, 16, 0.2) 0%,
            rgba(4, 9, 16, 0.02) 36%,
            rgba(4, 9, 16, 0.24) 70%,
            rgba(4, 9, 16, 0.64) 100%);
      }

      .area-content-area .area-header::after {
        bottom: -22px;
        height: 46px;
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            color-mix(in srgb, var(--primary-background-color) 86%, transparent) 100%);
        filter: blur(14px);
      }

      .area-content-area .area-mobile-toolbar {
        position: static;
        display: block;
        width: 100%;
        height: 0;
      }

      .area-content-area .area-mobile-home {
        top: calc(18px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions {
        position: absolute;
        top: calc(18px + env(safe-area-inset-top, 0px));
        right: 18px;
        z-index: 6;
        grid-column: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .area-content-area .area-mobile-round,
      .area-content-area .area-mobile-actions .unavailable-entities-icon {
        width: 48px;
        height: 48px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.56);
        background: rgba(255, 255, 255, 0.9);
        color: #14181f;
        backdrop-filter: blur(18px);
        box-shadow:
          0 14px 30px rgba(8, 13, 24, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.62);
      }

      .area-content-area .area-mobile-round ha-icon,
      .area-content-area .area-mobile-round .dd-static-icon,
      .area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon {
        --mdc-icon-size: 22px;
        width: 22px;
        height: 22px;
        color: currentColor;
      }

      .area-content-area .area-mobile-camera {
        display: inline-flex;
      }

      .area-content-area .area-mobile-edit {
        background: rgba(255, 255, 255, 0.92);
        color: #14181f;
      }

      .area-content-area .area-mobile-edit.active {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .area-content-area .area-mobile-actions .unavailable-entities-icon {
        background: rgba(244, 67, 54, 0.94);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.34);
      }

      .area-content-area .area-mobile-actions .unavailable-count {
        top: -5px;
        right: -5px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.92);
      }

      .area-content-area .area-header-content {
        position: absolute;
        top: calc(25px + env(safe-area-inset-top, 0px));
        left: 84px;
        right: 84px;
        width: auto;
        z-index: 4;
        justify-content: center;
        pointer-events: none;
      }

      .area-content-area .area-title-group {
        width: 100%;
      }

      .area-content-area .area-title {
        max-width: 100%;
        color: #ffffff;
        font-size: 17px;
        font-weight: 850;
        line-height: 1.05;
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle {
        color: rgba(255, 255, 255, 0.82);
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-mobile-quick-controls {
        position: absolute;
        left: 18px;
        right: auto;
        bottom: 18px;
        z-index: 5;
        justify-self: auto;
        max-width: calc(100% - 36px);
        min-height: 42px;
        padding: 5px;
        overflow-x: auto;
        scrollbar-width: none;
        background: rgba(255, 255, 255, 0.9);
        box-shadow:
          0 16px 30px rgba(8, 13, 24, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.66);
      }

      .area-content-area .area-mobile-quick-controls::-webkit-scrollbar {
        display: none;
      }

      .area-content-area .area-mobile-quick-controls.empty {
        display: none;
      }

      .area-content-area .area-header-metrics {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 72px;
        z-index: 4;
        width: auto;
        margin: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls {
        bottom: 18px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics {
        bottom: 18px;
      }

      .area-content-area .area-header-metric {
        min-height: 58px;
        padding: 9px 10px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.86);
        backdrop-filter: blur(16px);
        box-shadow:
          0 14px 28px rgba(8, 13, 24, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.62),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
      }

      .area-content-area .area-header-metric .metric-ring {
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header-metric .metric-value,
      .area-content-area .area-header-metric .metric-label,
      .area-content-area .area-header-metric .metric-range,
      .area-content-area .area-header-metric .metric-reading {
        color: #182044;
      }

      .area-content-area .area-header.is-stuck {
        min-height: 88px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 16px 10px;
        border-radius: 0;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 86%, transparent) 100%);
        color: var(--primary-text-color);
        backdrop-filter: blur(22px);
      }

      .area-content-area .area-header.is-stuck .area-header-background {
        opacity: 0;
      }

      .area-content-area .area-header.is-stuck::before {
        background: transparent;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
      .area-content-area .area-header.is-stuck .area-mobile-actions {
        top: calc(8px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
      .area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon {
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header.is-stuck .area-mobile-actions {
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-header.is-stuck .area-header-content {
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 100px;
      }

      .area-content-area .area-header.is-stuck .area-title {
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-subtitle {
        color: var(--secondary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-mobile-quick-controls,
      .area-content-area .area-header.is-stuck .area-header-metrics {
        display: none;
      }

      .area-content-area .area-header {
        min-height: 214px;
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.92), transparent 28%),
          linear-gradient(180deg, #f8fafc 0%, #eef4f8 100%);
        color: var(--primary-text-color);
      }

      .area-content-area .area-header.has-metrics {
        min-height: 214px;
      }

      .area-content-area .area-header.has-picture {
        color: #ffffff;
      }

      .area-content-area .area-header:not(.has-picture)::before {
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.18) 46%,
            rgba(226, 235, 242, 0.78) 100%);
      }

      .area-content-area .area-mobile-home {
        top: calc(16px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions {
        top: calc(16px + env(safe-area-inset-top, 0px));
        right: 18px;
      }

      .area-content-area .area-mobile-round,
      .area-content-area .area-mobile-actions .unavailable-entities-icon {
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow:
          0 12px 26px rgba(8, 13, 24, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.68);
      }

      .area-content-area .area-mobile-home {
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-content-area .area-header-content {
        top: calc(88px + env(safe-area-inset-top, 0px));
        left: 22px;
        right: 24px;
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-header.has-metrics .area-header-content {
        right: 112px;
      }

      .area-content-area .area-title-group {
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-title {
        margin: 0;
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 29px;
        font-weight: 900;
        line-height: 0.98;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-title {
        color: #ffffff;
        text-shadow: 0 1px 16px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle {
        margin-top: 6px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 800;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-subtitle {
        color: rgba(255, 255, 255, 0.78);
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-header-metrics {
        top: calc(90px + env(safe-area-inset-top, 0px));
        right: 18px;
        bottom: auto;
        left: auto;
        width: auto;
        grid-template-columns: 1fr;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics {
        bottom: auto;
      }

      .area-content-area .area-header-metric {
        min-height: 32px;
        padding: 5px 9px 5px 6px;
        gap: 6px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(16px);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.52),
          0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .area-content-area .area-header.has-picture .area-header-metric {
        background: rgba(255, 255, 255, 0.66);
        box-shadow:
          0 10px 22px rgba(8, 13, 24, 0.16),
          inset 0 0 0 1px rgba(255, 255, 255, 0.22);
      }

      .area-content-area .area-header-metric .metric-ring {
        width: 22px;
        height: 22px;
        background: color-mix(in srgb, var(--metric-color) 14%, transparent);
        box-shadow: none;
      }

      .area-content-area .area-header-metric .metric-ring::after {
        display: none;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon {
        --mdc-icon-size: 15px;
        color: var(--metric-color);
      }

      .area-content-area .area-header-metric .metric-value {
        font-size: 10px;
      }

      .area-content-area .area-header-metric .metric-label {
        display: none;
      }

      .area-content-area .area-header-metric .metric-reading {
        margin-top: 0;
        color: #101827;
        font-size: 12px;
        font-weight: 950;
        line-height: 1;
      }

      .area-content-area .area-header-metric .metric-range {
        display: none;
      }

      .area-content-area .area-mobile-quick-controls {
        top: calc(154px + env(safe-area-inset-top, 0px));
        left: 22px;
        right: 24px;
        bottom: auto;
        margin: 0;
        justify-content: flex-start;
        max-width: calc(100% - 48px);
        width: max-content;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls {
        top: calc(154px + env(safe-area-inset-top, 0px));
        bottom: auto;
      }

      .area-content-area .area-header.has-metrics.has-quick-controls {
        min-height: 214px;
      }

      .area-content-area .area-header.is-stuck {
        min-height: 84px;
      }

      .area-content-area .area-header.is-stuck .area-header-content {
        top: calc(13px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 106px;
      }

      .area-content-area .area-header.is-stuck .area-title {
        font-size: 16px;
      }

      .area-content-area .area-header {
        box-sizing: border-box;
        min-height: calc(146px + env(safe-area-inset-top, 0px));
        margin: 0 -10px 18px;
        padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 12px;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 10% -8%, color-mix(in srgb, var(--primary-color) 14%, transparent) 0%, transparent 34%),
          radial-gradient(circle at 92% 4%, color-mix(in srgb, #35b7d7 10%, transparent) 0%, transparent 30%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) 0%,
            color-mix(in srgb, var(--card-background-color) 90%, #dff4fb 10%) 62%,
            color-mix(in srgb, var(--primary-background-color) 82%, var(--card-background-color) 18%) 100%);
        box-shadow:
          0 14px 34px rgba(15, 23, 42, 0.1),
          inset 0 -1px 0 color-mix(in srgb, var(--primary-color) 13%, var(--divider-color));
      }

      .area-content-area .area-header.has-metrics,
      .area-content-area .area-header.has-quick-controls,
      .area-content-area .area-header.has-metrics.has-quick-controls {
        min-height: calc(154px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture {
        min-height: calc(178px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture.has-metrics,
      .area-content-area .area-header.has-picture.has-quick-controls {
        min-height: calc(186px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.has-picture)::before {
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 42%, transparent) 0%,
            transparent 52%,
            color-mix(in srgb, var(--primary-color) 5%, transparent) 100%);
        opacity: 1;
      }

      .area-content-area .area-header::after {
        bottom: -20px;
        height: 40px;
        opacity: 0.88;
        filter: blur(12px);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) 0%,
            transparent 82%);
      }

      .area-content-area .area-mobile-home {
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions {
        top: calc(14px + env(safe-area-inset-top, 0px));
        right: 18px;
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-mobile-round,
      .area-content-area .area-mobile-actions .unavailable-entities-icon {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.12),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 62%, transparent);
      }

      .area-content-area .area-mobile-home {
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-content-area .area-mobile-round ha-icon,
      .area-content-area .area-mobile-round .dd-static-icon,
      .area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-header-content {
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.has-metrics .area-header-content {
        right: 136px;
      }

      .area-content-area .area-title {
        max-width: 100%;
        font-size: 25px;
        font-weight: 900;
        line-height: 1.02;
        letter-spacing: 0;
      }

      .area-content-area .area-subtitle {
        margin-top: 3px;
        padding-bottom: 5px;
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header-metrics {
        top: calc(63px + env(safe-area-inset-top, 0px));
        right: 18px;
        left: auto;
        bottom: auto;
        width: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics {
        bottom: auto;
      }

      .area-content-area .area-header-metric {
        min-height: 29px;
        height: 29px;
        min-width: 96px;
        padding: 4px 9px 4px 5px;
        gap: 6px;
        border-radius: 999px;
        background:
          linear-gradient(135deg,
            color-mix(in srgb, var(--metric-color) 13%, var(--card-background-color)) 0%,
            color-mix(in srgb, var(--metric-color) 4%, var(--card-background-color)) 100%);
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
      }

      .area-content-area .area-header.has-picture .area-header-metric {
        background: rgba(255, 255, 255, 0.76);
      }

      .area-content-area .area-header-metric .metric-ring {
        width: 21px;
        height: 21px;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon {
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header-metric .metric-copy {
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .area-content-area .area-header-metric .metric-reading {
        max-width: 62px;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 12px;
        font-weight: 950;
        text-overflow: ellipsis;
      }

      .area-content-area .area-mobile-quick-controls,
      .area-content-area .area-header.has-metrics .area-mobile-quick-controls {
        top: auto;
        bottom: 8px;
        left: 20px;
        right: 20px;
        width: auto;
        max-width: none;
        min-height: 36px;
        padding: 3px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: stretch;
        overflow-x: auto;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 90%, transparent);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 58%, transparent);
      }

      .area-content-area .area-header:not(.has-metrics) .area-mobile-quick-controls {
        top: auto;
        bottom: 8px;
        right: 20px;
        width: auto;
        max-width: none;
      }

      .area-content-area .area-mobile-quick-controls.count-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-quick-control {
        min-width: 48px;
        width: 100%;
        height: 30px;
        padding: 0 6px 0 8px;
        justify-content: space-between;
      }

      .area-content-area .area-quick-control ha-icon {
        --mdc-icon-size: 16px;
      }

      .area-content-area .area-quick-count {
        font-size: 10px;
      }

      .area-content-area .area-quick-switch {
        width: 24px;
        height: 15px;
      }

      .area-content-area .area-quick-switch::after {
        top: 3px;
        left: 3px;
        width: 9px;
        height: 9px;
      }

      .area-content-area .area-quick-control.active .area-quick-switch::after {
        transform: translateX(9px);
      }

      .area-content-area .area-quick-direction {
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-quick-direction ha-icon {
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home {
        background: rgba(10, 16, 38, 0.86);
        color: #ffffff;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(18px) saturate(1.25);
        -webkit-backdrop-filter: blur(18px) saturate(1.25);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home ha-icon,
      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home .dd-static-icon {
        color: #ffffff;
        opacity: 1;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-actions .area-mobile-round {
        background: rgba(255, 255, 255, 0.86);
        color: #0f172a;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.22),
          inset 0 0 0 1px rgba(255, 255, 255, 0.34);
        backdrop-filter: blur(18px) saturate(1.22);
        -webkit-backdrop-filter: blur(18px) saturate(1.22);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-quick-controls,
      .area-content-area .area-header.has-picture:not(.is-stuck).has-metrics .area-mobile-quick-controls {
        background: rgba(255, 255, 255, 0.9);
        box-shadow:
          0 16px 32px rgba(0, 0, 0, 0.2),
          inset 0 0 0 1px rgba(255, 255, 255, 0.42);
        backdrop-filter: blur(18px) saturate(1.18);
        -webkit-backdrop-filter: blur(18px) saturate(1.18);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control {
        color: rgba(15, 23, 42, 0.66);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active {
        background: color-mix(in srgb, var(--domain-color, #182044) 16%, rgba(15, 23, 42, 0.06));
        color: var(--domain-color, #182044);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.light {
        --domain-color: #d99a12;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.switch {
        --domain-color: #2f73d6;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.cover {
        --domain-color: #7c4fc7;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-switch {
        background: rgba(15, 23, 42, 0.16);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active .area-quick-switch {
        background: var(--domain-color, #182044);
      }

      .area-content-area .area-header {
        position: relative;
        top: auto;
        z-index: 3;
      }

      .area-content-area .area-header.is-stuck,
      .area-content-area .area-header.is-stuck.has-metrics,
      .area-content-area .area-header.is-stuck.has-quick-controls,
      .area-content-area .area-header.is-stuck.has-metrics.has-quick-controls,
      .area-content-area .area-header.is-stuck.has-picture,
      .area-content-area .area-header.is-stuck.has-picture.has-metrics,
      .area-content-area .area-header.is-stuck.has-picture.has-quick-controls {
        position: sticky;
        top: 0;
        z-index: 90;
        min-height: calc(62px + env(safe-area-inset-top, 0px));
        margin-bottom: 4px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 14px 7px;
        border-radius: 0;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
      .area-content-area .area-header.is-stuck .area-mobile-actions {
        top: calc(9px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
      .area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon {
        width: 36px;
        height: 36px;
      }

      .area-content-area .area-header.is-stuck .area-header-content {
        top: calc(10px + env(safe-area-inset-top, 0px));
        left: 66px;
        right: 66px;
      }

      .area-content-area .area-header.is-stuck .area-title {
        font-size: 15px;
        line-height: 1.05;
      }

      .area-content-area .area-header.is-stuck .area-subtitle {
        display: block;
        margin-top: 2px;
        padding-bottom: 0;
        color: color-mix(in srgb, var(--secondary-text-color) 88%, var(--primary-text-color) 12%);
        font-size: 11px;
        font-weight: 800;
        line-height: 1.05;
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck::after,
      .area-content-area .area-header.is-stuck .area-mobile-quick-controls,
      .area-content-area .area-header.is-stuck.has-metrics .area-mobile-quick-controls,
      .area-content-area .area-header.is-stuck.has-quick-controls .area-mobile-quick-controls,
      .area-content-area .area-header.is-stuck .area-header-metrics,
      .area-content-area .area-header.is-stuck .area-badges {
        display: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed {
        overflow: visible;
      }

      .area-content-area .area-header.is-stuck.is-revealed::before {
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: calc(154px + env(safe-area-inset-top, 0px));
        display: block;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 10% -8%, color-mix(in srgb, var(--primary-color) 14%, transparent) 0%, transparent 34%),
          radial-gradient(circle at 92% 4%, color-mix(in srgb, #35b7d7 10%, transparent) 0%, transparent 30%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) 0%,
            color-mix(in srgb, var(--card-background-color) 90%, #dff4fb 10%) 62%,
            color-mix(in srgb, var(--primary-background-color) 82%, var(--card-background-color) 18%) 100%);
        box-shadow:
          0 14px 34px rgba(15, 23, 42, 0.12),
          inset 0 -1px 0 color-mix(in srgb, var(--primary-color) 13%, var(--divider-color));
        pointer-events: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-content {
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-header-content {
        right: 136px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-title {
        font-size: 25px;
        line-height: 1.02;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-subtitle {
        display: block;
        margin-top: 3px;
        padding-bottom: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-picture .area-title,
      .area-content-area .area-header.is-stuck.is-revealed.has-picture .area-subtitle {
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-metrics {
        top: calc(63px + env(safe-area-inset-top, 0px));
        right: 18px;
        left: auto;
        bottom: auto;
        width: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls,
      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls,
      .area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls {
        top: calc(110px + env(safe-area-inset-top, 0px));
        bottom: auto;
        left: 20px;
        right: 20px;
        width: auto;
        max-width: none;
        min-height: 36px;
        padding: 3px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: stretch;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 90%, transparent);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 58%, transparent);
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.empty {
        display: none;
      }

      .area-view .entities-section,
      .area-view .dd-custom-section {
        position: relative;
        z-index: 2;
      }

      .area-view .entities-section {
        display: none;
      }

      .mobile-area-overview {
        display: block;
        position: relative;
        z-index: 2;
        margin: 12px 0 20px;
      }

      .mobile-entities-section {
        display: grid;
        position: relative;
        z-index: 2;
      }

      .layout-container > .sidebar,
      .sidebar {
        position: fixed !important;
        left: 18px !important;
        right: 18px !important;
        top: auto !important;
        bottom: calc(82px + env(safe-area-inset-bottom, 0px)) !important;
        width: auto !important;
        height: auto !important;
        max-height: min(62vh, 520px);
        padding: 10px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(20px);
        transform: translate3d(0, calc(100% + 140px), 0) !important;
        transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 121;
      }

      .layout-container > .sidebar.open,
      .sidebar.open {
        transform: translate3d(0, 0, 0) !important;
      }

      .sidebar::before {
        content: "";
        width: 42px;
        height: 4px;
        margin: 0 auto 10px;
        display: block;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.14);
      }

      .sidebar .area-list {
        padding: 0;
      }

      .sidebar .floor-section {
        margin-bottom: 12px;
      }

      .sidebar .floor-header {
        padding: 6px 12px 9px;
      }

      .sidebar .floor-header h3 {
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-button {
        min-height: 64px;
        height: auto;
        margin-bottom: 8px;
        padding: 11px 12px 11px 56px;
        border-radius: 9px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 97%, #ffffff),
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color)));
        box-shadow:
          0 10px 22px rgba(15, 23, 42, 0.07),
          inset 0 1px 0 rgba(255, 255, 255, 0.42);
      }

      .sidebar .area-button.home-button {
        height: 48px;
        min-height: 48px;
        padding: 10px 14px 10px 54px;
        border-radius: 8px;
      }

      .sidebar .area-button.home-button .area-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        width: 34px;
        height: 34px;
        transform: translateY(-50%);
        border-radius: 999px;
      }

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
        border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 88%, #ffffff 10%),
            var(--primary-color));
        color: var(--text-primary-color);
        box-shadow:
          0 14px 28px color-mix(in srgb, var(--primary-color) 24%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .sidebar .area-content {
        min-height: 42px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 3px 10px;
      }

      .sidebar .area-top-section {
        min-width: 0;
        margin-top: 0;
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      .sidebar .area-bottom-section {
        display: contents;
        min-height: 0;
      }

      .sidebar .area-main-icon {
        position: absolute;
        left: -44px;
        top: 50%;
        bottom: auto;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        transform: translateY(-50%);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        box-shadow: none;
      }

      .sidebar .area-main-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .sidebar .area-button.has-picture {
        min-height: 70px;
        color: var(--area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.18);
        background: #182044;
      }

      .sidebar .area-button.has-picture.selected {
        border-color: color-mix(in srgb, var(--primary-color) 44%, rgba(255, 255, 255, 0.18));
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.18),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .sidebar .area-button.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--area-picture-overlay);
        pointer-events: none;
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-content,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon {
        z-index: 1;
      }

      .sidebar .area-info-badges {
        position: relative;
        top: auto;
        right: auto;
        grid-column: 2;
        grid-row: 1 / span 2;
        max-width: 130px;
        justify-content: flex-end;
        align-self: center;
        gap: 5px;
      }

      .sidebar .area-name {
        max-width: 100%;
        margin: 0;
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.1;
      }

      .sidebar .area-button.has-picture .area-sensors {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .info-badge {
        min-width: 24px;
        height: 22px;
        padding: 0 7px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
      }

      .sidebar .info-badge ha-icon {
        --mdc-icon-size: 13px;
      }

      .sidebar .badge-count {
        font-size: 11px;
        font-weight: 850;
      }

      .sidebar .area-button.has-picture .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .sidebar .area-button.selected .area-main-icon,
      .sidebar .area-button.selected .area-icon {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }

      .sidebar .area-list {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-section {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
        margin-bottom: 10px;
      }

      .sidebar .floor-areas {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-header {
        margin: 0;
        padding: 4px 6px 2px;
      }

      .sidebar .floor-header h3 {
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 760;
        line-height: 1.2;
      }

      .sidebar .area-button,
      .sidebar .area-button.home-button {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) auto 22px;
        align-items: center;
        gap: 12px;
        min-height: 68px;
        height: auto;
        margin: 0;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background: rgba(255, 255, 255, 0.92);
        color: var(--primary-text-color);
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        transform: none;
      }

      .sidebar .area-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
      }

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.34);
        background: rgba(255, 255, 255, 0.98);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.home-button .area-icon,
      .sidebar .area-icon,
      .sidebar .area-main-icon {
        position: relative;
        left: auto;
        top: auto;
        bottom: auto;
        grid-column: 1;
        grid-row: 1;
        width: 46px;
        height: 46px;
        border-radius: 8px;
        transform: none;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        color: var(--primary-color);
        box-shadow: none;
      }

      .sidebar .area-button.home-button .area-icon {
        position: relative;
        left: auto;
        top: auto;
      }

      .sidebar .area-main-icon ha-icon,
      .sidebar .area-icon ha-icon {
        --mdc-icon-size: 24px;
        color: currentColor;
      }

      .sidebar .area-content {
        display: contents;
        width: auto;
        height: auto;
        min-height: 0;
      }

      .sidebar .area-info,
      .sidebar .area-top-section {
        grid-column: 2;
        grid-row: 1;
        min-width: 0;
        margin: 0;
      }

      .sidebar .area-bottom-section {
        display: contents;
      }

      .sidebar .area-name {
        margin: 0;
        color: inherit;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.1;
      }

      .sidebar .area-info-badges {
        position: relative;
        top: auto;
        right: auto;
        grid-column: 3;
        grid-row: 1;
        max-width: 104px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
        z-index: 1;
      }

      .sidebar .area-menu-chevron {
        display: block;
        grid-column: 4;
        grid-row: 1;
        z-index: 1;
        --mdc-icon-size: 22px;
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .home-notification-shortcut {
        grid-column: 3;
        grid-row: 1;
        justify-self: end;
        width: auto;
        min-width: 44px;
        height: 30px;
        margin-left: 0;
      }

      .sidebar .area-button.selected .area-menu-chevron {
        color: var(--primary-color);
        transform: translateX(2px);
      }

      .sidebar .area-button.has-picture {
        min-height: 68px;
        border-color: rgba(15, 23, 42, 0.12);
        background: rgba(18, 24, 38, 0.9);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.48);
        background: rgba(18, 24, 38, 0.92);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.16),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-top-section,
      .sidebar .area-button.has-picture .area-name,
      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon,
      .sidebar .area-button.has-picture .area-icon {
        position: relative;
        z-index: 2;
      }

      .sidebar .area-button.has-picture::after {
        background: var(--area-picture-overlay);
      }

      .sidebar .area-button.has-picture .area-name {
        width: fit-content;
        max-width: 100%;
        padding: 4px 8px;
        margin-left: -2px;
        border-radius: 8px;
        color: #ffffff;
        background: linear-gradient(90deg, rgba(8, 13, 24, 0.66), rgba(8, 13, 24, 0.28));
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(2px);
      }

      .sidebar .area-button.has-picture .area-main-icon,
      .sidebar .area-button.has-picture .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
        backdrop-filter: blur(10px);
      }

      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .area-button.has-picture.selected .area-menu-chevron {
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .area-main-icon,
      .sidebar .area-button.has-picture.text-dark .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
      }

      .mobile-nav-overlay {
        z-index: 120 !important;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
      }

      :host([data-theme-dark]) {
        .layout-container > .sidebar,
        .sidebar {
          border-color: rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(37, 40, 48, 0.96), rgba(18, 20, 25, 0.94)),
            color-mix(in srgb, var(--card-background-color) 92%, #000000);
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.58),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: var(--primary-text-color);
        }

        .sidebar::before {
          background: rgba(255, 255, 255, 0.18);
        }

        .sidebar .floor-header h3 {
          color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        }

        .sidebar .area-button {
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          color: var(--primary-text-color);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24);
        }

        .sidebar .area-button.selected,
        .sidebar .area-button.home-button.selected {
          border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 12%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
          color: var(--primary-text-color);
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.36),
            inset 3px 0 0 var(--primary-color),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .sidebar .area-button.has-picture {
          border-color: rgba(255, 255, 255, 0.08);
          background: #17202b;
        }

        .sidebar .area-button.has-picture .area-background {
          opacity: 0.58;
        }

        .sidebar .area-button.has-picture:hover .area-background {
          opacity: 0.66;
        }

        .sidebar .area-main-icon,
        .sidebar .area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-button.selected .area-main-icon,
        .sidebar .area-button.selected .area-icon {
          background: color-mix(in srgb, var(--primary-color) 24%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-menu-chevron,
        .sidebar .area-button.selected .area-menu-chevron {
          color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        }

        .sidebar .area-button.selected .area-menu-chevron {
          color: var(--primary-color);
        }

        .sidebar .area-sensors,
        .sidebar .area-bottom-section {
          color: color-mix(in srgb, var(--primary-text-color) 68%, transparent);
        }

        .sidebar .info-badge {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .home-notification-shortcut {
          color: #ff9a9a;
          background: rgba(239, 68, 68, 0.16);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 8px 18px rgba(0, 0, 0, 0.18);
        }

        .mobile-nav-overlay {
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(4px);
        }
      }

      .home-view,
      .home-content-area {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 -10px 44px !important;
        padding: 0 !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section .favorites-grid {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper {
        max-width: 100% !important;
        min-width: 0 !important;
      }
    }
  `,y([Be({attribute:!1})],Na.prototype,"hass",void 0),y([Be({attribute:!1})],Na.prototype,"config",void 0),y([Fe()],Na.prototype,"_selectedArea",void 0),y([Fe()],Na.prototype,"_selectedView",void 0),y([Fe()],Na.prototype,"_isMobile",void 0),y([Fe()],Na.prototype,"_headerExpanded",void 0),y([Fe()],Na.prototype,"_headerCompact",void 0),y([Fe()],Na.prototype,"_currentTime",void 0),y([Fe()],Na.prototype,"_currentDate",void 0),y([Fe()],Na.prototype,"_mobileNavOpen",void 0),y([Fe()],Na.prototype,"_hasRelevantStateChanges",void 0),y([Fe()],Na.prototype,"_editMode",void 0),y([Fe()],Na.prototype,"_notificationsOpen",void 0),y([Fe()],Na.prototype,"_persistentNotifications",void 0),y([Fe()],Na.prototype,"_notificationsLoading",void 0),y([Fe()],Na.prototype,"_notificationsError",void 0),y([Fe()],Na.prototype,"_mobileDomainMenu",void 0),y([Fe()],Na.prototype,"_areaHeaderStuck",void 0),y([Fe()],Na.prototype,"_areaHeaderRevealed",void 0),y([Fe()],Na.prototype,"_mobileEntityLayout",void 0),y([Fe()],Na.prototype,"_mobileHomeAreasLayout",void 0),y([Fe()],Na.prototype,"_mobileHomeDevicesLayout",void 0),y([Fe()],Na.prototype,"_mobileHomeFavoritesLayout",void 0),y([Fe()],Na.prototype,"_mobileHomeCamerasLayout",void 0),y([Fe()],Na.prototype,"_areaSidebarWidth",void 0),y([Fe()],Na.prototype,"_areaSidebarCollapsed",void 0),y([Fe()],Na.prototype,"_isResizingSidebar",void 0),y([Fe()],Na.prototype,"_repairsIssueCount",void 0),y([Fe()],Na.prototype,"_discoveredDeviceCount",void 0),y([Fe()],Na.prototype,"_suggestedFavoriteEntities",void 0),y([Fe()],Na.prototype,"_customCardDrag",void 0),y([Fe()],Na.prototype,"_customCardDragOver",void 0),y([Fe()],Na.prototype,"_optimisticEntityStates",void 0),y([Fe()],Na.prototype,"_renderAllMobileHomeAreas",void 0),y([Fe()],Na.prototype,"_renderAllMobileAreaEntities",void 0),y([Fe()],Na.prototype,"_settingsDirty",void 0),y([Fe()],Na.prototype,"_settingsSavePending",void 0),y([Fe()],Na.prototype,"_settingsSaveError",void 0),Na=y([Oe("dwains-dashboard-next-layout-card")],Na);var Oa=Object.freeze({__proto__:null,get DwainsLayoutCard(){return Na}});class Ra extends Te{constructor(){super(...arguments),this.cards=[],this.config={},this._isLoading=!0}static getConfigElement(){return document.createElement("dwains-dashboard-next-card-editor")}setConfig(e){this.config=e,this._isLoading=!0,this.hass&&this._generateDashboardConfig()}async _generateDashboardConfig(){if(this.hass)try{this._isLoading=!0;const[e,t,i,a]=await Promise.all([this.hass.callWS({type:"config/area_registry/list"}),this.hass.callWS({type:"config/device_registry/list"}),this.hass.callWS({type:"config/entity_registry/list"}),this.hass.callWS({type:"config/floor_registry/list"}).catch(()=>[])]);console.log(`Custom Card: Found ${e.length} areas, ${t.length} devices, ${i.length} entities, ${a.length} floors`);const o=e.map(e=>({area_id:e.area_id,name:e.name,picture:e.picture||void 0,icon:e.icon||void 0,floor_id:e.floor_id||void 0,temperature_entity_id:e.temperature_entity_id||void 0,humidity_entity_id:e.humidity_entity_id||void 0})),r=t.map(e=>({device_id:e.id,name:e.name,area_id:e.area_id||void 0,created_at:e.created_at||void 0})),n=i.map(e=>({entity_id:e.entity_id,area_id:e.area_id||void 0,device_id:e.device_id||void 0,created_at:e.created_at||void 0,hidden:!!e.hidden_by})),s=a.map(e=>({floor_id:e.floor_id,name:e.name}));this.hass.entities=i.reduce((e,t)=>(e[t.entity_id]=t,e),{}),this.hass.devices=t.reduce((e,t)=>(e[t.id]=t,e),{}),this._dashboardConfig={...this._convertToStrategyConfig(this.config),areas:o,devices:r,entities:n,floors:s},this._isLoading=!1,this._updateCards(),setTimeout(()=>{this._navigateToHome()},100),window.ddDebugEntity=e=>{const t=this.hass?.states?.[e],i=this.hass?.entities?.[e];return console.log("[Dwains] Debug entity",e,{state:t,registry:i}),{state:t,registry:i}}}catch(e){console.error("Failed to generate dashboard config:",e),this._isLoading=!1}}_convertToStrategyConfig(e){const{type:t,...i}=e;return{areas_options:{},global_options:{show_welcome:!0,show_weather:!0,show_person_cards:!0},views:[],persons:[],favorites:[],...i}}_updateCards(){this._dashboardConfig&&this.hass?this.cards=[fe`
      <dwains-dashboard-next-layout-card
        .hass=${this.hass}
        .config=${this._dashboardConfig}
      ></dwains-dashboard-next-layout-card>
    `]:this.cards=[]}_navigateToHome(){const e=this.shadowRoot?.querySelector("dwains-dashboard-next-layout-card");e&&"home"!==e._selectedView&&(e._selectedView="home",e._selectedArea=null,e.requestUpdate(),console.log("Custom Card: Navigated to home view"))}getCardSize(){return 10}getGridOptions(){return{rows:10,columns:"full",min_rows:10}}static getStubConfig(){return{type:"custom:dwains-dashboard-next-card",global_options:{show_welcome:!0,show_weather:!0,show_person_cards:!0}}}static get styles(){return j`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #dwains_dashboard {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", sans-serif !important;
      }

      dwains-dashboard-next-layout-card {
        width: 100%;
        height: 100%;
        display: block;
      }
    `}updated(e){super.updated(e),e.has("hass")&&this.hass&&(this._dashboardConfig?this._updateCards():this._generateDashboardConfig())}render(){return this._isLoading||!this._dashboardConfig?fe`
        <div style="display: flex; justify-content: center; align-items: center; height: 200px; font-size: 18px;">
          ${o(this.hass,"common.loading")}
        </div>
      `:this.cards&&0!==this.cards.length?fe`
      <div id="dwains_dashboard">
        ${this.cards.map(e=>fe`${e}`)}
      </div>
    `:fe`
        <div style="display: flex; justify-content: center; align-items: center; height: 200px; font-size: 18px;">
          ${o(this.hass,"common.no_content")}
        </div>
      `}}y([Be({attribute:!1})],Ra.prototype,"hass",void 0),y([Be({attribute:!1})],Ra.prototype,"cards",void 0),y([Be({attribute:!1})],Ra.prototype,"config",void 0),y([Fe()],Ra.prototype,"_dashboardConfig",void 0),y([Fe()],Ra.prototype,"_isLoading",void 0);var Va=Object.freeze({__proto__:null,DwainsDashboardCard:Ra});class Ba extends Te{constructor(){super(...arguments),this._config={}}setConfig(e){this._config=e,this._strategyEditor&&this._strategyEditor.setConfig(this._convertToStrategyConfig(e))}_convertToStrategyConfig(e){const{type:t,...i}=e;return{type:"custom:dwains-dashboard-next",...i}}_convertToCardConfig(e){const{type:t,...i}=e;return{type:"custom:dwains-dashboard-next-card",...i}}async firstUpdated(){const e=document.createElement("dwains-dashboard-next-strategy-editor");this._strategyEditor=e,this.hass&&(e.hass=this.hass),this._config&&e.setConfig(this._convertToStrategyConfig(this._config)),e.addEventListener("config-changed",e=>{e.stopPropagation();const t=e.detail.config,i=this._convertToCardConfig(t);this._fireConfigChanged(i)}),this.requestUpdate()}updated(e){super.updated(e),e.has("hass")&&this._strategyEditor&&this.hass&&(this._strategyEditor.hass=this.hass),e.has("_config")&&this._strategyEditor&&this._config&&this._strategyEditor.setConfig(this._convertToStrategyConfig(this._config))}_fireConfigChanged(e){const t=new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0});this.dispatchEvent(t)}render(){return this.hass?this._strategyEditor?fe`${this._strategyEditor}`:fe`
        <div style="padding: 16px; text-align: center;">
          <ha-circular-progress indeterminate></ha-circular-progress>
          <p style="margin-top: 16px;">${o(this.hass,"common.loading")}</p>
        </div>
      `:fe``}static get styles(){return j`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `}}y([Be({attribute:!1})],Ba.prototype,"hass",void 0),y([Fe()],Ba.prototype,"_config",void 0),y([Fe()],Ba.prototype,"_strategyEditor",void 0),customElements.get("dwains-dashboard-next-card-editor")||customElements.define("dwains-dashboard-next-card-editor",Ba);var Fa=Object.freeze({__proto__:null,DwainsDashboardCardEditor:Ba});let qa=class extends Te{set hass(e){this._hass=e,!this._refCards&&this._config&&this._renderChildCards(),this._refCards&&this._refCards.forEach(t=>{t.hass=e})}get hass(){return this._hass}setConfig(e){if(!e||!Array.isArray(e.cards)&&!Array.isArray(e.entities))throw new Error('dwains-flexbox-card: "cards" (of "entities") moet een lijst zijn');this._config=e,this._refCards=void 0,this._hass&&this._renderChildCards()}async _createCardElement(e){const t=await(window.loadCardHelpers?.());let i;if(t)i=t.createCardElement(e);else{let a=e.type;a=a.startsWith("divider")?"hui-divider-row":a.startsWith("custom:")?a.substr(7):`hui-${a}-card`,i=document.createElement(a);try{i.setConfig(e)}catch(a){i=this._createErrorCard(a?.message,e,t)}}const a=e.item_classes||this._config?.items_classes;return i.className=a?`item ${a}`:"item",i.hass=this._hass,i.addEventListener("ll-rebuild",e=>{e.stopPropagation(),this._renderChildCards()},{once:!0}),i}_createErrorCard(e,t,i){if(i?.createCardElement)return i.createCardElement({type:"error",error:e,origConfig:t});const a=document.createElement("hui-error-card");try{a.setConfig({type:"error",error:e,origConfig:t})}catch{}return a}_renderChildCards(){const e=(this._config?.cards||this._config?.entities||[]).map(e=>this._createCardElement(e));Promise.all(e).then(e=>{this._refCards=e,this.requestUpdate()})}shouldUpdate(e){return e.has("_config")||!!this._refCards}render(){if(!this._config||!this._hass||!this._refCards)return fe``;const e=this._config.padding?"padding":"";return fe`
      <div style=${this._config.css||""}>
        <div class="wrapper ${e}">
          <div class="row">${this._refCards}</div>
        </div>
      </div>
    `}};qa.styles=j`
    :host {
      display: block;
    }
    .row {
      box-sizing: border-box;
      display: flex;
      flex: 0 1 auto;
      flex-direction: row;
      flex-wrap: wrap;
      margin-right: -0.25rem;
      margin-left: -0.25rem;
      overflow: hidden;
      width: auto;
    }
    .row.reverse {
      flex-direction: row-reverse;
    }
    .col-xs, [class*='col-xs-'],
    .col-sm, [class*='col-sm-'],
    .col-md, [class*='col-md-'],
    .col-lg, [class*='col-lg-'] {
      box-sizing: border-box;
      flex: 0 0 auto;
      padding-right: 0.25rem;
      padding-left: 0.25rem;
    }
    .col-xs { flex-grow: 1; flex-basis: 0; max-width: 100%; }
    .col-xs-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
    .col-xs-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
    .col-xs-3 { flex-basis: 25%; max-width: 25%; }
    .col-xs-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
    .col-xs-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
    .col-xs-6 { flex-basis: 50%; max-width: 50%; }
    .col-xs-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
    .col-xs-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
    .col-xs-9 { flex-basis: 75%; max-width: 75%; }
    .col-xs-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
    .col-xs-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
    .col-xs-12 { flex-basis: 100%; max-width: 100%; }
    .start-xs { justify-content: flex-start; text-align: start; }
    .center-xs { justify-content: center; text-align: center; }
    .end-xs { justify-content: flex-end; text-align: end; }
    .top-xs { align-items: flex-start; }
    .middle-xs { align-items: center; }
    .bottom-xs { align-items: flex-end; }
    .around-xs { justify-content: space-around; }
    .between-xs { justify-content: space-between; }
    .first-xs { order: -1; }
    .last-xs { order: 1; }

    @media only screen and (min-width: 48em) {
      .col-sm { flex-grow: 1; flex-basis: 0; max-width: 100%; }
      .col-sm-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
      .col-sm-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
      .col-sm-3 { flex-basis: 25%; max-width: 25%; }
      .col-sm-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
      .col-sm-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
      .col-sm-6 { flex-basis: 50%; max-width: 50%; }
      .col-sm-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
      .col-sm-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
      .col-sm-9 { flex-basis: 75%; max-width: 75%; }
      .col-sm-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
      .col-sm-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
      .col-sm-12 { flex-basis: 100%; max-width: 100%; }
    }
    @media only screen and (min-width: 64em) {
      .col-md { flex-grow: 1; flex-basis: 0; max-width: 100%; }
      .col-md-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
      .col-md-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
      .col-md-3 { flex-basis: 25%; max-width: 25%; }
      .col-md-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
      .col-md-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
      .col-md-6 { flex-basis: 50%; max-width: 50%; }
      .col-md-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
      .col-md-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
      .col-md-9 { flex-basis: 75%; max-width: 75%; }
      .col-md-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
      .col-md-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
      .col-md-12 { flex-basis: 100%; max-width: 100%; }
    }
    @media only screen and (min-width: 75em) {
      .col-lg { flex-grow: 1; flex-basis: 0; max-width: 100%; }
      .col-lg-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
      .col-lg-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
      .col-lg-3 { flex-basis: 25%; max-width: 25%; }
      .col-lg-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
      .col-lg-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
      .col-lg-6 { flex-basis: 50%; max-width: 50%; }
      .col-lg-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
      .col-lg-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
      .col-lg-9 { flex-basis: 75%; max-width: 75%; }
      .col-lg-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
      .col-lg-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
      .col-lg-12 { flex-basis: 100%; max-width: 100%; }
    }

    .item {
      margin-bottom: 0.5rem;
    }
    .wrapper {
      overflow: hidden;
      padding: 0;
    }
    .wrapper.padding {
      padding: 11px;
    }
    .d-none { display: none !important; }
  `,y([Fe()],qa.prototype,"_config",void 0),qa=y([Oe("dwains-dashboard-next-flexbox-card")],qa);var Wa=Object.freeze({__proto__:null,get DwainsFlexboxCard(){return qa}});class Ua extends Te{setConfig(e){if(!e?.title)throw new Error('dwains-heading-card: "title" is required');this._config={...e},this.requestUpdate()}getCardSize(){return 1}render(){return fe`<ha-card>${this._config?.title??""}</ha-card>`}}Ua.styles=j`
    :host {
      display: block;
    }

    ha-card {
      box-shadow: none;
      background: none;
      padding: 0 16px 0 0;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 700;
    }
  `;var Ga=Object.freeze({__proto__:null,DwainsHeadingCard:Ua});let Ka=class extends Te{constructor(){super(...arguments),this._groupedEntities={},this._loading=!0,this._optimisticEntityStates={},this._entityCards=new Map,this._mobileSheetAnimated=!1,this._handleViewAll=()=>{const e=this._params?.onViewAll;this.closeDialog(),e?.()}}_t(e,t){return o(this.hass,e,t)}_tp(e,t){return r(this.hass,e,t)}async showDialog(e){this._params=e,this._loading=!0,this._mobileSheetAnimated=!1,await this._loadEntities()}closeDialog(){this._params=void 0,this._groupedEntities={},this._optimisticEntityStates={},this._entityCards.clear(),this._mobileSheetAnimated=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0),Fi(this,"dialog-closed",{dialog:this.localName})}updated(e){super.updated(e),e.has("hass")&&this.hass&&this._params&&!this._loading&&(this._reconcileOptimisticEntityStates(),this._updateEntityCards()),this._animateMobileSheetIn()}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0)}_animateMobileSheetIn(){!this._mobileSheetAnimated&&this._params&&"undefined"!=typeof window&&window.matchMedia("(max-width: 600px)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&requestAnimationFrame(()=>{const e=this.renderRoot.querySelector("ha-dialog"),t=e?.shadowRoot,i=t?.querySelector("wa-dialog"),a=i?.shadowRoot,o=a?.querySelector('[part~="panel"]')||a?.querySelector("dialog")||t?.querySelector(".mdc-dialog__surface")||t?.querySelector('[part~="surface"]');o?.animate&&(this._mobileSheetAnimated=!0,o.animate([{transform:"translate3d(0, 100%, 0)",opacity:.98},{transform:"translate3d(0, 0, 0)",opacity:1}],{duration:280,easing:"cubic-bezier(0.22, 1, 0.36, 1)",fill:"both"}))})}async _loadEntities(){if(!this._params||!this.hass)return;const{domain:e,areaId:t,config:i,filterByUnitOfMeasurement:a,deviceClass:o,entityIds:r}=this._params,n={},s=r?.length?new Set(r):void 0,c=i.areas||[],d=new Map(c.map(e=>[e.area_id,e])),l=Object.values(this.hass.states),p=[];l.forEach(r=>{const n=r.entity_id;if(s&&!s.has(n))return;const c=this.hass.entities?.[n];if(c?.hidden_by)return;const l=n.split(".")[0];if(l!==e)return;if(!r||"unavailable"===r.state)return;const h=i.entities?.find(e=>e.entity_id===n),m=h&&h.device_id?i.devices?.find(e=>e.device_id===h.device_id):null,u=h?.area_id||m?.area_id||this.hass?.entities?.[n]?.area_id;if(!u)return;if(t&&u!==t)return;if(!u||!d.has(u))return;const g=l;if(!(i.areas_options?.[u]?.groups_options?.[g]?.hidden||[]).includes(n)){if(a){if(r.attributes?.unit_of_measurement!==a)return}else if("binary_sensor"===e&&o){const e=r.attributes?.device_class;if(e!==o)return}p.push({entity_id:n,area_id:u,hidden:!1})}}),p.forEach(t=>{const i=this.hass.states[t.entity_id];if("person"===e){const e=i?.state||"unknown",a="home"===e?"home":"away",o="home"===e?"Home":"away"===e||"not_home"===e?"Away":`${e.charAt(0).toUpperCase()}${e.slice(1)}`;n[a]||(n[a]={areaName:o,entities:[]}),n[a].entities.push(t)}else{const e=t.area_id,i=d.get(e);if(!i)return;n[e]||(n[e]={areaName:i.name,entities:[]}),n[e].entities.push(t)}}),this._groupedEntities=n,this._loading=!1,this._updateInterval||(this._updateInterval=window.setInterval(()=>{this._checkForEntityChanges()},1e3))}_checkForEntityChanges(){if(!this._params||!this.hass||this._loading)return;const{domain:e,filterByUnitOfMeasurement:t,deviceClass:i}=this._params;let a=!1;Object.entries(this._groupedEntities).forEach(([o,r])=>{r.entities.forEach(o=>{const r=this.hass.states[o.entity_id];if(!r)return void(a=!0);this._shouldEntityBeVisible(r,e,t,i)||(a=!0)})}),a&&this._loadEntities()}_shouldEntityBeVisible(e,t,i,a){return"unavailable"!==e.state&&(i?e.attributes?.unit_of_measurement===i:"binary_sensor"!==t||!a||e.attributes?.device_class===a)}_updateEntityCards(){this._entityCards.forEach((e,t)=>{e&&"hass"in e&&(e.hass=this.hass)})}render(){if(!this._params)return ye;const{domain:e,filterByUnitOfMeasurement:t,deviceClass:i,customTitle:a}=this._params;let o=a||this._getLocalizedDomainTitle(e);if("W"===t)o=this._t("dialog.power_sensors");else if(i){o={motion:this._t("dialog.motion_sensors"),door:this._t("dialog.door_sensors"),window:this._t("dialog.window_sensors"),smoke:this._t("dialog.smoke_sensors"),gas:this._t("dialog.gas_sensors"),moisture:this._t("dialog.moisture_sensors"),occupancy:this._t("dialog.occupancy_sensors"),opening:this._t("dialog.opening_sensors"),presence:this._t("dialog.presence_sensors"),safety:this._t("dialog.safety_sensors"),tamper:this._t("dialog.tamper_sensors"),vibration:this._t("dialog.vibration_sensors")}[i]||this._getLocalizedDomainTitle(e)}return fe`
      <ha-dialog
        open
        @closed=${this.closeDialog}
        @cancel=${()=>this.closeDialog()}
        .heading=${o}
        .type=${""}
        flexContent
        hideActions
      >
        <ha-dialog-header slot="header">
          <div class="sheet-handle" aria-hidden="true"></div>
          <ha-icon-button
            slot="navigationIcon"
            .label=${this._t("common.close")}
            .path=${C}
            @click=${()=>this.closeDialog()}
          ></ha-icon-button>
          <span slot="title">${o}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._loading?fe`<div class="loading">${this._t("common.loading")}</div>`:this._renderContent()}
        </div>
      </ha-dialog>
    `}_renderContent(){if(this._params?.customEntities)return this._renderCustomEntities();const e=this._allDialogEntities();return 0===e.length?fe`
        <div class="empty-state">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.active_empty")}
          </div>
        </div>
      `:fe`
      ${this._renderViewAllAction()}
      ${this._renderDomainActions(e)}
      ${at(Object.entries(this._groupedEntities),([e])=>e,([e,t])=>this._renderAreaSection(e,t))}
    `}_renderViewAllAction(){return this._params?.onViewAll?fe`
      <div class="domain-actions">
        <button
          class="dialog-view-all"
          type="button"
          @click=${this._handleViewAll}
        >
          <span>${this._params.viewAllLabel||this._t("common.view_all")}</span>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `:ye}_renderCustomEntities(){const{customEntities:e,customDescription:t}=this._params;return e&&0!==e.length?fe`
      ${t?fe`
        <div class="custom-description">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <p>${t}</p>
        </div>
      `:ye}

      <div class="entity-section">
        <div class="entities-grid">
          ${at(e,e=>e,e=>this._renderEntityCard({entity_id:e,hidden:!1}))}
        </div>
      </div>
    `:fe`
        <div class="empty-state">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.problem_empty")}
          </div>
        </div>
      `}_allDialogEntities(){return Object.values(this._groupedEntities).flatMap(e=>e.entities)}_renderDomainActions(e){const t=this._params?.domain||"",i=e.map(e=>e.entity_id).filter(e=>this.hass.states[e]);if(!i.length)return ye;const a=this._entityColor(t),o=(e,t,o)=>fe`
      <button
        class="domain-action-button"
        type="button"
        style=${`--domain-color: ${a};`}
        @click=${()=>this._runBulkDomainAction(i,o,e)}
      >
        <ha-icon icon=${t}></ha-icon>
        <span>${e}</span>
      </button>
    `;return["light","switch","fan","input_boolean"].includes(t)?fe`
        <div class="domain-actions">
          ${o(this._t("action.turn_on_all"),"mdi:power","turn_on")}
          ${o(this._t("action.turn_off_all"),"mdi:power-off","turn_off")}
        </div>
      `:"cover"===t?fe`
        <div class="domain-actions">
          ${o(this._t("action.open_all"),"mdi:arrow-up","open_cover")}
          ${o(this._t("action.close_all"),"mdi:arrow-down","close_cover")}
        </div>
      `:"lock"===t?fe`
        <div class="domain-actions">
          ${o(this._t("action.unlock_all"),"mdi:lock-open-variant-outline","unlock")}
          ${o(this._t("action.lock_all"),"mdi:lock-outline","lock")}
        </div>
      `:ye}_renderAreaSection(e,t){let i="";if(this._params?.config?.areas){const t=this._params.config.areas.find(t=>t.area_id===e);t?.icon&&(i=t.icon)}return"person"===this._params?.domain&&(i="home"===e?"mdi:home-account":"away"===e?"mdi:account-arrow-right":"mdi:account-question"),fe`
      <div class="area-section">
        <div class="area-header">
          ${i?fe`
            <div class="area-icon">
              <ha-icon icon="${i}"></ha-icon>
            </div>
          `:ye}
          <div class="area-name">${t.areaName}</div>
          <div class="entity-count">${t.entities.length}</div>
        </div>
        <div class="entities-grid">
          ${at(t.entities,e=>e.entity_id,e=>this._renderEntityCard(e,t.areaName))}
        </div>
      </div>
    `}_renderEntityCard(e,t){const i=this.hass.states[e.entity_id];if(!i)return ye;const a=this._getEffectiveEntityState(i),o=e.entity_id.split(".")[0]||"unknown";if("todo"===o)return fe`
        <div class="domain-todo-list-card" data-entity=${e.entity_id}>
          <dwains-dashboard-next-card-host
            eager
            .hass=${this.hass}
            .config=${{type:"todo-list",entity:e.entity_id}}
          ></dwains-dashboard-next-card-host>
        </div>
      `;const r=a.attributes?.device_class,n=this.hass.entities?.[e.entity_id]?.icon||a.attributes?.icon||Zt(o,r)||Kt(o),s=a.attributes?.friendly_name||this.hass.entities?.[e.entity_id]?.name||e.entity_id,c=this._isEntityActiveForUi(a,o),d=["domain-entity-card",`domain-entity-${o}`,c?"is-active":"is-off",this._isUnavailable(a)?"is-unavailable":""].join(" ");return fe`
      <article
        class=${d}
        style=${`--entity-color: ${this._entityColor(o,r)};`}
        role="button"
        tabindex="0"
        aria-label=${s}
        @click=${()=>this._showMoreInfo(e.entity_id)}
        @keydown=${t=>this._handleEntityKeydown(t,e.entity_id)}
      >
        <div class="domain-entity-top">
          <div class="domain-entity-icon">
            <ha-icon icon=${n}></ha-icon>
          </div>
          ${this._renderEntityActions(a,o,c)}
        </div>
        <div class="domain-entity-copy">
          <div class="domain-entity-meta">${t||this._entityAreaName(e)||this._t("dialog.no_area")}</div>
          <div class="domain-entity-name">${s}</div>
          <div class="domain-entity-status">${this._entityStatusText(a,o)}</div>
        </div>
      </article>
    `}_renderEntityActions(e,t,i){const a=e?.entity_id,o=this._entityActionKind(t),r=this._isUnavailable(e);if("toggle"===o)return fe`
        <button
          class="domain-entity-action domain-entity-toggle"
          type="button"
          title=${i?this._t("action.turn_off"):this._t("action.turn_on")}
          aria-label=${i?this._t("action.turn_off"):this._t("action.turn_on")}
          ?disabled=${r}
          @click=${i=>this._handleEntityToggle(i,e,t)}
        ></button>
      `;if("cover"===o)return this._renderCoverActions(e);if("lock"===o){const i=this._isEntityActiveForUi(e,t);return fe`
        <button
          class="domain-entity-action domain-lock-action ${i?"is-unlocked":""}"
          type="button"
          title=${i?this._t("action.lock"):this._t("action.unlock")}
          aria-label=${i?this._t("action.lock"):this._t("action.unlock")}
          ?disabled=${r}
          @click=${t=>this._handleLockAction(t,e)}
        >
          <ha-icon icon=${i?"mdi:lock-open-variant-outline":"mdi:lock-outline"}></ha-icon>
        </button>
      `}return fe`
      <button
        class="domain-entity-action domain-entity-more"
        type="button"
        title=${this._t("action.more_info")}
        aria-label=${this._t("action.more_info")}
        @click=${e=>this._handleMoreInfo(e,a)}
      >
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `}_renderCoverActions(e){const t=String(e?.state||"").toLowerCase(),i=this._isUnavailable(e),a=this._coverSupportsFeature(e,1),o=this._coverSupportsFeature(e,2),r=this._coverSupportsFeature(e,8);return fe`
      <div class="domain-cover-actions" @click=${e=>e.stopPropagation()}>
        ${a?fe`
          <button
            class="domain-entity-action domain-cover-action ${"opening"===t?"active":""}"
            type="button"
            title=${this._t("action.open")}
            aria-label=${this._t("action.open")}
            ?disabled=${i}
            @click=${t=>this._handleCoverAction(t,e,"open")}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        `:ye}
        ${r?fe`
          <button
            class="domain-entity-action domain-cover-action ${"opening"===t||"closing"===t?"active":""}"
            type="button"
            title=${this._t("action.stop")}
            aria-label=${this._t("action.stop")}
            ?disabled=${i}
            @click=${t=>this._handleCoverAction(t,e,"stop")}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        `:ye}
        ${o?fe`
          <button
            class="domain-entity-action domain-cover-action ${"closing"===t?"active":""}"
            type="button"
            title=${this._t("action.close")}
            aria-label=${this._t("action.close")}
            ?disabled=${i}
            @click=${t=>this._handleCoverAction(t,e,"close")}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        `:ye}
      </div>
    `}async _runBulkDomainAction(e,t,i){const a=this._params?.domain||"",o=e.length;if(!window.confirm(this._t("action.confirm_bulk",{action:i,entities:this._tp("common.entity",o)})))return;const r="turn_on"===t?"on":"turn_off"===t?"off":"open_cover"===t?"open":"close_cover"===t?"closed":"unlock"===t?"unlocked":"lock"===t?"locked":void 0;r&&this._setOptimisticEntityStates(e,r);try{if(["light","switch","fan","input_boolean"].includes(a))return void await this.hass.callService(a,t,{entity_id:e});if("cover"===a)return void await this.hass.callService("cover",t,{entity_id:e});"lock"===a&&await this.hass.callService("lock",t,{entity_id:e})}catch(i){this._clearOptimisticEntityStates(e),console.warn(`Failed to run ${t} for ${a}:`,i)}}_handleEntityKeydown(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showMoreInfo(t))}async _handleEntityToggle(e,t,i){e.stopPropagation();const a=t?.entity_id;if(a){try{if(["light","switch","fan","input_boolean"].includes(i)){const e=!this._isEntityActiveForUi(t,i);return this._setOptimisticEntityStates([a],e?"on":"off"),void await this.hass.callService(i,e?"turn_on":"turn_off",{entity_id:a})}}catch(e){return this._clearOptimisticEntityStates([a]),void console.warn(`Failed to toggle entity ${a}:`,e)}this._showMoreInfo(a)}}async _handleCoverAction(e,t,i){e.stopPropagation();const a=t?.entity_id;if(!a)return;const o="open"===i?"open_cover":"close"===i?"close_cover":"stop_cover",r="open"===i?"open":"close"===i?"closed":void 0;r&&this._setOptimisticEntityStates([a],r);try{await this.hass.callService("cover",o,{entity_id:a})}catch(e){this._clearOptimisticEntityStates([a]),console.warn(`Failed to ${i} cover ${a}:`,e)}}async _handleLockAction(e,t){e.stopPropagation();const i=t?.entity_id;if(i)try{const e=this._isEntityActiveForUi(t,"lock");this._setOptimisticEntityStates([i],e?"locked":"unlocked"),await this.hass.callService("lock",e?"lock":"unlock",{entity_id:i})}catch(e){this._clearOptimisticEntityStates([i]),console.warn(`Failed to toggle lock ${i}:`,e)}}_handleMoreInfo(e,t){e.stopPropagation(),t&&this._showMoreInfo(t)}_showMoreInfo(e){const t=document.querySelector("home-assistant");Fi(t||window,"hass-more-info",{entityId:e})}_entityActionKind(e){return["light","switch","fan","input_boolean"].includes(e)?"toggle":"cover"===e?"cover":"lock"===e?"lock":"more"}_coverSupportsFeature(e,t){const i=Number(e?.attributes?.supported_features);return!Number.isFinite(i)||i<=0?1===t||2===t:0!==(i&t)}_entityStatusText(e,t){if(!e)return"";const i=this._getEffectiveEntityState(e),a=this.hass.formatEntityState(i);if("light"===t&&"on"===i.state&&"number"==typeof i.attributes?.brightness)return this._t("entity.brightness",{value:Math.round(i.attributes.brightness/255*100)});if("cover"===t&&"number"==typeof i.attributes?.current_position)return`${a} · ${i.attributes.current_position}%`;if("climate"===t){const e=i.attributes?.current_temperature,t=i.attributes?.temperature,a=this.hass?.config?.unit_system?.temperature||"°C";if(void 0!==e&&void 0!==t)return`${e}${a} · ${this._t("entity.climate_set",{value:`${t}${a}`})}`;if(void 0!==e)return`${e}${a}`}return"media_player"===t&&i.attributes?.media_title?`${a} · ${i.attributes.media_title}`:a}_getEffectiveEntityState(e){const t=e?.entity_id;if(!t)return e;const i=this._optimisticEntityStates[t];if(!i||i.expiresAt<=Date.now())return e;return String(e?.state||"").toLowerCase()===i.state.toLowerCase()?e:{...e,state:i.state}}_setOptimisticEntityStates(e,t){const i=[...new Set(e.filter(Boolean))];if(!i.length)return;const a=Date.now()+5e3,o={...this._optimisticEntityStates};i.forEach(e=>{o[e]={state:t,expiresAt:a}}),this._optimisticEntityStates=o,this._scheduleOptimisticCleanup()}_clearOptimisticEntityStates(e){const t=[...new Set(e.filter(Boolean))];if(!t.length)return;const i={...this._optimisticEntityStates};let a=!1;t.forEach(e=>{i[e]&&(delete i[e],a=!0)}),a&&(this._optimisticEntityStates=i)}_reconcileOptimisticEntityStates(){const e=Object.entries(this._optimisticEntityStates);if(!e.length)return;const t=Date.now(),i={...this._optimisticEntityStates};let a=!1;e.forEach(([e,o])=>{const r=this.hass?.states?.[e]?.state;(!r||o.expiresAt<=t||String(r).toLowerCase()===o.state.toLowerCase())&&(delete i[e],a=!0)}),a&&(this._optimisticEntityStates=i)}_scheduleOptimisticCleanup(){if(void 0!==this._optimisticCleanupTimer)return;const e=Object.values(this._optimisticEntityStates).map(e=>e.expiresAt);if(!e.length)return;const t=Math.min(...e);if(!Number.isFinite(t))return;const i=Math.max(80,t-Date.now()+50);this._optimisticCleanupTimer=window.setTimeout(()=>{this._optimisticCleanupTimer=void 0,this._reconcileOptimisticEntityStates(),Object.keys(this._optimisticEntityStates).length&&this._scheduleOptimisticCleanup()},i)}_isUnavailable(e){return["unavailable","unknown"].includes(String(e?.state||"").toLowerCase())}_isEntityActiveForUi(e,t){if(!e||this._isUnavailable(e))return!1;const i=String(e.state).toLowerCase();if("cover"===t)return["open","opening"].includes(i);if("lock"===t)return"unlocked"===i;if("climate"===t){const t=e.attributes?.hvac_action;return t&&"idle"!==t&&"off"!==t}return"media_player"===t?["playing","buffering"].includes(i):"vacuum"===t?["cleaning","returning"].includes(i):"alarm_control_panel"===t?i.startsWith("armed")||["arming","pending","triggered"].includes(i):"camera"!==t&&!["off","closed","locked","not_home","idle"].includes(i)}_entityColor(e,t){return Yt(e,t)}_entityAreaName(e){const t=this._params?.config,i=t?.entities?.find(t=>t.entity_id===e.entity_id),a=i?.device_id?t?.devices?.find(e=>e.device_id===i.device_id):void 0,o=e.area_id||i?.area_id||a?.area_id||this.hass?.entities?.[e.entity_id]?.area_id;return t?.areas?.find(e=>e.area_id===o)?.name}_getLocalizedDomainTitle(e){return kt(this.hass,e)}};Ka.styles=j`
    :host {
      --mdc-dialog-min-width: 90vw;
      --mdc-dialog-max-width: 1200px;
      --mdc-dialog-max-height: 90vh;
      --mdc-dialog-z-index: 10;
      --dialog-backdrop-opacity: 0.4;
      -webkit-tap-highlight-color: transparent;
    }

    ha-dialog {
      --mdc-dialog-heading-ink-color: var(--primary-text-color);
      --mdc-dialog-content-ink-color: var(--primary-text-color);
      --dialog-content-padding: 0;
      --ha-dialog-scrim-backdrop-filter: brightness(72%) blur(2px);
      --mdc-dialog-scrim-color: rgba(0, 0, 0, 0.28);
    }

    ha-dialog-header {
      --mdc-typography-headline6-font-size: 20px;
      --mdc-typography-headline6-font-weight: 500;
    }

    .sheet-handle {
      display: none;
    }

    .content {
      padding: 16px 18px 22px !important;
      overflow: auto;
      max-height: calc(90vh - 120px);
      background: var(--primary-background-color);
    }

    .area-section {
      margin-bottom: 18px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      border-radius: 16px;
      overflow: hidden;
      box-shadow:
        0 14px 34px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .area-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 0;
      background: transparent;
      border-bottom: 0;
    }

    .area-header:has(.area-icon) {
      gap: 12px;
    }

    .area-header:not(:has(.area-icon)) {
      gap: 0;
    }

    .area-icon {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .area-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .area-name {
      font-size: 18px;
      font-weight: 850;
      flex: 1;
    }

    .entity-count {
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 750;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(164px, 1fr));
      gap: 12px;
      padding: 16px;
    }

    .domain-todo-list-card {
      grid-column: 1 / -1;
      min-width: 0;
    }

    .domain-todo-list-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .domain-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin: 0 0 16px;
    }

    .domain-action-button {
      min-height: 40px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      font: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.07),
        inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .domain-action-button:hover {
      transform: translateY(-1px);
      box-shadow:
        0 14px 26px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px rgba(15, 23, 42, 0.07);
    }

    .domain-action-button:active {
      transform: scale(0.97);
    }

    .domain-action-button ha-icon {
      --mdc-icon-size: 18px;
      color: var(--domain-color, var(--primary-color));
    }

    .dialog-view-all {
      min-height: 40px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      font: inherit;
      font-size: 13px;
      font-weight: 850;
      cursor: pointer;
      transition: transform 0.18s ease, background 0.18s ease;
    }

    .dialog-view-all:hover {
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      transform: translateY(-1px);
    }

    .dialog-view-all:active {
      transform: scale(0.97);
    }

    .dialog-view-all ha-icon {
      --mdc-icon-size: 18px;
    }

    .domain-entity-card {
      --entity-color: var(--primary-color);
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 132px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .domain-entity-card:active {
      transform: scale(0.985);
    }

    .domain-entity-card.is-active {
      box-shadow:
        0 14px 30px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 18%, transparent);
    }

    .domain-entity-card.is-unavailable {
      opacity: 0.62;
    }

    .domain-entity-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .domain-entity-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 11px;
      color: var(--entity-color);
      background: color-mix(in srgb, var(--entity-color) 13%, transparent);
    }

    .domain-entity-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .domain-entity-action {
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease,
        opacity 0.18s ease;
    }

    .domain-entity-action:active {
      transform: scale(0.94);
    }

    .domain-entity-action:disabled {
      opacity: 0.36;
      cursor: not-allowed;
    }

    .domain-entity-toggle {
      width: 38px;
      height: 22px;
      justify-content: flex-start;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
    }

    .domain-entity-toggle::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition: transform 0.18s ease;
    }

    .domain-entity-card.is-active .domain-entity-toggle {
      background: var(--entity-color);
    }

    .domain-entity-card.is-active .domain-entity-toggle::before {
      transform: translateX(16px);
    }

    .domain-entity-more,
    .domain-lock-action {
      width: 30px;
      height: 30px;
      border-radius: 999px;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .domain-lock-action.is-unlocked {
      color: #ffffff;
      background: var(--entity-color);
      box-shadow: 0 8px 16px color-mix(in srgb, var(--entity-color) 24%, transparent);
    }

    .domain-entity-more ha-icon,
    .domain-lock-action ha-icon {
      --mdc-icon-size: 17px;
    }

    .domain-cover-actions {
      min-height: 32px;
      padding: 3px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.055),
        0 6px 14px rgba(15, 23, 42, 0.08);
    }

    .domain-cover-action {
      width: 26px;
      height: 26px;
      border-radius: 999px;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      background: transparent;
    }

    .domain-cover-action.active {
      color: #ffffff;
      background: var(--entity-color);
      box-shadow: 0 6px 12px color-mix(in srgb, var(--entity-color) 22%, transparent);
    }

    .domain-cover-action ha-icon {
      --mdc-icon-size: 16px;
    }

    .domain-entity-copy {
      min-width: 0;
    }

    .domain-entity-meta {
      margin-bottom: 3px;
      color: color-mix(in srgb, var(--secondary-text-color) 78%, transparent);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .domain-entity-name {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.05;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .domain-entity-status {
      margin-top: 5px;
      color: color-mix(in srgb, var(--secondary-text-color) 84%, transparent);
      font-size: 12px;
      font-weight: 760;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      font-size: 16px;
      opacity: 0.6;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-state ha-icon {
      --mdc-icon-size: 64px;
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .empty-state-text {
      font-size: 16px;
      opacity: 0.6;
    }

    .custom-description {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--warning-color);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .custom-description ha-icon {
      --mdc-icon-size: 20px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .custom-description p {
      margin: 0;
      line-height: 1.5;
      font-size: 14px;
    }

    /* Responsive design */
    @media (max-width: 600px) {
      :host {
        --mdc-dialog-min-width: min(calc(100vw - 4px), 480px);
        --mdc-dialog-max-width: min(calc(100vw - 4px), 480px);
        --mdc-dialog-min-height: calc(100dvh - 54px);
        --mdc-dialog-max-height: calc(100dvh - 54px);
        --ha-dialog-min-height: calc(100dvh - 54px);
        --ha-dialog-max-height: calc(100dvh - 54px);
        --vertical-align-dialog: flex-end;
        --dialog-surface-margin-top: 54px;
        --dialog-container-padding: 0;
        --ha-dialog-scrim-backdrop-filter: brightness(66%) blur(2px);
        --mdc-dialog-scrim-color: rgba(0, 0, 0, 0.34);
      }

      ha-dialog {
        margin: 0 !important;
        border-radius: 24px 24px 0 0 !important;
        --mdc-dialog-container-elevation: 0 18px 50px rgba(15, 23, 42, 0.28);
        --ha-dialog-border-radius: 24px 24px 0 0;
        --ha-dialog-show-duration: 1ms;
        --show-duration: 1ms;
        --ha-dialog-hide-duration: 160ms;
        --hide-duration: 160ms;
      }

      ha-dialog .mdc-dialog__surface {
        border-radius: 24px 24px 0 0 !important;
        overflow: hidden;
      }

      ha-dialog-header {
        position: relative;
        padding-top: 22px;
      }

      .sheet-handle {
        display: block;
        position: absolute;
        top: 8px;
        left: 50%;
        width: 38px;
        height: 4px;
        border-radius: 999px;
        transform: translateX(-50%);
        background: color-mix(in srgb, var(--secondary-text-color) 24%, transparent);
      }

      .content {
        max-height: calc(100dvh - 148px);
        padding: 12px 12px calc(84px + env(safe-area-inset-bottom, 0px)) !important;
      }

      .area-section {
        margin-bottom: 16px;
        border-radius: 14px;
      }

      .entities-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 12px;
      }

      .domain-entity-card {
        min-height: 126px;
      }
    }
  `,y([Be({attribute:!1})],Ka.prototype,"hass",void 0),y([Fe()],Ka.prototype,"_params",void 0),y([Fe()],Ka.prototype,"_groupedEntities",void 0),y([Fe()],Ka.prototype,"_loading",void 0),y([Fe()],Ka.prototype,"_optimisticEntityStates",void 0),Ka=y([Oe("dwains-dashboard-next-domain-entities-dialog")],Ka);var Ya=Object.freeze({__proto__:null,get DwainsDomainEntitiesDialog(){return Ka}});const Za=()=>Promise.resolve().then(function(){return bo}),Xa=(e,t)=>{Fi(e,"show-dialog",{dialogTag:"dwains-dashboard-next-blueprint-dialog",dialogImport:Za,dialogParams:t})};let Qa=class extends Te{constructor(){super(...arguments),this._add=!1,this._t=(e,t)=>o(this._hass,e,t),this._addBlueprint=()=>{this._canManageDashboard()&&Xa(this,{onSave:async e=>{const t=await this._mutatePages(t=>[...t.filter(t=>t.id!==e.id),e]);t&&this._go(e.id)}})},this._editPage=()=>{if(!this._canManageDashboard())return;if(!this._page)return;const e=this._page;Xa(this,{page:e,onSave:async t=>{const i=await this._mutatePages(e=>e.map(e=>e.id===t.id?t:e));i&&(t.id===e.id?window.location.reload():this._go(t.id))}})},this._deletePage=async()=>{if(!this._canManageDashboard())return;if(!this._page)return;const e=this._page;if(!confirm(this._t("layout.delete_page_confirm",{name:e.name})))return;const t=await this._mutatePages(t=>t.filter(t=>t.id!==e.id));t&&this._go("home")}}set hass(e){this._hass=e,na(e,this._settings);const t=this.renderRoot?.querySelector("dwains-dashboard-next-card-host");t&&(t.hass=e)}get hass(){return this._hass}setConfig(e){this._add=!!e?.add,this._page=e?.page,this._settings=e?.settings||{},this._hass&&na(this._hass,this._settings)}getCardSize(){return 10}_canManageDashboard(){return!d(this._hass,this._settings)}_dashSegment(){const e=window.location.pathname.split("/")[1];return e&&"lovelace"!==e?e:void 0}_go(e){const t=this._dashSegment();window.location.href=`/${t||"lovelace"}/${e}`}async _mutatePages(e){if(!this._canManageDashboard())return!1;try{const t=this._dashSegment(),i=t?{url_path:t}:{},a=await this._hass.callWS({type:"lovelace/config",...i});if(!a||!a.strategy)return console.warn("⚠️ Geen strategy in lovelace config — opslaan overgeslagen",a),!1;const o=e([...a.strategy.pages||[]]),r={...a,strategy:{...a.strategy,pages:o}};return await this._hass.callWS({type:"lovelace/config/save",...i,config:r}),!0}catch(e){return console.error("❌ Opslaan pagina mislukt:",e),alert(this._t("layout.save_page_failed",{error:String(e)})),!1}}render(){return this._add?this._renderAdd():this._page?this._renderPage():ye}_renderAdd(){return this._canManageDashboard()?fe`
      <div class="add-wrap">
        <ha-card>
          <div class="add-inner">
            <ha-icon icon="mdi:puzzle-plus-outline"></ha-icon>
            <div class="add-title">${this._t("page.add_title")}</div>
            <div class="add-desc">${this._t("page.add_desc")}</div>
            <ha-button appearance="accent" @click=${this._addBlueprint}>
              ${this._t("sidebar.add_blueprint")}
            </ha-button>
          </div>
        </ha-card>
      </div>
    `:ye}_renderPage(){const e=this._page;return fe`
      <div class="page-wrap">
        <div class="page-toolbar">
          <div class="page-title">
            <ha-icon icon=${e.icon||"mdi:puzzle"}></ha-icon>
            <span>${e.name}</span>
          </div>
          <div class="page-actions">
            ${this._canManageDashboard()?fe`
              <button title=${this._t("common.edit")} @click=${this._editPage}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>
              <button class="danger" title=${this._t("common.delete")} @click=${this._deletePage}>
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            `:ye}
          </div>
        </div>
        <dwains-dashboard-next-card-host .hass=${this._hass} .config=${e.card}></dwains-dashboard-next-card-host>
      </div>
    `}};Qa.styles=j`
    :host {
      display: block;
    }
    .page-wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 8px 12px 24px;
    }
    .page-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .page-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
    }
    .page-title ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color);
    }
    .page-actions {
      margin-left: auto;
      display: flex;
      gap: 6px;
    }
    .page-actions button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .page-actions button:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
    }
    .page-actions button.danger:hover {
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.16);
      color: var(--error-color, #f44336);
    }
    .page-actions ha-icon {
      --mdc-icon-size: 20px;
    }
    dwains-dashboard-next-card-host {
      display: block;
    }
    .add-wrap {
      max-width: 520px;
      margin: 40px auto;
      padding: 0 16px;
    }
    .add-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      padding: 32px 24px;
    }
    .add-inner ha-icon {
      --mdc-icon-size: 48px;
      color: var(--primary-color);
    }
    .add-title {
      font-size: 20px;
      font-weight: 600;
    }
    .add-desc {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .page-wrap {
        padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
      }
    }
  `,y([Fe()],Qa.prototype,"_page",void 0),y([Fe()],Qa.prototype,"_add",void 0),Qa=y([Oe("dwains-dashboard-next-page-card")],Qa);var Ja=Object.freeze({__proto__:null,get DwainsPageCard(){return Qa}});const eo="__new_devices__",to="__maintenance__",io="__maintenance_no_area__",ao="energy",oo="__overview__",ro="person",no="__people__";let so=class extends Te{constructor(){super(...arguments),this._selectedDomain=null,this._isMobile=!1,this._mobileNavOpen=!1,this._pendingDomainSelection=null,this._resizeHandler=()=>this._checkMobile(),this._locationHandler=()=>this._handleLocationChanged(),this._t=(e,t)=>o(this._hass,e,t),this._tp=(e,t,i)=>r(this._hass,e,t,i),this._handleSelectDeviceDomain=e=>{const t=e.detail?.domain;t&&(this._pendingDomainSelection=t,this._applyPendingDomainSelection(),this.requestUpdate())},this._toggleMobileNav=()=>{this._mobileNavOpen=!this._mobileNavOpen},this._handleDevicesNavToggle=e=>{this._isMobile&&(e?.detail?.open?this._mobileNavOpen=!0:this._toggleMobileNav())},this._closeMobileNav=()=>{this._mobileNavOpen=!1}}set hass(e){this._hass=e,this._syncThemeAttribute(),na(e,this.config?.settings),this._syncBottomNavDeviceContext();const t=this.renderRoot?.querySelectorAll("dwains-dashboard-next-card-host");t&&t.forEach(t=>t.hass=e)}get hass(){return this._hass}setConfig(e){if(!e)throw new Error(o(this._hass,"devices.invalid_configuration"));this.config={areas:e.areas,devices:e.devices,entities:e.entities,floors:e.floors,areas_display:e.areas_display,areas_options:e.areas_options,settings:e.settings,blueprint_replacements:e.blueprint_replacements,device_admission:e.device_admission},this._hass&&na(this._hass,this.config.settings);const t=this._getUrlDomain();if(t&&(this._pendingDomainSelection=t),!this._selectedDomain){const e=this._buildData(),i=this._buildMaintenanceData(),a=this._maintenanceSummary(i).totalCount>0,o=this._showEnergyMenu();t===eo?this._selectedDomain=eo:t===to&&a?this._selectedDomain=to:t===ao&&o?this._selectedDomain=ao:t&&e.has(t)?this._selectedDomain=t:this._selectedDomain=oo,this._syncBottomNavDeviceContext()}}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),this._syncThemeAttribute(),this._checkMobile(),window.addEventListener("resize",this._resizeHandler),window.addEventListener("dwains-dashboard-next-toggle-devices-nav",this._handleDevicesNavToggle),window.addEventListener("dwains-dashboard-next-select-device-domain",this._handleSelectDeviceDomain),window.addEventListener("location-changed",this._locationHandler),window.addEventListener("popstate",this._locationHandler),this._handleLocationChanged(),this._syncBottomNavDeviceContext()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this._resizeHandler),window.removeEventListener("dwains-dashboard-next-toggle-devices-nav",this._handleDevicesNavToggle),window.removeEventListener("dwains-dashboard-next-select-device-domain",this._handleSelectDeviceDomain),window.removeEventListener("location-changed",this._locationHandler),window.removeEventListener("popstate",this._locationHandler)}_checkMobile(){const e=this._isMobile;this._isMobile=window.innerWidth<=768,e!==this._isMobile&&(this._mobileNavOpen=!1)}_getUrlDomain(){try{return new URL(window.location.href).searchParams.get("dd_device")}catch{return null}}_updateUrlDomain(e){try{const t=new URL(window.location.href);e?t.searchParams.set("dd_device",e):t.searchParams.delete("dd_device"),window.history.replaceState(window.history.state,"",t.toString())}catch{}}_handleLocationChanged(){const e=this._getUrlDomain();e&&(this._pendingDomainSelection=e,this._applyPendingDomainSelection(),this.requestUpdate())}_getAreaEntities(e){const t=[],i=new Set;if(this.config?.entities){const a=new Set;this.config.devices&&this.config.devices.forEach(t=>{t.area_id===e&&a.add(t.device_id)}),this.config.entities.forEach(o=>{if(o.area_id===e||o.device_id&&a.has(o.device_id)){const e=this._hass.entities?.[o.entity_id];if(e?.hidden_by||"diagnostic"===e?.entity_category||"config"===e?.entity_category)return;t.push(o),i.add(o.entity_id)}})}return Object.values(this._hass.states).forEach(a=>{if(!i.has(a.entity_id)&&a.attributes?.area_id===e){const i=this._hass.entities?.[a.entity_id];if(i?.hidden_by||"diagnostic"===i?.entity_category||"config"===i?.entity_category)return;t.push({entity_id:a.entity_id,area_id:e,hidden:!1})}}),t}_getFilteredAreaEntities(e){let t=this._getAreaEntities(e);if(t=t.filter(e=>{const t=this._hass.entities?.[e.entity_id];return!(t?.hidden_by||"diagnostic"===t?.entity_category||"config"===t?.entity_category)}),this.config?.areas_options){const i=this.config.areas_options[e];if(i?.groups_options){const e=new Set;for(const t of Object.values(i.groups_options))t.hidden&&t.hidden.forEach(t=>e.add(t));t=t.filter(t=>!e.has(t.entity_id))}}return!1!==this.config?.settings?.hide_unavailable_entities_on_devices&&(t=t.filter(e=>{const t=this._hass.states[e.entity_id];return t&&"unavailable"!==t.state&&"unknown"!==t.state})),t=wi(this._hass,this.config,t),t}_getVisibleSortedAreas(){return this.config?.areas?Ot(this.config.areas,this.config.areas_display,a(this._hass)):[]}_buildData(){const e=new Map;if(!this._hass)return e;const t=this._getVisibleSortedAreas();for(const i of t){const t=this._getFilteredAreaEntities(i.area_id);for(const a of t){const t=this._typeKeyFor(a.entity_id);if(!t)continue;let o=e.get(t);o||(o=new Map,e.set(t,o));let r=o.get(i.area_id);r||(r={area:i,entities:[]},o.set(i.area_id,r)),r.entities.push(a)}}return this._addPersonData(e),this._hiddenDeviceTypes().forEach(t=>e.delete(t)),e}_buildMaintenanceData(){const e=new Map;if(!this._hass||!this.config)return e;const t=vi(this.config);return Object.values(this._hass.states).forEach(i=>{const a=i?.entity_id;if(!a)return;const o=this._hass.entities?.[a];if(o?.hidden_by)return;const r=this._deviceIdForEntity(a,o);if(r&&t.has(r))return;const n=this._maintenanceKind(a,i);if(!n)return;const s=this._maintenanceAreaForEntity(a,i,o);if(!s)return;let c=e.get(s.area_id);c||(c={area:s,items:[]},e.set(s.area_id,c)),c.items.push({entityId:a,deviceId:r,areaId:s.area_id,name:i.attributes?.friendly_name||o?.name||a,stateLabel:this._formatMaintenanceState(i,n),icon:this._maintenanceIcon(a,i,n),kind:n})}),e.forEach(e=>{e.items.sort((e,t)=>e.kind!==t.kind?"unavailable"===e.kind?-1:1:e.name.localeCompare(t.name))}),e}_maintenanceSummary(e){let t=0;const i=new Set;let a=0;e.forEach(e=>{e.items.forEach(e=>{"battery"!==e.kind?e.deviceId?i.add(e.deviceId):a+=1:t+=1})});const o=i.size+a;return{lowBatteryCount:t,unavailableDeviceCount:o,totalCount:t+o}}_maintenanceSubtitle(e){const t=this._maintenanceSummary(e),i=[];return t.lowBatteryCount&&i.push(this._tp("devices.low_battery",t.lowBatteryCount)),t.unavailableDeviceCount&&i.push(this._tp("devices.unavailable_device",t.unavailableDeviceCount)),i.length?i.join(", "):this._t("devices.all_good")}_showEnergyMenu(){return!0}_energySummary(){return Ei(this._hass,this.config)}_maintenanceKind(e,t){return"unavailable"===t.state?"unavailable":this._isLowBatteryEntity(e,t)?"battery":void 0}_isLowBatteryEntity(e,t){const i=e.split(".")[0],a=t.attributes?.device_class;if("battery"!==a)return!1;if("binary_sensor"===i)return"on"===t.state;const o=Number(t.state);return Number.isFinite(o)&&o<=20}_deviceIdForEntity(e,t){return t?.device_id||this.config?.entities?.find(t=>t.entity_id===e)?.device_id}_maintenanceAreaForEntity(e,t,i){const a=this.config?.entities?.find(t=>t.entity_id===e),o=this._deviceIdForEntity(e,i),r=o?this.config?.devices?.find(e=>e.device_id===o):void 0,n=o?this._hass?.devices?.[o]:void 0,s=i?.area_id||a?.area_id||t.attributes?.area_id||r?.area_id||n?.area_id;if(!s||(this.config?.areas_display?.hidden||[]).includes(s))return;const c=s?this.config?.areas?.find(e=>e.area_id===s):void 0;return c||void 0}_maintenanceIcon(e,t,i){if("battery"===i)return"mdi:battery-alert";const a=e.split(".")[0]||"";return t.attributes?.icon||Kt(a)||"mdi:help-box"}_formatMaintenanceState(e,t){if("unavailable"===t)return"unknown"===e.state?this._t("common.unknown"):this._t("common.unavailable");const i=e.attributes?.unit_of_measurement||"%";return`${e.state}${i}`}_addPersonData(e){const t=this._getVisiblePersonEntities();if(!t.length)return;let i=e.get(ro);i||(i=new Map,e.set(ro,i));const a=new Set;i.forEach(e=>e.entities.forEach(e=>a.add(e.entity_id)));const o=i.get(no)??{area:{area_id:no,name:kt(this._hass,ro),icon:"mdi:account-group"},entities:[]};o.entities=[...o.entities,...t.filter(e=>!a.has(e.entity_id))],o.entities.length&&i.set(no,o)}_getVisiblePersonEntities(){if(!this._hass||!this.config)return[];const e=new Set(this.config.settings?.hidden_persons||[]);return Object.values(this._hass.states).filter(t=>!!t.entity_id?.startsWith(`${ro}.`)&&(!e.has(t.entity_id)&&!this._hass.entities?.[t.entity_id]?.hidden_by)).sort((e,t)=>{const i=e.attributes?.friendly_name||e.entity_id,a=t.attributes?.friendly_name||t.entity_id;return String(i).localeCompare(String(a))}).map(e=>({entity_id:e.entity_id,area_id:no,hidden:!1}))}_typeKeyFor(e){const t=e.split(".")[0];if(t){if("binary_sensor"===t){const t=this._hass?.states?.[e]?.attributes?.device_class;return t?`binary_sensor.${t}`:"binary_sensor"}return t}}_hiddenDeviceTypes(){return new Set((this.config?.settings?.hidden_device_types||[]).filter(e=>"string"==typeof e&&e.length>0))}_typeName(e){return e===to?this._t("devices.maintenance"):e===ao?this._t("devices.energy"):e===oo?this._t("navigation.overview"):e.startsWith("binary_sensor.")?$t(this._hass,e.slice(14)):kt(this._hass,e)}_typeIcon(e){return e===to?"mdi:wrench":e===ao?"mdi:flash":e===oo?"mdi:view-grid-outline":e===ro?"mdi:account-group":e.startsWith("binary_sensor.")?Zt("binary_sensor",e.slice(14)):Kt(e)}_typeColor(e){return e===to?"var(--warning-color, #ff9800)":e===ao?"#d88e20":e===oo?"var(--primary-color)":e.startsWith("binary_sensor.")?Yt("binary_sensor",e.slice(14)):Yt(e)}_syncBottomNavDeviceContext(){const e=this._selectedDomain;window.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-context-changed",{detail:{domain:e,icon:e===eo?"mdi:new-box":e===to?"mdi:wrench":e===ao?"mdi:flash":e!==oo&&e&&e?this._typeIcon(e):"mdi:format-list-bulleted-type",label:e===eo?this._t("devices.new"):e===to?this._t("devices.maintenance"):e===ao?this._t("devices.energy"):e!==oo&&e&&e?this._typeName(e):this._t("devices.title")}}))}updated(e){e.has("_hass")&&this._syncThemeAttribute(),e.has("_selectedDomain")&&this._syncBottomNavDeviceContext()}_syncThemeAttribute(){this.toggleAttribute("data-theme-dark",Bi(this._hass,this))}_sortedDomains(e){return[...e.keys()].sort((e,t)=>this._typeName(e).localeCompare(this._typeName(t)))}_domainCount(e){let t=0;return e.forEach(e=>t+=e.entities.length),t}_applyPendingDomainSelection(e,t,i,a){if(!this._hass||!this.config)return!1;const o=this._pendingDomainSelection||this._getUrlDomain();if(!o)return!1;const r=e??this._buildData(),n=t??(ki(this.config)&&this._newDevices().length>0),s=i??this._maintenanceSummary(this._buildMaintenanceData()).totalCount>0,c=a??this._showEnergyMenu();if(o===oo);else if(o===eo){if(!n)return!1}else if(o===to){if(!s)return!1}else if(o===ao){if(!c)return!1}else if(!r.has(o))return!1;return this._pendingDomainSelection=null,this._selectedDomain!==o&&(this._selectedDomain=o,this._syncBottomNavDeviceContext()),!0}_entityCardConfig(e){return e.startsWith("todo.")?{type:"todo-list",entity:e}:Bt({hass:this._hass,config:this.config,entity:e,surface:"devices_cards"})}_selectDomain(e){this._pendingDomainSelection=null,this._selectedDomain=e,this._updateUrlDomain(e===oo?null:e),this._syncBottomNavDeviceContext(),this._closeMobileNav()}render(){if(!this._hass||!this.config)return fe`<div class="loading">${this._t("common.loading")}</div>`;const e=this._buildData(),t=this._sortedDomains(e);this._ensureDeviceTracking();const i=this._newDevices(),a=vi(this.config).size,o=ki(this.config)&&(i.length>0||a>0),r=this._buildMaintenanceData(),n=this._maintenanceSummary(r).totalCount>0,s=this._showEnergyMenu();return this._applyPendingDomainSelection(e,o,n,s),0!==t.length||o||n||s?(this._selectedDomain===oo||(this._selectedDomain===eo?o||(this._selectedDomain=oo):this._selectedDomain===to?n||(this._selectedDomain=oo):this._selectedDomain===ao?s||(this._selectedDomain=oo):this._selectedDomain&&e.has(this._selectedDomain)||(this._selectedDomain=oo)),fe`
      <div class="layout-container">
        ${this._renderMobileOverlay()}
        ${this._renderSidebar(e,t,i,o,r,n,s)}
        <div class="main-content">
          <div class="content-area">
            ${this._selectedDomain===eo?this._renderNewDevicesView(i):this._selectedDomain===to?this._renderMaintenanceView(r):this._selectedDomain===ao?this._renderEnergyView():this._selectedDomain===oo?this._renderDevicesOverview(e,t,i,o,r,n,s):this._renderDeviceView(e)}
          </div>
        </div>
      </div>
    `):fe`
        <div class="layout-container">
          ${this._renderMobileOverlay()}
          <div class="main-content">
            <div class="content-area">
              <div class="device-view">
                <div class="empty">${this._t("devices.empty")}</div>
              </div>
            </div>
          </div>
        </div>
      `}_renderMobileOverlay(){return this._isMobile?fe`
      <div
        class="mobile-nav-overlay ${this._mobileNavOpen?"open":""}"
        @click=${this._closeMobileNav}
      ></div>
    `:ye}_renderSidebar(e,t,i,a,o,r,n){const s={sidebar:!0,open:this._isMobile&&this._mobileNavOpen},c=this._energySummary();return fe`
      <nav class=${pi(s)}>
        <div class="sidebar-title">${this._t("devices.title")}</div>
        <div class="area-list">
          <button
            class="area-button overview ${this._selectedDomain===oo?"selected":""}"
            style=${`--domain-color: ${this._typeColor(oo)};`}
            @click=${()=>this._selectDomain(oo)}
          >
            <div class="area-icon">
              <ha-icon icon="mdi:view-grid-outline"></ha-icon>
            </div>
            <div class="area-info">
              <div class="area-name">${this._t("navigation.overview")}</div>
              <div class="device-menu-subtitle">${this._t("navigation.all_device_groups")}</div>
            </div>
            <span class="domain-count">${t.length}</span>
            <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
          ${a?fe`
                <button
                  class="area-button new-devices ${this._selectedDomain===eo?"selected":""}"
                  @click=${()=>this._selectDomain(eo)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:new-box"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">${this._t("devices.new")}</div>
                    <div class="device-menu-subtitle">
                      ${this._tp("devices.new",i.length)}
                    </div>
                  </div>
                  <span class="domain-count">${i.length}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `:ye}
          ${r?fe`
                <button
                  class="area-button maintenance ${this._selectedDomain===to?"selected":""}"
                  style=${`--domain-color: ${this._typeColor(to)};`}
                  @click=${()=>this._selectDomain(to)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:wrench"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">${this._t("devices.maintenance")}</div>
                    <div class="device-menu-subtitle">${this._maintenanceSubtitle(o)}</div>
                  </div>
                  <span class="domain-count">${this._maintenanceSummary(o).totalCount}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `:ye}
          ${n?fe`
                <button
                  class="area-button energy ${this._selectedDomain===ao?"selected":""}"
                  style=${`--domain-color: ${this._typeColor(ao)};`}
                  @click=${()=>this._selectDomain(ao)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:flash"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">${this._t("devices.energy")}</div>
                    <div class="device-menu-subtitle">
                      ${this._tp("devices.live_power_sensor",c.sensorCount)}
                    </div>
                  </div>
                  <span class="domain-count">${c.sensorCount}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `:ye}
          ${t.map(t=>{const i=e.get(t),a=this._domainCount(i),o=this._selectedDomain===t;return fe`
              <button
                class="area-button ${o?"selected":""}"
                style=${`--domain-color: ${this._typeColor(t)};`}
                @click=${()=>this._selectDomain(t)}
              >
                <div class="area-icon">
                  <ha-icon icon=${this._typeIcon(t)}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${this._typeName(t)}</div>
                  <div class="device-menu-subtitle">${this._tp("common.entity",a)}</div>
                </div>
                <span class="domain-count">${a}</span>
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `})}
        </div>
      </nav>
    `}_renderDevicesOverview(e,t,i,a,o,r,n){const s=this._energySummary(),c=[];if(a&&c.push({key:eo,icon:"mdi:new-box",title:this._t("devices.new"),subtitle:this._tp("devices.new",i.length),count:i.length,color:"var(--primary-color)"}),r){const e=this._maintenanceSummary(o);c.push({key:to,icon:"mdi:wrench",title:this._t("devices.maintenance"),subtitle:this._maintenanceSubtitle(o),count:e.totalCount,color:this._typeColor(to)})}return n&&c.push({key:ao,icon:"mdi:flash",title:this._t("devices.energy"),subtitle:this._tp("devices.live_power_sensor",s.sensorCount),count:s.sensorCount,color:this._typeColor(ao)}),t.forEach(t=>{const i=e.get(t);if(!i)return;const a=this._domainCount(i);c.push({key:t,icon:this._typeIcon(t),title:this._typeName(t),subtitle:this._tp("common.entity",a),count:a,color:this._typeColor(t)})}),fe`
      <div class="device-view devices-overview-view">
        ${this._renderDevicePageHeader({icon:"mdi:format-list-bulleted-type",title:this._t("devices.title"),subtitle:this._tp("devices.group",c.length),color:this._typeColor(oo)})}

        <div class="devices-overview-grid">
          ${at(c,e=>e.key,e=>fe`
              <button
                class="devices-overview-card"
                type="button"
                style=${`--domain-color: ${e.color};`}
                @click=${()=>this._selectDomain(e.key)}
              >
                <span class="overview-card-icon">
                  <ha-icon icon=${e.icon}></ha-icon>
                  <span class="overview-card-count">${e.count}</span>
                </span>
                <span class="overview-card-copy">
                  <strong>${e.title}</strong>
                  <small>${e.subtitle}</small>
                </span>
                <ha-icon class="overview-card-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `)}
        </div>
      </div>
    `}_renderDevicePageHeader(e){const t=["device-page-header"];return e.back&&t.push("has-back"),e.actions&&t.push("has-actions"),e.className&&t.push(e.className),fe`
      <div class=${t.join(" ")} style=${`--domain-color: ${e.color};`}>
        ${e.back?fe`
          <button
            class="device-header-back"
            type="button"
            title=${this._t("navigation.overview")}
            aria-label=${this._t("navigation.overview")}
            @click=${()=>this._selectDomain(oo)}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
        `:ye}
        <div class="device-header-main">
          <span class="device-header-icon">
            <ha-icon icon=${e.icon}></ha-icon>
          </span>
          <div class="device-header-copy">
            <h1 class="device-title">${e.title}</h1>
            ${e.subtitle?fe`<div class="device-subtitle">${e.subtitle}</div>`:ye}
          </div>
        </div>
        ${e.actions?fe`<div class="device-header-actions">${e.actions}</div>`:ye}
      </div>
    `}_renderDeviceView(e){const t=this._selectedDomain;if(!t)return ye;const i=e.get(t);if(!i)return ye;const a=t===ro?[...i.values()].map(e=>e.area):this._getVisibleSortedAreas().filter(e=>i.has(e.area_id));return fe`
      <div class="device-view">
        ${this._renderDevicePageHeader({icon:this._typeIcon(t),title:this._typeName(t),subtitle:this._tp("common.entity",this._domainCount(i)),color:this._typeColor(t),back:!0})}

        ${a.map(e=>{const a=i.get(e.area_id);return fe`
            <div class="domain-group">
              <div class="domain-header">
                <div class="domain-header-title">
                  <ha-icon icon="mdi:floor-plan"></ha-icon>
                  <span>${e.name}</span>
                </div>
              </div>
              <div class=${this._entitiesGridClass(t)}>
                ${at(a.entities,e=>e.entity_id,e=>this._renderEntityCard(e))}
              </div>
            </div>
          `})}
      </div>
    `}_renderEnergyView(){const e=this._energySummary(),t=e.areas[0],i=this._energyStatisticsEntities(e.areas.flatMap(e=>e.entities),8);return fe`
      <div class="device-view energy-view">
        ${this._renderDevicePageHeader({icon:"mdi:flash",title:this._t("devices.energy"),subtitle:this._t("devices.live_power_usage"),color:this._typeColor(ao),back:!0,actions:fe`
            <div class="energy-header-total">
              <span>${e.formattedTotal}</span>
              <small>${this._tp("devices.live_power_sensor",e.sensorCount)}</small>
            </div>
          `})}

        ${e.sensorCount?fe`
              <div class="energy-overview-grid">
                <section class="energy-overview-card total">
                  <div class="energy-overview-head">
                    <span class="energy-overview-icon">
                      <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
                    </span>
                    <div>
                      <h2>${this._t("devices.whole_house")}</h2>
                      <p>${this._tp("devices.live_power_sensor",e.sensorCount)}</p>
                    </div>
                    <strong>${e.formattedTotal}</strong>
                  </div>
                  ${this._renderEnergyStatisticsGraph(i,this._t("devices.whole_house_history"))}
                </section>

                ${t?fe`
                  <section class="energy-overview-card top-area">
                    <div class="energy-overview-head">
                      <span class="energy-overview-icon">
                        <ha-icon icon=${t.icon}></ha-icon>
                      </span>
                      <div>
                        <h2>${this._t("devices.top_area")}</h2>
                        <p>${t.name}</p>
                      </div>
                      <strong>${t.formattedTotal}</strong>
                    </div>
                    <div class="energy-top-entities">
                      ${t.entities.slice(0,3).map(e=>this._renderEnergyEntityMini(e,t.totalWatts))}
                    </div>
                  </section>
                `:ye}
              </div>

              <div class="energy-areas-grid">
                ${at(e.areas,e=>e.areaId,e=>this._renderEnergyAreaCard(e))}
              </div>
            `:fe`
              <div class="energy-empty">
                <ha-icon icon="mdi:flash-off-outline"></ha-icon>
                <h2>${this._t("devices.no_power_title")}</h2>
                <p>${this._t("devices.no_power_description")}</p>
              </div>
            `}
      </div>
    `}_renderEnergyAreaCard(e){const t=!e.areaId.startsWith("__");return fe`
      <section class="energy-area-card">
        <header class="energy-area-head">
          <button
            class="energy-area-title"
            type="button"
            @click=${()=>t?this._navigateToArea(e.areaId):void 0}
            ?disabled=${!t}
          >
            <span class="energy-area-icon">
              <ha-icon icon=${e.icon}></ha-icon>
            </span>
            <span>
              <strong>${e.name}</strong>
              <small>${this._tp("devices.power_entity",e.entities.length)}</small>
            </span>
          </button>
          <div class="energy-area-total">
            <span>${e.formattedTotal}</span>
            <small>${this._t("devices.total_now")}</small>
          </div>
        </header>

        ${this._renderEnergyStatisticsGraph(this._energyStatisticsEntities(e.entities,6),`${e.name} power history`)}

        <div class="energy-entity-list">
          ${at(e.entities,e=>e.entityId,t=>this._renderEnergyEntityRow(t,e.totalWatts))}
        </div>
      </section>
    `}_renderEnergyEntityMini(e,t){const i=this._energyEntityPercentage(e,t);return fe`
      <button
        class="energy-entity-mini"
        type="button"
        style=${`--power-width: ${i}%`}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <span>${e.name}</span>
        <strong>${e.formatted}</strong>
      </button>
    `}_renderEnergyEntityRow(e,t){const i=this._energyEntityPercentage(e,t);return fe`
      <button
        class="energy-entity-row"
        type="button"
        style=${`--power-width: ${i}%`}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <span class="energy-entity-icon">
          <ha-icon icon=${e.icon}></ha-icon>
        </span>
        <span class="energy-entity-copy">
          <strong>${e.name}</strong>
          <small>${e.areaName}</small>
          <span class="energy-entity-bar" aria-hidden="true"><span></span></span>
        </span>
        <span class="energy-entity-value">${e.formatted}</span>
      </button>
    `}_energyEntityPercentage(e,t){return t<=0?0:Math.max(4,Math.min(100,Math.round(e.watts/t*100)))}_energyStatisticsEntities(e,t){return e.filter(e=>["measurement","total","total_increasing"].includes(e.stateClass||"")).sort((e,t)=>t.watts-e.watts).slice(0,t).map(e=>({entity:e.entityId,name:e.name}))}_renderEnergyStatisticsGraph(e,t){if(!e.length)return ye;const i={type:"statistics-graph",entities:e,days_to_show:1,period:"5minute",stat_types:["mean"],chart_type:"line",hide_legend:!0,fit_y_data:!0,min_y_axis:0};return fe`
      <dwains-dashboard-next-card-host
        class="energy-statistics-card"
        aria-label=${t}
        .hass=${this._hass}
        .config=${i}
      ></dwains-dashboard-next-card-host>
    `}_renderMaintenanceView(e){const t=this._maintenanceSummary(e),i=this._orderedMaintenanceBuckets(e);return fe`
      <div class="device-view maintenance-view">
        ${this._renderDevicePageHeader({icon:"mdi:wrench",title:this._t("devices.maintenance"),subtitle:this._maintenanceSubtitle(e),color:this._typeColor(to),back:!0,actions:fe`
            <div class="maintenance-summary">
              <span>
                <ha-icon icon="mdi:battery-alert"></ha-icon>
                ${t.lowBatteryCount}
              </span>
              <span>
                <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                ${t.unavailableDeviceCount}
              </span>
            </div>
          `})}

        ${i.length?i.map(e=>fe`
              <div class="maintenance-area-group">
                <button
                  class="maintenance-area-title"
                  type="button"
                  @click=${()=>this._navigateToArea(e.area.area_id)}
                  ?disabled=${e.area.area_id===io}
                >
                  <span>${e.area.name}</span>
                  <span>${e.items.length}</span>
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </button>
                <div class="maintenance-grid">
                  ${at(e.items,e=>e.entityId,e=>this._renderMaintenanceCard(e))}
                </div>
              </div>
            `):fe`
              <div class="maintenance-empty">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                <span>${this._t("devices.maintenance_empty")}</span>
              </div>
            `}
      </div>
    `}_orderedMaintenanceBuckets(e){const t=new Map(this._getVisibleSortedAreas().map((e,t)=>[e.area_id,t]));return[...e.values()].sort((e,i)=>{const a=t.get(e.area.area_id)??Number.MAX_SAFE_INTEGER,o=t.get(i.area.area_id)??Number.MAX_SAFE_INTEGER;return a!==o?a-o:e.area.name.localeCompare(i.area.name)})}_renderMaintenanceCard(e){return fe`
      <button
        class="maintenance-card ${e.kind}"
        type="button"
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <div class="maintenance-card-icon">
          <ha-icon icon=${e.icon}></ha-icon>
          ${"unavailable"===e.kind?fe`<span class="maintenance-alert-dot">!</span>`:ye}
        </div>
        <div class="maintenance-card-copy">
          <div class="maintenance-card-title">${e.name}</div>
          <div class="maintenance-card-state">${e.stateLabel}</div>
        </div>
      </button>
    `}_showMoreInfo(e){Fi(this,"hass-more-info",{entityId:e})}_navigateToArea(e){if(!e||e===io)return;const t=window.location.pathname.split("/")[1]||"lovelace",i=new URL(window.location.href);i.pathname=`/${t}/home`,i.searchParams.set("dd_area",e),i.searchParams.delete("dd_device"),window.history.pushState(null,"",i.toString());const a=new Event("location-changed",{bubbles:!0,composed:!0});a.detail={replace:!1},window.dispatchEvent(a)}_renderEntityCard(e){return this._hass.states[e.entity_id]?fe`
      <div class="${this._entityWrapperClass(e.entity_id)}">
        <dwains-dashboard-next-card-host
          .hass=${this._hass}
          .config=${this._entityCardConfig(e.entity_id)}
        ></dwains-dashboard-next-card-host>
      </div>
    `:ye}_entitiesGridClass(e){return["entities-grid","cover"===e?"cover-entities-grid":"","light"===e?"light-entities-grid":"","sensor"===e?"sensor-entities-grid":"","binary_sensor.motion"===e?"motion-entities-grid":"","todo"===e?"todo-entities-grid":""].filter(Boolean).join(" ")}_entityWrapperClass(e){const t=e.split(".")[0]||"",i=this._hass.states?.[e]?.attributes?.device_class;return["entity-card-wrapper",`${t}-entity-card`,"binary_sensor"===t&&["motion","occupancy","presence"].includes(String(i))?"motion-entity-card":""].filter(Boolean).join(" ")}_renderNewDevicesView(e){return fe`
      <div class="device-view">
        ${this._renderDevicePageHeader({icon:"mdi:new-box",title:this._t("devices.new"),subtitle:this._t("devices.new_description",{hours:48}),color:this._typeColor(eo),back:!0,actions:fe`<span class="device-header-count">${e.length}</span>`})}
        <section class="recent-devices new-devices-view">
          <div class="recent-grid">
            ${e.length?e.map(e=>this._renderRecentDevice(e)):fe`
                  <div class="recent-empty">
                    ${this._t("devices.new_empty",{hours:48})}
                  </div>
                `}
          </div>
        </section>
      </div>
    `}_newDevices(e=999){return this._hass&&ki(this.config)?function(e,t,i=6){if(!t?.devices?.length)return[];const a=Date.now(),o=a-1728e5,r=vi(t),n=fi(t).first_seen_devices||{},s=new Map,c=$i(e,t);for(const i of t.entities||[]){const t=xi(e,i);if(!t)continue;const a=e?.entities?.[i.entity_id];if(a?.hidden_by||"diagnostic"===a?.entity_category||"config"===a?.entity_category)continue;const o=s.get(t)||[];o.push(i),s.set(t,o)}return t.devices.map(i=>{const d=s.get(i.device_id)||[],l=function(e,t){return t?(e.areas_display?.hidden||[]).includes(t)?"":e.areas?.find(e=>e.area_id===t)?.name||"":""}(t,function(e,t,i){const a=t.area_id||e?.devices?.[t.device_id]?.area_id;if(a)return a;for(const t of i){const i=t.area_id||e?.entities?.[t.entity_id]?.area_id;if(i)return i}return""}(e,i,d));if(!l)return null;const p=Si(e,i)||c.get(i.device_id)||n[i.device_id]||null;return!p||p<o||p>a+6e4?null:{device:i,areaName:l,domains:Array.from(new Set(d.map(e=>e.entity_id.split(".")[0]||"").filter(Boolean))).sort(),entityCount:d.length,createdAt:i.created_at||e?.devices?.[i.device_id]?.created_at||"",createdAtMs:p,hidden:r.has(i.device_id)}}).filter(e=>!!e&&e.entityCount>0).sort((e,t)=>t.createdAtMs-e.createdAtMs||e.device.name.localeCompare(t.device.name)).slice(0,i)}(this._hass,this.config,e):[]}_ensureDeviceTracking(){const e=function(e,t){if(!t?.devices?.length)return null;const i=fi(t),a={...i.first_seen_devices||{}},o=new Set(t.devices.map(e=>e.device_id)),r=$i(e,t),n=Date.now();let s=!1;for(const i of t.devices)a[i.device_id]||(a[i.device_id]=Si(e,i)||r.get(i.device_id)||n,s=!0);for(const e of Object.keys(a))o.has(e)||(delete a[e],s=!0);return s?{...i,first_seen_devices:a}:null}(this._hass,this.config);e&&(this.config={...this.config,device_admission:e},this._saveDeviceAdmission(e,!0))}_renderRecentDevice(e){return fe`
      <div class="recent-device ${e.hidden?"is-hidden":""}">
        <div class="recent-device-main">
          <div class="recent-device-icon">
            <ha-icon icon=${e.hidden?"mdi:eye-off-outline":"mdi:devices"}></ha-icon>
          </div>
          <div class="recent-device-copy">
            <div class="recent-device-name">${e.device.name}</div>
            <div class="recent-device-meta">
              <span>${e.areaName}</span>
              <span>${this._tp("common.entity",e.entityCount)}</span>
              <span>${this._formatAddedAge(e.createdAtMs)}</span>
            </div>
            <div class="recent-domains">
              ${e.domains.slice(0,4).map(e=>fe`
                <span>${kt(this._hass,e)}</span>
              `)}
            </div>
          </div>
        </div>
      </div>
    `}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}_formatAddedAge(e){const t=Math.max(0,Date.now()-e),i=Math.floor(t/36e5);if(i<1)return this._t("devices.added_just_now");const o=new Intl.RelativeTimeFormat(a(this._hass),{numeric:"always"});return i<24?o.format(-i,"hour"):o.format(-Math.floor(i/24),"day")}async _saveDeviceAdmission(e,t=!1){this.config={...this.config,device_admission:e},this.requestUpdate();try{const t=this._getDashboardUrlPath(),i=t?{url_path:t}:{},a=await this._hass.callWS({type:"lovelace/config",...i}),o=a?.strategy||{};await this._hass.callWS({type:"lovelace/config/save",...i,config:{...a,strategy:{...o,device_admission:e}}})}catch(e){console.error("❌ Device visibility save failed:",e),t||alert(this._t("devices.save_visibility_failed",{error:String(e)}))}}};so.styles=j`
    :host {
      display: block;
      -webkit-tap-highlight-color: transparent;
    }

    button,
    .area-button,
    .recent-device,
    .restore-button {
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .loading,
    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    /* Layout Container */
    .layout-container {
      display: flex;
      height: 100vh;
      position: relative;
    }

    /* Sidebar */
    .sidebar {
      width: 250px;
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      z-index: 1;
      overflow-y: auto;
    }

    .sidebar-title {
      padding: 16px 16px 4px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .area-list {
      padding: 8px;
    }

    .area-button {
      --domain-color: var(--primary-color);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 8px;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected {
      background: var(--domain-color);
      color: var(--text-primary-color);
    }

    .area-button.new-devices {
      --domain-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: 1px solid rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
    }

    .area-button.new-devices.selected {
      background: var(--domain-color);
      border-color: transparent;
      color: var(--text-primary-color);
    }

    .area-button.new-devices .area-icon {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .area-button.new-devices.selected .area-icon {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-primary-color);
    }

    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      color: var(--domain-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .area-info {
      flex: 1;
      min-width: 0;
    }

    .area-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .device-menu-subtitle {
      display: none;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .device-menu-chevron {
      display: none;
      flex-shrink: 0;
      color: var(--secondary-text-color);
      --mdc-icon-size: 22px;
    }

    .area-button.selected .device-menu-subtitle,
    .area-button.selected .device-menu-chevron {
      color: var(--text-primary-color);
      opacity: 0.88;
    }

    .domain-count {
      flex-shrink: 0;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--domain-color) 11%, var(--secondary-background-color));
      color: var(--domain-color);
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .area-button.selected .domain-count {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-primary-color);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    @media (max-width: 768px) {
      .content-area {
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }

      .domain-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    .device-view {
      max-width: 1600px;
      margin: 0 auto;
    }

    .device-page-header {
      --domain-color: var(--primary-color);
      min-height: 134px;
      margin: 0 0 20px;
      padding: 22px 24px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      border: 1px solid color-mix(in srgb, var(--domain-color) 18%, var(--divider-color));
      border-radius: 8px;
      background:
        radial-gradient(circle at 16% 20%, color-mix(in srgb, var(--domain-color) 10%, transparent), transparent 34%),
        linear-gradient(135deg,
          color-mix(in srgb, var(--card-background-color) 96%, var(--domain-color) 4%),
          color-mix(in srgb, var(--card-background-color) 99%, transparent));
      box-shadow: 0 20px 44px rgba(15, 23, 42, 0.06);
      overflow: hidden;
    }

    .device-page-header:not(.has-back) {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .device-header-back {
      width: 46px;
      height: 46px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #182044;
      color: #ffffff;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .device-header-back ha-icon {
      --mdc-icon-size: 23px;
    }

    .device-header-main {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .device-header-icon {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--domain-color) 12%, var(--card-background-color));
      color: var(--domain-color);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 14%, transparent);
    }

    .device-header-icon ha-icon {
      --mdc-icon-size: 28px;
    }

    .device-header-copy {
      min-width: 0;
    }

    .device-title {
      margin: 0;
      color: var(--primary-text-color);
      font-size: clamp(24px, 3vw, 38px);
      font-weight: 850;
      line-height: 1.02;
      letter-spacing: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .device-subtitle {
      margin-top: 6px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.2;
    }

    .device-header-actions {
      justify-self: end;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      min-width: 0;
    }

    .device-header-count {
      min-width: 34px;
      height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--domain-color) 13%, var(--card-background-color));
      color: var(--domain-color);
      font-size: 14px;
      font-weight: 850;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 16%, transparent);
    }

    .overview-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 600;
    }

    .devices-overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 14px;
    }

    .devices-overview-card {
      --domain-color: var(--primary-color);
      min-height: 148px;
      padding: 16px;
      border: 1px solid color-mix(in srgb, var(--domain-color) 15%, var(--divider-color));
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06);
      display: grid;
      grid-template-rows: auto 1fr auto;
      align-items: start;
      text-align: left;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .devices-overview-card::after {
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: color-mix(in srgb, var(--domain-color) 60%, transparent);
    }

    .devices-overview-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--domain-color) 32%, var(--divider-color));
      box-shadow: 0 20px 42px rgba(15, 23, 42, 0.1);
    }

    .overview-card-icon {
      width: 46px;
      height: 46px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--domain-color) 12%, transparent);
      color: var(--domain-color);
      position: relative;
    }

    .overview-card-icon ha-icon {
      --mdc-icon-size: 25px;
    }

    .overview-card-count {
      position: absolute;
      right: -10px;
      top: -9px;
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--domain-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 8px 18px color-mix(in srgb, var(--domain-color) 32%, transparent);
    }

    .overview-card-copy {
      align-self: end;
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    .overview-card-copy strong {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 800;
      line-height: 1.05;
    }

    .overview-card-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .overview-card-chevron {
      position: absolute;
      right: 14px;
      top: 14px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 22px;
    }

    .recent-devices {
      margin-bottom: 18px;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
    }

    .new-devices-view {
      margin-bottom: 0;
    }

    .area-button.maintenance {
      --domain-color: var(--warning-color, #ff9800);
    }

    .recent-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    .recent-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
    }

    .recent-title ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .recent-count {
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color);
      font-size: 12px;
      font-weight: 700;
    }

    .recent-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.4;
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 8px;
    }

    .recent-empty {
      grid-column: 1 / -1;
      padding: 24px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      color: var(--secondary-text-color);
      text-align: center;
      background: var(--primary-background-color);
      font-size: 13px;
    }

    .recent-device {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: var(--primary-background-color);
    }

    .recent-device.is-hidden {
      opacity: 0.72;
    }

    .recent-device-main {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      min-width: 0;
    }

    .recent-device-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: var(--secondary-background-color);
      color: var(--primary-color);
    }

    .recent-device-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .recent-device-copy {
      min-width: 0;
    }

    .recent-device-name {
      font-weight: 650;
      font-size: 14px;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .recent-device-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    .recent-domains {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 7px;
    }

    .recent-domains span {
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
    }

    .maintenance-view {
      max-width: 1200px;
    }

    .maintenance-header {
      align-items: flex-start;
      margin-bottom: 22px;
    }

    .maintenance-header-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 500;
    }

    .maintenance-summary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .maintenance-summary span {
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--card-background-color));
      color: var(--domain-color);
      font-size: 13px;
      font-weight: 800;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 14%, transparent);
    }

    .maintenance-summary ha-icon {
      --mdc-icon-size: 17px;
    }

    .maintenance-area-group {
      margin-bottom: 18px;
    }

    .maintenance-area-title {
      min-height: 34px;
      margin: 0 0 7px;
      padding: 0 4px;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 760;
    }

    .maintenance-area-title:disabled {
      cursor: default;
    }

    .maintenance-area-title span:first-child {
      color: var(--primary-text-color);
    }

    .maintenance-area-title span:nth-child(2) {
      min-width: 21px;
      height: 21px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .maintenance-area-title ha-icon {
      --mdc-icon-size: 18px;
    }

    .maintenance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .maintenance-card {
      min-height: 56px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
      transition:
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease;
    }

    .maintenance-card:hover {
      border-color: color-mix(in srgb, var(--domain-color) 26%, var(--divider-color));
      box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .maintenance-card-icon {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }

    .maintenance-card.battery .maintenance-card-icon {
      background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.12);
      color: var(--warning-color, #ff9800);
    }

    .maintenance-card.unavailable .maintenance-card-icon {
      background: color-mix(in srgb, var(--secondary-text-color) 10%, var(--secondary-background-color));
      color: color-mix(in srgb, var(--secondary-text-color) 86%, var(--primary-text-color));
    }

    .maintenance-card-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .maintenance-alert-dot {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--warning-color, #ff9800);
      color: #ffffff;
      font-size: 11px;
      font-weight: 900;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .maintenance-card-copy {
      min-width: 0;
    }

    .maintenance-card-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 750;
      line-height: 1.16;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .maintenance-card-state {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 550;
      line-height: 1.2;
    }

    .maintenance-empty {
      min-height: 180px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--secondary-text-color);
      background: var(--card-background-color);
    }

    .maintenance-empty ha-icon {
      --mdc-icon-size: 22px;
      color: var(--success-color, #4caf50);
    }

    .area-button.energy {
      --domain-color: #d88e20;
    }

    .energy-view {
      --domain-color: #d88e20;
      max-width: 1320px;
    }

    .energy-header {
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .energy-header-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 600;
    }

    .energy-header-total {
      min-width: 150px;
      padding: 9px 12px;
      border-radius: 12px;
      display: grid;
      justify-items: end;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 14%, transparent);
    }

    .energy-header-total span {
      color: var(--primary-text-color);
      font-size: 24px;
      font-weight: 950;
      line-height: 1;
    }

    .energy-header-total small,
    .energy-overview-head p,
    .energy-area-title small,
    .energy-area-total small,
    .energy-entity-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
    }

    .energy-overview-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(260px, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }

    .energy-overview-card,
    .energy-area-card {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
    }

    .energy-overview-card {
      padding: 14px;
      overflow: hidden;
    }

    .energy-overview-head {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .energy-overview-icon,
    .energy-area-icon,
    .energy-entity-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--domain-color) 12%, transparent);
      color: var(--domain-color);
    }

    .energy-overview-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
    }

    .energy-overview-icon ha-icon {
      --mdc-icon-size: 24px;
    }

    .energy-overview-head h2 {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .energy-overview-head p {
      margin: 4px 0 0;
    }

    .energy-overview-head strong {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      white-space: nowrap;
    }

    .energy-statistics-card {
      display: block;
      min-height: 150px;
      margin-top: 12px;
      border-radius: 12px;
      overflow: hidden;
      background: color-mix(in srgb, var(--domain-color) 4%, transparent);
      --ha-card-background: transparent;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 0;
      --ha-card-border-radius: 12px;
    }

    .energy-top-entities {
      margin-top: 12px;
      display: grid;
      gap: 7px;
    }

    .energy-entity-mini {
      min-height: 30px;
      padding: 0 9px;
      border: 0;
      border-radius: 9px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      background:
        linear-gradient(90deg,
          color-mix(in srgb, var(--domain-color) 16%, transparent) 0 var(--power-width),
          var(--secondary-background-color) var(--power-width) 100%);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      font-size: 12px;
      font-weight: 800;
    }

    .energy-entity-mini span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-entity-mini strong {
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .energy-areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 12px;
    }

    .energy-area-card {
      padding: 14px;
      overflow: hidden;
    }

    .energy-area-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .energy-area-title {
      min-width: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
    }

    .energy-area-title:disabled {
      cursor: default;
    }

    .energy-area-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    .energy-area-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .energy-area-title strong {
      display: block;
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 900;
      line-height: 1.12;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-area-title small {
      display: block;
      margin-top: 3px;
    }

    .energy-area-total {
      display: grid;
      justify-items: end;
      gap: 2px;
    }

    .energy-area-total span {
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .energy-entity-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .energy-entity-row {
      min-height: 58px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      transition:
        border-color 0.16s ease,
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .energy-entity-row:hover {
      border-color: color-mix(in srgb, var(--domain-color) 26%, var(--divider-color));
      box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .energy-entity-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }

    .energy-entity-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .energy-entity-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .energy-entity-copy strong {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-entity-bar {
      position: relative;
      height: 5px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--secondary-background-color));
    }

    .energy-entity-bar span {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--domain-color), #f5c85b);
    }

    .energy-entity-value {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
    }

    .energy-empty {
      min-height: 280px;
      padding: 32px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      text-align: center;
    }

    .energy-empty ha-icon {
      --mdc-icon-size: 34px;
      color: var(--domain-color);
    }

    .energy-empty h2 {
      margin: 4px 0 0;
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 850;
    }

    .energy-empty p {
      max-width: 430px;
      margin: 0;
      font-size: 13px;
      line-height: 1.45;
    }

    /* Domain (per area) groups */
    .domain-group {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .domain-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .domain-header ha-icon {
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entities-grid.cover-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entities-grid.todo-entities-grid {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 760px));
      align-items: start;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card {
      min-height: 72px;
    }

    .light-entity-card {
      min-height: 72px;
    }

    .sensor-entity-card {
      min-height: 150px;
    }

    .motion-entity-card {
      min-height: 72px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
    .light-entity-card dwains-dashboard-next-card-host,
    .sensor-entity-card dwains-dashboard-next-card-host,
    .motion-entity-card dwains-dashboard-next-card-host {
      display: block;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .layout-container > .sidebar,
      .sidebar {
        position: fixed !important;
        left: 18px !important;
        right: 18px !important;
        top: auto !important;
        bottom: calc(82px + env(safe-area-inset-bottom, 0px)) !important;
        width: auto !important;
        height: auto !important;
        max-height: min(62vh, 520px);
        padding: 10px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(20px);
        transform: translate3d(0, calc(100% + 140px), 0) !important;
        transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 121;
      }

      .layout-container > .sidebar.open,
      .sidebar.open {
        transform: translate3d(0, 0, 0) !important;
      }

      .sidebar::before {
        content: "";
        width: 42px;
        height: 4px;
        margin: 0 auto 10px;
        display: block;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.14);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .sidebar-title {
        padding: 4px 8px 12px;
        font-size: 16px;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-list {
        display: grid;
        gap: 8px;
        padding: 0;
      }

      .sidebar .area-button {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        min-height: 70px;
        height: auto;
        margin-bottom: 0;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background: rgba(255, 255, 255, 0.92);
        color: var(--primary-text-color);
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        transform: none;
      }

      .sidebar .area-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
      }

      .sidebar .area-button.selected {
        background: rgba(255, 255, 255, 0.98);
        border-color: color-mix(in srgb, var(--domain-color) 34%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 3px 0 0 var(--domain-color);
        transform: none;
      }

      .sidebar .area-icon {
        width: 46px;
        height: 46px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--domain-color) 10%, transparent);
        color: var(--domain-color);
      }

      .sidebar .area-icon ha-icon {
        --mdc-icon-size: 25px;
      }

      .sidebar .area-button.selected .area-icon {
        background: color-mix(in srgb, var(--domain-color) 14%, transparent);
        color: var(--domain-color);
      }

      .sidebar .area-name {
        margin: 0;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .device-menu-subtitle,
      .sidebar .device-menu-chevron {
        display: block;
      }

      .sidebar .area-button.selected .device-menu-subtitle,
      .sidebar .area-button.selected .device-menu-chevron {
        color: var(--secondary-text-color);
        opacity: 1;
      }

      .sidebar .device-menu-chevron {
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .area-button.selected .device-menu-chevron {
        color: var(--domain-color);
        transform: translateX(2px);
      }

      .sidebar .domain-count {
        display: none;
      }

      :host([data-theme-dark]) {
        .layout-container > .sidebar,
        .sidebar {
          border-color: rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(37, 40, 48, 0.96), rgba(18, 20, 25, 0.94)),
            color-mix(in srgb, var(--card-background-color) 92%, #000000);
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.58),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: var(--primary-text-color);
        }

        .sidebar::before {
          background: rgba(255, 255, 255, 0.18);
        }

        .sidebar-title {
          color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
        }

        .sidebar .area-button {
          border-color: rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          color: var(--primary-text-color);
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .sidebar .area-button:hover {
          box-shadow:
            0 12px 26px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .sidebar .area-button.selected {
          border-color: color-mix(in srgb, var(--domain-color) 42%, transparent);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--domain-color) 12%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
          color: var(--primary-text-color);
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.36),
            inset 3px 0 0 var(--domain-color),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .sidebar .area-button.new-devices {
          background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color));
          border-color: color-mix(in srgb, var(--primary-color) 24%, transparent);
        }

        .sidebar .area-icon {
          background: color-mix(in srgb, var(--domain-color) 20%, transparent);
          color: var(--domain-color);
        }

        .sidebar .area-button.selected .area-icon,
        .sidebar .area-button.new-devices.selected .area-icon {
          background: color-mix(in srgb, var(--domain-color) 24%, transparent);
          color: var(--domain-color);
        }

        .sidebar .device-menu-subtitle,
        .sidebar .device-menu-chevron,
        .sidebar .area-button.selected .device-menu-subtitle,
        .sidebar .area-button.selected .device-menu-chevron {
          color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        }

        .sidebar .area-button.selected .device-menu-chevron {
          color: var(--domain-color);
        }

        .mobile-nav-overlay {
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(4px);
        }
      }

      .entities-grid {
        grid-template-columns: 1fr;
      }

      .entities-grid.cover-entities-grid {
        grid-template-columns: 1fr;
      }

      .entities-grid.light-entities-grid {
        grid-template-columns: 1fr;
      }

      .entities-grid.sensor-entities-grid,
      .entities-grid.motion-entities-grid {
        grid-template-columns: 1fr;
      }

      .devices-overview-view {
        padding: 2px 0;
      }

      .device-page-header {
        min-height: 132px;
        margin: 0 -10px 18px;
        padding: calc(14px + env(safe-area-inset-top, 0px)) 16px 18px;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: start;
        gap: 12px;
        border-width: 0 0 1px;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 90%, var(--domain-color) 4%) 100%);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
      }

      .device-page-header.has-actions {
        grid-template-columns: auto minmax(0, 1fr) auto;
      }

      .device-page-header:not(.has-back) {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .device-page-header:not(.has-back) .device-header-main {
        grid-column: 1;
      }

      .device-header-back {
        width: 40px;
        height: 40px;
        margin-top: 1px;
      }

      .device-header-back ha-icon {
        --mdc-icon-size: 21px;
      }

      .device-header-main {
        align-items: center;
        gap: 10px;
      }

      .device-page-header.has-back .device-header-main {
        align-items: flex-start;
        flex-direction: column;
        gap: 7px;
      }

      .device-page-header.has-back .device-header-icon {
        display: none;
      }

      .device-header-icon {
        width: 44px;
        height: 44px;
      }

      .device-header-icon ha-icon {
        --mdc-icon-size: 24px;
      }

      .device-title {
        font-size: 26px;
      }

      .device-subtitle {
        margin-top: 3px;
        font-size: 12px;
      }

      .device-header-actions {
        align-self: start;
      }

      .device-page-header.has-actions .device-header-actions {
        grid-column: 1 / -1;
        width: 100%;
        justify-content: flex-start;
      }

      .devices-overview-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .devices-overview-card {
        min-height: 128px;
        padding: 14px;
        border-radius: 8px;
      }

      .overview-card-icon {
        width: 42px;
        height: 42px;
      }

      .overview-card-copy strong {
        font-size: 16px;
        overflow-wrap: anywhere;
      }

      .overview-card-copy small {
        white-space: normal;
        line-height: 1.2;
      }

      .recent-header,
      .recent-device {
        align-items: stretch;
        grid-template-columns: 1fr;
      }

      .recent-header {
        flex-direction: column;
      }

      .maintenance-summary {
        width: auto;
      }

      .maintenance-grid {
        grid-template-columns: 1fr;
      }

      .maintenance-card {
        min-height: 62px;
      }

      .energy-header-total {
        justify-items: start;
      }

      .energy-overview-grid,
      .energy-areas-grid {
        grid-template-columns: 1fr;
      }

      .energy-overview-head,
      .energy-area-head {
        grid-template-columns: 40px minmax(0, 1fr);
      }

      .energy-overview-head strong,
      .energy-area-total {
        grid-column: 1 / -1;
        justify-self: stretch;
        justify-items: start;
        margin-top: 4px;
      }

      .energy-area-card,
      .energy-overview-card {
        border-radius: 10px;
      }

      .energy-entity-row {
        grid-template-columns: 36px minmax(0, 1fr);
      }

      .energy-entity-value {
        grid-column: 2;
        justify-self: start;
      }
    }
  `,y([Fe()],so.prototype,"_selectedDomain",void 0),y([Fe()],so.prototype,"_isMobile",void 0),y([Fe()],so.prototype,"_mobileNavOpen",void 0),so=y([Oe("dwains-dashboard-next-devices-card")],so);var co=Object.freeze({__proto__:null,get DwainsDevicesCard(){return so}});const lo=[{id:"tile",labelKey:"card_type.tile.label",descKey:"card_type.tile.desc",icon:"mdi:view-grid",config:{type:"tile",entity:""}},{id:"entities",labelKey:"card_type.entities.label",descKey:"card_type.entities.desc",icon:"mdi:format-list-bulleted",config:{type:"entities",entities:[]}},{id:"button",labelKey:"card_type.button.label",descKey:"card_type.button.desc",icon:"mdi:gesture-tap-button",config:{type:"button",entity:""}},{id:"gauge",labelKey:"card_type.gauge.label",descKey:"card_type.gauge.desc",icon:"mdi:gauge",config:{type:"gauge",entity:""}},{id:"history-graph",labelKey:"card_type.history.label",descKey:"card_type.history.desc",icon:"mdi:chart-line",config:{type:"history-graph",entities:[]}},{id:"sensor",labelKey:"card_type.sensor.label",descKey:"card_type.sensor.desc",icon:"mdi:eye",config:{type:"sensor",entity:"",graph:"line"}},{id:"thermostat",labelKey:"card_type.thermostat.label",descKey:"card_type.thermostat.desc",icon:"mdi:thermostat",config:{type:"thermostat",entity:""}},{id:"weather-forecast",labelKey:"card_type.weather.label",descKey:"card_type.weather.desc",icon:"mdi:weather-partly-cloudy",config:{type:"weather-forecast",entity:""}},{id:"markdown",labelKey:"card_type.markdown.label",descKey:"card_type.markdown.desc",icon:"mdi:language-markdown",config:{type:"markdown",content:"## Title\nText here"}},{id:"picture-entity",labelKey:"card_type.picture.label",descKey:"card_type.picture.desc",icon:"mdi:image",config:{type:"picture-entity",entity:""}},{id:"glance",labelKey:"card_type.glance.label",descKey:"card_type.glance.desc",icon:"mdi:view-dashboard",config:{type:"glance",entities:[]}},{id:"media-control",labelKey:"card_type.media.label",descKey:"card_type.media.desc",icon:"mdi:play-circle",config:{type:"media-control",entity:""}},{id:"manual",labelKey:"card_type.manual.label",descKey:"card_type.manual.desc",icon:"mdi:code-braces",config:{type:""},manual:!0}],po=new Set(["history-graph","sensor","statistics-graph"]);let ho=class extends Te{constructor(){super(...arguments),this._t=(e,t)=>o(this.hass,e,t),this._valid=!0,this._search="",this._picked=!1,this._useYaml=!1,this._editorReady=!1,this._loadingEditor=!1,this._back=()=>{this._params?.card?this.closeDialog():(this._picked=!1,this._card=void 0,this._configEl=void 0,this._editorReady=!1,this._previewEl=void 0)},this._toggleYaml=()=>{this._useYaml=!this._useYaml,this._useYaml||(this._editorReady=!1,this._configEl=void 0)},this._save=()=>{this._card?.type&&this._valid&&this._params&&(this._params.onSave(this._card),this.closeDialog())}}showDialog(e){this._params=e,this._card=e.card?{...e.card}:void 0,this._picked=!!e.card,this._valid=!!this._card,this._search="",this._useYaml=!1,this._editorReady=!1,this._configEl=void 0,this._previewEl=void 0}closeDialog(){this._params=void 0,this._card=void 0,this._configEl=void 0,this._previewEl=void 0,this._picked=!1,this._editorReady=!1,Fi(this,"dialog-closed",{dialog:"dwains-dashboard-next-card-editor-dialog"})}_pick(e){this._card={...e.config},this._picked=!0,this._useYaml=!!e.manual,this._editorReady=!!e.manual,this._valid=!e.manual&&!!e.config.type,this._configEl=void 0,this._previewEl=void 0}async _loadNativeEditor(){if(!this._loadingEditor&&this._card){this._loadingEditor=!0;try{const e=String(this._card.type||""),t="hui-"+e.replace(/^custom:/,"")+"-card";try{const t=await(window.loadCardHelpers?.()),i=lo.find(t=>t.config.type===e),a=i&&this._previewConfigFor(i)||{type:e};t?.createCardElement(a)}catch{}await Promise.race([customElements.whenDefined(t),new Promise(e=>setTimeout(e,4e3))]);const i=customElements.get(t);if(i&&"function"==typeof i.getConfigElement){const e=await i.getConfigElement();if(e){e.hass=this.hass,e.addEventListener("config-changed",t=>{t.stopPropagation();const i=t.detail?.config;if(!i||"object"!=typeof i)return;if((t.composedPath?.()[0]??t.target)!==e&&!i.type)return;const a={...this._card,...i};a.type?(this._card=a,this._valid=!0,this._updatePreview()):this._valid=!1});try{e.setConfig(this._card)}catch{}return this._configEl=e,this._editorReady=!0,void this.requestUpdate()}}this._useYaml=!0,this._editorReady=!0}catch(e){console.warn("Native editor failed, falling back to YAML:",e),this._useYaml=!0,this._editorReady=!0}finally{this._loadingEditor=!1}}}_onYamlChanged(e){e.stopPropagation();const t=e.detail?.value,i=!1!==e.detail?.isValid;this._valid=i&&t&&"object"==typeof t&&!!t.type,this._valid&&(this._card=t,this._updatePreview())}_updatePreview(){const e=this.renderRoot?.querySelector(".preview");if(e&&this._card)if(e.replaceChildren(),this._card.type){if(po.has(String(this._card.type)))return e.textContent=this._t("card_editor.no_preview"),void(this._previewEl=e);try{const t=document.createElement("hui-card");t.hass=this.hass,t.config=this._card,this._previewEl=t,e.appendChild(t)}catch(t){e.textContent="Preview error: "+t}}else this._previewEl=void 0}updated(){if(this._params)if(this._picked){if(this._card){if(this._useYaml||this._editorReady||this._loadingEditor||this._loadNativeEditor(),!this._useYaml&&this._configEl){const e=this.renderRoot?.querySelector(".native-editor-host");e&&this._configEl.parentElement!==e&&e.replaceChildren(this._configEl),this._configEl&&(this._configEl.hass=this.hass)}this._previewEl||this._updatePreview()}}else this._mountPreviews()}render(){if(!this._params)return ye;const e=this._params.areaName?` — ${this._params.areaName}`:"",t=this._picked?this._params.card?this._t("card_editor.title_edit"):this._t("card_editor.title_setup"):this._t("card_editor.title_add");return fe`
      <ha-dialog open @closed=${this.closeDialog} .heading=${t} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${this._picked&&!this._params.card?k:C}
            .label=${this.hass.localize("ui.common.close")}
            @click=${this._picked&&!this._params.card?this._back:this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${t}</span>
        </ha-dialog-header>

        <div class="content">
          <div class="dialog-title">${t}${e}</div>
          ${this._picked?this._renderEditor():this._renderPicker()}
        </div>
      </ha-dialog>
    `}_firstEntity(...e){const t=this.hass?.states||{};for(const i of e){const e=Object.keys(t).find(e=>e.startsWith(i+"."));if(e)return e}}_numericSensor(){const e=this.hass?.states||{};return Object.keys(e).find(t=>t.startsWith("sensor.")&&!isNaN(parseFloat(e[t]?.state??"")))}_previewConfigFor(e){if(e.manual)return null;const t=e.config.type,i={...e.config};if("gauge"===t){const e=this._numericSensor();return e?(i.entity=e,i):null}if("button"===t){const e=this._firstEntity("light","switch","input_boolean","fan");return e?(i.entity=e,i):null}if("tile"===t){const e=this._firstEntity("light","switch","sensor","binary_sensor");return e?(i.entity=e,i):null}if("thermostat"===t){const e=this._firstEntity("climate");return e?(i.entity=e,i):null}if("weather-forecast"===t){const e=this._firstEntity("weather");return e?(i.entity=e,i):null}if("media-control"===t){const e=this._firstEntity("media_player");return e?(i.entity=e,i):null}if("picture-entity"===t)return null;if("entities"in i){const e=this.hass?.states||{},t=Object.keys(e).filter(e=>e.startsWith("light.")||e.startsWith("sensor.")||e.startsWith("switch.")).slice(0,3);return 0===t.length?null:(i.entities=t,i)}return i}_renderPicker(){const e=this._search.trim().toLowerCase(),t=e?lo.filter(t=>this._t(t.labelKey).toLowerCase().includes(e)||t.config.type.includes(e)):lo;return fe`
      <ha-textfield
        class="search"
        .label=${this._t("card_editor.search")}
        .value=${this._search}
        @input=${e=>this._search=e.target.value}
      ></ha-textfield>

      <div class="grid">
        ${t.map(e=>fe`
            <button class="type-card" @click=${()=>this._pick(e)}>
              <div class="type-head">
                <ha-icon icon=${e.icon}></ha-icon>
                <div class="type-name">${this._t(e.labelKey)}</div>
              </div>
              <div class="dd-preview-host" data-card-type=${e.config.type}></div>
            </button>
          `)}
      </div>
    `}_mountPreviews(){const e=this.renderRoot?.querySelectorAll(".dd-preview-host");e&&e.forEach(e=>{const t=e,i=t.getAttribute("data-card-type")||"";if(t.childElementCount>0&&t.dataset.mountedType===i)return;const a=lo.find(e=>e.config.type===i);if(t.replaceChildren(),t.dataset.mountedType=i,!a||po.has(i))return;const o=this._previewConfigFor(a);if(o)try{const e=document.createElement("hui-card");e.hass=this.hass,e.config=o,e.setAttribute("preview",""),t.appendChild(e)}catch{}})}_renderEditor(){return fe`
      <div class="editor-toolbar">
        <ha-button appearance="plain" size="s" @click=${this._toggleYaml}>
          ${this._useYaml?this._t("card_editor.visual_editor"):this._t("card_editor.code_editor")}
        </ha-button>
      </div>

      ${this._useYaml?fe`
            <ha-yaml-editor
              .hass=${this.hass}
              .defaultValue=${this._card}
              @value-changed=${this._onYamlChanged}
            ></ha-yaml-editor>
          `:this._editorReady?fe`<div class="native-editor-host"></div>`:fe`<div class="loading">${this._t("card_editor.loading")}</div>`}

      <div class="editor-label">${this._t("card_editor.preview")}</div>
      <div class="preview"></div>

      <div class="actions">
        <ha-button appearance="plain" @click=${this._back}>${this._t("common.back")}</ha-button>
        <ha-button
          appearance="accent"
          ?disabled=${!this._valid}
          @click=${this._save}
        >${this._t("common.save")}</ha-button>
      </div>
    `}static get styles(){return j`
      :host {
        --mdc-dialog-min-width: 90vw;
        --mdc-dialog-max-width: 720px;
      }
      ha-dialog {
        --dialog-content-padding: 0;
      }
      .content {
        padding: 0 24px 20px;
      }
      .dialog-title {
        font-size: 1.4rem;
        font-weight: 500;
        color: var(--primary-text-color);
        padding: 4px 0 16px;
      }
      .search {
        width: 100%;
        margin-bottom: 16px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
      }
      .type-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        text-align: left;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
      }
      .type-card:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
      }
      .type-head {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
      }
      .type-card ha-icon {
        --mdc-icon-size: 24px;
        color: var(--primary-color);
      }
      .type-name {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--primary-text-color);
      }
      .dd-preview-host {
        width: 100%;
        pointer-events: none;
        overflow: hidden;
        max-height: 160px;
      }
      .dd-preview-host:empty {
        display: none;
      }
      .editor-toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
      }
      .native-editor-host {
        display: block;
      }
      .loading {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
      }
      .editor-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--secondary-text-color);
        margin: 16px 0 6px;
      }
      .preview {
        border: 1px dashed var(--divider-color);
        border-radius: 12px;
        padding: 12px;
        min-height: 60px;
      }
      .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
      }
      /* Tekstknop in primaire kleur (zoals HA's "Annuleren") */
      .actions .cancel {
        --mdc-theme-primary: var(--primary-color);
      }
      /* Gevulde pill-knop (zoals HA's "Opslaan") */
      .actions .save {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-primary-color, #fff);
        --mdc-shape-small: 20px;
        --mdc-button-horizontal-padding: 24px;
        --mdc-button-height: 40px;
      }
    `}};y([Be({attribute:!1})],ho.prototype,"hass",void 0),y([Fe()],ho.prototype,"_params",void 0),y([Fe()],ho.prototype,"_card",void 0),y([Fe()],ho.prototype,"_valid",void 0),y([Fe()],ho.prototype,"_search",void 0),y([Fe()],ho.prototype,"_picked",void 0),y([Fe()],ho.prototype,"_useYaml",void 0),y([Fe()],ho.prototype,"_editorReady",void 0),ho=y([Oe("dwains-dashboard-next-card-editor-dialog")],ho);var mo=Object.freeze({__proto__:null,get DwainsCardEditorDialog(){return ho}});class uo extends Ge{constructor(e){if(super(e),this.it=ye,e.type!==We)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===ye||null==e)return this._t=void 0,this.it=e;if(e===xe)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}uo.directiveName="unsafeHTML",uo.resultType=1;const go=Ue(uo);let _o=class extends Te{constructor(){super(...arguments),this._t=(e,t)=>o(this.hass,e,t),this._mode="paste",this._galleryLoading=!1,this._galleryError="",this._yamlText="",this._url="",this._loadingUrl=!1,this._error="",this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._source="",this._editYaml=!1,this._checking=!1,this._updateMsg="",this._showGallery=()=>{this._mode="gallery",this._loadGallery()},this._backToSource=()=>{this._parsed=void 0,this._error=""}}showDialog(e){if(this._params=e,this._error="",this._loadingUrl=!1,this._editYaml=!1,this._checking=!1,this._updateMsg="",this._update=void 0,e.page){this._source=e.page.source||"";try{const t=_t(e.page.blueprint);this._parsed=t,this._values={...vt(t.meta),...e.page.inputs||{}},this._pageName=e.page.name,this._pageIcon=e.page.icon||"mdi:puzzle",this._yamlText=e.page.blueprint,this._queueUpdateCheck()}catch(e){this._error=String(e?.message||e),this._parsed=void 0}}else this._mode="gallery",this._yamlText="",this._url="",this._source="",this._parsed=void 0,this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._loadGallery()}closeDialog(){this._params=void 0,this._parsed=void 0,this._yamlText="",this._url="",this._error="",this._values={},Fi(this,"dialog-closed",{dialog:"dwains-dashboard-next-blueprint-dialog"})}_parseFromText(){this._error="";try{const e=_t(this._yamlText);this._applyParsed(e)}catch(e){this._error=String(e?.message||e)}}_applyParsed(e){this._parsed=e,this._values=vt(e.meta),this._pageName=e.meta.name||this._t("blueprint.new_page"),this._pageIcon="mdi:puzzle"}_mergeValues(e){const t=vt(e.meta),i=Object.keys(e.meta.input||{});for(const e of i)void 0!==this._values[e]&&""!==this._values[e]&&(t[e]=this._values[e]);return t}_toggleYamlEdit(){this._error="",this._editYaml=!this._editYaml}_applyYamlEdit(){this._error="";try{const e=_t(this._yamlText);this._values=this._mergeValues(e),this._parsed=e,this._editYaml=!1,this._queueUpdateCheck()}catch(e){this._error=String(e?.message||e)}}_queueUpdateCheck(){this._parsed&&this._checkUpdate({silentIfCurrent:!0})}async _checkUpdate(e={}){this._error="",this._updateMsg="",this._update=void 0,this._checking=!0;try{const t=this._source||await this._resolveSourceFromGallery();if(!t)return void(e.silentIfCurrent||(this._updateMsg=this._t("blueprint.source_missing")));const i=this._toRawUrl(t),a=await fetch(i,{redirect:"follow"});if(!a.ok)throw new Error(this._t("blueprint.fetch_failed",{status:a.status}));const o=await a.text();if(t!==this._source)return;const r=_t(o),n=r.meta.version||"",s=this._parsed?.meta.version||"";n&&(!s||this._compareVersions(n,s)>0)?(this._update=r,this._updateMsg=this._t("blueprint.update_available",{new:n,current:s||"?"})):e.silentIfCurrent||(this._updateMsg=this._t("blueprint.up_to_date",{version:s||n||"?"}))}catch(e){this._error=this._t("blueprint.load_failed",{error:String(e?.message||e)})}finally{this._checking=!1}}async _resolveSourceFromGallery(){if(!this._parsed)return"";await this._loadGallery();const e=this._matchGalleryItem();return e?(this._source=e.url,e.url):""}_matchGalleryItem(){if(!this._parsed||!this._gallery)return;const e=this._normalizeBlueprintName(this._parsed.meta.name),t=(this._parsed.meta.type||"page").toLowerCase(),i=this._gallery.filter(t=>this._normalizeBlueprintName(t.name)===e);return i.find(e=>(e.type||"page").toLowerCase()===t)||i[0]}_normalizeBlueprintName(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"")}_compareVersions(e,t){const i=this._versionParts(e),a=this._versionParts(t),o=Math.max(i.length,a.length);for(let e=0;e<o;e++){const t=i[e]??0,o=a[e]??0;if("number"==typeof t&&"number"==typeof o){if(t!==o)return t>o?1:-1;continue}const r=String(t),n=String(o);if(r!==n)return r>n?1:-1}return 0}_versionParts(e){return e.trim().split(/[^0-9A-Za-z]+/).filter(Boolean).map(e=>/^\d+$/.test(e)?Number(e):e.toLowerCase())}_applyUpdate(){this._update&&(this._values=this._mergeValues(this._update),this._parsed=this._update,this._yamlText=this._update.raw,this._update=void 0,this._updateMsg="")}_toRawUrl(e){let t=e.trim();return t.includes("github.com")&&(t.includes("/blob/")?t=t.replace("github.com","raw.githubusercontent.com").replace("/blob/","/"):t.includes("/tree/")&&(t=t.replace("github.com","raw.githubusercontent.com").replace("/tree/","/"),/\.ya?ml$/i.test(t)||(t=t.replace(/\/$/,"")+"/page.yaml"))),t}async _loadFromUrl(){this._error="";const e=this._toRawUrl(this._url);if(e){this._loadingUrl=!0;try{const t=await fetch(e,{redirect:"follow"});if(!t.ok)throw new Error(this._t("blueprint.fetch_failed",{status:t.status}));const i=await t.text();this._yamlText=i,this._source=this._url;const a=_t(i);this._applyParsed(a)}catch(e){this._error=this._t("blueprint.load_failed",{error:String(e?.message||e)})}finally{this._loadingUrl=!1}}else this._error=this._t("blueprint.invalid_url")}async _loadGallery(){if(!this._gallery&&!this._galleryLoading){this._galleryLoading=!0,this._galleryError="";try{const e=await fetch("https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json",{redirect:"follow"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json(),i=Array.isArray(t)?t:t?.blueprints||[];this._gallery=i.filter(e=>e&&e.url&&e.name).map(e=>({name:String(e.name),description:e.description?String(e.description):void 0,type:e.type?String(e.type):void 0,author:e.author?String(e.author):void 0,version:null!=e.version?String(e.version):void 0,url:String(e.url),image:e.image?String(e.image):void 0,custom_cards:Array.isArray(e.custom_cards)?e.custom_cards.map(String):void 0}))}catch(e){this._galleryError=this._t("blueprint.gallery_failed",{error:String(e?.message||e)})}finally{this._galleryLoading=!1}}}_pickGalleryItem(e){this._url=e.url,this._loadFromUrl()}_renderGallery(){return fe`
      <p class="hint">${this._t("blueprint.gallery_hint")}</p>
      ${this._galleryError?fe`<div class="error">${this._galleryError}</div>`:ye}
      ${this._galleryLoading?fe`<div class="hint">${this._t("blueprint.loading")}</div>`:ye}
      ${this._gallery&&0===this._gallery.length&&!this._galleryError?fe`<div class="hint">${this._t("blueprint.gallery_empty")}</div>`:ye}
      <div class="gallery">
        ${(this._gallery||[]).map(e=>fe`
            <button class="gallery-item" @click=${()=>this._pickGalleryItem(e)}>
              ${e.image?fe`<img class="gallery-img" src=${e.image} alt="" loading="lazy" />`:fe`<div class="gallery-img placeholder">
                    <ha-icon icon="mdi:puzzle"></ha-icon>
                  </div>`}
              <div class="gallery-info">
                <div class="gallery-name">${e.name}</div>
                ${e.description?fe`<div class="gallery-desc">${e.description}</div>`:ye}
                <div class="gallery-tags">
                  ${e.version?fe`<span class="chip">v${e.version}</span>`:ye}
                  ${e.type?fe`<span class="chip">${e.type}</span>`:ye}
                  ${e.author?fe`<span class="chip">${e.author}</span>`:ye}
                </div>
              </div>
            </button>
          `)}
      </div>
    `}_setValue(e,t){this._values={...this._values,[e]:t}}_missingCustomCards(){if(!this._parsed)return[];const e=new Set([...this._parsed.meta.custom_cards||[],...yt(this._parsed.card)]);e.delete("dwains-flexbox-card");const t=[];return e.forEach(e=>{const i=e.startsWith("custom:")?e.slice(7):e;customElements.get(i)||t.push(i)}),t}_slug(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"pagina"}_save(){if(!this._parsed||!this._params)return;let e;try{e=ft(this._parsed.card,this._parsed.meta,this._values)}catch(e){return void(this._error=this._t("blueprint.fill_failed",{error:String(e?.message||e)}))}const t={id:this._params.page?.id||`${this._slug(this._pageName)}-${Date.now().toString(36)}`,name:this._pageName.trim()||this._parsed.meta.name||this._t("blueprint.page_fallback"),icon:this._pageIcon||"mdi:puzzle",blueprint:this._parsed.raw,source:this._source||void 0,inputs:{...this._values},card:e};this._params.onSave(t),this.closeDialog()}render(){if(!this._params)return ye;const e=!!this._params.page,t=this._parsed?e?this._t("blueprint.title_edit"):this._t("blueprint.title_setup"):this._t("blueprint.title_add"),i=!!this._parsed&&!e;return fe`
      <ha-dialog open @closed=${this.closeDialog} .heading=${t} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${i?k:C}
            .label=${this._t("common.close")}
            @click=${i?this._backToSource:this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${t}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._error?fe`<div class="error">${this._error}</div>`:ye}
          ${this._parsed?this._renderForm():this._renderSource()}
        </div>
      </ha-dialog>
    `}_renderSource(){return fe`
      <div class="tabs">
        <button
          class="tab ${"gallery"===this._mode?"active":""}"
          @click=${this._showGallery}
        >
          <ha-icon icon="mdi:view-grid-outline"></ha-icon> ${this._t("blueprint.tab_gallery")}
        </button>
        <button
          class="tab ${"url"===this._mode?"active":""}"
          @click=${()=>this._mode="url"}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon> ${this._t("blueprint.tab_url")}
        </button>
        <button
          class="tab ${"paste"===this._mode?"active":""}"
          @click=${()=>this._mode="paste"}
        >
          <ha-icon icon="mdi:content-paste"></ha-icon> ${this._t("blueprint.tab_paste")}
        </button>
      </div>

      ${"gallery"===this._mode?this._renderGallery():"paste"===this._mode?fe`
            <p class="hint">${this._t("blueprint.paste_hint")}</p>
            <textarea
              class="dd-yaml"
              spellcheck="false"
              placeholder="blueprint:&#10;  name: ...&#10;  type: page&#10;  input:&#10;    ...&#10;card:&#10;  type: ..."
              .value=${this._yamlText}
              @input=${e=>this._yamlText=e.target.value}
            ></textarea>
            <div class="actions">
              <ha-button
                appearance="accent"
                ?disabled=${!this._yamlText.trim()}
                @click=${this._parseFromText}
                >${this._t("common.next")}</ha-button
              >
            </div>
          `:fe`
            <p class="hint">${go(this._t("blueprint.url_hint_html"))}</p>
            <input
              class="dd-input"
              type="url"
              placeholder="https://github.com/.../page-blueprints/Birthdays"
              .value=${this._url}
              @input=${e=>this._url=e.target.value}
            />
            <div class="actions">
              <ha-button
                appearance="accent"
                ?disabled=${!this._url.trim()||this._loadingUrl}
                @click=${this._loadFromUrl}
              >
                ${this._loadingUrl?this._t("blueprint.loading"):this._t("blueprint.fetch")}
              </ha-button>
            </div>
          `}
    `}_renderForm(){const e=this._parsed.meta,t=e.input||{},i=Object.keys(t),a=this._missingCustomCards();return fe`
      <div class="meta">
        <div class="meta-title">${e.name}</div>
        ${e.description?fe`<div class="meta-desc">${e.description}</div>`:ye}
        <div class="meta-tags">
          ${e.version?fe`<span class="chip">v${e.version}</span>`:ye}
          ${e.author?fe`<span class="chip">${e.author}</span>`:ye}
          ${(e.custom_cards||[]).map(e=>fe`<span class="chip card">${e}</span>`)}
        </div>
      </div>

      ${a.length?fe`
            <div class="warn">
              <ha-icon icon="mdi:alert"></ha-icon>
              <div>
                ${this._t("blueprint.missing_cards",{cards:a.join(", ")})}
              </div>
            </div>
          `:ye}

      ${this._params?.page||this._source?this._renderEditTools():ye}
      ${this._renderUpdateBanner()}

      ${this._editYaml?this._renderYamlEditor():this._renderFields(i,t)}
    `}_renderEditTools(){return fe`
      <div class="edit-tools">
        ${this._params?.page?fe`
              <ha-button appearance="plain" size="s" @click=${this._toggleYamlEdit}>
                <ha-icon icon="mdi:code-braces"></ha-icon>
                ${this._editYaml?this._t("blueprint.settings"):this._t("blueprint.edit_yaml")}
              </ha-button>
            `:ye}
        ${this._parsed?fe`
              <ha-button
                appearance="plain"
                size="s"
                ?disabled=${this._checking}
                @click=${()=>this._checkUpdate()}
              >
                <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                ${this._checking?this._t("blueprint.checking"):this._t("blueprint.check_update")}
              </ha-button>
            `:ye}
      </div>
    `}_renderUpdateBanner(){return fe`
      ${this._updateMsg?fe`
            <div class="update-banner">
              <span>${this._updateMsg}</span>
              ${this._update?fe`<ha-button appearance="accent" size="s" @click=${this._applyUpdate}
                    >${this._t("blueprint.update")}</ha-button
                  >`:ye}
            </div>
          `:ye}
    `}_renderYamlEditor(){return fe`
      <textarea
        class="dd-yaml"
        spellcheck="false"
        .value=${this._yamlText}
        @input=${e=>this._yamlText=e.target.value}
      ></textarea>
      <div class="actions">
        <ha-button appearance="plain" @click=${this._toggleYamlEdit}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._applyYamlEdit}>${this._t("blueprint.apply")}</ha-button>
      </div>
    `}_renderFields(e,t){return fe`
      <div class="field">
        <label>${this._t("blueprint.page_name")}</label>
        <input
          class="dd-input"
          .value=${this._pageName}
          @input=${e=>this._pageName=e.target.value}
        />
      </div>
      <div class="field">
        <label>${this._t("blueprint.sidebar_icon")}</label>
        <ha-icon-picker
          .hass=${this.hass}
          .value=${this._pageIcon}
          @value-changed=${e=>this._pageIcon=e.detail.value}
        ></ha-icon-picker>
      </div>

      ${e.length?fe`<div class="section-label">${this._t("blueprint.settings")}</div>`:fe`<p class="hint">${this._t("blueprint.no_fields")}</p>`}
      ${e.map(e=>this._renderField(e,t[e]))}

      <div class="actions">
        <ha-button appearance="plain" @click=${this._backToSource}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._save}>
          ${this._params?.page?this._t("common.save"):this._t("common.add")}
        </ha-button>
      </div>
    `}_renderField(e,t){const i=this._values[e],a=t.name||e;let o;switch(t.type||"text-field"){case"entity-picker":o=fe`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${i||""}
            allow-custom-entity
            @value-changed=${t=>this._setValue(e,t.detail.value)}
          ></ha-entity-picker>
        `;break;case"icon-picker":o=fe`
          <ha-icon-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${t=>this._setValue(e,t.detail.value)}
          ></ha-icon-picker>
        `;break;case"area-picker":o=fe`
          <ha-area-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${t=>this._setValue(e,t.detail.value)}
          ></ha-area-picker>
        `;break;case"boolean":o=fe`
          <ha-switch
            .checked=${!!i}
            @change=${t=>this._setValue(e,t.target.checked)}
          ></ha-switch>
        `;break;case"number":o=fe`
          <input
            class="dd-input"
            type="number"
            .value=${i??""}
            @input=${t=>this._setValue(e,t.target.value)}
          />
        `;break;default:o=fe`
          <input
            class="dd-input"
            .value=${i??""}
            @input=${t=>this._setValue(e,t.target.value)}
          />
        `}return fe`
      <div class="field">
        <label>${a}</label>
        ${t.description?fe`<div class="field-desc">${t.description}</div>`:ye}
        ${o}
      </div>
    `}static get styles(){return j`
      :host {
        --mdc-dialog-min-width: 90vw;
        --mdc-dialog-max-width: 720px;
      }
      ha-dialog {
        --dialog-content-padding: 0;
      }
      .content {
        padding: 8px 24px 20px;
      }
      .error {
        background: rgba(var(--rgb-error-color, 244, 67, 54), 0.12);
        color: var(--error-color, #f44336);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 12px;
        font-size: 14px;
        white-space: pre-wrap;
      }
      .warn {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.12);
        color: var(--warning-color, #ff9800);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 12px;
        font-size: 13px;
      }
      .warn ha-icon {
        flex: 0 0 auto;
      }
      .tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .tab {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 14px;
      }
      .tab.active {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        color: var(--primary-color);
      }
      .tab ha-icon {
        --mdc-icon-size: 18px;
      }
      .hint {
        font-size: 13px;
        color: var(--secondary-text-color);
        margin: 4px 0 10px;
      }
      .dd-yaml {
        width: 100%;
        min-height: 240px;
        box-sizing: border-box;
        resize: vertical;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        line-height: 1.5;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid var(--divider-color);
        background: var(--code-editor-background-color, var(--card-background-color));
        color: var(--primary-text-color);
      }
      .dd-input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }
      .dd-input:focus,
      .dd-yaml:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      .meta {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 12px 14px;
        margin-bottom: 14px;
      }
      .meta-title {
        font-size: 17px;
        font-weight: 600;
      }
      .meta-desc {
        font-size: 13px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }
      .meta-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }
      .chip {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }
      .chip.card {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
        color: var(--primary-color);
      }
      .section-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
        margin: 14px 0 8px;
      }
      .field {
        margin-bottom: 14px;
      }
      .field label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
      }
      .field-desc {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 6px;
      }
      ha-entity-picker,
      ha-icon-picker,
      ha-area-picker {
        display: block;
        width: 100%;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
      .edit-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 4px 0 12px;
      }
      .edit-tools ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 4px;
      }
      .update-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
        color: var(--primary-text-color);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 12px;
        font-size: 13px;
      }
      .gallery {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }
      @media (min-width: 560px) {
        .gallery {
          grid-template-columns: 1fr 1fr;
        }
      }
      .gallery-item {
        display: flex;
        flex-direction: column;
        text-align: left;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        overflow: hidden;
        padding: 0;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .gallery-item:hover {
        border-color: var(--primary-color);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
      }
      .gallery-img {
        width: 100%;
        height: 110px;
        object-fit: cover;
        background: var(--secondary-background-color);
      }
      .gallery-img.placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gallery-img.placeholder ha-icon {
        --mdc-icon-size: 40px;
        color: var(--secondary-text-color);
      }
      .gallery-info {
        padding: 10px 12px;
      }
      .gallery-name {
        font-size: 15px;
        font-weight: 600;
      }
      .gallery-desc {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 2px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .gallery-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }
      code {
        background: var(--secondary-background-color);
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 12px;
      }
    `}};y([Be({attribute:!1})],_o.prototype,"hass",void 0),y([Fe()],_o.prototype,"_params",void 0),y([Fe()],_o.prototype,"_mode",void 0),y([Fe()],_o.prototype,"_gallery",void 0),y([Fe()],_o.prototype,"_galleryLoading",void 0),y([Fe()],_o.prototype,"_galleryError",void 0),y([Fe()],_o.prototype,"_yamlText",void 0),y([Fe()],_o.prototype,"_url",void 0),y([Fe()],_o.prototype,"_loadingUrl",void 0),y([Fe()],_o.prototype,"_error",void 0),y([Fe()],_o.prototype,"_parsed",void 0),y([Fe()],_o.prototype,"_values",void 0),y([Fe()],_o.prototype,"_pageName",void 0),y([Fe()],_o.prototype,"_pageIcon",void 0),y([Fe()],_o.prototype,"_source",void 0),y([Fe()],_o.prototype,"_editYaml",void 0),y([Fe()],_o.prototype,"_checking",void 0),y([Fe()],_o.prototype,"_updateMsg",void 0),y([Fe()],_o.prototype,"_update",void 0),_o=y([Oe("dwains-dashboard-next-blueprint-dialog")],_o);var bo=Object.freeze({__proto__:null,get DwainsBlueprintDialog(){return _o}});export{l as DwainsDashboardStrategy,p as DwainsViewStrategy};
