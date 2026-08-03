# Custom Cards

Custom cards let you add manual Home Assistant cards inside Dwains Dashboard Next.

## Where Custom Cards Can Be Added

Custom cards can be placed:

- At the top of an area
- Before generated cards in a domain section
- Between generated domain cards
- After generated cards in a domain section
- At the bottom of an area

## Editing

When edit mode is enabled, custom card slots and card controls are shown. You can add, edit, delete and reorder cards without leaving edit mode.

## YAML

Custom cards use standard Home Assistant card YAML. For example:

```yaml
type: tile
entity: light.living_room
```

## Best Practice

Keep manual cards specific and intentional. Let Dwains Dashboard generate the common entities, then use custom cards for exceptions or richer controls.

## Dwains Dashboard 3 Compatibility

Next includes `custom:dwains-heading-card` for older Dwains Dashboard blueprints. It is built in and does not need to be downloaded separately.

```yaml
type: custom:dwains-heading-card
title: Living room
```
