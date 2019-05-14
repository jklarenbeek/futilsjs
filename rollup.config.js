// import { rollup } from 'rollup';
import { eslint } from 'rollup-plugin-eslint';

import pkg from './package.json';

export default {
  input: './src/index.js',
  output: {
    file: pkg.module,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    eslint(),
  ],
};
