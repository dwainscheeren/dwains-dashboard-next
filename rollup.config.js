import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Simple banner plugin to stamp build time
const buildStamp = () => {
  return {
    name: 'build-stamp',
    renderChunk(code) {
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

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/dwains-dashboard-next.js',
    format: 'es',
    sourcemap: !production,
    inlineDynamicImports: true
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
    buildStamp(),
    production && terser({
      format: {
        comments: false
      }
    })
  ].filter(Boolean)
};
