export type Lang = 'en' | 'nl';

export const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    // Common
    'common.save': 'Save',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.add': 'Add',
    'common.next': 'Next',
    'common.edit': 'Edit',
    'common.delete': 'Delete',

    // Sidebar
    'sidebar.home': 'Home',
    'sidebar.add_blueprint': 'Add blueprint',
    'sidebar.dashboard_settings': 'Dashboard settings',
    'sidebar.section_title': 'Dwains Dashboard',
    'sidebar.areas': 'Areas',

    // Favorites
    'favorites.title': 'Favorites',

    // Person status
    'person.home': 'Home',
    'person.away': 'Away',

    // Layout card — custom cards / pages / edit toggles
    'layout.custom_cards': 'Custom cards',
    'layout.add_card': 'Add card',
    'layout.done_editing': 'Done editing',
    'layout.edit_custom_cards': 'Edit custom cards',
    'layout.edit_page': 'Edit page',
    'layout.page_settings': 'Settings / fill in again',
    'layout.delete_page': 'Delete page',
    'layout.delete_page_confirm': 'Delete page "{name}"?',
    'layout.delete_card_confirm': 'Delete this card?',
    'layout.save_page_failed': 'Could not save the page (see console):\n{error}',
    'layout.save_card_failed': 'Could not save the card (see console):\n{error}',

    // Blueprint page (tab) wrapper
    'page.add_title': 'Add a blueprint page',
    'page.add_desc': 'Import a blueprint to add it as a new tab in the top menu.',

    // Blueprint dialog
    'blueprint.title_add': 'Add blueprint',
    'blueprint.title_setup': 'Set up blueprint',
    'blueprint.title_edit': 'Edit page',
    'blueprint.tab_paste': 'Paste',
    'blueprint.tab_url': 'From URL',
    'blueprint.tab_gallery': 'Gallery',
    'blueprint.gallery_hint': 'Choose a blueprint from the official list.',
    'blueprint.gallery_empty': 'No blueprints found.',
    'blueprint.gallery_failed': 'Could not load the blueprint list: {error}',
    'blueprint.paste_hint': 'Paste the full blueprint YAML (page.yaml) here.',
    'blueprint.url_hint_html':
      'Paste a GitHub URL to the <code>page.yaml</code> (or its folder). I will fetch the blueprint automatically.',
    'blueprint.loading': 'Loading…',
    'blueprint.fetch': 'Fetch',
    'blueprint.invalid_url': 'Enter a valid URL.',
    'blueprint.fetch_failed': 'Fetch failed (HTTP {status}).',
    'blueprint.load_failed':
      "Could not load the blueprint: {error}. Tip: use the 'raw' URL of the page.yaml file or paste the YAML.",
    'blueprint.fill_failed': 'Filling in failed: {error}',
    'blueprint.new_page': 'New page',
    'blueprint.page_fallback': 'Page',
    'blueprint.missing_cards':
      'These card(s) do not seem to be installed yet: {cards}. Install them via HACS, otherwise those cards will stay empty.',
    'blueprint.page_name': 'Page name',
    'blueprint.sidebar_icon': 'Sidebar icon',
    'blueprint.settings': 'Settings',
    'blueprint.no_fields': 'This blueprint has no configurable fields.',
    'blueprint.edit_yaml': 'Edit YAML',
    'blueprint.apply': 'Apply',
    'blueprint.check_update': 'Check for update',
    'blueprint.checking': 'Checking…',
    'blueprint.up_to_date': 'Already up to date (v{version}).',
    'blueprint.update_available': 'New version available: v{new} (current v{current}).',
    'blueprint.source_missing':
      'No source URL found and no matching official blueprint was found in the gallery.',
    'blueprint.update': 'Update',

    // Card editor dialog
    'card_editor.title_add': 'Add card',
    'card_editor.title_setup': 'Set up card',
    'card_editor.title_edit': 'Edit card',
    'card_editor.search': 'Search card',
    'card_editor.visual_editor': 'Visual editor',
    'card_editor.code_editor': 'Code editor',
    'card_editor.loading': 'Loading editor…',
    'card_editor.preview': 'Preview',
    'card_editor.no_preview': 'No preview for this card type.',

    // Card types
    'card_type.tile.label': 'Tile',
    'card_type.tile.desc': 'Compact card for a single entity with quick controls.',
    'card_type.entities.label': 'Entities',
    'card_type.entities.desc': 'List of entities with state and controls.',
    'card_type.button.label': 'Button',
    'card_type.button.desc': 'Large button to toggle an entity.',
    'card_type.gauge.label': 'Gauge',
    'card_type.gauge.desc': 'Shows a numeric value as a gauge.',
    'card_type.history.label': 'Graph',
    'card_type.history.desc': 'Historical graph of entities.',
    'card_type.sensor.label': 'Sensor',
    'card_type.sensor.desc': 'Sensor value with an optional graph.',
    'card_type.thermostat.label': 'Thermostat',
    'card_type.thermostat.desc': 'Controls for a climate entity.',
    'card_type.weather.label': 'Weather',
    'card_type.weather.desc': 'Weather forecast.',
    'card_type.markdown.label': 'Markdown',
    'card_type.markdown.desc': 'Free text with formatting and templates.',
    'card_type.picture.label': 'Image',
    'card_type.picture.desc': 'Shows an image or camera.',
    'card_type.glance.label': 'Glance',
    'card_type.glance.desc': 'Compact overview of multiple entities.',
    'card_type.media.label': 'Media',
    'card_type.media.desc': 'Controls for a media player.',
    'card_type.manual.label': 'Manual (YAML)',
    'card_type.manual.desc': 'Type or paste the YAML for any card yourself.',

    // Strategy editor
    'strategy.dashboard_desc': 'Adjust the name and sidebar icon of this dashboard.',
    'strategy.name': 'Name',
    'strategy.sidebar_icon': 'Sidebar icon',
    'strategy.back': 'Back',
    'strategy.save_name_failed': 'Saving name/icon failed (see console):\n{error}',
    'strategy.edit_area_alert': 'Open Home Assistant settings > Areas & zones to edit the area.',

    // Devices page
    'devices.title': 'Devices',
    'devices.empty': 'No devices found.',
  },
  nl: {
    // Common
    'common.save': 'Opslaan',
    'common.back': 'Terug',
    'common.close': 'Sluiten',
    'common.add': 'Toevoegen',
    'common.next': 'Volgende',
    'common.edit': 'Bewerken',
    'common.delete': 'Verwijderen',

    // Sidebar
    'sidebar.home': 'Home',
    'sidebar.add_blueprint': 'Blueprint toevoegen',
    'sidebar.dashboard_settings': 'Dashboard-instellingen',
    'sidebar.section_title': 'Dwains Dashboard',
    'sidebar.areas': 'Ruimtes',

    // Favorites
    'favorites.title': 'Favorieten',

    // Person status
    'person.home': 'Home',
    'person.away': 'Away',

    // Layout card — custom cards / pages / edit toggles
    'layout.custom_cards': 'Eigen kaarten',
    'layout.add_card': 'Kaart toevoegen',
    'layout.done_editing': 'Klaar met bewerken',
    'layout.edit_custom_cards': 'Eigen kaarten bewerken',
    'layout.edit_page': 'Pagina bewerken',
    'layout.page_settings': 'Instellingen / opnieuw invullen',
    'layout.delete_page': 'Pagina verwijderen',
    'layout.delete_page_confirm': 'Pagina "{name}" verwijderen?',
    'layout.delete_card_confirm': 'Deze kaart verwijderen?',
    'layout.save_page_failed': 'Kon de pagina niet opslaan (zie console):\n{error}',
    'layout.save_card_failed': 'Kon de kaart niet opslaan (zie console):\n{error}',

    // Blueprint page (tab) wrapper
    'page.add_title': 'Blueprint-pagina toevoegen',
    'page.add_desc': 'Importeer een blueprint om hem als nieuwe tab in het hoofdmenu te zetten.',

    // Blueprint dialog
    'blueprint.title_add': 'Blueprint toevoegen',
    'blueprint.title_setup': 'Blueprint instellen',
    'blueprint.title_edit': 'Pagina bewerken',
    'blueprint.tab_paste': 'Plakken',
    'blueprint.tab_url': 'Van URL',
    'blueprint.tab_gallery': 'Galerij',
    'blueprint.gallery_hint': 'Kies een blueprint uit de officiële lijst.',
    'blueprint.gallery_empty': 'Geen blueprints gevonden.',
    'blueprint.gallery_failed': 'Kon de blueprint-lijst niet laden: {error}',
    'blueprint.paste_hint': 'Plak hier de volledige blueprint-YAML (page.yaml).',
    'blueprint.url_hint_html':
      'Plak een GitHub-URL naar het <code>page.yaml</code> (of de map ervan). Ik haal de blueprint automatisch op.',
    'blueprint.loading': 'Laden…',
    'blueprint.fetch': 'Ophalen',
    'blueprint.invalid_url': 'Geef een geldige URL op.',
    'blueprint.fetch_failed': 'Ophalen mislukt (HTTP {status}).',
    'blueprint.load_failed':
      "Kon de blueprint niet laden: {error}. Tip: gebruik de 'raw' URL van het page.yaml-bestand of plak de YAML.",
    'blueprint.fill_failed': 'Invullen mislukt: {error}',
    'blueprint.new_page': 'Nieuwe pagina',
    'blueprint.page_fallback': 'Pagina',
    'blueprint.missing_cards':
      'Deze kaart(en) lijken nog niet geïnstalleerd: {cards}. Installeer ze via HACS, anders blijven die kaarten leeg.',
    'blueprint.page_name': 'Paginanaam',
    'blueprint.sidebar_icon': 'Icoon in zijbalk',
    'blueprint.settings': 'Instellingen',
    'blueprint.no_fields': 'Deze blueprint heeft geen instelbare velden.',
    'blueprint.edit_yaml': 'YAML bewerken',
    'blueprint.apply': 'Toepassen',
    'blueprint.check_update': 'Controleer op update',
    'blueprint.checking': 'Controleren…',
    'blueprint.up_to_date': 'Al up-to-date (v{version}).',
    'blueprint.update_available': 'Nieuwe versie beschikbaar: v{new} (huidig v{current}).',
    'blueprint.source_missing':
      'Geen bron-URL gevonden en geen match met een officiële blueprint in de galerij.',
    'blueprint.update': 'Bijwerken',

    // Card editor dialog
    'card_editor.title_add': 'Kaart toevoegen',
    'card_editor.title_setup': 'Kaart instellen',
    'card_editor.title_edit': 'Kaart bewerken',
    'card_editor.search': 'Zoek kaart',
    'card_editor.visual_editor': 'Visuele editor',
    'card_editor.code_editor': 'Code-editor',
    'card_editor.loading': 'Editor laden…',
    'card_editor.preview': 'Voorbeeld',
    'card_editor.no_preview': 'Geen voorbeeld voor dit kaarttype.',

    // Card types
    'card_type.tile.label': 'Tegel',
    'card_type.tile.desc': 'Compacte kaart voor één entiteit met snelle bediening.',
    'card_type.entities.label': 'Entiteiten',
    'card_type.entities.desc': 'Lijst van entiteiten met status en bediening.',
    'card_type.button.label': 'Knop',
    'card_type.button.desc': 'Grote knop om een entiteit te schakelen.',
    'card_type.gauge.label': 'Meter',
    'card_type.gauge.desc': 'Toont een numerieke waarde als meter.',
    'card_type.history.label': 'Grafiek',
    'card_type.history.desc': 'Historische grafiek van entiteiten.',
    'card_type.sensor.label': 'Sensor',
    'card_type.sensor.desc': 'Sensorwaarde met optionele grafiek.',
    'card_type.thermostat.label': 'Thermostaat',
    'card_type.thermostat.desc': 'Bediening voor een klimaat-entiteit.',
    'card_type.weather.label': 'Weer',
    'card_type.weather.desc': 'Weersvoorspelling.',
    'card_type.markdown.label': 'Markdown',
    'card_type.markdown.desc': 'Vrije tekst met opmaak en templates.',
    'card_type.picture.label': 'Afbeelding',
    'card_type.picture.desc': 'Toont een afbeelding of camera.',
    'card_type.glance.label': 'Glance',
    'card_type.glance.desc': 'Compact overzicht van meerdere entiteiten.',
    'card_type.media.label': 'Media',
    'card_type.media.desc': 'Bediening voor een mediaspeler.',
    'card_type.manual.label': 'Handmatig (YAML)',
    'card_type.manual.desc': 'Typ of plak zelf de YAML voor elke kaart.',

    // Strategy editor
    'strategy.dashboard_desc': 'Pas de naam en het zijbalk-icoon van dit dashboard aan.',
    'strategy.name': 'Naam',
    'strategy.sidebar_icon': 'Zijbalk-icoon',
    'strategy.back': 'Terug',
    'strategy.save_name_failed': 'Naam/icoon opslaan mislukt (zie console):\n{error}',
    'strategy.edit_area_alert':
      'Open Home Assistant settings > Areas & zones to edit the area.',

    // Devices page
    'devices.title': 'Apparaten',
    'devices.empty': 'Geen apparaten gevonden.',
  },
};
