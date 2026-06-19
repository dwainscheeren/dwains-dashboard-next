import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

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
