# Blueprints

Blueprints let you install reusable dashboard pages and card replacements.

## Install Blueprints

1. Open the Add blueprint dialog.
2. Choose a blueprint from the gallery, paste YAML, or load from a URL.
3. Fill in the required fields.
4. Save.

## Page Blueprints

Page blueprints add complete pages to the More pages section.

## Replacement Blueprints

Replacement blueprints can replace generated entity cards for domains such as lights, covers or climate.

## Blueprint Gallery

The blueprint gallery is loaded from a `blueprints.json` file. Each item points to a raw blueprint YAML file.

Example:

```json
{
  "blueprints": [
    {
      "name": "Birthdays",
      "description": "Birthday page with calendar support.",
      "type": "page",
      "author": "Dwain Scheeren",
      "version": "1.0.0",
      "url": "https://raw.githubusercontent.com/example/repo/main/page.yaml"
    }
  ]
}
```
