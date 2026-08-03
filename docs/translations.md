---
title: Languages
---

# Languages

Dwains Dashboard Next follows the language selected in the Home Assistant user profile. No separate dashboard language setting is required.

## Supported Languages

- English (`en`)
- Dutch (`nl`)
- German (`de`)
- French (`fr`)
- Spanish (`es`)
- Traditional Chinese (`zh-Hant`)
- Simplified Chinese (`zh-Hans`)

Regional language codes are supported automatically. For example, `de-DE`, `fr-FR`, and `es-ES` use their matching base language. Chinese script and regional codes such as `zh-Hant`, `zh-Hans`, `zh-TW`, and `zh-CN` are recognized automatically. Unsupported languages fall back to English.

## Translation Files

Translations are stored in `src/i18n/locales`. English is the source dictionary and every supported language must contain the same keys.

Variables inside translations use braces, for example `{count}` or `{name}`. Singular and plural text uses matching `.one` and `.other` keys.

## Validate Translations

Run the translation check before building or publishing:

```bash
npm run i18n:check
```

The check fails when a language is missing a key, contains an empty value, changes required placeholders, or when the dashboard uses an unknown literal translation key.

## Add a Language

1. Copy the English dictionary and translate every value.
2. Add the language to `src/i18n/index.ts`.
3. Keep placeholders unchanged.
4. Run `npm run i18n:check`, `npm run type-check`, and `npm run build`.
