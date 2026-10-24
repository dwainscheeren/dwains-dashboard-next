/** Keep cache-busted chunks independent of the fixed-name HACS entry. */
export const preventEntryImports = () => ({
  name: 'prevent-entry-imports',
  generateBundle(_options, bundle) {
    const entries = new Set(Object.values(bundle)
      .filter((file) => file.type === 'chunk' && file.isEntry)
      .map((file) => file.fileName));
    for (const file of Object.values(bundle)) {
      if (file.type !== 'chunk' || file.isEntry) continue;
      for (const dependency of [...file.imports, ...file.dynamicImports]) {
        if (entries.has(dependency)) {
          this.error(`${file.fileName} imports fixed-name entry ${dependency}. ` +
            'Keep shared code in hashed chunks to avoid mixing cached releases.');
        }
      }
    }
  },
});
