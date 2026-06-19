/**
 * yaml-mini — compacte, dependency-vrije YAML-parser.
 *
 * Genoeg voor Dwains Dashboard blueprints en Lovelace card-configs:
 *  - geneste mappings (op basis van inspringing)
 *  - sequences ("- item", ook "- key: value")
 *  - block scalars: literal "|" en folded ">", met chomping "-"/"+"
 *  - enkel/dubbel-gequote strings
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

// Verwijder een #-comment buiten quotes.
function stripInlineComment(s: string): string {
  let inS = false;
  let inD = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD) {
      // comment moet voorafgegaan worden door whitespace (of regelbegin)
      if (i === 0 || /\s/.test(s[i - 1]!)) return s.slice(0, i);
    }
  }
  return s;
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

    const after = line.content === '-' ? '' : line.content.slice(2);
    if (after.trim() === '') {
      // Item-inhoud staat op volgende regels
      ctx.i++;
      arr.push(parseBlock(ctx, indent + 1));
      continue;
    }
    // Inline na "- "
    const childIndent = indent + 2; // kolom waar de inhoud begint
    if (isMappingEntry(after)) {
      // "- key: value" => mapping waarvan eerste regel inline staat
      // Herschrijf huidige regel als mapping-regel en parse mapping op childIndent
      ctx.lines[ctx.i] = { indent: childIndent, content: after, raw: line.raw };
      arr.push(parseMapping(ctx, childIndent));
    } else {
      // Plain scalar of block-scalar achter "- ": consumeer eerst deze regel.
      ctx.i++;
      arr.push(parseScalarOrBlock(ctx, after, childIndent));
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
  let inS = false;
  let inD = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === ':' && !inS && !inD) {
      const after = s[i + 1];
      if (after === undefined || after === ' ' || after === '\t') {
        let key = s.slice(0, i).trim();
        key = unquote(key);
        return { key, rest: s.slice(i + 1).trim() };
      }
    }
  }
  return { key: null, rest: '' };
}

// Verwerk een inline waarde die ook een block-scalar (| of >) kan zijn.
function parseScalarOrBlock(
  ctx: { lines: Line[]; i: number },
  value: string,
  childIndent: number
): Json {
  const m = value.match(/^([|>])([+-]?)(\d*)\s*$/);
  if (m) {
    return parseBlockScalar(ctx, m[1] as '|' | '>', m[2] ?? '', childIndent);
  }
  return parseScalar(value);
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
    // folded: join met spatie, behoud lege regels als newline, en
    // meer-ingesprongen regels behouden hun newline
    body = '';
    for (let i = 0; i < collected.length; i++) {
      const c = collected[i]!;
      if (i === 0) {
        body = c.text;
      } else {
        const prev = collected[i - 1]!;
        if (c.blank || prev.blank) body += '\n' + c.text;
        else body += ' ' + c.text;
      }
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

function unquote(s: string): string {
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
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
  let inS = false;
  let inD = false;
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (!inS && !inD) {
      if (c === '[' || c === '{') depth++;
      else if (c === ']' || c === '}') depth--;
      else if (c === sep && depth === 0) {
        out.push(cur);
        cur = '';
        continue;
      }
    }
    cur += c;
  }
  if (cur.trim() !== '') out.push(cur);
  return out;
}
