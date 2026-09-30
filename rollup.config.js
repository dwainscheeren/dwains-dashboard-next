import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Stamp the build time on the entry file only, so chunk names stay stable
// between builds of the same source.
const buildStamp = () => {
  return {
    name: 'build-stamp',
    renderChunk(code, chunk) {
      if (!chunk.isEntry) return null;
      const stamp = `/* Dwains Dashboard Next build: ${new Date().toISOString()} */\n`;
      return { code: stamp + code, map: null };
    }
  };
};

const versionStamp = () => {
  return {
    name: 'version-stamp',
    transform(code, id) {
      if (!id.endsWith('/src/version.ts')) return null;
      return {
        code: code.replace('__DD_NEXT_VERSION__', String(pkg.version)),
        map: null
      };
    }
  };
};

// Terser does not touch template literals, so the Lit css`` blocks kept all
// their indentation and comments. Only safe rewrites: drop comments, collapse
// whitespace and remove spaces around { } ; , > and after :.
const minifyCssLiterals = () => {
  return {
    name: 'minify-css-literals',
    transform(code, id) {
      if (!id.includes('/src/') || !/\bcss\s*`/.test(code)) return null;
      // TypeScript emits the tag as "css `...`", with a space.
      const minified = code.replace(/\bcss\s*`([^`]*)`/g, (match, body) => {
        if (body.includes('${')) return match;
        const css = body
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*([{};,>])\s*/g, '$1')
          .replace(/: /g, ':')
          .replace(/;}/g, '}')
          .trim();
        return `css\`${css}\``;
      });
      return { code: minified, map: null };
    }
  };
};

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    // The entry keeps its fixed name for HACS. Editors, dialogs and languages
    // become separate chunks that are only loaded when needed. HACS downloads
    // everything under dist/, subfolders included.
    dir: 'dist',
    entryFileNames: 'dwains-dashboard-next.js',
    chunkFileNames: 'chunks/[name]-[hash].js',
    format: 'es',
    sourcemap: !production
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    versionStamp(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: !production
    }),
    production && minifyCssLiterals(),
    buildStamp(),
    production && terser({
      format: {
        comments: false
      }
    })
  ].filter(Boolean)
};
