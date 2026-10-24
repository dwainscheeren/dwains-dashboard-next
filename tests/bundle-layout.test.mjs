import { describe, expect, it } from 'vitest';
import { rollup } from 'rollup';
import { preventEntryImports } from '../scripts/prevent-entry-imports.mjs';

async function build(modules) {
  const bundle = await rollup({
    input: 'entry',
    plugins: [{
      name: 'fixture',
      resolveId: (id) => id,
      load: (id) => modules[id],
    }, preventEntryImports()],
  });
  try {
    return await bundle.generate({
      format: 'es',
      entryFileNames: 'dwains-dashboard-next.js',
      chunkFileNames: 'chunks/[name]-[hash].js',
    });
  } finally {
    await bundle.close();
  }
}

describe('release chunk cache safety', () => {
  it('rejects the shared entry version that caused issue #26', async () => {
    await expect(build({
      entry: 'import { version } from "version"; console.log(version); import("editor");',
      version: 'export const version = "1.12.1";',
      editor: 'import { version } from "version"; console.log(version);',
    })).rejects.toThrow('imports fixed-name entry');
  });

  it('keeps the editor independent while the entry registers without static dependencies', async () => {
    const { output } = await build({
      entry: 'console.log("1.12.2"); import("editor");',
      version: 'export const version = "1.12.2";',
      editor: 'import { version } from "version"; console.log(version);',
    });
    const entry = output.find((file) => file.type === 'chunk' && file.isEntry);
    expect(entry.imports).toEqual([]);
    const editor = output.find((file) => file.type === 'chunk' && !file.isEntry);
    expect(editor.code).toContain('1.12.2');
    expect(editor.imports).toEqual([]);
  });
});
