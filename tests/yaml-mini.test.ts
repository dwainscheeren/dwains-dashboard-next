import { describe, expect, it } from 'vitest';
import { parseYaml } from '../src/utils/yaml-mini';
import { parseBlueprintYaml } from '../src/utils/blueprints';

const yaml = (lines: string[]) => lines.join('\n') + '\n';

describe('parseYaml: blueprints', () => {
  it('parses a realistic page blueprint', () => {
    const doc = parseYaml(yaml([
      '# Dwains Dashboard blueprint',
      'blueprint:',
      '  name: Living room lights',
      '  description: "Lights: all of them # not a comment"',
      '  version: "1.0"',
      '  type: page',
      '  custom_cards:',
      '    - mushroom',
      '    - card-mod',
      '  input:',
      '    entity:',
      '      name: Main light',
      '      type: entity-picker',
      '    columns:',
      '      name: Columns',
      '      type: number',
      '      default: 2',
      '    show_name:',
      '      type: boolean',
      '      default: true',
      'card:',
      '  type: grid',
      '  columns: $columns$',
      '  cards:',
      '    - type: tile',
      '      entity: $entity$',
      '      tap_action:',
      '        action: toggle',
      '    - type: markdown',
      '      content: >',
      '        Folded text',
      '        on two lines',
    ]));

    expect(doc).toEqual({
      blueprint: {
        name: 'Living room lights',
        description: 'Lights: all of them # not a comment',
        version: '1.0',
        type: 'page',
        custom_cards: ['mushroom', 'card-mod'],
        input: {
          entity: { name: 'Main light', type: 'entity-picker' },
          columns: { name: 'Columns', type: 'number', default: 2 },
          show_name: { type: 'boolean', default: true },
        },
      },
      card: {
        type: 'grid',
        columns: '$columns$',
        cards: [
          { type: 'tile', entity: '$entity$', tap_action: { action: 'toggle' } },
          { type: 'markdown', content: 'Folded text on two lines\n' },
        ],
      },
    });
  });

  it('feeds parseBlueprintYaml', () => {
    const parsed = parseBlueprintYaml(yaml([
      'blueprint:',
      "  name: Dwain's lamp",
      '  input:',
      '    lamp:',
      '      type: entity-picker',
      'card:',
      '  type: tile',
      '  entity: $lamp$',
    ]));
    expect(parsed.meta.name).toBe("Dwain's lamp");
    expect(parsed.meta.input).toEqual({
      lamp: { name: 'lamp', description: undefined, type: 'entity-picker', default: undefined },
    });
    expect(parsed.card).toEqual({ type: 'tile', entity: '$lamp$' });
  });

  it('accepts a sequence at the same indent as its key', () => {
    expect(parseYaml(yaml([
      'cards:',
      '- type: tile',
      '  entity: light.a',
      '- type: tile',
      '  entity: light.b',
      'title: Lights',
    ]))).toEqual({
      cards: [
        { type: 'tile', entity: 'light.a' },
        { type: 'tile', entity: 'light.b' },
      ],
      title: 'Lights',
    });
  });

  it('parses nested sequences of maps', () => {
    expect(parseYaml(yaml([
      'type: vertical-stack',
      'cards:',
      '  - type: horizontal-stack',
      '    cards:',
      '      - type: button',
      '        entity: switch.a',
      '      - type: button',
      '        entity: switch.b',
      '  - type: entities',
      '    entities:',
      '      - light.a',
      '      - entity: light.b',
      '        name: Lamp B',
    ]))).toEqual({
      type: 'vertical-stack',
      cards: [
        {
          type: 'horizontal-stack',
          cards: [
            { type: 'button', entity: 'switch.a' },
            { type: 'button', entity: 'switch.b' },
          ],
        },
        { type: 'entities', entities: ['light.a', { entity: 'light.b', name: 'Lamp B' }] },
      ],
    });
  });

  it('keeps all keys of a list item written with extra spaces after the dash', () => {
    expect(parseYaml(yaml([
      'cards:',
      '  -   type: tile',
      '      entity: light.kitchen',
      '  -   type: button',
      '      name: Hall',
      'title: After the list',
    ]))).toEqual({
      cards: [
        { type: 'tile', entity: 'light.kitchen' },
        { type: 'button', name: 'Hall' },
      ],
      title: 'After the list',
    });
  });

  it('parses a list item whose map starts on the next line', () => {
    expect(parseYaml(yaml([
      'cards:',
      '  -',
      '    type: tile',
      '    entity: light.a',
    ]))).toEqual({ cards: [{ type: 'tile', entity: 'light.a' }] });
  });
});

describe('parseYaml: scalars', () => {
  it('types plain scalars', () => {
    expect(parseYaml(yaml([
      'int: 42',
      'negative: -7',
      'float: 2.5',
      'exp: 1e3',
      'yes_bool: true',
      'no_bool: False',
      'nothing: null',
      'tilde: ~',
      'empty:',
      'version_string: 1.2.3',
      'entity: sensor.temperature',
      'on_state: on',
    ]))).toEqual({
      int: 42,
      negative: -7,
      float: 2.5,
      exp: 1000,
      yes_bool: true,
      no_bool: false,
      nothing: null,
      tilde: null,
      empty: null,
      version_string: '1.2.3',
      entity: 'sensor.temperature',
      on_state: 'on',
    });
  });

  it('keeps quoted values as strings', () => {
    expect(parseYaml(yaml([
      'a: "42"',
      "b: 'true'",
      'c: "null"',
      'd: ""',
    ]))).toEqual({ a: '42', b: 'true', c: 'null', d: '' });
  });

  it('keeps # and : inside quoted strings', () => {
    expect(parseYaml(yaml([
      'color: "#ff0000"',
      "time: '12:30'",
      'title: "Hello: world # really" # a real comment',
      "label: 'it''s # fine'",
    ]))).toEqual({
      color: '#ff0000',
      time: '12:30',
      title: 'Hello: world # really',
      label: "it's # fine",
    });
  });

  it('only strips # comments that follow whitespace', () => {
    expect(parseYaml(yaml([
      'url: https://example.com/page#anchor',
      'tag: C#',
      'value: 5 # five',
    ]))).toEqual({ url: 'https://example.com/page#anchor', tag: 'C#', value: 5 });
  });

  it('keeps apostrophes in plain scalars', () => {
    expect(parseYaml(yaml([
      "name: Dwain's lamp",
      "description: It's on: or off",
      'next: 1',
    ]))).toEqual({ name: "Dwain's lamp", description: "It's on: or off", next: 1 });
  });

  it('strips comments after a plain scalar with an apostrophe', () => {
    expect(parseYaml(yaml([
      "name: Dwain's lamp # the reading lamp",
      "  # Dwain's note",
      'next: 1',
    ]))).toEqual({ name: "Dwain's lamp", next: 1 });
  });

  it('accepts apostrophes in keys and list items', () => {
    expect(parseYaml(yaml([
      "Dwain's lamp: light.reading",
      'items:',
      "  - it's here",
      "  - name: Kid's room",
      '    icon: mdi:teddy-bear',
    ]))).toEqual({
      "Dwain's lamp": 'light.reading',
      items: ["it's here", { name: "Kid's room", icon: 'mdi:teddy-bear' }],
    });
  });

  it('keeps double quotes inside plain scalars', () => {
    expect(parseYaml(yaml([
      'size: 6" screen # inches',
      'next: 1',
    ]))).toEqual({ size: '6" screen', next: 1 });
  });

  it('decodes escapes in double-quoted strings once', () => {
    expect(parseYaml(yaml([
      'path: "C:\\\\new"',
      'lines: "one\\ntwo"',
      'tab: "a\\tb"',
      'quote: "say \\"hi\\" # not a comment"',
      'unicode: "caf\\u00e9"',
      "single: 'C:\\new'",
    ]))).toEqual({
      path: 'C:\\new',
      lines: 'one\ntwo',
      tab: 'a\tb',
      quote: 'say "hi" # not a comment',
      unicode: 'café',
      single: 'C:\\new',
    });
  });

  it('parses quoted keys', () => {
    expect(parseYaml(yaml([
      '"light.living_room": Living',
      "'key: with colon': 1",
    ]))).toEqual({ 'light.living_room': 'Living', 'key: with colon': 1 });
  });

  it('parses flow collections', () => {
    expect(parseYaml(yaml([
      'list: [light.a, light.b, 3]',
      'map: {action: toggle, count: 2}',
      'json: {"a": [1, 2]}',
      'empty_list: []',
      'empty_map: {}',
      "quoted: ['a, b', \"c\"]",
    ]))).toEqual({
      list: ['light.a', 'light.b', 3],
      map: { action: 'toggle', count: 2 },
      json: { a: [1, 2] },
      empty_list: [],
      empty_map: {},
      quoted: ['a, b', 'c'],
    });
  });

  it('folds plain scalars that continue on indented lines', () => {
    expect(parseYaml(yaml([
      'description: A long description',
      '  that continues here',
      '  and here.',
      'name: Next key',
    ]))).toEqual({
      description: 'A long description that continues here and here.',
      name: 'Next key',
    });
  });

  it('folds quoted scalars that continue on indented lines', () => {
    expect(parseYaml(yaml([
      'description: "Line one',
      '  line two # still text"',
      'name: Next key',
    ]))).toEqual({ description: 'Line one line two # still text', name: 'Next key' });
  });

  it('joins an escaped line break in a double-quoted scalar without a space', () => {
    expect(parseYaml(yaml([
      'text: "no space\\',
      '  \\ here, one\\',
      '  word"',
    ]))).toEqual({ text: 'no space here, oneword' });
  });
});

describe('parseYaml: block scalars', () => {
  it('keeps line breaks in literal blocks', () => {
    expect(parseYaml(yaml([
      'content: |',
      '  # Heading, not a comment',
      '  Line two',
      '',
      '  Line four',
      'next: 1',
    ]))).toEqual({ content: '# Heading, not a comment\nLine two\n\nLine four\n', next: 1 });
  });

  it('supports chomping indicators', () => {
    expect(parseYaml(yaml([
      'strip: |-',
      '  text',
      'keep: |+',
      '  text',
      '',
      'folded: >-',
      '  a',
      '  b',
      '',
      '  c',
    ]))).toEqual({ strip: 'text', keep: 'text\n\n', folded: 'a b\nc' });
  });

  it('keeps trailing blank lines with |+ at the end of the document', () => {
    expect(parseYaml('text: |+\n  a\n\n')).toEqual({ text: 'a\n\n' });
    expect(parseYaml('text: |\n  a\n\n')).toEqual({ text: 'a\n' });
  });

  it('keeps line breaks around more-indented lines in folded blocks', () => {
    expect(parseYaml(yaml([
      'text: >',
      '  Paragraph one',
      '  continues',
      '',
      '    indented code',
      '  back',
      'next: 1',
    ]))).toEqual({ text: 'Paragraph one continues\n\n  indented code\nback\n', next: 1 });
  });

  it('supports block scalars as list items', () => {
    expect(parseYaml(yaml([
      'items:',
      '  - |',
      '    first',
      '    second',
      '  - plain',
    ]))).toEqual({ items: ['first\nsecond\n', 'plain'] });
  });

  it('keeps nested templates inside a literal block', () => {
    expect(parseYaml(yaml([
      'card:',
      '  type: markdown',
      '  content: |',
      "    {% if is_state('light.a', 'on') %}",
      '      On: {{ states("sensor.x") }}',
      '    {% endif %}',
    ]))).toEqual({
      card: {
        type: 'markdown',
        content: "{% if is_state('light.a', 'on') %}\n  On: {{ states(\"sensor.x\") }}\n{% endif %}\n",
      },
    });
  });
});

describe('parseYaml: documents', () => {
  it('returns null for an empty document', () => {
    expect(parseYaml('')).toBeNull();
    expect(parseYaml('# only a comment\n\n')).toBeNull();
  });

  it('ignores the document start marker and CRLF line endings', () => {
    expect(parseYaml('---\r\ntype: tile\r\nentity: light.a\r\n')).toEqual({ type: 'tile', entity: 'light.a' });
  });

  it('parses a top-level sequence', () => {
    expect(parseYaml(yaml(['- a', '- b: 1', '  c: 2']))).toEqual(['a', { b: 1, c: 2 }]);
  });
});
