// import { rollup } from 'rollup';
import { eslint } from 'rollup-plugin-eslint';

import pkg from './package.json';

// patch eslintConfig globals issue with rollup-plugin-eslint
// see: https://github.com/TrySound/rollup-plugin-eslint/issues/29
if (typeof pkg.eslintConfig.globals === 'object') {
  pkg.eslintConfig.globals = Object.keys(pkg.eslintConfig.globals);
}

export default {
  input: './src/index.js',
  output: {
    file: pkg.module,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    eslint(pkg.eslintConfig),
  ],
};
