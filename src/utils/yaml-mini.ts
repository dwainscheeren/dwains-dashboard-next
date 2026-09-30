/**
 * yaml-mini — compacte, dependency-vrije YAML-parser.
 *
 * Genoeg voor Dwains Dashboard blueprints en Lovelace card-configs:
 *  - geneste mappings (op basis van inspringing)
 *  - sequences ("- item", ook "- key: value")
 *  - block scalars: literal "|" en folded ">", met chomping "-"/"+"
 *  - enkel/dubbel-gequote strings, ook verdeeld over meerdere regels
 *  - platte tekst die op dieper ingesprongen regels doorloopt
 *  - inline #-comments en comment-regels
 *  - automatische typering van plain scalars (number/bool/null), de rest blijft string
 *
 * Bewust NIET ondersteund (komt in blueprints niet voor): anchors/aliases,
 * complexe flow-collections met geneste quotes, tags. Flow [..]/{..} op één
 * regel wordt wel best-effort geparsed.
 */

type Json = any;

interface Line {
  indent: number;
  content: string; // zonder inspringing, zonder trailing comment
  raw: string; // originele regel (voor block scalars)
}

export function parseYaml(input: string): Json {
  const rawLines = input.replace(/\r\n?/g, '\n').split('\n');
  // De afsluitende newline van het document is geen extra lege regel (telt mee bij "|+").
  if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') rawLines.pop();
  // Voorbewerken: bewaar originele regels; comment/strip doen we per-context.
  const lines: Line[] = [];
  for (const raw of rawLines) {
    const indent = raw.length - raw.replace(/^\s+/, '').length;
    const stripped = raw.slice(indent);
    lines.push({ indent, content: stripDocMarkersAndComments(stripped), raw });
  }
  const ctx = { lines, i: 0 };
  // Sla leidende lege/comment-regels en document-marker over
  skipBlank(ctx);
  if (ctx.i >= lines.length) return null;
  const baseIndent = lines[ctx.i]!.indent;
  return parseBlock(ctx, baseIndent);
}

function stripDocMarkersAndComments(s: string): string {
  if (s === '---' || s === '...') return '';
  return stripInlineComment(s).replace(/\s+$/, '');
}

/**
 * Loop over de tekens van een regel die buiten gequote strings vallen.
 * Een quote opent alleen een gequote string aan het begin van een waarde,
 * dus een apostrof in platte tekst ("Dwain's lamp") blijft gewoon tekst.
 * Binnen "..." escapet een backslash het volgende teken, binnen '...' is ''
 * een apostrof. Stop zodra visit true teruggeeft.
 */
function forEachUnquoted(s: string, visit: (index: number) => boolean | void): void {
  let quote: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    if (quote === '"') {
      if (c === '\\') i++;
      else if (c === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (c === "'") {
        if (s[i + 1] === "'") i++;
        else quote = null;
      }
      continue;
    }
    if ((c === '"' || c === "'") && opensQuote(s, i)) {
      quote = c;
      continue;
    }
    if (visit(i)) return;
  }
}

// Een quote begint een string aan het regelbegin, na "key: ", na "- " of na
// een flow-teken ([ { ,). Midden in platte tekst is het een gewoon teken.
function opensQuote(s: string, i: number): boolean {
  let j = i - 1;
  while (j >= 0 && (s[j] === ' ' || s[j] === '\t')) j--;
  if (j < 0) return true;
  const prev = s[j];
  if (prev === '[' || prev === '{' || prev === ',') return true;
  return (prev === ':' || prev === '-' || prev === '?') && j < i - 1;
}

// Verwijder een #-comment buiten quotes.
function stripInlineComment(s: string): string {
  let end = s.length;
  forEachUnquoted(s, (i) => {
    // comment moet voorafgegaan worden door whitespace (of regelbegin)
    if (s[i] === '#' && (i === 0 || /\s/.test(s[i - 1]!))) {
      end = i;
      return true;
    }
    return false;
  });
  return s.slice(0, end);
}

function isBlank(l: Line): boolean {
  return l.content.trim() === '';
}

function skipBlank(ctx: { lines: Line[]; i: number }) {
  while (ctx.i < ctx.lines.length && isBlank(ctx.lines[ctx.i]!)) ctx.i++;
}

function parseBlock(ctx: { lines: Line[]; i: number }, indent: number): Json {
  skipBlank(ctx);
  if (ctx.i >= ctx.lines.length) return null;
  const line = ctx.lines[ctx.i]!;
  if (line.indent < indent) return null;
  if (line.content.startsWith('- ') || line.content === '-') {
    return parseSequence(ctx, line.indent);
  }
  return parseMapping(ctx, line.indent);
}

function parseSequence(ctx: { lines: Line[]; i: number }, indent: number): Json[] {
  const arr: Json[] = [];
  while (ctx.i < ctx.lines.length) {
    skipBlank(ctx);
    if (ctx.i >= ctx.lines.length) break;
    const line = ctx.lines[ctx.i]!;
    if (line.indent < indent || !(line.content === '-' || line.content.startsWith('- '))) break;
    if (line.indent > indent) break;

    const after = line.content.slice(1).replace(/^\s+/, '');
    if (after === '') {
      // Item-inhoud staat op volgende regels
      ctx.i++;
      arr.push(parseBlock(ctx, indent + 1));
      continue;
    }
    // Inline na "- ": de kolom waar de inhoud echt begint, ook bij "-   key".
    const childIndent = indent + line.content.length - after.length;
    if (isMappingEntry(after)) {
      // "- key: value" => mapping waarvan eerste regel inline staat
      // Herschrijf huidige regel als mapping-regel en parse mapping op childIndent
      ctx.lines[ctx.i] = { indent: childIndent, content: after, raw: line.raw };
      arr.push(parseMapping(ctx, childIndent));
    } else {
      // Plain scalar of block-scalar achter "- ": consumeer eerst deze regel.
      ctx.i++;
      arr.push(parseScalarOrBlock(ctx, after, indent + 1));
    }
  }
  return arr;
}

function parseMapping(ctx: { lines: Line[]; i: number }, indent: number): Json {
  const obj: Record<string, Json> = {};
  while (ctx.i < ctx.lines.length) {
    skipBlank(ctx);
    if (ctx.i >= ctx.lines.length) break;
    const line = ctx.lines[ctx.i]!;
    if (line.indent < indent) break;
    if (line.indent > indent) break; // hoort bij een geneste structuur die al verwerkt had moeten zijn
    if (line.content === '-' || line.content.startsWith('- ')) break; // sequence hoort niet hier

    const { key, rest } = splitKey(line.content);
    if (key === null) {
      // Geen geldige mapping-regel; stop
      break;
    }
    ctx.i++;
    if (rest === '') {
      // Waarde op volgende regel(s): nested block of niets
      skipBlank(ctx);
      const next = ctx.lines[ctx.i];
      if (next && (next.indent > indent || (next.indent === indent && isSequenceLine(next)))) {
        obj[key] = parseBlock(ctx, next.indent);
      } else {
        obj[key] = null;
      }
    } else {
      obj[key] = parseScalarOrBlock(ctx, rest, indent + 1);
    }
  }
  return obj;
}

function isSequenceLine(line: Line): boolean {
  return line.content === '-' || line.content.startsWith('- ');
}

// Bepaal of een fragment (na "- ") een mapping-entry begint, bv "type: x".
function isMappingEntry(s: string): boolean {
  return splitKey(s).key !== null;
}

// Split "key: value" → key + rest. Houdt rekening met quotes in de key.
function splitKey(s: string): { key: string | null; rest: string } {
  let result: { key: string | null; rest: string } = { key: null, rest: '' };
  forEachUnquoted(s, (i) => {
    if (s[i] !== ':') return false;
    const after = s[i + 1];
    if (after !== undefined && after !== ' ' && after !== '\t') return false;
    result = { key: unquote(s.slice(0, i).trim()), rest: s.slice(i + 1).trim() };
    return true;
  });
  return result;
}

// Verwerk een inline waarde die ook een block-scalar (| of >) kan zijn.
// childIndent is de minimale inspringing van regels die bij de waarde horen.
function parseScalarOrBlock(
  ctx: { lines: Line[]; i: number },
  value: string,
  childIndent: number
): Json {
  const m = value.match(/^([|>])([+-]?)(\d*)\s*$/);
  if (m) {
    return parseBlockScalar(ctx, m[1] as '|' | '>', m[2] ?? '', childIndent);
  }
  return parseScalar(withContinuationLines(ctx, value, childIndent));
}

/**
 * Een platte of gequote waarde mag doorlopen op dieper ingesprongen regels.
 * YAML vouwt die regelovergangen tot een spatie; een lege regel wordt een
 * newline. Zonder dit ging de rest van de mapping stilletjes verloren.
 */
function withContinuationLines(
  ctx: { lines: Line[]; i: number },
  value: string,
  childIndent: number
): string {
  const t = value.trim();
  const quote = t[0] === '"' || t[0] === "'" ? t[0] : '';
  if (quote ? isClosedQuote(t) : t[0] === '[' || t[0] === '{') return value;

  let text = t;
  let blankLines = 0;
  for (let j = ctx.i; j < ctx.lines.length; j++) {
    const line = ctx.lines[j]!;
    if (line.raw.trim() === '') {
      blankLines++;
      continue;
    }
    if (line.indent < childIndent) break;
    // In een gequote string is # gewoon tekst; bij platte tekst stopt een comment-regel.
    const part = quote ? line.raw.trim() : line.content.trim();
    if (part === '') break;
    if (quote === '"' && !blankLines && /(^|[^\\])(\\\\)*\\$/.test(text)) {
      // "...\" aan het regeleinde: ge-escapete regelovergang, zonder spatie plakken.
      text = text.slice(0, -1);
    } else {
      text += blankLines ? '\n'.repeat(blankLines) : ' ';
    }
    text += part;
    blankLines = 0;
    ctx.i = j + 1;
    if (quote && isClosedQuote(text)) break;
  }
  return quote ? stripInlineComment(text) : text;
}

// Is de gequote string die op positie 0 begint ook weer gesloten?
function isClosedQuote(s: string): boolean {
  const quote = s[0];
  for (let i = 1; i < s.length; i++) {
    const c = s[i];
    if (quote === '"' && c === '\\') i++;
    else if (c === quote) {
      if (quote === "'" && s[i + 1] === "'") i++;
      else return true;
    }
  }
  return false;
}

function parseBlockScalar(
  ctx: { lines: Line[]; i: number },
  style: '|' | '>',
  chomp: string,
  parentIndent: number
): string {
  const collected: { text: string; indent: number; blank: boolean }[] = [];
  let blockIndent = -1;
  while (ctx.i < ctx.lines.length) {
    const line = ctx.lines[ctx.i]!;
    const isEmpty = line.raw.trim() === '';
    if (isEmpty) {
      collected.push({ text: '', indent: 0, blank: true });
      ctx.i++;
      continue;
    }
    const ind = line.raw.length - line.raw.replace(/^\s+/, '').length;
    if (ind < parentIndent) break;
    if (blockIndent === -1) blockIndent = ind;
    if (ind < blockIndent) break;
    collected.push({ text: line.raw.slice(blockIndent), indent: ind, blank: false });
    ctx.i++;
  }
  // Verwijder trailing lege regels voor verwerking (chomping bepaalt herstel)
  let trailingBlanks = 0;
  while (collected.length && collected[collected.length - 1]!.blank) {
    trailingBlanks++;
    collected.pop();
  }
  let body: string;
  if (style === '|') {
    body = collected.map((c) => c.text).join('\n');
  } else {
    // folded: join met spatie; n lege regels tussen tekst worden n newlines,
    // en meer-ingesprongen regels behouden hun newline
    body = '';
    const moreIndented = (x: { text: string }) => /^[ \t]/.test(x.text);
    let prev: { text: string } | null = null;
    let blanks = 0;
    for (const c of collected) {
      if (c.blank) {
        blanks++;
        continue;
      }
      if (prev === null) body += '\n'.repeat(blanks);
      else if (moreIndented(prev) || moreIndented(c)) body += '\n'.repeat(blanks + 1);
      else body += blanks ? '\n'.repeat(blanks) : ' ';
      body += c.text;
      prev = c;
      blanks = 0;
    }
  }
  // Chomping
  if (chomp === '-') {
    return body;
  } else if (chomp === '+') {
    return body + '\n'.repeat(trailingBlanks + 1);
  }
  // clip (default): één trailing newline indien er inhoud is
  return body.length ? body + '\n' : body;
}

function parseScalar(v: string): Json {
  const t = v.trim();
  if (t === '') return null;
  if ((t.startsWith('[') && t.endsWith(']')) || (t.startsWith('{') && t.endsWith('}'))) {
    const flow = tryParseFlow(t);
    if (flow !== undefined) return flow;
  }
  if (t[0] === '"' || t[0] === "'") return unquote(t);
  if (t === 'null' || t === '~' || t === 'Null' || t === 'NULL') return null;
  if (t === 'true' || t === 'True' || t === 'TRUE') return true;
  if (t === 'false' || t === 'False' || t === 'FALSE') return false;
  if (/^[-+]?\d+$/.test(t)) return parseInt(t, 10);
  if (/^[-+]?(\d+\.\d*|\.\d+|\d+)([eE][-+]?\d+)?$/.test(t)) return parseFloat(t);
  return t;
}

const DOUBLE_QUOTE_ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  '0': '\0',
  '"': '"',
  '\\': '\\',
  '/': '/',
  ' ': ' ',
};

function unquote(s: string): string {
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    // Eén pass, zodat "C:\\new" een backslash + "new" blijft en geen newline.
    return s.slice(1, -1).replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (match, esc: string) => {
      if (esc.length > 1) return String.fromCharCode(parseInt(esc.slice(1), 16));
      return DOUBLE_QUOTE_ESCAPES[esc] ?? match;
    });
  }
  if (s.length >= 2 && s[0] === "'" && s[s.length - 1] === "'") {
    return s.slice(1, -1).replace(/''/g, "'");
  }
  return s;
}

// Heel eenvoudige flow-parser voor [a, b] en {k: v}. Best-effort.
function tryParseFlow(t: string): Json | undefined {
  try {
    // Probeer eerst als JSON (dekt {"a":1} en [1,2])
    return JSON.parse(t);
  } catch {
    /* val terug op handmatig */
  }
  if (t.startsWith('[')) {
    const inner = t.slice(1, -1).trim();
    if (inner === '') return [];
    return splitTopLevel(inner, ',').map((x) => parseScalar(x.trim()));
  }
  if (t.startsWith('{')) {
    const inner = t.slice(1, -1).trim();
    if (inner === '') return {};
    const obj: Record<string, Json> = {};
    for (const pair of splitTopLevel(inner, ',')) {
      const idx = pair.indexOf(':');
      if (idx === -1) continue;
      const k = unquote(pair.slice(0, idx).trim());
      obj[k] = parseScalar(pair.slice(idx + 1).trim());
    }
    return obj;
  }
  return undefined;
}

function splitTopLevel(s: string, sep: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  forEachUnquoted(s, (i) => {
    const c = s[i];
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
    else if (c === sep && depth === 0) {
      out.push(s.slice(start, i));
      start = i + 1;
    }
  });
  const last = s.slice(start);
  if (last.trim() !== '') out.push(last);
  return out;
}
